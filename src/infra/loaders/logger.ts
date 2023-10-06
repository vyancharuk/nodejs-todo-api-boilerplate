import winston from 'winston';
import config from '../../config/app';

const transports: winston.transports.ConsoleTransportInstance[] = [];

const customFormat = winston.format.printf(
  ({ level, message }) => {
    return `${level}: ${message}`;
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

export default loggerInstance;
