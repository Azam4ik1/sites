'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  GraduationCap,
  FileText,
  Image as ImageIcon,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useToast } from './ToastContext';

interface UserSession {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'employee';
}

interface AdminSidebarProps {
  user: UserSession | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function AdminSidebar({ user, collapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      showToast('Муваффақона баромад шуд', 'info');
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      showToast('Хатогӣ ҳангоми баромад', 'error');
    }
  };

  const menuItems = [
    { label: 'Панел', href: '/admin', icon: LayoutDashboard, roles: ['admin', 'editor', 'employee'] },
    { label: 'Хабарҳо', href: '/admin/news', icon: Newspaper, roles: ['admin', 'editor'] },
    { label: 'Факултетҳо', href: '/admin/faculties', icon: GraduationCap, roles: ['admin', 'editor'] },
    { label: 'Саҳифаҳо', href: '/admin/pages', icon: FileText, roles: ['admin', 'editor'] },
    { label: 'Медиа', href: '/admin/media', icon: ImageIcon, roles: ['admin', 'editor'] },
    { label: 'Корбарон', href: '/admin/users', icon: Users, roles: ['admin'] },
    { label: 'Танзимот', href: '/admin/settings', icon: Settings, roles: ['admin'] },
  ];

  return (
    <aside
      className={`bg-navy-900 text-white flex flex-col transition-all duration-300 border-r border-navy-800 shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-navy-800">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <img src="/logo.svg" alt="College Logo" className="w-10 h-10 shrink-0" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wide text-white leading-tight">
                МДТ «КТҶ»
              </span>
              <span className="text-[11px] text-gold-400 font-medium">Системаи CMS</span>
            </div>
          )}
        </Link>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800 transition"
          title={collapsed ? 'Развернуть' : 'Свернуть'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const isAllowed = item.roles.includes(user?.role || '');

          if (!isAllowed) return null;

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                isActive
                  ? 'bg-gold-500 text-navy-950 font-semibold shadow-md'
                  : 'text-navy-100 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-navy-950' : 'text-gold-400'}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-navy-800 bg-navy-950/50">
        {!collapsed && user && (
          <div className="mb-3">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-navy-200 truncate">{user.email}</p>
            <div className="mt-1">
              <span
                className={`inline-block text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                  user.role === 'admin'
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                    : user.role === 'editor'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition border border-red-900/30"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Баромад</span>}
        </button>
      </div>
    </aside>
  );
}
