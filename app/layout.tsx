// app/layout.tsx
import './globals.css';
import { Providers } from './Providers';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false; // لمنع مشاكل التصميم مع Next.js

export const metadata = { title: 'TAŞLICA DÖNER ', description: 'أشهى المأكولات' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-800 font-sans min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}