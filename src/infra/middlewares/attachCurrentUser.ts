import { Request, Response, NextFunction } from '../../common/types';
import { getRoleCode } from '../../common/utils';

/**
 * Attach user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser = {
    id: req['token'].id,
    userName: req['token'].name,
    role: getRoleCode(req['token'].role),
  };
  req['currentUser'] = currentUser;
  return next();
};

export default attachCurrentUser;
