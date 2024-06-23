import { inject, injectable, toCamelCase } from '../../common/types';

import Operation from '../../common/operation';
import logger from '../../infra/loaders/logger';

import { BINDINGS } from '../../common/constants';
import { Joi } from '../../common/types';
import { Todo } from './types';

@injectable()
class GetUserTodos extends Operation {
  static validationRules = {
    userId: Joi.string().uuid().required(),
    search: Joi.string().max(50).allow('', null).alphanum(),
    pageSize: Joi.number().integer().min(1).max(100),
    pageInd: Joi.number().integer().min(0).max(10000),
  };

  @inject(BINDINGS.TodosRepository)
  private _todosRepository: any;

  async execute(this: GetUserTodos, validatedUserData: any): Promise<Todo[]> {
    const {
      userId,
      pageSize = 100,
      pageInd = 0,
      search = '',
    } = validatedUserData;
    try {
      logger.info(`GetUserTodos:execute userId=${userId}`);

      const todos =
        (await this._todosRepository.findUserTodos(
          userId,
          pageInd,
          pageSize,
          search
        )) || [];

      return todos.map((t) => toCamelCase(t));
    } catch (error) {
      logger.error('GetUserTodos:error', error);
      if (typeof error === 'string') {
        throw new Error(error);
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  }
}

export default GetUserTodos;
