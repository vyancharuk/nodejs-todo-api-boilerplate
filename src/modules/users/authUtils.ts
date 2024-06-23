import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
// import argon2 from 'argon2';
import crypto from 'crypto';
import appConfig from '../../config/app';
import { User } from './types';

const generateJWT = (
  user: User,
  clientId: string = appConfig.defaultClientId
) => {
  // TODO: switch to assymetric alg which uses RSA encryption
  // by default it uses symmetric alg HMAC
  return jwt.sign(
    {
      id: user.id, // We are gonna use this in the middleware 'isAuth'
      name: user.user_name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + appConfig.jwtDuration,
      roles: user.role,
    },
    appConfig.jwtSecret,
    { audience: clientId }
  );
};

const generateRefreshToken = () => {
  const refreshToken = nanoid();

  return refreshToken;
};

const hashPassword = (password: string) => {
  return (
    crypto
      .createHash('md5')
      // .update(text, 'utf-8')
      .update(password)
      .digest('hex')
  );
};
export { generateJWT, generateRefreshToken, hashPassword };
