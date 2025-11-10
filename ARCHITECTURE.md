# 포도원교회 웹사이트 - 프로젝트 아키텍처

## 전체 구조

```
포도원교회 웹앱
├── Frontend (Next.js 14 App Router)
│   ├── 공개 페이지
│   ├── 인증 페이지
│   └── 관리자 페이지
├── Backend (Next.js API Routes)
│   ├── 인증 API
│   ├── 콘텐츠 관리 API
│   └── 게시판 API
└── Database (Prisma + SQLite/PostgreSQL)
    └── 관계형 데이터베이스
```

---

## 디렉터리 구조

```
podowon-church/
├── app/                        # Next.js App Router
│   ├── about/                  # 교회소개 페이지
│   ├── admin/                  # 관리자 페이지 (ADMIN 전용)
│   ├── board/                  # 게시판 (공지/자유/기도)
│   ├── education/              # 교육/훈련
│   ├── login/                  # 로그인 페이지
│   ├── ministries/             # 목양/사역
│   ├── news/                   # 소식/주보
│   ├── sermons/                # 예배/설교
│   ├── api/                    # API Routes
│   │   ├── auth/               # 인증 (로그인/로그아웃/me)
│   │   ├── banners/            # 배너 관리
│   │   ├── board/              # 게시판 CRUD
│   │   ├── education/          # 교육 프로그램
│   │   ├── menus/              # 메뉴 관리
│   │   ├── newcomers/          # 새가족 등록
│   │   ├── notices/            # 공지사항
│   │   ├── sermons/            # 설교 관리
│   │   └── uploads/            # 파일 업로드 (TODO)
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈 페이지
│   └── globals.css             # 전역 스타일
├── components/                 # React 컴포넌트
│   ├── ui/                     # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── tabs.tsx
│   │   └── textarea.tsx
│   ├── hero-banner.tsx         # 메인 배너
│   ├── site-footer.tsx         # 사이트 푸터
│   └── site-header.tsx         # 사이트 헤더 (네비게이션)
├── lib/                        # 유틸리티 라이브러리
│   ├── auth.ts                 # JWT 인증 로직
│   ├── prisma.ts               # Prisma 클라이언트
│   ├── utils.ts                # 공통 유틸
│   └── validation.ts           # Zod 스키마 검증
├── prisma/                     # Prisma ORM
│   ├── schema.prisma           # 데이터베이스 스키마
│   └── seed.ts                 # 시드 데이터
├── package.json                # npm 설정
├── tsconfig.json               # TypeScript 설정
├── tailwind.config.ts          # Tailwind CSS 설정
├── next.config.mjs             # Next.js 설정
└── .env                        # 환경 변수
```

---

## 데이터베이스 스키마

### User (사용자)
- id: 고유 ID
- email: 이메일 (로그인 ID)
- password: 해시된 비밀번호
- name: 이름
- role: 역할 (ADMIN | MEMBER)
- createdAt: 가입일

### Banner (메인 배너)
- id: 고유 ID
- title: 제목
- subtitle: 부제목
- period: 기간
- imageUrl: 이미지 URL
- updatedAt: 수정일

### MenuItem (메뉴)
- id: 고유 ID
- label: 메뉴 라벨
- path: 경로
- order: 순서
- visible: 표시 여부

### Notice (공지사항)
- id: 고유 ID
- title: 제목
- content: 내용
- date: 날짜
- createdAt: 생성일

### Sermon (설교)
- id: 고유 ID
- title: 제목
- preacher: 설교자
- date: 설교일
- youtube: YouTube URL
- createdAt: 등록일

### Post (게시글)
- id: 고유 ID
- title: 제목
- content: 내용
- authorId: 작성자 ID (User 참조)
- boardType: 게시판 종류 (NOTICE | FREE | PRAYER)
- isSecret: 비밀글 여부
- createdAt: 작성일

### Newcomer (새가족)
- id: 고유 ID
- name: 이름
- phone: 전화번호
- memo: 메모
- date: 등록일

### EducationProgram (교육 프로그램)
- id: 고유 ID
- name: 프로그램 이름
- description: 설명
- status: 상태 (모집중 등)
- createdAt: 생성일

### EducationApply (교육 신청)
- id: 고유 ID
- programId: 프로그램 ID
- userId: 사용자 ID (선택)
- name: 신청자 이름
- date: 신청일

---

## 인증 시스템

### 인증 흐름
1. 사용자가 이메일/비밀번호 입력
2. `/api/auth/login` POST 요청
3. bcrypt로 비밀번호 검증
4. JWT 토큰 생성 (jose 라이브러리)
5. HttpOnly 쿠키에 토큰 저장
6. 클라이언트로 사용자 정보 반환

### 인증 확인
- `getCurrentUser()`: 현재 로그인한 사용자 정보 반환
- `requireAuth()`: 인증 필수 (미인증 시 에러)
- `requireAdmin()`: 관리자 권한 필수

### 보안 설정
- JWT 토큰 유효기간: 7일
- HttpOnly 쿠키 사용 (XSS 방지)
- SameSite: Lax
- Secure: 프로덕션에서만 true

---

## API 엔드포인트

### 인증 API
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

### 콘텐츠 API
- `GET /api/banners` - 배너 조회
- `PATCH /api/banners` - 배너 수정 (ADMIN)
- `GET /api/menus` - 메뉴 목록
- `POST /api/menus` - 메뉴 추가 (ADMIN)
- `PUT /api/menus` - 메뉴 수정 (ADMIN)
- `DELETE /api/menus?id={id}` - 메뉴 삭제 (ADMIN)

### 공지/설교 API
- `GET /api/notices` - 공지사항 목록
- `POST /api/notices` - 공지 추가 (ADMIN)
- `PUT /api/notices` - 공지 수정 (ADMIN)
- `DELETE /api/notices?id={id}` - 공지 삭제 (ADMIN)
- `GET /api/sermons` - 설교 목록
- `POST /api/sermons` - 설교 추가 (ADMIN)
- `DELETE /api/sermons?id={id}` - 설교 삭제 (ADMIN)

### 게시판 API
- `GET /api/board?type={NOTICE|FREE|PRAYER}` - 게시글 목록
- `POST /api/board` - 게시글 작성 (인증 필요)
- `DELETE /api/board/{id}` - 게시글 삭제 (작성자 또는 ADMIN)

### 기타 API
- `GET /api/education` - 교육 프로그램 목록
- `POST /api/education` - 프로그램 추가 (ADMIN)
- `DELETE /api/education?id={id}` - 프로그램 삭제 (ADMIN)
- `GET /api/newcomers` - 새가족 목록 (ADMIN)
- `POST /api/newcomers` - 새가족 등록

---

## 주요 기능 구현

### 1. 실시간 메뉴 관리
관리자가 메뉴를 추가/수정/삭제하면:
1. DB에 즉시 반영
2. 사이트 헤더가 자동으로 새로고침
3. 모든 페이지에서 즉시 반영

**구현 방식:**
- `components/site-header.tsx`에서 `useEffect`로 메뉴 fetch
- 메뉴 변경 시 자동 리렌더링

### 2. 비밀글 기능 (기도제목)
기도제목 게시판에서 비밀글 작성 시:
1. `isSecret: true`로 저장
2. API에서 권한 확인:
   - 작성자 본인 → 전체 내용 반환
   - ADMIN → 전체 내용 반환
   - 그 외 → "비밀글입니다" 반환
3. 프론트에서 "비밀글입니다" 배지 표시

**구현 위치:**
- `app/api/board/route.ts` (GET 메서드)
- `app/board/page.tsx` (UI 렌더링)

### 3. 권한별 삭제 버튼
게시글 삭제 버튼 표시 조건:
- 작성자 본인 → 표시
- ADMIN → 항상 표시
- 그 외 → 숨김

**구현 위치:**
- `app/board/page.tsx`의 `canDelete()` 함수
- `app/api/board/[id]/route.ts` (DELETE 메서드)

### 4. 관리자 대시보드
실시간 통계 표시:
- 전체 게시글 수
- 오늘 등록된 새가족 수
- 교육 신청 수
- 최근 공지사항 5개

**구현 위치:**
- `app/admin/page.tsx`
- 각 API에서 데이터 집계

---

## 상태 관리

### 클라이언트 상태
- React useState/useEffect 사용
- 서버 상태는 fetch로 관리
- 실시간 동기화가 필요한 경우 refetch

### 서버 상태
- Next.js Server Components (RSC)
- 페이지 로드 시 서버에서 데이터 fetch
- SEO 최적화

---

## 스타일링

### Tailwind CSS
- 유틸리티 우선 CSS 프레임워크
- 커스텀 테마: `tailwind.config.ts`
- 전역 스타일: `app/globals.css`

### 디자인 시스템
- **메인 컬러**: Indigo/Violet 계열
- **배경**: Slate-50
- **카드**: White + Shadow
- **둥근 모서리**: rounded-2xl

### shadcn/ui
- Radix UI 기반 컴포넌트
- 완전히 커스터마이징 가능
- `components/ui/` 디렉터리

---

## 성능 최적화

### Next.js 최적화
- Server Components로 초기 로딩 빠름
- 자동 코드 분할
- 이미지 최적화 (next/image)

### 데이터베이스 최적화
- Prisma 쿼리 최적화
- 필요한 필드만 select
- 인덱스 활용

---

## 보안

### 인증/인가
- JWT + HttpOnly 쿠키
- 비밀번호 bcrypt 해싱
- ADMIN 권한 체크

### XSS 방지
- React 자동 이스케이핑
- 사용자 입력 검증 (Zod)

### CSRF 방지
- SameSite 쿠키 설정

---

## 확장 가능성

### 추가 기능 구현 가이드

#### 1. 새 페이지 추가
```typescript
// app/new-page/page.tsx
export default function NewPage() {
  return <div>새 페이지</div>;
}
```

#### 2. 새 API 추가
```typescript
// app/api/new-endpoint/route.ts
import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ data: 'hello' });
}
```

#### 3. 새 DB 모델 추가
```prisma
// prisma/schema.prisma
model NewModel {
  id   Int    @id @default(autoincrement())
  name String
}
```
그 후 `npx prisma migrate dev` 실행

---

## 배포 고려사항

### 환경 변수
프로덕션 배포 시 반드시 변경:
- `JWT_SECRET`: 랜덤한 긴 문자열
- `DATABASE_URL`: 프로덕션 DB URL

### 데이터베이스
- SQLite: 개발/소규모용
- PostgreSQL: 프로덕션 권장

### 파일 업로드
현재는 URL 입력 방식만 구현됨.
실제 파일 업로드는 다음 중 선택:
- AWS S3
- Cloudinary
- Vercel Blob
- Supabase Storage

---

## 유지보수

### 정기 업데이트
```bash
# 의존성 업데이트
npm update

# Prisma 재생성
npx prisma generate
```

### 데이터베이스 백업
```bash
# SQLite
cp prisma/dev.db backup/dev_$(date +%Y%m%d).db

# PostgreSQL
pg_dump podowon > backup/podowon_$(date +%Y%m%d).sql
```

---

## 참고 자료

- Next.js 문서: https://nextjs.org/docs
- Prisma 문서: https://www.prisma.io/docs
- shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com
