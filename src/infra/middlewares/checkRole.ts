import {
  Request,
  Response,
  NextFunction,
  CustomError
} from '../../common/types';

/**
 * Check if current user's role match one of passed using bits logic
 * @param roleBits
 */
const checkRole = (
  roleBits: number,
  errorMsg: string = "You don't have enough permissions"
) => (req: Request, res: Response, next: NextFunction) => {
  if ((req['currentUser'].role & roleBits) === 0) {
    throw new CustomError(401, 'UnauthorizedError', errorMsg);
  }
  next();
};
export default checkRole;
