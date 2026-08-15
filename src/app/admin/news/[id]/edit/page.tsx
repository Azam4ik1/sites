'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { NewsForm } from '@/components/admin/NewsForm';
import { useToast } from '@/components/admin/ToastContext';

export default function EditNewsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      fetchNewsDetail();
    }
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      const res = await fetch(`/api/news/${id}`);
      const data = await res.json();

      if (res.ok) {
        setNews(data.data);
      } else {
        showToast(data.error || 'Хабар ёфт нашуд', 'error');
      }
    } catch (err) {
      showToast('Хатогӣ ҳангоми боргирии хабар', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 font-medium">
        Боргирии маълумоти хабар...
      </div>
    );
  }

  if (!news) {
    return (
      <div className="p-12 text-center text-red-500 font-medium">
        Хабар ёфт нашуд.
      </div>
    );
  }

  return <NewsForm initialData={news} isEdit={true} />;
}
