import { inject, injectable, z } from '../../common/types';

import Operation from '../../common/operation';
import logger from '../../infra/loaders/logger';

import { BINDINGS } from '../../common/constants';
import { Todo } from './types';
import useTransaction from '../../common/useTransaction';
import { camelToSnake } from '../../common/utils';


/**
 * @class AddTodos
 *
 * Service class to handle adding todos for a user.
 */
@useTransaction()
@injectable()
export class AddTodo extends Operation {

  /**
   * Validation rules for input data using Zod schema.
   * @type {ZodSchema}
   */
  static validationRules = z.object({
    userId: z.string().uuid().min(1), // user UUID
    content: z.string().min(2).max(200), // each string has a min length of 2 and max of 200
    fileSrc: z.string().min(2).optional(),
    meta: z.object({}).passthrough().optional(), // any metadata assigned
  });

  /**
   * The todos repository instance.
   * @private
   * @type {TodosRepository}
   */
  @inject(BINDINGS.TodosRepository)
  private _todosRepository: any;

  async execute(this: AddTodo, validatedUserData: any): Promise<Todo[]> {
    const { userId, content, fileSrc, meta } = validatedUserData;

    try {
      logger.info(`AddTodos:execute:userId=${userId}:content=${content}`);

      return this._todosRepository.addTodos(userId, [camelToSnake({
        content, 
        fileSrc,
        meta
      })]);
    } catch (error) {
      logger.error(
        `AddTodos:error:${(error as Error).name}:${(error as Error).message}`
      );
      throw error;
    }
  }
}
