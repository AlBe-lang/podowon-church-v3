import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Heart, Baby, Music } from 'lucide-react';

export default function MinistriesPage() {
  const ministries = [
    {
      id: 1,
      name: '유년부',
      icon: Baby,
      description: '영유아부터 초등학교 저학년까지의 어린이들을 위한 예배와 교육',
      schedule: '주일 오전 11시',
      location: '교육관 1층',
    },
    {
      id: 2,
      name: '청소년부',
      icon: Users,
      description: '중고등학생들의 신앙 성장과 공동체 활동',
      schedule: '주일 오전 11시',
      location: '교육관 2층',
    },
    {
      id: 3,
      name: '청년부',
      icon: Music,
      description: '대학생 및 미혼 청년들의 신앙 공동체',
      schedule: '주일 오후 2시',
      location: '교육관 3층',
    },
    {
      id: 4,
      name: '장년부',
      icon: Heart,
      description: '장년 성도들의 예배와 교제',
      schedule: '주일 오전 9시, 11시',
      location: '본당',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">목양/사역</h1>

      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>부서별 예배</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                포도원교회는 연령별로 나누어진 부서별 예배를 통해 각 세대에 맞는 신앙 교육과
                예배를 드립니다.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {ministries.map((ministry) => {
            const Icon = ministry.icon;
            return (
              <Card key={ministry.id}>
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <CardTitle>{ministry.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{ministry.description}</p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">예배 시간:</span> {ministry.schedule}
                    </div>
                    <div>
                      <span className="font-semibold">장소:</span> {ministry.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>특별 사역</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">선교 사역</h3>
                  <p className="text-gray-600">
                    국내외 선교를 통해 복음을 전하고 이웃을 섬깁니다.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">구제 사역</h3>
                  <p className="text-gray-600">
                    지역 사회의 어려운 이웃들을 돕고 섬기는 사역을 펼칩니다.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">찬양 사역</h3>
                  <p className="text-gray-600">
                    예배 찬양팀과 성가대를 통해 하나님께 영광을 돌립니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
