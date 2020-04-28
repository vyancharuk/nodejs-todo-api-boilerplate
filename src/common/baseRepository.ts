import { Knex, injectable, inject } from './types';
import { BINDINGS } from './constants';

@injectable()
class BaseRepository {
  @inject(BINDINGS.DbAccess)
  protected dbAccess!: Knex;

  setDbAccess(transaction: Knex) {
    this.dbAccess = transaction;
  }

  wrapWithPaginationAndSearch(
    qb: Knex.QueryBuilder,
    pageInd: number,
    pageSize: number,
    searchFields: { field: string; search: string }[],
    orderBy: string = 'created_at'
  ) {
    qb.offset(pageSize * pageInd).limit(pageSize);

    if (orderBy) qb.orderBy(orderBy, 'desc');

    if (searchFields.length > 0) {
      qb.where(function () {
        searchFields.forEach(({ field, search }) => {
          if (search !== '') {
            this.orWhere(field, 'ilike', `%${search}%`);
          }
        });
      });
    }

    return qb;
  }
}

export default BaseRepository;
