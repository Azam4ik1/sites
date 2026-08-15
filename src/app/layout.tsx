import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Муассисаи давлатии таълимии «Коллеҷи тиббии ҷумҳуриявӣ»',
  description: 'Сайти расмии МДТ Коллеҷи тиббии ҷумҳуриявии Вазорати тандурустӣ ва ҳифзи иҷтимоии аҳолии Ҷумҳурии Тоҷикистон (таъсис 1935)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tg">
      <body className="bg-cream-100 text-gray-900 antialiased selection:bg-gold-500 selection:text-navy-950">
        {children}
      </body>
    </html>
  );
}
