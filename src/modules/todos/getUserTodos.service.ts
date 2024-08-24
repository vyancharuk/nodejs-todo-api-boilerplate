import { inject, injectable, toCamelCase, z } from '../../common/types';

import Operation from '../../common/operation';
import logger from '../../infra/loaders/logger';

import { BINDINGS } from '../../common/constants';
import { Todo } from './types';

@injectable()
class GetUserTodos extends Operation {
  static validationRules = z.object({
    userId: z.string().uuid().min(1), // UUID and required (nonempty)
    search: z
      .string()
      .max(50)
      .optional()
      .or(z.literal('').or(z.null()))
      .refine((val) => /^[a-zA-Z0-9]*$/.test(val || ""), {
        message: 'Must be alphanumeric',
      }), // Allows empty string, null, and alphanumeric
    pageSize: z.number().int().min(1).max(100).optional(), // Integer between 1 and 100
    pageInd: z.number().int().min(0).max(10000).optional(), // Integer between 0 and 10000
  });

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
