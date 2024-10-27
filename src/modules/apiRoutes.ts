import { Router } from 'express';

import { userRoutes } from './users/routes';
import { todoRoutes } from './todos/routes';
import { createRoutes } from '../common/createRoutes';

/**
 *
 * Configures and registers all API routes for the application, including user and todo routes.
 */
export default function initializeModuleRoutes() {
  const app = Router();

  createRoutes(app, userRoutes);
  createRoutes(app, todoRoutes);

  return app;
};
