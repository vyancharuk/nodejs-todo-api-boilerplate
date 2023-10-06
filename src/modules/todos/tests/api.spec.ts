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
});
