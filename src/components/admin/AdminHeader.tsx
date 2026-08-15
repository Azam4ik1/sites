'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ExternalLink } from 'lucide-react';

interface UserSession {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'employee';
}

interface AdminHeaderProps {
  user: UserSession | null;
  onToggleSidebar: () => void;
}

export function AdminHeader({ user, onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-500 hover:text-navy-900 hover:bg-gray-100 rounded-lg transition"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold px-2.5 py-1 bg-navy-50 text-navy-800 rounded-md border border-navy-100">
          Панели идоракунӣ CMS 2026
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs font-medium text-navy-700 bg-navy-50 hover:bg-navy-100 px-3 py-1.5 rounded-lg border border-navy-200 transition"
        >
          <span>Гузаштан ба сайт</span>
          <ExternalLink className="w-3.5 h-3.5 text-gold-600" />
        </Link>

        <div className="w-px h-6 bg-gray-200" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-bold text-sm shadow">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-navy-900 leading-tight">{user?.name}</div>
            <div className="text-[10px] text-gray-500 capitalize">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
