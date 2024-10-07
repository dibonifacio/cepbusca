import db from '../../config/database_mysql.js';

async function getAllPages() {
  const sql = `SELECT id, title, slug 
               FROM content_page ORDER BY sort_order ASC`;
  const params = [];
  return await db.runSqlMany(sql, params);
};

async function getPageBySlug(slug) {
  const sql = `SELECT *
               FROM content_page WHERE slug = ?`;
  const params = [slug];
  return await db.runSqlOne(sql, params);
};


export default {
  getAllPages,
  getPageBySlug
};
  