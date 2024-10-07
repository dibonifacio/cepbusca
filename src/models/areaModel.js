import db from '../config/database_mysql.js';

async function getAllAreas(page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, name, zip_start, zip_end, slug_full, city_name, city_slug, state_code, state_slug 
               FROM area ORDER BY name 
               LIMIT ? OFFSET ?`;
  const params = [pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getAllAreasSitemap(page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, name, zip_start, zip_end, slug_full, city_name, city_slug, state_code, state_slug 
               FROM area ORDER BY name DESC
               LIMIT ? OFFSET ?`;
  const params = [pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getAllAreasCount() {
  const sql = 'SELECT count(*) as qty FROM area'; 
  const params = [];
  const cityCount = await db.runSqlOne(sql, params);
  return cityCount.qty;
};

async function getNearAreas(areaId) {
  const sql = `SELECT id, name, zip_start, zip_end, slug_full
               FROM area c INNER JOIN area_near cn ON c.id = cn.near_area_id
               WHERE cn.area_id = ?
               ORDER BY cn.rank `;
  const params = [areaId];
  return await db.runSqlMany(sql, params);
};

async function getAreasByCity(cityId, page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, name, zip_start, zip_end, slug_full, address_qty
              FROM area WHERE city_id = ? ORDER BY name
              LIMIT ? OFFSET ?`;
  const params = [cityId, pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getAreasByCityCount(cityId) {
  const sql = `SELECT count(*) as qty
              FROM area WHERE city_id = ?`;
  const params = [cityId];
  const areaCount = await db.runSqlOne(sql, params);
  return areaCount.qty;
};

async function getAreasByState(stateId, page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, name, zip_start, zip_end, slug_full, city_name, city_slug
              FROM area WHERE state_id = ? ORDER BY name
              LIMIT ? OFFSET ?`;
  const params = [stateId, pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getAreasByStateCount(stateId) {
  const sql = `SELECT count(*) as qty
              FROM area WHERE state_id = ?`;
  const params = [stateId];
  const areaCount = await db.runSqlOne(sql, params);
  return areaCount.qty;
};

async function getAreaBySlug(slug) {
  const sql = `SELECT *
              FROM area WHERE slug_full = ?`;
  const params = [slug];
  return await db.runSqlOne(sql, params);
};

// Exportação default das funções como um objeto
export default {
  getAllAreas,
  getAllAreasSitemap,
  getAllAreasCount,
  getNearAreas,
  getAreasByCity,
  getAreasByCityCount,
  getAreasByState,
  getAreasByStateCount,
  getAreaBySlug
};