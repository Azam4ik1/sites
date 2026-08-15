'use client';

import React from 'react';
import { NewsForm } from '@/components/admin/NewsForm';

export default function NewNewsPage() {
  return <NewsForm isEdit={false} />;
}
