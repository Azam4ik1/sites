import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import SideMenu from '@/components/public/SideMenu';
import { getPublicSettings } from '@/lib/public-data';
import { db } from '@/lib/db';
import { Newspaper, Calendar, ArrowRight, Search, Filter } from 'lucide-react';

export const revalidate = 0;

export default async function NewsArchivePage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; search?: string; page?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const selectedCategory = resolvedParams.category || '';
  const searchQuery = resolvedParams.search || '';
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const limit = 6;
  const offset = (currentPage - 1) * limit;

  const settings = getPublicSettings();

  // Fetch categories
  const categoriesRows = db.prepare("SELECT DISTINCT category FROM news WHERE status = 'published' AND category IS NOT NULL AND category != ''").all() as { category: string }[];
  const categories = categoriesRows.map(r => r.category);

  // Build query
  let whereClauses = ["status = 'published'"];
  const params: any[] = [];

  if (selectedCategory) {
    whereClauses.push('category = ?');
    params.push(selectedCategory);
  }

  if (searchQuery) {
    whereClauses.push('(title LIKE ? OR summary LIKE ? OR content LIKE ?)');
    const term = `%${searchQuery}%`;
    params.push(term, term, term);
  }

  const whereSql = whereClauses.join(' AND ');

  const countRow = db.prepare(`SELECT COUNT(*) as count FROM news WHERE ${whereSql}`).get(...params) as { count: number };
  const totalNews = countRow ? countRow.count : 0;
  const totalPages = Math.ceil(totalNews / limit) || 1;

  const newsItems = db.prepare(`
    SELECT id, title, slug, summary, category, featured_image, published_at, created_at
    FROM news
    WHERE ${whereSql}
    ORDER BY COALESCE(published_at, created_at) DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as any[];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header settings={settings} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-1">
            <SideMenu />
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col md:flex-row items-md-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#003366] font-bold text-xl">
                  <Newspaper className="w-6 h-6 text-yellow-500" />
                  <h1>Орхиви хабарҳо ва эълонҳо</h1>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Пурратарин маҷмӯи хабарҳо, конфронсҳо ва эълонҳои Коллеҷи тиббии ҷумҳуриявӣ
                </p>
              </div>

              {/* Search form */}
              <form method="GET" action="/news" className="flex items-center gap-2">
                {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    defaultValue={searchQuery}
                    placeholder="Ҷустуҷӯи хабар..."
                    className="pl-3 pr-8 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#003366]">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-bold text-gray-700 mr-2">
                <Filter className="w-3.5 h-3.5 text-yellow-600" />
                Категорияҳо:
              </span>
              <Link
                href={`/news${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${!selectedCategory ? 'bg-[#003366] text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
              >
                Ҳама ({totalNews})
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/news?category=${encodeURIComponent(cat)}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${selectedCategory === cat ? 'bg-[#003366] text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* News List Grid */}
            {newsItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-500 border border-gray-100 shadow-sm space-y-3">
                <Newspaper className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-base font-semibold">Ягон хабар ёфт нашуд.</p>
                <p className="text-xs">Илтимос, калимаи ҷустуҷӯиро тағйир диҳед ё филтрро пок кунед.</p>
                <Link href="/news" className="inline-block text-xs font-bold text-[#003366] hover:underline pt-2">
                  Нишон додани ҳамаи хабарҳо
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newsItems.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition flex flex-col justify-between"
                  >
                    <div>
                      {item.featured_image && (
                        <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                          <Image
                            src={item.featured_image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                      )}
                      <div className="p-5 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-blue-50 text-[#003366] px-2 py-0.5 rounded font-semibold">
                            {item.category || 'Хабарҳо'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.published_at ? new Date(item.published_at).toLocaleDateString('tg-TJ') : '15.08.2026'}
                          </span>
                        </div>

                        <h2 className="font-bold text-gray-900 text-base leading-snug hover:text-[#003366] transition">
                          <Link href={`/news/${item.slug}`}>
                            {item.title}
                          </Link>
                        </h2>

                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <Link
                        href={`/news/${item.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003366] hover:text-yellow-600 transition"
                      >
                        <span>Муфассал хондан</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const queryParams = new URLSearchParams();
                  if (selectedCategory) queryParams.set('category', selectedCategory);
                  if (searchQuery) queryParams.set('search', searchQuery);
                  queryParams.set('page', pageNum.toString());

                  return (
                    <Link
                      key={pageNum}
                      href={`/news?${queryParams.toString()}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition ${currentPage === pageNum ? 'bg-[#003366] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
