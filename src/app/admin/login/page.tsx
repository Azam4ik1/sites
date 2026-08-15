'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Емейл ё парол нодуруст аст');
      }
    } catch (err) {
      setError('Хатогии шабака. Лутфан боз кӯшиш кунед.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gold-500/30">
        <div className="bg-navy-900 p-8 text-center text-white relative">
          <div className="w-20 h-20 bg-white rounded-full mx-auto p-2 shadow-lg mb-4 flex items-center justify-center border-2 border-gold-400">
            <img src="/logo.svg" alt="College Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-wide">
            Коллеҷи тиббии ҷумҳуриявӣ
          </h1>
          <p className="text-xs text-gold-400 font-semibold mt-1">
            Системаи идоракунии мундариҷа (CMS)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Емейли корбарӣ
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@medcollege.tj"
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Парол
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold py-3.5 px-6 rounded-xl shadow-lg transition duration-200 disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Вход...' : 'Ворид шудан'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="pt-4 text-center border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Системаи муҳофизатшудаи МДТ «КТҶ»</span>
          </div>
        </form>
      </div>
    </div>
  );
}
