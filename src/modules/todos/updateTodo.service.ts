import { BINDINGS } from '../../common/constants';
import Operation from '../../common/operation';
import { inject, injectable, z } from '../../common/types';
import useTransaction from '../../common/useTransaction';
import logger from '../../infra/loaders/logger';
import { Todo } from './types';

@useTransaction()
@injectable()
class UpdateTodo extends Operation {
  static validationRules = z.object({
    userId: z.string().uuid().min(1), // Validates as a required UUID string
    todoId: z.string().uuid().min(1), // Validates as a required UUID string
    content: z.string().min(2).max(200), // String between 2 and 200 characters, required by default
  });

  @inject(BINDINGS.TodosRepository)
  private _todosRepository: any;

  async execute(this: UpdateTodo, validatedUserData: any): Promise<Todo[]> {
    const { userId, todoId, content } = validatedUserData;

    try {
      logger.info(`UpdateTodo:todoId=${todoId}:content=${content}`);

      return this._todosRepository.updateTodo(todoId, userId, content);
    } catch (error) {
      logger.error(
        `UpdateTodo:error:${(error as Error).name}:${(error as Error).message}`
      );
      throw error;
    }
  }
}

export default UpdateTodo;
