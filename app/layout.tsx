import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '포도원교회',
  description: '하나님의 사랑을 실천하고 이웃과 함께하는 교회',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <SiteHeader />
        <main className="pt-16 min-h-screen">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
