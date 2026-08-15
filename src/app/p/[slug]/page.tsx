import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import SideMenu from '@/components/public/SideMenu';
import { getPageBySlug, getPublicSettings } from '@/lib/public-data';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface StaticPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StaticPageProps) {
  const resolvedParams = await params;
  const page = getPageBySlug(resolvedParams.slug) as any;
  if (!page) return {};
  return {
    title: page.seo_title || `${page.title} | МДТ Коллеҷи тиббии ҷумҳуриявӣ`,
    description: page.seo_description || page.summary,
  };
}

export default async function DynamicStaticPage({ params }: StaticPageProps) {
  const resolvedParams = await params;
  const page = getPageBySlug(resolvedParams.slug) as any;
  const settings = getPublicSettings();

  if (!page) {
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
              className="inline-flex items-center gap-2 text-xs font-bold text-[#003366] hover:text-yellow-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Баргаштан ба саҳифаи асосӣ</span>
            </Link>

            <div className="border-b border-gray-100 pb-4 space-y-2">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-[#003366] px-3 py-1 rounded-full text-xs font-bold">
                <BookOpen className="w-4 h-4 text-yellow-600" />
                <span>Саҳифаи расмӣ</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-[#003366]">
                {page.title}
              </h1>
            </div>

            {page.featured_image && (
              <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-sm bg-gray-100">
                <Image
                  src={page.featured_image}
                  alt={page.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div
              className="prose max-w-none text-gray-800 text-sm md:text-base leading-relaxed space-y-4 pt-2"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </article>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
