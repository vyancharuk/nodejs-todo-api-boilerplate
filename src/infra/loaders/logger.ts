import winston from 'winston';
import rTracer from 'cls-rtracer';
import config from '../../config/app';

const transports: winston.transports.ConsoleTransportInstance[] = [];

const customFormat = winston.format.printf(
  ({ level, message, timestamp }) => {
    const traceId = rTracer.id() || 'NO-TRACE-ID';
    return `${level} ${timestamp} [${traceId}] ${message}`;
  }
);

if (config.env === 'test') {
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
