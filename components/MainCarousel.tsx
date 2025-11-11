// components/MainCarousel.tsx
'use client';

import { memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, A11y } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type BannerSlide = {
  id: number;
  title: string;
  subtitle?: string | null;
  period?: string | null;
  imageUrl?: string | null;        // 공통
  desktopImageUrl?: string | null; // PC
  mobileImageUrl?: string | null;  // 모바일
};

interface MainCarouselProps {
  slides: BannerSlide[];
  height?: number;
}

function MainCarousel({ slides, height = 520 }: MainCarouselProps) {
  if (!slides || slides.length === 0) {
    // 여기서도 안내 가능하지만, 보통 페이지에서 아예 안 렌더해도 됨
    return null;
  }

  return (
    <div className="main_visual_wrap">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, A11y]}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 6500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        navigation
        speed={900}
        className="swiperMain"
      >
        {slides.map((s) => {
          // 우선순위: 데스크톱 → 공통 → 없음
          const hasAnyImage =
            s.desktopImageUrl || s.imageUrl || s.mobileImageUrl;

          return (
            <SwiperSlide key={s.id}>
              {hasAnyImage ? (
                // 이미지가 적어도 하나는 있을 때
                <div
                  className="relative w-full"
                  style={{ height: `${height}px` }}
                >
                  {/* PC용 (md 이상) */}
                  {(s.desktopImageUrl || s.imageUrl) && (
                    <div className="hidden md:block w-full h-full">
                      <Image
                        src={s.desktopImageUrl || s.imageUrl!}
                        alt={s.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority={s.id === slides[0].id}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}

                  {/* 모바일용 (md 미만) */}
                  {(s.mobileImageUrl || s.imageUrl) && (
                    <div className="block md:hidden w-full h-full">
                      <Image
                        src={s.mobileImageUrl || s.imageUrl!}
                        alt={s.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}

                  {/* 공통 텍스트 오버레이 */}
                  <div className="absolute bottom-10 left-6 md:left-16 text-white space-y-2 drop-shadow max-w-xl">
                    <p className="text-xs uppercase tracking-wide text-white/70">
                      {s.period ?? 'Podowon Methodist Church'}
                    </p>
                    <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                      {s.title}
                    </h2>
                    {s.subtitle && (
                      <p className="text-sm md:text-base text-white/90">
                        {s.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                // 이미지가 전혀 없을 때
                <div
                  className="w-full flex flex-col items-start justify-center gap-3 px-6 md:px-16 bg-slate-200 text-slate-700"
                  style={{ height: `${height}px` }}
                >
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Podowon Methodist Church
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    해당 이미지가 없습니다.
                  </h2>
                  <p className="text-sm md:text-base text-slate-600 max-w-lg">
                    관리자 페이지에서 PC/모바일 배너 이미지를 등록해주세요.
                  </p>
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx global>{`
        .swiperMain .swiper-pagination-bullet {
          opacity: 0.6;
          background: #fff;
          width: 16px;
          height: 4px;
          border-radius: 9999px;
          transition: all 0.2s ease;
        }
        .swiperMain .swiper-pagination-bullet-active {
          opacity: 1;
          background: #5a0f4e;
        }
        .swiperMain .swiper-button-prev,
        .swiperMain .swiper-button-next {
          color: #5a0f4e;
        }
      `}</style>
    </div>
  );
}

export default memo(MainCarousel);
