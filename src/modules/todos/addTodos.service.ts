import { inject, injectable, z } from '../../common/types';

import Operation from '../../common/operation';
import logger from '../../infra/loaders/logger';

import { BINDINGS } from '../../common/constants';
import { Todo } from './types';
import useTransaction from '../../common/useTransaction';

@useTransaction()
@injectable()
class AddTodos extends Operation {
  static validationRules = z.object({
    userId: z.string().uuid().min(1), // UUID and required
    todos: z.array(z.string().min(2).max(200)).min(1), // array with at least one string, each string has a min length of 2 and max of 200
  });

  @inject(BINDINGS.TodosRepository)
  private _todosRepository: any;

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

export default AddTodos;
