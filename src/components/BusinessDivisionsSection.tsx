import React from 'react';
import { Sprout, Flame, CheckCircle2, ArrowRight, ShieldCheck, Truck, Package, Layers } from 'lucide-react';
import { Language } from '../lib/i18n';

interface BusinessDivisionsSectionProps {
  onNavigateToProducts: () => void;
  onOpenRFQ: (productName?: string) => void;
  lang: Language;
}

const DIVISIONS_TEXTS: Record<Language, {
  badge: string;
  title: string;
  subtitle: string;
  div1Title: string;
  div1Badge: string;
  div1Desc: string;
  div1Crops: string[];
  div2Title: string;
  div2Badge: string;
  div2Desc: string;
  div2Crops: string[];
  chainTitle: string;
  chainSteps: { num: string; title: string; desc: string }[];
  focusTitle: string;
  focusItems: string[];
  ctaBtn: string;
}> = {
  ar: {
    badge: 'قطاعات الأعمال ونطاق التوريد',
    title: 'من المزارع المصرية إلى الأسواق العالمية',
    subtitle: 'حلول تصديرية زراعية شاملة تغطي الحاصلات المصرية الطازجة المتميزة وفق أعلى معايير الجودة وشهادات الاعتماد الدولية.',
    div1Title: 'الحاصلات الزراعية الطازجة المعتمدة',
    div1Badge: '7 محاصيل رئيسية',
    div1Desc: 'منتجات زراعية مصرية متميزة يتم اختيارها وتعبئتها لتلبية متطلبات الأسواق الدولية في أوروبا والخليج وآسيا.',
    div1Crops: [
      'البطاطا الحلوة المتميزة (بيورجارد، بيلفيو، بلدي معالج حرارياً)',
      'البصل الطازج عالي الجفاف (الأحمر، الأبيض، والذهبي)',
      'الجزر المصري المغسول (النانتيس والهيدرو-كولد)',
      'البنجر الأحمر الطازج (الشمندر السكري الغني)',
      'الفلفل الألوان المشكل (أحمر، أصفر، برتقالي)',
      'الثوم المصري الجاف (البلدي الأبيض والبنفسجي الصيني)',
      'البطاطس الطازجة للتصدير والتصنيع (سبونتا، هيرمس، ليدي روزيتا)'
    ],
    div2Title: 'حلول الفرز والتعبئة وتجهيز المحاصيل التصديرية',
    div2Badge: 'قيمة مضافة للمستوردين والشركاء',
    div2Desc: 'بنية تحتية متطورة تشمل محطات الفرز الضوئي والمعالجة الحرارية والتبريد المائي السريع والتعبئة الخاصة.',
    div2Crops: [
      'فرز وتدريج ضوئي ثلاثي الأبعاد بالوزن والحجم والكثافة',
      'غرف معالجة حرارية وعلاج جروح البطاطا (Curing)',
      'خطوط غسيل وتبريد مائي فجائي للجزر والبنجر (Hydro-Cooling)',
      'تعبئة في عبوات خاصة للعملاء والعلامات التجارية (Private Label OEM)'
    ],
    chainTitle: 'مراحل التوريد: من المزرعة إلى الأسواق العالمية',
    chainSteps: [
      { num: '01', title: 'المزرعة', desc: 'زراعة خاضعة للرقابة في أجود الأراضي المصرية' },
      { num: '02', title: 'الاختيار ومراقبة الجودة', desc: 'فحص الحقل ومطابقة معايير المتبقيات MRL' },
      { num: '03', title: 'الفرز والتعبئة', desc: 'معالجة حرارية وغسيل وفرز ضوئي بالوزن' },
      { num: '04', title: 'التخزين واللوجستيات', desc: 'سلسلة تبريد مبردة 24/7 حتى الميناء' },
      { num: '05', title: 'التصدير والإنهاء الجمركي', desc: 'شهادات حجر زراعي CAPQ وتخليص سريع' },
      { num: '06', title: 'الأسواق العالمية', desc: 'تسليم آمن وموثوق لشركائنا في العالم' }
    ],
    focusTitle: 'محاور التميز والجودة لدينا',
    focusItems: [
      'جودة المنتج العالية (Product Quality)',
      'الالتزام بمواصفات العميل (Customer Specifications)',
      'التعبئة والتغليف الاحترافي (Professional Packing)',
      'التوريد المستمر والموثوق (Reliable Supply)',
      'حلول تصدير مرنة ومخصصة (Flexible Export Solutions)'
    ],
    ctaBtn: 'اطلب عرض سعر شحنة الآن (RFQ)'
  },
  en: {
    badge: 'OUR BUSINESS DIVISIONS',
    title: 'From Egyptian Farms to Global Markets',
    subtitle: 'Comprehensive agricultural export solutions covering premium Egyptian fresh produce and value-added export processing.',
    div1Title: 'Certified Fresh Agricultural Produce',
    div1Badge: '7 Core Fresh Crops',
    div1Desc: 'Premium Egyptian produce selected to meet international market requirements across European, Arab and Asian markets.',
    div1Crops: [
      'Premium Cured Sweet Potatoes (Beauregard, Bellevue, Baladi)',
      'High-Dry Matter Fresh Onions (Red, Golden & White Onions)',
      'Egyptian Washed Carrots (Nantes, Hydro-Cooled)',
      'Fresh Table Beetroot (Sweet Deep-Crimson)',
      'Mixed Bell Peppers (Red, Yellow, Orange Greenhouse)',
      'Egyptian Dry Garlic (Baladi White & Purple)',
      'Fresh Table & Processing Potatoes (Spunta, Hermes, Lady Rosetta)'
    ],
    div2Title: 'Advanced Sorting, Optical Sizing & Export Packing',
    div2Badge: 'Value-Added Importer Solutions',
    div2Desc: 'Cutting-edge infrastructure comprising optical grading, automated curing chambers, hydro-cooling, and bespoke packaging.',
    div2Crops: [
      '3D Optical & Weight Sizing and Caliber Calibration',
      'Automated Curing Rooms for Sweet Potatoes Healing',
      'Hydro-Cooling & Washing Corridors for Roots & Carrots',
      'Tailored Export Packing & Private Label Solutions (OEM)'
    ],
    chainTitle: 'Supply Chain: From Farm to Global Markets',
    chainSteps: [
      { num: '01', title: 'Farm', desc: 'Controlled cultivation in fertile Egyptian soils' },
      { num: '02', title: 'Selection & QC', desc: 'Strict field audit and EU MRL compliance checks' },
      { num: '03', title: 'Sorting & Packing', desc: 'Optical grading, washing, curing and packing' },
      { num: '04', title: 'Storage & Logistics', desc: '24/7 reefer cold chain directly to maritime port' },
      { num: '05', title: 'Export Clearance', desc: 'Official CAPQ phytosanitary certification' },
      { num: '06', title: 'Global Markets', desc: 'Safe and timely delivery to international buyers' }
    ],
    focusTitle: 'Core Pillars of Quality',
    focusItems: [
      'Product Quality Assurance',
      'Tailored Customer Specifications',
      'Professional Export Packing',
      'Reliable & Consistent Supply',
      'Flexible Export Solutions'
    ],
    ctaBtn: 'Request Export Quote (RFQ)'
  },
  fr: {
    badge: 'NOS SECTEURS D’ACTIVITÉ',
    title: 'Des fermes égyptiennes aux marchés mondiaux',
    subtitle: 'Solutions complètes d’exportation agricole couvrant les produits frais égyptiens d’excellence.',
    div1Title: 'Produits agricoles frais certifiés',
    div1Badge: '7 cultures principales',
    div1Desc: 'Sélection rigoureuse de légumes et tubercules frais égyptiens répondant aux exigences des marchés internationaux.',
    div1Crops: [
      'Patates douces supérieures (Beauregard, Bellevue, Baladi étuvées)',
      'Oignons frais haute matière sèche (rouges, jaunes et blancs)',
      'Carottes égyptiennes hydro-refroidies (type Nantes)',
      'Betteraves rouges fraîches de table',
      'Poivrons de couleur (rouges, jaunes et oranges)',
      'Ail sec d’Égypte (blanc Baladi et violet)',
      'Pommes de terre fraîches de consommation et industrie (Spunta, Hermes, Rosetta)'
    ],
    div2Title: 'Solutions avancées de calibrage optique et conditionnement',
    div2Badge: 'Valeur ajoutée importateurs',
    div2Desc: 'Infrastructures modernes intégrant tri pondéral 3D, étuvage automatisé, hydro-cooling et étiquetage privé.',
    div2Crops: [
      'Calibrage optique 3D et tri pondéral haute précision',
      'Chambres de curing automatisées pour patates douces',
      'Lignes de lavage et hydro-cooling pour carottes et betteraves',
      'Conditionnement personnalisé et marque de distributeur (OEM)'
    ],
    chainTitle: 'Chaîne d’approvisionnement : De la ferme aux marchés mondiaux',
    chainSteps: [
      { num: '01', title: 'Ferme', desc: 'Culture contrôlée dans les terres fertiles d’Égypte' },
      { num: '02', title: 'Sélection & Contrôle', desc: 'Audits de qualité et conformité LMR européenne' },
      { num: '03', title: 'Tri & Conditionnement', desc: 'Calibrage optique, lavage et emballage export' },
      { num: '04', title: 'Stockage & Logistique', desc: 'Chaîne du froid réfrigérée 24h/24 jusqu’au port' },
      { num: '05', title: 'Exportation', desc: 'Certification phytosanitaire officielle CAPQ' },
      { num: '06', title: 'Marchés mondiaux', desc: 'Livraison fiable aux importateurs internationaux' }
    ],
    focusTitle: 'Nos piliers de qualité',
    focusItems: [
      'Assurance qualité produit',
      'Respect des spécifications client',
      'Conditionnement professionnel',
      'Approvisionnement fiable',
      'Solutions d’exportation flexibles'
    ],
    ctaBtn: 'Demander un devis (RFQ)'
  },
  es: {
    badge: 'SECTORES DE NEGOCIO',
    title: 'De las granjas egipcias a los mercados globales',
    subtitle: 'Soluciones integrales de exportación agrícola que abarcan productos frescos y procesos de empaque de valor añadido.',
    div1Title: 'Productos agrícolas frescos certificados',
    div1Badge: '7 cultivos principales',
    div1Desc: 'Productos frescos seleccionados para cumplir con los requisitos de calidad internacionales en Europa, el Golfo y Asia.',
    div1Crops: [
      'Batatas Premium curadas (Beauregard, Bellevue, Baladi)',
      'Cebollas Frescas secas (Rojas, Amarillas y Blancas)',
      'Zanahorias de Egipto lavadas (Tipo Nantes, Hydro-Cooled)',
      'Remolacha Roja Fresca de mesa',
      'Pimientos morrones de colores (Rojo, Amarillo, Naranja)',
      'Ajo Seco de Egipto (Blanco Baladi y Morado)',
      'Patatas frescas para mesa e industria (Spunta, Hermes, Lady Rosetta)'
    ],
    div2Title: 'Soluciones de clasificación óptica y envasado de exportación',
    div2Badge: 'Valor añadido para importadores',
    div2Desc: 'Infraestructura de vanguardia con calibrado óptico 3D, salas de curado, hidroenfriamiento y marca privada.',
    div2Crops: [
      'Clasificación óptica 3D y calibrado por peso de alta precisión',
      'Cámaras automatizadas de curado (curing) para batatas',
      'Túneles de lavado e hidro-enfriamiento para zanahorias y raíces',
      'Envasado personalizado y soluciones de marca privada (OEM)'
    ],
    chainTitle: 'Cadena de suministro: De la granja al mercado global',
    chainSteps: [
      { num: '01', title: 'Granja', desc: 'Cultivo controlado en suelos fértiles de Egipto' },
      { num: '02', title: 'Selección y Control', desc: 'Auditoría de campo y cumplimiento LMR de la UE' },
      { num: '03', title: 'Clasificación y Empaque', desc: 'Calibrado óptico, lavado y empacado' },
      { num: '04', title: 'Almacenamiento', desc: 'Cadena de frío reefer 24/7 directamente al puerto' },
      { num: '05', title: 'Exportación', desc: 'Certificación fitosanitaria oficial CAPQ' },
      { num: '06', title: 'Mercados Globales', desc: 'Entrega segura a compradores internacionales' }
    ],
    focusTitle: 'Nuestros pilares de excelencia',
    focusItems: [
      'Garantía de calidad del producto',
      'Especificaciones adaptadas al cliente',
      'Empaque profesional de exportación',
      'Suministro constante y confiable',
      'Soluciones de exportación flexibles'
    ],
    ctaBtn: 'Solicitar cotización (RFQ)'
  },
  de: {
    badge: 'UNSERE GESCHÄFTSBEREICHE',
    title: 'Von ägyptischen Farmen zu den Weltmärkten',
    subtitle: 'Umfassende Agrar-Exportlösungen für frische ägyptische Spitzen-Erzeugnisse und professionelle Exportaufbereitung.',
    div1Title: 'Zertifizierte frische Agrarprodukte',
    div1Badge: '7 Hauptkulturen',
    div1Desc: 'Ausgewählte ägyptische Produkte nach strengen internationalen Qualitätsstandards für Europa, den Golf und Asien.',
    div1Crops: [
      'Premium-Süßkartoffeln wärmebehandelt (Beauregard, Bellevue, Baladi)',
      'Frische lagerfähige Zwiebeln (Rote, gelbe und weiße Zwiebeln)',
      'Ägyptische gewaschene Karotten (Nantes, Hydro-Cooled)',
      'Frische Rote Bete für den Speisemarkt',
      'Bunte Paprika (Rot, Gelb, Orange)',
      'Ägyptischer getrockneter Knoblauch (Baladi & Violett)',
      'Frische Speise- & Industriekartoffeln (Spunta, Hermes, Lady Rosetta)'
    ],
    div2Title: 'Optische Sortierung, Veredelung & Exportverpackung',
    div2Badge: 'Mehrwert für Importeure',
    div2Desc: 'Modernste Infrastruktur: 3D-Kamerasortierung, automatisierte Curing-Hallen, Hydro-Cooling und Eigenmarken-Verpackung.',
    div2Crops: [
      'Optische 3D- und Gewichtssortierung höchster Präzision',
      'Automatisierte Curing-Hallen zur Schalenfestigung von Süßkartoffeln',
      'Hydro-Cooling und Waschstraßen für Möhren und Rote Bete',
      'Maßgeschneiderte Verpackungen & Eigenmarken-Lösungen (OEM)'
    ],
    chainTitle: 'Lieferkette: Vom Feld zu den Weltmärkten',
    chainSteps: [
      { num: '01', title: 'Farm', desc: 'Kontrollierter Anbau auf fruchtbaren ägyptischen Böden' },
      { num: '02', title: 'Selektion & QC', desc: 'Feldprüfungen und Einhaltung der EU-Rückstandshöchstmengen' },
      { num: '03', title: 'Sortierung & Packung', desc: 'Optische Kalibrierung, Waschen und Verpacken' },
      { num: '04', title: 'Lagerung & Logistik', desc: 'Lückenlose 24/7-Kühlkette bis zum Seehafen' },
      { num: '05', title: 'Zoll & Export', desc: 'Amtliche CAPQ-Pflanzenschutz-Zertifizierung' },
      { num: '06', title: 'Weltmärkte', desc: 'Zuverlässige Belieferung internationaler Partner' }
    ],
    focusTitle: 'Unsere Qualitätsversprechen',
    focusItems: [
      'Höchste Produktqualität',
      'Exakte Kunden-Spezifikationen',
      'Professionelle Exportverpackung',
      'Zuverlässige & stetige Belieferung',
      'Flexible Exportlösungen'
    ],
    ctaBtn: 'Angebot anfordern (RFQ)'
  },
  ru: {
    badge: 'НАШИ НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ',
    title: 'От египетских полей к мировым рынкам',
    subtitle: 'Комплексные сельскохозяйственные экспортные решения: свежая продукция высшего сорта и экспортная доработка.',
    div1Title: 'Сертифицированная свежая сельхозпродукция',
    div1Badge: '7 ключевых культур',
    div1Desc: 'Отборная египетская продукция, соответствующая международным фитосанитарным стандартам.',
    div1Crops: [
      'Премиальный термически обработанный батат (Борегард, Бельвю, Баладо)',
      'Свежий репчатый лук высокой лежкости (красный, желтый, белый)',
      'Мытая египетская морковь (тип Нантская, гидроохлаждение)',
      'Свежая столовая красная свекла',
      'Сладкий болгарский перец (красный, желтый, оранжевый)',
      'Сушеный египетский чеснок (белый Баладо и фиолетовый)',
      'Свежий картофель столовых и чипсовых сортов (Спунта, Хермес, Леди Розетта)'
    ],
    div2Title: 'Оптическая сортировка, калибровка и экспортная упаковка',
    div2Badge: 'Дополнительная ценность для импортеров',
    div2Desc: 'Современная инфраструктура: оптические линии сортировки, камеры кьюринга батата, гидроохлаждение и Private Label.',
    div2Crops: [
      '3D оптическая и весовая калибровка высокой точности',
      'Автоматизированные камеры кьюринга для батата',
      'Линии гидроохлаждения и мойки для моркови и свеклы',
      'Индивидуальная экспортная упаковка и Private Label (OEM)'
    ],
    chainTitle: 'Цепочка поставок: От поля к мировым рынкам',
    chainSteps: [
      { num: '01', title: 'Ферма', desc: 'Контролируемое выращивание на плодородных землях Египта' },
      { num: '02', title: 'Контроль качества', desc: 'Проверка поля и соблюдение норм MRL ЕС' },
      { num: '03', title: 'Сортировка', desc: 'Оптическая калибровка, мойка и упаковка' },
      { num: '04', title: 'Логистика', desc: 'Круглосуточная рефрижераторная цепочка до порта' },
      { num: '05', title: 'Экспорт', desc: 'Официальный фитосанитарный сертификат CAPQ' },
      { num: '06', title: 'Мировые рынки', desc: 'Надежная доставка импортерам по всему миру' }
    ],
    focusTitle: 'Наши приоритеты качества',
    focusItems: [
      'Высокое качество продукции',
      'Точное соблюдение спецификаций клиента',
      'Профессиональная экспортная упаковка',
      'Надежные и регулярные поставки',
      'Гибкие условия экспорта'
    ],
    ctaBtn: 'Запросить расчет стоимости (RFQ)'
  }
};

export const BusinessDivisionsSection: React.FC<BusinessDivisionsSectionProps> = ({
  onNavigateToProducts,
  onOpenRFQ,
  lang = 'ar'
}) => {
  const isRtl = lang === 'ar';
  const dTxt = DIVISIONS_TEXTS[lang] || DIVISIONS_TEXTS.ar;

  return (
    <section className="py-16 bg-[#0F2133] text-slate-100 relative overflow-hidden" id="divisions" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>{dTxt.badge}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
            {dTxt.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {dTxt.subtitle}
          </p>
        </div>

        {/* 2 Core Business Divisions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Division 1: Fresh Agricultural Produce */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative group hover:border-[#C5A059]/60 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
                {dTxt.div1Badge}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black font-display text-white group-hover:text-[#C5A059] transition-colors">
                {dTxt.div1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {dTxt.div1Desc}
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              {dTxt.div1Crops.map((crop, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>{crop}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={onNavigateToProducts}
                className="w-full bg-slate-800 hover:bg-slate-700 text-[#C5A059] hover:text-white font-bold text-xs py-3 px-6 rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{dTxt.ctaBtn}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Division 2: Premium Potato Solutions */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative group hover:border-[#C5A059]/60 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 px-3 py-1 rounded-full">
                {dTxt.div2Badge}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black font-display text-white group-hover:text-[#C5A059] transition-colors">
                {dTxt.div2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {dTxt.div2Desc}
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              {dTxt.div2Crops.map((crop, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>{crop}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenRFQ('French Fries & Pommes Frites')}
                className="w-full bg-[#C5A059] hover:bg-[#b08d4a] text-white font-bold text-xs py-3 px-6 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{dTxt.ctaBtn}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

        </div>

        {/* Supply Chain 6-Step Flow */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">
              From Farm To Global Markets
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
              {dTxt.chainTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {dTxt.chainSteps.map((step, idx) => (
              <div key={idx} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-2 relative group hover:border-[#C5A059] transition-all">
                <span className="text-xs font-black text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-0.5 rounded-full inline-block">
                  {step.num}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pillars of Quality Row */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-start">
              <h3 className="text-xl font-bold font-display text-white">
                {dTxt.focusTitle}
              </h3>
              <p className="text-xs text-slate-400">
                Quality You Can Trust • Avialink Export
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-3">
              {dTxt.focusItems.map((item, idx) => (
                <div key={idx} className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700/80 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
