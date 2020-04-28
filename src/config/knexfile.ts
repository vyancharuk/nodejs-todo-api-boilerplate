import path from 'path';
import appConfig from './app';

type KnexConfig = {
  [key: string]: any;
};

const config: KnexConfig = {
  dev: {
    client: 'pg',
    debug: true,
    asyncStackTraces: true,
    connection: appConfig.databaseURL,
    migrations: {
      directory: path.resolve(__dirname + '/../infra/data/migrations'),
      tableName: 'knex_migrations',
    },
    seeds: { directory: path.resolve(__dirname + '/../infra/data/seeds') },
    searchPath: ['knex', 'public'],
  },

  test: {
    client: 'pg',
    connection: appConfig.databaseURL,
    migrations: {
      directory: path.resolve(__dirname + '/../infra/data/migrations'),
      tableName: 'knex_migrations',
    },
    seeds: { directory: path.resolve(__dirname + '/../infra/data/seeds') },
    searchPath: ['knex', 'public'],
  },
};

module.exports = config;

export default config;
