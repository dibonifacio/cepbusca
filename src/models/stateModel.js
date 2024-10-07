import db from '../config/database_mysql.js';

async function getAllStates() {
  const sql = 'SELECT id, state_code, name, zip_start, zip_end, slug, capital, city_qty, area_qty, address_qty, zip_qty FROM state ORDER BY name';
  const params = [];
  return await db.runSqlMany(sql, params);
};

async function getAllStatesCount() {
  const sql = `SELECT count(*) as qty 
               FROM state`; 
  const params = [];
  const stateCount = await db.runSqlOne(sql, params);
  return stateCount.qty;
};

async function getStateBySlug(slug) {
  const sql = 'SELECT * FROM state WHERE slug = ?;';
  const params = [slug, 'name'];
  return await db.runSqlOne(sql, params);
};

// Exportação default das funções como um objeto
export default {
  getAllStates,
  getAllStatesCount,
  getStateBySlug
};
