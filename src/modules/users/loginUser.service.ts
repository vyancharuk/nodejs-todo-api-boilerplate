import { inject, injectable, Joi, toCamelCase } from '../../common/types';
import Operation from '../../common/operation';
import useRateLimiter from '../../common/useRateLimiter';
import { hashPassword, generateJWT, generateRefreshToken } from './authUtils';
import { BINDINGS } from '../../common/constants';
import _ from 'lodash';
import appConfig from '../../config/app';

@useRateLimiter('LOGIN_USER_PER_HOUR_BY_IP', {
  points: 5, // 5 calls
  duration: 60 * 60, // per 1 hour
  blockDuration: 60 * 60, // block on 1 hour
})
@injectable()
class LoginUser extends Operation {
  static validationRules = {
    password: Joi.string().max(100).required(),
    username: Joi.string().max(100),
    email: Joi.string().max(100),
  };

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
      throw new Error(error);
    }

    return result;
  }
}

export default LoginUser;
