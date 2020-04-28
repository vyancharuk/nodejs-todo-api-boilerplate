import { inject, injectable, Joi, toCamelCase } from '../../common/types';
import Operation from '../../common/operation';
import useRateLimiter from '../../common/useRateLimiter';
import { generateJWT } from './authUtils';
import { BINDINGS } from '../../common/constants';
import appConfig from '../../config/app';
import logger from '../../infra/loaders/logger';
import _ from 'lodash';

@useRateLimiter('REFRESH_TOKEN_PER_HOUR_BY_IP', {
  points: 5, // 5 calls
  duration: 60 * 60, // per 1 hour
  blockDuration: 60 * 60, // block on 1 hour
})
@injectable()
class RefreshJWTToken extends Operation {
  static validationRules = {
    refreshToken: Joi.string().required(),
    clientId: Joi.string(),
  };

  @inject(BINDINGS.UsersRepository) private _usersRepository: any;

  async execute(validatedUserData: any) {
    let result = { jwt: null };
    const {
      refreshToken,
      clientId = appConfig.defaultClientId,
    } = validatedUserData;
    if (!refreshToken) {
      throw new Error('EMPTY_REFRESH_TOKEN');
    }

    try {
      // TODO: check for refresh token exp date
      let user = await this._usersRepository.findByRefreshToken(
        refreshToken,
        clientId
      );

      // TODO check expires date for refresh token
      if (user) {
        logger.info(`RefreshJWTToken found user`);

        this._memoryStorage.setValue(user.id, user);

        const jwt = generateJWT(user);

        return {
          user: _.omit(toCamelCase(user), ['password', 'refreshToken']),
          jwt,
        };
      } else {
        logger.warn(`RefreshJWTToken user not found for token ${refreshToken}`);
      }
    } catch (error) {
      throw new Error(error);
    }

    return result;
  }
}

export default RefreshJWTToken;
