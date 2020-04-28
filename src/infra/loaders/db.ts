import { Knex } from '../../common/types';
import knexfile from '../../config/knexfile';
import appConfig from '../../config/app';

const configOptions = knexfile[appConfig.env];

export default Knex(configOptions);
