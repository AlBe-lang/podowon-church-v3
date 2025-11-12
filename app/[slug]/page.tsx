// app/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import SectionTitle from '@/components/SectionTitle';

export default async function DynamicPage({
  params,
}: {
  params: { slug: string };
}) {
  // admin 페이지에서 저장한 콘텐츠 있으면 그걸 보여주고,
  // 없으면 "게시물이 없습니다"로
  const page = await prisma.pageContent.findUnique({
    where: { pageId: params.slug },
  });

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-16">
        <SectionTitle
          title="게시물이 없습니다"
          subtitle="아직 이 페이지에 등록된 콘텐츠가 없습니다. 관리자에서 추가해 주세요."
        />
        <p className="mt-6 text-sm text-slate-500">
          요청하신 경로: <code className="bg-slate-100 px-2 py-1 rounded">{`/${params.slug}`}</code>
        </p>
      </div>
    );
  }

  // prisma.schema에선 pageContent가 publishedData만 갖고 있었음
  // publishedData를 JSON으로 저장해두는 패턴
  const data =
    page.publishedData && page.publishedData !== '{}'
      ? JSON.parse(page.publishedData)
      : null;

  return (
    <div className="container mx-auto px-4 py-16 space-y-6">
      <SectionTitle
        title={page.title || '페이지'}
        subtitle="포도원교회 온라인"
      />
      {data ? (
        <pre className="bg-slate-50 rounded-xl p-6 text-sm text-slate-700 whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p className="text-slate-500 text-sm">등록된 본문이 없습니다.</p>
      )}
    </div>
  );
}
