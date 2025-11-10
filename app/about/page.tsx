import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Church, Heart, Users, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">교회소개</h1>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Church className="w-6 h-6 text-indigo-600" />
              <span>포도원교회를 소개합니다</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              포도원교회는 하나님의 말씀을 따라 살아가며, 이웃을 섬기고 사랑을 실천하는
              공동체입니다. 우리는 예수 그리스도의 복음을 전하고, 성도들이 신앙 안에서 성장하며,
              세상의 빛과 소금이 되도록 돕습니다.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-indigo-600" />
                <span>우리의 비전</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• 하나님 중심의 예배 공동체</li>
                <li>• 말씀으로 세워지는 신앙</li>
                <li>• 이웃을 섬기는 사랑의 실천</li>
                <li>• 다음 세대를 키우는 교육</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>핵심 가치</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• 예배: 하나님께 영광</li>
                <li>• 말씀: 성경적 신앙</li>
                <li>• 기도: 하나님과의 교제</li>
                <li>• 섬김: 이웃 사랑 실천</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-indigo-600" />
              <span>목회진 소개</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg">담임목사: 김은혜 목사</h3>
                <p className="text-gray-600 mt-2">
                  서울신학대학교 졸업, 장로회신학대학원 석사
                  <br />
                  2015년부터 포도원교회 담임 목회
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg">부목사: 이평강 목사</h3>
                <p className="text-gray-600 mt-2">
                  침례신학대학교 졸업, 횃불트리니티신학대학원 석사
                  <br />
                  청년부 및 교육 담당
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">전도사: 박소망 전도사</h3>
                <p className="text-gray-600 mt-2">
                  총신대학교 신학과 재학
                  <br />
                  유아부 및 어린이부 담당
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>연혁</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex">
                <span className="font-semibold w-24">2010년</span>
                <span>포도원교회 개척</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-24">2015년</span>
                <span>현 교회당 입당 및 헌당 예배</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-24">2018년</span>
                <span>교육관 증축</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-24">2020년</span>
                <span>온라인 예배 시스템 구축</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-24">2023년</span>
                <span>창립 13주년 감사 예배</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
