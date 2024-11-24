import { inject, injectable, z } from '../../common/types';

import Operation from '../../common/operation';
import logger from '../../infra/loaders/logger';

import { BINDINGS } from '../../common/constants';

/**
 * @class GetUsers
 * 
 * Handles the operation of retrieving all available users.
 */
@injectable()
export class GetUsers extends Operation {
  static validationRules = z.object({
    userId: z.string().uuid(), // validate UUID
  });

  @inject(BINDINGS.UsersRepository)
  private _usersRepository: any;

  async execute(validatedUserData) {
    const { userId } = validatedUserData;
    try {
      logger.info(`GetUsers:execute:userId=${userId}`);

      return this._usersRepository.findAll();
    } catch (error) {
      logger.error('GetUsers:error', error);

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

