import { db } from './db';

export function getPublicSettings() {
  const rows = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  if (!rows || rows.length === 0) return null;

  const settingsObj: Record<string, string> = {};
  for (const row of rows) {
    settingsObj[row.key] = row.value;
  }
  return settingsObj;
}

export function getPublishedNews(limit?: number) {
  let query = "SELECT id, title, slug, summary, content, category, featured_image, published_at, created_at FROM news WHERE status = 'published' ORDER BY COALESCE(published_at, created_at) DESC";
  if (limit) {
    query += ` LIMIT ${Number(limit)}`;
  }
  return db.prepare(query).all();
}

export function getNewsBySlug(slug: string) {
  return db.prepare("SELECT id, title, slug, summary, content, category, featured_image, published_at, created_at, seo_title, seo_description FROM news WHERE slug = ? AND status = 'published'").get(slug);
}

export function getActiveFaculties() {
  return db.prepare("SELECT id, name, slug, description, image, phone, email, head as dean, display_order FROM faculties WHERE status = 'active' ORDER BY display_order ASC, name ASC").all();
}

export function getFacultyBySlug(slug: string) {
  return db.prepare("SELECT id, name, slug, description, image, phone, email, head as dean, display_order FROM faculties WHERE slug = ? AND status = 'active'").get(slug);
}

export function getPublishedPages() {
  return db.prepare("SELECT id, title, slug, featured_image FROM pages WHERE status = 'published' ORDER BY title ASC").all();
}

export function getPageBySlug(slug: string) {
  return db.prepare("SELECT id, title, slug, content, featured_image, seo_title, seo_description FROM pages WHERE slug = ? AND status = 'published'").get(slug);
}

export function searchSite(query: string) {
  const term = `%${query}%`;

  const news = db.prepare("SELECT 'news' as type, title, slug, summary as excerpt, COALESCE(published_at, created_at) as date FROM news WHERE status = 'published' AND (title LIKE ? OR summary LIKE ? OR content LIKE ?) LIMIT 10").all(term, term, term);

  const faculties = db.prepare("SELECT 'faculty' as type, name as title, slug, description as excerpt, '' as date FROM faculties WHERE status = 'active' AND (name LIKE ? OR description LIKE ?) LIMIT 10").all(term, term);

  const pages = db.prepare("SELECT 'page' as type, title, slug, '' as excerpt, '' as date FROM pages WHERE status = 'published' AND (title LIKE ? OR content LIKE ?) LIMIT 10").all(term, term);

  return { news, faculties, pages };
}
