import { BINDINGS } from '../../common/constants';
import Operation from '../../common/operation';
import { inject, injectable, z } from '../../common/types';
import useTransaction from '../../common/useTransaction';
import logger from '../../infra/loaders/logger';
import { Todo } from './types';

@useTransaction()
@injectable()
class RemoveTodo extends Operation {
  static validationRules = z.object({
    userId: z.string().uuid().min(1), // Validates as a required UUID string
    todoId: z.string().uuid().min(1), // Validates as a required UUID string
  });

  @inject(BINDINGS.TodosRepository)
  private _todosRepository: any;

  async execute(this: RemoveTodo, validatedUserData: any): Promise<Todo[]> {
    const { userId, todoId } = validatedUserData;

    try {
      logger.info(`RemoveTodo:todoId=${todoId}`);

      return this._todosRepository.removeTodo(todoId, userId);
    } catch (error) {
      logger.error(
        `RemoveTodo:error:${(error as Error).name}:${(error as Error).message}`
      );
      throw error;
    }
  }
}

export default RemoveTodo;
