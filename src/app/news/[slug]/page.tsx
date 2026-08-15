import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import SideMenu from '@/components/public/SideMenu';
import { getNewsBySlug, getPublicSettings } from '@/lib/public-data';
import { Calendar, ArrowLeft, Share2, Tag } from 'lucide-react';

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsPageProps) {
  const resolvedParams = await params;
  const news = getNewsBySlug(resolvedParams.slug) as any;
  if (!news) return {};
  return {
    title: news.seo_title || `${news.title} | МДТ Коллеҷи тиббии ҷумҳуриявӣ`,
    description: news.seo_description || news.summary,
  };
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const resolvedParams = await params;
  const news = getNewsBySlug(resolvedParams.slug) as any;
  const settings = getPublicSettings();

  if (!news) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header settings={settings} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-1">
            <SideMenu />
          </div>

          <article className="lg:col-span-3 bg-white rounded-2xl p-6 md:p-10 shadow-md border border-gray-100 space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#003366] hover:text-yellow-600 transition mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Баргаштан ба саҳифаи асосӣ</span>
            </Link>

            <div className="space-y-3 border-b border-gray-100 pb-6">
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span className="bg-blue-50 text-[#003366] font-bold px-3 py-1 rounded-md">
                  {news.category || 'Хабарҳо'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {news.published_at ? new Date(news.published_at).toLocaleDateString('tg-TJ') : '15.08.2026'}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-[#003366] leading-tight">
                {news.title}
              </h1>

              {news.summary && (
                <p className="text-sm text-gray-600 font-medium leading-relaxed bg-gray-50 p-4 rounded-xl border-l-4 border-yellow-500">
                  {news.summary}
                </p>
              )}
            </div>

            {news.featured_image && (
              <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-sm bg-gray-100">
                <Image
                  src={news.featured_image}
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div
              className="prose max-w-none text-gray-800 text-sm md:text-base leading-relaxed space-y-4 pt-4"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Tag className="w-4 h-4 text-yellow-600" />
                <span>Категория: <strong>{news.category || 'Хабарҳо'}</strong></span>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
