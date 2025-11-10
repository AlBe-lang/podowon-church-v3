import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    // TODO: 실제 파일 업로드 로직을 구현하세요
    // 이곳에 AWS S3, Cloudinary, 또는 다른 스토리지 서비스 연결
    // 예시:
    // const formData = await request.formData();
    // const file = formData.get('file') as File;
    // const buffer = Buffer.from(await file.arrayBuffer());
    // const uploadResult = await uploadToS3(buffer, file.name);
    // return NextResponse.json({ url: uploadResult.url });

    return NextResponse.json(
      { error: '파일 업로드 기능은 스토리지 서비스 연결 후 사용 가능합니다.' },
      { status: 501 }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
