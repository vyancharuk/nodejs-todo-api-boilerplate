const BINDINGS = {
  KnexConnection: Symbol.for('KnexConnection'),
  DbAccess: Symbol.for('DbAccess'),
  Redis: Symbol.for('Redis'),
  BaseRepository: Symbol.for('BaseRepository'),
  AWSService: Symbol.for('AWSService'),
  MemoryStorage: Symbol.for('MemoryStorage'),

  // auth
  LoginUser: Symbol.for('LoginUser'),
  RegisterUser: Symbol.for('RegisterUser'),
  RefreshToken: Symbol.for('RefreshToken'),

  // users
  UsersRepository: Symbol.for('UsersRepository'),
  GetUser: Symbol.for('GetUser'),
  GetUsers: Symbol.for('GetUsers'),

  // todos
  TodosRepository: Symbol.for('TodosRepository'),
  GetTodos: Symbol.for('GetTodos'),
  GetUserTodos: Symbol.for('GetUserTodos'),
}

export { BINDINGS };
