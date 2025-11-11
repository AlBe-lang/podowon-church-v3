// components/LatestSermons.tsx
const dummySermons = [
  {
    id: 1,
    title: '마음이 청결한 자는 복이 있나니',
    preacher: '담임목사',
    date: '2025-11-09',
  },
  {
    id: 2,
    title: '빛과 소금으로 살아가는 교회',
    preacher: '담임목사',
    date: '2025-11-02',
  },
  {
    id: 3,
    title: '하나님 나라를 구하라',
    preacher: '담임목사',
    date: '2025-10-26',
  },
];

export default function LatestSermons() {
  return (
    <div className="grid gap-4 md:grid-cols-3 mt-6">
      {dummySermons.map((sermon) => (
        <div
          key={sermon.id}
          className="rounded-xl border border-slate-200 p-5 hover:border-slate-900/30 transition"
        >
          <p className="text-xs text-slate-400">{sermon.date}</p>
          <h3 className="mt-2 text-sm font-semibold text-slate-900 line-clamp-2">
            {sermon.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{sermon.preacher}</p>
          <a
            href={`/sermons/${sermon.id}`}
            className="mt-3 inline-block text-xs font-medium text-slate-900"
          >
            설교보기 →
          </a>
        </div>
      ))}
    </div>
  );
}
