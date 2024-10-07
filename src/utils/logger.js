// logger.js
import winston from 'winston';
import { format } from './loggerFormats.js';
import { transports } from './loggerTransports.js';

// Define your severity levels.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Set the current severity based on the current NODE_ENV.
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Create the logger instance that has to be exported and used to log messages.
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exceptionHandlers: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});

export default logger;
