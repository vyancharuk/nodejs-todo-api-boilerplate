import { Knex } from '../../../common/types';
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import { hashPassword } from '../../../modules/users/authUtils';
import appConfig from '../../../config/app';

const { SKIP_IF_ALREADY_RUN } = process.env;

export async function seed(knex: Knex): Promise<any> {
  // check if can skip seed phase
  if (SKIP_IF_ALREADY_RUN === 'true') {
    const adminUser = await knex('users').where('user_name', 'admin').first();

    if (adminUser) {
      console.log('Skip seed phase because flag SKIP_IF_ALREADY_RUN is true');
      return;
    }
  }

  await knex('todos').del();
  await knex('user_refresh_tokens').del();
  await knex('users').del();

  // make constant admin id
  const adminId = uuid();
  const refreshToken = '50ecc6dcbd1a';

  const [u1, u2, u3] = Array(3)
    .fill(null)
    .map(() => uuid());

  // Inserts seed entries
  await knex('users').insert([
    {
      id: adminId,
      user_name: 'admin',
      email: 'admin@example-todos-api.com',
      role: 'admin',
      password: hashPassword('123456'),
    },
    { id: u1, user_name: 'jon.doe', role: 'registered' },
    { id: u2, user_name: 'homer.simpson', role: 'registered' },
    { id: u3, user_name: 'jon.gold', role: 'registered' },
  ]);

  // 7 days refresh token expiration
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await knex('user_refresh_tokens').insert([
    {
      user_id: adminId,
      client_id: appConfig.defaultClientId,
      expires,
      refresh_token: refreshToken,
    },
    ...[u1, u2, u3].map((uId) => ({
      user_id: uId,
      client_id: appConfig.defaultClientId,
      expires,
      refresh_token: nanoid(),
    })),
  ]);

  await knex('todos').insert([
    { content: 'Do exercises', user_id: adminId },
    { content: 'Check email', user_id: adminId },
    { content: 'Call to bank', user_id: adminId },
    { content: 'Order pizza', user_id: adminId },
    { content: 'Pay bills', user_id: adminId },
  ]);
}
