'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Phone, Mail, MapPin, Search, Menu, X, Globe, ChevronDown, BookOpen } from 'lucide-react';

interface HeaderProps {
  settings?: any;
}

export default function Header({ settings }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'tj' | 'ru'>('tj');
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const phone = settings?.phone || '+992 (372) 39-89-44';
  const email = settings?.email || 'medcoll.tj@mail.ru';
  const address = settings?.address || 'ш. Душанбе, кӯчаи Раҳмон Набиев, 248';

  return (
    <header className="w-full bg-white shadow-md border-b border-gray-100 font-sans">
      {/* Top Header Contact Bar */}
      <div className="bg-[#002244] text-white text-xs py-2 px-4 border-b border-yellow-500/30">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-4 text-gray-200">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span>{address}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-yellow-400 transition">{phone}</a>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-yellow-400 transition">{email}</a>
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Social Icons */}
            <div className="flex items-center gap-2 text-gray-300">
              <a href={settings?.socialLinks?.facebook || "#"} target="_blank" rel="noreferrer" className="hover:text-yellow-400 transition" title="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={settings?.socialLinks?.instagram || "#"} target="_blank" rel="noreferrer" className="hover:text-yellow-400 transition" title="Instagram">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href={settings?.socialLinks?.youtube || "#"} target="_blank" rel="noreferrer" className="hover:text-yellow-400 transition" title="YouTube">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 border-l border-gray-600 pl-3">
              <Globe className="w-3.5 h-3.5 text-yellow-400" />
              <button
                onClick={() => setLang('tj')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${lang === 'tj' ? 'bg-yellow-500 text-gray-900 font-bold' : 'text-gray-300 hover:text-white'}`}
              >
                Тоҷикӣ
              </button>
              <button
                onClick={() => setLang('ru')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${lang === 'ru' ? 'bg-yellow-500 text-gray-900 font-bold' : 'text-gray-300 hover:text-white'}`}
              >
                Русский
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-16 h-16 shrink-0 transition transform group-hover:scale-105">
            <Image
              src="/logo.svg"
              alt="Логотип Коллеҷи тиббӣ"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-yellow-600 block">
              Муассисаи давлатии таълимии
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#003366] leading-tight group-hover:text-blue-800 transition">
              «Коллеҷи тиббии ҷумҳуриявӣ»
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Вазорати тандурустӣ ва ҳифзи иҷтимоии аҳолии Ҷумҳурии Тоҷикистон
            </p>
          </div>
        </Link>

        {/* Search Bar & Action */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex-1 md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ҷустуҷӯ дар сайт..."
              className="w-full pl-3 pr-9 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#003366] transition p-1"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Quick CMS Link */}
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#003366] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition shrink-0"
          >
            <span>Панели CMS</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#003366] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar (Sticky/Fixed) */}
      <nav className="bg-[#003366] text-white shadow-md relative z-30">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <ul className="hidden md:flex items-center space-x-1 text-sm font-semibold">
            <li>
              <Link href="/" className="block py-3.5 px-4 hover:bg-blue-900 transition border-b-2 border-transparent hover:border-yellow-400">
                Асосӣ
              </Link>
            </li>
            <li>
              <Link href="/p/about" className="block py-3.5 px-4 hover:bg-blue-900 transition border-b-2 border-transparent hover:border-yellow-400">
                Коллеҷ
              </Link>
            </li>
            <li>
              <Link href="/p/students" className="block py-3.5 px-4 hover:bg-blue-900 transition border-b-2 border-transparent hover:border-yellow-400">
                Ба донишҷӯён
              </Link>
            </li>
            <li>
              <Link href="/p/applicants" className="block py-3.5 px-4 hover:bg-blue-900 transition border-b-2 border-transparent hover:border-yellow-400">
                Ба довталабон
              </Link>
            </li>
            <li>
              <Link href="/p/president" className="block py-3.5 px-4 hover:bg-blue-900 transition border-b-2 border-transparent hover:border-yellow-400">
                Президент
              </Link>
            </li>
            <li className="relative group">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="flex items-center gap-1 py-3.5 px-4 hover:bg-blue-900 transition border-b-2 border-transparent group-hover:border-yellow-400"
              >
                <span>Бештар</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-white text-gray-800 rounded-b-lg shadow-xl py-2 hidden group-hover:block border border-gray-100 z-50">
                <Link href="/p/administration" className="block px-4 py-2 hover:bg-blue-50 hover:text-[#003366] text-sm">
                  Маъмурият
                </Link>
                <Link href="/p/departments" className="block px-4 py-2 hover:bg-blue-50 hover:text-[#003366] text-sm">
                  Кафедраҳо
                </Link>
                <Link href="/p/newspaper" className="block px-4 py-2 hover:bg-blue-50 hover:text-[#003366] text-sm">
                  Газетаи «Шафқат»
                </Link>
                <Link href="/contacts" className="block px-4 py-2 hover:bg-blue-50 hover:text-[#003366] text-sm">
                  Тамос
                </Link>
              </div>
            </li>
          </ul>

          <div className="hidden md:flex items-center gap-2 py-2">
            <span className="text-xs bg-yellow-500 text-gray-900 font-bold px-2.5 py-1 rounded shadow-sm">
              Соли таъсис: 1935
            </span>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#002244] border-t border-blue-900 py-3 px-4 space-y-2">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white font-medium hover:text-yellow-400">
              Асосӣ (Главная)
            </Link>
            <Link href="/p/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white font-medium hover:text-yellow-400">
              Коллеҷ (О колледже)
            </Link>
            <Link href="/p/students" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white font-medium hover:text-yellow-400">
              Ба донишҷӯён
            </Link>
            <Link href="/p/applicants" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white font-medium hover:text-yellow-400">
              Ба довталабон
            </Link>
            <Link href="/p/president" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white font-medium hover:text-yellow-400">
              Президент
            </Link>
            <Link href="/p/administration" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white font-medium hover:text-yellow-400">
              Маъмурият
            </Link>
            <Link href="/contacts" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white font-medium hover:text-yellow-400">
              Тамос ва Хатти алоқа
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
