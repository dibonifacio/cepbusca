import db from '../config/database_mysql.js';

async function getAllCities(page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, name, ddd, zip_start, zip_end, slug_full, state_name, state_code, population
               FROM city ORDER BY name 
               LIMIT ? OFFSET ?`;
  const params = [pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getAllCitiesSitemap(page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, name, ddd, zip_start, zip_end, slug_full, state_name, state_code, population
               FROM city ORDER BY name DESC
               LIMIT ? OFFSET ?`;
  const params = [pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getAllCitiesCount() {
  const sql = `SELECT count(*) as qty 
               FROM city`; 
  const params = [];
  const cityCount = await db.runSqlOne(sql, params);
  return cityCount.qty;
};

async function getNearCities(cityId) {
  const sql = `SELECT id, name, ddd, zip_start, zip_end, slug_full, state_code, population
               FROM city c INNER JOIN city_near cn ON c.id = cn.near_city_id
               WHERE cn.city_id = ?
               ORDER BY cn.rank `;
  const params = [cityId];
  return await db.runSqlMany(sql, params);
};

async function getCapitalByState(stateId) {
  const sql = `SELECT * 
               FROM city WHERE state_id = ? AND capital=1`;
  const params = [stateId];
  return await db.runSqlOne(sql, params);
};

async function getCitiesByState(stateId, page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT name, ddd, population, zip_start, zip_end, slug_full 
               FROM city WHERE state_id = ? ORDER BY name
               LIMIT ? OFFSET ?`;
  const params = [stateId, pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getCityIbgeById(cityId) {
  const sql = `SELECT *
               FROM ibge_cidade WHERE ibge = ?`;
  const params = [cityId];
  return await db.runSqlOne(sql, params);
};

async function getCitiesByStateCount(stateId) {
  const sql = `SELECT count(*) as qty 
               FROM city WHERE state_id = ? ORDER BY name`;
  const params = [stateId];
  const cityCount = await db.runSqlOne(sql, params);
  return cityCount.qty;
};

async function getCitiesByStatePopulation(stateId, pageSize) {
  const sql = `SELECT name, ddd, population, zip_start, zip_end, slug_full, state_code
               FROM city WHERE state_id = ? ORDER BY population desc
               LIMIT ?`;
  const params = [stateId, pageSize];
  return await db.runSqlMany(sql, params);
};

async function getCitiesPopulation(pageSize) {
  const sql = `SELECT name, state_name, state_code, ddd, zip_start, zip_end, population, slug_full, state_slug
               FROM city ORDER BY population desc
               LIMIT ?`;
  const params = [pageSize];
  return await db.runSqlMany(sql, params);
};

async function getCapitalDistance(cityId, pageSize) {
  const sql = `select name, state_code, slug_full, distance
              from city c inner join city_capital_distance cc on cc.city_id2 = c.id
              where cc.city_id = ?
              order by rank
              LIMIT ?`;
  const params = [cityId, pageSize];
  return await db.runSqlMany(sql, params);
};

async function getNearCityDistance(cityId, pageSize) {
  const sql = `select name, state_code, slug_full, distance
              from city c inner join city_near_distance cc on cc.city_id2 = c.id
              where cc.city_id = ?
              order by rank
              LIMIT ?`;
  const params = [cityId, pageSize];
  return await db.runSqlMany(sql, params);
};

async function getCityBySlug(slug) {
  const sql = `SELECT *
               FROM city WHERE slug_full = ?`;
  const params = [slug];
  return await db.runSqlOne(sql, params);
};

async function getCityById(id) {
  const sql = `SELECT *
               FROM city WHERE id = ?`;
  const params = [id];
  return await db.runSqlOne(sql, params);
};


// Exportação default das funções como um objeto
export default {
  getAllCities,
  getAllCitiesSitemap,
  getAllCitiesCount,
  getNearCities,
  getCityIbgeById,
  getCapitalByState,
  getCitiesByState,
  getCitiesByStateCount,
  getCapitalDistance,
  getNearCityDistance,
  getCitiesByStatePopulation,
  getCitiesPopulation,
  getCityBySlug,
  getCityById
};