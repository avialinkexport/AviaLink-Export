import React from 'react';
import { ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import { Language, t } from '../lib/i18n';

interface AboutSectionProps {
  onOpenRFQ: () => void;
  lang: Language;
}

const ABOUT_CTA: Record<Language, string> = {
  ar: 'طلب عرض سعر وبدء التعاقد (RFQ)',
  en: 'Request Export Quotation (RFQ)',
  fr: 'Demander un devis d’exportation (RFQ)',
  es: 'Solicitar cotización de exportación (RFQ)',
  de: 'Exportangebot anfordern (RFQ)',
  ru: 'Запросить расчет стоимости (RFQ)'
};

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenRFQ, lang = 'ar' }) => {
  const isRtl = lang === 'ar';
  const ctaText = ABOUT_CTA[lang] || ABOUT_CTA.ar;

  return (
    <section className="py-16 bg-white text-slate-900" id="about" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase">
            {t('about_badge', lang)}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-[#0F2133]">
            {t('about_title', lang)}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('about_sub', lang)}
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#0F2133] flex items-center justify-center text-[#C5A059]">
              <Globe className="w-6 h-6 text-[#C5A059]" />
            </div>
            <h3 className="text-2xl font-bold font-display text-[#0F2133]">
              {t('about_mission_title', lang)}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('about_mission_desc', lang)}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#0F2133] flex items-center justify-center text-[#C5A059]">
              <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
            </div>
            <h3 className="text-2xl font-bold font-display text-[#0F2133]">
              {t('about_guarantee_title', lang)}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('about_guarantee_desc', lang)}
            </p>
          </div>
        </div>

        {/* Interactive CTA */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onOpenRFQ}
            className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#b08d4a] text-white font-bold text-xs sm:text-sm py-3.5 px-8 rounded-full shadow-lg shadow-[#C5A059]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>{ctaText}</span>
            <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

      </div>
    </section>
  );
};


