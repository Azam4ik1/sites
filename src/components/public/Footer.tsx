import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, HeartHandshake } from 'lucide-react';

interface FooterProps {
  settings?: any;
}

export default function Footer({ settings }: FooterProps) {
  const phone = settings?.phone || '+992 (372) 39-89-44';
  const email = settings?.email || 'medcoll.tj@mail.ru';
  const address = settings?.address || 'ш. Душанбе, кӯчаи Раҳмон Набиев, 248';

  return (
    <footer className="bg-[#002244] text-white pt-12 pb-6 border-t-4 border-yellow-500 font-sans">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* About College */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="College Logo" width={48} height={48} />
            <div>
              <h3 className="font-extrabold text-base leading-tight text-white">МДТ «Коллеҷи тиббии ҷумҳуриявӣ»</h3>
              <p className="text-xs text-yellow-400 font-semibold">Соли таъсис: 1935</p>
            </div>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Муассисаи давлатии таълимии «Коллеҷи тиббии ҷумҳуриявӣ» яке аз куҳантарин ва бонуфузтарин муассисаҳои таълимии тиббии Ҷумҳурии Тоҷикистон мебошад.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-sm text-yellow-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-700">
            Пайвандҳои муҳим
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li><Link href="/p/about" className="hover:text-yellow-400 transition">Дар бораи коллеҷ</Link></li>
            <li><Link href="/p/administration" className="hover:text-hover-yellow transition">Маъмурият ва роҳбарият</Link></li>
            <li><Link href="/p/applicants" className="hover:text-yellow-400 transition">Қоидаҳои қабули довталабон</Link></li>
            <li><Link href="/p/students" className="hover:text-yellow-400 transition">Маълумот барои донишҷӯён</Link></li>
            <li><Link href="/p/newspaper" className="hover:text-yellow-400 transition">Газетаи «Шафқат»</Link></li>
            <li><Link href="/contacts" className="hover:text-yellow-400 transition">Алоқа ва ҷойгиршавӣ</Link></li>
          </ul>
        </div>

        {/* Specialties / Faculties */}
        <div>
          <h4 className="font-bold text-sm text-yellow-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-700">
            Ихтисосҳо
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li><Link href="/faculties/kori-tabobati" className="hover:text-yellow-400 transition">Кори табобатӣ</Link></li>
            <li><Link href="/faculties/kori-momodoyagi" className="hover:text-yellow-400 transition">Кори момодоягӣ</Link></li>
            <li><Link href="/faculties/kori-hamshiragi" className="hover:text-yellow-400 transition">Кори ҳамширагӣ</Link></li>
            <li><Link href="/faculties/kori-farmatsevti" className="hover:text-yellow-400 transition">Кори фарматсевтӣ</Link></li>
            <li><Link href="/faculties/kori-dandonsozi" className="hover:text-yellow-400 transition">Кори дандонсозӣ</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-sm text-yellow-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-700">
            Маълумоти тамос
          </h4>
          <ul className="space-y-3 text-xs text-gray-300">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>{phone}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>{email}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>Душанбе - Ҷумҳурии Тоҷикистон</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-2">
        <p>© 1935–{new Date().getFullYear()} МДТ «Коллеҷи тиббии ҷумҳуриявӣ». Ҳамаи ҳуқуқҳо ҳифз карда шудаанд.</p>
        <p className="flex items-center gap-1">
          <span>Низоми идоракунии вебсайт</span>
          <Link href="/admin" className="text-yellow-400 font-semibold hover:underline ml-1">CMS Panel</Link>
        </p>
      </div>
    </footer>
  );
}
