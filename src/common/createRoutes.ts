import { Router, RouteConfig } from './types';

/**
 * Creates and registers routes with the Express application based on the provided configuration.
 *
 * @param {Router} app - The main Express application instance.
 * @param {Record<string, RouteConfig>} routes - An object mapping route identifiers to their configurations.
 *
 * @example
 * ```typescript
 * const app = express();
 * const routes = {
 *   getUser: {
 *     method: 'GET',
 *     path: '/user/:id',
 *     middlewares: [authenticate],
 *     handler: getUserHandler,
 *   },
 *   createUser: {
 *     method: 'POST',
 *     path: '/user',
 *     middlewares: [validateUserData],
 *     handler: createUserHandler,
 *   },
 * };
 *
 * createRoutes(app, routes);
 * ```
 */
export const createRoutes = (app: Router, routes: Record<string, RouteConfig>) => {
  const router = Router();

  /**
   * Iterates over each route in the routes config object and registers it with the Express router.
   */
  Object.values(routes).forEach((route) => {
    // Dynamically register the route based on the HTTP method
    (router as any)[route.method.toLowerCase()](
      route.path,
      ...(route.middlewares || []),
      route.handler
    );
  });

  // Integrate the configured router into the main application
  app.use(router);
};