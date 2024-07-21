import app from './app';
import config from './config/app';
import knex from './infra/loaders/db';
import logger from './infra/loaders/logger';

(async () => {
  await app['initLoaders']();
  const server = app.listen(config.port, () => {
    logger.info(`server:started:node=${config.appId}:is:ready:on:port=${config.port}`);
  });


  const shutdown = (signal) => {
    logger.info('server:shutdown:node=', config.appId, 'signal=', signal);

    const start = Date.now();
    server.close(function onServerClosed(err) {
      logger.info('server:shutdown:node=', config.appId, ':express:closed:duration=', Date.now() - start);
      if (err) {
        logger.error('server:shutdown:close:express:error=', err);
        process.exitCode = 1;
      }
      // release DB connection pull
      knex.destroy();

      // exit
      process.exit(0);
    });

  };

  process.on('SIGTERM', function onSigterm() {
    logger.info('got:SIGTERM:graceful:shutdown:start', new Date().toISOString())
    // start graceful shutdown here
    shutdown('SIGTERM')
  });

  process.on('SIGINT', function onSigterm() {
    logger.info('got:SIGINT:graceful:shutdown:start', new Date().toISOString())
    // start graceful shutdown here
    shutdown('SIGINT')
  });

  process.on('SIGHUP', function onSigterm() {
    logger.info('got:SIGHUP:graceful:shutdown:start', new Date().toISOString())
    // start graceful shutdown here
    shutdown('SIGHUP')
  });
})();
