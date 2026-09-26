import { Language } from '../lib/i18n';

export interface ExportProject {
  id: string;
  productSlug?: string;
  title: string;
  category: 'europe' | 'gcc' | 'asia' | 'uk_americas';
  categoryLabel: Record<Language, string>;
  destination: string;
  port: string;
  volumeTonnes: number;
  containerCount: number;
  cropName: string;
  reeferTemp?: string;
  image: string;
  images?: string[];
  completionDate: string;
  specsHighlight: string;
  phytosanitaryStatus: string;
  buyerFeedback: Record<Language, string>;
}

export function getProjectTemperature(project: ExportProject): string {
  if (project.reeferTemp) return project.reeferTemp;

  // Extract temperature pattern like +13.5°C or -18°C from specsHighlight
  const match = project.specsHighlight?.match(/([+-]?\d+(?:\.\d+)?\s*°C)/i);
  if (match) {
    return match[1].replace(/\s+/, '');
  }

  const slug = (project.productSlug || project.id || '').toLowerCase();
  const crop = (project.cropName || '').toLowerCase();

  if (slug.includes('sweet') || slug.includes('sp') || crop.includes('بطاطا')) {
    return '+13.5°C';
  }
  if (slug.includes('car') || crop.includes('جزر')) {
    return '+0.5°C';
  }
  if (slug.includes('garlic') || crop.includes('ثوم')) {
    return '+1.0°C';
  }
  if (slug.includes('oni') || crop.includes('بصل')) {
    return '+5.0°C';
  }
  if (slug.includes('pot') || crop.includes('بطاطس')) {
    return '+7.0°C';
  }
  if (slug.includes('beet') || crop.includes('بنجر') || crop.includes('شمندر')) {
    return '+1.0°C';
  }
  if (slug.includes('pepper') || crop.includes('فلفل')) {
    return '+8.0°C';
  }

  return '+4.0°C';
}

export const initialExportProjects: ExportProject[] = [
  {
    id: 'proj-sp-1',
    productSlug: 'sweet-potatoes',
    title: 'شحنات البطاطا الحلوة البيورجارد لموانئ فيليكسستو وروتردام',
    category: 'uk_americas',
    categoryLabel: {
      ar: 'المملكة المتحدة وغرب أوروبا',
      en: 'UK & Western Europe',
      fr: 'Royaume-Uni & Europe de l’Ouest',
      es: 'Reino Unido y Europa Occidental',
      de: 'GB & Westeuropa',
      ru: 'Великобритания и Западная Европа'
    },
    destination: 'المملكة المتحدة وهولندا (Felixstowe / Rotterdam)',
    port: 'ميناء فيليكسستو وميناء روتردام',
    volumeTonnes: 2800,
    containerCount: 112,
    cropName: 'بطاطا حلوة بيورجارد حمراء (Beauregard)',
    reeferTemp: '+13.5°C',
    image: '/crops/sweet_potatoes.jpg',
    completionDate: 'موسم 2025 / 2026',
    specsHighlight: 'أحجام L/XL/M، غسيل آلي، تجفيف وعلاج حراري (Curing) متكامل، كرتون 6 كجم، تبريد +13.5°م',
    phytosanitaryStatus: 'شهادات صحة نباتية CAPQ وخلو من الآفات والـ MRL الأوروبية المعتمدة',
    buyerFeedback: {
      ar: 'جودة المعالجة الحرارية ممتازة ومنحت المحصول فترة صلاحية أطول ونضارة استثنائية.',
      en: 'Outstanding curing quality giving longer shelf life and exceptional freshness across retail chains.',
      fr: 'Excellente qualité de séchage offrant une durée de conservation prolongée et une fraîcheur parfaite.',
      es: 'Excelente calidad de curado que otorga mayor vida útil en anaquel y frescura excepcional.',
      de: 'Hervorragende Curing-Qualität für längere Haltbarkeit und erstklassige Frische im Handel.',
      ru: 'Превосходное качество термической обработки и длительный срок хранения на полках супермаркетов.'
    }
  },
  {
    id: 'proj-sp-2',
    productSlug: 'sweet-potatoes',
    title: 'شحنات البطاطا الحلوة بيليفيو وإيفانجلين لموانئ جدة وهامبورغ',
    category: 'gcc',
    categoryLabel: {
      ar: 'الخليج وأوروبا الوسطى',
      en: 'GCC & Central Europe',
      fr: 'Moyen-Orient & Europe',
      es: 'Medio Oriente y Europa',
      de: 'Golfregion & Europa',
      ru: 'Залив и Европа'
    },
    destination: 'المملكة العربية السعودية وألمانيا (Jeddah / Hamburg)',
    port: 'ميناء جدة الإسلامي وميناء هامبورغ',
    volumeTonnes: 2400,
    containerCount: 96,
    cropName: 'بطاطا حلوة بيليفيو وإيفانجلين (Bellevue & Evangeline)',
    reeferTemp: '+13.5°C',
    image: '/crops/sweet_potatoes.jpg',
    completionDate: 'موسم 2025 / 2026',
    specsHighlight: 'أحجام موحدة S/M/L، كرتون تلسكوبي 10 كجم وأكياس جامبو، سلسلة تبريد مستمرة +13.5°م',
    phytosanitaryStatus: 'مطابقة تامة لاشتراطات هيئة الغذاء والدواء السعودية SFDA ومعايير الاتحاد الأوروبي',
    buyerFeedback: {
      ar: 'انتظام الأحجام والجلد الناعم واللون البرتقالي الداكن حقق إقبالاً واسعاً في منافذ التوزيع.',
      en: 'Uniform calibers, smooth skin, and deep orange flesh received great buyer satisfaction.',
      fr: 'Calibres uniformes, peau lisse et chair orange foncé très appréciés sur le marché.',
      es: 'Calibres uniformes, piel suave y pulpa naranja intenso con alta satisfacción de clientes.',
      de: 'Einheitliche Kaliber, glatte Schale und tiefes Orangefleisch mit höchster Kundenzufriedenheit.',
      ru: 'Равномерный калибр, гладкая кожица и насыщенный оранжевый цвет мякоти.'
    }
  },
  {
    id: 'proj-oni-1',
    productSlug: 'onions',
    title: 'شحنات البصل الأحمر والجاف الفاخر لموانئ روتردام وجدة والدمام',
    category: 'europe',
    categoryLabel: {
      ar: 'أوروبا والخليج العربي',
      en: 'Europe & GCC',
      fr: 'Europe & Moyen-Orient',
      es: 'Europa y Golfo Pérsico',
      de: 'Europa & Golfregion',
      ru: 'Европа и Персидский залив'
    },
    destination: 'هولندا والمملكة العربية السعودية (Rotterdam / Dammam)',
    port: 'ميناء روتردام وميناء الملك عبد العزيز بالدمام',
    volumeTonnes: 3200,
    containerCount: 128,
    cropName: 'البصل المصري الأحمر والذهبي الجاف (Red & Golden Onions)',
    reeferTemp: '+5.0°C',
    image: '/crops/onions.jpg',
    completionDate: 'موسم 2025 / 2026',
    specsHighlight: 'أحجام 50-70مم و70-90مم، تجفيف طبيعي وتهوية محكومة، أكياس شبك 25 كجم، تبريد +5.0°م',
    phytosanitaryStatus: 'شهادات فحص الحجر الزراعيCAPQ ومطابقة نسبة المادة الجافة Dry Matter > 14.5%',
    buyerFeedback: {
      ar: 'صلابة الدرنات والقشرة المزدوجة المتماسكة حافظت على الجودة طوال رحلة الشحن البحري.',
      en: 'High dry-matter solidity and double skin layer preserved perfect crispness during ocean transit.',
      fr: 'Haute solidité et double couche de peau préservant une fraîcheur intacte durant le transit.',
      es: 'Sólida materia seca y doble capa de piel que mantuvieron la frescura en el viaje marítimo.',
      de: 'Hoher Trockensubstanzgehalt und doppelte Schale sicherten beste Frische beim Seetransport.',
      ru: 'Высокая плотность и двойная шелуха обеспечили отличную сохранность при транспортировке.'
    }
  },
  {
    id: 'proj-car-1',
    productSlug: 'carrots',
    title: 'شحنات الجزر البرتقالي المغسول والمفرز لموانئ جبل علي وهامبورغ',
    category: 'gcc',
    categoryLabel: {
      ar: 'الخليج وأوروبا',
      en: 'GCC & Europe',
      fr: 'Moyen-Orient & Europe',
      es: 'Golfo Pérsico y Europa',
      de: 'Golfregion & Europa',
      ru: 'Залив и Европа'
    },
    destination: 'الإمارات العربية المتحدة وألمانيا (Jebel Ali / Hamburg)',
    port: 'ميناء جبل علي وميناء هامبورغ',
    volumeTonnes: 1800,
    containerCount: 72,
    cropName: 'الجزر البرتقالي نانتس المغسول (Nantes Orange Carrots)',
    reeferTemp: '+0.5°C',
    image: '/crops/carrots.jpg',
    completionDate: 'موسم 2025 / 2026',
    specsHighlight: 'غسيل وتلميع بصري، فرز أحجام M/L، كرتون تلسكوبي 10 كجم، سلسلة تبريد +0.5°م',
    phytosanitaryStatus: 'شهادة GlobalGAP وحجر زراعي CAPQ وتطهير خطوط التعبئة والتغليف',
    buyerFeedback: {
      ar: 'نظافة الجزر ولونه البرتقالي الزاهي الخالي من التكسر نال إشادة سلاسل التوزيع.',
      en: 'Optically polished, vibrant orange color with zero breakage earned praise from retail chains.',
      fr: 'Carottes polies, couleur orange éclatante et zéro casse très appréciées des distributeurs.',
      es: 'Camote/Zanahoria pulida ópticamente, color vibrante y cero roturas con gran recepción.',
      de: 'Polierte, leuchtend orangefarbene Karotten ohne Bruch mit großem Lob der Handelspartner.',
      ru: 'Чистый, ярко-оранжевый цвет и отсутствие повреждений получили отличную оценку.'
    }
  },
  {
    id: 'proj-garlic-1',
    productSlug: 'garlic',
    title: 'صادرات الثوم البلدي الأبيض والأرجواني لموانئ مارسيليا وجدة',
    category: 'europe',
    categoryLabel: {
      ar: 'أوروبا والشرق الأوسط',
      en: 'Europe & Middle East',
      fr: 'Europe & Moyen-Orient',
      es: 'Europa y Medio Oriente',
      de: 'Europa & Naher Osten',
      ru: 'Европа и Ближний Восток'
    },
    destination: 'فرنسا والمملكة العربية السعودية (Marseilles / Jeddah)',
    port: 'ميناء مارسيليا وميناء جدة',
    volumeTonnes: 1500,
    containerCount: 60,
    cropName: 'الثوم المصري البلدي والصيني (White & Purple Garlic)',
    reeferTemp: '+1.0°C',
    image: '/crops/garlic.jpg',
    completionDate: 'موسم 2025 / 2026',
    specsHighlight: 'أحجام 55-65 مم، تجفيف هوائي محكوم وتجذير آلي، صناديق كرتون 10 كجم، تبريد +1.0°م',
    phytosanitaryStatus: 'مطابقة الفحص الميكروبيولوجي واشتراطات الحجر الزراعي CAPQ',
    buyerFeedback: {
      ar: 'رائحة ونكهة نفاذة مع تجفيف متكامل يضمن سلامة الفصوص طوال فترة التخزين.',
      en: 'Intense aroma and complete curing guaranteed intact cloves through long-term storage.',
      fr: 'Arôme intense et séchage complet garantissant des gousses parfaites durant le stockage.',
      es: 'Aroma intenso y curado completo que garantizó dientes firmes en almacenamiento.',
      de: 'Intensives Aroma und vollständige Trocknung sicherten einwandfreie Zehen im Lager.',
      ru: 'Интенсивный аромат и качественная сушка обеспечили сохранность зубочков.'
    }
  },
  {
    id: 'proj-beet-1',
    productSlug: 'beetroot',
    title: 'شحنات بنجر المائدة الأحمر الطازج لموانئ روتردام وهامبورغ',
    category: 'europe',
    categoryLabel: {
      ar: 'أوروبا الوسطى والشمالية',
      en: 'Central & Northern Europe',
      fr: 'Europe Centrale & du Nord',
      es: 'Europa Central y del Norte',
      de: 'Mittel- & Nordeuropa',
      ru: 'Центральная и Северная Европа'
    },
    destination: 'هولندا وألمانيا (Rotterdam / Hamburg)',
    port: 'ميناء روتردام وميناء هامبورغ',
    volumeTonnes: 1600,
    containerCount: 64,
    cropName: 'بنجر المائدة الأحمر المستدير (Fresh Red Beetroot)',
    reeferTemp: '+1.0°C',
    image: '/crops/carrots.jpg',
    completionDate: 'موسم 2025 / 2026',
    specsHighlight: 'أحجام 40-70 مم و70-90 مم، غسيل مائي نفاث وتجفيف سطحي، أكياس شبك 10 كجم و25 كجم، تبريد +1.0°م',
    phytosanitaryStatus: 'شهادات GlobalGAP وفحص خلو من المتبقيات وفق المعايير الأوروبية MRL',
    buyerFeedback: {
      ar: 'كثافة اللون القرمزي واستدارة الدرنات والصلابة الممتازة نالت رضا مصانع الأغذية ومنافذ التوزيع.',
      en: 'Vibrant crimson internal color and firm texture earned high praise from European buyers.',
      fr: 'Couleur pourpre éclatante et texture ferme très appréciées par nos acheteurs européens.',
      es: 'Color carmesí vibrante y textura firme muy valorados por los compradores europeos.',
      de: 'Leuchtende Purpurfarbe und feste Textur überzeugten die europäischen Großabnehmer.',
      ru: 'Насыщенный темно-бордовый цвет и плотная текстура получили высокую оценку.'
    }
  },
  {
    id: 'proj-pep-1',
    productSlug: 'colored-peppers',
    title: 'شحنات الفلفل الألوان المحمي الفاخر لموانئ جدة وجبل علي',
    category: 'gcc',
    categoryLabel: {
      ar: 'الخليج العربي',
      en: 'GCC Region',
      fr: 'Région du Golfe',
      es: 'Región del Golfo',
      de: 'Golfregion',
      ru: 'Регион Залива'
    },
    destination: 'السعودية والإمارات (Jeddah / Jebel Ali)',
    port: 'ميناء جدة الإسلامي وميناء جبل علي',
    volumeTonnes: 1200,
    containerCount: 48,
    cropName: 'فلفل ألوان أحمر وأصفر وبرتقالي (Greenhouse Bell Peppers)',
    reeferTemp: '+8.0°C',
    image: '/crops/carrots.jpg',
    completionDate: 'موسم 2025 / 2026',
    specsHighlight: 'أحجام Calibers G/GG/GGG، ثمار سميكة الجدار، كرتون تلسكوبي 5 كجم، تبريد محكوم +8°م',
    phytosanitaryStatus: 'مطابقة تامة للمواصفات القياسية الخليجية GSO واشتراطات هيئة الغذاء والدواء SFDA',
    buyerFeedback: {
      ar: 'جدران الثمار السميكة واللمعان الفائق حققا مبيعات ممتازة في سلاسل السوبرماركت الكبرى.',
      en: 'Thick fleshy walls and natural gloss achieved outstanding retail sales across GCC supermarkets.',
      fr: 'Parois épaisses et brillance naturelle exceptionnelles pour les supermarchés du Golfe.',
      es: 'Paredes carnosas y brillo natural sobresaliente para las cadenas de supermercados del Golfo.',
      de: 'Dickfleischige Wände und natürlicher Glanz für beste Abverkäufe im Golf-Handel.',
      ru: 'Толстые сочные стенки и глянцевый блеск обеспечили высокий спрос в супермаркетах.'
    }
  }
];
