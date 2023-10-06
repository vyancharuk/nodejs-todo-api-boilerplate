import express, { Application } from 'express';
import loaders from './infra/loaders';
import logger from './infra/loaders/logger';

const app: Application = express();

async function initLoaders() {
  await loaders.init({ expressApp: app });

  logger.info('After loaders initialized');
}
app['initLoaders'] = initLoaders;

export default app;
