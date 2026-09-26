import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  MapPin, 
  Package, 
  Truck, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Anchor, 
  Thermometer,
  Sparkles
} from 'lucide-react';
import { Language, t, getLocalizedProject } from '../lib/i18n';
import { initialExportProjects, ExportProject, getProjectTemperature } from '../data/portfolioData';
import { fetchPortfolio } from '../lib/api';

interface PortfolioSectionProps {
  onOpenRFQ: (productName?: string) => void;
  lang?: Language;
}

const PORTFOLIO_TEXTS: Record<Language, {
  badge: string;
  title: string;
  subtitle: string;
  autoSlideOn: string;
  autoSlideOff: string;
  tonsUnit: string;
  containersUnit: string;
  destinationLabel: string;
  cropLabel: string;
  tempLabel: string;
  verifiedRecord: string;
  exportedQtyLabel: string;
  targetPortLabel: string;
  specsLabel: string;
  quarantineLabel: string;
  buyerReviewLabel: string;
  requestSimilarBtn: string;
  viewSpecsBtn: string;
  quickSpecsModalTitle: string;
  closeBtn: string;
  allShipments: string;
  totalStatsPill: (tons: number, containers: number) => string;
}> = {
  ar: {
    badge: 'سابقة أعمال الشحن والتصدير الموثقة',
    title: 'سجل شحنات التصدير والمسارات اللوجستية',
    subtitle: 'شحنات تصديرية حقيقية للمحاصيل المصرية بالتبريد القياسي والرقابة الصارمة للحجر الزراعي.',
    autoSlideOn: 'التمرير التلقائي مفعّل',
    autoSlideOff: 'التمرير التلقائي متوقف',
    tonsUnit: 'طن',
    containersUnit: 'حاوية 40 قدم',
    destinationLabel: 'المسار والوجهة:',
    cropLabel: 'المحصول التصديري:',
    tempLabel: 'درجة حرارة الشحن:',
    verifiedRecord: 'شحنة تصديرية قياسية موثقة',
    exportedQtyLabel: 'الحمولة الإجمالية:',
    targetPortLabel: 'ميناء الوصول والمسار:',
    specsLabel: 'المواصفات والمعالجة الحرارية:',
    quarantineLabel: 'شهادات الفحص والمطابقة:',
    buyerReviewLabel: 'تقييم المستورد الموثق (NDA):',
    requestSimilarBtn: 'طلب شحنة مماثلة الآن',
    viewSpecsBtn: 'عرض المواصفات والشهادات',
    quickSpecsModalTitle: 'بيانات وتوثيق الشحنة اللوجستية',
    closeBtn: 'إغلاق',
    allShipments: 'جميع الشحنات',
    totalStatsPill: (tons, containers) => `إجمالي المعروض: ${tons.toLocaleString()} طن (${containers} حاوية مبردة)`
  },
  en: {
    badge: 'Verified Export Shipments & Case Portfolio',
    title: 'Verified Global Export Corridors & Shipments',
    subtitle: 'Real export shipments of Egyptian crops handled with rigorous cold chain and phytosanitary clearance.',
    autoSlideOn: 'Auto-slide active',
    autoSlideOff: 'Auto-slide paused',
    tonsUnit: 'Tons',
    containersUnit: '40ft Reefer Units',
    destinationLabel: 'Destination & Corridor:',
    cropLabel: 'Export Crop:',
    tempLabel: 'Reefer Temp:',
    verifiedRecord: 'Standard Export Logistics Record',
    exportedQtyLabel: 'Total Payload Volume:',
    targetPortLabel: 'Port of Arrival & Corridor:',
    specsLabel: 'Specs & Post-Harvest Curing:',
    quarantineLabel: 'Phytosanitary & Lab Status:',
    buyerReviewLabel: 'Importer Feedback (NDA):',
    requestSimilarBtn: 'Request Similar Shipment (RFQ)',
    viewSpecsBtn: 'View Specs & Certs',
    quickSpecsModalTitle: 'Export Shipment Technical Blueprint',
    closeBtn: 'Close',
    allShipments: 'All Shipments',
    totalStatsPill: (tons, containers) => `Total Portfolio: ${tons.toLocaleString()} Tons (${containers} Reefer Containers)`
  },
  fr: {
    badge: 'Expéditions et réalisations documentées',
    title: 'Corridors logistiques et cargaisons vérifiées',
    subtitle: 'Expéditions réelles de récoltes égyptiennes assurées sous chaîne du froid stricte et certification phytosanitaire.',
    autoSlideOn: 'Défilement automatique actif',
    autoSlideOff: 'Défilement en pause',
    tonsUnit: 'Tonnes',
    containersUnit: 'Conteneurs 40ft',
    destinationLabel: 'Destination & Corridor :',
    cropLabel: 'Produit exporté :',
    tempLabel: 'Température reefer :',
    verifiedRecord: 'Cargaison d’exportation standard',
    exportedQtyLabel: 'Volume total :',
    targetPortLabel: 'Port d’arrivée & Corridor :',
    specsLabel: 'Spécifications & Curing :',
    quarantineLabel: 'Phytosanitaire & Laboratoire :',
    buyerReviewLabel: 'Retour de l’importateur (NDA) :',
    requestSimilarBtn: 'Commander une cargaison similaire',
    viewSpecsBtn: 'Voir spécifications & certificats',
    quickSpecsModalTitle: 'Fiche technique de l’expédition',
    closeBtn: 'Fermer',
    allShipments: 'Toutes les expéditions',
    totalStatsPill: (tons, containers) => `Total expédié : ${tons.toLocaleString()} Tonnes (${containers} Conteneurs)`
  },
  es: {
    badge: 'Cargamentos y exportaciones verificadas',
    title: 'Corredores logísticos y envíos internacionales',
    subtitle: 'Envíos reales de cultivos egipcios gestionados con estricta cadena de frío y control fitosanitario oficial.',
    autoSlideOn: 'Desplazamiento automático activado',
    autoSlideOff: 'Desplazamiento en pausa',
    tonsUnit: 'Toneladas',
    containersUnit: 'Contenedores 40ft',
    destinationLabel: 'Destino y Corredor:',
    cropLabel: 'Cultivo exportado:',
    tempLabel: 'Temperatura Reefer:',
    verifiedRecord: 'Registro logístico de exportación',
    exportedQtyLabel: 'Volumen total:',
    targetPortLabel: 'Puerto de llegada y ruta:',
    specsLabel: 'Especificaciones y Curado:',
    quarantineLabel: 'Fitosanitario y Laboratorio:',
    buyerReviewLabel: 'Evaluación del importador (NDA):',
    requestSimilarBtn: 'Solicitar cargamento similar',
    viewSpecsBtn: 'Ver especificaciones y certificados',
    quickSpecsModalTitle: 'Ficha técnica del cargamento',
    closeBtn: 'Cerrar',
    allShipments: 'Todos los envíos',
    totalStatsPill: (tons, containers) => `Total exportado: ${tons.toLocaleString()} Toneladas (${containers} Contenedores)`
  },
  de: {
    badge: 'Verifizierte Exportlieferungen',
    title: 'Internationale Exportkorridore & Sendungen',
    subtitle: 'Echte Exportlieferungen ägyptischer Ernteerzeugnisse unter kontinuierlicher Kühlkette und amtlichem Pflanzenschutz.',
    autoSlideOn: 'Automatischer Durchlauf aktiv',
    autoSlideOff: 'Automatischer Durchlauf pausiert',
    tonsUnit: 'Tonnen',
    containersUnit: '40ft Kühlcontainer',
    destinationLabel: 'Zielhafen & Korridor:',
    cropLabel: 'Export-Kultur:',
    tempLabel: 'Kühlketten-Temperatur:',
    verifiedRecord: 'Standard-Exportprotokoll',
    exportedQtyLabel: 'Gesamtnutzlast:',
    targetPortLabel: 'Zielhafen & Route:',
    specsLabel: 'Spezifikationen & Curing:',
    quarantineLabel: 'Pflanzenschutz & Laborstatus:',
    buyerReviewLabel: 'Käufer-Rückmeldung (NDA):',
    requestSimilarBtn: 'Ähnliche Fracht anfragen',
    viewSpecsBtn: 'Spezifikationen & Zertifikate',
    quickSpecsModalTitle: 'Technische Fracht-Dokumentation',
    closeBtn: 'Schließen',
    allShipments: 'Alle Lieferungen',
    totalStatsPill: (tons, containers) => `Gesamtportfolio: ${tons.toLocaleString()} Tonnen (${containers} Kühlcontainer)`
  },
  ru: {
    badge: 'Подтвержденные экспортные поставки',
    title: 'Экспортные коридоры и завершенные партии',
    subtitle: 'Реальные экспортные отгрузки египетской продукции с непрерывной холодовой цепью и фитосанитарным контролем.',
    autoSlideOn: 'Автопрокрутка включена',
    autoSlideOff: 'Автопрокрутка на паузе',
    tonsUnit: 'Тонн',
    containersUnit: '40-фут рефрижераторов',
    destinationLabel: 'Направление и коридор:',
    cropLabel: 'Экспортируемая культура:',
    tempLabel: 'Температурный режим:',
    verifiedRecord: 'Стандартная экспортная модель',
    exportedQtyLabel: 'Общий объем партии:',
    targetPortLabel: 'Порт назначения и маршрут:',
    specsLabel: 'Спецификации и термообработка:',
    quarantineLabel: 'Карантинный статус и лабконтроль:',
    buyerReviewLabel: 'Отзыв импортера (NDA):',
    requestSimilarBtn: 'Запросить аналогичную поставку',
    viewSpecsBtn: 'Спецификации и сертификаты',
    quickSpecsModalTitle: 'Технический паспорт партии',
    closeBtn: 'Закрыть',
    allShipments: 'Все поставки',
    totalStatsPill: (tons, containers) => `Всего в портфолио: ${tons.toLocaleString()} Тонн (${containers} Контейнеров)`
  }
};

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  onOpenRFQ,
  lang = 'ar'
}) => {
  const safeLang = (lang || 'ar') as Language;
  const isRtl = safeLang === 'ar';
  const portTxt = PORTFOLIO_TEXTS[safeLang] || PORTFOLIO_TEXTS.ar;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ExportProject | null>(null);
  const [projects, setProjects] = useState<ExportProject[]>(initialExportProjects);
  const [activeShowcaseImageIdx, setActiveShowcaseImageIdx] = useState(0);
  const [activeModalImageIdx, setActiveModalImageIdx] = useState(0);

  useEffect(() => {
    setActiveShowcaseImageIdx(0);
  }, [currentIndex]);

  useEffect(() => {
    setActiveModalImageIdx(0);
  }, [selectedProject?.id]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchPortfolio().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data);
      }
    }).catch(console.error);
  }, []);

  const totalTonnes = projects.reduce((acc, curr) => acc + (curr.volumeTonnes || 0), 0);
  const totalContainers = projects.reduce((acc, curr) => acc + (curr.containerCount || 0), 0);

  // Auto-scroll slideshow timer
  useEffect(() => {
    if (isPlaying && !isHovered && projects.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      }, 4500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, projects.length]);

  const rawProject = projects[currentIndex] || projects[0];
  const activeProject = rawProject ? getLocalizedProject(rawProject, safeLang) : null;

  if (!activeProject) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section 
      className="py-10 sm:py-14 bg-slate-100 text-slate-900 overflow-hidden" 
      id="portfolio" 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Compact Section Header with Quick Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#0F2133] text-[#C5A059] px-3.5 py-1 rounded-full text-xs font-bold shadow-sm">
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{portTxt.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-[#0F2133] tracking-tight">
              {portTxt.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {portTxt.subtitle}
            </p>
          </div>

          {/* Controls: Play/Pause, Indicators & Arrows */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            {/* Auto-Slide Play/Pause Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? portTxt.autoSlideOff : portTxt.autoSlideOn}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm ${
                isPlaying 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 fill-current" />
                  <span className="hidden sm:inline">{portTxt.autoSlideOn}</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span className="hidden sm:inline">{portTxt.autoSlideOff}</span>
                </>
              )}
            </button>

            {/* Prev/Next Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#0F2133] hover:text-white text-slate-700 border border-slate-300 flex items-center justify-center transition-colors shadow-xs"
                aria-label="Previous shipment"
              >
                {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <span className="text-xs font-mono font-bold text-slate-600 px-1.5">
                {currentIndex + 1} / {projects.length}
              </span>

              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#0F2133] hover:text-white text-slate-700 border border-slate-300 flex items-center justify-center transition-colors shadow-xs"
                aria-label="Next shipment"
              >
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Compact Auto-Scrolling Showcase Card */}
        <div 
          className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-300 relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Progress Bar for Auto-Slide */}
          {isPlaying && (
            <div className="h-1 w-full bg-slate-100 overflow-hidden">
              <div 
                key={currentIndex}
                className="h-full bg-[#C5A059] transition-all duration-[4500ms] ease-linear w-full origin-left animate-progress"
              ></div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left/Main Shipment Photo Showcase */}
            <div className="lg:col-span-7 relative h-64 sm:h-80 md:h-[360px] overflow-hidden bg-slate-950">
              {(() => {
                const showcaseImages = Array.isArray(activeProject.images) && activeProject.images.length > 0
                  ? activeProject.images
                  : [activeProject.image].filter(Boolean);
                const activeShowcaseImg = showcaseImages[activeShowcaseImageIdx] || activeProject.image;

                return (
                  <>
                    <img
                      key={`${activeProject.id}-${activeShowcaseImageIdx}`}
                      src={activeShowcaseImg}
                      alt={activeProject.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out animate-fade-in"
                    />

                    {/* Interactive Pagination Dots for Showcase */}
                    {showcaseImages.length > 1 && (
                      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/45 px-3 py-1.5 rounded-full backdrop-blur-xs">
                        {showcaseImages.map((_: string, sIdx: number) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveShowcaseImageIdx(sIdx);
                            }}
                            className={`w-2 h-2 rounded-full transition-all ${
                              sIdx === activeShowcaseImageIdx
                                ? 'bg-[#C5A059] scale-125'
                                : 'bg-white/60 hover:bg-white'
                            }`}
                            aria-label={`Show image ${sIdx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
              
              {/* Subtle Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>

              {/* Floating Top Pills */}
              <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10">
                <span className="bg-[#C5A059] text-white text-xs font-black px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  <span>{activeProject.cropName}</span>
                </span>
                
                <span className="bg-[#0F2133]/90 text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                  {activeProject.categoryLabel[safeLang] || activeProject.categoryLabel['ar']}
                </span>
              </div>

              {/* Bottom Image Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5 z-10">
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#C5A059]">
                  <span className="flex items-center gap-1.5 bg-black/50 px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                    <Anchor className="w-3.5 h-3.5" />
                    <span>{activeProject.port}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/50 px-2.5 py-0.5 rounded-md backdrop-blur-xs text-emerald-400">
                    <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{getProjectTemperature(activeProject)}</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-xl font-bold leading-snug drop-shadow-md line-clamp-1">
                  {activeProject.title}
                </h3>
              </div>
            </div>

            {/* Right Side Compact Technical Specs & Action Card */}
            <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-slate-50/50">
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {portTxt.exportedQtyLabel}
                  </span>
                  <div className="text-lg sm:text-xl font-black text-[#0F2133] mt-0.5">
                    {activeProject.volumeTonnes.toLocaleString()} <span className="text-xs font-bold text-slate-500">{portTxt.tonsUnit}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#C5A059] block mt-0.5">
                    {activeProject.containerCount} {portTxt.containersUnit}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {portTxt.quarantineLabel}
                  </span>
                  <div className="text-xs font-bold text-emerald-700 mt-1 flex items-start gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-tight">{activeProject.phytosanitaryStatus}</span>
                  </div>
                </div>
              </div>

              {/* Specs & Route Highlights */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                  <span><strong>{portTxt.destinationLabel}</strong> {activeProject.destination}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-3.5 h-3.5 text-[#0F2133] shrink-0 mt-0.5" />
                  <span className="line-clamp-2"><strong>{portTxt.specsLabel}</strong> {activeProject.specsHighlight}</span>
                </div>
              </div>

              {/* Feedback Quote */}
              <div className="bg-amber-50/70 border border-amber-200/70 p-3 rounded-2xl text-[11px] italic text-amber-950 font-medium leading-relaxed">
                "{typeof activeProject.buyerFeedback === 'object' ? (activeProject.buyerFeedback[safeLang] || activeProject.buyerFeedback.ar || activeProject.buyerFeedback.en) : activeProject.buyerFeedback}"
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => setSelectedProject(activeProject)}
                  className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{portTxt.viewSpecsBtn}</span>
                </button>

                <button
                  onClick={() => onOpenRFQ(activeProject.cropName)}
                  className="bg-[#C5A059] hover:bg-[#b08d4a] text-white font-black text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-[#C5A059]/20 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{portTxt.requestSimilarBtn}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>

            </div>

          </div>

          {/* Quick Select Crop Thumbnails / Dots Bar */}
          <div className="bg-slate-100/90 border-t border-slate-200/80 px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-2">
              {projects.map((proj, idx) => (
                <button
                  key={proj.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                    idx === currentIndex
                      ? 'bg-[#0F2133] text-[#C5A059] shadow-sm ring-2 ring-[#C5A059]/40'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                  <span className="max-w-[140px] sm:max-w-none truncate">{proj.cropName}</span>
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-slate-500 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{portTxt.totalStatsPill(totalTonnes, totalContainers)}</span>
            </div>
          </div>
        </div>

        {/* Detailed Specs & Quarantine Modal (Quick View) */}
        {selectedProject && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in" 
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-800 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedProject(null)}
                className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors`}
                aria-label={portTxt.closeBtn}
              >
                ✕
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059] bg-[#0F2133] px-3.5 py-1 rounded-full w-fit shadow-xs">
                  <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{portTxt.quickSpecsModalTitle}</span>
                </div>

                <h3 className="text-xl font-black text-[#0F2133] leading-snug">
                  {selectedProject.title}
                </h3>

                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                  {(() => {
                    const modalImages = Array.isArray(selectedProject.images) && selectedProject.images.length > 0
                      ? selectedProject.images
                      : [selectedProject.image].filter(Boolean);
                    const activeModalImg = modalImages[activeModalImageIdx] || selectedProject.image;

                    return (
                      <>
                        <img src={activeModalImg} alt={selectedProject.title} className="w-full h-full object-cover animate-fade-in" />
                        
                        {/* Interactive Pagination Dots for Modal */}
                        {modalImages.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/45 px-2.5 py-1 rounded-full backdrop-blur-xs">
                            {modalImages.map((_: string, mIdx: number) => (
                              <button
                                key={mIdx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveModalImageIdx(mIdx);
                                }}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                  mIdx === activeModalImageIdx
                                    ? 'bg-[#C5A059] scale-125'
                                    : 'bg-white/60 hover:bg-white'
                                }`}
                                aria-label={`Show modal image ${mIdx + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                  <span className="absolute bottom-3 right-3 bg-[#0F2133]/90 text-[#C5A059] px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                    {selectedProject.cropName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-semibold">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{portTxt.exportedQtyLabel}</span>
                    <span className="text-[#0F2133] font-bold text-sm">{selectedProject.volumeTonnes} {portTxt.tonsUnit} ({selectedProject.containerCount} {portTxt.containersUnit})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{portTxt.targetPortLabel}</span>
                    <span className="text-[#0F2133] font-bold text-xs">{selectedProject.port}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">{portTxt.specsLabel}</span>
                    <span className="text-[#0F2133] font-bold text-xs leading-relaxed">{selectedProject.specsHighlight}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">{portTxt.quarantineLabel}</span>
                    <span className="text-emerald-700 font-bold text-xs">{selectedProject.phytosanitaryStatus}</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-950 font-medium">
                  <strong>{portTxt.buyerReviewLabel}</strong>
                  <p className="mt-1 italic">"{typeof selectedProject.buyerFeedback === 'object' ? (selectedProject.buyerFeedback[safeLang] || selectedProject.buyerFeedback.ar || selectedProject.buyerFeedback.en) : selectedProject.buyerFeedback}"</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      const projCrop = selectedProject.cropName;
                      setSelectedProject(null);
                      onOpenRFQ(projCrop);
                    }}
                    className="w-full bg-[#C5A059] hover:bg-[#b08d4a] text-white font-bold py-3.5 rounded-full text-xs text-center shadow-lg shadow-[#C5A059]/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>{portTxt.requestSimilarBtn}</span>
                    <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
