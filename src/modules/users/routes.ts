import { usersController } from './controllers';
import { UserRoles } from '../../common/types';

import { isAuth, attachCurrentUser, checkRole } from '../../infra/middlewares';

/**
 * @typedef {Object} RouteConfig
 * @property {'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD'} method - The HTTP method (GET, POST, PUT, DELETE, etc.).
 * @property {string} path - The route path (e.g., '/todos/my').
 * @property {function(Request, Response, NextFunction): void | Promise<void>} handler - The route handler function.
 * @property {Array<function(Request, Response, NextFunction): void | Promise<void>>} [middlewares] - An array of middleware functions for the route.
 */

/**
 * Collection of user routes.
 *
 * @typedef {Object} UserRoutes
 * @property {RouteConfig} signup - Route for user signup.
 * @property {RouteConfig} signin - Route for user signin.
 * @property {RouteConfig} refreshToken - Route for refreshing JWT tokens.
 * @property {RouteConfig} signout - Route for user signout.
 * @property {RouteConfig} getUsers - Route for retrieving all users (admin only).
 * @property {RouteConfig} getUser - Route for retrieving the current authenticated user.
 */

/**
 * List of user routes.
 *
 * @type {UserRoutes}
 */
export const userRoutes = {
  /**
   * Route for user signup - register and return tokens for a new anonymous user.
   *
   * @type {RouteConfig}
   */
  signup: {
    method: 'POST',
    path: '/signup',
    handler: usersController.registerAnonymous,
    // No middlewares for public signup
  },

  /**
   * Route for user signin - authenticates a user and logs them in
   *
   * @type {RouteConfig}
   */
  signin: {
    method: 'POST',
    path: '/signin',
    handler: usersController.loginUser,
    // No middlewares for public signin
  },

  /**
   * Route for refreshing JWT tokens - refreshes JWT tokens for authenticated users
   *
   * @type {RouteConfig}
   */
  refreshToken: {
    method: 'POST',
    path: '/jwt/refresh',
    handler: usersController.refreshToken,
    // No middlewares for public token refresh
  },

  /**
   * Route for user signout - logs out the current authenticated user.
   *
   * @type {RouteConfig}
   */
  signout: {
    method: 'POST',
    path: '/signout',
    handler: usersController.logoutUser,
    middlewares: [isAuth, attachCurrentUser],
  },

  /**
   * Route for retrieving all users (admin only) - retrieves a list of all users. Accessible only by admins.
   *
   * @type {RouteConfig}
   */
  getUsers: {
    method: 'GET',
    path: '/users/',
    handler: usersController.getUsers,
    middlewares: [isAuth, attachCurrentUser, checkRole(UserRoles.Admin)],
  },

  /**
   * Route for retrieving info of the current user - retrieves the profile of the current authenticated user.
   *
   * @type {RouteConfig}
   */
  getUser: {
    method: 'GET',
    path: '/users/me',
    handler: usersController.getUser,
    middlewares: [isAuth, attachCurrentUser],
  },
};