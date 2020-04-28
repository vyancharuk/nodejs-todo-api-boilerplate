import supertest from 'supertest';
import app from '../../../app';
import { HTTP_STATUS } from '../../../common/types';
import { addHeaders } from '../../../tests/utils';

// TODO: Cleanup created users after tests
describe('Users API', () => {
  const request = supertest(app);

  let jwtToken;
  let refreshToken;
  let adminJwtToken;

  it('Should register anonymous user', async () => {
    const response = await addHeaders(request.post('/api/signup'));
    expect(response.status).toBe(HTTP_STATUS.CREATED);
    expect(response.body.result).toEqual(expect.anything());
    expect(response.body.result.jwt).toEqual(expect.anything());
    expect(response.body.result.user).toEqual(expect.anything());

    expect(response.body.result.user.userName).toMatch(/user_/i);
    expect(response.body.result.refreshToken).toEqual(expect.anything());

    // store jwt and refresh tokens
    jwtToken = response.body.result.jwt;
    refreshToken = response.body.result.refreshToken;
  });

  it('Should correctly load profile data for registered data', async () => {
    const response = await addHeaders(request.get('/api/users/me'), jwtToken);
    expect(response.status).toBe(HTTP_STATUS.OK);
    // expect(response.body.result).not.toBe(null);
    expect(response.body.result).toEqual(expect.anything());
    expect(response.body.result.id).toEqual(expect.anything());
    expect(response.body.result.userName).toMatch(/user_/i);
  });

  it('Should login admin user', async () => {
    const response = await addHeaders(
      request.post('/api/signin').send({
        username: 'admin',
        password: '123456',
      })
    );

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.result).toEqual(expect.anything());
    expect(response.body.result.jwt).toEqual(expect.anything());
    expect(response.body.result.user).toEqual(expect.anything());
    expect(response.body.result.user.userName).toMatch('admin');

    adminJwtToken = response.body.result.jwt;
  });

  it('Should refresh JWT for registered user', async () => {
    const response = await addHeaders(
      request.post('/api/jwt/refresh').send({
        refreshToken,
      })
    );

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.result).toEqual(expect.anything());
    expect(response.body.result.jwt).toEqual(expect.anything());
    expect(response.body.result.user).toEqual(expect.anything());
    expect(response.body.result.user.userName).toMatch(/user_/i);
  });

  it('Should not load all users for anonymous user', async () => {
    const response = await addHeaders(request.get('/api/users'), jwtToken);

    expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
  });

  it('[ADMIN] Should load all users for admin user', async () => {
    const response = await addHeaders(request.get('/api/users'), adminJwtToken);

    expect(response.status).toBe(HTTP_STATUS.OK);

    expect(response.body.result).toEqual(expect.anything());
    expect(response.body.result.length).toBeGreaterThan(1);
  });

  it('Should logout admin user', async () => {
    const response = await addHeaders(
      request.post('/api/signout'),
      adminJwtToken
    );

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.result).toEqual(expect.anything());
    expect(response.body.result.deletedTokensCount).toEqual(1);
  });
});
