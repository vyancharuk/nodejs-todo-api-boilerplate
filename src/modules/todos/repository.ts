import BaseRepository from '../../common/baseRepository';
import { injectable } from '../../common/types';
import logger from '../../infra/loaders/logger';
import { Todo } from './types';

/**
 * @class TodosRepository
 *
 * Manages todo-related database operations, including retrieving, creating, updating, and deleting Todo items.
 */
@injectable()
export class TodosRepository extends BaseRepository {
  async findAll(
    pageInd: number,
    pageSize: number,
    search: string
  ): Promise<Todo[]> {
    const qb = this.dbAccess!('todos').returning('*');
    logger.info('TodosRepository:findAll');
    return this.wrapWithPaginationAndSearch(qb, pageInd, pageSize, [
      { field: 'content', search },
    ]);
  }

  async findUserTodos(
    userId: string,
    pageInd: number,
    pageSize: number,
    search: string
  ): Promise<Todo[] | undefined> {
    const qb = this.dbAccess<Todo>('todos')
      .select('*')
      .where('user_id', userId);

    return this.wrapWithPaginationAndSearch(qb, pageInd, pageSize, [
      { field: 'content', search },
    ]);
  }

  async addTodos(userId: string, todos: string[]) {
    return this.dbAccess('todos')
      .insert(todos.map((content) => ({ content, user_id: userId })))
      .returning('id');
  }

  async updateTodo(todoId: string, userId: string, content: string) {
    return this.dbAccess('todos')
      .update({
        content,
      })
      .where('id', todoId)
      .andWhere('user_id', userId);
  }

  async removeTodo(todoId: string, userId: string) {
    return this.dbAccess('todos')
      .where('id', todoId)
      .andWhere('user_id', userId)
      .del();
  }

  async setExpiredTodos() {
    return this.dbAccess('todos')
      .whereRaw(`(meta->>'expires_at')::timestamp < now()`)
      .update({
        meta: this.dbAccess.raw(
          `jsonb_set(meta, '{expired}', 'true'::jsonb, true)`
        ),
      })
      .returning('*');
  }
}
