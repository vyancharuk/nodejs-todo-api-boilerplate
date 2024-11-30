import { CustomError, inject, injectable, z } from '../../common/types';
import Operation from '../../common/operation';
import logger from '../../infra/loaders/logger';
import { BINDINGS } from '../../common/constants';
import { Todo } from './types';
import { HTTP_STATUS } from '../../common/types';

@injectable()
export class GetTodoById extends Operation {
  static validationRules = z.object({
    todoId: z.string().uuid().min(1),
  });

  @inject(BINDINGS.TodosRepository)
  private _todosRepository: any;

  async execute(validatedData: any): Promise<Todo> {
    const { todoId } = validatedData;

    try {
      logger.info(`GetTodoById:execute:todoId=${todoId}`);
      const todo = await this._todosRepository.findById(todoId);
      if (!todo) {
        // use CustomError to pass HTTP status
        throw new CustomError(HTTP_STATUS.NOT_FOUND, 'NotFoundError', 'Todo not found');
      }
      return todo;
    } catch (error) {
      logger.error('GetTodoById:error', error);
      throw error;
    }
  }
}