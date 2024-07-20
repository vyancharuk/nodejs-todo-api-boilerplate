import createController from '../../common/createController';
import { Request } from '../../common/types';

import GetAllTodos from './getTodos.service';
import GetUserTodos from './getUserTodos.service';
import AddTodos from './addTodos.service';
import UpdateTodo from './updateTodo.service';
import RemoveTodo from './removeTodo.service';

export default {
  getAllTodos: createController(GetAllTodos, (req: Request) => ({
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
  updateTodo: createController(UpdateTodo, (req: Request) => ({
    userId: req['currentUser'].id,
    todoId: req.params.id,
    content: req.body.content,
  })),
  removeTodo: createController(RemoveTodo, (req: Request) => ({
    userId: req['currentUser'].id,
    todoId: req.params.id,
  })),
};
