// formats.js
import winston from 'winston';
import path from 'path';

// Define different colors for each level.
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston to add colors to the severity levels.
winston.addColors(colors);

// Custom format to include file and line number.
const errorFormat = winston.format(info => {
  if (info.stack) {
    const stackList = info.stack.split('\n');
    const stack = stackList[1] ? stackList[1].trim() : stackList[0];
    const match = stack.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      const parts = match[1].split(':');
      info.file = path.basename(parts[0]);
      info.line = parts[1];
    }
  }
  return info;
});

const format = winston.format.combine(
  // Add the message timestamp with the preferred format.
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Tell Winston that the logs must be colored.
  winston.format.colorize({ all: true }),
  // Include file and line number.
  errorFormat(),
  // Define the format of the message showing the timestamp, the level, the message, the file, and the line number.
  winston.format.printf((info) => {
    const fileLine = info.file && info.line ? `${info.file}:${info.line} - ` : '';
    return `${info.timestamp} ${info.level}: ${fileLine}${info.message}`;
  })
);

export { format };
