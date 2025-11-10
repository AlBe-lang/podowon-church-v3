'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Trash2, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author: {
    id: number;
    name: string;
  };
  boardType: 'NOTICE' | 'FREE' | 'PRAYER';
  isSecret: boolean;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function BoardPage() {
  const [activeTab, setActiveTab] = useState<'NOTICE' | 'FREE' | 'PRAYER'>('NOTICE');
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isSecret: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/board?type=${activeTab}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          boardType: activeTab,
        }),
      });

      if (response.ok) {
        setFormData({ title: '', content: '', isSecret: false });
        setIsDialogOpen(false);
        fetchPosts();
      } else {
        alert('게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      alert('게시글 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/board/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPosts();
      } else {
        alert('삭제 권한이 없습니다.');
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const canDelete = (post: Post) => {
    if (!user) return false;
    return user.role === 'ADMIN' || user.id === post.authorId;
  };

  const tabLabels = {
    NOTICE: '공지사항',
    FREE: '자유게시판',
    PRAYER: '기도제목',
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">게시판</h1>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
          <TabsTrigger value="NOTICE">공지사항</TabsTrigger>
          <TabsTrigger value="FREE">자유게시판</TabsTrigger>
          <TabsTrigger value="PRAYER">기도제목</TabsTrigger>
        </TabsList>

        {(['NOTICE', 'FREE', 'PRAYER'] as const).map((type) => (
          <TabsContent key={type} value={type}>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{tabLabels[type]}</h2>
              {user && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>글쓰기</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>글쓰기 - {tabLabels[type]}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">제목</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">내용</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          rows={10}
                          required
                        />
                      </div>

                      {type === 'PRAYER' && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isSecret"
                            checked={formData.isSecret}
                            onChange={(e) => setFormData({ ...formData, isSecret: e.target.checked })}
                            className="rounded"
                          />
                          <Label htmlFor="isSecret" className="cursor-pointer">
                            비밀글로 작성
                          </Label>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          취소
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? '작성 중...' : '작성하기'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>{post.title}</span>
                            {post.isSecret && <Lock className="w-4 h-4 text-gray-500" />}
                          </CardTitle>
                          <div className="text-sm text-gray-500 mt-2">
                            {post.author.name} ·{' '}
                            {format(new Date(post.createdAt), 'yyyy년 M월 d일 HH:mm', {
                              locale: ko,
                            })}
                          </div>
                        </div>
                        {canDelete(post) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {post.content === '비밀글입니다.' ? (
                        <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500 flex items-center justify-center space-x-2">
                          <Lock className="w-5 h-5" />
                          <span>비밀글입니다</span>
                        </div>
                      ) : (
                        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-16 text-center text-gray-500">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>등록된 게시글이 없습니다.</p>
                    {user && <p className="text-sm mt-2">첫 번째 글을 작성해보세요!</p>}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
