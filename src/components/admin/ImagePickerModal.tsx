'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Search, Upload, X, Check } from 'lucide-react';
import { useToast } from './ToastContext';

interface MediaItem {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size: number;
}

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function ImagePickerModal({ isOpen, onClose, onSelect }: ImagePickerModalProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, search]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?search=${encodeURIComponent(search)}&limit=30`);
      const data = await res.json();
      if (res.ok) {
        setMedia(data.data || []);
      }
    } catch (error) {
      showToast('Хатогӣ ҳангоми боргирии файлҳо', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Файл бомуваффақият боргузорӣ шуд', 'success');
        fetchMedia();
        if (data.data?.url) {
          setSelectedUrl(data.data.url);
        }
      } else {
        showToast(data.error || 'Хатогӣ ҳангоми боргузорӣ', 'error');
      }
    } catch (error) {
      showToast('Хатоги дар система', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col overflow-hidden border border-navy-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-navy-900 text-white">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-gold-400" />
            <h3 className="font-bold text-lg">Интихоби тасвир аз Китобхонаи медиа</h3>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ҷустуҷӯи файл..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-600"
            />
          </div>

          <label className="cursor-pointer flex items-center gap-2 bg-navy-700 hover:bg-navy-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
            <Upload className="w-4 h-4 text-gold-400" />
            <span>{uploading ? 'Боргузорӣ...' : 'Боргузории тасвири нав'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p>Ҳеҷ файле ёфт нашуд</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedUrl(item.url)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer bg-gray-100 transition shadow-sm ${
                    selectedUrl === item.url
                      ? 'border-gold-500 ring-2 ring-gold-400'
                      : 'border-transparent hover:border-navy-300'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.original_name}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {selectedUrl === item.url && (
                    <div className="absolute top-2 right-2 bg-gold-500 text-navy-900 rounded-full p-1 shadow">
                      <Check className="w-4 h-4 font-bold" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-xs text-white truncate opacity-0 group-hover:opacity-100 transition">
                    {item.original_name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-500 truncate max-w-xs">
            {selectedUrl ? `Интихоб шуд: ${selectedUrl}` : 'Лутфан тасвирро интихоб кунед'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Бекор кардан
            </button>
            <button
              onClick={() => {
                if (selectedUrl) {
                  onSelect(selectedUrl);
                  onClose();
                }
              }}
              disabled={!selectedUrl}
              className="px-4 py-2 text-sm font-medium text-navy-950 bg-gold-500 hover:bg-gold-400 rounded-lg disabled:opacity-50 transition shadow-sm font-semibold"
            >
              Тасдиқ ва гузоштан
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
