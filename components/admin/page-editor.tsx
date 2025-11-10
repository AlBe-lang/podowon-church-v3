'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, Save, X, Check } from 'lucide-react';

interface PageEditorProps {
  pageId: string;
  pageName: string;
}

export default function PageEditor({ pageId, pageName }: PageEditorProps) {
  const [draftStyle, setDraftStyle] = useState<any>({
    fontSize: '16px',
    fontFamily: 'Inter',
    primaryColor: '#4F46E5',
    cardSize: 'medium',
    spacing: 'normal',
  });

  const [publishedStyle, setPublishedStyle] = useState<any>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadStyles();
  }, [pageId]);

  const loadStyles = async () => {
    try {
      const [draftRes, publishedRes] = await Promise.all([
        fetch(`/api/page-style?pageId=${pageId}&mode=draft`),
        fetch(`/api/page-style?pageId=${pageId}&mode=published`),
      ]);

      const draftData = await draftRes.json();
      const publishedData = await publishedRes.json();

      if (draftData.data && Object.keys(draftData.data).length > 0) {
        setDraftStyle(draftData.data);
      }
      if (publishedData.data && Object.keys(publishedData.data).length > 0) {
        setPublishedStyle(publishedData.data);
      }
    } catch (error) {
      console.error('Failed to load styles:', error);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const response = await fetch('/api/page-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId,
          data: draftStyle,
          mode: 'draft',
        }),
      });

      if (response.ok) {
        alert('임시 저장되었습니다.');
        setHasChanges(true);
      }
    } catch (error) {
      alert('저장 실패');
    }
  };

  const handlePublish = async () => {
    if (!confirm('현재 설정을 실제 사이트에 적용하시겠습니까?')) return;

    try {
      const response = await fetch('/api/page-style', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId,
          action: 'publish',
        }),
      });

      if (response.ok) {
        alert('실제 사이트에 적용되었습니다!');
        setHasChanges(false);
        loadStyles();
      }
    } catch (error) {
      alert('적용 실패');
    }
  };

  const handleDiscard = async () => {
    if (!confirm('변경사항을 취소하고 원래대로 되돌리시겠습니까?')) return;

    try {
      const response = await fetch('/api/page-style', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId,
          action: 'discard',
        }),
      });

      if (response.ok) {
        alert('변경사항이 취소되었습니다.');
        loadStyles();
        setHasChanges(false);
      }
    } catch (error) {
      alert('취소 실패');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>🎨 {pageName} 페이지 편집</CardTitle>
            <div className="flex items-center space-x-2">
              {hasChanges && (
                <span className="text-sm text-orange-600 font-medium">
                  • 저장되지 않은 변경사항
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? '편집 모드' : '미리보기'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!previewMode ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">텍스트 설정</h3>

                  <div className="space-y-2">
                    <Label>기본 글씨 크기</Label>
                    <select
                      value={draftStyle.fontSize}
                      onChange={(e) =>
                        setDraftStyle({ ...draftStyle, fontSize: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-md border"
                    >
                      <option value="14px">작게 (14px)</option>
                      <option value="16px">보통 (16px)</option>
                      <option value="18px">크게 (18px)</option>
                      <option value="20px">매우 크게 (20px)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>폰트</Label>
                    <select
                      value={draftStyle.fontFamily}
                      onChange={(e) =>
                        setDraftStyle({ ...draftStyle, fontFamily: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-md border"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Noto Sans KR">Noto Sans KR</option>
                      <option value="Nanum Gothic">나눔고딕</option>
                      <option value="Malgun Gothic">맑은 고딕</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>강조 색상</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={draftStyle.primaryColor}
                        onChange={(e) =>
                          setDraftStyle({ ...draftStyle, primaryColor: e.target.value })
                        }
                        className="w-20 h-10"
                      />
                      <Input
                        value={draftStyle.primaryColor}
                        onChange={(e) =>
                          setDraftStyle({ ...draftStyle, primaryColor: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">레이아웃 설정</h3>

                  <div className="space-y-2">
                    <Label>카드 크기</Label>
                    <select
                      value={draftStyle.cardSize}
                      onChange={(e) =>
                        setDraftStyle({ ...draftStyle, cardSize: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-md border"
                    >
                      <option value="small">작게</option>
                      <option value="medium">보통</option>
                      <option value="large">크게</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>여백 (Spacing)</Label>
                    <select
                      value={draftStyle.spacing}
                      onChange={(e) =>
                        setDraftStyle({ ...draftStyle, spacing: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-md border"
                    >
                      <option value="compact">좁게</option>
                      <option value="normal">보통</option>
                      <option value="relaxed">넓게</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">미리보기</h3>
                <div
                  className="border rounded-lg p-6"
                  style={{
                    fontSize: draftStyle.fontSize,
                    fontFamily: draftStyle.fontFamily,
                  }}
                >
                  <h2 style={{ color: draftStyle.primaryColor }} className="text-2xl font-bold mb-4">
                    샘플 제목
                  </h2>
                  <p className="mb-4">
                    이것은 미리보기 텍스트입니다. 위에서 설정한 글씨 크기와 폰트가 적용됩니다.
                  </p>
                  <div
                    className={`bg-white rounded-lg shadow-sm p-4 ${
                      draftStyle.cardSize === 'small'
                        ? 'max-w-xs'
                        : draftStyle.cardSize === 'large'
                        ? 'max-w-2xl'
                        : 'max-w-md'
                    }`}
                  >
                    <h3 className="font-semibold mb-2">샘플 카드</h3>
                    <p className="text-sm text-gray-600">카드 크기가 적용된 모습입니다.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleDiscard} disabled={!hasChanges}>
                  <X className="w-4 h-4 mr-2" />
                  변경사항 취소
                </Button>
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="w-4 h-4 mr-2" />
                  임시 저장
                </Button>
                <Button onClick={handlePublish} disabled={!hasChanges}>
                  <Check className="w-4 h-4 mr-2" />
                  실제 사이트에 적용
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🔍 미리보기 모드</h3>
                <p className="text-sm text-gray-700">
                  현재 설정이 실제 사이트에 적용되면 어떻게 보일지 확인하세요.
                  <br />
                  마음에 들지 않으면 편집 모드로 돌아가서 수정하세요.
                </p>
              </div>

              <div
                className="border-2 border-dashed border-blue-300 rounded-lg p-8"
                style={{
                  fontSize: draftStyle.fontSize,
                  fontFamily: draftStyle.fontFamily,
                }}
              >
                <h1
                  style={{ color: draftStyle.primaryColor }}
                  className="text-4xl font-bold mb-6"
                >
                  {pageName}
                </h1>

                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`bg-white rounded-lg shadow-sm p-6 ${
                        draftStyle.spacing === 'compact'
                          ? 'p-4'
                          : draftStyle.spacing === 'relaxed'
                          ? 'p-8'
                          : 'p-6'
                      }`}
                    >
                      <h3 className="font-semibold mb-2">샘플 카드 {i}</h3>
                      <p className="text-gray-600">설정이 적용된 모습입니다.</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <p>
                    일반 텍스트 샘플입니다. 글씨 크기: {draftStyle.fontSize}, 폰트:{' '}
                    {draftStyle.fontFamily}
                  </p>
                </div>
              </div>

              <div className="flex justify-center space-x-2">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  편집 모드로 돌아가기
                </Button>
                <Button onClick={handlePublish}>
                  <Check className="w-4 h-4 mr-2" />
                  이대로 적용하기
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>💡 사용 팁</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✅ <strong>임시 저장</strong>: 변경사항을 저장하지만 실제 사이트에는 적용되지 않습니다</li>
            <li>✅ <strong>미리보기</strong>: 실제 사이트에 적용될 모습을 확인합니다</li>
            <li>✅ <strong>적용하기</strong>: 변경사항을 실제 사이트에 반영합니다</li>
            <li>✅ <strong>취소</strong>: 변경사항을 버리고 원래대로 되돌립니다</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
