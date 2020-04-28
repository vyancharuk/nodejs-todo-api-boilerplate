import winston from 'winston';
import config from '../../config/app';

// TODO: configure properly logger
const transports: winston.transports.ConsoleTransportInstance[] = [];

const customFormat = winston.format.printf(
  ({ level, message, label, timestamp }) => {
    // return `${timestamp} [${label}] ${level}: ${message}`;
    return `${timestamp} ${level}: ${message}`;
  }
);

if (config.env !== 'dev') {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({
      level: 'info',
      handleExceptions: true,
      format: winston.format.combine(
        // winston.format.label({ label: 'dev' }),
        winston.format.colorize(),
        winston.format.timestamp({ format: 'MM/DD HH:mm:ss:SSS' }),
        customFormat
      ),
    })
  );
}

const loggerInstance = winston.createLogger({
  level: config.logs.level,
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

// export default {
//   log: (msg: string) => {
//     loggerInstance.info(msg);
//   },
//   error: (err: string) => {
//     loggerInstance.error(err);
//   }
// };

export default loggerInstance;
