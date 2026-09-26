import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  MapPin, 
  Package, 
  Award, 
  Thermometer, 
  FileText, 
  ArrowRight, 
  Calendar, 
  Sparkles,
  Search,
  CheckCircle2,
  ExternalLink,
  Grid,
  SlidersHorizontal,
  Ship,
  X
} from 'lucide-react';
import { Language, getLocalizedProduct, t } from '../lib/i18n';
import { initialProducts } from '../data/products';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenSpecSheet: (product: Product) => void;
  onOpenRFQ: (productName: string) => void;
  lang: Language;
  isDedicatedPage?: boolean;
}

const CATALOG_TEXTS: Record<Language, {
  badge: string;
  title: string;
  subtitle: string;
  autoSlideOn: string;
  autoSlideOff: string;
  originBadge: string;
  seasonLabel: string;
  varietiesLabel: string;
  moqLabel: string;
  packagingLabel: string;
  storageLabel: string;
  specsBtn: string;
  rfqBtn: string;
  detailsBtn: string;
  viewDetails: string;
  viewDetailsAndShipments: string;
  certifiedQuality: string;
  allCrops: string;
  totalCropsPill: (count: number) => string;
  searchPlaceholder: string;
  filterAll: string;
  filterSweetPotatoes: string;
  filterPotatoes: string;
  viewGridMode: string;
  viewSliderMode: string;
  cropsFound: (count: number) => string;
  browseAllPageBtn: string;
}> = {
  ar: {
    badge: 'المحاصيل التصديرية المصرية الطازجة',
    title: 'دليل المنتجات والمحاصيل الزراعية المعتمدة',
    subtitle: 'محاصيل زراعية مصرية منتقاة بعناية ومجهزة بأحدث خطوط الفرز والغسيل والمعالجة الحرارية للتصدير الدولي.',
    autoSlideOn: 'التمرير التلقائي مفعّل',
    autoSlideOff: 'التمرير التلقائي متوقف',
    originBadge: 'إنتاج مصري فرز أول',
    seasonLabel: 'موسم التصدير والذروة:',
    varietiesLabel: 'الأصناف التصديرية:',
    moqLabel: 'الحد الأدنى للطلب (MOQ):',
    packagingLabel: 'خيارات التعبئة والشحن:',
    storageLabel: 'سلسلة التبريد المعتمدة:',
    specsBtn: 'المواصفات الفنية',
    rfqBtn: 'طلب عرض سعر فوري (RFQ)',
    detailsBtn: 'عرض التفاصيل وسابقة الأعمال',
    viewDetails: 'تفاصيل المحصول',
    viewDetailsAndShipments: 'عرض تفاصيل المحصول وسابقة أعماله وشحناته',
    certifiedQuality: 'مطابقة لمعايير الاتحاد الأوروبي وCAPQ',
    allCrops: 'جميع المحاصيل',
    totalCropsPill: (count) => `المحاصيل النشطة: ${count} محاصيل قياسية`,
    searchPlaceholder: 'ابحث عن محصول، صنف (مثل: بيورجارد، سبونتا)...',
    filterAll: 'جميع المحاصيل التصديرية',
    filterSweetPotatoes: 'بطاطا حلوة تصديرية',
    filterPotatoes: 'بطاطس تصنيع ومائدة',
    viewGridMode: 'عرض الشبكة الكاملة',
    viewSliderMode: 'عرض السلايدر التفاعلي',
    cropsFound: (count) => `تم العثور على ${count} محصول مطابق`,
    browseAllPageBtn: 'استعراض الدليل الشامل لجميع المنتجات'
  },
  en: {
    badge: 'Fresh Egyptian Export Crops',
    title: 'Certified Agricultural Export Products Directory',
    subtitle: 'Selected Egyptian crops sorted, washed, cured, and packed under strict international phytosanitary standards.',
    autoSlideOn: 'Auto-slide active',
    autoSlideOff: 'Auto-slide paused',
    originBadge: 'Origin: Egypt (Class I)',
    seasonLabel: 'Export & Peak Season:',
    varietiesLabel: 'Export Varieties:',
    moqLabel: 'Minimum Order (MOQ):',
    packagingLabel: 'Packaging & Pallets:',
    storageLabel: 'Reefer Cold Chain:',
    specsBtn: 'Technical Specs',
    rfqBtn: 'Request Instant Quote (RFQ)',
    detailsBtn: 'View Crop Details & Shipments',
    viewDetails: 'Crop Details',
    viewDetailsAndShipments: 'View Full Details & Export Shipments',
    certifiedQuality: 'EU MRL & CAPQ Certified Quality',
    allCrops: 'All Crops',
    totalCropsPill: (count) => `Active Crops: ${count} Standard Products`,
    searchPlaceholder: 'Search crops, varieties (e.g. Beauregard, Spunta)...',
    filterAll: 'All Export Crops',
    filterSweetPotatoes: 'Sweet Potatoes',
    filterPotatoes: 'Ware & Processing Potatoes',
    viewGridMode: 'Full Grid View',
    viewSliderMode: 'Interactive Slider',
    cropsFound: (count) => `${count} matching crops found`,
    browseAllPageBtn: 'Explore Complete Products Directory'
  },
  fr: {
    badge: 'Cultures fraîches d’exportation égyptiennes',
    title: 'Répertoire des produits agricoles certifiés',
    subtitle: 'Récoltes égyptiennes sélectionnées, lavées, séchées et calibrées selon les normes phytosanitaires internationales.',
    autoSlideOn: 'Défilement automatique actif',
    autoSlideOff: 'Défilement en pause',
    originBadge: 'Origine : Égypte (Catégorie I)',
    seasonLabel: 'Saison d’exportation :',
    varietiesLabel: 'Variétés disponibles :',
    moqLabel: 'Commande minimale (MOQ) :',
    packagingLabel: 'Options de conditionnement :',
    storageLabel: 'Chaîne du froid reefer :',
    specsBtn: 'Fiche technique',
    rfqBtn: 'Demander un devis (RFQ)',
    detailsBtn: 'Détails & Historique d’exportation',
    viewDetails: 'Fiche produit',
    viewDetailsAndShipments: 'Voir détails complets et expéditions',
    certifiedQuality: 'Qualité certifiée UE et CAPQ',
    allCrops: 'Toutes les cultures',
    totalCropsPill: (count) => `Cultures actives : ${count} produits`,
    searchPlaceholder: 'Rechercher une culture ou variété...',
    filterAll: 'Toutes les cultures',
    filterSweetPotatoes: 'Patates douces',
    filterPotatoes: 'Pommes de terre',
    viewGridMode: 'Vue en grille',
    viewSliderMode: 'Vue défilante',
    cropsFound: (count) => `${count} cultures trouvées`,
    browseAllPageBtn: 'Explorer tout le répertoire des produits'
  },
  es: {
    badge: 'Cultivos frescos de exportación de Egipto',
    title: 'Catálogo de productos de exportación agrícola',
    subtitle: 'Cultivos egipcios seleccionados, lavados, curados y envasados bajo estrictos estándares fitosanitarios internacionales.',
    autoSlideOn: 'Desplazamiento automático activado',
    autoSlideOff: 'Desplazamiento en pausa',
    originBadge: 'Origen: Egipto (Clase I)',
    seasonLabel: 'Temporada de exportación:',
    varietiesLabel: 'Variedades de exportación:',
    moqLabel: 'Pedido mínimo (MOQ):',
    packagingLabel: 'Opciones de empaque:',
    storageLabel: 'Cadena de frío reefer:',
    specsBtn: 'Ficha técnica',
    rfqBtn: 'Solicitar cotización (RFQ)',
    detailsBtn: 'Ver detalles y envíos',
    viewDetails: 'Detalles del producto',
    viewDetailsAndShipments: 'Ver detalles completos e historial de envíos',
    certifiedQuality: 'Calidad certificada UE y CAPQ',
    allCrops: 'Todos los cultivos',
    totalCropsPill: (count) => `Cultivos activos: ${count} productos`,
    searchPlaceholder: 'Buscar cultivos o variedades...',
    filterAll: 'Todos los cultivos',
    filterSweetPotatoes: 'Batata Dulce',
    filterPotatoes: 'Papas de Mesa y Procesamiento',
    viewGridMode: 'Vista en cuadrícula',
    viewSliderMode: 'Vista deslizante',
    cropsFound: (count) => `${count} cultivos encontrados`,
    browseAllPageBtn: 'Explorar directorio completo de productos'
  },
  de: {
    badge: 'Frische ägyptische Export-Agrarprodukte',
    title: 'Zertifizierter Agrar-Exportkatalog',
    subtitle: 'Ausgewählte ägyptische Ernteerzeugnisse, gewaschen, thermisch behandelt und nach EU-Standards verpackt.',
    autoSlideOn: 'Automatischer Durchlauf aktiv',
    autoSlideOff: 'Automatischer Durchlauf pausiert',
    originBadge: 'Herkunft: Ägypten (Klasse I)',
    seasonLabel: 'Exportsaison & Hochsaison:',
    varietiesLabel: 'Verfügbare Sorten:',
    moqLabel: 'Mindestbestellmenge (MOQ):',
    packagingLabel: 'Verpackungsoptionen:',
    storageLabel: 'Kühlkette & Lagerung:',
    specsBtn: 'Spezifikationen',
    rfqBtn: 'Sofortangebot anfordern (RFQ)',
    detailsBtn: 'Details & Exportlieferungen',
    viewDetails: 'Produktdetails',
    viewDetailsAndShipments: 'Vollständige Details & Lieferhistorie ansehen',
    certifiedQuality: 'EU-MRL & CAPQ-zertifiziert',
    allCrops: 'Alle Produkte',
    totalCropsPill: (count) => `Aktive Produkte: ${count} Kulturen`,
    searchPlaceholder: 'Kulturen oder Sorten suchen...',
    filterAll: 'Alle Exportkulturen',
    filterSweetPotatoes: 'Süßkartoffeln',
    filterPotatoes: 'Speise- und Industriekartoffeln',
    viewGridMode: 'Rasteransicht',
    viewSliderMode: 'Slider-Ansicht',
    cropsFound: (count) => `${count} passende Produkte gefunden`,
    browseAllPageBtn: 'Vollständigen Produktkatalog durchsuchen'
  },
  ru: {
    badge: 'Свежая египетская сельхозпродукция',
    title: 'Каталог сертифицированной агропродукции на экспорт',
    subtitle: 'Отборные египетские культуры, прошедшие мойку, термообработку и калибровку по мировым стандартам.',
    autoSlideOn: 'Автопрокрутка включена',
    autoSlideOff: 'Автопрокрутка на паузе',
    originBadge: 'Происхождение: Египет (1 сорт)',
    seasonLabel: 'Экспортный сезон и пик:',
    varietiesLabel: 'Экспортные сорта:',
    moqLabel: 'Мин. заказ (MOQ):',
    packagingLabel: 'Упаковка и фасовка:',
    storageLabel: 'Холодовая цепь:',
    specsBtn: 'Спецификация',
    rfqBtn: 'Запросить расчет (RFQ)',
    detailsBtn: 'Паспорт культуры и поставки',
    viewDetails: 'Паспорт культуры',
    viewDetailsAndShipments: 'Подробное описание и история поставок',
    certifiedQuality: 'Сертификация ЕС и CAPQ',
    allCrops: 'Все культуры',
    totalCropsPill: (count) => `Активные культуры: ${count} наименования`,
    searchPlaceholder: 'Поиск культуры или сорта...',
    filterAll: 'Все экспортные культуры',
    filterSweetPotatoes: 'Батат (Сладкий картофель)',
    filterPotatoes: 'Картофель столовый и промышленный',
    viewGridMode: 'Сетка каталога',
    viewSliderMode: 'Интерактивный слайдер',
    cropsFound: (count) => `Найдено ${count} культур`,
    browseAllPageBtn: 'Открыть полный каталог продукции'
  }
};

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onOpenSpecSheet,
  onOpenRFQ,
  lang = 'ar',
  isDedicatedPage = false
}) => {
  const safeLang = (lang || 'ar') as Language;
  const isRtl = safeLang === 'ar';
  const catTxt = CATALOG_TEXTS[safeLang] || CATALOG_TEXTS.ar;

  const getProductTempBadge = (product: Product): string => {
    if (product.storageConditions) {
      const match = product.storageConditions.match(/([+-]?\d+(?:\.\d+)?°C(?:\s*to\s*[+-]?\d+(?:\.\d+)?°C)?)/i);
      if (match) return match[1];
    }
    const tempDetail = product.specificationSheet?.details?.find(d => 
      d.label.toLowerCase().includes('temp') || d.label.includes('حرارة') || d.label.toLowerCase().includes('control')
    );
    if (tempDetail) {
      const match = tempDetail.value.match(/([+-]?\d+(?:\.\d+)?°C(?:\s*to\s*[+-]?\d+(?:\.\d+)?°C)?)/i);
      if (match) return match[1];
      return tempDetail.value;
    }
    return product.slug.includes('sweet') ? '+13.5°C' : '0.0°C';
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'sweet-potatoes' | 'potatoes'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'slider'>(isDedicatedPage ? 'grid' : 'slider');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Ensure non-empty products list
  const safeProductsList = (products && products.length > 0) ? products : initialProducts;

  // Map products with localized data
  const localizedProducts = safeProductsList.map((p) => ({
    original: p,
    localized: getLocalizedProduct(p, safeLang)
  }));

  // Filter products based on search query and category filter
  const filteredProducts = localizedProducts.filter(({ original, localized }) => {
    const q = searchQuery.toLowerCase().trim();

    if (q.length > 0) {
      const pSlug = (original.slug || '').toLowerCase();
      const pName = (localized.name || '').toLowerCase();
      const originalName = (original.name || '').toLowerCase();
      const desc = (localized.shortDescription || '').toLowerCase();
      const varietiesLoc = (localized.varieties || []).join(' ').toLowerCase();
      const varietiesOrig = (original.varieties || []).join(' ').toLowerCase();
      const grades = (localized.grades || []).join(' ').toLowerCase();
      const sizes = (localized.sizes || []).join(' ').toLowerCase();
      const hsCode = (original.hsCode || '').toLowerCase();
      const origin = (localized.origin || '').toLowerCase();

      // Check if all tokens match across any of the product fields
      const tokens = q.split(/\s+/).filter(Boolean);
      const matchesSearch = tokens.every((token) =>
        pName.includes(token) ||
        originalName.includes(token) ||
        pSlug.includes(token) ||
        desc.includes(token) ||
        varietiesLoc.includes(token) ||
        varietiesOrig.includes(token) ||
        grades.includes(token) ||
        sizes.includes(token) ||
        hsCode.includes(token) ||
        origin.includes(token)
      );

      if (!matchesSearch) return false;
    }

    if (activeFilter === 'sweet-potatoes') {
      return (original.slug || '').includes('sweet') || (localized.name || '').includes('بطاطا');
    }
    if (activeFilter === 'potatoes') {
      return (original.slug || '').includes('potatoes') || (localized.name || '').includes('بطاطس');
    }
    return true;
  });

  const fallbackItem = localizedProducts[0] || {
    original: initialProducts[0],
    localized: getLocalizedProduct(initialProducts[0], safeLang)
  };

  const activeItem = filteredProducts[currentIndex] || filteredProducts[0] || fallbackItem;
  const activeProduct = activeItem.localized;
  const originalProduct = activeItem.original;

  // Auto-slide effect for slider mode
  useEffect(() => {
    if (viewMode === 'slider' && isPlaying && !isHovered && filteredProducts.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
      }, 4500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [viewMode, isPlaying, isHovered, filteredProducts.length]);

  const handleNext = () => {
    if (filteredProducts.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
    }
  };

  const handlePrev = () => {
    if (filteredProducts.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
    }
  };

  const activeImage = activeProduct.heroImage || (activeProduct.images && activeProduct.images.length > 0 ? activeProduct.images[0] : '');

  return (
    <section 
      className={`py-10 sm:py-14 bg-slate-50 text-slate-900 overflow-hidden ${isDedicatedPage ? 'pt-28 min-h-screen' : ''}`} 
      id="products" 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#0F2133] text-[#C5A059] px-3.5 py-1 rounded-full text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{catTxt.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-[#0F2133] tracking-tight">
              {catTxt.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {catTxt.subtitle}
            </p>
          </div>

          {/* Controls Header (Search / Filter / View Toggle) */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-[#0F2133] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{catTxt.viewGridMode}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('slider')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'slider' 
                    ? 'bg-[#0F2133] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{catTxt.viewSliderMode}</span>
              </button>
            </div>

            {/* If in slider mode: Auto-slide Play/Pause & Prev/Next */}
            {viewMode === 'slider' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? catTxt.autoSlideOff : catTxt.autoSlideOn}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-2xs cursor-pointer ${
                    isPlaying 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                      : 'bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 fill-current" />
                      <span className="hidden sm:inline">{catTxt.autoSlideOn}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span className="hidden sm:inline">{catTxt.autoSlideOff}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="w-8 h-8 rounded-full bg-white hover:bg-[#0F2133] hover:text-white text-slate-700 border border-slate-300 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                    aria-label="Previous product"
                  >
                    {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </button>

                  <span className="text-xs font-mono font-bold text-slate-600 px-1">
                    {currentIndex + 1} / {filteredProducts.length}
                  </span>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-8 h-8 rounded-full bg-white hover:bg-[#0F2133] hover:text-white text-slate-700 border border-slate-300 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                    aria-label="Next product"
                  >
                    {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => { setActiveFilter('all'); setCurrentIndex(0); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#0F2133] text-[#C5A059] shadow-xs ring-2 ring-[#C5A059]/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {catTxt.filterAll}
            </button>

            <button
              type="button"
              onClick={() => { setActiveFilter('sweet-potatoes'); setCurrentIndex(0); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeFilter === 'sweet-potatoes'
                  ? 'bg-[#0F2133] text-[#C5A059] shadow-xs ring-2 ring-[#C5A059]/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {catTxt.filterSweetPotatoes}
            </button>

            <button
              type="button"
              onClick={() => { setActiveFilter('potatoes'); setCurrentIndex(0); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeFilter === 'potatoes'
                  ? 'bg-[#0F2133] text-[#C5A059] shadow-xs ring-2 ring-[#C5A059]/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {catTxt.filterPotatoes}
            </button>
          </div>

          {/* Search Input with Instant Dropdown */}
          <div className="relative w-full sm:w-80" ref={searchContainerRef}>
            <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none z-10 ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                setCurrentIndex(0);
                if (val.trim().length >= 1) {
                  setIsDropdownOpen(true);
                } else {
                  setIsDropdownOpen(false);
                }
              }}
              onFocus={() => {
                if (searchQuery.trim().length >= 1) {
                  setIsDropdownOpen(true);
                }
              }}
              placeholder={catTxt.searchPlaceholder}
              className={`w-full bg-slate-50 border border-slate-200 rounded-full py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#C5A059] focus:bg-white focus:ring-2 focus:ring-[#C5A059]/20 transition-all ${
                isRtl ? 'pr-9 pl-8' : 'pl-9 pr-8'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsDropdownOpen(false);
                }}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer transition-colors ${
                  isRtl ? 'left-2.5' : 'right-2.5'
                }`}
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Instant Floating Search Suggestions Dropdown */}
            {isDropdownOpen && searchQuery.trim().length >= 1 && (
              <div className={`absolute top-full mt-2 z-50 w-full sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-fade-in ${
                isRtl ? 'right-0' : 'left-0'
              }`}>
                <div className="p-2.5 bg-[#0F2133] text-[#C5A059] text-[11px] font-black flex items-center justify-between border-b border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{isRtl ? 'نتائج المطابقة الفورية' : 'Instant Search Matches'} ({filteredProducts.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 font-medium">
                    {isRtl ? 'لا توجد نتائج تطابق بحثك حالياً.' : 'No matching products found.'}
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {filteredProducts.map(({ original, localized }) => {
                      const thumb = localized.images?.[0] || localized.heroImage || '';
                      return (
                        <button
                          key={original.id}
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onSelectProduct(original);
                          }}
                          className="w-full p-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-right cursor-pointer group"
                        >
                          <img
                            src={thumb}
                            alt={localized.name}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0 text-start">
                            <div className="text-xs font-black text-[#0F2133] group-hover:text-[#C5A059] transition-colors truncate">
                              {localized.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                              <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                {localized.season?.startMonth || ''} {localized.season?.endMonth ? `- ${localized.season.endMonth}` : ''}
                              </span>
                              <span className="text-[#C5A059] font-medium truncate">
                                {localized.varieties?.slice(0, 2).join(', ')}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-[#C5A059] shrink-0 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Empty State when no matching crops found */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 bg-amber-50 text-[#C5A059] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {isRtl ? 'لم يتم العثور على محاصيل مطابقة' : 'No matching crops found'}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {isRtl ? 'جرب البحث بكلمات أخرى أو قم بإعادة ضبط الفلاتر لاستعراض جميع المحاصيل الزراعية المتاحة.' : 'Try different keywords or reset filters to explore all available fresh crops.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                setCurrentIndex(0);
              }}
              className="inline-flex items-center gap-2 bg-[#0F2133] hover:bg-[#1a3654] text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-md cursor-pointer"
            >
              <span>{isRtl ? 'إعادة ضبط البحث وعرض كل المحاصيل' : 'Reset search & show all crops'}</span>
            </button>
          </div>
        ) : (
          <>
            {/* 1. GRID VIEW MODE: Full Actual Products Grid (المنتجات الفعلية) */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProducts.map(({ original, localized }) => {
              const mainImg = localized.images && localized.images.length > 0 ? localized.images[0] : (localized.heroImage || '');
              return (
                <div 
                  key={original.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Crop Image Container */}
                    <div 
                      className="relative h-64 sm:h-72 overflow-hidden bg-slate-950 cursor-pointer"
                      onClick={() => onSelectProduct(original)}
                    >
                      <img
                        src={mainImg}
                        alt={localized.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                        <span className="bg-[#0F2133]/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-md flex items-center gap-1.5 border border-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{catTxt.originBadge}</span>
                        </span>

                        <span className="bg-[#C5A059] text-white text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{localized.season?.startMonth || ''} {localized.season?.endMonth ? `- ${localized.season.endMonth}` : ''}</span>
                        </span>
                      </div>

                      {/* Bottom Image Info */}
                      <div className="absolute bottom-4 left-4 right-4 text-white space-y-1 z-10">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059]">
                          <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{(localized.grades || []).join(' • ')}</span>
                          </span>
                          <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs text-[#C5A059]">
                            <Thermometer className="w-3.5 h-3.5" />
                            <span>{getProductTempBadge(original)}</span>
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-snug drop-shadow-md">
                          {localized.name}
                        </h3>
                      </div>
                    </div>

                    {/* Content & Specifications */}
                    <div className="p-6 space-y-4">
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-2">
                        {localized.shortDescription}
                      </p>

                      {/* Varieties Badges */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/90 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          {catTxt.varietiesLabel}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(localized.varieties || []).map((v, i) => (
                            <span key={i} className="bg-white text-[#0F2133] text-xs font-bold px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Key Export Specs */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/90">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {catTxt.moqLabel}
                          </span>
                          <span className="text-xs font-black text-[#C5A059] block mt-0.5 truncate">
                            {localized.MOQ}
                          </span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/90">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {catTxt.packagingLabel}
                          </span>
                          <span className="text-xs font-bold text-slate-800 block mt-0.5 truncate">
                            {localized.packagingOptions[0] || 'Cartons / Bags'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-6 pt-0 space-y-2">
                    {/* Primary Button: View Full Product Page & Shipments */}
                    <button
                      type="button"
                      onClick={() => onSelectProduct(original)}
                      className="w-full bg-[#0F2133] hover:bg-[#1a334d] text-white font-black text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      <Ship className="w-4 h-4 text-[#C5A059]" />
                      <span>{catTxt.viewDetailsAndShipments}</span>
                      <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenSpecSheet(original)}
                        className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span className="truncate">{catTxt.specsBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenRFQ(localized.name)}
                        className="bg-[#C5A059] hover:bg-[#b08d4a] text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <span className="truncate">{catTxt.rfqBtn}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* 2. SLIDER VIEW MODE: Auto-scrolling Showcase Card */}
        {viewMode === 'slider' && (
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
              
              {/* Left/Main Product Photo Showcase */}
              <div 
                className="lg:col-span-7 relative h-64 sm:h-80 md:h-[380px] overflow-hidden bg-slate-950 cursor-pointer"
                onClick={() => onSelectProduct(originalProduct)}
              >
                <img
                  key={activeProduct.id}
                  src={activeImage}
                  alt={activeProduct.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out animate-fade-in"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>

                <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10">
                  <span className="bg-[#0F2133]/90 text-white text-xs font-bold px-3.5 py-1 rounded-full backdrop-blur-md shadow-md flex items-center gap-1.5 border border-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{catTxt.originBadge}</span>
                  </span>
                  
                  <span className="bg-[#C5A059] text-white text-xs font-black px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeProduct.season?.startMonth || ''} {activeProduct.season?.endMonth ? `- ${activeProduct.season.endMonth}` : ''}</span>
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5 z-10">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#C5A059]">
                    <span className="flex items-center gap-1.5 bg-black/50 px-2.5 py-0.5 rounded-md backdrop-blur-xs text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{catTxt.certifiedQuality}</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/50 px-2.5 py-0.5 rounded-md backdrop-blur-xs text-[#C5A059]">
                      <Thermometer className="w-3.5 h-3.5" />
                      <span>{getProductTempBadge(originalProduct)}</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-black text-white leading-snug drop-shadow-md">
                    {activeProduct.name}
                  </h3>
                </div>
              </div>

              {/* Right Side Compact Specifications & Action Card */}
              <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-slate-50/50">
                
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed line-clamp-3">
                    {activeProduct.shortDescription}
                  </p>
                </div>

                {/* Key Specs Grid */}
                <div className="space-y-2.5">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      {catTxt.varietiesLabel}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(activeProduct.varieties || []).map((v, i) => (
                        <span key={i} className="bg-slate-100 text-[#0F2133] text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-slate-200">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {catTxt.moqLabel}
                      </span>
                      <span className="text-xs font-black text-[#C5A059] block mt-0.5 truncate">
                        {activeProduct.MOQ}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {catTxt.packagingLabel}
                      </span>
                      <span className="text-xs font-bold text-slate-800 block mt-0.5 truncate">
                        {activeProduct.packagingOptions[0] || 'Carton & Mesh Bags'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Grid */}
                <div className="space-y-2 pt-1 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(originalProduct)}
                    className="w-full bg-[#0F2133] hover:bg-[#1a334d] text-white font-black text-xs py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Ship className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{catTxt.viewDetailsAndShipments}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenSpecSheet(originalProduct)}
                      className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="truncate">{catTxt.specsBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenRFQ(activeProduct.name)}
                      className="bg-[#C5A059] hover:bg-[#b08d4a] text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span className="truncate">{catTxt.rfqBtn}</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Quick Select Crop Bar at the Bottom */}
            <div className="bg-slate-100/90 border-t border-slate-200/80 px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-2">
                {filteredProducts.map(({ original, localized }, idx) => (
                  <button
                    key={original.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      idx === currentIndex
                        ? 'bg-[#0F2133] text-[#C5A059] shadow-sm ring-2 ring-[#C5A059]/40'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                    <span className="max-w-[180px] sm:max-w-none truncate">{localized.name}</span>
                  </button>
                ))}
              </div>

              <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-slate-500 shrink-0">
                <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{catTxt.totalCropsPill(localizedProducts.length)}</span>
              </div>
            </div>
          </div>
        )}
        </>
      )}

      </div>
    </section>
  );
};
