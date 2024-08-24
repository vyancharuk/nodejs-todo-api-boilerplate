import _ from 'lodash';

import { inject, injectable, z } from '../../common/types';
import Operation from '../../common/operation';
import useRateLimiter from '../../common/useRateLimiter';
import { BINDINGS } from '../../common/constants';
import logger from '../../infra/loaders/logger';

@useRateLimiter('LOGOUT_USER_PER_HOUR_BY_IP', {
  points: 5, // 5 calls
  duration: 60 * 60, // per 1 hour
  blockDuration: 60 * 60, // block on 1 hour
})
@injectable()
class LogoutUser extends Operation {
  static validationRules = z.object({
    userId: z.string().uuid().min(1), // Validates as a required UUID string
    jwt: z.string(), // Validates as a required string
  });

  @inject(BINDINGS.UsersRepository)
  private _usersRepository: any;

  async execute(validatedUserData: any) {
    const { userId, jwt } = validatedUserData;

    try {
      const jwtSign = jwt.split('.')[2];
      const deletedTokensCount =
        await this._usersRepository.delRefreshTokenForUser(userId);

      // clear userId - user map
      await this._memoryStorage.delValue(userId);
      await this._memoryStorage.setValue(jwtSign, true);

      return { deletedTokensCount };
    } catch (error) {
      logger.error('LogoutUser:error', error);

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

export default LogoutUser;
