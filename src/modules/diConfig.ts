import { Container } from '../common/types';
import usersDiConfig from './users/diConfig';
import todosDiConfig from './todos/diConfig';

export default (container: Container) => {
  usersDiConfig(container);
  todosDiConfig(container);
};
