# 🎨 포도원교회 v2.0 - 노코드 CMS 업그레이드

## 🎉 새로운 기능

### ✨ 추가된 기능

#### 1. **사이트 설정 관리** (관리자 > 사이트 탭)
일반 관리자가 개발 지식 없이 사이트 전체 설정을 변경할 수 있습니다:

- **사이트 이름 변경**: "포도원교회" → 원하는 이름으로
- **로고 업로드**: 로고 이미지 URL 입력
- **색상 테마 변경**: 
  - 메인 색상 (색상 피커로 선택)
  - 보조 색상 (색상 피커로 선택)
  - 실시간 미리보기
- **폰트 변경**: 
  - Inter (기본)
  - Noto Sans KR
  - 나눔고딕
  - 맑은 고딕
- **연락처 정보**:
  - 이메일
  - 전화번호  
  - 주소
  - 푸터에 자동 반영

#### 2. **페이지 콘텐츠 관리** (관리자 > 페이지 탭)
각 페이지의 텍스트 내용을 직접 수정:

- **교회소개 페이지**:
  - 비전/핵심가치 수정
  - 연혁 수정
  - 목회진 소개 수정
- 텍스트 에디터로 간편하게 작성
- 저장 버튼 클릭 시 즉시 반영

#### 3. **동적 사이트 적용**
관리자가 변경한 설정이 사이트 전체에 자동 적용:

- 헤더(로고, 교회 이름, 색상)
- 푸터(연락처 정보)
- 모든 페이지의 색상 테마

---

## 📦 업그레이드 방법

### 옵션 1: 기존 프로젝트 업그레이드 (권장)

#### 1단계: 변경된 파일 업데이트

**새 파일들:**
```bash
app/api/settings/route.ts          # 사이트 설정 API
app/api/page-content/route.ts      # 페이지 콘텐츠 API
```

**수정된 파일들:**
```bash
prisma/schema.prisma               # DB 스키마 (2개 모델 추가)
prisma/seed.ts                     # 시드 데이터
app/admin/page.tsx                 # 관리자 페이지 (2개 탭 추가)
components/site-header.tsx         # 동적 헤더
components/site-footer.tsx         # 동적 푸터
```

#### 2단계: 데이터베이스 마이그레이션

```bash
# 프로젝트 루트에서 실행
npx prisma migrate dev --name add_site_settings

# 시드 데이터 재실행
npm run seed
```

#### 3단계: 확인

```bash
npm run dev
```

관리자 페이지(http://localhost:3000/admin)에서 새 탭들을 확인하세요!

---

### 옵션 2: 새 프로젝트로 시작

```bash
# 기존 프로젝트 백업
mv podowon-church podowon-church-backup

# 새 버전 다운로드 및 설치
# (GitHub에서 새 버전 클론)

# 기존 데이터 이관 (선택)
cp podowon-church-backup/.env podowon-church/
cp podowon-church-backup/prisma/dev.db podowon-church/prisma/
```

---

## 🎯 사용 방법

### 1. 사이트 이름과 색상 변경하기

1. 관리자 로그인 (admin@podowon.org / 1234)
2. 관리자 페이지 → **🎨 사이트** 탭
3. "사이트 기본 정보" 섹션:
   - 사이트 이름: "새빛교회" (예시)
   - 로고 URL: https://your-logo.png (선택)
4. "디자인 설정" 섹션:
   - 메인 색상: 색상 피커 클릭 → 원하는 색 선택
   - 보조 색상: 색상 피커 클릭 → 원하는 색 선택
   - 폰트: 드롭다운에서 선택
5. 미리보기 확인
6. **"사이트 설정 저장"** 버튼 클릭
7. 페이지 새로고침

✅ 모든 페이지의 색상과 이름이 변경됩니다!

### 2. 연락처 정보 변경하기

1. 관리자 페이지 → **🎨 사이트** 탭
2. "연락처 정보" 섹션:
   - 이메일: info@newchurch.org
   - 전화번호: 02-9876-5432
   - 주소: 서울시 서초구 서초대로 123
3. **"사이트 설정 저장"** 버튼 클릭

✅ 사이트 하단(푸터)의 연락처가 자동으로 변경됩니다!

### 3. 교회소개 내용 수정하기

1. 관리자 페이지 → **📄 페이지** 탭
2. 각 섹션에 내용 입력:
   - 비전/핵심가치
   - 연혁
   - 목회진 소개
3. **"저장"** 버튼 클릭

✅ 교회소개 페이지(/about)의 내용이 즉시 변경됩니다!

---

## 📋 변경 사항 상세

### 데이터베이스 스키마 추가

```prisma
model PageContent {
  id        Int      @id @default(autoincrement())
  pageId    String   @unique
  title     String?
  sections  String   @default("[]")
  updatedAt DateTime @updatedAt
}

model SiteSettings {
  id             Int      @id @default(autoincrement())
  siteName       String   @default("포도원교회")
  logoUrl        String?
  primaryColor   String   @default("#4F46E5")
  secondaryColor String   @default("#6366F1")
  fontFamily     String   @default("Inter")
  contactEmail   String?
  contactPhone   String?
  address        String?
  updatedAt      DateTime @updatedAt
}
```

### 새 API 엔드포인트

- `GET /api/settings` - 사이트 설정 조회
- `PATCH /api/settings` - 사이트 설정 업데이트 (ADMIN)
- `GET /api/page-content?pageId=about` - 페이지 콘텐츠 조회
- `POST /api/page-content` - 페이지 콘텐츠 저장 (ADMIN)

---

## 🎨 사용 예시

### Before (v1.0)
```
❌ 색상 변경: 코드 수정 필요
❌ 교회 이름 변경: 여러 파일 수정 필요
❌ 연락처 변경: 코드 수정 필요
❌ 페이지 내용 변경: 코드 수정 필요
```

### After (v2.0)
```
✅ 색상 변경: 색상 피커로 클릭!
✅ 교회 이름 변경: 한 곳에서 입력!
✅ 연락처 변경: 폼에 입력!
✅ 페이지 내용 변경: 텍스트 에디터로 작성!
```

---

## 🔮 향후 추가 예정 기능

### v2.1 (다음 업데이트)
- [ ] 이미지 직접 업로드 (Vercel Blob)
- [ ] 교회소개 외 다른 페이지 편집
- [ ] 위지윅 에디터 (Rich Text Editor)
- [ ] 섹션 추가/삭제/순서 변경
- [ ] 예배 시간 관리

### v3.0 (미래)
- [ ] 드래그 앤 드롭 페이지 빌더
- [ ] 테마 템플릿 (5종)
- [ ] 멀티미디어 라이브러리
- [ ] 모바일 앱 관리

---

## ⚙️ Vercel 배포 시 주의사항

### 1. 환경 변수 확인
Vercel 대시보드에서 다음 환경 변수가 설정되어 있는지 확인:
```
DATABASE_URL=postgresql://...  (Vercel Postgres)
JWT_SECRET=your-secret-key
```

### 2. 데이터베이스 마이그레이션
새 배포 전에 Vercel Postgres에서 마이그레이션 실행:
```bash
# Vercel CLI 사용
vercel env pull
npx prisma migrate deploy
```

### 3. 시드 데이터
프로덕션 DB에 시드 데이터가 필요한 경우:
```bash
npm run seed
```

---

## 🆘 문제 해결

### "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### "Table already exists" 오류
```bash
# 개발 환경에서만! (프로덕션 주의)
npx prisma migrate reset
npx prisma migrate dev
npm run seed
```

### 사이트 설정이 반영되지 않음
1. 브라우저 새로고침 (Ctrl+F5 또는 Cmd+Shift+R)
2. 브라우저 캐시 삭제
3. 개발 서버 재시작

### 색상이 적용되지 않음
- 현재 헤더와 푸터만 동적으로 적용됩니다
- v2.1에서 모든 페이지에 적용 예정

---

## 📊 버전 비교

| 기능 | v1.0 | v2.0 |
|------|------|------|
| 배너 관리 | ✅ | ✅ |
| 메뉴 관리 | ✅ | ✅ |
| 공지사항 | ✅ | ✅ |
| 설교 관리 | ✅ | ✅ |
| 게시판 | ✅ | ✅ |
| **사이트 설정** | ❌ | ✅ |
| **페이지 편집** | ❌ | ✅ |
| **색상 테마** | ❌ | ✅ |
| **연락처 관리** | ❌ | ✅ |

---

## 🎓 교육 자료

### 관리자 교육 체크리스트

- [ ] 관리자 페이지 접속 방법
- [ ] 사이트 탭 - 색상 변경
- [ ] 사이트 탭 - 연락처 변경
- [ ] 페이지 탭 - 내용 수정
- [ ] 저장 버튼 꼭 누르기!
- [ ] 변경 후 사이트 확인

---

## 📞 지원

문의사항이 있으시면:
- GitHub Issues
- 이메일: support@example.com

---

**축하합니다! 이제 개발 지식 없이도 사이트를 자유롭게 관리할 수 있습니다! 🎉**
