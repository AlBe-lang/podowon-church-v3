// components/TopBar.tsx
'use client';

import { useRef, useState } from 'react';

const mainMenus = [
  {
    label: '예배와 말씀',
    href: '#worship',
    children: [
      { label: '주일예배', href: '/worship/sunday' },
      { label: '수요예배', href: '/worship/wed' },
      { label: '금요기도회', href: '/worship/friday' },
      { label: '설교영상', href: '/sermons' },
    ],
  },
  {
    label: '교회소개',
    href: '#about',
    children: [
      { label: '인사말', href: '/about/greeting' },
      { label: '비전', href: '/about/vision' },
      { label: '연혁', href: '/about/history' },
      { label: '섬기는 이들', href: '/about/staff' },
    ],
  },
  {
    label: '다음세대',
    href: '#nextgen',
    children: [
      { label: '유초등부', href: '/education/kids' },
      { label: '중고등부', href: '/education/teens' },
      { label: '청년부', href: '/education/young' },
    ],
  },
  {
    label: '사역',
    href: '#ministries',
    children: [
      { label: '교육사역', href: '/ministries/education' },
      { label: '선교/나눔', href: '/ministries/mission' },
    ],
  },
  {
    label: '커뮤니티',
    href: '#news',
    children: [
      { label: '공지사항', href: '/news' },
      { label: '주보', href: '/bulletin' },
      { label: '기도제목', href: '/prayer' },
      { label: '자유게시판', href: '/board' },
    ],
  },
];

export default function TopBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const handleOpen = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };

  const handleClose = () => {
    // 바로 닫지 말고 150ms 정도 뒤에 닫기 → 사용자가 메뉴로 내려갈 시간 확보
    closeTimer.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-6">
        {/* 로고 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#5a0f4e]/10 border border-[#5a0f4e]/40 flex items-center justify-center overflow-hidden">
            <img src="/icons/methodist.svg" alt="감리교" className="w-6 h-6" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">포도원교회</span>
              <span className="inline-block px-2 py-[2px] rounded-full bg-[#5a0f4e]/10 text-[10px] font-medium text-[#5a0f4e]">
                Podowon
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Podowon Methodist Church</p>
          </div>
        </div>

        {/* 메인 네비 */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
            {mainMenus.map((menu) => (
              <div
                key={menu.label}
                className="relative"
                onMouseEnter={() => handleOpen(menu.label)}
                onMouseLeave={handleClose}
              >
                <button className="flex items-center gap-1 hover:text-slate-900 transition">
                  {menu.label}
                  <span className="text-[9px]">▼</span>
                </button>

                {menu.children && openMenu === menu.label && (
                  <div
                    className="absolute top-8 left-0 min-w-[190px] rounded-lg border bg-white shadow-md py-2
                               animate-[dropdown_0.18s_ease-out] origin-top"
                  >
                    {menu.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </nav>

        {/* 우측 : 로그인으로 교체 */}
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden sm:inline-flex px-3 py-1.5 rounded-md bg-[#5a0f4e] text-white text-xs font-medium shadow-sm"
          >
            로그인
          </a>
        </div>
      </div>

      {/* 드롭다운 애니메이션 키프레임 (tailwind 쓰면 globals.css에 넣어도 됨) */}
      <style jsx>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}
