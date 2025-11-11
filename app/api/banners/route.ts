// app/api/banner/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
// bannerSchema가 이미 zod로 만들어져 있으면 아래 커스텀 스키마는 안 써도 됨
import { z } from 'zod';

const requestSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().nullable().optional(),
  period: z.string().nullable().optional(),
  // 공통 이미지
  imageUrl: z.string().url().nullable().optional(),
  // PC / 모바일 따로
  desktopImageUrl: z.string().url().nullable().optional(),
  mobileImageUrl: z.string().url().nullable().optional(),
});

export async function GET() {
  try {
    const banner = await prisma.banner.findFirst({
      orderBy: { id: 'desc' },
    });

    // 배너가 하나도 없으면 프론트에서 문구 보여줄 수 있게 해둠
    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch banner' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // 관리자만
    await requireAdmin();

    const body = await request.json();

    // zod로 필드만 뽑아서 안전하게
    const validated = requestSchema.parse(body);

    // 가장 최근 배너 1개 찾기
    const latest = await prisma.banner.findFirst({
      orderBy: { id: 'desc' },
    });

    // 1) 없으면 새로 만든다
    if (!latest) {
      const created = await prisma.banner.create({
        data: {
          title: validated.title ?? '포도원교회 배너',
          subtitle: validated.subtitle ?? null,
          period: validated.period ?? null,
          imageUrl: validated.imageUrl ?? null,
          desktopImageUrl: validated.desktopImageUrl ?? null,
          mobileImageUrl: validated.mobileImageUrl ?? null,
        },
      });
      return NextResponse.json(created, { status: 201 });
    }

    // 2) 있으면 업데이트
    const updated = await prisma.banner.update({
      where: { id: latest.id },
      data: {
        // 안 보낸 건 기존 값 유지
        title: validated.title ?? latest.title,
        subtitle:
          validated.subtitle !== undefined
            ? validated.subtitle
            : latest.subtitle,
        period:
          validated.period !== undefined ? validated.period : latest.period,
        imageUrl:
          validated.imageUrl !== undefined
            ? validated.imageUrl
            : latest.imageUrl,
        desktopImageUrl:
            validated.desktopImageUrl !== undefined
              ? validated.desktopImageUrl
              : latest.desktopImageUrl,
        mobileImageUrl:
            validated.mobileImageUrl !== undefined
              ? validated.mobileImageUrl
              : latest.mobileImageUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    // zod 에러
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    if (
      error?.message === 'Unauthorized' ||
      error?.message?.includes('Forbidden')
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}
