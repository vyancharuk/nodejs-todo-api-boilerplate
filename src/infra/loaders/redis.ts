import Redis from 'ioredis';
import appConfig from '../../config/app';

export default new Redis(appConfig.redisUri, { keyPrefix: 'todo_app_' });
