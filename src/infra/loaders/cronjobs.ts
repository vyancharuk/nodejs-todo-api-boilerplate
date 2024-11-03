
import cron from 'node-cron';

import appConfig from '../../config/app';
import { todoServerController } from '../../modules/todos/serverControllers';
import logger from './logger';

const initCronTasks = async () => {
    logger.info('cronjob:init:initCronTasks:env:', appConfig.env);
  
    // every 24 hours at 32:55
    cron.schedule('0 59 23 * * *', async () => {
      logger.info('cronjob:running:update:expired:todos');
  
      await todoServerController.updateExpiredTodos({});
    });
  
  };
  
  export { initCronTasks };