import db from '../config/database_mysql.js';

async function getAllZip(page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, zip, slug_full, address, address_name, address_slug, city_name, city_slug, state_name, state_code, state_slug 
               FROM zip
               ORDER BY zip
               LIMIT ? OFFSET ?`;
  const params = [pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getAllZipCount() {
  const sql = 'SELECT count(*) as qty FROM zip'; 
  const params = [];
  const zipCount = await db.runSqlOne(sql, params);
  return zipCount.qty;
};

async function getNearZip(zip) {
  const sql = `SELECT id, address, zip, slug_full
               FROM zip c INNER JOIN zip_near cn ON c.id = cn.near_zip_id
               WHERE cn.zip_id = ?
               ORDER BY cn.rank `;
  const params = [zip];
  return await db.runSqlMany(sql, params);
};

async function getZipByCity(cityId, page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT zip, slug_full, address, address_name, address_slug, slug_full, area_name, area_slug FROM zip WHERE city_id = ? 
              ORDER BY zip LIMIT ? OFFSET ?`;
  const params = [cityId, pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getZipByCityCount(cityId) {
  const sql = 'SELECT count(*) as qty FROM zip WHERE city_id = ?';
  const params = [cityId];
  const zipCount = await db.runSqlOne(sql, params);
  return zipCount.qty;
};

async function getZipByState(stateId, page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT zip, slug_full, address, address_name, address_slug, area_name, area_slug, city_name, city_slug, state FROM zip WHERE state_id = ? 
              ORDER BY zip LIMIT ? OFFSET ?`;
  const params = [stateId, pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getZipByStateCount(stateId) {
  const sql = 'SELECT count(*) as qty FROM zip WHERE state_id = ?';
  const params = [stateId];
  const zipCount = await db.runSqlOne(sql, params);
  return zipCount.qty;
};

async function getZipByAddress(addressId) {
  const sql = `SELECT zip, slug_full, address, address_name, address_slug, area_name, area_slug, city_name, city_slug, state FROM zip WHERE address_id = ? 
              ORDER BY zip`;
  const params = [addressId];
  return await db.runSqlMany(sql, params);
};

async function getZipByAddressCount(addressId) {
  const sql = 'SELECT count(*) as qty FROM zip WHERE address_id = ?';
  const params = [addressId];
  const zipCount = await db.runSqlOne(sql, params);
  return zipCount.qty;
};

async function getZipBySlug(slug) {
  const sql = `SELECT * 
               FROM zip
               WHERE slug_full = ?`;
  const params = [slug];
  return await db.runSqlOne(sql, params);
};

async function getZipIbge(zip) {
  const sql = `SELECT * 
               FROM ibge_cep
               WHERE cep = ?`;
  const params = [zip];
  return await db.runSqlOne(sql, params);
};

// Exportação default das funções como um objeto
export default {
  getAllZip,
  getAllZipCount,
  getNearZip,
  getZipByCity,
  getZipByCityCount,
  getZipByState,
  getZipByStateCount,
  getZipByAddress,
  getZipByAddressCount,
  getZipBySlug,
  getZipIbge
};