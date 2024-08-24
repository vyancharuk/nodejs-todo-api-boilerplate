import { Request, Response, HTTP_STATUS } from '../../common/types';
import createController from '../../common/createController';

import GetUser from './getUser.service';
import GetUsers from './getUsers.service';
import LoginUser from './loginUser.service';
import LogoutUser from './logoutUser.service';
import RegisterUser from './registerAnonymousUser.service';
import RefreshToken from './refreshToken.service';

import { isErrorCode } from '../../common/utils';

export default {
  // use composite controller to include get 
  registerAnonymous: createController(
    RegisterUser,
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
  // TODO: refresh token
  refreshToken: createController(RefreshToken, (req: Request) => req.body),
  getUser: createController(GetUser, (req: Request) => ({
    userId: req['currentUser'].id,
  })),
  getUsers: createController(GetUsers),
};
