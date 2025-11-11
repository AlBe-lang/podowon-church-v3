// components/Hero.tsx
export default function Hero() {
  return (
    <section
      className="relative h-[340px] md:h-[420px] bg-cover bg-center flex items-center"
      style={{
        backgroundImage:
          'linear-gradient(110deg, rgba(90,15,78,0.75), rgba(248,245,242,0.0)), url(/images/vineyard.jpg)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 text-white">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-100/70">
          포도원교회 · Podowon Methosdist Church
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold leading-tight drop-shadow-sm">
          열매 맺는 공동체,
          <br />
          주님을 닮아가는 교회
        </h1>
        <p className="mt-4 max-w-xl text-sm md:text-base text-slate-100/90">
          예배와 말씀을 중심으로 한 사람, 한 가정, 한 세대를 세우는 포도원교회입니다.
        </p>
        <div className="mt-6 flex gap-3">
          <a
            href="/worship/sunday"
            className="inline-flex items-center rounded-lg bg-white text-slate-900 px-4 py-2 text-sm font-semibold"
          >
            예배안내 보기
          </a>
          <a
            href="/sermons"
            className="inline-flex items-center rounded-lg bg-white/10 border border-white/40 px-4 py-2 text-sm font-semibold"
          >
            주일설교
          </a>
        </div>
      </div>
    </section>
  );
}
