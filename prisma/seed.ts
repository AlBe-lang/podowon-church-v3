import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 비밀번호 해시 생성
  const hashedPassword = await bcrypt.hash('1234', 10);

  // 사용자 생성
  const admin = await prisma.user.upsert({
    where: { email: 'admin@podowon.org' },
    update: {},
    create: {
      email: 'admin@podowon.org',
      password: hashedPassword,
      name: '사이트관리자',
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@podowon.org' },
    update: {},
    create: {
      email: 'user@podowon.org',
      password: hashedPassword,
      name: '일반성도',
      role: 'MEMBER',
    },
  });

  console.log('Users created:', { admin, user });

  // 배너 생성
  const banner = await prisma.banner.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: '2025 봄 특별새벽기도회',
      subtitle: '주님과 함께하는 새벽의 은혜',
      period: '2025년 3월 1일 ~ 3월 31일 / 매일 새벽 5시 30분',
      imageUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1200&h=400&fit=crop',
    },
  });

  console.log('Banner created:', banner);

  // 메뉴 아이템 생성
  const menuItems = [
    { label: '홈', path: '/', order: 1, visible: true },
    { label: '교회소개', path: '/about', order: 2, visible: true },
    { label: '예배/설교', path: '/sermons', order: 3, visible: true },
    { label: '목양/사역', path: '/ministries', order: 4, visible: true },
    { label: '교육/훈련', path: '/education', order: 5, visible: true },
    { label: '소식/주보', path: '/news', order: 6, visible: true },
    { label: '게시판', path: '/board', order: 7, visible: true },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: item.order },
      update: {},
      create: item,
    });
  }

  console.log('Menu items created');

  // 공지사항 생성
  const notices = [
    {
      title: '2025년 1분기 정기 공동의회 안내',
      content: '사랑하는 포도원교회 성도님들께,\n\n2025년 1분기 정기 공동의회를 다음과 같이 개최하오니 많은 참석 부탁드립니다.\n\n일시: 2025년 3월 15일(토) 오후 2시\n장소: 본당\n안건: 2024년 결산보고, 2025년 예산안, 당회 보고 등',
      date: new Date('2025-02-20'),
    },
    {
      title: '새가족 환영 예배 및 오찬 안내',
      content: '새로 오신 가족들을 환영하는 시간을 마련했습니다.\n\n일시: 매월 마지막 주일 오후 1시\n장소: 교육관 2층 소예배실\n대상: 최근 3개월 내 등록하신 새가족\n\n* 점심 식사가 제공됩니다.',
      date: new Date('2025-02-15'),
    },
    {
      title: '청년부 겨울 수련회 간증',
      content: '지난 2월 2-4일, 청년부 겨울 수련회가 은혜 가운데 마쳤습니다.\n\n참석 인원: 85명\n주제: "빛의 자녀들처럼 살아가라" (엡 5:8)\n\n수련회를 통해 많은 청년들이 신앙의 회복과 재헌신의 시간을 가졌습니다.',
      date: new Date('2025-02-10'),
    },
  ];

  for (const notice of notices) {
    await prisma.notice.create({
      data: notice,
    });
  }

  console.log('Notices created');

  // 설교 생성
  const sermons = [
    {
      title: '하나님의 사랑',
      preacher: '김목사',
      date: new Date('2025-02-23'),
      youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      title: '믿음으로 살아가기',
      preacher: '이목사',
      date: new Date('2025-02-16'),
      youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  ];

  for (const sermon of sermons) {
    await prisma.sermon.create({
      data: sermon,
    });
  }

  console.log('Sermons created');

  // 교육 프로그램 생성
  const programs = [
    {
      name: '새신자 양육 과정',
      description: '새로 등록하신 분들을 위한 기본 신앙 교육 (총 8주)',
      status: '모집중',
    },
    {
      name: '제자훈련 과정',
      description: '성숙한 그리스도인으로 성장하기 위한 심화 과정 (총 6개월)',
      status: '모집중',
    },
  ];

  for (const program of programs) {
    await prisma.educationProgram.create({
      data: program,
    });
  }

  console.log('Education programs created');

  // 사이트 설정 생성
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      siteName: '포도원교회',
      primaryColor: '#4F46E5',
      secondaryColor: '#6366F1',
      fontFamily: 'Inter',
      contactEmail: 'contact@podowon.org',
      contactPhone: '02-1234-5678',
      address: '서울시 강남구 테헤란로 123',
    },
  });

  console.log('Site settings created:', siteSettings);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
