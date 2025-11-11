// components/TopBar.tsx
'use client';

import { useState } from 'react';

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
      { label: '섬기는이들', href: '/about/staff' },
      { label: '예배시간/오시는길', href: '/about/location' },
    ],
  },
  {
    label: '다음세대',
    href: '#nextgen',
    children: [
      { label: '유년부', href: '/nextgen/children' },
      { label: '청소년부', href: '/nextgen/youth' },
      { label: '청년부', href: '/nextgen/young' },
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
    ],
  },
];

export default function TopBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-6">
        {/* 로고 영역 */}
        <div className="flex items-center gap-3">
          {/* 감리교 아이콘 */}
          <div className="w-9 h-9 rounded-full bg-[#5a0f4e]/10 border border-[#5a0f4e]/40 flex items-center justify-center overflow-hidden">
            {/* 아이콘 파일이 있으면 사용 */}
            <img
              src="/icons/methodist.svg"
              alt="감리교"
              className="w-6 h-6"
            />
          </div>
          <div className="leading-tight">
            <div className="flex items-baseline gap-2">
              <a
                href="/"
                className="text-base font-bold tracking-tight text-slate-900"
              >
                포도원교회
              </a>
              {/* 색 포인트 (포도색) */}
              <span className="inline-block px-2 py-[2px] rounded-full bg-[#5a0f4e]/10 text-[10px] font-medium text-[#5a0f4e]">
                Podowon
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Podowon Methosdist Church
            </p>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          {mainMenus.map((menu) => (
            <div
              key={menu.label}
              className="relative"
              onMouseEnter={() => setOpenMenu(menu.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                className="flex items-center gap-1 hover:text-slate-900 transition"
              >
                {menu.label}
                <span className="text-[9px]">▼</span>
              </button>
              {menu.children && openMenu === menu.label && (
                <div className="absolute top-8 left-0 min-w-[180px] rounded-lg border bg-white shadow-md py-2">
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

        {/* 우측 유틸 */}
        <div className="flex items-center gap-3">
          <a
            href="/online"
            className="hidden sm:inline-flex px-3 py-1.5 rounded-md bg-[#5a0f4e] text-white text-xs font-medium shadow-sm"
          >
            온라인예배
          </a>
        </div>
      </div>
    </header>
  );
}
