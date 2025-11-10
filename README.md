# 포도원교회 웹사이트

실제 교회에서 바로 사용 가능한 프로덕션급 풀스택 웹앱입니다.

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI, Lucide React
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM + SQLite (PostgreSQL 전환 가능)
- **Authentication**: JWT + HttpOnly Cookies

## 주요 기능

### 일반 사용자
- 🏠 홈페이지 (배너, 빠른 메뉴, 최신 공지/설교)
- ℹ️ 교회소개
- 📖 예배/설교 목록 (YouTube 연동)
- 👥 목양/사역 안내
- 🎓 교육/훈련 프로그램
- 📢 소식/주보
- 💬 게시판 (공지사항, 자유게시판, 기도제목)
  - 비밀글 기능 (기도제목)
  - 작성자/관리자 삭제 권한

### 관리자 (Admin)
- 📊 대시보드 (통계)
- 🖼️ 배너 관리
- 📋 메뉴 관리
- 📝 공지사항 관리
- 🎤 설교 관리
- 📌 게시판 관리 (모든 게시글 삭제 가능)

## 설치 및 실행

### 1. 의존성 설치
\`\`\`bash
npm install
\`\`\`

### 2. 환경 변수 설정
\`\`\`bash
cp .env.example .env
\`\`\`

필요시 `.env` 파일의 `JWT_SECRET`을 변경하세요.

### 3. 데이터베이스 설정
\`\`\`bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev --name init

# 시드 데이터 삽입
npm run seed
\`\`\`

### 4. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 테스트 계정

### 관리자 계정
- 이메일: admin@podowon.org
- 비밀번호: 1234

### 일반 사용자 계정
- 이메일: user@podowon.org
- 비밀번호: 1234

## PostgreSQL로 변경하기

1. `.env` 파일에서 `DATABASE_URL` 수정:
\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/podowon?schema=public"
\`\`\`

2. `prisma/schema.prisma` 파일에서 provider 변경:
\`\`\`prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
\`\`\`

3. 마이그레이션 재실행:
\`\`\`bash
npx prisma migrate dev
npm run seed
\`\`\`

## 배포

### Vercel 배포
1. GitHub에 리포지터리 푸시
2. Vercel에서 프로젝트 import
3. 환경 변수 설정 (`JWT_SECRET`, `DATABASE_URL`)
4. 배포

### 자체 서버 배포
\`\`\`bash
npm run build
npm start
\`\`\`

## 파일 업로드 설정

`/api/uploads` 엔드포인트는 기본적으로 구현되어 있지 않습니다.
실제 파일 업로드를 사용하려면:

1. AWS S3, Cloudinary, 또는 다른 스토리지 서비스 선택
2. `app/api/uploads/route.ts` 파일 수정
3. 해당 스토리지 SDK 설치 및 구현

## 프로젝트 구조

\`\`\`
podowon-church/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── admin/             # 관리자 페이지
│   ├── board/             # 게시판
│   └── ...
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   └── ...
├── lib/                   # 유틸리티
│   ├── prisma.ts         # Prisma 클라이언트
│   ├── auth.ts           # 인증 로직
│   └── validation.ts     # 스키마 검증
├── prisma/               # Prisma 설정
│   ├── schema.prisma     # DB 스키마
│   └── seed.ts           # 시드 데이터
└── ...
\`\`\`

## 라이센스

MIT

## 지원

문의사항이 있으시면 이슈를 등록해주세요.
