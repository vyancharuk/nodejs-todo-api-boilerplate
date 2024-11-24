import { createController } from '../../common/createController';
import { Request } from '../../common/types';

import { GetAllTodos } from './getAllTodos.service';
import { GetUserTodos } from './getUserTodos.service';
import { AddTodo } from './addTodo.service';
import { UpdateTodo } from './updateTodo.service';
import { RemoveTodo } from './removeTodo.service';


/**
 * @module TodosController
 *
 * Controller for handling Todo-related operations
 */
export const todoController = {
  /**
   * Retrieves all todos with optional search and pagination.
   *
   * @param {Request} req - The HTTP request object.
   * @returns {Promise<Array<Todo>>} A promise that resolves to an array of todos.
   */
  getAllTodos: createController(GetAllTodos, (req: Request) => ({
    search: req.query.search,
    pageSize: req.query.pageSize,
    pageInd: req.query.pageInd,
  })),

  /**
   * Retrieves todos for a specific user with optional search and pagination.
   *
   * @param {Request} req - The HTTP request object.
   * @returns {Promise<Array<Todo>>} A promise that resolves to an array of the user's todos.
   */
  getUserTodos: createController(GetUserTodos, (req: Request) => ({
    userId: req['currentUser'].id,
    search: req.query.search,
    pageSize: req.query.pageSize,
    pageInd: req.query.pageInd,
  })),

  /**
   * Adds new todos for the authenticated user.
   *
   * @param {Request} req - The HTTP request object.
   * @returns {Promise<Todo[]>} A promise that resolves to the added todos.
   */
  addTodos: createController(AddTodo, (req: Request) => ({
    userId: req['currentUser'].id,
    content: req.body.content,
    fileSrc: req.body.fileSrc,
    expiresAt: req.body.expiresAt,
  })),

  /**
   * Updates the content of an existing todo.
   *
   * @param {Request} req - The HTTP request object.
   * @returns {Promise<Todo>} A promise that resolves to the updated todo.
   */
  updateTodo: createController(UpdateTodo, (req: Request) => ({
    userId: req['currentUser'].id,
    todoId: req.params.id,
    content: req.body.content,
    fileSrc: req.body.fileSrc,
    expiresAt: req.body.expiresAt,
  })),

  /**
   * Removes a todo by its ID for the authenticated user.
   *
   * @param {Request} req - The HTTP request object.
   * @returns {Promise<void>} A promise that resolves when the todo is removed.
   */
  removeTodo: createController(RemoveTodo, (req: Request) => ({
    userId: req['currentUser'].id,
    todoId: req.params.id,
  })),
};
