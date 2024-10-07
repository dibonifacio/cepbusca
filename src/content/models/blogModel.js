import db from '../../config/database_mysql.js';

async function getAllPosts(page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, title, published_at, slug 
               FROM blog_post ORDER BY published_at DESC 
               LIMIT ? OFFSET ?`;
  const params = [pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getLastPosts(pageSize) {
  const pageSizeN = Number(pageSize);
  const sql = `select p.id, p.title, a.name as author, c.name as category, p.slug, p.published_at from 
                blog_post p inner join blog_author a on a.id = p.author_id
                inner join blog_category c on c.id = p.category_id
                order by p.published_at desc
                limit ?`;
  const params = [pageSizeN];
  return await db.runSqlMany(sql, params);
};

async function getPostsByCategory(categoryId, page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, title, published_at, slug 
               FROM blog_post 
               WHERE category_id = ?
               ORDER BY published_at DESC 
               LIMIT ? OFFSET ?`;
  const params = [categoryId, pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getPostsByTag(tagId, page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, title, published_at, slug 
               FROM blog_post 
               WHERE id IN (SELECT post_id FROM blog_post_tag WHERE tag_id = ? )
               ORDER BY published_at DESC 
               LIMIT ? OFFSET ?`;
  const params = [tagId, pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getPostsByDate(year, month, page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, title, published_at, slug 
               FROM blog_post 
               WHERE year(published_at) = ? AND month(published_at) = ?
               ORDER BY published_at DESC 
               LIMIT ? OFFSET ?`;
  const params = [year, month, pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getPostsByAuthor(authorId, page, pageSize) {
  const pageSizeN = Number(pageSize);
  const offset = (page - 1) * pageSize;
  const sql = `SELECT id, title, published_at, slug 
               FROM blog_post 
               WHERE author_id = ?
               ORDER BY published_at DESC 
               LIMIT ? OFFSET ?`;
  const params = [authorId, pageSizeN, offset];
  return await db.runSqlMany(sql, params);
};

async function getCategoryBySlug(slug) {
  const sql = `SELECT *
               FROM blog_category WHERE slug = ?`;
  const params = [slug];
  return await db.runSqlOne(sql, params);
};

async function getTagBySlug(slug) {
  const sql = `SELECT *
               FROM blog_tag WHERE slug = ?`;
  const params = [slug];
  return await db.runSqlOne(sql, params);
};

async function getAuthorBySlug(slug) {
  const sql = `SELECT *
               FROM blog_author WHERE slug = ?`;
  const params = [slug];
  return await db.runSqlOne(sql, params);
};

async function getPostBySlug(slug) {
  const sql = `SELECT *
               FROM blog_post WHERE slug = ?`;
  const params = [slug];
  return await db.runSqlOne(sql, params);
};

async function getAllCategories() {
  const sql = `SELECT id, name, slug 
               FROM blog_category ORDER BY sort_order ASC`;
  const params = [];
  return await db.runSqlMany(sql, params);
};

async function getAllTags() {
  const sql = `SELECT id, name, slug 
               FROM blog_tag ORDER BY name ASC`;
  const params = [];
  return await db.runSqlMany(sql, params);
};

async function getAllDates() {
  const sql = `SELECT id, year(published_at) as year, month(published_at) as month, CONCAT(year(published_at),'/',month(published_at)) as slug 
               FROM blog_post 
               GROUP BY year(published_at), month(published_at)
               ORDER BY year(published_at) DESC, month(published_at) DESC`;
  const params = [];
  return await db.runSqlMany(sql, params);
};


export default {
  getAllPosts,
  getLastPosts,
  getPostsByCategory,
  getPostsByTag,
  getPostsByDate,
  getPostsByAuthor,
  getAllCategories,
  getAllTags,
  getAllDates,
  getCategoryBySlug,
  getTagBySlug,
  getAuthorBySlug,
  getPostBySlug
};
  