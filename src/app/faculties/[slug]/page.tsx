import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import SideMenu from '@/components/public/SideMenu';
import { getFacultyBySlug, getPublicSettings } from '@/lib/public-data';
import { GraduationCap, ArrowLeft, Phone, Mail, UserCheck, CheckCircle } from 'lucide-react';

interface FacultyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: FacultyPageProps) {
  const resolvedParams = await params;
  const faculty = getFacultyBySlug(resolvedParams.slug) as any;
  if (!faculty) return {};
  return {
    title: `Ихтисоси ${faculty.name} | МДТ Коллеҷи тиббии ҷумҳуриявӣ`,
    description: faculty.description,
  };
}

export default async function FacultyDetailPage({ params }: FacultyPageProps) {
  const resolvedParams = await params;
  const faculty = getFacultyBySlug(resolvedParams.slug) as any;
  const settings = getPublicSettings();

  if (!faculty) {
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

          <div className="lg:col-span-3 bg-white rounded-2xl p-6 md:p-10 shadow-md border border-gray-100 space-y-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#003366] hover:text-yellow-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Баргаштан ба саҳифаи асосӣ</span>
            </Link>

            <div className="border-b border-gray-100 pb-6 space-y-3">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-[#003366] px-3 py-1 rounded-full text-xs font-bold">
                <GraduationCap className="w-4 h-4 text-yellow-600" />
                <span>Ихтисоси касбӣ</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-[#003366]">
                {faculty.name}
              </h1>

              <p className="text-sm text-gray-600 leading-relaxed">
                {faculty.description}
              </p>
            </div>

            {faculty.image && (
              <div className="relative w-full h-72 rounded-xl overflow-hidden shadow-sm bg-gray-100">
                <Image
                  src={faculty.image}
                  alt={faculty.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Faculty Details Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 text-sm">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-[#003366] shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Декан / Роҳбар</p>
                  <p className="font-bold text-gray-900">{faculty.dean || 'Ҷабборзода Умед Убайдулло'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#003366] shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Телефон</p>
                  <p className="font-bold text-gray-900">{faculty.phone || '+992 (372) 39-89-44'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#003366] shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Почтаи электронӣ</p>
                  <p className="font-bold text-gray-900">{faculty.email || 'medcoll.tj@mail.ru'}</p>
                </div>
              </div>
            </div>

            {/* Admissions Info */}
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-bold text-[#003366] flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-yellow-500" />
                <span>Шарҳ ва талаботи қабул ба ихтисос</span>
              </h2>

              <ul className="space-y-2 text-sm text-gray-700 bg-gray-50 p-5 rounded-xl border border-gray-200">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>Шакли таълим: Рӯзона / Онет</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>Муҳлати таҳсил: 2 то 3 сол (дар асоси маълумоти 9 ва 11-сола)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>Хатмкунандагон бо дипломи намунаи давлатӣ таъмин карда мешаванд.</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <Link
                href="/p/applicants"
                className="px-6 py-3 bg-[#003366] hover:bg-blue-900 text-white font-bold text-sm rounded-xl transition shadow"
              >
                Ҳуҷҷатҳо барои қабул
              </Link>
            </div>

          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
