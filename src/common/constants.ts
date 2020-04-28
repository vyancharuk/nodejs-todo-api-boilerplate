export enum BINDINGS {
  KnexConnection = 'KnexConnection',
  DbAccess = 'DbAccess',
  Redis = 'Redis',
  BaseRepository = 'BaseRepository',
  AWSService = 'AWSService',
  MemoryStorage = 'MemoryStorage',

  // auth
  LoginUser = 'LoginUser',
  RegisterUser = 'RegisterUser',
  RefreshToken = 'RefreshToken',

  // users
  UsersRepository = 'UsersRepository',
  GetUser = 'GetUser',
  GetUsers = 'GetUsers',

  // todos
  TodosRepository = 'TodosRepository',
  GetTodos = 'GetTodos',
  GetUserTodos = 'GetUserTodos',
}
