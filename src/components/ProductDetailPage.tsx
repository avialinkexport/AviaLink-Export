import React, { useState, useEffect, useMemo } from 'react';
import { Product, ExportProject } from '../types';
import { 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  Calendar, 
  Box, 
  Thermometer, 
  MapPin, 
  CheckCircle2, 
  Ship, 
  ShieldCheck, 
  Sparkles,
  Award,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Maximize2,
  X
} from 'lucide-react';
import { Language, LANGUAGES, getLocalizedProject, getLocalizedProduct, parseMonthIndex } from '../lib/i18n';
import { initialExportProjects } from '../data/portfolioData';
import { initialProducts } from '../data/products';
import { fetchPortfolio } from '../lib/api';

interface ProductDetailPageProps {
  product?: Product | null;
  onBack: () => void;
  onOpenSpecSheet: (product: Product) => void;
  onOpenRFQ: (productName: string) => void;
  lang?: Language;
}

const DETAIL_TEXTS: Record<Language, {
  backToCatalog: string;
  exportSpecBadge: string;
  btnRfq: string;
  btnSpecSheet: string;
  paramsTitle: string;
  cultivatedVarieties: string;
  exportGradeClass: string;
  availableSizes: string;
  moqLabel: string;
  hsCodeLabel: string;
  seasonalityTitle: string;
  exportSeasonLabel: string;
  packagingTitle: string;
  loadingMethodLabel: string;
  storageTitle: string;
  phytoCertLabel: string;
  peakLabel: string;
  activeLabel: string;
  months: string[];
  shipmentsTitle: string;
  shipmentsSubtitle: string;
  volumeTonnage: string;
  containersCount: string;
  destinationPort: string;
  phytosanitaryClearance: string;
  specsAndHandling: string;
  importerReview: string;
  requestSimilarShipment: string;
  noShipmentsYet: string;
  bannerCtaTitle: string;
  bannerCtaDesc: string;
  bannerCtaBtn: string;
}> = {
  ar: {
    backToCatalog: 'العودة لكتالوج المنتجات',
    exportSpecBadge: 'المواصفات الفنية للتصدير المصري المعتمد',
    btnRfq: 'طلب تسعير الشحنة (RFQ)',
    btnSpecSheet: 'بطاقة المواصفات الفنية (PDF)',
    paramsTitle: 'معايير الجودة والفرز التصديري',
    cultivatedVarieties: 'الأصناف المزروعة المتاحة:',
    exportGradeClass: 'رتبة وفرز التصدير:',
    availableSizes: 'الأحجام والأقطار المتاحة:',
    moqLabel: 'الحد الأدنى للطلب (MOQ):',
    hsCodeLabel: 'بند التعريفة الجمركية (HS Code):',
    seasonalityTitle: 'جدول مواسم الحصاد والتصدير والذروة',
    exportSeasonLabel: 'موسم التصدير المصري:',
    packagingTitle: 'التعبئة ومواصفات شحن الحاويات',
    loadingMethodLabel: 'طريقة التحميل والشحن:',
    storageTitle: 'بروتوكول التخزين وسلسلة التبريد المعتمدة',
    phytoCertLabel: 'شهادات الحجر الزراعي والرقابة:',
    peakLabel: 'ذروة',
    activeLabel: 'متاح',
    months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    shipmentsTitle: 'سابقة الأعمال والشحنات التصديرية لهذا المحصول',
    shipmentsSubtitle: 'سجل حافل بالشحنات الناجحة والحاويات المبردة المصدرة إلى كبرى الموانئ العالمية وفق أدق معايير الحجر الزراعي وسلاسل التبريد.',
    volumeTonnage: 'إجمالي الشحنة:',
    containersCount: 'عدد الحاويات المبردة:',
    destinationPort: 'ميناء الوصول والوجهة:',
    phytosanitaryClearance: 'شهادات الحجر والفحص:',
    specsAndHandling: 'المواصفات والتحكم الحراري:',
    importerReview: 'تقييم المستورد وجهة الاستلام:',
    requestSimilarShipment: 'طلب شحنة مماثلة الآن (RFQ)',
    noShipmentsYet: 'يتم تجهيز شحنات الموسم الحالي 2026 لهذا المحصول.',
    bannerCtaTitle: 'جاهزون لبدء تصدير شحنتك وفق أعلى معايير الجودة العالمية',
    bannerCtaDesc: 'تواصل مع فريق التصدير والعمليات في أفيا لينك لتأكيد جدول الإبحار والأسعار التنافسية للحاويات.',
    bannerCtaBtn: 'طلب عرض سعر فوري وتأكيد الحاويات (RFQ)'
  },
  en: {
    backToCatalog: 'Back to Products Catalog',
    exportSpecBadge: 'Certified Egyptian Export Specification',
    btnRfq: 'Request Quotation (RFQ)',
    btnSpecSheet: 'Technical Spec Sheet (PDF)',
    paramsTitle: 'Export Parameters & Grading Standards',
    cultivatedVarieties: 'Available Cultivated Varieties:',
    exportGradeClass: 'Export Grade Class:',
    availableSizes: 'Available Sizes & Calibers:',
    moqLabel: 'Minimum Order Quantity (MOQ):',
    hsCodeLabel: 'Customs Tariff (HS Code):',
    seasonalityTitle: 'Harvest, Export & Peak Seasonality Calendar',
    exportSeasonLabel: 'Egypt Export Season:',
    packagingTitle: 'Packaging & Container Loading Specifications',
    loadingMethodLabel: 'Loading & Shipping Method:',
    storageTitle: 'Storage & Certified Cold-Chain Protocol',
    phytoCertLabel: 'Phytosanitary & Audit Certifications:',
    peakLabel: 'PEAK',
    activeLabel: 'In Season',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    shipmentsTitle: 'Export Shipments & Case Studies for this Crop',
    shipmentsSubtitle: 'Proven track record of reefer container shipments delivered to global seaports under strict phytosanitary audits.',
    volumeTonnage: 'Total Cargo Volume:',
    containersCount: 'Reefer Containers:',
    destinationPort: 'Destination Port & Region:',
    phytosanitaryClearance: 'Phytosanitary & Lab Audit:',
    specsAndHandling: 'Specs & Cold Treatment:',
    importerReview: 'Importer & Distribution Feedback:',
    requestSimilarShipment: 'Request Similar Shipment (RFQ)',
    noShipmentsYet: 'Current 2026 season shipments are currently in scheduling.',
    bannerCtaTitle: 'Ready to Contract Your Fresh Cargo Under International Standards?',
    bannerCtaDesc: 'Get in touch with AviaLink export operations for live container freight rates, voyage schedules, and seasonal booking.',
    bannerCtaBtn: 'Request Export Quotation (RFQ)'
  },
  fr: {
    backToCatalog: 'Retour au catalogue des produits',
    exportSpecBadge: 'Spécification certifiée d’exportation égyptienne',
    btnRfq: 'Demander un devis (RFQ)',
    btnSpecSheet: 'Fiche technique (PDF)',
    paramsTitle: 'Paramètres d’exportation et calibrage',
    cultivatedVarieties: 'Variétés cultivées disponibles :',
    exportGradeClass: 'Classe de qualité export :',
    availableSizes: 'Calibres disponibles :',
    moqLabel: 'Commande minimale (MOQ) :',
    hsCodeLabel: 'Code douanier (Code SH) :',
    seasonalityTitle: 'Calendrier de récolte et d’exportation',
    exportSeasonLabel: 'Saison d’exportation d’Égypte :',
    packagingTitle: 'Conditionnement et chargement conteneurs',
    loadingMethodLabel: 'Méthode de chargement :',
    storageTitle: 'Protocole de stockage et chaîne du froid',
    phytoCertLabel: 'Certifications phytosanitaires :',
    peakLabel: 'PIC',
    activeLabel: 'Disponible',
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    shipmentsTitle: 'Expéditions et historique d’exportation pour cette culture',
    shipmentsSubtitle: 'Historique vérifié de conteneurs frigorifiques expédiés vers les grands ports mondiaux avec contrôle phytosanitaire.',
    volumeTonnage: 'Volume total :',
    containersCount: 'Conteneurs reefer :',
    destinationPort: 'Port de déchargement :',
    phytosanitaryClearance: 'Contrôle phytosanitaire :',
    specsAndHandling: 'Spécifications et froid :',
    importerReview: 'Avis de l’importateur :',
    requestSimilarShipment: 'Demander une expédition similaire (RFQ)',
    noShipmentsYet: 'Les expéditions de la saison 2026 sont en cours de préparation.',
    bannerCtaTitle: 'Prêt à contractualiser vos expéditions selon les normes internationales ?',
    bannerCtaDesc: 'Contactez le bureau commercial AviaLink pour les disponibilités de conteneurs et les plannings de départ.',
    bannerCtaBtn: 'Demander un devis d’exportation (RFQ)'
  },
  es: {
    backToCatalog: 'Volver al catálogo de productos',
    exportSpecBadge: 'Especificación certificada de exportación egipcia',
    btnRfq: 'Solicitar cotización (RFQ)',
    btnSpecSheet: 'Ficha técnica (PDF)',
    paramsTitle: 'Parámetros de exportación y clasificación',
    cultivatedVarieties: 'Variedades cultivadas disponibles:',
    exportGradeClass: 'Grado de calidad de exportación:',
    availableSizes: 'Calibres y tamaños disponibles:',
    moqLabel: 'Pedido mínimo (MOQ):',
    hsCodeLabel: 'Código arancelario (Código SA):',
    seasonalityTitle: 'Calendario de cosecha y temporada de exportación',
    exportSeasonLabel: 'Temporada de exportación de Egipto:',
    packagingTitle: 'Empaque y especificaciones de carga',
    loadingMethodLabel: 'Método de carga y transporte:',
    storageTitle: 'Protocolo de almacenamiento y cadena de frío',
    phytoCertLabel: 'Certificaciones fitosanitarias:',
    peakLabel: 'PICO',
    activeLabel: 'Disponible',
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    shipmentsTitle: 'Envíos completados y casos de éxito de este cultivo',
    shipmentsSubtitle: 'Historial comprobado de contenedores reefer exportados a los principales puertos marítimos con control fitosanitario.',
    volumeTonnage: 'Volumen total:',
    containersCount: 'Contenedores reefer:',
    destinationPort: 'Puerto de destino:',
    phytosanitaryClearance: 'Inspección fitosanitaria:',
    specsAndHandling: 'Especificaciones térmicas:',
    importerReview: 'Evaluación del importador:',
    requestSimilarShipment: 'Solicitar envío similar (RFQ)',
    noShipmentsYet: 'Los envíos de la temporada 2026 están en preparación.',
    bannerCtaTitle: '¿Listo para contratar su carga agrícola con los más altos estándares?',
    bannerCtaDesc: 'Comuníquese con el equipo de exportación de AviaLink para cotizaciones de flete y reserva de contenedores.',
    bannerCtaBtn: 'Solicitar cotización oficial (RFQ)'
  },
  de: {
    backToCatalog: 'Zurück zum Produktkatalog',
    exportSpecBadge: 'Zertifizierte ägyptische Exportspezifikation',
    btnRfq: 'Angebot anfordern (RFQ)',
    btnSpecSheet: 'Technisches Datenblatt (PDF)',
    paramsTitle: 'Exportparameter und Güteklassen',
    cultivatedVarieties: 'Verfügbare Anbausorten:',
    exportGradeClass: 'Exportgüteklasse:',
    availableSizes: 'Verfügbare Kaliber & Größen:',
    moqLabel: 'Mindestbestellmenge (MOQ):',
    hsCodeLabel: 'Zolltarifnummer (HS-Code):',
    seasonalityTitle: 'Ernte- und Exportsaison-Kalender',
    exportSeasonLabel: 'Ägyptische Exportsaison:',
    packagingTitle: 'Verpackung & Containerbeladung',
    loadingMethodLabel: 'Lademethode & Transport:',
    storageTitle: 'Lagerung & zertifiziertes Kühlketten-Protokoll',
    phytoCertLabel: 'Pflanzenschutzzertifikate:',
    peakLabel: 'SPITZE',
    activeLabel: 'Saison',
    months: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    shipmentsTitle: 'Export-Lieferungen & Projektreferenzen für dieses Produkt',
    shipmentsSubtitle: 'Erfolgreich abgewickelte Kühlcontainer-Lieferungen in europäische und weltweite Häfen unter strenger Pflanzenschutzkontrolle.',
    volumeTonnage: 'Gesamtvolumen:',
    containersCount: 'Kühlcontainer:',
    destinationPort: 'Bestimmungshafen & Land:',
    phytosanitaryClearance: 'Pflanzenschutzprüfung:',
    specsAndHandling: 'Spezifikationen & Kühlung:',
    importerReview: 'Bewertung des Importeurs:',
    requestSimilarShipment: 'Ähnliche Lieferung anfragen (RFQ)',
    noShipmentsYet: 'Lieferungen der aktuellen Saison 2026 sind in Planung.',
    bannerCtaTitle: 'Bereit für planungssichere Agrarlieferungen nach internationalen Standards?',
    bannerCtaDesc: 'Kontaktieren Sie das AviaLink-Exportteam für Containerfrachtraten, Fahrpläne und Saisonreservierungen.',
    bannerCtaBtn: 'Offizielles Angebot anfordern (RFQ)'
  },
  ru: {
    backToCatalog: 'Назад в каталог продукции',
    exportSpecBadge: 'Сертифицированная спецификация экспорта Египта',
    btnRfq: 'Запросить расчет (RFQ)',
    btnSpecSheet: 'Технический паспорт (PDF)',
    paramsTitle: 'Параметры качества и экспортная калибровка',
    cultivatedVarieties: 'Выращиваемые сорта в наличии:',
    exportGradeClass: 'Экспортный сорт:',
    availableSizes: 'Доступные калибры и размеры:',
    moqLabel: 'Мин. партия (MOQ):',
    hsCodeLabel: 'Код ТН ВЭД (HS Code):',
    seasonalityTitle: 'Календарь сбора урожая и экспортного сезона',
    exportSeasonLabel: 'Экспортный сезон из Египта:',
    packagingTitle: 'Упаковка и загрузка контейнеров',
    loadingMethodLabel: 'Метод погрузки и доставки:',
    storageTitle: 'Протокол хранения и холодовой цепи',
    phytoCertLabel: 'Фитосанитарные сертификаты:',
    peakLabel: 'ПИК',
    activeLabel: 'Сезон',
    months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    shipmentsTitle: 'История поставок и экспортные кейсы по данной культуре',
    shipmentsSubtitle: 'Успешный опыт доставки рефрижераторных контейнеров в ключевые мировые порты с полным фитосанитарным контролем.',
    volumeTonnage: 'Общий объем партии:',
    containersCount: 'Рефконтейнеры:',
    destinationPort: 'Порт выгрузки и страна:',
    phytosanitaryClearance: 'Фитосанитарный контроль:',
    specsAndHandling: 'Спецификации и температура:',
    importerReview: 'Отзыв компании-импортера:',
    requestSimilarShipment: 'Запросить аналогичную поставку (RFQ)',
    noShipmentsYet: 'Поставки сезона 2026 года формируются согласно графику.',
    bannerCtaTitle: 'Готовы заключить экспортный контракт по мировым стандартам качества?',
    bannerCtaDesc: 'Свяжитесь с отделом экспорта AviaLink для бронирования контейнеров и согласования ставок фрахта.',
    bannerCtaBtn: 'Запросить официальный расчет (RFQ)'
  }
};

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product: rawProduct,
  onBack,
  onOpenSpecSheet,
  onOpenRFQ,
  lang = 'ar'
}) => {
  const safeProduct = rawProduct || initialProducts[0];
  const product = getLocalizedProduct(safeProduct, lang);

  // Collect all product images without duplicates, preserving uploaded images from admin/database
  const galleryImages = useMemo(() => {
    const list: string[] = [];
    const addUnique = (url?: string) => {
      if (url && typeof url === 'string' && url.trim().length > 0 && !list.includes(url.trim())) {
        list.push(url.trim());
      }
    };

    if (rawProduct?.heroImage) addUnique(rawProduct.heroImage);
    if (Array.isArray(rawProduct?.images)) {
      rawProduct.images.forEach(addUnique);
    }
    if (product?.heroImage) addUnique(product.heroImage);
    if (Array.isArray(product?.images)) {
      product.images.forEach(addUnique);
    }

    return list.length > 0 ? list : ['/crops/sweet_potatoes.jpg'];
  }, [rawProduct?.heroImage, rawProduct?.images, product?.heroImage, product?.images]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  const [allProjects, setAllProjects] = useState<ExportProject[]>(initialExportProjects);
  const [projectImageIndexes, setProjectImageIndexes] = useState<Record<string, number>>({});
  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const isRtl = currentLangObj.dir === 'rtl';
  const tD = DETAIL_TEXTS[lang] || DETAIL_TEXTS.ar;

  // Reset active image index when switching products
  useEffect(() => {
    setActiveImageIndex(0);
    setIsAutoPlay(true);
  }, [product.slug, product.id]);

  // Keep index within range
  useEffect(() => {
    if (activeImageIndex >= galleryImages.length) {
      setActiveImageIndex(0);
    }
  }, [galleryImages.length, activeImageIndex]);

  // Automatic slide rotation every 3.8s when autoplay is enabled and user is not hovering
  useEffect(() => {
    if (galleryImages.length <= 1 || !isAutoPlay || isHovered) return;

    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [galleryImages.length, isAutoPlay, isHovered]);

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const currentDisplayImage = galleryImages[activeImageIndex] || galleryImages[0];

  useEffect(() => {
    fetchPortfolio().then((data) => {
      if (data && data.length > 0) {
        setAllProjects(data);
      }
    }).catch(console.error);
  }, []);

  const STANDARD_MONTH_KEYS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Filter matching export projects / shipments for this crop ONLY
  const specificProjects = allProjects.filter((proj) => {
    const pSlug = (product.slug || '').toLowerCase();
    const pName = (product.name || '').toLowerCase();

    // 1. Direct match by productSlug if present on project record
    if (proj.productSlug) {
      return proj.productSlug.toLowerCase() === pSlug;
    }

    const projCrop = (proj.cropName || '').toLowerCase();
    const projId = (proj.id || '').toLowerCase();

    // 2. Exact crop slug checking to prevent cross-crop leakage
    if (pSlug === 'sweet-potatoes') {
      return projId.includes('sp') || projCrop.includes('sweet') || projCrop.includes('بطاطا حلوة') || projCrop.includes('beauregard') || projCrop.includes('bellevue');
    }
    if (pSlug === 'potatoes') {
      return (projId.includes('pot') && !projId.includes('sweet')) || projCrop.includes('spunta') || projCrop.includes('hermes') || (projCrop.includes('بطاطس') && !projCrop.includes('حلوة') && !projCrop.includes('مفرزة') && !projCrop.includes('نصف'));
    }
    if (pSlug === 'onions') {
      return projId.includes('oni') || projCrop.includes('onion') || projCrop.includes('بصل');
    }
    if (pSlug === 'carrots') {
      return projId.includes('car') || projCrop.includes('carrot') || projCrop.includes('جزر');
    }
    if (pSlug === 'red-beet') {
      return projId.includes('beet') || projCrop.includes('beet') || projCrop.includes('بنجر') || projCrop.includes('شمندر');
    }
    if (pSlug === 'garlic') {
      return projId.includes('garlic') || projCrop.includes('garlic') || projCrop.includes('ثوم');
    }
    if (pSlug === 'colored-peppers') {
      return projId.includes('pep') || projCrop.includes('pepper') || projCrop.includes('فلفل');
    }

    return projCrop.includes(pSlug) || projCrop.includes(pName);
  });

  // Display ONLY shipments relevant to the selected product (no fallback to unrelated crops)
  const relatedProjects = specificProjects;

  return (
    <div className="pt-24 pb-20 bg-slate-50 text-slate-900 min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Breadcrumb & Back Navigation */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0F2133] hover:text-[#C5A059] bg-white border border-slate-200 px-4 py-2.5 rounded-full transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{tD.backToCatalog}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>{tD.backToCatalog}</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            <span className="text-[#C5A059] font-bold">{product.name}</span>
          </div>
        </div>

        {/* Top Hero Grid: Interactive Image Gallery & Key Product Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Images Gallery (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div 
              className="relative h-72 sm:h-96 md:h-[440px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xl group select-none"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Active Image with smooth crossfade */}
              <img
                key={currentDisplayImage}
                src={currentDisplayImage}
                alt={`${product.name} - Egyptian Fresh Produce Export`}
                fetchPriority="high"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              
              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none"></div>
              
              {/* Top Tags & Controls Bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-20">
                <div className="flex items-center gap-2">
                  <span className="bg-[#0F2133]/90 text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{product.origin}</span>
                  </span>

                  <span className="bg-[#C5A059] text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md">
                    {product.season?.startMonth || ''} {product.season?.endMonth ? `- ${product.season.endMonth}` : ''}
                  </span>
                </div>

                {/* Right Top Controls: Play/Pause and Lightbox */}
                <div className="flex items-center gap-2">
                  {galleryImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setIsAutoPlay(!isAutoPlay)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all shadow-md cursor-pointer"
                      title={isAutoPlay ? (lang === 'ar' ? 'إيقاف التبديل التلقائي مؤقتاً' : 'Pause Slideshow') : (lang === 'ar' ? 'تشغيل التبديل التلقائي' : 'Resume Slideshow')}
                    >
                      {isAutoPlay ? <Pause className="w-3.5 h-3.5 text-amber-300" /> : <Play className="w-3.5 h-3.5 text-emerald-300" />}
                      <span className="text-[11px] hidden sm:inline">
                        {isAutoPlay 
                          ? (lang === 'ar' ? 'تبديل تلقائي' : 'Auto') 
                          : (lang === 'ar' ? 'متوقف' : 'Paused')}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="p-2 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 backdrop-blur-md transition-all shadow-md cursor-pointer"
                    title={lang === 'ar' ? 'تكبير الصورة وفحص الجودة' : 'Fullscreen preview'}
                  >
                    <Maximize2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Prev & Next Arrows (visible when more than 1 image) */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous Image"
                    className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#C5A059] text-white hover:text-black flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-110 cursor-pointer`}
                  >
                    <ChevronLeft className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next Image"
                    className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#C5A059] text-white hover:text-black flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-110 cursor-pointer`}
                  >
                    <ChevronRight className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </>
              )}

              {/* Bottom Info: Title, Grades, Image Counter & Dots */}
              <div className="absolute bottom-4 left-4 right-4 text-white z-20 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{product.grades?.join(' • ') || 'Grade 1 Certified'}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black">{product.name}</h2>
                  </div>

                  {galleryImages.length > 1 && (
                    <span className="bg-black/70 text-white/90 text-xs font-mono font-bold px-3 py-1 rounded-full border border-white/20 backdrop-blur-md shrink-0">
                      {activeImageIndex + 1} / {galleryImages.length}
                    </span>
                  )}
                </div>

                {/* Interactive Dots Bar */}
                {galleryImages.length > 1 && (
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    {galleryImages.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setActiveImageIndex(dotIdx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          activeImageIndex === dotIdx 
                            ? 'w-7 bg-[#C5A059]' 
                            : 'w-2 bg-white/40 hover:bg-white/80'
                        }`}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Selector Strip (Includes all original & newly uploaded images) */}
            {galleryImages.length > 1 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-bold">
                  <span>{lang === 'ar' ? 'معرض صور المحصول والشحنات' : 'Product Photo Gallery'}</span>
                  <span>{lang === 'ar' ? `${galleryImages.length} صور متاحة` : `${galleryImages.length} photos available`}</span>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                  {galleryImages.map((img, idx) => {
                    const isSelected = activeImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-24 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer group ${
                          isSelected 
                            ? 'border-[#C5A059] shadow-lg scale-105 ring-2 ring-[#C5A059]/40' 
                            : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                        }`}
                        title={`${product.name} - صورة ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className={`absolute bottom-1 ${isRtl ? 'right-1' : 'left-1'} px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                          isSelected ? 'bg-[#C5A059] text-black' : 'bg-black/70 text-white'
                        }`}>
                          #{idx + 1}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lightbox Modal for High-Resolution Inspection */}
            {lightboxOpen && (
              <div 
                className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in"
                onClick={() => setLightboxOpen(false)}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer`}
                  title={lang === 'ar' ? 'إغلاق المعاينة المكبرة' : 'Close lightbox'}
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Big Image Display */}
                <div 
                  className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    key={currentDisplayImage}
                    src={currentDisplayImage}
                    alt={product.name}
                    className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
                  />

                  {/* Lightbox Nav Arrows */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        className={`absolute ${isRtl ? 'right-2' : 'left-2'} top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-[#C5A059] text-white hover:text-black transition-all shadow-xl cursor-pointer`}
                      >
                        <ChevronLeft className={`w-8 h-8 ${isRtl ? 'rotate-180' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className={`absolute ${isRtl ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-[#C5A059] text-white hover:text-black transition-all shadow-xl cursor-pointer`}
                      >
                        <ChevronRight className={`w-8 h-8 ${isRtl ? 'rotate-180' : ''}`} />
                      </button>
                    </>
                  )}
                </div>

                {/* Bottom caption in lightbox */}
                <div className="mt-4 text-center text-white space-y-1" onClick={(e) => e.stopPropagation()}>
                  <p className="font-bold text-base">{product.name} - {product.nameEn || ''}</p>
                  <p className="text-xs text-white/60">
                    {activeImageIndex + 1} / {galleryImages.length} • {product.origin}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right / Product Summary & Actions (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-[#C5A059]/15 text-[#b08d4a] px-3.5 py-1 rounded-full text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{tD.exportSpecBadge}</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-[#0F2133]">
                {product.name}
              </h1>

              <p className="text-sm text-slate-600 font-medium leading-relaxed pt-1">
                {product.shortDescription}
              </p>
            </div>

            {/* Key Specifications Table */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3.5 text-xs">
              <h3 className="font-black text-[#0F2133] uppercase tracking-wider text-xs border-b border-slate-100 pb-2.5 flex items-center justify-between">
                <span>{tD.paramsTitle}</span>
                <Award className="w-4 h-4 text-[#C5A059]" />
              </h3>

              <div className="space-y-2.5">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">{tD.cultivatedVarieties}</span>
                  <span className="font-bold text-[#0F2133] text-end">{product.varieties?.join(', ') || ''}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">{tD.exportGradeClass}</span>
                  <span className="font-bold text-[#0F2133] text-end">{product.grades?.join(', ') || ''}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">{tD.availableSizes}</span>
                  <span className="font-bold text-[#0F2133] text-end">{product.sizes?.join(', ') || ''}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">{tD.moqLabel}</span>
                  <span className="font-black text-[#C5A059] text-end">{product.MOQ}</span>
                </div>

                {product.hsCode && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-semibold">{tD.hsCodeLabel}</span>
                    <span className="font-mono font-bold text-slate-800 text-end">{product.hsCode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => onOpenRFQ(product.name)}
                className="w-full bg-[#C5A059] hover:bg-[#b08d4a] text-white font-black py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <span>{tD.btnRfq}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => onOpenSpecSheet(product)}
                className="w-full bg-white hover:bg-slate-100 text-[#0F2133] font-bold py-3.5 px-5 rounded-2xl text-xs border border-slate-300 flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#C5A059]" />
                <span>{tD.btnSpecSheet}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Seasonality Chart Component */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black font-display text-[#0F2133] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C5A059]" />
              <span>{tD.seasonalityTitle}</span>
            </h3>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
              {tD.exportSeasonLabel} <strong className="text-[#C5A059]">{product.season?.startMonth || ''} {product.season?.endMonth ? `- ${product.season.endMonth}` : ''}</strong>
            </span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 text-center text-xs pt-1">
            {(() => {
              const startIdx = parseMonthIndex(product.season?.startMonth || 'January');
              const endIdx = parseMonthIndex(product.season?.endMonth || 'December');
              const peakIndices = (product.season?.peakMonths || [])
                .map((pm) => parseMonthIndex(pm))
                .filter((i) => i !== -1);

              const isInActiveSeason = (mIdx: number) => {
                if (startIdx === -1 || endIdx === -1) return true;
                if (startIdx <= endIdx) {
                  return mIdx >= startIdx && mIdx <= endIdx;
                } else {
                  return mIdx >= startIdx || mIdx <= endIdx;
                }
              };

              return tD.months.map((monthName, idx) => {
                const isPeak = peakIndices.includes(idx);
                const inSeason = isInActiveSeason(idx);

                return (
                  <div key={idx} className="space-y-1">
                    <span className="text-slate-500 text-[11px] font-bold block">{monthName}</span>
                    <div
                      className={`h-12 rounded-xl flex items-center justify-center font-black text-[11px] transition-all px-1 ${
                        isPeak
                          ? 'bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/30 ring-2 ring-[#C5A059]/20'
                          : inSeason
                          ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-500/30'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPeak ? tD.peakLabel : inSeason ? (tD.activeLabel || 'متاح') : '—'}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Detailed Logistics & Storage Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Packaging */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3.5 shadow-xs">
            <h3 className="text-base font-black font-display text-[#0F2133] flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Box className="w-5 h-5 text-[#C5A059]" />
              <span>{tD.packagingTitle}</span>
            </h3>
            <ul className="space-y-2 text-slate-700 font-medium">
              {(product.packagingOptions || []).map((opt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>{opt}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2.5 border-t border-slate-100 text-slate-600">
              <strong className="text-[#0F2133] font-bold">{tD.loadingMethodLabel}</strong> {product.loadingMethod}
            </div>
          </div>

          {/* Storage & Cold Chain */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3.5 shadow-xs">
            <h3 className="text-base font-black font-display text-[#0F2133] flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Thermometer className="w-5 h-5 text-[#C5A059]" />
              <span>{tD.storageTitle}</span>
            </h3>
            <p className="text-slate-700 font-medium leading-relaxed">
              {product.storageConditions}
            </p>
            <div className="pt-2.5 border-t border-slate-100 space-y-1 text-slate-600">
              <div>
                <strong className="text-[#0F2133] font-bold">{tD.phytoCertLabel}</strong>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(product.exportCertificationsAvailable || []).map((cert, idx) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🌟 VITAL: سابقة الأعمال وشحنات التصدير الخاصة بهذا المحصول (Crop-Specific Export Case Studies) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 bg-[#0F2133] text-[#C5A059] px-3.5 py-1 rounded-full text-xs font-bold">
                <Ship className="w-3.5 h-3.5" />
                <span>{tD.shipmentsTitle}</span>
              </div>
              <h2 className="text-2xl font-black font-display text-[#0F2133]">
                {product.name} — {isRtl ? 'سجل الشحنات والعمليات المكتملة' : 'Completed Export Cargo History'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl">
                {tD.shipmentsSubtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenRFQ(product.name)}
              className="bg-[#C5A059] hover:bg-[#b08d4a] text-white font-bold text-xs py-3 px-5 rounded-full shadow-md shadow-[#C5A059]/20 transition-all flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <span>{tD.requestSimilarShipment}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Grid of Completed Crop Shipments */}
          {relatedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjects.map((proj) => {
                const localizedProj = getLocalizedProject(proj, lang);
                const projectImages = Array.isArray(proj.images) && proj.images.length > 0
                  ? proj.images
                  : [proj.image || localizedProj.image].filter(Boolean);
                const activeImgIdx = projectImageIndexes[proj.id] || 0;
                const activeImg = projectImages[activeImgIdx] || proj.image || localizedProj.image;

                return (
                  <div 
                    key={proj.id}
                    className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
                  >
                    <div className="space-y-3">
                      {/* Image & Header */}
                      <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
                        <img
                          src={activeImg}
                          alt={localizedProj.title}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div className="absolute top-3 left-3 bg-[#0F2133]/90 text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 backdrop-blur-xs z-10">
                          {localizedProj.completionDate}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                          <h4 className="font-bold text-sm leading-snug drop-shadow-md">
                            {localizedProj.title}
                          </h4>
                        </div>

                        {/* Interactive Pagination Dots for Card Images */}
                        {projectImages.length > 1 && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 z-10 bg-black/40 px-2 py-1 rounded-full backdrop-blur-xs">
                            {projectImages.map((_, sIdx) => (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setProjectImageIndexes({
                                    ...projectImageIndexes,
                                    [proj.id]: sIdx
                                  });
                                }}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                  sIdx === activeImgIdx
                                    ? 'bg-[#C5A059] scale-125'
                                    : 'bg-white/60 hover:bg-white'
                                }`}
                                aria-label={`Show image ${sIdx + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Shipment Stats Bar */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-slate-400 block text-[10px] font-bold">{tD.volumeTonnage}</span>
                          <span className="font-black text-[#0F2133] text-xs">
                            {proj.volumeTonnes.toLocaleString()} {
                              lang === 'ar' ? 'طن متري' :
                              lang === 'fr' ? 'Tonnes' :
                              lang === 'es' ? 'Toneladas' :
                              lang === 'de' ? 'Tonnen' :
                              lang === 'ru' ? 'Тонн' : 'Metric Tons'
                            }
                          </span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-slate-400 block text-[10px] font-bold">{tD.containersCount}</span>
                          <span className="font-black text-[#C5A059] text-xs">
                            {proj.containerCount} {
                              lang === 'ar' ? 'حاوية مبردة 40 قدم' :
                              lang === 'fr' ? 'Conteneurs 40\' Reefer' :
                              lang === 'es' ? 'Contenedores 40\' Reefer' :
                              lang === 'de' ? '40ft Kühlcontainer' :
                              lang === 'ru' ? '40-фут. рефрижераторы' : '40ft Reefer Containers'
                            }
                          </span>
                        </div>
                      </div>

                      {/* Ports and Audit Details */}
                      <div className="space-y-2 text-xs text-slate-700">
                        <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                          <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-900 block font-bold">{tD.destinationPort}</strong>
                            <span>{localizedProj.destination} ({localizedProj.port})</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-900 block font-bold">{tD.phytosanitaryClearance}</strong>
                            <span>{localizedProj.phytosanitaryStatus}</span>
                          </div>
                        </div>

                        {localizedProj.buyerFeedback && (
                          <div className="bg-emerald-50/70 border border-emerald-200/80 p-3 rounded-xl text-emerald-950 italic text-[11px] leading-relaxed">
                            <span className="font-bold not-italic block text-emerald-900 mb-0.5">{tD.importerReview}:</span>
                            "{localizedProj.buyerFeedback}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Action */}
                    <button
                      type="button"
                      onClick={() => onOpenRFQ(product.name)}
                      className="w-full bg-white hover:bg-[#0F2133] hover:text-white text-[#0F2133] border border-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span>{tD.requestSimilarShipment}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 font-medium text-xs bg-slate-50 rounded-2xl border border-slate-200">
              {tD.noShipmentsYet}
            </div>
          )}
        </div>

        {/* Bottom Comprehensive CTA Banner */}
        <div className="bg-gradient-to-r from-[#0F2133] to-[#1a334d] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-start max-w-2xl">
              <h3 className="text-xl sm:text-2xl font-black font-display text-white">
                {tD.bannerCtaTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                {tD.bannerCtaDesc}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenRFQ(product.name)}
              className="bg-[#C5A059] hover:bg-[#b08d4a] text-white font-black text-xs sm:text-sm py-4 px-8 rounded-full shadow-lg shadow-black/30 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            >
              {tD.bannerCtaBtn}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
