import { Router } from 'express';

import { userRoutes } from './users/routes';
import { todoRoutes } from './todos/routes';
import { createRoutes } from '../common/createRoutes';

export default () => {
  const app = Router();

  createRoutes(app, userRoutes);
  createRoutes(app, todoRoutes);

  return app;
};
