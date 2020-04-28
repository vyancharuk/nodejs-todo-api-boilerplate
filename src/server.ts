import config from './config/app';
import app from './app';
import logger from './infra/loaders/logger';

app.listen(config.port, (err) => {
  if (err) {
    logger.error(`Error during server startup ${err.toString()}`);
  }
  logger.info(`Your server is ready on port ${config.port}`);
});
