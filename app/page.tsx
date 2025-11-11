// app/page.tsx
import MainCarousel from '@/components/MainCarousel';
import Hero from '@/components/hero-banner.tsx';
import QuickInfo from '@/components/QuickInfo.tsx';
import LatestSermons from '@/components/LatestSermons.tsx';
import SectionTitle from '@/components/SectionTitle.tsx';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  // 배너가 있으면 상단에 보여주고, 없으면 Hero만 보여주기
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return (
    <>
      {/* 배너가 있을 때만 캐러셀 표시 */}
      {banners.length > 0 && (
        <MainCarousel
          height={520}
          slides={banners.map((b) => ({
            id: b.id,
            src: b.imageUrl, // prisma schema에 맞춰서 필드 이름 확인
            alt: b.title ?? '포도원교회 배너',
            href: b.linkUrl ?? undefined,
          }))}
        />
      )}

      {/* 캐러셀 아래 기본 히어로 */}
      <Hero />

      {/* 빠른 안내 영역 */}
      <section className="mx-auto max-w-6xl px-4 -mt-12 relative z-10">
        <QuickInfo />
      </section>

      {/* 주일설교 섹션 */}
      <section id="sermons" className="mx-auto max-w-6xl px-4 mt-16">
        <SectionTitle
          title="주일설교"
          subtitle="말씀으로 세워지는 포도원교회"
        />
        <LatestSermons />
      </section>

      {/* 교회소개 섹션 */}
      <section
        id="about"
        className="mx-auto max-w-6xl px-4 mt-20 grid gap-10 md:grid-cols-2"
      >
        <div>
          <SectionTitle title="교회소개" subtitle="포도원교회의 비전" />
          <p className="text-slate-600 leading-relaxed">
            포도원교회는 지역과 다음세대를 품는 건강한 교회를 꿈꿉니다.
            예배와 말씀, 교제와 선교를 통해 주님의 사랑을 나누고자 합니다.
          </p>
          <ul className="mt-6 space-y-3 text-slate-700">
            <li>• 하나님을 예배하는 교회</li>
            <li>• 제자를 세우는 교회</li>
            <li>• 가정을 세우는 교회</li>
            <li>• 지역을 섬기는 교회</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-slate-50 p-6">
          <h3 className="text-base font-semibold mb-4">예배시간 안내</h3>
          <dl className="space-y-3 text-sm text-slate-700">
            <div className="flex justify-between">
              <dt>주일 1부 예배</dt>
              <dd>오전 9:00</dd>
            </div>
            <div className="flex justify-between">
              <dt>주일 2부 예배</dt>
              <dd>오전 11:00</dd>
            </div>
            <div className="flex justify-between">
              <dt>수요 예배</dt>
              <dd>오후 7:30</dd>
            </div>
            <div className="flex justify-between">
              <dt>금요 기도회</dt>
              <dd>오후 9:00</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 사역안내 섹션 */}
      <section id="ministries" className="mx-auto max-w-6xl px-4 mt-20">
        <SectionTitle
          title="사역안내"
          subtitle="다음세대와 양육사역이 중심입니다"
        />
        <div className="grid gap-6 md:grid-cols-3 mt-6">
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold mb-2">청년부</h3>
            <p className="text-sm text-slate-600">
              20~25세 청년들과 함께 예배하고 양육합니다.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold mb-2">다음세대</h3>
            <p className="text-sm text-slate-600">
              초등~중고등부까지 말씀으로 세워갑니다.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold mb-2">선교/나눔</h3>
            <p className="text-sm text-slate-600">
              지역과 열방을 향한 나눔과 선교사역을 합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 오시는 길 섹션 */}
      <section id="location" className="mx-auto max-w-6xl px-4 mt-20 mb-20">
        <SectionTitle title="오시는 길" subtitle="포도원교회 위치 안내" />
        <div className="rounded-2xl overflow-hidden border border-slate-200">
          <div className="bg-slate-100 h-64 flex items-center justify-center text-slate-500 text-sm">
            지도 영역 (다음/네이버 지도 embed)
          </div>
        </div>
      </section>
    </>
  );
}
