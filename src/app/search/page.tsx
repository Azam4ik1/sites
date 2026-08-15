import React from 'react';
import Link from 'next/link';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import SideMenu from '@/components/public/SideMenu';
import { searchSite, getPublicSettings } from '@/lib/public-data';
import { Search, ArrowRight, FileText, GraduationCap, Newspaper } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const settings = getPublicSettings();
  const results = query ? searchSite(query) : { news: [], faculties: [], pages: [] };

  const totalResults = results.news.length + results.faculties.length + results.pages.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header settings={settings} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-1">
            <SideMenu />
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl p-6 md:p-10 shadow-md border border-gray-100 space-y-6">
            <div className="border-b border-gray-100 pb-4 space-y-2">
              <div className="flex items-center gap-2 text-[#003366] font-bold text-xl">
                <Search className="w-6 h-6 text-yellow-500" />
                <h1>Натиҷаҳои ҷустуҷӯ</h1>
              </div>
              <p className="text-sm text-gray-500">
                Ҷустуҷӯ барои калимаи: <strong className="text-gray-900">«{query}»</strong> ({totalResults} натиҷа пайдо шуд)
              </p>
            </div>

            {totalResults === 0 ? (
              <div className="py-12 text-center text-gray-500 space-y-3">
                <Search className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-base font-semibold">Ба пурсиши шумо ҳеҷ чиз пайдо нашуд.</p>
                <p className="text-xs">Лутфан калимаҳои дигарро имло карда дубора кӯшиш кунед.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* News Results */}
                {results.news.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-base font-bold text-[#003366] flex items-center gap-2 border-b pb-1">
                      <Newspaper className="w-4 h-4 text-yellow-600" />
                      <span>Хабарҳо</span>
                    </h2>
                    <div className="space-y-2">
                      {results.news.map((item: any) => (
                        <Link
                          key={item.slug}
                          href={`/news/${item.slug}`}
                          className="block p-3 rounded-lg hover:bg-blue-50 border border-gray-100 transition"
                        >
                          <h3 className="font-bold text-gray-900 text-sm hover:text-[#003366]">{item.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1">{item.excerpt}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Faculties Results */}
                {results.faculties.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-base font-bold text-[#003366] flex items-center gap-2 border-b pb-1">
                      <GraduationCap className="w-4 h-4 text-yellow-600" />
                      <span>Ихтисосҳо</span>
                    </h2>
                    <div className="space-y-2">
                      {results.faculties.map((item: any) => (
                        <Link
                          key={item.slug}
                          href={`/faculties/${item.slug}`}
                          className="block p-3 rounded-lg hover:bg-blue-50 border border-gray-100 transition"
                        >
                          <h3 className="font-bold text-gray-900 text-sm hover:text-[#003366]">{item.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1">{item.excerpt}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pages Results */}
                {results.pages.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-base font-bold text-[#003366] flex items-center gap-2 border-b pb-1">
                      <FileText className="w-4 h-4 text-yellow-600" />
                      <span>Саҳифаҳо</span>
                    </h2>
                    <div className="space-y-2">
                      {results.pages.map((item: any) => (
                        <Link
                          key={item.slug}
                          href={`/p/${item.slug}`}
                          className="block p-3 rounded-lg hover:bg-blue-50 border border-gray-100 transition"
                        >
                          <h3 className="font-bold text-gray-900 text-sm hover:text-[#003366]">{item.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1">{item.excerpt}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
