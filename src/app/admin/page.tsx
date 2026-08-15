'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  GraduationCap,
  FileText,
  Users,
  Image as ImageIcon,
  PlusCircle,
  Upload,
  ArrowRight,
  Eye,
  Edit,
} from 'lucide-react';
import { useToast } from '@/components/admin/ToastContext';

interface Stats {
  newsCount: number;
  facultiesCount: number;
  pagesCount: number;
  usersCount: number;
  mediaCount: number;
}

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    newsCount: 0,
    facultiesCount: 0,
    pagesCount: 0,
    usersCount: 0,
    mediaCount: 0,
  });
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [newsRes, facultiesRes, pagesRes, usersRes, mediaRes] = await Promise.all([
        fetch('/api/news?limit=5'),
        fetch('/api/faculties'),
        fetch('/api/pages'),
        fetch('/api/users'),
        fetch('/api/media?limit=1'),
      ]);

      const newsData = await newsRes.json();
      const facultiesData = await facultiesRes.json();
      const pagesData = await pagesRes.json();
      const usersData = usersRes.ok ? await usersRes.json() : { data: [] };
      const mediaData = await mediaRes.json();

      setRecentNews(newsData.data || []);
      setStats({
        newsCount: newsData.pagination?.total || 0,
        facultiesCount: facultiesData.data?.length || 0,
        pagesCount: pagesData.data?.length || 0,
        usersCount: usersData.data?.length || 0,
        mediaCount: mediaData.pagination?.total || 0,
      });
    } catch (err) {
      showToast('Хатогӣ ҳангоми боргирии маълумоти панел', 'error');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Хабарҳо', count: stats.newsCount, icon: Newspaper, color: 'bg-blue-500', href: '/admin/news' },
    { label: 'Факултетҳо', count: stats.facultiesCount, icon: GraduationCap, color: 'bg-emerald-500', href: '/admin/faculties' },
    { label: 'Саҳифаҳо', count: stats.pagesCount, icon: FileText, color: 'bg-purple-500', href: '/admin/pages' },
    { label: 'Корбарон', count: stats.usersCount, icon: Users, color: 'bg-amber-500', href: '/admin/users' },
    { label: 'Файлҳои медиа', count: stats.mediaCount, icon: ImageIcon, color: 'bg-indigo-500', href: '/admin/media' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-navy-900 tracking-tight">Панели идоракунӣ (Dashboard)</h1>
        <p className="text-sm text-gray-500 mt-1">
          Хуш омадед ба системаи идоракунии мундариҷаи МДТ «Коллеҷи тиббии ҷумҳуриявӣ»
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gold-300 transition duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.label}</div>
                  <div className="text-2xl font-black text-navy-900 mt-1">{loading ? '...' : card.count}</div>
                </div>
                <div className={`${card.color} text-white p-3 rounded-xl shadow-md group-hover:scale-110 transition duration-200`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-base font-bold text-navy-900">Амалҳои суръатбахш (Quick Actions)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/news/new"
            className="flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-medium px-4 py-3 rounded-xl text-sm transition shadow"
          >
            <PlusCircle className="w-4 h-4 text-gold-400" />
            <span>Сохтани хабар</span>
          </Link>

          <Link
            href="/admin/faculties"
            className="flex items-center gap-2 bg-navy-50 hover:bg-navy-100 text-navy-900 font-medium px-4 py-3 rounded-xl text-sm border border-navy-100 transition"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Иловаи факултет</span>
          </Link>

          <Link
            href="/admin/pages"
            className="flex items-center gap-2 bg-navy-50 hover:bg-navy-100 text-navy-900 font-medium px-4 py-3 rounded-xl text-sm border border-navy-100 transition"
          >
            <PlusCircle className="w-4 h-4 text-purple-600" />
            <span>Сохтани саҳифа</span>
          </Link>

          <Link
            href="/admin/media"
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-4 py-3 rounded-xl text-sm transition shadow"
          >
            <Upload className="w-4 h-4" />
            <span>Боргузории медиа</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-navy-900">Хабарҳои охирин</h2>
            <p className="text-xs text-gray-500">Рӯйхати 5 хабари охирини иловашуда</p>
          </div>
          <Link
            href="/admin/news"
            className="text-xs font-bold text-navy-700 hover:text-gold-600 flex items-center gap-1"
          >
            <span>Ҳамаи хабарҳо</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="p-4">Сарлавҳа</th>
                <th className="p-4">Категория</th>
                <th className="p-4">Статус</th>
                <th className="p-4">Сана</th>
                <th className="p-4 text-right">Амалҳо</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Боргирии маълумот...
                  </td>
                </tr>
              ) : recentNews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Ҳеҷ хабаре ёфт нашуд
                  </td>
                </tr>
              ) : (
                recentNews.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-4 font-semibold text-navy-900 truncate max-w-md">{item.title}</td>
                    <td className="p-4">
                      <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          item.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/admin/news/${item.id}/edit`}
                        className="inline-flex items-center p-1.5 text-navy-700 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/news/${item.slug}`}
                        target="_blank"
                        className="inline-flex items-center p-1.5 text-gray-500 hover:text-navy-900 hover:bg-gray-100 rounded-lg transition"
                        title="Просмотр"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
