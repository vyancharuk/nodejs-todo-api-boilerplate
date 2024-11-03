import { BINDINGS } from '../../common/constants';
import Operation from '../../common/operation';
import { inject, injectable, z } from '../../common/types';
import useTransaction from '../../common/useTransaction';
import { stringifyError } from '../../common/utils';
import logger from '../../infra/loaders/logger';
import { Todo } from './types';

/**
 * @class UpdateExpiredTodo
 *
 * Implements setting expired todos
 */
@useTransaction()
@injectable()
export class UpdateExpiredTodos extends Operation {
  static validationRules = z.object({
    callerId: z.enum(['cron', 'worker']),
  });

  @inject(BINDINGS.TodosRepository)
  private _todosRepository: any;

  async execute(this: UpdateExpiredTodos, validatedUserData: any): Promise<Todo[]> {
    const { callerId } = validatedUserData;

    try {
      logger.info(`UpdateExpiredTodo:callerId=${callerId}`);

      return this._todosRepository.setExpiredTodos();
    } catch (error) {
      logger.error(
        `UpdateExpiredTodo:error:${stringifyError(error)}`
      );
      throw error;
    }
  }
}
