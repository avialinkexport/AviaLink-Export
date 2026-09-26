import React, { useState } from 'react';
import { Language, GROUPE_BROUSSE_TRANSLATIONS } from '../lib/i18n';
import { Compass, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { ProtocolModal } from './ProtocolModal';
import { DynamicProtocolItem } from '../types';

interface OutsideSeriesSectionProps {
  lang: Language;
  onNavigateSupplyChain: () => void;
  onOpenRFQ?: (cropName?: string) => void;
  dynamicProtocols?: DynamicProtocolItem[];
}

const STORY_CROP_IMAGES = [
  '/crops/sweet_potatoes.jpg',
  '/crops/onions.jpg',
  '/crops/carrots.jpg',
  '/crops/garlic.jpg',
  '/crops/red_beet.jpg'
];

export const OutsideSeriesSection: React.FC<OutsideSeriesSectionProps> = ({
  lang,
  onNavigateSupplyChain,
  onOpenRFQ,
  dynamicProtocols
}) => {
  const t = GROUPE_BROUSSE_TRANSLATIONS[lang]?.outside || GROUPE_BROUSSE_TRANSLATIONS.en.outside;
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [activeProtocolIndex, setActiveProtocolIndex] = useState<number | null>(null);

  const handleOpenProtocol = (idx: number) => {
    setActiveProtocolIndex(idx);
  };

  const handleCloseProtocol = () => {
    setActiveProtocolIndex(null);
  };

  return (
    <section id="outside-series" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#E0C078] text-xs font-semibold tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{t.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {t.title}
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={onNavigateSupplyChain}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C5A059] hover:bg-[#d8b368] text-slate-950 text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-[#C5A059]/20 self-start md:self-auto shrink-0 cursor-pointer"
          >
            <span>{t.ctaBtn}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Expedition Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.stories.map((story, idx) => {
            const cropImg = STORY_CROP_IMAGES[idx] || story.image || '/crops/onions.jpg';

            return (
              <div
                key={story.title}
                onClick={() => handleOpenProtocol(idx)}
                className="group rounded-2xl bg-slate-800 border border-slate-700/70 overflow-hidden flex flex-col justify-between hover:border-[#C5A059]/80 transition-all duration-300 hover:shadow-2xl hover:shadow-[#C5A059]/20 cursor-pointer text-start"
              >
                {/* Photo Area */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={cropImg}
                    alt={story.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-85" />

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#E0C078] tracking-wider uppercase">
                    {story.tag}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>{story.category}</span>
                    <span className="text-[10px] font-mono text-[#C5A059] bg-slate-950/70 px-2 py-0.5 rounded">0{idx + 1}</span>
                  </div>
                </div>

                {/* Text Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-white group-hover:text-[#F3D78F] transition-colors leading-snug">
                      {story.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {story.desc}
                    </p>
                  </div>

                  {/* Fully Active Protocol Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProtocol(idx);
                    }}
                    className="pt-2.5 border-t border-slate-700/60 w-full flex items-center justify-between text-xs font-bold text-[#C5A059] group-hover:text-[#F3D78F] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{lang === 'ar' ? 'استكشف البروتوكول المعتمد' : 'View Certified Protocol'}</span>
                    </span>
                    <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Interactive Quality Protocol Modal */}
      <ProtocolModal
        isOpen={activeProtocolIndex !== null}
        onClose={handleCloseProtocol}
        storyIndex={activeProtocolIndex}
        lang={lang}
        dynamicProtocols={dynamicProtocols}
        onOpenRFQ={(cropName) => {
          if (onOpenRFQ) onOpenRFQ(cropName);
        }}
      />
    </section>
  );
};

