import { Router } from 'express';

import todosController from './controllers';
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
  app.use('/todos', route);

  route.get('/my', isAuth, attachCurrentUser, todosController.getUserTodos);

  route.get(
    '/',
    isAuth,
    attachCurrentUser,
    checkRole(UserRoles.Admin),
    todosController.getAllTodos
  );

  route.post('/add', isAuth, attachCurrentUser, todosController.addTodos);
  route.put('/:id', isAuth, attachCurrentUser, todosController.updateTodo);
  route.delete('/:id', isAuth, attachCurrentUser, todosController.removeTodo);
};
