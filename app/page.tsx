import Link from 'next/link';
import { Calendar, Book, Users, Bell, ChevronRight } from 'lucide-react';
import HeroBanner from '@/components/hero-banner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

async function getBanner() {
  const banner = await prisma.banner.findFirst({
    orderBy: { id: 'desc' },
  });
  return banner;
}

async function getMenuItems() {
  const menuItems = await prisma.menuItem.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
    take: 4,
  });
  return menuItems;
}

async function getNotices() {
  const notices = await prisma.notice.findMany({
    orderBy: { date: 'desc' },
    take: 3,
  });
  return notices;
}

async function getSermons() {
  const sermons = await prisma.sermon.findMany({
    orderBy: { date: 'desc' },
    take: 3,
  });
  return sermons;
}

const quickLinkIcons: Record<string, any> = {
  '/about': Users,
  '/sermons': Book,
  '/education': Calendar,
  '/news': Bell,
};

export default async function HomePage() {
  const banner = await getBanner();
  const menuItems = await getMenuItems();
  const notices = await getNotices();
  const sermons = await getSermons();

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-8">
        {banner && (
          <HeroBanner
            title={banner.title}
            subtitle={banner.subtitle || undefined}
            period={banner.period || undefined}
            imageUrl={banner.imageUrl || undefined}
          />
        )}
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">빠른 메뉴</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {menuItems.map((item) => {
            const Icon = quickLinkIcons[item.path] || Users;
            return (
              <Link key={item.id} href={item.path}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <CardTitle>{item.label}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">공지사항</h2>
              <Link href="/news">
                <Button variant="ghost" size="sm">
                  더보기 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <Card key={notice.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{notice.title}</CardTitle>
                      <CardDescription>
                        {format(new Date(notice.date), 'yyyy년 M월 d일', { locale: ko })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2">{notice.content}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>등록된 공지사항이 없습니다.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">최근 설교</h2>
              <Link href="/sermons">
                <Button variant="ghost" size="sm">
                  더보기 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {sermons.length > 0 ? (
                sermons.map((sermon) => (
                  <Card key={sermon.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{sermon.title}</CardTitle>
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
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          영상 보기 →
                        </a>
                      </CardContent>
                    )}
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    <Book className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>등록된 설교가 없습니다.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
