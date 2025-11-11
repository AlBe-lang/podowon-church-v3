// components/QuickInfo.tsx
export default function QuickInfo() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5">
        <h3 className="text-sm font-semibold text-slate-900">예배시간</h3>
        <p className="mt-2 text-sm text-slate-600">
          주일 1부 9:00 / 2부 11:00<br />
          수요예배 19:30 / 금요기도회 21:00
        </p>
      </div>
      <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5">
        <h3 className="text-sm font-semibold text-slate-900">담임목사 인사</h3>
        <p className="mt-2 text-sm text-slate-600">
          말씀과 사랑으로 성도님들을 섬기겠습니다.
        </p>
        <a href="/pastor" className="mt-3 inline-block text-xs text-slate-900 underline">
          인사말 보기
        </a>
      </div>
      <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5">
        <h3 className="text-sm font-semibold text-slate-900">새가족 등록</h3>
        <p className="mt-2 text-sm text-slate-600">
          처음 오셨나요? 안내팀에게 말씀해 주세요.
        </p>
        <a href="/new" className="mt-3 inline-block text-xs text-slate-900 underline">
          새가족 안내
        </a>
      </div>
    </div>
  );
}
