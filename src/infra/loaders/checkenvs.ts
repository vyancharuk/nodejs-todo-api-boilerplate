import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import logger from '../loaders/logger';

export default () => {
  const config = dotenv.parse(
    fs.readFileSync(path.resolve(process.cwd(), '.env.sample'))
  );

  Object.keys(config).forEach(envName => {
    const isOptional = config[envName].trim() === '?';

    if (!isOptional && !process.env[envName]) {
      throw new Error(`Mandatory env var ${envName} is missing`);
    } else if (isOptional && !process.env[envName]) {
      logger.warn(`Optional env var ${envName} is missing`);
    }
  });
};
