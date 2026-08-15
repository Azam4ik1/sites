'use client';

import React, { useState, useEffect } from 'react';
import {
  Building,
  Phone,
  Share2,
  Globe,
  Save,
  ShieldAlert,
} from 'lucide-react';
import { useToast } from '@/components/admin/ToastContext';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'seo'>('general');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (res.ok) {
        setSettings(data.data || {});
      } else {
        showToast('Хатогӣ ҳангоми боргирии танзимот', 'error');
      }
    } catch (err) {
      showToast('Хатогӣ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setForbidden(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (res.status === 403) {
        setForbidden(true);
        showToast('Танҳо Администратор метавонад танзимотро тағйир диҳад', 'error');
        return;
      }

      if (res.ok) {
        showToast('Настройки успешно обновлены.', 'success');
      } else {
        showToast(data.error || 'Хатогӣ ҳангоми сабт', 'error');
      }
    } catch (err) {
      showToast('Хатогии шабака', 'error');
    } finally {
      setSaving(false);
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
          Танҳо корбарони дорои нақши <strong>Admin</strong> метавонанд танзимоти умумии сомонаро тағйир диҳанд.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Танзимоти сомона</h1>
          <p className="text-sm text-gray-500 mt-1">
            Маълумоти расмӣ, тамосҳо, сохтор ва мета-маълумоти МДТ «Коллеҷи тиббии ҷумҳуриявӣ»
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-6 py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Сабт...' : 'Сабти танзимот'}</span>
        </button>
      </div>

      <div className="flex border-b border-gray-200 bg-white rounded-t-2xl p-2 gap-2 shadow-sm">
        {[
          { id: 'general', label: 'Умумӣ', icon: Building },
          { id: 'contact', label: 'Тамосҳо ва Суроға', icon: Phone },
          { id: 'social', label: 'Шабакаҳои иҷтимоӣ', icon: Share2 },
          { id: 'seo', label: 'SEO ва Мета', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                isActive
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-navy-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-b-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        {loading ? (
          <div className="p-8 text-center text-gray-400 font-medium">
            Дар ҳоли боргирии танзимот...
          </div>
        ) : activeTab === 'general' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Номи пурраи муассиса *
              </label>
              <input
                type="text"
                value={settings.site_title || ''}
                onChange={(e) => handleInputChange('site_title', e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600 font-semibold text-navy-950"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">
                  Соли таъсисёбӣ
                </label>
                <input
                  type="text"
                  value={settings.founding_year || '1935'}
                  onChange={(e) => handleInputChange('founding_year', e.target.value)}
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">
                  Номи директори ҷорӣ
                </label>
                <input
                  type="text"
                  value={settings.director_name || ''}
                  onChange={(e) => handleInputChange('director_name', e.target.value)}
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Тобеият (Вазорат)
              </label>
              <input
                type="text"
                value={settings.subordination || ''}
                onChange={(e) => handleInputChange('subordination', e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Директори пешина (барои сабтҳои таърихӣ)
              </label>
              <input
                type="text"
                value={settings.previous_director || ''}
                onChange={(e) => handleInputChange('previous_director', e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
              />
            </div>
          </div>
        ) : activeTab === 'contact' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Суроғаи расмӣ
              </label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">
                  Телефони асосӣ
                </label>
                <input
                  type="text"
                  value={settings.phone_primary || ''}
                  onChange={(e) => handleInputChange('phone_primary', e.target.value)}
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">
                  Телефони иловагӣ
                </label>
                <input
                  type="text"
                  value={settings.phone_secondary || ''}
                  onChange={(e) => handleInputChange('phone_secondary', e.target.value)}
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">
                  Емейли расмӣ
                </label>
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">
                  Соатҳои корӣ
                </label>
                <input
                  type="text"
                  value={settings.working_hours || ''}
                  onChange={(e) => handleInputChange('working_hours', e.target.value)}
                  className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
                />
              </div>
            </div>
          </div>
        ) : activeTab === 'social' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Пайванди Facebook
              </label>
              <input
                type="text"
                value={settings.facebook_url || ''}
                onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Пайванди Instagram
              </label>
              <input
                type="text"
                value={settings.instagram_url || ''}
                onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Пайванди Telegram
              </label>
              <input
                type="text"
                value={settings.telegram_url || ''}
                onChange={(e) => handleInputChange('telegram_url', e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Пайванди YouTube
              </label>
              <input
                type="text"
                value={settings.youtube_url || ''}
                onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600 font-mono"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Тавсифи пешфарзи сомона (Default Description)
              </label>
              <textarea
                rows={3}
                value={settings.site_description || ''}
                onChange={(e) => handleInputChange('site_description', e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Калидвожаҳои пешфарз (Default Keywords)
              </label>
              <input
                type="text"
                value={settings.seo_default_keywords || ''}
                onChange={(e) => handleInputChange('seo_default_keywords', e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Open Graph / Logo URL
              </label>
              <input
                type="text"
                value={settings.og_image || '/logo.svg'}
                onChange={(e) => handleInputChange('og_image', e.target.value)}
                className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-600 font-mono"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
