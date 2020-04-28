import { injectable } from '../../common/types';
import { Todo } from './types';
import BaseRepository from '../../common/baseRepository';

@injectable()
class TodosRepository extends BaseRepository {
  async findAll(
    pageInd: number,
    pageSize: number,
    search: string
  ): Promise<Todo[]> {
    const qb = this.dbAccess!('todos').returning('*');

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
}

export default TodosRepository;
