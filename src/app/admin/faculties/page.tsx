'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  GraduationCap,
  X,
  Search,
} from 'lucide-react';
import { useToast } from '@/components/admin/ToastContext';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

interface Faculty {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  phone: string;
  email: string;
  head: string;
  display_order: number;
  status: 'active' | 'inactive';
}

export default function AdminFacultiesPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    phone: '',
    email: '',
    head: '',
    display_order: 0,
    status: 'active' as 'active' | 'inactive',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faculties');
      const data = await res.json();
      if (res.ok) {
        setFaculties(data.data || []);
      } else {
        showToast(data.error || 'Хатогӣ ҳангоми боргирии факултетҳо', 'error');
      }
    } catch (err) {
      showToast('Хатогии шабака', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '/logo.svg',
      phone: '+992 (372) 39-89-44',
      email: 'medcoll.tj@mail.ru',
      head: '',
      display_order: faculties.length + 1,
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      slug: faculty.slug,
      description: faculty.description,
      image: faculty.image || '/logo.svg',
      phone: faculty.phone || '',
      email: faculty.email || '',
      head: faculty.head || '',
      display_order: faculty.display_order,
      status: faculty.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      showToast('Ном ва Slug-и факултет ҳатмӣ мебошанд', 'error');
      return;
    }

    setSaving(true);
    try {
      const url = editingFaculty ? `/api/faculties/${editingFaculty.id}` : '/api/faculties';
      const method = editingFaculty ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(
          editingFaculty ? 'Факултет муваффақона нав карда шуд.' : 'Факултет бомуваффақият илова шуд.',
          'success'
        );
        setIsModalOpen(false);
        fetchFaculties();
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
      const res = await fetch(`/api/faculties/${targetDeleteId}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        showToast('Факултет нест карда шуд.', 'success');
        fetchFaculties();
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

  const filteredFaculties = faculties.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Мудирияти факултетҳо ва ихтисосҳо</h1>
          <p className="text-sm text-gray-500 mt-1">
            Рӯйхати 11 ихтисос ва факултетҳои Коллеҷи тиббии ҷумҳуриявӣ
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-5 py-2.5 rounded-xl shadow-md transition"
        >
          <Plus className="w-5 h-5" />
          <span>Факултети нав</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Ҷустуҷӯи факултет..."
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
                <th className="p-4 w-12 text-center">№</th>
                <th className="p-4">Номи факултет</th>
                <th className="p-4">Роҳбар (Декан)</th>
                <th className="p-4">Телефон / Email</th>
                <th className="p-4">Статус</th>
                <th className="p-4 text-right">Амалҳо</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Дар ҳоли боргирии факултетҳо...
                  </td>
                </tr>
              ) : filteredFaculties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Ҳеҷ факултете ёфт нашуд
                  </td>
                </tr>
              ) : (
                filteredFaculties.map((f, i) => (
                  <tr key={f.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-4 text-center font-bold text-navy-800">{f.display_order || i + 1}</td>
                    <td className="p-4 font-bold text-navy-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-navy-50 p-1 shrink-0 flex items-center justify-center border border-navy-100">
                          <GraduationCap className="w-5 h-5 text-navy-800" />
                        </div>
                        <div>
                          <div>{f.name}</div>
                          <div className="text-xs text-gray-400 font-normal">{f.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-semibold text-gray-700">{f.head || 'Муайян نشده'}</td>
                    <td className="p-4 text-xs text-gray-500">
                      <div>{f.phone}</div>
                      <div>{f.email}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          f.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(f)}
                        className="inline-flex items-center p-2 text-navy-700 hover:bg-navy-50 rounded-lg transition"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setTargetDeleteId(f.id);
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-navy-100 my-8">
            <div className="p-5 bg-navy-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {editingFaculty ? 'Таҳрири факултет' : 'Иловаи факултети нав'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">
                  Номи факултет *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: editingFaculty ? formData.slug : e.target.value.toLowerCase().replace(/\s+/g, '-'),
                    })
                  }
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
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">
                  Тавсифи факултет *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">
                    Роҳбар (Декан)
                  </label>
                  <input
                    type="text"
                    value={formData.head}
                    onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">
                    Тартиби намоиш (Order)
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">
                    Телефон
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">
                    Статус
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                  >
                    <option value="active">Active (Фаъол)</option>
                    <option value="inactive">Inactive (Ғайрифаъол)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
        title="Нест кардани факултет"
        message="Оё шумо мутмаин ҳастед, ки мехоҳед ин факултет/ихтисосро нест кунед?"
        confirmText="Ҳа, нест кунед"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
