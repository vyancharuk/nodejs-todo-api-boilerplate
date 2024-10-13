import { Request, Response, HTTP_STATUS } from '../../common/types';
import { createController } from '../../common/createController';

import { GetUser } from './getUser.service';
import { GetUsers } from './getUsers.service';
import { LoginUser } from './loginUser.service';
import { LogoutUser } from './logoutUser.service';
import { RegisterAnonymousUser } from './registerAnonymousUser.service';
import { RefreshToken } from './refreshToken.service';

import { isErrorCode } from '../../common/utils';

/**
 * Controller module for handling user-related operations.
 * @module controllers/users
 */
export const usersController = {
  /**
   * Controller to register an anonymous user.
   * @property {Function} registerAnonymous
   * @param {Request} req - The Express request object containing user data.
   * @param {Response} res - The Express response object.
   * @returns {Function} - The controller function that handles anonymous user registration.
   */
  registerAnonymous: createController(
    RegisterAnonymousUser,
    async (req: Request, res: Response) => req.body,
    (res: Response, { result, code, headers = [] }: any, req: Request) => {
      headers.forEach(({ name, value }) => {
        res.set(name, value);
      });

      if (isErrorCode(code)) {
        return res.status(code).json({
          result,
        });
      }

      // handle output statuses
      if (!result || !result.jwt) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ result });
      }

      return res.status(HTTP_STATUS.CREATED).json({
        result,
      });
    }
  ),

  /**
   * Controller to log in a user.
   * @property {Function} loginUser
   * @param {Request} req - The Express request object containing user credentials.
   * @returns {Function} - The controller function that handles user login.
   */
  loginUser: createController(
    LoginUser,
    (req: Request) => req.body,
    (res: Response, { result, code, headers = [] }: any) => {
      headers.forEach(({ name, value }) => {
        res.set(name, value);
      });

      if (isErrorCode(code)) {
        return res.status(code).json({
          result,
        });
      }

      // handle output statuses
      if (!result || !result.jwt) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ result });
      }

      res.json({ result }).status(HTTP_STATUS.OK);
    }
  ),

  /**
   * Controller to log out a user.
   * @property {Function} logoutUser
   * @param {Request} req - The Express request object containing authorization headers.
   * @returns {Function} - The controller function that handles user logout.
   */
  logoutUser: createController(
    LogoutUser,
    (req: Request) => ({
      jwt: req.headers['authorization']!.split(' ')[1],
      userId: req['currentUser'] ? req['currentUser'].id : '',
    }),
    (res: Response, { result, code }: any) => {
      res.json({ result }).status(code);
    }
  ),
   /**
   * Controller to refresh the user's authentication token.
   * @property {Function} refreshToken
   * @param {Request} req - The Express request object containing the refresh token.
   * @returns {Function} - The controller function that handles token refresh.
   */
  refreshToken: createController(RefreshToken, (req: Request) => req.body),

  /**
   * Controller to get information about the current authenticated user.
   * @property {Function} getUser
   * @param {Request} req - The Express request object containing the current user.
   * @returns {Function} - The controller function that retrieves user information.
   */
  getUser: createController(GetUser, (req: Request) => ({
    userId: req['currentUser'].id,
  })),


  /**
   * Controller to get a list of users.
   * @property {Function} getUsers
   * @returns {Function} - The controller function that retrieves a list of users.
   */
  getUsers: createController(GetUsers),
};
