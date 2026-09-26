import React from 'react';
import { Language, GROUPE_BROUSSE_TRANSLATIONS } from '../lib/i18n';
import { ArrowRight, ArrowLeft, Sparkles, Send, ShieldCheck, Thermometer, CheckCircle2 } from 'lucide-react';

interface GroupeBrousseGridProps {
  lang: Language;
  onSelectCrop: (cropKey: string) => void;
  onOpenRFQForCrop: (cropKey: string) => void;
}

const CROP_IMAGE_MAP: Record<string, string> = {
  'sweet-potatoes': '/crops/sweet_potatoes.jpg',
  'onions': '/crops/onions.jpg',
  'onions-garlic': '/crops/onions.jpg',
  'carrots': '/crops/carrots.jpg',
  'carrots-beetroot': '/crops/carrots.jpg',
  'garlic': '/crops/garlic.jpg',
  'red-beet': '/crops/red_beet.jpg'
};

export const GroupeBrousseGrid: React.FC<GroupeBrousseGridProps> = ({
  lang,
  onSelectCrop,
  onOpenRFQForCrop,
}) => {
  const t = GROUPE_BROUSSE_TRANSLATIONS[lang]?.universes || GROUPE_BROUSSE_TRANSLATIONS.en.universes;
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section id="product-universes" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header - Groupe Brousse High Corporate Style */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#E0C078] text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {t.title}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* The Signature Groupe Brousse Bento Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {t.items.map((item, idx) => {
            return (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-800 shadow-2xl flex flex-col justify-end transition-all duration-500 hover:border-[#C5A059]/60 hover:shadow-[#C5A059]/15 min-h-[380px] sm:min-h-[440px]"
              >
                {/* Background Image with Cinematic Hover Zoom */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={CROP_IMAGE_MAP[item.cropKey] || item.image || '/crops/onions.jpg'}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Multi-stage Dark Gradient for Text Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent opacity-90 transition-opacity group-hover:opacity-85" />
                  <div className="absolute inset-0 bg-slate-950/25 group-hover:bg-slate-950/10 transition-colors" />
                </div>

                {/* Top Badge: Sourcing Category */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-[11px] font-bold text-[#E0C078] tracking-wider uppercase shadow-lg">
                    <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                    {item.tag}
                  </span>

                  <span className="w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-xs font-mono text-slate-300">
                    0{idx + 1}
                  </span>
                </div>

                {/* Card Content & Action Area */}
                <div className="relative z-10 p-6 sm:p-8 space-y-3">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-[#F3D78F] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {item.baseline}
                  </p>

                  {/* Dual Action Buttons: Filter & RFQ */}
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => onSelectCrop(item.cropKey)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20 transition-all duration-200 hover:border-[#C5A059]/50"
                    >
                      <span>{t.exploreBtn}</span>
                      <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                      onClick={() => onOpenRFQForCrop(item.cropKey)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#C5A059] hover:bg-[#d8b368] text-slate-950 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#C5A059]/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.rfqBtn}</span>
                    </button>
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
