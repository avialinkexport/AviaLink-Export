import React, { useEffect, useState } from 'react';
import { Language } from '../lib/i18n';

interface SplashScreenProps {
  onComplete: () => void;
  lang?: Language;
}

const splashSubtitles: Record<Language, string> = {
  ar: 'للتصدير • EXPORT',
  en: 'EXPORT • AGRICULTURAL PRODUCE',
  fr: 'EXPORTATION • PRODUITS AGRICOLES',
  es: 'EXPORTACIÓN • PRODUCTOS AGRÍCOLAS',
  de: 'EXPORT • AGRARPRODUCTS',
  ru: 'ЭКСПОРТ • СЕЛЬХОЗПРОДУКЦИЯ'
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, lang = 'ar' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      onComplete();
      return;
    }

    // Exactly 2 seconds (2000 ms) display time + 300 ms fade out
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const finishTimer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 300);
      return () => clearTimeout(finishTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0F2133] via-[#0B1826] to-[#08101A] text-white transition-opacity duration-300 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading AviaLink"
      role="status"
    >
      <div className="flex flex-col items-center animate-fade-in space-y-6 max-w-sm px-6 text-center">
        {/* Official Logo Display Container */}
        <div className="relative group">
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#C5A059] via-emerald-500 to-[#C5A059] opacity-75 blur-lg animate-pulse"></div>
          <div className="relative bg-white rounded-2xl p-4 shadow-2xl border border-white/20 flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="AviaLink Logo"
              width="224"
              height="80"
              className="w-48 sm:w-56 h-auto object-contain transition-transform duration-500 transform hover:scale-105"
            />
          </div>
        </div>

        {/* Tagline & Subtitle */}
        <div className="space-y-1 pt-2">
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-wide text-white">
            {lang === 'ar' ? (
              <>أفيا<span className="text-[#C5A059]">لينك</span></>
            ) : (
              <>Avia<span className="text-[#C5A059]">link</span></>
            )}
          </h1>
          <p className="text-xs font-black tracking-[0.25em] text-[#C5A059] uppercase">
            {splashSubtitles[lang] || splashSubtitles['ar']}
          </p>
        </div>

        {/* 2.0s High-Precision Progress Bar */}
        <div className="w-48 h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/10 mt-2">
          <div className="h-full bg-gradient-to-r from-[#C5A059] via-emerald-400 to-[#C5A059] animate-splash-progress"></div>
        </div>
      </div>

      <style>{`
        @keyframes splashProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-splash-progress {
          animation: splashProgress 2.0s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

