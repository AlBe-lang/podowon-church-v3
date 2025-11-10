'use client';

import { Calendar } from 'lucide-react';

interface BannerProps {
  title: string;
  subtitle?: string;
  period?: string;
  imageUrl?: string;
}

export default function HeroBanner({ title, subtitle, period, imageUrl }: BannerProps) {
  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-3xl">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: imageUrl
            ? `url(${imageUrl})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      </div>

      <div className="relative h-full flex flex-col justify-center items-start px-8 md:px-16 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl mb-6 drop-shadow-lg">{subtitle}</p>
        )}
        {period && (
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
            <Calendar className="w-5 h-5" />
            <span className="text-sm md:text-base">{period}</span>
          </div>
        )}
      </div>
    </div>
  );
}
