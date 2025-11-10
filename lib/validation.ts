import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export const postSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
  boardType: z.enum(['NOTICE', 'FREE', 'PRAYER']),
  isSecret: z.boolean().optional(),
});

export const bannerSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  subtitle: z.string().optional(),
  period: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const noticeSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
  date: z.string().optional(),
});

export const sermonSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  preacher: z.string().min(1, '설교자를 입력해주세요'),
  date: z.string(),
  youtube: z.string().optional(),
});

export const menuItemSchema = z.object({
  label: z.string().min(1, '레이블을 입력해주세요'),
  path: z.string().min(1, '경로를 입력해주세요'),
  order: z.number().int(),
  visible: z.boolean(),
});
