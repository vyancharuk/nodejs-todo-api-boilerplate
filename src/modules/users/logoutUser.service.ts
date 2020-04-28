import { inject, injectable, Joi } from '../../common/types';
import Operation from '../../common/operation';
import useRateLimiter from '../../common/useRateLimiter';
import { BINDINGS } from '../../common/constants';
import _ from 'lodash';

@useRateLimiter('LOGOUT_USER_PER_HOUR_BY_IP', {
  points: 5, // 5 calls
  duration: 60 * 60, // per 1 hour
  blockDuration: 60 * 60, // block on 1 hour
})
@injectable()
class LogoutUser extends Operation {
  static validationRules = {
    userId: Joi.string().uuid().required(),
    jwt: Joi.string().required(),
  };

  @inject(BINDINGS.UsersRepository)
  private _usersRepository: any;

  async execute(validatedUserData: any) {
    const { userId, jwt } = validatedUserData;

    try {
      const jwtSign = jwt.split('.')[2];
      const deletedTokensCount = await this._usersRepository.delRefreshTokenForUser(
        userId
      );

      // clear userId - user map
      await this._memoryStorage.delValue(userId);
      await this._memoryStorage.setValue(jwtSign, true);

      return { deletedTokensCount };
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default LogoutUser;
