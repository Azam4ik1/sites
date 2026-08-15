import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import SideMenu from '@/components/public/SideMenu';
import {
  getPublicSettings,
  getPublishedNews,
  getActiveFaculties
} from '@/lib/public-data';
import {
  Award, BookOpen, Users, Calendar, ArrowRight, Newspaper,
  PhoneCall, ShieldCheck, CheckCircle2, GraduationCap, Building2, Quote
} from 'lucide-react';

export default function HomePage() {
  const settings = getPublicSettings();
  const newsList = getPublishedNews(6);
  const faculties = getActiveFaculties();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header settings={settings} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <SideMenu />
          </div>

          {/* Center Main Content Area */}
          <div className="lg:col-span-3 space-y-10">

            {/* Hero Banner Section */}
            <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#002244] via-[#003366] to-[#004080] text-white p-8 md:p-12 shadow-xl border-b-4 border-yellow-500">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  <span>Таълими тиббии касбӣ аз соли 1935</span>
                </div>

                <h1 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight text-white">
                  Муассисаи давлатии таълимии «Коллеҷи тиббии ҷумҳуриявӣ»
                </h1>

                <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                  Омодасозии мутахассисони баландпояи соҳаи тандурустӣ, ҳамширагӣ, фарматсевтӣ ва табобатӣ бо истифода аз технологияҳои муосири таълимӣ.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/p/applicants"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-sm rounded-xl transition shadow-lg transform hover:-translate-y-0.5"
                  >
                    <span>Ба довталабон</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/p/about"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl backdrop-blur-sm border border-white/20 transition"
                  >
                    <span>Таърихи коллеҷ</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* President Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-40 h-52 shrink-0 rounded-xl overflow-hidden shadow-md border-2 border-yellow-500 bg-gray-100">
                  <Image
                    src="/president.jpg"
                    alt="Президенти Ҷумҳурии Тоҷикистон Эмомали Раҳмон"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="space-y-3 flex-1">
                  <div className="inline-block bg-blue-50 text-[#003366] text-xs font-bold px-3 py-1 rounded-md">
                    Пешвои миллат
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-[#003366]">
                    Эмомалӣ Раҳмон
                  </h2>

                  <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">
                    Асосгузори сулҳу ваҳдати миллӣ – Пешвои миллат, Президенти Ҷумҳурии Тоҷикистон
                  </p>

                  <blockquote className="text-sm text-gray-700 italic bg-gray-50 p-4 rounded-xl border-l-4 border-[#003366]">
                    «Тандурустии аҳолӣ сарвати бебаҳои давлат ва ҷомеа мебошад. Мо ҳамеша кӯшиш менамоем, ки барои омода намудани кадрҳои баландихтисоси тиббӣ шароити мусоид фароҳам оварем.»
                  </blockquote>
                </div>
              </div>
            </section>

            {/* Ibn Sino Legacy Banner */}
            <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/60 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-28 h-28 shrink-0 rounded-full overflow-hidden shadow-inner border-2 border-amber-400 bg-white">
                <Image
                  src="/ibn-sino.jpg"
                  alt="Абӯалӣ ибни Сино"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <span className="text-xs font-bold uppercase text-amber-700 tracking-wider">Мероси бузурги тиббӣ</span>
                <h3 className="text-lg font-extrabold text-gray-900">Абӯалӣ ибни Сино (Авиценна)</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Анъанаҳои пуршарафи соҳаи тибби тоҷик аз осори шаҳриёри мулки тиб Ибни Сино маншаъ гирифта, имрӯз дар фаъолияти таълимии Коллеҷи тиббии ҷумҳуриявӣ идома меёбанд.
                </p>
              </div>
            </section>

            {/* Specialties / Faculties Section */}
            <section id="faculties" className="space-y-6">
              <div className="flex items-center justify-between border-b-2 border-yellow-500 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#003366]" />
                  <h2 className="text-xl font-bold text-[#003366]">Факултетҳо ва Ихтисосҳо</h2>
                </div>
                <span className="text-xs font-semibold text-gray-500">11 Ихтисос</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {faculties.map((faculty: any) => (
                  <Link
                    key={faculty.id}
                    href={`/faculties/${faculty.slug}`}
                    className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-xl border border-gray-100 hover:border-yellow-400 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-[#003366] text-[#003366] group-hover:text-yellow-400 flex items-center justify-center transition">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-[#003366] text-base transition line-clamp-1">
                        {faculty.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {faculty.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-2 border-t border-gray-50 flex items-center justify-between text-xs text-[#003366] font-semibold">
                      <span>Муфассал</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* News Section */}
            <section id="news" className="space-y-6">
              <div className="flex items-center justify-between border-b-2 border-yellow-500 pb-3">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-[#003366]" />
                  <h2 className="text-xl font-bold text-[#003366]">Хабарҳои охирин</h2>
                </div>
                <Link href="/news" className="text-xs font-bold text-[#003366] hover:text-yellow-600 transition flex items-center gap-1">
                  <span>Орхив</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newsList.map((item: any) => (
                  <article
                    key={item.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition flex flex-col justify-between"
                  >
                    <div>
                      {item.featured_image && (
                        <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
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

                        <h3 className="font-bold text-gray-900 text-base leading-snug hover:text-[#003366] transition">
                          <Link href={`/news/${item.slug}`}>
                            {item.title}
                          </Link>
                        </h3>

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
                        <span>Муфассалтархондан</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Director Block */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-36 h-44 shrink-0 rounded-xl overflow-hidden shadow border-2 border-[#003366] bg-gray-100">
                  <Image
                    src="/director.jpg"
                    alt="Директор"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Роҳбарияти Муассиса</span>
                  <h3 className="text-xl font-bold text-[#003366]">Ҷабборзода Умед Убайдулло</h3>
                  <p className="text-xs font-semibold text-gray-500">Директори Муассисаи давлатии таълимии «Коллеҷи тиббии ҷумҳуриявӣ»</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    «Ҳадафи асосии мо омода намудани кадрҳои тиббии сазовор ва дорои донишу малакаҳои муосир барои хизматрасонии баландсифат ба аҳолии кишварамон мебошад.»
                  </p>
                </div>
              </div>
            </section>

            {/* Useful Links & Partners */}
            <section className="bg-gradient-to-r from-[#002244] to-[#003366] text-white rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-yellow-400 uppercase tracking-wider text-center md:text-left">
                Сайтҳои муфид ва ҳамкорон
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <a href="http://president.tj" target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition border border-white/10 block">
                  <p className="font-bold text-white">Президенти Тоҷикистон</p>
                  <p className="text-gray-300 text-[11px]">president.tj</p>
                </a>
                <a href="http://moh.tj" target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition border border-white/10 block">
                  <p className="font-bold text-white">Вазорати тандурустӣ</p>
                  <p className="text-gray-300 text-[11px]">moh.tj</p>
                </a>
                <a href="http://maaofrif.tj" target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition border border-white/10 block">
                  <p className="font-bold text-white">Вазорати маориф</p>
                  <p className="text-gray-300 text-[11px]">maorif.tj</p>
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Floating Call & WhatsApp Button for Mobile */}
      <div className="fixed bottom-4 right-4 md:hidden z-50 flex flex-col gap-2">
        <a
          href="tel:+992372398944"
          className="w-12 h-12 rounded-full bg-[#003366] text-white flex items-center justify-center shadow-2xl border-2 border-yellow-400"
          title="Занг задан"
        >
          <PhoneCall className="w-5 h-5" />
        </a>
      </div>

      <Footer settings={settings} />
    </div>
  );
}
