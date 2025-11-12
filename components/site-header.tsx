// components/site-header.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: number;
  label: string;
  path: string;
  order: number;
  visible: boolean;
}

type UserInfo = {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
} | null;

// 여기서 “어떤 상위메뉴에 어떤 하위메뉴가 있다”만 정의해두면 됨
// 실제 삼일교회처럼 깊게 안 가고 1단 드롭다운만
const SUB_MENUS: Record<
  string,
  { label: string; href: string; description?: string }[]
> = {
  '/worship': [
    { label: '주일예배', href: '/worship/sunday' },
    { label: '수요예배', href: '/worship/wed' },
    { label: '금요기도회', href: '/worship/friday' },
  ],
  '/board': [
    { label: '자유게시판', href: '/board' },
    { label: '공지사항', href: '/news' },
    { label: '기도제목', href: '/prayer' },
  ],
  '/ministries': [
    { label: '교육사역', href: '/ministries/education' },
    { label: '선교/나눔', href: '/ministries/mission' },
  ],
};

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<UserInfo>(null);
  // 어떤 상위 메뉴가 열려 있는지
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const [menusRes, settingsRes, meRes] = await Promise.all([
        fetch('/api/menus'),
        fetch('/api/settings'),
        fetch('/api/auth/me'),
      ]);

      const menus = await menusRes.json();
      setMenuItems(
        (menus || []).filter((m: MenuItem) => m.visible).sort((a: any, b: any) => a.order - b.order)
      );

      if (settingsRes.ok) {
        setSiteSettings(await settingsRes.json());
      }

      if (meRes.ok) {
        setUser(await meRes.json());
      }
    };
    load();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        scrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-2">
            {siteSettings?.logoUrl ? (
              <img src={siteSettings.logoUrl} alt="포도원교회" className="h-8" />
            ) : (
              <div className="flex flex-col leading-tight">
                <span
                  className="text-xl font-bold text-purple-900"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {/* 포도원교회 */}
                  {siteSettings?.siteName || '포도원교회'}
                </span>
                <span className="text-[10px] text-slate-400">
                  Podowon Methodist Church
                </span>
              </div>
            )}
          </Link>

          {/* 데스크탑 메뉴 */}
          <nav className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => {
              const hasSub = SUB_MENUS[item.path];
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => hasSub && setOpenMenuKey(item.path)}
                  onMouseLeave={() => hasSub && setOpenMenuKey((prev) => (prev === item.path ? null : prev))}
                >
                  <Link
                    href={item.path}
                    className={cn(
                      'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                      pathname === item.path
                        ? 'bg-purple-100 text-purple-800'
                        : 'text-slate-700 hover:bg-slate-100'
                    )}
                  >
                    {item.label}
                  </Link>

                  {/* 드롭다운 */}
                  {hasSub && (
                    <div
                      className={cn(
                        'absolute left-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-slate-100 overflow-hidden transition-all duration-200 origin-top',
                        openMenuKey === item.path
                          ? 'opacity-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 -translate-y-2 pointer-events-none'
                      )}
                      // 내려온 박스 위에 마우스를 올려도 열려있도록
                      onMouseEnter={() => setOpenMenuKey(item.path)}
                      onMouseLeave={() => setOpenMenuKey(null)}
                    >
                      <div className="py-2">
                        {SUB_MENUS[item.path].map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-purple-50"
                          >
                            <div className="font-medium">{sub.label}</div>
                            {sub.description && (
                              <div className="text-[11px] text-slate-400">
                                {sub.description}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* 로그인 버튼 (기존 '온라인예배' 자리) */}
            {user ? (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setOpenMenuKey((prev) => (prev === '__user__' ? null : '__user__'))
                  }
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {user.name}
                </Button>
                {openMenuKey === '__user__' && (
                  <div
                    className="absolute right-0 mt-2 w-44 rounded-lg bg-white shadow-lg ring-1 ring-slate-100 overflow-hidden"
                    onMouseLeave={() => setOpenMenuKey(null)}
                  >
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm hover:bg-slate-50"
                      >
                        관리자 페이지
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  로그인
                </Button>
              </Link>
            )}
          </nav>

          {/* 모바일 햄버거 */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-slate-100"
            onClick={() => setMenuOpen((p) => !p)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={cn(
                  'block px-2 py-2 rounded-md text-sm',
                  pathname === item.path
                    ? 'bg-purple-100 text-purple-800'
                    : 'hover:bg-slate-100'
                )}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t">
              {user ? (
                <>
                  <div className="px-2 py-1 text-xs text-slate-400">
                    {user.name} ({user.role})
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 flex gap-2 justify-center"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </Button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full mt-2">
                    로그인
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
