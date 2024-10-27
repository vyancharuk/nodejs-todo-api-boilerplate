import { inject, injectable, toCamelCase, z } from '../../common/types';
import shortid from 'shortid';
import Operation from '../../common/operation';
import useTransaction from '../../common/useTransaction';
import useRateLimiter from '../../common/useRateLimiter';
import { hashPassword, generateJWT, generateRefreshToken } from './authUtils';
import { BINDINGS } from '../../common/constants';
import appConfig from '../../config/app';
import logger from '../../infra/loaders/logger';
import _ from 'lodash';


/**
 * @class RegisterAnonymousUser
 * 
 * Handles the registration of anonymous users by creating a new user account with a generated username and password.
 * Generates JWT and refresh tokens, stores the user session in memory, and manages token expiration.
 */
@useTransaction()
@useRateLimiter('CREATE_USER_PER_HOUR_BY_IP', {
  points: 5, // 5 calls
  duration: 60 * 60, // per 1 hour
  blockDuration: 60 * 60, // block on 1 hour
})
@injectable()
export class RegisterAnonymousUser extends Operation {
  static validationRules = z.object({
    clientId: z.string().max(200).optional(), // Validates as an optional string
  });

  @inject(BINDINGS.UsersRepository)
  private _usersRepository: any;

  async execute(validatedUserData: any) {
    const { clientId = appConfig.defaultClientId } = validatedUserData;

    const expires = new Date(
      Date.now() + appConfig.refreshTokenDuration * 1000
    );

    logger.info('RegisterAnonymousUser validatedUserData=', validatedUserData);

    let user;
    const generated = shortid.generate();
    const password = hashPassword(generated);
    const userName = `user_${generated}`;
    const refreshToken = generateRefreshToken();

    try {
      user = await this._usersRepository.createUserWithToken(
        {
          userName,
          password,
          refreshToken,
          role: 'anonym',
        },
        expires,
        clientId
      );

      this._memoryStorage.setValue(user.id, user);

      logger.info('RegisterAnonymousUser created');

      const jwt = generateJWT(user);

      return { user: _.omit(toCamelCase(user), 'password'), jwt, refreshToken };
    } catch (error) {
      logger.error('RegisterAnonymousUser:error', error);

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

