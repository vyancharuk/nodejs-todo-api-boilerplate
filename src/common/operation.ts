import { injectable, inject } from './types';
import BaseRepository from './baseRepository';
import { BINDINGS } from './constants';

@injectable()
class BaseOperation {
  @inject(BINDINGS.MemoryStorage)
  protected _memoryStorage: any;

  @inject(BINDINGS.UsersRepository)
  private _usersRepo: any;

  // get all repositories injected into current instance
  getRepositories() {
    const repositories: BaseRepository[] = [];

    Object.getOwnPropertyNames(this).forEach((prop) => {
      if (this[prop] instanceof BaseRepository) {
        repositories.push(this[prop]);
      }
    });

    return repositories;
  }

  validate(params: any): any {
    if (this.constructor['validationRules']) {
      // read static ZOD property and parse
      return this.constructor['validationRules'].safeParse(params);
    }
    return { data: null, error: null };
  }

  // empty base implementation
  async execute(params: any): Promise<any> {}

  async run(params: any): Promise<any> {
    const { data: validated, error } = this.validate(params);

    if (error) {
      throw new Error(JSON.stringify(error.format()));
    }

    const { userId } = validated || {};
    let user = null;

    if (userId) {
      user = await this._memoryStorage.getValue(userId);

      if (!user) {
        user = await this._usersRepo.findById(userId);

        if (user) {
          await this._memoryStorage.setValue(userId, user);
        } else {
          throw new Error('JWT_TOKEN_HAS_INVALID_USER');
        }
      }
    }

    return this.execute({ ...validated, user });
  }
}

export default BaseOperation;
