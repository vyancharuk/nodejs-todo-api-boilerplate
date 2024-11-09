import { todoController } from './controllers';
import { UserRoles } from '../../common/types';
import { isAuth, attachCurrentUser, checkRole } from '../../infra/middlewares';

/**
 * Represents a configuration for an Express.js route.
 *
 * @typedef {Object} RouteConfig
 * @property {string} method - The HTTP method (GET, POST, PUT, DELETE, etc.).
 * @property {string} path - The route path.
 * @property {function(Request, Response, NextFunction): void | Promise<void>} handler - The route handler function.
 * @property {Array<function(Request, Response, NextFunction): void | Promise<void>>} [middlewares] - An array of middleware functions for the route.
 */

/**
 * Represents a collection of Express.js routes.
 *
 * @typedef {Record<string, RouteConfig>} TodoRoutes
 */

/**
 * Sets up the TODO routes.
 *
 * @type {TodoRoutes}
 */
export const todoRoutes = {
  /**
   * Retrieves todos for the current authenticated user.
   *
   * @type {RouteConfig}
   */
  getUserTodos: {
    method: 'GET',
    path: '/todos/my',
    handler: todoController.getUserTodos,
    middlewares: [isAuth, attachCurrentUser],
  },

  /**
   * Retrieves all todos (Admin only).
   * 
   * @type {RouteConfig}
   */
  getAllTodos: {
    method: 'GET',
    path: '/todos/',
    handler: todoController.getAllTodos,
    middlewares: [isAuth, attachCurrentUser, checkRole(UserRoles.Admin)],
  },

  /**
   * Adds new todos for the current authenticated user.
   * 
   * @type {RouteConfig}
   */
  addTodos: {
    method: 'POST',
    path: '/todos',
    handler: todoController.addTodos,
    middlewares: [isAuth, attachCurrentUser],
  },

  /**
   * Updates a todo item for the current authenticated user.
   * 
   * @type {RouteConfig}
   */
  updateTodo: {
    method: 'PUT',
    path: '/todos/:id',
    handler: todoController.updateTodo,
    middlewares: [isAuth, attachCurrentUser],
  },

  /**
   * Removes a todo item for the current authenticated user.
   * 
   * @type {RouteConfig}
   */
  removeTodo: {
    method: 'DELETE',
    path: '/todos/:id',
    handler: todoController.removeTodo,
    middlewares: [isAuth, attachCurrentUser],
  },
};
