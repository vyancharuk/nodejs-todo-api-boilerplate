import { inject, injectable, Joi } from '../../common/types';

import Operation from '../../common/operation';
import logger from '../../infra/loaders/logger';

import { BINDINGS } from '../../common/constants';
import { Todo } from './types';
import useTransaction from '../../common/useTransaction';

@useTransaction()
@injectable()
class AddTodos extends Operation {
  static validationRules = {
    userId: Joi.string().uuid().required(),
    todos: Joi.array().min(1).items(Joi.string().min(2).max(200)).required(),
  };

  @inject(BINDINGS.TodosRepository)
  private _todosRepository: any;

  async execute(this: AddTodos, validatedUserData: any): Promise<Todo[]> {
    const { userId, todos } = validatedUserData;

    try {
      logger.info(`AddTodos:execute`);

      return this._todosRepository.addTodos(userId, todos);
    } catch (error) {
      logger.error(`AddTodos:error:${(error as Error).name}:${(error as Error).message}`);
      throw error;
    }
  }
}

export default AddTodos;
