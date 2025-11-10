# 포도원교회 웹사이트 - 설치 및 실행 가이드

## 빠른 시작 (3분 완성)

### 1단계: 의존성 설치
\`\`\`bash
cd podowon-church
npm install
\`\`\`

### 2단계: 데이터베이스 설정
\`\`\`bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev --name init

# 시드 데이터 삽입 (테스트 계정 및 샘플 데이터)
npm run seed
\`\`\`

### 3단계: 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

### 4단계: 브라우저에서 확인
- http://localhost:3000 접속

### 5단계: 관리자로 로그인
- 로그인 버튼 클릭 (우측 상단)
- 이메일: **admin@podowon.org**
- 비밀번호: **1234**
- 관리자 페이지 접속하여 콘텐츠 관리

---

## 상세 설명

### 시스템 요구사항
- Node.js 18.17 이상
- npm 또는 yarn

### 환경 변수 설정 (선택사항)

기본적으로 SQLite를 사용하므로 별도 설정 없이 바로 실행 가능합니다.

프로덕션 환경에서는 `.env` 파일을 수정하세요:

\`\`\`env
# JWT Secret (반드시 변경!)
JWT_SECRET="your-random-secret-key-here"

# SQLite (기본값)
DATABASE_URL="file:./dev.db"

# 또는 PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/podowon?schema=public"
\`\`\`

### 테스트 계정

#### 관리자 계정
- 이메일: admin@podowon.org
- 비밀번호: 1234
- 권한: 모든 콘텐츠 관리 가능

#### 일반 사용자 계정
- 이메일: user@podowon.org
- 비밀번호: 1234
- 권한: 게시글 작성, 자신의 글 삭제

### 데이터베이스 관리

#### Prisma Studio로 데이터 확인
\`\`\`bash
npx prisma studio
\`\`\`
브라우저에서 http://localhost:5555 접속하여 GUI로 데이터 관리

#### 데이터베이스 초기화
\`\`\`bash
# 데이터베이스 삭제
rm -f prisma/dev.db prisma/dev.db-journal

# 재생성
npx prisma migrate dev --name init
npm run seed
\`\`\`

---

## PostgreSQL로 전환하기

### 1. PostgreSQL 설치 및 실행
- macOS: `brew install postgresql && brew services start postgresql`
- Ubuntu: `sudo apt install postgresql && sudo systemctl start postgresql`
- Windows: PostgreSQL 공식 설치 프로그램 사용

### 2. 데이터베이스 생성
\`\`\`bash
psql postgres
CREATE DATABASE podowon;
CREATE USER podowon_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE podowon TO podowon_user;
\\q
\`\`\`

### 3. Prisma Schema 수정
`prisma/schema.prisma` 파일에서:
\`\`\`prisma
datasource db {
  provider = "postgresql"  // sqlite에서 변경
  url      = env("DATABASE_URL")
}
\`\`\`

### 4. 환경 변수 수정
`.env` 파일에서:
\`\`\`env
DATABASE_URL="postgresql://podowon_user:your_password@localhost:5432/podowon?schema=public"
\`\`\`

### 5. 마이그레이션 실행
\`\`\`bash
npx prisma migrate dev --name init
npm run seed
\`\`\`

---

## Vercel 배포

### 1. GitHub에 푸시
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/podowon-church.git
git push -u origin main
\`\`\`

### 2. Vercel에서 프로젝트 Import
1. https://vercel.com 접속 및 로그인
2. "New Project" 클릭
3. GitHub 리포지터리 선택
4. 환경 변수 설정:
   - `DATABASE_URL`: Vercel Postgres 또는 외부 DB URL
   - `JWT_SECRET`: 랜덤 문자열 (최소 32자)

### 3. 배포
- "Deploy" 클릭
- 자동으로 빌드 및 배포 완료
- 도메인 연결 가능

---

## 자체 서버 배포

### 1. 프로덕션 빌드
\`\`\`bash
npm run build
\`\`\`

### 2. 서버 실행
\`\`\`bash
npm start
\`\`\`

### 3. PM2로 백그라운드 실행 (선택)
\`\`\`bash
npm install -g pm2
pm2 start npm --name "podowon-church" -- start
pm2 save
pm2 startup
\`\`\`

### 4. Nginx 리버스 프록시 설정 (선택)
`/etc/nginx/sites-available/podowon`:
\`\`\`nginx
server {
    listen 80;
    server_name podowon.org www.podowon.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

---

## 트러블슈팅

### "Cannot find module @prisma/client"
\`\`\`bash
npx prisma generate
\`\`\`

### "Database is locked" (SQLite)
개발 중 이 오류가 발생하면:
\`\`\`bash
# 서버 중지 후 재시작
npm run dev
\`\`\`

### 포트 이미 사용 중
\`\`\`bash
# 포트 변경하여 실행
PORT=3001 npm run dev
\`\`\`

### Prisma 마이그레이션 오류
\`\`\`bash
# 마이그레이션 초기화
npx prisma migrate reset
npx prisma migrate dev --name init
npm run seed
\`\`\`

---

## 주요 기능 가이드

### 관리자 페이지 사용법
1. 로그인 (admin@podowon.org / 1234)
2. 우측 상단 프로필 → "관리자 페이지" 클릭
3. 탭별 콘텐츠 관리:
   - **대시보드**: 전체 통계 확인
   - **배너**: 메인 페이지 히어로 배너 수정
   - **메뉴**: 상단 네비게이션 메뉴 관리
   - **공지**: 공지사항 추가/삭제
   - **설교**: 설교 영상 추가 (YouTube 링크)
   - **게시판**: 모든 게시글 관리/삭제

### 게시판 사용법
- **공지사항**: 중요 공지
- **자유게시판**: 성도간 자유로운 소통
- **기도제목**: 비밀글 지원 (작성자+관리자만 열람)

### 비밀글 기능
기도제목에서 "비밀글로 작성" 체크 시:
- 작성자 본인과 관리자만 내용 확인 가능
- 다른 사용자에게는 "비밀글입니다" 표시

---

## 추가 커스터마이징

### 교회 이름 변경
1. `.env` 파일: `NEXT_PUBLIC_SITE_NAME="새교회이름"`
2. `app/layout.tsx`: metadata 수정
3. `components/site-header.tsx`: 로고 텍스트 수정

### 색상 테마 변경
`app/globals.css` 파일에서 CSS 변수 수정:
\`\`\`css
--primary: 238 76% 58%;  /* 메인 컬러 */
\`\`\`

### 연락처 정보 변경
`components/site-footer.tsx` 파일 수정

---

## 지원

문의사항이 있으시면 이슈를 등록해주세요.
