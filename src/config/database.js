import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
//Carrega parâmetros do sistema
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  });

/*
const sequelize = new Sequelize('bot_suite', 'texugodba', 'sa348klj5#$F#2', {
  host: 'ls-85eccdf1b92a2ad52528caf4d5d0ffd850438ac3.cviio4pqlypz.us-east-1.rds.amazonaws.com',
  dialect: 'mysql',
});
*/
export default sequelize; 
