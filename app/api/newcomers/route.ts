import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    const newcomers = await prisma.newcomer.findMany({
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(newcomers);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch newcomers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newcomer = await prisma.newcomer.create({
      data: body,
    });

    return NextResponse.json(newcomer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create newcomer' }, { status: 500 });
  }
}
