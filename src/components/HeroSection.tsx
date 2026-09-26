import React, { useState, useEffect } from 'react';
import { ArrowRight, Globe, Truck, Clock, Award } from 'lucide-react';
import { Language, t, LANGUAGES } from '../lib/i18n';

interface HeroSectionProps {
  onNavigate: (route: string) => void;
  onOpenRFQ: (productName?: string) => void;
  analyticsSummary?: any;
  lang: Language;
}

const HERO_BACKGROUND_IMAGES = [
  { url: '/crops/sweet_potatoes.jpg', nameAr: 'بطاطا حلوة معالجة حرارياً', nameEn: 'Cured Sweet Potatoes' },
  { url: '/crops/onions.jpg', nameAr: 'بصل أحمر وذهبي', nameEn: 'Red & Golden Onions' },
  { url: '/crops/garlic.jpg', nameAr: 'ثوم مصري فاخر', nameEn: 'Egyptian Garlic' },
  { url: '/crops/carrots.jpg', nameAr: 'جزر تصديري', nameEn: 'Export Carrots' },
  { url: '/crops/red_beet.jpg', nameAr: 'بنجر مائدة', nameEn: 'Table Beetroot' }
];

const HERO_PILLARS: Record<Language, {
  feat1Sub: string;
  feat2Sub: string;
  feat3Sub: string;
  feat4Sub: string;
}> = {
  ar: {
    feat1Sub: 'لوجستيات وسلسلة تبريد 24/7',
    feat2Sub: 'اعتماد الحجر الزراعي المصري',
    feat3Sub: 'فرز إلكتروني وبالوزن',
    feat4Sub: 'خطوط شحن بحري سريعة'
  },
  en: {
    feat1Sub: '24/7 Reefer Logistics',
    feat2Sub: 'Official CAPQ Certified',
    feat3Sub: 'Optical & Weight Sizing',
    feat4Sub: 'Fast Direct Corridors'
  },
  fr: {
    feat1Sub: 'Logistique réfrigérée 24/7',
    feat2Sub: 'Certifié officiel CAPQ',
    feat3Sub: 'Calibrage optique & poids',
    feat4Sub: 'Lignes maritimes directes'
  },
  es: {
    feat1Sub: 'Logística refrigerada 24/7',
    feat2Sub: 'Certificado oficial CAPQ',
    feat3Sub: 'Calibrado óptico y por peso',
    feat4Sub: 'Líneas marítimas directas'
  },
  de: {
    feat1Sub: '24/7 Kühlketten-Logistik',
    feat2Sub: 'Amtlich CAPQ zertifiziert',
    feat3Sub: 'Optische & Gewichtssortierung',
    feat4Sub: 'Schnelle Direktkorridore'
  },
  ru: {
    feat1Sub: '24/7 рефрижерация',
    feat2Sub: 'Сертифицировано CAPQ',
    feat3Sub: 'Оптическая сортировка и вес',
    feat4Sub: 'Прямые морские линии'
  }
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenRFQ,
  analyticsSummary,
  lang = 'ar'
}) => {
  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const isRtl = currentLangObj.dir === 'rtl';
  const pillarsTxt = HERO_PILLARS[lang] || HERO_PILLARS.ar;

  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % HERO_BACKGROUND_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="pt-20 pb-8 bg-slate-100 text-slate-900" dir={currentLangObj.dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Main Hero Panoramic Banner */}
        <div className="relative overflow-hidden rounded-3xl min-h-[440px] sm:min-h-[500px] flex flex-col justify-center items-center text-center p-6 sm:p-12 shadow-2xl border border-slate-200 group">
          {/* Background Composite Layers */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/50 to-slate-950/65 z-10"></div>
          
          {/* Main Background Imagery - Automatic Rotating Egyptian Crops Carousel */}
          {HERO_BACKGROUND_IMAGES.map((img, idx) => (
            <div 
              key={img.url}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform ${
                idx === currentBgIndex ? 'opacity-100 scale-100 z-0' : 'opacity-0 scale-105 pointer-events-none -z-10'
              }`}
              style={{
                backgroundImage: `url('${img.url}')`
              }}
            ></div>
          ))}

          {/* Decorative Gold Globe & Produce Accents */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C5A059]/20 via-transparent to-transparent z-10 pointer-events-none"></div>

          {/* Content Overlay */}
          <div className="relative z-20 max-w-4xl space-y-6 animate-fade-in my-auto">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-[#0F2133]/80 border border-[#C5A059]/50 text-[#C5A059] text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg">
              <Globe className="w-4 h-4 text-[#C5A059] animate-spin-slow" />
              <span>{t('hero_badge', lang)}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-white leading-tight drop-shadow-md">
              {t('hero_title', lang)}
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow">
              {t('hero_subtitle', lang)}
            </p>

            {/* Call to Action Gold Button */}
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => onOpenRFQ()}
                className="bg-[#C5A059] hover:bg-[#b08d4a] text-white font-black text-sm sm:text-base px-8 sm:px-10 py-4 rounded-full shadow-xl shadow-[#C5A059]/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 border border-white/20 cursor-pointer"
              >
                <span>{t('hero_btn_rfq', lang)}</span>
                <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>

          </div>

          {/* Carousel Slide Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 z-20 pointer-events-auto">
            {HERO_BACKGROUND_IMAGES.map((img, idx) => (
              <button
                key={img.url}
                onClick={() => setCurrentBgIndex(idx)}
                title={isRtl ? img.nameAr : img.nameEn}
                aria-label={isRtl ? img.nameAr : img.nameEn}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentBgIndex 
                    ? 'w-7 h-2 bg-[#C5A059] shadow-md shadow-[#C5A059]/50' 
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900/90 to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* 4 Pillars Highlight Row */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-100">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-14 h-14 rounded-full bg-[#0F2133]/5 border border-[#C5A059]/40 flex items-center justify-center shrink-0 text-[#C5A059] shadow-sm">
                <Clock className="w-7 h-7 text-[#0F2133]" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F2133]">
                  {t('hero_feat_coldchain', lang)}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {pillarsTxt.feat1Sub}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-14 h-14 rounded-full bg-[#0F2133]/5 border border-[#C5A059]/40 flex items-center justify-center shrink-0 text-[#C5A059] shadow-sm">
                <Award className="w-7 h-7 text-[#C5A059]" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F2133]">
                  {t('hero_feat_phytosanitary', lang)}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {pillarsTxt.feat2Sub}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-14 h-14 rounded-full bg-[#0F2133]/5 border border-[#C5A059]/40 flex items-center justify-center shrink-0 text-[#C5A059] shadow-sm">
                <Truck className="w-7 h-7 text-[#0F2133]" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F2133]">
                  {t('hero_feat_sorting', lang)}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {pillarsTxt.feat3Sub}
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-14 h-14 rounded-full bg-[#0F2133]/5 border border-[#C5A059]/40 flex items-center justify-center shrink-0 text-[#C5A059] shadow-sm">
                <Globe className="w-7 h-7 text-[#C5A059]" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F2133]">
                  {t('hero_feat_express', lang)}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {pillarsTxt.feat4Sub}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};


