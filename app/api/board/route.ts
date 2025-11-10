import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAuth } from '@/lib/auth';
import { postSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'NOTICE' | 'FREE' | 'PRAYER' | null;

    const currentUser = await getCurrentUser();

    const where = type ? { boardType: type } : {};

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const filteredPosts = posts.map((post) => {
      if (post.isSecret && post.boardType === 'PRAYER') {
        const canView =
          currentUser &&
          (currentUser.id === post.authorId || currentUser.role === 'ADMIN');

        if (!canView) {
          return {
            ...post,
            content: '비밀글입니다.',
          };
        }
      }
      return post;
    });

    return NextResponse.json(filteredPosts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validated = postSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        ...validated,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
