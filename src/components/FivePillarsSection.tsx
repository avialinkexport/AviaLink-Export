import React from 'react';
import { Language, GROUPE_BROUSSE_TRANSLATIONS } from '../lib/i18n';
import { StrategicPillarItem } from '../types';
import { Shield, Snowflake, HeartHandshake, Sprout, Award, CheckCircle2 } from 'lucide-react';

interface FivePillarsSectionProps {
  lang: Language;
  onOpenRFQ?: () => void;
  pillars?: StrategicPillarItem[];
}

export const FivePillarsSection: React.FC<FivePillarsSectionProps> = ({ lang, onOpenRFQ, pillars }) => {
  const t = GROUPE_BROUSSE_TRANSLATIONS[lang]?.pillars || GROUPE_BROUSSE_TRANSLATIONS.en.pillars;
  const isAr = lang === 'ar';

  const pillarIcons = [
    Sprout,          // 01: Roots & Heritage
    Snowflake,       // 02: Cold chain mastery
    Award,           // 03: Quality burned in DNA
    Shield,          // 04: Responsible grower relationships
    HeartHandshake,  // 05: Long-term client trust
  ];

  // If dynamic pillars are provided from CMS, format them
  const itemsToRender = (pillars && pillars.length > 0)
    ? pillars.map((p, idx) => ({
        number: p.number || `0${idx + 1}`,
        headline: isAr ? p.title : (p.titleEn || p.title),
        desc: isAr ? p.subtitle : (p.subtitleEn || p.subtitle)
      }))
    : t.items;

  return (
    <section id="five-pillars" className="py-20 bg-slate-900/95 text-slate-100 relative overflow-hidden border-t border-b border-slate-800">
      {/* Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header - Groupe Brousse High Corporate Identity */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#E0C078] text-xs font-semibold tracking-wider uppercase">
            <Award className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {t.title}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* The 5 Columns / Cards of the Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {itemsToRender.map((pillar, index) => {
            const IconComponent = pillarIcons[index % pillarIcons.length] || Shield;
            const isFullSpanOnTablet = index === itemsToRender.length - 1 && itemsToRender.length % 2 === 1;

            return (
              <div
                key={pillar.number}
                className={`relative rounded-2xl bg-slate-800/80 border border-slate-700/80 p-6 sm:p-8 hover:border-[#C5A059]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#C5A059]/10 group flex flex-col justify-between ${
                  isFullSpanOnTablet ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {/* Top Number & Icon */}
                <div className="flex items-start justify-between mb-6">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-[#C5A059] tracking-tighter">
                    {pillar.number}
                  </span>
                  
                  <div className="w-12 h-12 rounded-xl bg-slate-700/50 border border-slate-600 flex items-center justify-center text-[#E0C078] group-hover:bg-[#C5A059] group-hover:text-slate-950 transition-colors duration-300 shadow-sm">
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>

                {/* Headline & Narrative */}
                <div className="space-y-3 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#F3D78F] transition-colors">
                    {pillar.headline}
                  </h3>
                  
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                {/* Bottom Verification Checkmark */}
                <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center gap-2 text-xs font-medium text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">
                    {lang === 'ar' ? 'معيار تشغيلي موثق ومعتمد' : 
                     lang === 'fr' ? 'Standard opérationnel certifié' :
                     lang === 'es' ? 'Estándar operacional certificado' :
                     lang === 'de' ? 'Zertifizierter Betriebsstandard' :
                     lang === 'ru' ? 'Сертифицированный рабочий стандарт' :
                     'Verified operational standard'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
