import React, { useRef } from 'react';
import { Language, t, detectUserLanguage } from '../lib/i18n';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  lang?: Language;
  onFiveClicks?: () => void;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'light',
  size = 'md',
  showSubtitle = true,
  lang,
  onFiveClicks,
  onClick
}) => {
  const activeLang = lang || detectUserLanguage();
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<any>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }

    if (onFiveClicks) {
      clickCountRef.current += 1;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

      if (clickCountRef.current >= 5) {
        clickCountRef.current = 0;
        onFiveClicks();
      } else {
        clickTimerRef.current = setTimeout(() => {
          clickCountRef.current = 0;
        }, 2500);
      }
    }
  };

  const imageSizes = {
    sm: 'h-10 sm:h-12',
    md: 'h-12 sm:h-14 md:h-16',
    lg: 'h-16 sm:h-20'
  };

  const isDark = variant === 'dark';

  return (
    <div 
      onClick={handleLogoClick}
      className={`inline-flex items-center select-none cursor-pointer group ${className}`}
      role={onFiveClicks || onClick ? 'button' : undefined}
      tabIndex={onFiveClicks || onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          onClick();
        }
      }}
    >
      {/* Exact Official Uploaded AviaLink EXPORT Logo Image */}
      <div className={`relative shrink-0 rounded-2xl overflow-hidden p-1.5 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${
        isDark ? 'bg-white border border-slate-700' : 'bg-white border border-slate-200'
      }`}>
        <img
          src="/logo.jpg"
          alt="AviaLink Export Official Logo"
          className={`${imageSizes[size]} w-auto object-contain rounded-xl`}
        />
      </div>
    </div>
  );
};



