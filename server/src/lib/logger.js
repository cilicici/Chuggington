import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const config = {
  filename: 'application.log',
  folder: './/log//',
  logLevel: 'info',
};

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(
    (info) => `[${info.moduleName}] ${info.timestamp} ${info.level}: ${info.message}`,
  ),
);
const transport = new DailyRotateFile({
  filename: config.folder + config.filename,
  datePattern: 'YYYY-MM-DD-HH-mm',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '5',
  prepend: true,
  level: config.logLevel,
});

const logger = winston.createLogger({
  format: logFormat,
  transports: [
    transport,
    new winston.transports.Console({
      level: 'info',
    }),
  ],
});

export default (name) => logger.child({ moduleName: name });
