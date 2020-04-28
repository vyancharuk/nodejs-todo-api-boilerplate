import { BINDINGS } from '../../common/constants';
import { Container } from '../../common/types';

import UsersRepository from './repository';

export default (container: Container) => {
  container.bind<UsersRepository>(BINDINGS.UsersRepository).to(UsersRepository);
};
