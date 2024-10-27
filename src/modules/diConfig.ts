import { Container } from '../common/types';
import usersDiConfig from './users/diConfig';
import todosDiConfig from './todos/diConfig';

/**
 *
 * Configures dependency injection for all modules by initializing their respective DI configurations.
 */
export default function initializeModulesDI(container: Container) {
  usersDiConfig(container);
  todosDiConfig(container);
};
