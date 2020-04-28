import { Router } from 'express';
import { isAuth, attachCurrentUser, checkRole } from '../infra/middlewares';

import userRoutes from './users/routes';
import todos from './todos/routes';

// guaranteed to get dependencies
export default () => {
  const app = Router();

  userRoutes(app, { isAuth, attachCurrentUser, checkRole });
  todos(app, { isAuth, attachCurrentUser, checkRole });

  return app;
};
