import { Knex } from '../../../common/types';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').notNullable().primary();

    table.string('user_name', 100).notNullable();
    table.string('email', 50);
    // anonym when user do not provide any profile info (email etc.)
    table.enu('role', ['anonym', 'registered', 'admin']);
    table.string('password', 100);

    table.timestamps(true, true);
  });

  await knex.schema.createTable('user_refresh_tokens', (table) => {
    table.uuid('id').notNullable().primary();

    table.uuid('user_id').notNullable();
    table.foreign('user_id').references('users.id');

    table.string('client_id', 100).notNullable();
    table.string('refresh_token', 200).notNullable();

    table.timestamp('expires').notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('todos', (table) => {
    table.uuid('id').notNullable().primary();

    table.string('content', 1000).notNullable();
    table.string('file_src', 500);
    table.uuid('user_id').notNullable();
    table.foreign('user_id').references('users.id');
    table.timestamp('expires_at');
    table.boolean('expired');

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable('todos');
  await knex.schema.dropTable('user_refresh_tokens');
  await knex.schema.dropTable('users');
}
