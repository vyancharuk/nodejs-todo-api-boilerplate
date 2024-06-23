import { expressjwt as jwt }  from 'express-jwt';
import config from '../../config/app';
import { Request } from '../../common/types';

/**
 * We are assuming that the JWT will come in a header with the form
 *
 * Authorization: Bearer ${JWT}
 */
const getTokenFromHeader = (req: Request) => {
  /**
   * @TODO Edge and Internet Explorer do some weird things with the headers
   */
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return undefined;
};

const isAuth = jwt({
  secret: config.jwtSecret, // The _secret_ to sign the JWTs
  requestProperty: 'token', // Use req.token to store the JWT
  algorithms: ["HS256"],
  getToken: getTokenFromHeader, // How to extract the JWT from the request
});

export default isAuth;
