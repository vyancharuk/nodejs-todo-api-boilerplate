import { createServerController } from '../../common/createServerController';
import { UpdateExpiredTodos } from './updateExpiredTodos.service';

/**
 * @module TodosServerController
 *
 * Server Controller for handling server based operations for todos
 */
export const todoServerController = {
  /**
   * Updates the expired todos
   *
   * @param {Any} params - The parameters that can be passed to service
   */
  updateExpiredTodos: createServerController(UpdateExpiredTodos, (_params: any) => ({
    callerId: 'cron',
  })),
};
