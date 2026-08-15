'use client';

import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Edit,
  Trash2,
  ShieldAlert,
  Search,
  X,
} from 'lucide-react';
import { useToast } from '@/components/admin/ToastContext';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

interface UserItem {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'employee';
  status: 'active' | 'inactive';
  created_at: string;
  last_login_at?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'editor' as 'admin' | 'editor' | 'employee',
    status: 'active' as 'active' | 'inactive',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setForbidden(false);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();

      if (res.status === 403) {
        setForbidden(true);
        return;
      }

      if (res.ok) {
        setUsers(data.data || []);
      } else {
        showToast(data.error || 'Хатогӣ ҳангоми боргирии корбарон', 'error');
      }
    } catch (err) {
      showToast('Хатогӣ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'editor',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      name: user.name,
      role: user.role,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name) {
      showToast('Емейл ва ном ҳатмӣ мебошанд.', 'error');
      return;
    }

    if (!editingUser && !formData.password) {
      showToast('Парол барои корбари нав ҳатмӣ аст.', 'error');
      return;
    }

    setSaving(true);
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(editingUser ? 'Корбар муваффақона нав карда шуд.' : 'Корбари нав сохта шуд.', 'success');
        setIsModalOpen(false);
        fetchUsers();
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
      const res = await fetch(`/api/users/${targetDeleteId}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        showToast('Корбар муваффақона нест карда шуд.', 'success');
        fetchUsers();
      } else {
        showToast(data.error || 'Хатогӣ', 'error');
      }
    } catch (err) {
      showToast('Хатогӣ', 'error');
    } finally {
      setDeleteModalOpen(false);
      setTargetDeleteId(null);
    }
  };

  if (forbidden) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-red-200 shadow-xl max-w-xl mx-auto my-12">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-navy-900">403 Forbidden - Дастрасӣ маҳдуд аст</h2>
        <p className="text-sm text-gray-600 mt-2">
          Барои идоракунии корбарон танҳо ба суратҳисобҳои дорои ҳуқуқи <strong>Admin</strong> дастрасӣ дода мешавад.
        </p>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Мудирияти корбарон (Users)</h1>
          <p className="text-sm text-gray-500 mt-1">
            Таъйини нақшҳо (Admin, Editor, Employee) ва дастрасиҳои CMS
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-5 py-2.5 rounded-xl shadow-md transition"
        >
          <UserPlus className="w-5 h-5" />
          <span>Корбари нав</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Ҷустуҷӯи корбар бо ном ё емейл..."
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
                <th className="p-4">Ном ва насаб</th>
                <th className="p-4">Емейл</th>
                <th className="p-4">Нақш (Role)</th>
                <th className="p-4">Статус</th>
                <th className="p-4">Воридшавии охирин</th>
                <th className="p-4 text-right">Амалҳо</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Дар ҳоли боргирии корбарон...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Ҳеҷ корбаре ёфт нашуд
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-4 font-bold text-navy-900">{u.name}</td>
                    <td className="p-4 text-xs font-mono text-gray-600">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'editor'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {u.last_login_at
                        ? new Date(u.last_login_at).toLocaleString('ru-RU')
                        : 'Ҳануз ворид نشدهаст'}
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(u)}
                        className="inline-flex items-center p-2 text-navy-700 hover:bg-navy-50 rounded-lg transition"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setTargetDeleteId(u.id);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-navy-100">
            <div className="p-5 bg-navy-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {editingUser ? `Таҳрири корбар: ${editingUser.name}` : 'Иловаи корбари нав'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">
                  Ном ва насаб *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">
                  Емейл *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">
                  {editingUser ? 'Пароли нав (агар иваз кунед)' : 'Парол *'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? '••••••••' : 'Ақаллан 8 аломат'}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">
                    Нақш (Role)
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600 font-bold"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="employee">Employee</option>
                  </select>
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
        title="Нест кардани корбар"
        message="Оё шумо мутмаин ҳастед, ки мехоҳед ин корбарро нест кунед?"
        confirmText="Ҳа, нест кунед"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
