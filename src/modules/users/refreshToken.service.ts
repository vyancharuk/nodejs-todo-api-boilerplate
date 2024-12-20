import { inject, injectable, toCamelCase, z } from '../../common/types';
import Operation from '../../common/operation';
import useRateLimiter from '../../common/useRateLimiter';
import { generateJWT } from './authUtils';
import { BINDINGS } from '../../common/constants';
import appConfig from '../../config/app';
import logger from '../../infra/loaders/logger';
import _ from 'lodash';


/**
 * @class RefreshToken
 * 
 * Handles the refresh token operation, validating the refresh token,
 * retrieving the associated user, and generating a new JWT.
 */
@useRateLimiter('REFRESH_TOKEN_PER_HOUR_BY_IP', {
  points: 5, // 5 calls
  duration: 60 * 60, // per 1 hour
  blockDuration: 60 * 60, // block on 1 hour
})
@injectable()
export class RefreshToken extends Operation {
  static validationRules = z.object({
    refreshToken: z.string().min(1), // Validates as a required string
    clientId: z.string().optional(), // Validates as an optional string
  });

  @inject(BINDINGS.UsersRepository) private _usersRepository: any;

  async execute(validatedUserData: any) {
    let result = { jwt: null };
    const { refreshToken, clientId = appConfig.defaultClientId } =
      validatedUserData;
    if (!refreshToken) {
      throw new Error('EMPTY_REFRESH_TOKEN');
    }

    try {
      // TODO: check for refresh token exp date
      let user = await this._usersRepository.findByRefreshToken(
        refreshToken,
        clientId
      );

      if (user) {
        logger.info(`RefreshToken found user`);

        this._memoryStorage.setValue(user.id, user);

        const jwt = generateJWT(user);

        return {
          user: _.omit(toCamelCase(user), ['password', 'refreshToken']),
          jwt,
        };
      } else {
        logger.warn(`RefreshToken user not found for token ${refreshToken}`);
      }
    } catch (error) {
      logger.error('RefreshToken:error', error);

      if (typeof error === 'string') {
        throw new Error(error);
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred');
      }
    }

    return result;
  }
}

