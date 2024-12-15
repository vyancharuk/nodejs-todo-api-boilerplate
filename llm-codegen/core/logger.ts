import winston from 'winston';

const transports: winston.transports.ConsoleTransportInstance[] = [];

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${level} ${timestamp} ${message}`;
});

transports.push(
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'info',
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'MM/DD HH:mm:ss:SSS' }),
      customFormat
    ),
  })
);

const loggerInstance = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
});

const concatArgs = (arr: any[]) => {
  return arr
    .map((arg: any) => {
      if (arg && typeof arg === 'object') {
        return JSON.stringify(arg, null, 4);
      } else {
        return arg;
      }
    })
    .join(' ');
};

export default {
  info: (...args: unknown[]) => {
    loggerInstance.info(concatArgs(args));
  },
  error: (...args: unknown[]) => {
    loggerInstance.error(concatArgs(args));
  },
  warn: (...args: unknown[]) => {
    loggerInstance.warn(concatArgs(args));
  },
};
