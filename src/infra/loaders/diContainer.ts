import 'reflect-metadata';

import { interfaces } from 'inversify';
import knex from './db';
import redis from './redis';
import awsService from '../integrations/aws.service';
import MemoryStorage from '../integrations/memoryStorage.service';
import { initDiContainer } from '../../modules';
import { BINDINGS } from '../../common/constants';
import { Knex, Container } from '../../common/types';
import BaseRepository from '../../common/baseRepository';
import logger from './logger';

function diLogger(planAndResolve: interfaces.Next): interfaces.Next {
  return (args: interfaces.NextArgs) => {
    return planAndResolve(args);
  };
}

const container: Container = new Container({
  autoBindInjectable: true,
});

container.bind<Knex>(BINDINGS.DbAccess).toConstantValue(knex);
container.bind<typeof redis>(BINDINGS.Redis).toConstantValue(redis);
container.bind<BaseRepository>(BINDINGS.BaseRepository).to(BaseRepository);
container
  .bind<typeof awsService>(BINDINGS.AWSService)
  .toConstantValue(awsService);

container
  .bind<MemoryStorage>(BINDINGS.MemoryStorage)
  .toConstantValue(container.resolve(MemoryStorage));

container.applyMiddleware(diLogger);

const initDI = () => {
  logger.info('init each module DI');
  initDiContainer(container);
};

export { container, initDI };
