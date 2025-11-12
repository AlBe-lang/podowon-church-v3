// app/page.tsx
import { prisma } from '@/lib/prisma';
import MainCarousel from '@/components/MainCarousel';
import Hero from '@/components/hero-banner';
import QuickInfo from '@/components/QuickInfo';
import LatestSermons from '@/components/LatestSermons';
import SectionTitle from '@/components/SectionTitle';

export default async function HomePage() {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return (
    <>
      {banners.length > 0 && (
        <MainCarousel
          height={520}
          slides={banners.map((b) => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle ?? '',
            imageUrl: b.imageUrl ?? '',
            desktopImageUrl: b.desktopImageUrl ?? b.imageUrl ?? '',
            mobileImageUrl: b.mobileImageUrl ?? b.imageUrl ?? '',
          }))}
        />
      )}

      <Hero />

      <section className="mx-auto max-w-6xl px-4 -mt-12 relative z-10">
        <QuickInfo />
      </section>

      <section id="sermons" className="mx-auto max-w-6xl px-4 mt-16">
        <SectionTitle title="주일설교" subtitle="말씀으로 세워지는 포도원교회" />
        <LatestSermons />
      </section>

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
