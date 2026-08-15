'use client';

import React, { useState } from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import SideMenu from '@/components/public/SideMenu';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactsPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage('Манзури шумо бо муваффақият фиристода шуд! Сипос.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMessage(data.error || 'Хатогӣ ҳангоми фиристодан. Лутфан дубора кӯшиш кунед.');
      }
    } catch {
      setErrorMessage('Сарвер ҷавоб надод.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-1">
            <SideMenu />
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-md border border-gray-100 space-y-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#003366] border-b-2 border-yellow-500 pb-3">
                Тамос ва Ҷойгиршавӣ
              </h1>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-3">
                  <div className="flex items-center gap-3 text-[#003366] font-bold">
                    <MapPin className="w-5 h-5 text-yellow-600" />
                    <span>Суроғаи расмӣ</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Ҷумҳурии Тоҷикистон, ш. Душанбе, кӯчаи Раҳмон Набиев, 248
                  </p>
                </div>

                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-3">
                  <div className="flex items-center gap-3 text-[#003366] font-bold">
                    <Phone className="w-5 h-5 text-yellow-600" />
                    <span>Телефонҳо</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    +992 (372) 39-89-44 / +992 (372) 39-89-49
                  </p>
                </div>

                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-3">
                  <div className="flex items-center gap-3 text-[#003366] font-bold">
                    <Mail className="w-5 h-5 text-yellow-600" />
                    <span>Почтаи электронӣ</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    medcoll.tj@mail.ru
                  </p>
                </div>

                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-3">
                  <div className="flex items-center gap-3 text-[#003366] font-bold">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span>Вақти корӣ</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Душанбе – Шанбе: 08:00 – 17:00
                  </p>
                </div>
              </div>

              {/* Interactive Form */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <h2 className="text-xl font-bold text-[#003366]">
                  Алоқаи акс (Формаи муроҷиат)
                </h2>

                {successMessage && (
                  <div className="p-4 bg-green-50 text-green-800 rounded-xl border border-green-200 flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 flex items-center gap-2 text-sm">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Ном ва насаб *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] outline-none"
                        placeholder="Алиев Алишер"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Почтаи электронӣ / Телефон *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] outline-none"
                        placeholder="example@mail.ru"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Мӯҳтавои мавзӯъ
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] outline-none"
                      placeholder="Қабул ва довталабӣ..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Матни муроҷиат *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] outline-none"
                      placeholder="Саволи худро дар ин ҷо нависед..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-[#003366] hover:bg-blue-900 text-white font-bold text-sm rounded-xl transition shadow flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Фиристодан...' : 'Фиристодани муроҷиат'}</span>
                  </button>
                </form>
              </div>

              {/* Map Embed Box */}
              <div className="pt-6 border-t border-gray-100 space-y-2">
                <h3 className="text-base font-bold text-[#003366]">Наритаи ҷойгиршавӣ (Google Map)</h3>
                <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                  <iframe
                    title="Google Map Location"
                    src="https://maps.google.com/maps?q=38.535,68.75&z=15&output=embed"
                    className="w-full h-full border-0"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
