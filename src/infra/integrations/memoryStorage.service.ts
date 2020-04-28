import { injectable, inject } from '../../common/types';
import { BINDINGS } from '../../common/constants';
import appConfig from '../../config/app';

// const DEFAULT_EXPIRATION = 1000 * 60 * 60; // 1 hour
const DEFAULT_EXPIRATION = appConfig.jwtDuration * 1000;

@injectable()
class MemoryStorage {
  @inject(BINDINGS.Redis)
  private _redis!: any;

  async setValue(
    key: string,
    value: any,
    expiresIn: number = DEFAULT_EXPIRATION
  ) {
    // PX means milliseconds https://redis.io/commands/set
    return this._redis.set(key, value, 'PX', expiresIn);
  }

  async getValue(key: string) {
    return this._redis.get(key);
  }

  async delValue(key: string) {
    return this._redis.del(key);
  }
}

export default MemoryStorage;
