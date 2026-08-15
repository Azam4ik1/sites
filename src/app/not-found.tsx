import React from 'react';
import Link from 'next/link';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full space-y-6">
          <div className="w-20 h-20 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <AlertCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-[#003366]">404</h1>
            <h2 className="text-xl font-bold text-gray-900">Саҳифа ёфт нашуд</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Мутаассифона, саҳифае, ки шумо меҷӯед, мавҷуд нест ё ба суроғаи дигар интиқол ёфтааст.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#003366] hover:bg-blue-900 text-white font-bold text-sm rounded-xl transition shadow"
            >
              <Home className="w-4 h-4" />
              <span>Ба саҳифаи асосӣ</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
