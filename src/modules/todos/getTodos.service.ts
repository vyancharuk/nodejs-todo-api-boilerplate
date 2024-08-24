import { inject, injectable, z } from '../../common/types';

import Operation from '../../common/operation';
import logger from '../../infra/loaders/logger';

import { BINDINGS } from '../../common/constants';
import { Todo } from './types';

@injectable()
class GetTodos extends Operation {
  static validationRules = z.object({
    search: z
      .string()
      .max(50)
      .optional()
      .or(z.literal('').or(z.null()))
      .refine((val) => /^[a-zA-Z0-9]*$/.test(val || ''), {
        message: 'Must be alphanumeric',
      }), // Allows empty string, null, and only alphanumeric characters
    pageSize: z.number().int().min(1).max(100).optional(), // Integer between 1 and 100
    pageInd: z.number().int().min(0).max(10000).optional(), // Integer between 0 and 10000
  });

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
