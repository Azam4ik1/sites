'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useToast } from '@/components/admin/ToastContext';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  author_name: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: number;
  created_at: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null);
  const [bulkActionType, setBulkActionType] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    fetchNews();
  }, [page, statusFilter, categoryFilter]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      let url = `/api/news?page=${page}&limit=10`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (categoryFilter) url += `&category=${encodeURIComponent(categoryFilter)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setNews(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        showToast(data.error || 'Хатогӣ ҳангоми гирифтани хабарҳо', 'error');
      }
    } catch (err) {
      showToast('Хатогии шабака', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchNews();
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(news.map((n) => n.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteOne = async () => {
    if (!targetDeleteId) return;

    try {
      const res = await fetch(`/api/news/${targetDeleteId}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        showToast('Новость успешно удалена.', 'success');
        fetchNews();
      } else {
        showToast(data.error || 'Хатогӣ ҳангоми несткунӣ', 'error');
      }
    } catch (err) {
      showToast('Хатогӣ', 'error');
    } finally {
      setDeleteModalOpen(false);
      setTargetDeleteId(null);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkActionType || selectedIds.length === 0) return;

    try {
      const res = await fetch('/api/news/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action: bulkActionType }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(data.message || 'Амалиёт бомуваффақият иҷро шуд', 'success');
        setSelectedIds([]);
        fetchNews();
      } else {
        showToast(data.error || 'Хатогӣ', 'error');
      }
    } catch (err) {
      showToast('Хатогӣ', 'error');
    } finally {
      setBulkActionType(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Мудирияти хабарҳо</h1>
          <p className="text-sm text-gray-500 mt-1">
            Сохтан, таҳрир ва нашри хабарҳои Коллеҷи тиббии ҷумҳуриявӣ
          </p>
        </div>

        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-5 py-2.5 rounded-xl shadow-md transition"
        >
          <Plus className="w-5 h-5" />
          <span>Хабари нав</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ҷустуҷӯи хабар..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-navy-900 text-white text-sm font-semibold rounded-xl hover:bg-navy-800 transition"
          >
            Ҷустуҷӯ
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
            <Filter className="w-4 h-4 text-gold-600" />
            <span>Статус:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-600"
          >
            <option value="">Ҳама статусҳо</option>
            <option value="published">Нашршуда (Published)</option>
            <option value="draft">Пешнависи (Draft)</option>
            <option value="archived">Бойгонӣ (Archived)</option>
          </select>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-navy-900 text-white p-4 rounded-xl flex items-center justify-between shadow-md">
          <span className="text-sm font-medium">
            Интихоб шуд: <strong className="text-gold-400">{selectedIds.length}</strong> хабар
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setBulkActionType('publish')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
            >
              Нашр кардан
            </button>
            <button
              onClick={() => setBulkActionType('unpublish')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition"
            >
              Ба пешнавис
            </button>
            <button
              onClick={() => setBulkActionType('delete')}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition"
            >
              Нест кардан
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={news.length > 0 && selectedIds.length === news.length}
                    onChange={handleSelectAll}
                    className="rounded text-navy-900 focus:ring-navy-600"
                  />
                </th>
                <th className="p-4">Сарлавҳа</th>
                <th className="p-4">Категория</th>
                <th className="p-4">Муаллиф</th>
                <th className="p-4">Статус</th>
                <th className="p-4">Сана</th>
                <th className="p-4 text-right">Амалҳо</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    Дар ҳоли боргирии хабарҳо...
                  </td>
                </tr>
              ) : news.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    Ҳеҷ хабаре ёфт нашуд
                  </td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectOne(item.id)}
                        className="rounded text-navy-900 focus:ring-navy-600"
                      />
                    </td>
                    <td className="p-4 font-semibold text-navy-900 max-w-sm">
                      <Link href={`/admin/news/${item.id}/edit`} className="hover:text-gold-600 transition">
                        {item.title}
                      </Link>
                      {item.is_featured === 1 && (
                        <span className="ml-2 text-[10px] bg-gold-100 text-gold-800 font-bold px-2 py-0.5 rounded">
                          Главная
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-600">{item.author_name || 'Муаллиф'}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
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
                    <td className="p-4 text-right space-x-1">
                      <Link
                        href={`/admin/news/${item.id}/edit`}
                        className="inline-flex items-center p-2 text-navy-700 hover:bg-navy-50 rounded-lg transition"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/news/${item.slug}`}
                        target="_blank"
                        className="inline-flex items-center p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                        title="Просмотр"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          setTargetDeleteId(item.id);
                          setDeleteModalOpen(true);
                        }}
                        className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Саҳифаи {page} аз {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Нест кардани хабар"
        message="Оё шумо мутмаин ҳастед, ки мехоҳед ин хабарро нест кунед?"
        confirmText="Ҳа, нест кунед"
        onConfirm={handleDeleteOne}
        onCancel={() => setDeleteModalOpen(false)}
      />

      <ConfirmModal
        isOpen={Boolean(bulkActionType)}
        title="Амалиёти дастаҷамъӣ"
        message={`Оё шумо мутмаин ҳастед, ки мехоҳед амали «${bulkActionType}»-ро барои ${selectedIds.length} хабар иҷро кунед?`}
        confirmText="Бале, иҷро кунед"
        onConfirm={handleBulkAction}
        onCancel={() => setBulkActionType(null)}
      />
    </div>
  );
}
