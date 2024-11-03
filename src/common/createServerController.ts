import { container } from '../infra/loaders/diContainer';
import logger from '../infra/loaders/logger';
import { Knex, interfaces } from './types';
import Operation from './operation';
import { BINDINGS } from './constants';
import { stringifyError } from './utils';

export const createServerController =
  (
    serviceConstructor: interfaces.Newable<Operation>,
    paramsCb: Function = () => {},
    parentTransaction?: Knex.Transaction
  ) =>
  async (currentParams: any) => {
    logger.info('createServerController:start');
    let transaction: Knex.Transaction | undefined;
    try {
      // 1. create transaction if needed, and share it between all repositories used by controller
      // create transaction if needed, and share it between all repositories used by controller
      if (!parentTransaction && serviceConstructor['useTransaction']) {
        logger.info(`createController:start:transaction`);

        const db: Knex = container.get<Knex>(BINDINGS.DbAccess);
        transaction = await db.transaction();
      } else if (parentTransaction) {
        logger.info(`createController:use:parent:transaction`);
        transaction = parentTransaction;
      }

      // 2. process use case service logic
      const service: Operation = container.resolve(serviceConstructor);

      // get all used repositories for controller
      const repositories = service.getRepositories();

      // according to pattern "unit of work" perform all operation changes in transaction if needed
      // https://www.martinfowler.com/eaaCatalog/unitOfWork.html
      if (parentTransaction !== undefined) {
        repositories.forEach((repo) => repo.setDbAccess(parentTransaction!));

        logger.info(
          `createServerController:repositories=${repositories.length}`
        );
      }

      const params = paramsCb(currentParams);

      let result;

      if (params) {
        // run use case service
        result = await service.run(params);
      } else {
        logger.info(
          `createServerController:${serviceConstructor.name}:logic:warning:empty:params`
        );
        result = { msg: 'SKIP_ALL_OTHER_SERVICES' };
      }

      if (!parentTransaction && transaction) {
        transaction.commit();
      }

      return { result };
    } catch (ex) {
      logger.error(
        `createServerController:error:${stringifyError(ex)} \r\n ${
          (ex as any).stack
        }`
      );

      if (!parentTransaction && transaction) {
        transaction.rollback();
      }

      throw ex;
    }
  };
