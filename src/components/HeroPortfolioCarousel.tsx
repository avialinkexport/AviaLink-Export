import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Anchor, Package, Truck, Award, ArrowRight, Image as ImageIcon, Thermometer } from 'lucide-react';
import { ExportProject, getProjectTemperature } from '../data/portfolioData';
import { Language, t, getLocalizedProject } from '../lib/i18n';

interface HeroPortfolioCarouselProps {
  projects: ExportProject[];
  onOpenRFQ: (cropName?: string) => void;
  lang: Language;
}

const CAROUSEL_TEXTS: Record<Language, {
  badge: string;
  title: string;
  volume: string;
  tons: string;
  containers: string;
  containersUnit: string;
  destination: string;
  specs: string;
  rfqBtn: (crop: string) => string;
}> = {
  ar: {
    badge: 'نماذج ومسارات الشحنات اللوجستية (§1)',
    title: 'مسارات وقدرات الشحن الزراعي الدولي',
    volume: 'الحمولة النمطية',
    tons: 'طن',
    containers: 'سعة الوحدة',
    containersUnit: 'حاوية 40 قدم مبردة',
    destination: 'الوجهة والميناء:',
    specs: 'المواصفات وبروتوكول الحفظ:',
    rfqBtn: (crop) => `طلب عرض سعر لشحنة (${crop})`
  },
  en: {
    badge: 'Standard Export Logistics Blueprints (§1)',
    title: 'Global Export Corridors & Handling Capabilities',
    volume: 'Standard Payload',
    tons: 'Tons',
    containers: 'Unit Capacity',
    containersUnit: '40ft Reefer FCL',
    destination: 'Destination & Port:',
    specs: 'Specs & Cold Protocols:',
    rfqBtn: (crop) => `Request Quotation for (${crop})`
  },
  fr: {
    badge: 'Modèles logistiques d’exportation (§1)',
    title: 'Corridors et capacités d’expédition internationale',
    volume: 'Charge utile standard',
    tons: 'Tonnes',
    containers: 'Unité logistique',
    containersUnit: 'Conteneur 40ft FCL',
    destination: 'Destination & Port :',
    specs: 'Spécifications & Chaîne du froid :',
    rfqBtn: (crop) => `Demander un devis pour (${crop})`
  },
  es: {
    badge: 'Modelos logísticos de exportación (§1)',
    title: 'Rutas y capacidades de exportación agrícola internacional',
    volume: 'Carga útil estándar',
    tons: 'Toneladas',
    containers: 'Unidad de transporte',
    containersUnit: 'Contenedor 40ft FCL',
    destination: 'Destino y Puerto:',
    specs: 'Especificaciones y Cadena de frío:',
    rfqBtn: (crop) => `Solicitar cotización para (${crop})`
  },
  de: {
    badge: 'Standard-Exportlogistik-Blaupausen (§1)',
    title: 'Internationale Exportkorridore & Logistikkapazitäten',
    volume: 'Standard-Nutzlast',
    tons: 'Tonnen',
    containers: 'Einheitenkapazität',
    containersUnit: '40ft Kühlcontainer',
    destination: 'Zielhafen & Land:',
    specs: 'Spezifikation & Kühlkette:',
    rfqBtn: (crop) => `Angebot für (${crop}) anfordern`
  },
  ru: {
    badge: 'Стандартные логистические модели экспорта (§1)',
    title: 'Международные экспортные маршруты и параметры доставки',
    volume: 'Стандартный объем',
    tons: 'Тонн',
    containers: 'Логистическая единица',
    containersUnit: '40-фут рефрижератор FCL',
    destination: 'Направление и порт:',
    specs: 'Спецификация и температурный режим:',
    rfqBtn: (crop) => `Запросить КП на (${crop})`
  }
};

export const HeroPortfolioCarousel: React.FC<HeroPortfolioCarouselProps> = ({
  projects,
  onOpenRFQ,
  lang = 'ar'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(() => {
    if (typeof window !== 'undefined') {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return true;
  });

  const carTxt = CAROUSEL_TEXTS[lang] || CAROUSEL_TEXTS.ar;
  const rawProject = projects[currentIndex] || projects[0];
  const activeProject = rawProject ? getLocalizedProject(rawProject, lang) : null;

  useEffect(() => {
    if (!isAutoPlaying || projects.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, projects.length]);

  if (!activeProject) return null;

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const isRtl = lang === 'ar';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 overflow-hidden space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] bg-[#0F2133]/5 px-3 py-1 rounded-full mb-1">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{carTxt.badge}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F2133] font-display">
            {carTxt.title}
          </h2>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#0F2133] hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-sm"
            aria-label="Previous image"
          >
            {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          
          <span className="text-xs font-bold text-slate-500 px-2 font-mono">
            {currentIndex + 1} / {projects.length}
          </span>

          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#0F2133] hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-sm"
            aria-label="Next image"
          >
            {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Showcase Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Photo Container */}
        <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden min-h-[280px] sm:min-h-[360px] bg-slate-900 border border-slate-200 shadow-md">
          <img
            src={activeProject.image}
            alt={activeProject.title}
            className="w-full h-full object-cover min-h-[280px] sm:min-h-[360px] group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap justify-between items-center gap-2">
            <span className="bg-[#C5A059] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
              {activeProject.cropName}
            </span>
            <span className="bg-[#0F2133]/90 text-[#C5A059] border border-[#C5A059]/40 text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md">
              {activeProject.completionDate}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-[#C5A059]">
              <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                <Anchor className="w-3.5 h-3.5" />
                <span>{activeProject.port}</span>
              </span>
              <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs text-emerald-400">
                <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
                <span>{getProjectTemperature(activeProject)}</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold leading-tight drop-shadow">
              {activeProject.title}
            </h3>
          </div>
        </div>

        {/* Details & Specs Container */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 font-medium block">{carTxt.volume}</span>
                <span className="text-base font-black text-[#0F2133]">{activeProject.volumeTonnes.toLocaleString()} {carTxt.tons}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 font-medium block">{carTxt.containers}</span>
                <span className="text-base font-black text-[#C5A059]">{activeProject.containerCount} {carTxt.containersUnit}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 font-medium pt-1">
              <div className="flex items-center gap-2 text-slate-800">
                <Truck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span><strong>{carTxt.destination}</strong> {activeProject.destination}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>{carTxt.specs}</strong> {activeProject.specsHighlight}</span>
              </div>
            </div>

            {/* Buyer Feedback Quote */}
            {activeProject.buyerFeedback && (
              <div className="bg-white p-3.5 rounded-xl border-l-4 border-l-[#C5A059] border border-slate-200 italic text-xs text-slate-600 leading-relaxed">
                "{typeof activeProject.buyerFeedback === 'object' ? (activeProject.buyerFeedback[lang] || activeProject.buyerFeedback.ar || activeProject.buyerFeedback.en) : activeProject.buyerFeedback}"
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenRFQ(activeProject.cropName)}
            className="w-full bg-[#0F2133] hover:bg-[#1a334d] text-white font-bold text-xs py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            <span>{carTxt.rfqBtn(activeProject.cropName)}</span>
            <ArrowRight className={`w-4 h-4 text-[#C5A059] ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Thumbnails Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {projects.map((proj, idx) => (
          <button
            key={proj.id}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(idx);
            }}
            className={`relative shrink-0 rounded-xl overflow-hidden h-16 w-24 border-2 transition-all ${
              idx === currentIndex
                ? 'border-[#C5A059] scale-105 shadow-md'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20"></div>
          </button>
        ))}
      </div>
    </div>
  );
};
