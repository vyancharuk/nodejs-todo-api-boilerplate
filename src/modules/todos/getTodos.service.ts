import { inject, injectable, Joi } from '../../common/types';

import Operation from '../../common/operation';
import logger from '../../infra/loaders/logger';

import { BINDINGS } from '../../common/constants';
import { Todo } from './types';

@injectable()
class GetTodos extends Operation {
  static validationRules = {
    search: Joi.string().max(50).allow('', null).alphanum(),
    pageSize: Joi.number().integer().min(1).max(100),
    pageInd: Joi.number().integer().min(0).max(10000),
  };

  @inject(BINDINGS.TodosRepository)
  private _todosRepository: any;

  async execute(this: GetTodos, validatedUserData: any): Promise<Todo[]> {
    const { pageSize = 100, pageInd = 0, search = '' } = validatedUserData;

    try {
      logger.info(`GetTodos:execute`);

      return this._todosRepository.findAll(pageInd, pageSize, search);
    } catch (error) {
      logger.error('GetTodos:error', error);
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

export default GetTodos;
