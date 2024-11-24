import { BINDINGS } from '../../common/constants';
import Operation from '../../common/operation';
import { inject, injectable, z } from '../../common/types';
import useTransaction from '../../common/useTransaction';
import { camelToSnake, snakeToCamel } from '../../common/utils';
import logger from '../../infra/loaders/logger';
import { Todo } from './types';

/**
 * @class UpdateTodo
 *
 * Implements updating todo properties
 */
@useTransaction()
@injectable()
export class UpdateTodo extends Operation {
  static validationRules = z.object({
    userId: z.string().uuid().min(1), // Validates as a required UUID string
    todoId: z.string().uuid().min(1), // Validates as a required UUID string
    content: z.string().min(2).max(200), // String between 2 and 200 characters, required by default
    fileSrc: z.string().min(2).optional(),
    expiresAt: z.string().optional(), 
  });

  @inject(BINDINGS.TodosRepository)
  private _todosRepository: any;

  async execute(this: UpdateTodo, validatedUserData: any): Promise<Todo[]> {
    const { userId, todoId, content, fileSrc, expiresAt } = validatedUserData;

    try {
      logger.info(
        `UpdateTodo:todoId=${todoId}:content=${content}:fileSrc=${fileSrc}:expiresAt=${expiresAt}`
      );

      const updatedTodos = await this._todosRepository.updateTodo(
        todoId,
        userId,
        camelToSnake({ content, fileSrc, expiresAt })
      );

      return snakeToCamel(updatedTodos[0]);
    } catch (error) {
      logger.error(
        `UpdateTodo:error:${(error as Error).name}:${(error as Error).message}`
      );
      throw error;
    }
  }
}
