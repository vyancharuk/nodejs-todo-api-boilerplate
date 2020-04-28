import createController from '../../common/createController';
import { Request } from '../../common/types';

import getAllTodos from './getTodos.service';
import GetUserTodos from './getUserTodos.service';
import AddTodos from './addTodos.service';

export default {
  getAllTodos: createController(getAllTodos, (req: Request) => ({
    search: req.query.search,
    pageSize: req.query.pageSize,
    pageInd: req.query.pageInd,
  })),
  getUserTodos: createController(GetUserTodos, (req: Request) => ({
    userId: req['currentUser'].id,
    search: req.query.search,
    pageSize: req.query.pageSize,
    pageInd: req.query.pageInd,
  })),
  addTodos: createController(AddTodos, (req: Request) => ({
    userId: req['currentUser'].id,
    todos: req.body.todos,
  })),
};
