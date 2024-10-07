import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
//Carrega parâmetros do sistema
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

async function runSqlOne(sql, params) {
  try {
    const [rows] = await pool.query(sql, params);
    return rows[0];
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function runSqlMany(sql, params) {
  try {
    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default {
  pool,
  runSqlOne,
  runSqlMany
}