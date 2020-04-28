import { injectable, Joi, inject } from './types';
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
    // read static property value
    const schema = Joi.object(this.constructor['validationRules'] || {});
    // TODO: include by default validation for userId for all not public routes
    // include userData loaded from redis or db
    return schema.validate(params);
  }

  // empty base implementation
  async execute(params: any): Promise<any> {}

  async run(params: any): Promise<any> {
    const { value: validated, error } = this.validate(params);

    if (error) {
      throw new Error(error);
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
