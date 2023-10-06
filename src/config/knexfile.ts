import path from 'path';
import appConfig from './app';
import logger from '../infra/loaders/logger';

type KnexConfig = {
  [key: string]: any;
};

const config: KnexConfig = {
  client: 'pg',
  debug: true,
  asyncStackTraces: true,
  connection: appConfig.databaseURL,
  pool: {
    min: 1,
    max: 4,
    acquireTimeoutMillis: 60000,
    idleTimeoutMillis: 600000,
  },
  cwd: path.resolve(__dirname + '/../../'),
  migrations: {
    directory: path.resolve(__dirname + '/../infra/data/migrations'),
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: path.resolve(__dirname + '/../infra/data/seeds'),
  },
  searchPath: ['knex', 'public'],
  log: {
    warn(message) {
      logger.warn(`knex:warn:${JSON.stringify(message, null, 4)}`);
    },
    error(message) {
      logger.error(`knex:error:${JSON.stringify(message, null, 4)}`);
    },
    deprecate(message) {
      logger.warn(`knex:deprecate:${JSON.stringify(message, null, 4)}`);
    },
    debug(message) {
      logger.info(`knex:debug:${JSON.stringify(message, null, 4)}`);
    },
  },
};

module.exports = config;

export default config;
