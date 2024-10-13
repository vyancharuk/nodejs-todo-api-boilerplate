import { inject, injectable, z } from '../../common/types';

import Operation from '../../common/operation';
import logger from '../../infra/loaders/logger';

import { BINDINGS } from '../../common/constants';
import { Todo } from './types';
import useTransaction from '../../common/useTransaction';


/**
 * @class AddTodos
 *
 * Service class to handle adding todos for a user.
 */
@useTransaction()
@injectable()
export class AddTodos extends Operation {

  /**
   * Validation rules for input data using Zod schema.
   * @type {ZodSchema}
   */
  static validationRules = z.object({
    userId: z.string().uuid().min(1), // UUID and required
    todos: z.array(z.string().min(2).max(200)).min(1), // array with at least one string, each string has a min length of 2 and max of 200
  });

  /**
   * The todos repository instance.
   * @private
   * @type {TodosRepository}
   */
  @inject(BINDINGS.TodosRepository)
  private _todosRepository: any;

  /**
   * Executes the operation to add todos.
   * @param {Object} validatedUserData - The validated user data.
   * @param {string} validatedUserData.userId - The ID of the user.
   * @param {string[]} validatedUserData.todos - An array of todo descriptions.
   * @returns {Promise<Todo[]>} - A promise that resolves to an array of added todos.
   */
  async execute(this: AddTodos, validatedUserData: any): Promise<Todo[]> {
    const { userId, todos } = validatedUserData;

    try {
      logger.info(`AddTodos:execute:userId=${userId}:todos=${JSON.stringify(todos)}`);

      return this._todosRepository.addTodos(userId, todos);
    } catch (error) {
      logger.error(
        `AddTodos:error:${(error as Error).name}:${(error as Error).message}`
      );
      throw error;
    }
  }
}
