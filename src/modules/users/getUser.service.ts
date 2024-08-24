import _ from 'lodash';

import { inject, injectable, z, toCamelCase } from '../../common/types';

import Operation from '../../common/operation';
import logger from '../../infra/loaders/logger';
import { BINDINGS } from '../../common/constants';

@injectable()
class GetUser extends Operation {
  static validationRules = z.object({
    userId: z.string().uuid(), // validate UUID
    email: z.string().min(3).optional(), // string with minimum length of 3
  });

  @inject(BINDINGS.UsersRepository)
  private _usersRepository: any;

  async execute(this: GetUser, validatedUserData: any) {
    const { userId, email } = validatedUserData;

    try {
      logger.info(`GetUser:execute:userId=${userId}:email=${email}`);
      let user;
      if (email) {
        user = await this._usersRepository.findById(email);
      } else {
        user = await this._usersRepository.findById(userId);
      }

      return _.omit(toCamelCase(user), ['password']);
    } catch (error) {
      logger.error('GetUser:error', error);

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

export default GetUser;
