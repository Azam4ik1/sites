'use client';

import React, { useState, useEffect } from 'react';
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  File,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useToast } from '@/components/admin/ToastContext';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

interface MediaItem {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size: number;
  created_at: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    fetchMedia();
  }, [page, search]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?page=${page}&limit=12&search=${encodeURIComponent(search)}`);
      const data = await res.json();

      if (res.ok) {
        setMedia(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        showToast(data.error || 'Хатогӣ ҳангоми боргирии файлҳо', 'error');
      }
    } catch (err) {
      showToast('Хатогӣ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        showToast('Файл бомуваффақият боргузорӣ шуд.', 'success');
        fetchMedia();
      } else {
        showToast(data.error || 'Хатогӣ ҳангоми боргузорӣ', 'error');
      }
    } catch (err) {
      showToast('Хатогии шабака', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: number) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    showToast('Пайванд нусхабардорӣ шуд!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!targetDeleteId) return;

    try {
      const res = await fetch(`/api/media/${targetDeleteId}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        showToast('Файл муваффақона нест карда шуд.', 'success');
        fetchMedia();
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Китобхонаи медиа (Media Library)</h1>
          <p className="text-sm text-gray-500 mt-1">
            Идоракунии тасвирҳо ва файлҳои сомонаи Коллеҷи тиббии ҷумҳуриявӣ
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-5 py-2.5 rounded-xl shadow-md transition">
          <Upload className="w-5 h-5" />
          <span>{uploading ? 'Боргузорӣ...' : 'Боргузории файл'}</span>
          <input
            type="file"
            onChange={(e) => handleFileUpload(e.target.files)}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-gray-300 hover:border-navy-600 rounded-2xl p-8 bg-white text-center cursor-pointer transition shadow-sm"
      >
        <ImageIcon className="w-12 h-12 mx-auto text-gold-500 mb-2" />
        <p className="text-sm font-bold text-navy-900">
          Файлҳоро дар ин ҷо бипартоед ё пахш кунед
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Форматҳои дастгиришаванда: JPG, PNG, WEBP, SVG, PDF (Максимум 10 МБ)
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Ҷустуҷӯи файл..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-600"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-500 border border-gray-100">
          <File className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p className="font-semibold">Ҳеҷ файле ёфт нашуд</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => {
            const isImage = item.mime_type.startsWith('image/');

            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {isImage ? (
                    <img
                      src={item.url}
                      alt={item.original_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <File className="w-12 h-12 text-navy-700" />
                  )}

                  <div className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => handleCopyUrl(item.url, item.id)}
                      className="p-2 bg-white text-navy-900 rounded-lg hover:bg-gold-400 transition"
                      title="Копировать URL"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setTargetDeleteId(item.id);
                        setDeleteModalOpen(true);
                      }}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-2 text-center bg-white border-t border-gray-100">
                  <p className="text-xs font-semibold text-navy-900 truncate" title={item.original_name}>
                    {item.original_name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {(item.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between text-sm">
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

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Нест кардани файл"
        message="Оё шумо мутмаин ҳастед, ки мехоҳед ин файлро аз сервер ва китобхона нест кунед?"
        confirmText="Ҳа, нест кунед"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
