'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Search,
  Eye,
  X,
} from 'lucide-react';
import { useToast } from '@/components/admin/ToastContext';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

interface PageItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  seo_title: string;
  seo_description: string;
  status: 'draft' | 'published';
  created_at: string;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      if (res.ok) {
        setPages(data.data || []);
      } else {
        showToast(data.error || 'Хатогӣ ҳангоми боргирии саҳифаҳо', 'error');
      }
    } catch (err) {
      showToast('Хатогӣ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingPage(null);
    setTitle('');
    setSlug('');
    setContent('');
    setSeoTitle('');
    setSeoDescription('');
    setStatus('published');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (pageItem: PageItem) => {
    setEditingPage(pageItem);
    setTitle(pageItem.title);
    setSlug(pageItem.slug);
    setContent(pageItem.content);
    setSeoTitle(pageItem.seo_title || '');
    setSeoDescription(pageItem.seo_description || '');
    setStatus(pageItem.status);
    setIsEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      showToast('Лутфан Сарлавҳа, Slug ва Матнро пур кунед.', 'error');
      return;
    }

    setSaving(true);
    try {
      const url = editingPage ? `/api/pages/${editingPage.id}` : '/api/pages';
      const method = editingPage ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          seo_title: seoTitle || title,
          seo_description: seoDescription,
          status,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(editingPage ? 'Саҳифа муваффақона нав шуд.' : 'Саҳифа сохта шуд.', 'success');
        setIsEditorOpen(false);
        fetchPages();
      } else {
        showToast(data.error || 'Хатогӣ ҳангоми сабт', 'error');
      }
    } catch (err) {
      showToast('Хатогӣ', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!targetDeleteId) return;

    try {
      const res = await fetch(`/api/pages/${targetDeleteId}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        showToast('Саҳифа нест карда шуд.', 'success');
        fetchPages();
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

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Мудирияти саҳифаҳои статикӣ</h1>
          <p className="text-sm text-gray-500 mt-1">
            Таҳрири мундариҷаи саҳифаҳои «Дар бораи коллеҷ», «Маъмурият», «Пешвои миллат» ва ғайра.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-5 py-2.5 rounded-xl shadow-md transition"
        >
          <Plus className="w-5 h-5" />
          <span>Саҳифаи нав</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Ҷустуҷӯи саҳифа..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="p-4">Сарлавҳаи саҳифа</th>
                <th className="p-4">Slug (URL)</th>
                <th className="p-4">Статус</th>
                <th className="p-4">Сана</th>
                <th className="p-4 text-right">Амалҳо</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Дар ҳоли боргирии саҳифаҳо...
                  </td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Ҳеҷ саҳифае ёфт нашуд
                  </td>
                </tr>
              ) : (
                filteredPages.map((pageItem) => (
                  <tr key={pageItem.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-4 font-bold text-navy-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>{pageItem.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono text-gray-500">/p/{pageItem.slug}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          pageItem.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pageItem.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(pageItem.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(pageItem)}
                        className="inline-flex items-center p-2 text-navy-700 hover:bg-navy-50 rounded-lg transition"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/p/${pageItem.slug}`}
                        target="_blank"
                        className="inline-flex items-center p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                        title="Просмотр"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          setTargetDeleteId(pageItem.id);
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
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-navy-100 my-8">
            <div className="p-5 bg-navy-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {editingPage ? `Таҳрири саҳифа: ${editingPage.title}` : 'Сохтани саҳифаи нав'}
              </h3>
              <button onClick={() => setIsEditorOpen(false)} className="text-gray-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">
                    Сарлавҳаи саҳифа *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingPage) {
                        setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                      }
                    }}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                  />
                </div>
              </div>

              <RichTextEditor value={content} onChange={setContent} label="Матни саҳифа *" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">
                    Статус
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                  >
                    <option value="published">Published (Нашршуда)</option>
                    <option value="draft">Draft (Пешнависи)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Бекор кардан
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm font-bold text-navy-950 bg-gold-500 hover:bg-gold-400 rounded-xl shadow transition"
                >
                  {saving ? 'Сабт...' : 'Сабт кардан'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Нест кардани саҳифа"
        message="Оё шумо мутмаин ҳастед, ки мехоҳед ин саҳифаро нест кунед?"
        confirmText="Ҳа, нест кунед"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
