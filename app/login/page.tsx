'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'ADMIN' | 'USER'>('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '로그인에 실패했습니다.');
      }

      const data = await response.json();

      // role에 따라 이동
      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 탭 바꿀 때 편하게 미리 채워주기 (선택사항)
  const handleRoleChange = (nextRole: 'ADMIN' | 'USER') => {
    setRole(nextRole);
    if (nextRole === 'ADMIN') {
      setEmail('admin@podowon.org');
    } else {
      setEmail('user@podowon.org');
    }
    setPassword('1234');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">포도원교회 로그인</CardTitle>
            <CardDescription>관리자 / 교인 계정을 선택해서 로그인하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={(v) => handleRoleChange(v as 'ADMIN' | 'USER')}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="USER">사용자</TabsTrigger>
                <TabsTrigger value="ADMIN">관리자</TabsTrigger>
              </TabsList>

              <TabsContent value="USER" className="space-y-4">
                {/* 폼은 아래 공통으로 */}
              </TabsContent>
              <TabsContent value="ADMIN" className="space-y-4">
                {/* 폼은 아래 공통으로 */}
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'ADMIN' ? 'admin@podowon.org' : 'user@podowon.org'}
                    required
                />
              </div>
              <div>
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '로그인 중...' : '로그인'}
              </Button>

              <div className="text-xs text-gray-400 text-center mt-2">
                관리자: admin@podowon.org / 1234, 사용자: user@podowon.org / 1234
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
