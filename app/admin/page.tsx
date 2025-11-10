'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageEditor from '@/components/admin/page-editor';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Menu as MenuIcon,
  Bell,
  Book,
  MessageSquare,
  Trash2,
  Edit2,
  Plus,
  Save,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalPosts: 0,
    newcomersToday: 0,
    educationApplies: 0,
  });

  const [banner, setBanner] = useState({
    title: '',
    subtitle: '',
    period: '',
    imageUrl: '',
  });

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [sermons, setSermons] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  const [editingMenu, setEditingMenu] = useState<number | null>(null);
  const [editingNotice, setEditingNotice] = useState<number | null>(null);

  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [newSermon, setNewSermon] = useState({
    title: '',
    preacher: '',
    date: new Date().toISOString().split('T')[0],
    youtube: '',
  });

  const [newMenu, setNewMenu] = useState({
    label: '',
    path: '',
    order: 0,
    visible: true,
  });

  const [siteSettings, setSiteSettings] = useState({
    siteName: '포도원교회',
    logoUrl: '',
    primaryColor: '#4F46E5',
    secondaryColor: '#6366F1',
    fontFamily: 'Inter',
    contactEmail: '',
    contactPhone: '',
    address: '',
  });

  const [aboutContent, setAboutContent] = useState({
    vision: '',
    history: '',
    pastoral: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }

      const userData = await response.json();
      if (userData.role !== 'ADMIN') {
        alert('관리자 권한이 필요합니다.');
        router.push('/');
        return;
      }

      setUser(userData);
      await loadAllData();
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      const [bannerRes, menusRes, noticesRes, sermonsRes, postsRes, settingsRes] = await Promise.all([
        fetch('/api/banners'),
        fetch('/api/menus'),
        fetch('/api/notices'),
        fetch('/api/sermons'),
        fetch('/api/board'),
        fetch('/api/settings'),
      ]);

      const bannerData = await bannerRes.json();
      if (bannerData) setBanner(bannerData);

      const menusData = await menusRes.json();
      setMenuItems(menusData);

      const noticesData = await noticesRes.json();
      setNotices(noticesData);

      const sermonsData = await sermonsRes.json();
      setSermons(sermonsData);

      const postsData = await postsRes.json();
      setPosts(postsData);

      const settingsData = await settingsRes.json();
      if (settingsData) setSiteSettings(settingsData);

      setStats({
        totalPosts: postsData.length,
        newcomersToday: 0,
        educationApplies: 0,
      });
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleBannerUpdate = async () => {
    try {
      const response = await fetch('/api/banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner),
      });

      if (response.ok) {
        alert('배너가 업데이트되었습니다.');
      } else {
        alert('업데이트 실패');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleMenuUpdate = async (menu: any) => {
    try {
      const response = await fetch('/api/menus', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menu),
      });

      if (response.ok) {
        setEditingMenu(null);
        await loadAllData();
      }
    } catch (error) {
      alert('업데이트 실패');
    }
  };

  const handleMenuDelete = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/menus?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadAllData();
      }
    } catch (error) {
      alert('삭제 실패');
    }
  };

  const handleMenuAdd = async () => {
    try {
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMenu),
      });

      if (response.ok) {
        setNewMenu({ label: '', path: '', order: 0, visible: true });
        await loadAllData();
      }
    } catch (error) {
      alert('추가 실패');
    }
  };

  const handleNoticeAdd = async () => {
    try {
      const response = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotice),
      });

      if (response.ok) {
        setNewNotice({
          title: '',
          content: '',
          date: new Date().toISOString().split('T')[0],
        });
        await loadAllData();
      }
    } catch (error) {
      alert('추가 실패');
    }
  };

  const handleNoticeDelete = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/notices?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadAllData();
      }
    } catch (error) {
      alert('삭제 실패');
    }
  };

  const handleSermonAdd = async () => {
    try {
      const response = await fetch('/api/sermons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSermon),
      });

      if (response.ok) {
        setNewSermon({
          title: '',
          preacher: '',
          date: new Date().toISOString().split('T')[0],
          youtube: '',
        });
        await loadAllData();
      }
    } catch (error) {
      alert('추가 실패');
    }
  };

  const handleSermonDelete = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/sermons?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadAllData();
      }
    } catch (error) {
      alert('삭제 실패');
    }
  };

  const handlePostDelete = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/board/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadAllData();
      }
    } catch (error) {
      alert('삭제 실패');
    }
  };

  const handleSiteSettingsUpdate = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      });

      if (response.ok) {
        alert('사이트 설정이 업데이트되었습니다. 페이지를 새로고침하세요.');
        window.location.reload();
      } else {
        alert('업데이트 실패');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleAboutContentSave = async () => {
    try {
      const response = await fetch('/api/page-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: 'about',
          title: '교회소개',
          sections: [
            { type: 'vision', content: aboutContent.vision },
            { type: 'history', content: aboutContent.history },
            { type: 'pastoral', content: aboutContent.pastoral },
          ],
        }),
      });

      if (response.ok) {
        alert('페이지 콘텐츠가 저장되었습니다.');
      } else {
        alert('저장 실패');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">관리자 페이지</h1>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-9 mb-8">
          <TabsTrigger value="dashboard">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            대시보드
          </TabsTrigger>
          <TabsTrigger value="site">
            🎨 사이트
          </TabsTrigger>
          <TabsTrigger value="editor">
            🖌️ 에디터
          </TabsTrigger>
          <TabsTrigger value="pages">
            📄 페이지
          </TabsTrigger>
          <TabsTrigger value="banner">
            <ImageIcon className="w-4 h-4 mr-2" />
            배너
          </TabsTrigger>
          <TabsTrigger value="menus">
            <MenuIcon className="w-4 h-4 mr-2" />
            메뉴
          </TabsTrigger>
          <TabsTrigger value="notices">
            <Bell className="w-4 h-4 mr-2" />
            공지
          </TabsTrigger>
          <TabsTrigger value="sermons">
            <Book className="w-4 h-4 mr-2" />
            설교
          </TabsTrigger>
          <TabsTrigger value="posts">
            <MessageSquare className="w-4 h-4 mr-2" />
            게시판
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>전체 게시글</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-indigo-600">{stats.totalPosts}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>오늘 새가족</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-indigo-600">{stats.newcomersToday}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>교육 신청</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-indigo-600">{stats.educationApplies}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>최근 공지사항</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notices.slice(0, 5).map((notice) => (
                  <div key={notice.id} className="border-b pb-2">
                    <p className="font-medium">{notice.title}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(notice.date), 'yyyy-MM-dd', { locale: ko })}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="site">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🎨 사이트 기본 정보</CardTitle>
                <p className="text-sm text-gray-500">
                  사이트 전체에 적용되는 기본 정보를 설정합니다
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>사이트 이름</Label>
                    <Input
                      value={siteSettings.siteName}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, siteName: e.target.value })
                      }
                      placeholder="포도원교회"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>로고 이미지 URL</Label>
                    <Input
                      value={siteSettings.logoUrl || ''}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, logoUrl: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎨 디자인 설정</CardTitle>
                <p className="text-sm text-gray-500">
                  사이트의 색상과 폰트를 변경합니다
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>메인 색상</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={siteSettings.primaryColor}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, primaryColor: e.target.value })
                        }
                        className="w-20 h-10"
                      />
                      <Input
                        value={siteSettings.primaryColor}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, primaryColor: e.target.value })
                        }
                        placeholder="#4F46E5"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>보조 색상</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={siteSettings.secondaryColor}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, secondaryColor: e.target.value })
                        }
                        className="w-20 h-10"
                      />
                      <Input
                        value={siteSettings.secondaryColor}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, secondaryColor: e.target.value })
                        }
                        placeholder="#6366F1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>폰트</Label>
                    <select
                      value={siteSettings.fontFamily}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, fontFamily: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-md border border-gray-300"
                    >
                      <option value="Inter">Inter (기본)</option>
                      <option value="Noto Sans KR">Noto Sans KR</option>
                      <option value="Nanum Gothic">나눔고딕</option>
                      <option value="Malgun Gothic">맑은 고딕</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">미리보기</p>
                  <div
                    style={{
                      backgroundColor: siteSettings.primaryColor,
                      color: 'white',
                      padding: '12px',
                      borderRadius: '8px',
                      fontFamily: siteSettings.fontFamily,
                    }}
                  >
                    {siteSettings.siteName}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📞 연락처 정보</CardTitle>
                <p className="text-sm text-gray-500">
                  사이트 하단(푸터)에 표시될 연락처 정보입니다
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>이메일</Label>
                    <Input
                      type="email"
                      value={siteSettings.contactEmail || ''}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, contactEmail: e.target.value })
                      }
                      placeholder="contact@podowon.org"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>전화번호</Label>
                    <Input
                      value={siteSettings.contactPhone || ''}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, contactPhone: e.target.value })
                      }
                      placeholder="02-1234-5678"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>주소</Label>
                  <Input
                    value={siteSettings.address || ''}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, address: e.target.value })
                    }
                    placeholder="서울시 강남구 테헤란로 123"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSiteSettingsUpdate} size="lg">
                <Save className="w-4 h-4 mr-2" />
                사이트 설정 저장
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="editor">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🖌️ 비주얼 페이지 에디터</CardTitle>
                <p className="text-sm text-gray-500">
                  페이지의 디자인을 수정하고 미리보기로 확인한 후 실제 사이트에 적용하세요
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={() => {
                        const editor = document.getElementById('home-editor');
                        if (editor) editor.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="p-6 border-2 rounded-lg hover:border-indigo-500 transition-colors text-left"
                    >
                      <h3 className="font-semibold text-lg mb-2">🏠 홈 페이지</h3>
                      <p className="text-sm text-gray-600">
                        메인 페이지의 레이아웃과 디자인 수정
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        const editor = document.getElementById('about-editor');
                        if (editor) editor.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="p-6 border-2 rounded-lg hover:border-indigo-500 transition-colors text-left"
                    >
                      <h3 className="font-semibold text-lg mb-2">ℹ️ 교회소개</h3>
                      <p className="text-sm text-gray-600">
                        교회소개 페이지 디자인 수정
                      </p>
                    </button>

                    <button className="p-6 border-2 border-dashed rounded-lg text-left opacity-50 cursor-not-allowed">
                      <h3 className="font-semibold text-lg mb-2">📖 예배/설교</h3>
                      <p className="text-sm text-gray-600">곧 추가 예정</p>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div id="home-editor">
              <PageEditor pageId="home" pageName="홈 페이지" />
            </div>

            <div id="about-editor">
              <PageEditor pageId="about" pageName="교회소개" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>📄 페이지 콘텐츠 관리</CardTitle>
              <p className="text-sm text-gray-500">
                각 페이지의 내용을 직접 수정할 수 있습니다
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">교회소개 페이지</h3>
                
                <div className="space-y-2">
                  <Label>비전 / 핵심가치</Label>
                  <Textarea
                    value={aboutContent.vision}
                    onChange={(e) => setAboutContent({ ...aboutContent, vision: e.target.value })}
                    rows={6}
                    placeholder="교회의 비전과 핵심 가치를 입력하세요..."
                  />
                  <p className="text-xs text-gray-500">
                    💡 줄바꿈은 자동으로 적용됩니다
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>연혁</Label>
                  <Textarea
                    value={aboutContent.history}
                    onChange={(e) => setAboutContent({ ...aboutContent, history: e.target.value })}
                    rows={6}
                    placeholder="교회의 주요 연혁을 입력하세요...
예시:
2010년 - 교회 개척
2015년 - 현 교회당 입당
2020년 - 온라인 예배 시작"
                  />
                </div>

                <div className="space-y-2">
                  <Label>목회진 소개</Label>
                  <Textarea
                    value={aboutContent.pastoral}
                    onChange={(e) => setAboutContent({ ...aboutContent, pastoral: e.target.value })}
                    rows={8}
                    placeholder="목회진을 소개하세요...
예시:
담임목사: 김은혜 목사
- 서울신학대학교 졸업
- 2015년부터 포도원교회 담임

부목사: 이평강 목사
- 침례신학대학교 졸업
- 청년부 담당"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleAboutContentSave}>
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">💡 사용 팁</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• 내용을 수정한 후 "저장" 버튼을 꼭 눌러주세요</li>
                    <li>• 줄바꿈(Enter)은 자동으로 적용됩니다</li>
                    <li>• 이미지는 "배너" 탭에서 URL로 추가할 수 있습니다</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banner">
          <Card>
            <CardHeader>
              <CardTitle>배너 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>제목</Label>
                <Input
                  value={banner.title}
                  onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>부제목</Label>
                <Input
                  value={banner.subtitle || ''}
                  onChange={(e) => setBanner({ ...banner, subtitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>기간</Label>
                <Input
                  value={banner.period || ''}
                  onChange={(e) => setBanner({ ...banner, period: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>이미지 URL</Label>
                <Input
                  value={banner.imageUrl || ''}
                  onChange={(e) => setBanner({ ...banner, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <Button onClick={handleBannerUpdate}>
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menus">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>새 메뉴 추가</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <Input
                  placeholder="레이블"
                  value={newMenu.label}
                  onChange={(e) => setNewMenu({ ...newMenu, label: e.target.value })}
                />
                <Input
                  placeholder="경로"
                  value={newMenu.path}
                  onChange={(e) => setNewMenu({ ...newMenu, path: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="순서"
                  value={newMenu.order}
                  onChange={(e) => setNewMenu({ ...newMenu, order: parseInt(e.target.value) })}
                />
                <Button onClick={handleMenuAdd}>
                  <Plus className="w-4 h-4 mr-2" />
                  추가
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>메뉴 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {menuItems.map((menu) => (
                  <div key={menu.id} className="border p-4 rounded-md">
                    {editingMenu === menu.id ? (
                      <div className="grid md:grid-cols-5 gap-2">
                        <Input
                          value={menu.label}
                          onChange={(e) => {
                            const updated = menuItems.map((m) =>
                              m.id === menu.id ? { ...m, label: e.target.value } : m
                            );
                            setMenuItems(updated);
                          }}
                        />
                        <Input
                          value={menu.path}
                          onChange={(e) => {
                            const updated = menuItems.map((m) =>
                              m.id === menu.id ? { ...m, path: e.target.value } : m
                            );
                            setMenuItems(updated);
                          }}
                        />
                        <Input
                          type="number"
                          value={menu.order}
                          onChange={(e) => {
                            const updated = menuItems.map((m) =>
                              m.id === menu.id ? { ...m, order: parseInt(e.target.value) } : m
                            );
                            setMenuItems(updated);
                          }}
                        />
                        <Button onClick={() => handleMenuUpdate(menu)}>저장</Button>
                        <Button variant="outline" onClick={() => setEditingMenu(null)}>
                          취소
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{menu.label}</span>
                          <span className="text-sm text-gray-500 ml-2">({menu.path})</span>
                          <span className="text-sm text-gray-500 ml-2">순서: {menu.order}</span>
                        </div>
                        <div className="space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingMenu(menu.id)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMenuDelete(menu.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notices">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>새 공지사항 추가</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>제목</Label>
                <Input
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>내용</Label>
                <Textarea
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label>날짜</Label>
                <Input
                  type="date"
                  value={newNotice.date}
                  onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                />
              </div>
              <Button onClick={handleNoticeAdd}>
                <Plus className="w-4 h-4 mr-2" />
                추가
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>공지사항 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notices.map((notice) => (
                  <div key={notice.id} className="border p-4 rounded-md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{notice.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notice.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {format(new Date(notice.date), 'yyyy-MM-dd', { locale: ko })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNoticeDelete(notice.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sermons">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>새 설교 추가</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>제목</Label>
                  <Input
                    value={newSermon.title}
                    onChange={(e) => setNewSermon({ ...newSermon, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>설교자</Label>
                  <Input
                    value={newSermon.preacher}
                    onChange={(e) => setNewSermon({ ...newSermon, preacher: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>날짜</Label>
                  <Input
                    type="date"
                    value={newSermon.date}
                    onChange={(e) => setNewSermon({ ...newSermon, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>YouTube URL</Label>
                  <Input
                    value={newSermon.youtube}
                    onChange={(e) => setNewSermon({ ...newSermon, youtube: e.target.value })}
                    placeholder="https://www.youtube.com/..."
                  />
                </div>
              </div>
              <Button onClick={handleSermonAdd}>
                <Plus className="w-4 h-4 mr-2" />
                추가
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>설교 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sermons.map((sermon) => (
                  <div key={sermon.id} className="border p-4 rounded-md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{sermon.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {sermon.preacher} ·{' '}
                          {format(new Date(sermon.date), 'yyyy-MM-dd', { locale: ko })}
                        </p>
                        {sermon.youtube && (
                          <a
                            href={sermon.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 hover:underline mt-1 block"
                          >
                            영상 보기 →
                          </a>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSermonDelete(sermon.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>전체 게시글 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {posts.map((post) => (
                  <div key={post.id} className="border p-4 rounded-md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                            {post.boardType === 'NOTICE'
                              ? '공지'
                              : post.boardType === 'FREE'
                              ? '자유'
                              : '기도'}
                          </span>
                          <h3 className="font-medium">{post.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{post.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {post.author.name} ·{' '}
                          {format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm', { locale: ko })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePostDelete(post.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
