// transports.js
import winston from 'winston';

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  new winston.transports.File({ filename: 'logs/app.log' }),
  new winston.transports.File({ filename: 'logs/validation-errors.log', level: 'warn' }) // Para erros de validação de URLs
  /*
  new winston.transports.MongoDB({
    db: 'mongodb://localhost:27017/seuBancoDeDados',
    options: { useUnifiedTopology: true },
    collection: 'logs',
    level: 'error'  // Armazenar apenas logs de nível 'error' no MongoDB
  })
  */
];

export { transports };
