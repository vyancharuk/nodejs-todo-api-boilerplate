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
      throw new Error(error);
    }
  }
}

export default GetUsers;
