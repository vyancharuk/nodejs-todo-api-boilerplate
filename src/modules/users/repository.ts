import { injectable } from '../../common/types';
import { UserInputData, User } from './types';
import BaseRepository from '../../common/baseRepository';

@injectable()
class UsersRepository extends BaseRepository {
  async findAll() {
    return this.dbAccess!('users').returning('*');
  }

  async findById(id: string): Promise<User | undefined> {
    return this.dbAccess<User>('users').where({ id }).first();
  }

  async _findByCond(cond: object): Promise<User | undefined> {
    return this.dbAccess<User>('users')
      .leftJoin(
        'user_refresh_tokens',
        'user_refresh_tokens.user_id',
        'users.id'
      )
      .select(
        'users.id',
        'users.user_name',
        'users.email',
        'users.password',
        'users.role',
        'user_refresh_tokens.refresh_token'
      )
      .where(cond)
      .first();
  }

  async findByName(name: string): Promise<User | undefined> {
    return this._findByCond({ user_name: name });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this._findByCond({ email });
  }

  async findByRefreshToken(
    refreshToken: string,
    clientId: number
  ): Promise<User | undefined> {
    // TODO: add return type cast
    return this.dbAccess('users')
      .select('users.*')
      .innerJoin(
        'user_refresh_tokens',
        'user_refresh_tokens.user_id',
        'users.id'
      )
      .where('user_refresh_tokens.refresh_token', refreshToken)
      .andWhere('user_refresh_tokens.client_id', clientId)
      .first();
  }

  async createUserWithToken(
    userData: UserInputData,
    expires: Date,
    clientId: number
  ): Promise<User[]> {
    const [newUser] = await this.dbAccess('users')
      .insert([
        {
          user_name: userData.userName,
          email: userData.email,
          password: userData.password,
          role: userData.role,
        },
      ])
      .returning('*');

    await this.dbAccess!('user_refresh_tokens').insert([
      {
        user_id: newUser.id,
        client_id: clientId,
        refresh_token: userData.refreshToken,
        expires,
      },
    ]);

    return newUser;
  }

  async upsertUserRefreshToken(
    userId: string,
    refreshToken: string,
    expires: Date,
    clientId: number
  ) {
    await this.delRefreshTokenForUser(userId);
    await this.dbAccess!('user_refresh_tokens').insert([
      {
        user_id: userId,
        client_id: clientId,
        refresh_token: refreshToken,
        expires,
      },
    ]);
  }

  async delRefreshTokenForUser(userId: string) {
    return this.dbAccess!('user_refresh_tokens').where('user_id', userId).del();
  }
}

export default UsersRepository;
