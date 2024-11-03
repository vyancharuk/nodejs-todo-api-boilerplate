import { Application } from '../../common/types';
import { initDI } from './diContainer';
import expressLoader from './express';
import checkEnvs from './checkenvs';
import { initCronTasks } from './cronjobs';

const init = async ({ expressApp }: { expressApp: Application }) => {
  await initDI();
  await expressLoader({ app: expressApp });
  await checkEnvs();

  await initCronTasks();
};

export default { init };
