import { inject, injectable, Joi, toCamelCase } from '../../common/types';

import Operation from '../../common/operation';
import logger from '../../infra/loaders/logger';
import { BINDINGS } from '../../common/constants';
import _ from 'lodash';

@injectable()
class GetUser extends Operation {
  static validationRules = {
    userId: Joi.string().uuid()
  };

  @inject(BINDINGS.UsersRepository)
  private _usersRepository: any;

  async execute(this: GetUser, validatedUserData: any) {
    const { userId } = validatedUserData;

    try {
      logger.info(`GetUser:execute:userId=${userId}`);

      const user = await this._usersRepository.findById(userId);

      return _.omit(toCamelCase(user), ['password']);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default GetUser;
