import config from './config/app';
import app from './app';
import logger from './infra/loaders/logger';

(async () => {
  await app['initLoaders']();
  app.listen(config.port, () => {
    logger.info(`server:started:node=${config.appId}:is:ready:on:port=${config.port}`);
  });
})()
