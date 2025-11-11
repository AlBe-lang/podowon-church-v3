// app/layout.tsx
import './globals.css';
import TopBar from '@/components/TopBar';

export const metadata = {
  title: '포도원교회',
  description: '포도원교회 홈페이지',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#f8f5f2] text-slate-900">
        {/* 상단 네비게이션 */}
        <TopBar />
        {/* 페이지 컨텐츠 */}
        <main>{children}</main>
        {/* 푸터 */}
        <footer className="mt-20 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
            © {new Date().getFullYear()} 포도원교회. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
