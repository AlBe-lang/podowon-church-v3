'use client';

import { MapPin, Phone, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SiteFooter() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => setSettings(null));
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              {settings?.siteName || '포도원교회'}
            </h3>
            <p className="text-sm mb-4">
              하나님의 사랑을 실천하고 이웃과 함께하는 교회
            </p>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">오시는 길</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>{settings?.address || '서울시 강남구 테헤란로 123'}</span>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>{settings?.contactPhone || '02-1234-5678'}</span>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>{settings?.contactEmail || 'contact@podowon.org'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">예배 시간</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold text-white">주일 1부 예배</span>
                <br />
                오전 9시
              </div>
              <div>
                <span className="font-semibold text-white">주일 2부 예배</span>
                <br />
                오전 11시
              </div>
              <div>
                <span className="font-semibold text-white">수요 예배</span>
                <br />
                오후 7시 30분
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 {settings?.siteName || '포도원교회'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
