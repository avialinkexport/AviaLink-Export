import React from 'react';
import { Language, GROUPE_BROUSSE_TRANSLATIONS, localizeMetricValue } from '../lib/i18n';
import { MetricFigureItem } from '../types';
import { TrendingUp, Globe2, ShieldCheck, ThermometerSnowflake, Award, PackageCheck } from 'lucide-react';

interface GroupInFiguresProps {
  lang: Language;
  figures?: MetricFigureItem[];
}

const ICON_MAP = {
  TrendingUp,
  Globe2,
  ShieldCheck,
  ThermometerSnowflake,
  Award,
  PackageCheck
};

export const GroupInFigures: React.FC<GroupInFiguresProps> = ({ lang, figures }) => {
  const t = GROUPE_BROUSSE_TRANSLATIONS[lang]?.figures || GROUPE_BROUSSE_TRANSLATIONS.en.figures;
  const isAr = lang === 'ar';

  const defaultIcons = [
    TrendingUp,
    Globe2,
    ShieldCheck,
    ThermometerSnowflake,
  ];

  const itemsToRender = (figures && figures.length > 0)
    ? figures.map((f, idx) => ({
        value: isAr ? f.value : (f.valueEn || localizeMetricValue(f.value, lang)),
        label: isAr ? f.label : (f.labelEn || f.label),
        sub: isAr ? f.sub : (f.subEn || f.sub),
        iconComp: f.iconName ? ICON_MAP[f.iconName] || TrendingUp : defaultIcons[idx % defaultIcons.length]
      }))
    : t.items.map((stat, idx) => ({
        ...stat,
        iconComp: defaultIcons[idx] || TrendingUp
      }));

  return (
    <section className="py-16 bg-slate-950 text-white border-b border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#E0C078] text-xs font-semibold tracking-wider uppercase">
            <span>{t.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {t.title}
          </h2>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {itemsToRender.map((stat) => {
            const IconComp = stat.iconComp;

            return (
              <div
                key={stat.label}
                className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 flex flex-col justify-between hover:border-[#C5A059]/50 transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Top Icon */}
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[#C5A059] mb-4 group-hover:scale-110 transition-transform">
                  <IconComp className="w-5 h-5" />
                </div>

                {/* Big Metric Value */}
                <div className="space-y-1.5">
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white group-hover:text-[#F3D78F] transition-colors">
                    {stat.value}
                  </div>

                  <div className="text-sm font-bold text-slate-200">
                    {stat.label}
                  </div>

                  <div className="text-xs text-slate-400 leading-relaxed">
                    {stat.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
