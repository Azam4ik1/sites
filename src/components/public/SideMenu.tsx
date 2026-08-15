import React from 'react';
import Link from 'next/link';
import {
  Users, Newspaper, Building2, BookOpen,
  Award, FileText, Droplets, Mountain, Shield
} from 'lucide-react';

export default function SideMenu() {
  const links = [
    { name: 'Маъмурият', href: '/p/administration', icon: Users },
    { name: 'Хабарҳо', href: '/#news', icon: Newspaper },
    { name: 'Марказҳо', href: '/p/centers', icon: Building2 },
    { name: 'Кафедраҳо', href: '/p/departments', icon: BookOpen },
    { name: 'Факултетҳо', href: '/#faculties', icon: Award },
    { name: 'Конфронсҳо', href: '/p/conferences', icon: FileText },
    { name: 'Газетаи «Шафқат»', href: '/p/newspaper', icon: FileText },
    { name: 'Зеботарин манзараҳои Тоҷикистон', href: '/p/landscapes', icon: Mountain },
    { name: 'Нашрия', href: '/p/publications', icon: BookOpen },
    { name: 'Об барои рушди устувор', href: '/p/water-for-sustainable-development', icon: Droplets },
    { name: 'Соли «Рушди деҳот, сайёҳӣ ва ҳунарҳои мардумӣ»', href: '/p/rural-development', icon: Mountain },
    { name: 'Ҳисоботҳо', href: '/p/reports', icon: FileText },
    { name: 'Шӯрои директорон', href: '/p/council-of-directors', icon: Shield },
  ];

  return (
    <aside className="w-full bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden font-sans">
      <div className="bg-[#003366] text-white py-3.5 px-4 font-bold text-base flex items-center gap-2 border-b-2 border-yellow-500">
        <BookOpen className="w-5 h-5 text-yellow-400" />
        <span>Сохтори Коллеҷ</span>
      </div>
      <nav className="divide-y divide-gray-100 text-sm">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#003366] font-medium transition group"
            >
              <Icon className="w-4 h-4 text-gray-400 group-hover:text-yellow-600 transition shrink-0" />
              <span className="line-clamp-1">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* College Quick Contacts Box */}
      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-gray-100 mt-2 text-xs text-gray-600 space-y-2">
        <p className="font-bold text-[#003366] text-sm">Маркази Маълумот</p>
        <p>Тел: +992 (372) 39-89-44</p>
        <p>E-mail: medcoll.tj@mail.ru</p>
        <p className="text-gray-500 italic">Душанбе, кӯчаи Раҳмон Набиев, 248</p>
      </div>
    </aside>
  );
}
