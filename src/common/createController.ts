import logger from '../infra/loaders/logger';
import { container } from '../infra/loaders/diContainer';
import {
  Request,
  Response,
  NextFunction,
  Knex,
  interfaces,
  HTTP_STATUS,
} from './types';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import Operation from './operation';
import { BINDINGS } from './constants';
import { getStatusForError, defaultResponseHandler } from './utils';

// according to clean architecture paramsCb serves as interactor - just pass params to service(use case)
const createController = (
  serviceConstructor: interfaces.Newable<Operation>,
  paramsCb: Function = () => { },
  resCb: Function = defaultResponseHandler,
  parentTransaction?: Knex.Transaction | undefined
) => async (req: Request, res: Response, next: NextFunction) => {
  const ctrlId = Date.now() % Math.pow(10, 6);

  // 1. check jwt token if it is already logged out
  logger.info(
    `[${ctrlId}]createController:start auth=${!!req.headers['authorization']}`
  );

  let transaction: Knex.Transaction | undefined;
  const ipAddr = req.connection.remoteAddress;

  try {
    if (req.headers['authorization']) {
      const memoryStorage: any = container.get(BINDINGS.MemoryStorage);
      // check for already logout token
      const jwt = req.headers['authorization']!.split(' ')[1];
      const jwtSign = jwt.split('.')[2];
      const tokenExpired = await memoryStorage.getValue(jwtSign);

      logger.info(
        `[${ctrlId}]createController:check expired jwtSign:${jwtSign} tokenExpired=${tokenExpired}`
      );

      if (tokenExpired) {
        return resCb(res, {
          result: { error: 'JWT_ALREADY_EXPIRED' },
          code: HTTP_STATUS.BAD_REQUEST,
        });
      }
    }

    // 2. process rate limiters
    const { retrySecs, currentRateLimiters } = await processRateLimiters(
      ipAddr,
      serviceConstructor['rateLimiters']
        ? serviceConstructor['rateLimiters']
        : []
    );

    if (retrySecs > 0) {
      return resCb(res, {
        result: { error: 'TOO_MANY_REQUESTS' },
        code: HTTP_STATUS.TOO_MANY_REQUESTS,
        headers: [{ name: 'Retry-After', value: `${String(retrySecs)}sec` }],
      });
    }

    logger.info(
      `[${ctrlId}]createController:before consume rate limiters count=${currentRateLimiters.length}`
    );

    // 1.2 update rateLimiters
    await Promise.all(currentRateLimiters.map((tr) => tr.consume(ipAddr)));

    // 2. process use case logic
    logger.info(`[${ctrlId}]createController:init`);

    // create transaction if needed, and share it between all repositories used by controller
    if (!parentTransaction && serviceConstructor['useTransaction']) {
      logger.info(`[${ctrlId}]createController:start:transaction`);

      const db: Knex = container.get<Knex>(BINDINGS.DbAccess);
      transaction = await db.transaction();
    } else if (parentTransaction) {
      logger.info(`[${ctrlId}]createController:use:parent:transaction`);
      transaction = parentTransaction;
    }

    logger.info(`[${ctrlId}]createController:use transaction=${!!transaction}`);

    const service: Operation = container.resolve(serviceConstructor);

    // according to pattern "unit of work" perform all operation changes in transaction if needed
    // https://www.martinfowler.com/eaaCatalog/unitOfWork.html
    if (transaction !== undefined) {
      // get all used repositories for controller
      const repositories = service.getRepositories();
      repositories.forEach((repo) => repo.setDbAccess(transaction!));

      logger.info(
        `[${ctrlId}]createController:repositories=${repositories.length}`
      );
    }

    const params = paramsCb(req, res);
    const result = await service.run(params);

    if (!parentTransaction && transaction !== undefined) {
      logger.info(`[${ctrlId}]createController:transaction commit`);

      await transaction.commit();
    }

    logger.info(`[${ctrlId}]createController:completed`);

    if (!resCb) {
      return res.json({ result }).status(HTTP_STATUS.OK);
    }

    return resCb(res, { result, code: HTTP_STATUS.OK }, req);
  } catch (ex) {
    logger.error(`[${ctrlId}]createController:error ${ex} \r\n ${(ex as any).stack}`);

    if (!parentTransaction && transaction !== undefined) {
      logger.warn(`[${ctrlId}]createController:transaction rollback`);

      await transaction.rollback();
    } else if (parentTransaction) {
      logger.warn(
        `[${ctrlId}]createController:skip parentTransaction rollback`
      );
    }

    if (!(ex instanceof Error) && (ex as any).msBeforeNext) {
      return resCb(res, {
        result: { error: 'TOO_MANY_REQUESTS' },
        code: HTTP_STATUS.TOO_MANY_REQUESTS,
        headers: [
          {
            name: 'Retry-After',
            value: `${String(Math.round((ex as any).msBeforeNext / 1000)) || '1'}sec`,
          },
        ],
      });
    }

    return resCb(res, {
      result: { error: (ex as any).toString() },
      code: getStatusForError(ex),
    });

    // return next(ex);
  }
};

const processRateLimiters = async (ipAddr, rateLimiters: any[]) => {
  const redis = container.get(BINDINGS.Redis);

  // create Rate Limiters if needed
  const currentRateLimiters: any[] = rateLimiters.reduce((result, params) => {
    let rt;
    if (container.isBound(params.keyPrefix)) {
      rt = container.get(params.keyPrefix);
    } else {
      rt = new RateLimiterRedis({
        redis,
        ...params,
      });

      container.bind(params.keyPrefix).toConstantValue(rt);
    }

    return result.concat([rt]);
  }, []);
  let retrySecs = 0;

  // const [resByIP] = await Promise.all(
  const rtResults = await Promise.all(
    currentRateLimiters.map((tr) => tr.get(ipAddr))
  );

  rtResults.forEach((resByIP) => {
    // Check if IP is already blocked
    if (retrySecs === 0 && resByIP !== null && resByIP.consumedPoints > 3) {
      retrySecs = Math.round(resByIP.msBeforeNext / 1000) || 1;
    }
  });

  return {
    retrySecs,
    currentRateLimiters,
  };
};

export default createController;
