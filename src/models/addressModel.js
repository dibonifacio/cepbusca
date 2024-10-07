import db from '../config/database_mysql.js';

async function getAllAddress(page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, name, zip, slug_full, city_name, city_slug, state_name, state_code, state_slug 
               FROM address
               ORDER BY name
               LIMIT ? OFFSET ?`;
  const params = [pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getAllAddressSitemap(page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, name, zip, slug_full, city_name, city_slug, state_name, state_code, state_slug 
               FROM address
               ORDER BY name DESC
               LIMIT ? OFFSET ?`;
  const params = [pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getAllAddressCount() {
  const sql = 'SELECT count(*) as qty FROM address'; 
  const params = [];
  const addressCount = await db.runSqlOne(sql, params);
  return addressCount.qty;
};

async function getAddressByArea(areaId, page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT name, zip, slug_full, city_name, city_slug FROM address WHERE area_id = ? 
              ORDER BY name LIMIT ? OFFSET ?`;
  const params = [areaId, pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getAddressByAreaCount(areaId) {
  const sql = 'SELECT count(*) as qty FROM address WHERE area_id = ? '; 
  const params = [areaId];
  const addressCount = await db.runSqlOne(sql, params);
  return addressCount.qty;
};

async function getAddressByCity(cityId, page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT name, zip, slug_full FROM address WHERE city_id = ? 
              ORDER BY name LIMIT ? OFFSET ?`;
  const params = [cityId, pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getAddressByCityCount(cityId) {
  const sql = 'SELECT count(*) as qty FROM address WHERE city_id = ?';
  const params = [cityId];
  const addressCount = await db.runSqlOne(sql, params);
  return addressCount.qty;
};

async function getAddressByState(stateId, page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT name, zip, slug_full, city_name, city_slug FROM address WHERE state_id = ? 
              ORDER BY name LIMIT ? OFFSET ?`;
  const params = [stateId, pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getAddressByStateCount(stateId) {
  const sql = 'SELECT count(*) as qty FROM address WHERE state_id = ?';
  const params = [stateId];
  const addressCount = await db.runSqlOne(sql, params);
  return addressCount.qty;
};

async function getAddressBySlug(slug) {
  const sql = `SELECT *
               FROM address
               WHERE slug_full = ?`;
  const params = [slug];
  return await db.runSqlOne(sql, params);
};

// Exportação default das funções como um objeto
export default {
  getAllAddress,
  getAllAddressSitemap,
  getAllAddressCount,
  getAddressByArea,
  getAddressByAreaCount,
  getAddressByCity,
  getAddressByCityCount,
  getAddressByState,
  getAddressByStateCount,
  getAddressBySlug
};