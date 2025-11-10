import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

async function getNotices() {
  const notices = await prisma.notice.findMany({
    orderBy: { date: 'desc' },
  });
  return notices;
}

export default async function NewsPage() {
  const notices = await getNotices();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">소식/주보</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <Card key={notice.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl">{notice.title}</CardTitle>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {format(new Date(notice.date), 'yyyy년 M월 d일', { locale: ko })}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{notice.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-16 text-center text-gray-500">
              <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>등록된 공지사항이 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
