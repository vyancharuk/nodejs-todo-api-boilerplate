import { BINDINGS } from '../../common/constants';
import { Container } from '../../common/types';

import TodosRepository from './repository';

export default (container: Container) => {
  container.bind<TodosRepository>(BINDINGS.TodosRepository).to(TodosRepository);
};
