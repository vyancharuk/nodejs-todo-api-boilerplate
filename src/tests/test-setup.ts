import supertest from 'supertest';
import { container } from '../infra/loaders/diContainer';
import app from '../app';
import { addHeaders } from './utils';
import { HTTP_STATUS } from '../common/types';
import { BINDINGS } from '../common/constants';

// use both mock approaches - by rebinding Di container and by using regular mock
container.rebind(BINDINGS.MemoryStorage).toConstantValue({
  setValue: jest.fn(),
  getValue: jest.fn(),
  delValue: jest.fn(),
});

jest.mock('../infra/integrations/aws.service', () => ({
  saveToS3: jest.fn().mockReturnValue('http://test_bucket_url'),
}));

jest.mock('rate-limiter-flexible', () => ({
  RateLimiterRedis: function MockRateLimiterRedis() {
    return {
      consume() { },
      penalty() { },
      reward() { },
      block() { },
      get() {
        return null;
      },
      set() { },
      delete() { },
      getKey() { },
    };
  },
}));

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    quit: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
  }));
});

jest.mock('cls-rtracer', () => ({
  expressMiddleware: () => (_req, _res, next) => next(),
}));

jest.setTimeout(10000);

beforeAll(async () => {
  await app['initLoaders']();
  // get tokens and validate using expect that setup goes properly
  const request = supertest(app);

  let response = await addHeaders(request.post('/api/signup'));

  expect(response.status).toBe(HTTP_STATUS.CREATED);
  expect(response.body.result).toEqual(expect.anything());
  expect(response.body.result.jwt).toEqual(expect.anything());

  // store jwt tokens in env vars, is only one possible way according discussions in https://github.com/facebook/jest/issues/7184
  // https://stackoverflow.com/questions/54654040/how-to-share-an-object-between-multiple-test-suites-in-jest
  process.env['ANONYM_JWT_TOKEN'] = response.body.result.jwt;

  response = await addHeaders(
    request.post('/api/signin').send({
      username: 'admin',
      password: '123456',
    })
  );

  expect(response.status).toBe(HTTP_STATUS.OK);
  expect(response.body.result).toEqual(expect.anything());
  expect(response.body.result.jwt).toEqual(expect.anything());

  process.env['ADMIN_JWT_TOKEN'] = response.body.result.jwt;
});
