import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body); // { email, password } 형태라고 가정

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 },
      );
    }

    // 1) DB에 저장된 비밀번호가 bcrypt 해시인지 먼저 판별
    const looksHashed =
      user.password.startsWith('$2a$') ||
      user.password.startsWith('$2b$') ||
      user.password.startsWith('$2y$');

    let isValidPassword = false;

    if (looksHashed) {
      // 해시로 저장된 경우
      isValidPassword = await bcrypt.compare(validated.password, user.password);
    } else {
      // 평문으로 저장된 경우 (개발 중 자주 나오는 패턴)
      isValidPassword = validated.password === user.password;
      // 선택: 여기서 해시로 바꿔서 저장해두면 다음부터는 안전하게 로그인됨
      if (isValidPassword) {
        const newHash = await bcrypt.hash(validated.password, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: newHash },
        });
      }
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 },
      );
    }

    // 토큰 생성
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
