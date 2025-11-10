import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    if (!pageId) {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 });
    }

    let content = await prisma.pageContent.findUnique({
      where: { pageId },
    });

    if (!content) {
      content = await prisma.pageContent.create({
        data: {
          pageId,
          sections: '[]',
        },
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { pageId, title, sections } = body;

    let content = await prisma.pageContent.findUnique({
      where: { pageId },
    });

    if (content) {
      content = await prisma.pageContent.update({
        where: { pageId },
        data: { title, sections: JSON.stringify(sections) },
      });
    } else {
      content = await prisma.pageContent.create({
        data: {
          pageId,
          title,
          sections: JSON.stringify(sections),
        },
      });
    }

    return NextResponse.json(content);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
