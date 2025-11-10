import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    const mode = searchParams.get('mode') || 'published'; // published or draft

    if (!pageId) {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 });
    }

    let style = await prisma.pageStyle.findUnique({
      where: { pageId },
    });

    if (!style) {
      style = await prisma.pageStyle.create({
        data: {
          pageId,
          published: JSON.stringify({}),
          draft: JSON.stringify({}),
        },
      });
    }

    const data = mode === 'draft' ? style.draft : style.published;

    return NextResponse.json({
      pageId: style.pageId,
      data: JSON.parse(data),
      mode,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch style' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { pageId, data, mode = 'draft' } = body;

    if (!pageId || !data) {
      return NextResponse.json({ error: 'pageId and data are required' }, { status: 400 });
    }

    let style = await prisma.pageStyle.findUnique({
      where: { pageId },
    });

    const dataString = JSON.stringify(data);

    if (style) {
      style = await prisma.pageStyle.update({
        where: { pageId },
        data: mode === 'draft' ? { draft: dataString } : { published: dataString },
      });
    } else {
      style = await prisma.pageStyle.create({
        data: {
          pageId,
          published: mode === 'published' ? dataString : JSON.stringify({}),
          draft: mode === 'draft' ? dataString : JSON.stringify({}),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to save style' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { pageId, action } = body;

    if (!pageId) {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 });
    }

    const style = await prisma.pageStyle.findUnique({
      where: { pageId },
    });

    if (!style) {
      return NextResponse.json({ error: 'Style not found' }, { status: 404 });
    }

    if (action === 'publish') {
      // Draft를 Published로 복사
      await prisma.pageStyle.update({
        where: { pageId },
        data: { published: style.draft },
      });
      return NextResponse.json({ success: true, message: 'Published successfully' });
    } else if (action === 'discard') {
      // Draft를 Published로 되돌리기
      await prisma.pageStyle.update({
        where: { pageId },
        data: { draft: style.published },
      });
      return NextResponse.json({ success: true, message: 'Changes discarded' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to process action' }, { status: 500 });
  }
}
