import supertest from 'supertest';

import app from '../../../app';
import { HTTP_STATUS } from '../../../common/types';
import { addHeaders } from '../../../tests/utils';

describe('Todos API', () => {
  const request = supertest(app);

  let existingTodoUuid;

  beforeAll(async () => {
    const { ADMIN_JWT_TOKEN: jwtToken } = process.env;

    // Fetch existing todos
    const response = await addHeaders(request.get('/api/todos/my'), jwtToken);

    expect(response.status).toBe(HTTP_STATUS.OK);

    const todos = response.body.result;
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBeGreaterThan(0);

    // Store the UUID of the first todo
    existingTodoUuid = todos[0].id;
  });

  it('Should correctly load user todos', async () => {
    const { ADMIN_JWT_TOKEN: jwtToken } = process.env;

    const response = await addHeaders(request.get('/api/todos/my'), jwtToken);

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.result).toEqual(expect.anything());
    expect(response.body.result.length).toBe(5);
  });

  it('Should correctly load all todos', async () => {
    const { ADMIN_JWT_TOKEN: jwtToken } = process.env;

    const response = await addHeaders(request.get('/api/todos'), jwtToken);

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.result).toEqual(expect.anything());
    expect(response.body.result.length).toBe(5);
  });

  it('Should correctly add new todo', async () => {
    const { ADMIN_JWT_TOKEN: jwtToken } = process.env;

    const response = await addHeaders(
      request.post('/api/todos').send({
        content: 'Complete test tasks',
        fileSrc: 'https://s3.test.com/todo_logo.png',
        expires_at: new Date(2025, 1, 1),
      }),
      jwtToken
    );

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.result).toEqual(expect.anything());
    expect(response.body.result.content).toEqual('Complete test tasks');
    expect(response.body.result.fileSrc).toEqual('https://s3.test.com/todo_logo.png');
  });


  it('Should NOT allow add new todo with invalid input', async () => {
    const { ADMIN_JWT_TOKEN: jwtToken } = process.env;

    const response = await addHeaders(
      request.post('/api/todos').send({
        // send 1 symbol
        content: 'C',
      }),
      jwtToken
    );

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  it('Should correctly update existing todo', async () => {
    const { ADMIN_JWT_TOKEN: jwtToken } = process.env;

    const response = await addHeaders(
      request.put(`/api/todos/${existingTodoUuid}`).send({
        content: 'Complete tasks again',
        fileSrc: 'https://s3.test.com/todo_new_logo.png',
      }),
      jwtToken
    );

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.result).toEqual(expect.anything());
    expect(response.body.result.content).toEqual('Complete tasks again');
    expect(response.body.result.fileSrc).toEqual('https://s3.test.com/todo_new_logo.png');
  });

  it('Should correctly delete existing todo', async () => {
    const { ADMIN_JWT_TOKEN: jwtToken } = process.env;

    const response = await addHeaders(
      request.delete(`/api/todos/${existingTodoUuid}`),
      jwtToken
    );

    expect(response.status).toBe(HTTP_STATUS.OK);
  });
});
