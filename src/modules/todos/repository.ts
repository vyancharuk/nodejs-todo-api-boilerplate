import { v4 as uuid } from 'uuid';

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

  async findById(id: string): Promise<Todo | undefined> {
    return this.dbAccess<Todo>('todos').select('*').where('id', id).first();
  }

  async addTodo(
    userId: string,
    todo: {
      context: string;
      file_src?: string;
      expires_at?: string;
      expired?: boolean;
    }
  ) {
    return this.dbAccess('todos')
      .insert([{ id: uuid(), user_id: userId, ...todo }])
      .returning('*');
  }

  async updateTodo(
    todoId: string,
    userId: string,
    newProps: {
      content?: string;
      file_src?: string;
      expires_at?: string;
      expired?: boolean;
    }
  ) {
    const { content, expires_at, file_src, expired } = newProps;
    return this.dbAccess('todos')
      .update({
        content,
        file_src,
        expires_at,
        expired,
      })
      .where('id', todoId)
      .andWhere('user_id', userId)
      .returning('*');
  }

  async removeTodo(todoId: string, userId: string) {
    return this.dbAccess('todos')
      .where('id', todoId)
      .andWhere('user_id', userId)
      .del();
  }

  async setExpiredTodos() {
    return this.dbAccess('todos')
      .where('expires_at', '<', new Date())
      .update({ expired: true });
  }
}
