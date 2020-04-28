import { Application } from '../../common/types';
import { initDI } from './diContainer';
import expressLoader from './express';
import checkEnvs from './checkenvs';

const init = async ({ expressApp }: { expressApp: Application }) => {
  initDI();
  expressLoader({ app: expressApp });
  checkEnvs();
};

export default { init };
