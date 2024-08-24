import _ from 'lodash';
import { inject, injectable, toCamelCase, z } from '../../common/types';
import Operation from '../../common/operation';
import useRateLimiter from '../../common/useRateLimiter';
import { hashPassword, generateJWT, generateRefreshToken } from './authUtils';
import { BINDINGS } from '../../common/constants';
import logger from '../../infra/loaders/logger';
import appConfig from '../../config/app';

@useRateLimiter('LOGIN_USER_PER_HOUR_BY_IP', {
  points: 5, // 5 calls
  duration: 60 * 60, // per 1 hour
  blockDuration: 60 * 60, // block on 1 hour
})
@injectable()
class LoginUser extends Operation {
  static validationRules = z.object({
    password: z.string().max(100).min(1), // Required string with a maximum length of 100
    username: z.string().max(100).optional(), // Optional string with a maximum length of 100
    email: z.string().max(100).optional(), // Optional string with a maximum length of 100
  });

  @inject(BINDINGS.UsersRepository)
  private _usersRepository: any;

  async execute(validatedUserData: any) {
    let result = { jwt: null };
    const {
      password,
      username: userName,
      email,
      clientId = appConfig.defaultClientId,
    } = validatedUserData;

    const expires = new Date(
      Date.now() + appConfig.refreshTokenDuration * 1000
    );

    try {
      let user = userName
        ? await this._usersRepository.findByName(userName)
        : await this._usersRepository.findByEmail(email);

      if (user && hashPassword(password) === user.password) {
        const jwt = generateJWT(user);
        const refreshToken = generateRefreshToken();

        await this._usersRepository.upsertUserRefreshToken(
          user.id,
          refreshToken,
          expires,
          clientId
        );

        this._memoryStorage.setValue(user.id, user);

        return {
          user: _.omit(toCamelCase(user), 'password'),
          jwt,
          refreshToken,
        };
      }
    } catch (error) {
      logger.error('LoginUser:error', error);

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

export default LoginUser;
