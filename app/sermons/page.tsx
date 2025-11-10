import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Youtube } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

async function getSermons() {
  const sermons = await prisma.sermon.findMany({
    orderBy: { date: 'desc' },
  });
  return sermons;
}

export default async function SermonsPage() {
  const sermons = await getSermons();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">예배/설교</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {sermons.length > 0 ? (
          sermons.map((sermon) => (
            <Card key={sermon.id}>
              <CardHeader>
                <CardTitle className="text-2xl">{sermon.title}</CardTitle>
                <CardDescription>
                  {sermon.preacher} 목사 ·{' '}
                  {format(new Date(sermon.date), 'yyyy년 M월 d일', { locale: ko })}
                </CardDescription>
              </CardHeader>
              {sermon.youtube && (
                <CardContent>
                  <a
                    href={sermon.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    <Youtube className="w-5 h-5" />
                    <span>영상 보기</span>
                  </a>
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-16 text-center text-gray-500">
              <Book className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>등록된 설교가 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
