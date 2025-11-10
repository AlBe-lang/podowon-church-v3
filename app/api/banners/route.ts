import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { bannerSchema } from '@/lib/validation';

export async function GET() {
  try {
    const banner = await prisma.banner.findFirst({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch banner' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validated = bannerSchema.parse(body);

    const banner = await prisma.banner.findFirst({
      orderBy: { id: 'desc' },
    });

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    const updated = await prisma.banner.update({
      where: { id: banner.id },
      data: validated,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}
