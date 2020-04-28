import { Router } from 'express';
import usersController from './controllers';
import { MiddlewareFn, UserRoles } from '../../common/types';

const route = Router();

export default (
  app: Router,
  {
    isAuth,
    attachCurrentUser,
    checkRole,
  }: {
    isAuth: MiddlewareFn;
    attachCurrentUser: MiddlewareFn;
    checkRole: (roleBits: number, errorMsg?: string) => MiddlewareFn;
  }
) => {
  app.use('/users', route);

  // TODO: public routes - need to protect them by rate limiter
  app.post('/signup', usersController.registerAnonymous);
  app.post('/signin', usersController.loginUser);
  app.post('/jwt/refresh', usersController.refreshToken);
  app.post('/signout', isAuth, attachCurrentUser, usersController.logoutUser);

  // allows viewing all users only for admin
  route.get(
    '/',
    isAuth,
    attachCurrentUser,
    checkRole(UserRoles.Admin),
    usersController.getUsers
  );

  route.get('/me', isAuth, attachCurrentUser, usersController.getUser);
};
