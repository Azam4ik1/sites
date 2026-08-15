'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, Image as ImageIcon } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { ImagePickerModal } from './ImagePickerModal';
import { useToast } from './ToastContext';

interface NewsFormProps {
  initialData?: {
    id?: number;
    title: string;
    slug: string;
    summary: string;
    content: string;
    featured_image: string;
    category: string;
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
    seo_title: string;
    seo_description: string;
  };
  isEdit?: boolean;
}

export function NewsForm({ initialData, isEdit = false }: NewsFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image || '');
  const [category, setCategory] = useState(initialData?.category || 'Ахбор');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(
    initialData?.status || 'draft'
  );
  const [isFeatured, setIsFeatured] = useState(Boolean(initialData?.is_featured));
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description || '');

  const [saving, setSaving] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isEdit && (!slug || slug === slugify(title))) {
      setSlug(slugify(newTitle));
    }
  };

  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\u0400-\u04FF\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (targetStatus?: 'draft' | 'published') => {
    const finalStatus = targetStatus || status;

    if (!title.trim() || !slug.trim() || !content.trim()) {
      showToast('Лутфан ҳамаи майдонҳои ҳатмиро пур кунед.', 'error');
      return;
    }

    setSaving(true);

    const payload = {
      title,
      slug,
      summary,
      content,
      featured_image: featuredImage,
      category,
      status: finalStatus,
      is_featured: isFeatured,
      seo_title: seoTitle || title,
      seo_description: seoDescription || summary,
    };

    try {
      const url = isEdit ? `/api/news/${initialData?.id}` : '/api/news';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(
          isEdit ? 'Новость успешно сохранена.' : 'Новость успешно создана.',
          'success'
        );
        router.push('/admin/news');
        router.refresh();
      } else {
        showToast(data.error || 'Хатогӣ ҳангоми сабти хабар', 'error');
      }
    } catch (err) {
      showToast('Хатогии шабака', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-navy-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Баргаштан ба рӯйхат</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={saving}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
          >
            Сабт ҳамчун пешнавис
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-5 py-2 rounded-xl shadow-md transition"
          >
            <Globe className="w-4 h-4" />
            <span>{saving ? 'Сабт...' : 'Нашр кардан (Publish)'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="block text-sm font-bold text-navy-900 mb-1">
                Сарлавҳаи хабар *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="Сарлавҳаро ворид кунед..."
                className="w-full text-lg font-bold px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                URL / Slug *
              </label>
              <div className="flex items-center text-xs text-gray-500 bg-gray-100 rounded-xl px-3 py-2 border border-gray-200">
                <span>https://medcollege.tj/news/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 bg-transparent font-medium text-navy-900 focus:outline-none ml-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-navy-900 mb-1">
                Тавсифи кӯтоҳ (Summary)
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                placeholder="Муқаддима ё тавсифи кӯтоҳ..."
                className="w-full p-3 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <RichTextEditor
              value={content}
              onChange={setContent}
              label="Матни пурраи хабар *"
            />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
              Танзимоти SEO (Мета-маълумот)
            </h3>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                SEO Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title || 'Сарлавҳаи SEO...'}
                className="w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                SEO Meta Description
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                placeholder={summary || 'Тавсифи SEO...'}
                className="w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              Параметрҳо
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Статус
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-600"
              >
                <option value="draft">Пешнависи (Draft)</option>
                <option value="published">Нашршуда (Published)</option>
                <option value="archived">Бойгонӣ (Archived)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Категория
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-600"
              >
                <option value="Ахбор">Ахбор</option>
                <option value="Эълонҳо">Эълонҳо</option>
                <option value="Конфронсҳо">Конфронсҳо</option>
                <option value="Нашрия">Нашрия</option>
                <option value="Чорабиниҳо">Чорабиниҳо</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-navy-900 focus:ring-navy-600 w-4 h-4"
                />
                <span className="text-xs font-bold text-navy-900">
                  Нишон додан дар саҳифаи асосӣ (Featured)
                </span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              Тасвири асосӣ (Featured Image)
            </h3>

            {featuredImage ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(true)}
                    className="px-3 py-1.5 bg-white text-navy-900 text-xs font-bold rounded-lg"
                  >
                    Иваз кардан
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('')}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg"
                  >
                    Нест кардан
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-navy-600 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-navy-900 transition"
              >
                <ImageIcon className="w-8 h-8 text-gold-500 mb-1" />
                <span className="text-xs font-medium">Интихоби тасвир</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <ImagePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(url) => setFeaturedImage(url)}
      />
    </div>
  );
}
