import path from 'path';
import appConfig from './app';
import logger from '../infra/loaders/logger';

type KnexConfig = {
  [key: string]: any;
};

const useSqliteDb = process.env.USE_SQLITE_DB === 'true';

const config: KnexConfig = {
  client: useSqliteDb ? 'sqlite3' : 'pg',
  connection: useSqliteDb
    ? {
        filename: path.resolve(__dirname + '/../../') + '/test.sqlite3',
      }
    : appConfig.databaseURL,
  // sqlite specific settings
  ...(useSqliteDb
    ? {
        useNullAsDefault: true,
      }
    : {}),
  // skip knex debug output when necessary
  debug: process.env.DEBUG !== 'false',
  asyncStackTraces: true,
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
