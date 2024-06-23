import { inject, injectable } from '../../common/types';

import Operation from '../../common/operation';
import logger from '../../infra/loaders/logger';

import { BINDINGS } from '../../common/constants';

@injectable()
class GetUsers extends Operation {
  @inject(BINDINGS.UsersRepository)
  private _usersRepository: any;

  async execute() {
    try {
      logger.info(`GetUsers:execute`);

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

export default GetUsers;
