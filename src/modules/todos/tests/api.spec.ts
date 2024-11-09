import supertest from 'supertest';

import app from '../../../app';
import { HTTP_STATUS } from '../../../common/types';
import { addHeaders } from '../../../tests/utils';

describe('Todos API', () => {
  const request = supertest(app);

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
        content: 'Complete tasks',
        meta: {
          expires_at: new Date(2025, 1, 1),
        },
      }),
      jwtToken
    );

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.result).toEqual(expect.anything());
  });

  it('Should correctly update existing todo', async () => {
    const { ADMIN_JWT_TOKEN: jwtToken } = process.env;

    const todosRes = await addHeaders(request.get('/api/todos/my'), jwtToken);

    expect(todosRes.status).toBe(HTTP_STATUS.OK);
    expect(todosRes.body.result).toEqual(expect.anything());

    const id = todosRes.body.result[0].id;

    const response = await addHeaders(
      request.put(`/api/todos/${id}`).send({
        content: 'Complete tasks again',
      }),
      jwtToken
    );

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.result).toEqual(expect.anything());
  });

  it('Should correctly delete existing todo', async () => {
    const { ADMIN_JWT_TOKEN: jwtToken } = process.env;

    const todosRes = await addHeaders(request.get('/api/todos/my'), jwtToken);

    expect(todosRes.status).toBe(HTTP_STATUS.OK);
    expect(todosRes.body.result).toEqual(expect.anything());

    const allTodos = todosRes.body.result;

    const id = allTodos[allTodos.length - 1].id;

    const response = await addHeaders(
      request.delete(`/api/todos/${id}`),
      jwtToken
    );

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.result).toEqual(expect.anything());
  });
});
