import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen } from 'lucide-react';
import { prisma } from '@/lib/prisma';

async function getPrograms() {
  const programs = await prisma.educationProgram.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return programs;
}

export default async function EducationPage() {
  const programs = await getPrograms();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">교육/훈련</h1>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>교육 프로그램 안내</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              포도원교회는 성도들의 신앙 성장을 위한 다양한 교육 프로그램을 운영하고 있습니다.
              체계적인 교육을 통해 성숙한 그리스도인으로 성장하실 수 있도록 돕고 있습니다.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {programs.length > 0 ? (
            programs.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-indigo-600" />
                      </div>
                      <CardTitle>{program.name}</CardTitle>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        program.status === '모집중'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {program.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 whitespace-pre-wrap">{program.description}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-gray-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>등록된 교육 프로그램이 없습니다.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>신청 방법</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-gray-600">
              <p>• 교회 사무실에 직접 방문하여 신청</p>
              <p>• 전화 신청: 02-1234-5678</p>
              <p>• 이메일 신청: education@podowon.org</p>
              <p className="text-sm text-gray-500 mt-4">
                * 자세한 사항은 교육부로 문의해 주시기 바랍니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
