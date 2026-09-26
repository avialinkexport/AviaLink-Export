import { Language } from './i18n';
import { Product } from '../types';

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: Record<string, any>;
}

const DEFAULT_IMAGE = '/crops/sweet_potatoes.jpg';
const BASE_URL = 'https://avialink.export';

const ROUTE_SEO: Record<string, Record<Language, { title: string; description: string; keywords: string }>> = {
  home: {
    ar: {
      title: 'أفيالينك — تصدير الحاصلات الزراعية المصرية للأسواق العالمية | AviaLink',
      description: 'شركة أفيالينك الرائدة في تصدير الحاصلات الزراعية المصرية الطازجة (بطاطا حلوة، بصل، بطاطس، ثوم، جزر مبرد، بنجر، فلفل ألوان) إلى أوروبا والخليج وفق معايير الجودة العالمية وسلسلة تبريد معتمدة.',
      keywords: 'تصدير حاصلات زراعية مصر, تصدير بطاطا حلوة مصرية, تصدير جزر وبصل, بطاطس تصدير مصر, ثوم مصري تصدير, شركات تصدير زراعي, شحن بحري مبرد, GlobalGAP مصر, حاصلات زراعية تصدير'
    },
    en: {
      title: 'AVIALINK — Premium Egyptian Fresh Produce & Agricultural Export',
      description: 'AviaLink is Egypt’s leading agricultural exporter of premium fresh produce (Sweet Potatoes, Onions, Potatoes, Garlic, Hydro-Cooled Carrots, Beetroot, Bell Peppers) to Europe, GCC & global markets with full cold-chain and GlobalGAP compliance.',
      keywords: 'Egyptian agricultural export, Egyptian sweet potatoes exporter, Egypt carrots export, Egyptian fresh onions wholesale, Egyptian potatoes exporter, fresh produce Egypt, B2B agri exporter Egypt, cold chain shipping'
    },
    fr: {
      title: 'AVIALINK — Exportation de Produits Agricoles Frais d’Égypte',
      description: 'AviaLink exporte des produits agricoles frais égyptiens d’exception (patates douces, oignons, pommes de terre, ail, carottes, betteraves, poivrons) vers l’Europe et le monde avec certification GlobalGAP et chaîne du froid continue.',
      keywords: 'exportation fruits legumes egypte, patates douces egypte, carottes egypte, oignons egypte, pommes de terre egypte, importateur fruits frais, logistique maritime refrigerée'
    },
    es: {
      title: 'AVIALINK — Exportación de Productos Agrícolas de Egipto',
      description: 'AviaLink es empresa líder en la exportación de productos agrícolas egipcios frescos (batatas dulces, cebollas, patatas, ajos, zanahorias, remolachas, pimientos) a Europa y mercados internacionales con calidad certificada GlobalGAP.',
      keywords: 'exportador agricola egipto, batatas dulces egipto, zanahorias egipto, cebollas frescas egipto, patatas egipto, hortalizas frescas egipto'
    },
    de: {
      title: 'AVIALINK — Ägyptischer Agrarexport & Frische Agrarprodukte',
      description: 'AviaLink exportiert erstklassige frische Agrarerzeugnisse aus Ägypten (Süßkartoffeln, Zwiebeln, Kartoffeln, Knoblauch, Möhren, Rote Bete, Paprika) nach Europa mit lückenloser Kühlkette und GlobalGAP-Zertifizierung.',
      keywords: 'Agrarexport Ägypten, Süßkartoffeln Ägypten Export, Ägyptische Zwiebeln Großhandel, Karotten Ägypten, Frisches Gemüse Ägypten, GlobalGAP Ägypten'
    },
    ru: {
      title: 'AVIALINK — Экспорт свежей сельскохозяйственной продукции из Египта',
      description: 'AviaLink — ведущий египетский экспортер свежих овощей (батат, лук, картофель, чеснок, морковь, свекла, перец) в Европу, страны Залива и СНГ со строгим контролем качества и соблюдением холодовой цепи.',
      keywords: 'экспорт овощей из египта, египетский батат оптом, египетская морковь оптом, египетский лук оптом, картофель из египта, оптовые поставки сельхозпродукции'
    }
  },
  products: {
    ar: {
      title: 'كتالوج المحاصيل والحاصلات الزراعية التصديرية | أفيالينك',
      description: 'استعرض مواصفات المحاصيل الزراعية المصرية المعدة للتصدير الدولي: بطاطا حلوة برتقالية، بصل أحمر وذهبي، بطاطس سبونتا، ثوم طازج، جزر مبرد هيدروليكياً، بنجر مائدة، وفلفل ألوان محمي.',
      keywords: 'محاصيل زراعية تصديرية, مواصفات تصدير البطاطا, جزر مبرد مصري, بصل احمر للتصدير, بطاطس سبونتا, ثوم تصدير, مواصفات تصدير الخضار'
    },
    en: {
      title: 'Agricultural Export Crop Catalog & Specifications | AVIALINK',
      description: 'Explore export-grade specifications for premium Egyptian crops: Orange-flesh Sweet Potatoes, Red & Golden Onions, Spunta Potatoes, Fresh Garlic, Hydro-Cooled Carrots, Beetroot, and Greenhouse Bell Peppers.',
      keywords: 'Egyptian crop catalog, sweet potatoes export spec, Egyptian carrots wholesale, export grade onions Egypt, spunta potatoes specifications, B2B produce catalog'
    },
    fr: {
      title: 'Catalogue des Produits Agricoles d’Exportation | AVIALINK',
      description: 'Fiches techniques et calibres des récoltes égyptiennes pour l’exportation: patates douces, carottes hydro-refroidies, oignons rouges et dorés, pommes de terre Spunta, ail frais et betteraves.',
      keywords: 'catalogue fruits legumes egypte, fiches techniques export, patates douces specifications, carottes egypte'
    },
    es: {
      title: 'Catálogo de Cultivos de Exportación Agrícola | AVIALINK',
      description: 'Fichas técnicas y especificaciones de cultivos egipcios para exportación: batatas dulces, zanahorias hidroenfriadas, cebollas rojas y doradas, patatas Spunta, ajo y remolachas.',
      keywords: 'catalogo productos agricolas egipto, especificaciones batatas, zanahorias egipto, cebollas rojas exportacion'
    },
    de: {
      title: 'Agrar-Exportkatalog & Produktspezifikationen | AVIALINK',
      description: 'Detaillierte Spezifikationen für ägyptische Exportgüter: Süßkartoffeln, hydrogekühlte Karotten, rote und goldene Zwiebeln, Speisekartoffeln, frischer Knoblauch und Rote Bete.',
      keywords: 'Exportkatalog Ägypten, Süßkartoffeln Spezifikation, Karotten Großhandel, Zwiebeln Exportqualitaet'
    },
    ru: {
      title: 'Каталог экспортной сельхозпродукции и спецификации | AVIALINK',
      description: 'Технические спецификации и калибры египетской продукции для экспорта: батат, мытая морковь, красный и желтый лук, картофель Спунта, чеснок и свекла.',
      keywords: 'каталог продукции египет, спецификация батата, египетская морковь оптом, египетский лук сорта'
    }
  },
  markets: {
    ar: {
      title: 'خطوط الشحن البحري واللوجستيات وسلسلة التبريد | أفيالينك',
      description: 'مسارات الشحن البحري المبرد والجوي السريع من ميناءي الإسكندرية وبورسعيد إلى موانئ أوروبا (كوبير، روتردام، مرسيليا) والخليج العربي مع متابعة درجات الحرارة لحظياً.',
      keywords: 'شحن بحري حاصلات زراعية, حاويات مبردة ريفر, لوجستيات تصدير زراعي, شحن من ميناء الإسكندرية, خطوط ملاحية سريعة, سلسلة التبريد'
    },
    en: {
      title: 'Global Export Logistics & Cold-Chain Shipping Corridors | AVIALINK',
      description: 'Direct maritime and air reefer shipping corridors from Alexandria and Port Said to European hubs (Koper, Rotterdam, Fos-sur-Mer) and GCC ports with continuous telemetry and temperature logging.',
      keywords: 'reefer shipping Egypt, cold chain logistics produce, maritime export corridors, Alexandria port export, perishable goods logistics'
    },
    fr: {
      title: 'Couloirs Logistiques & Transport Frigorifique Maritime | AVIALINK',
      description: 'Lignes maritimes directes sous température dirigée depuis Alexandrie et Port-Saïd vers Rotterdam, Koper, Marseille et le Golfe.',
      keywords: 'transport frigorifique egypte, fret maritime fruits legumes, port alexandrie export'
    },
    es: {
      title: 'Corredores Logísticos y Transporte Refrigerado | AVIALINK',
      description: 'Rutas marítimas directas con contenedores reefer desde Alejandría y Port Said hacia puertos de Europa y Golfo Pérsico.',
      keywords: 'logistica exportacion agricola, contenedores reefer egipto, rutas maritimas productos frescos'
    },
    de: {
      title: 'Globale Logistikrouten & Kühlketten-Transport | AVIALINK',
      description: 'Direkte Reefer-Kühlcontainertransporte von Alexandria und Port Said nach Koper, Rotterdam, Marseille und in die Golfstaaten.',
      keywords: 'Kuehlkettenlogistik Aegypten, Reefer Frachtgut Frischeprodukte, Seefracht Alexandria'
    },
    ru: {
      title: 'Логистические коридоры и рефрижераторные перевозки | AVIALINK',
      description: 'Прямые рефрижераторные морские линии из портов Александрия и Порт-Саид в Европу (Копер, Роттердам) и порты Персидского залива с непрерывным термоконтролем.',
      keywords: 'морские перевозки рефрижератор, логистика овощей египет, экспорт через александрию'
    }
  },
  quality: {
    ar: {
      title: 'إجراءات الجودة وفحوصات الحجر الزراعي والشهادات الدولية | أفيالينك',
      description: 'منظومة الجودة الصارمة لدى أفيالينك: التوافق مع معايير GlobalGAP، مطابقة متبقيات المبيدات MRLs، فحوصات الحجر الزراعي المصري CAPQ، وشهادات الأيزو 22000.',
      keywords: 'جودة الحاصلات الزراعية, شهادة جلوبال جاب مصر, الحجر الزراعي المصري CAPQ, تحاليل متبقيات المبيدات, ايزو 22000 محطات تعبئة'
    },
    en: {
      title: 'Phytosanitary Certification & Quality Assurance Protocols | AVIALINK',
      description: 'Rigorous food safety and export quality assurance: GlobalGAP compliance, strict EU MRL pesticide residue limits, CAPQ inspection protocols, and ISO 22000 certified packhouses.',
      keywords: 'GlobalGAP Egypt, CAPQ phytosanitary certificate, MRL pesticide testing, ISO 22000 agricultural packing, food safety export Egypt'
    },
    fr: {
      title: 'Assurance Qualité & Certifications Phytosanitaires | AVIALINK',
      description: 'Normes de qualité et sécurité alimentaire: conformité GlobalGAP, analyses de résidus de pesticides LMR UE, certification phytosanitaire CAPQ.',
      keywords: 'certifications agricoles egypte, conformite globalgap, controle phytosanitaire'
    },
    es: {
      title: 'Aseguramiento de Calidad y Certificaciones Fitosanitarias | AVIALINK',
      description: 'Protocolos de control de calidad: certificación GlobalGAP, límites máximos de residuos LMR europeos, inspección fitosanitaria CAPQ.',
      keywords: 'control de calidad fitosanitario, certificacion globalgap egipto, limites lmr plaguicidas'
    },
    de: {
      title: 'Qualitätssicherung & Pflanzenschutz-Zertifizierung | AVIALINK',
      description: 'Strenge Qualitätsstandards: GlobalGAP-Zertifizierung, Einhaltung europäischer Rückstandshöchstgehalte (RHG/MRL), amtliche Pflanzengesundheitszeugnisse.',
      keywords: 'Qualitaetssicherung Agrarexport, GlobalGAP Aegypten, Pflanzengesundheitszeugnis CAPQ'
    },
    ru: {
      title: 'Контроль качества и фитосанитарные сертификаты | AVIALINK',
      description: 'Система контроля качества и безопасности: сертификация GlobalGAP, соответствие нормам пестицидов MRL, фитосанитарные сертификаты CAPQ и ISO 22000.',
      keywords: 'фитосанитарный контроль египет, сертификат globalgap, контроль пестицидов экспорт'
    }
  },
  portfolio: {
    ar: {
      title: 'سابقة أعمال الشحنات المصدرة وسجل التسليمات الدولية | أفيالينك',
      description: 'استعرض سجل شحنات أفيالينك المكتملة إلى الأسواق الأوروبية والعربية: كميات التصدير، موانئ الوصول، وملاحظات المشترين الدوليين.',
      keywords: 'شحنات مصدرة, سجل اعمال التصدير الزراعي, تسليمات موانئ اوروبا, تعاملات تجارية زراعية'
    },
    en: {
      title: 'Export Track Record & Completed International Shipments | AVIALINK',
      description: 'Browse AviaLink’s verified export shipments to global buyers across Europe and the GCC: delivered volumes, destination ports, phytosanitary clearance, and buyer reviews.',
      keywords: 'export track record produce, completed reefer shipments, agricultural trade history, international buyer reviews'
    },
    fr: {
      title: 'Historique des Expéditions & Références Internationales | AVIALINK',
      description: 'Découvrez nos expéditions maritimes réalisées vers les acheteurs européens et internationaux avec traçabilité complète.',
      keywords: 'references export egypte, historique expeditions agricoles, livraisons fruits legumes'
    },
    es: {
      title: 'Historial de Exportaciones y Envíos Internacionales | AVIALINK',
      description: 'Vea el registro de envíos agrícolas de AviaLink entregados con éxito en Europa y mercados de Oriente Medio.',
      keywords: 'historial de envios agricolas, exportaciones verificadas egipto, entregas maritimas'
    },
    de: {
      title: 'Export-Erfolgsbilanz & Internationale Lieferungen | AVIALINK',
      description: 'Übersicht über erfolgreich abgewickelte Kühlschiffsladungen nach Europa und in die Golfregion mit vollständiger Dokumentation.',
      keywords: 'Export Referenzen Aegypten, abgewickelte Frachtsendungen, Agrarlieferungen'
    },
    ru: {
      title: 'История выполненных экспортных поставок | AVIALINK',
      description: 'Ознакомьтесь с историей завершенных поставок свежей продукции в Европу и страны Залива: объемы, порты назначения и отзывы покупателей.',
      keywords: 'выполненные поставки овощей, история экспорта египет, рефрижераторные партии'
    }
  },
  about: {
    ar: {
      title: 'عن أفيالينك — رؤيتنا ومحطات التعبئة وسلاسل الإمداد | AviaLink',
      description: 'تعرف على قصة أفيالينك، رواد تصدير الحاصلات الزراعية في مصر: مزارعنا المتعاقد عليها، محطات الفرز الإلكتروني، والالتزام بأعلى معايير التجارة الدولية.',
      keywords: 'عن شركة افيالينك, محطات تعبئة وتصدير مصر, مزارع تصدير حاصلات زراعية, رؤية التصدير الزراعي'
    },
    en: {
      title: 'About AVIALINK — Egyptian Agricultural Export Enterprise',
      description: 'Discover AviaLink’s heritage and export capabilities: direct farm partnerships, optical grading packing stations, and an unwavering commitment to international B2B buyers.',
      keywords: 'about AviaLink, Egypt agricultural exporter company, modern packing houses Egypt, produce supply chain'
    },
    fr: {
      title: 'À Propos d’AVIALINK — Entreprise d’Exportation Agricole',
      description: 'L’histoire et l’expertise d’AviaLink: partenariats agricoles durables, stations de conditionnement de pointe et logistique internationale.',
      keywords: 'a propos de AviaLink, exportateur fruits legumes egypte, station de conditionnement'
    },
    es: {
      title: 'Acerca de AVIALINK — Empresa de Exportación Agrícola de Egipto',
      description: 'Conozca AviaLink: alianzas agrícolas, plantas de selección y envasado de alta tecnología y despacho mundial.',
      keywords: 'sobre AviaLink, empresa exportadora egipto, plantas de empaque agricola'
    },
    de: {
      title: 'Über AVIALINK — Ägyptisches Agrarexport-Unternehmen',
      description: 'Erfahren Sie mehr über AviaLink: Direkte Anbaukooperationen, moderne Pack- und Sortierstationen und weltweite Exportkompetenz.',
      keywords: 'ueber AviaLink, Aegyptischer Exporteur, moderne Packstationen Aegypten'
    },
    ru: {
      title: 'О компании AVIALINK — Египетский агроэкспортный холдинг',
      description: 'Узнайте о компании AviaLink: собственные контракты с фермерскими хозяйствами, современные упаковочные комплексы и экспорт высшего стандарта.',
      keywords: 'о компании AviaLink, египетские экспортеры овощей, упаковочные комплексы египет'
    }
  },
  contact: {
    ar: {
      title: 'اتصل بالمكتب التجاري لطلب عروض الأسعار | أفيالينك',
      description: 'تواصل مباشرة مع فريق المبيعات والتصدير في أفيالينك لطلب عروض الأسعار (RFQ)، مواصفات الشحنات، وحجز حاويات التبريد للتصدير الفوري.',
      keywords: 'طلب عرض سعر تصدير زراعي, التواصل مع شركة تصدير حاصلات, هاتف تصدير حاصلات مصر, ايميل مكتب التصدير'
    },
    en: {
      title: 'Contact Commercial Export Desk & Request Quotation (RFQ) | AVIALINK',
      description: 'Get in touch with AviaLink’s commercial export desk. Request instant B2B quotation (RFQ), crop specifications, and reefer container bookings.',
      keywords: 'contact agricultural exporter Egypt, RFQ fresh produce Egypt, B2B wholesale quotation, export sales desk'
    },
    fr: {
      title: 'Contactez Notre Bureau Commercial & Demande de Devis (RFQ) | AVIALINK',
      description: 'Contactez notre équipe commerciale pour vos demandes de devis, fiches techniques et réservations de conteneurs réfrigérés.',
      keywords: 'contact exportateur egypte, demande de devis fruits legumes, reservation conteneur reefer'
    },
    es: {
      title: 'Contacto Comercial y Solicitud de Cotización (RFQ) | AVIALINK',
      description: 'Póngase en contacto con el departamento comercial de AviaLink para cotizaciones rápidas (RFQ) y reservas de contenedores.',
      keywords: 'contacto exportador egipto, cotizacion productos agricolas, reserva contenedor reefer'
    },
    de: {
      title: 'Kontakt zum Export-Handelsdesk & Angebotsanfrage (RFQ) | AVIALINK',
      description: 'Kontaktieren Sie unser Vertriebsteam für verbindliche B2B-Angebote (RFQ), Spezifikationsblätter und Kühlcontainerbuchungen.',
      keywords: 'Kontakt Agrarexporteur Aegypten, Angebotsanfrage Frischeprodukte, Reefer Buchung'
    },
    ru: {
      title: 'Контакты коммерческого отдела и запрос цен (RFQ) | AVIALINK',
      description: 'Свяжитесь с коммерческим отделом AviaLink для получения коммерческого предложения (RFQ), спецификаций и бронирования рефрижераторов.',
      keywords: 'контакты экспортера египет, запрос цен на сельхозпродукцию, заказать рефрижератор'
    }
  }
};

/**
 * Updates DOM meta tags, title, link canonical, OpenGraph, Twitter and JSON-LD structured data
 */
export function updatePageSEO(route: string, lang: Language, product?: Product | null, marketSlug?: string | null) {
  if (typeof document === 'undefined') return;

  const currentRouteData = ROUTE_SEO[route]?.[lang] || ROUTE_SEO['home'][lang] || ROUTE_SEO['home']['ar'];
  let title = currentRouteData.title;
  let description = currentRouteData.description;
  let keywords = currentRouteData.keywords;
  let ogImage = DEFAULT_IMAGE;
  let pagePath = route === 'home' ? '' : route;

  if (route === 'product-detail' && product) {
    const pName = product.name;
    ogImage = product.heroImage || (product.images && product.images[0]) || DEFAULT_IMAGE;
    pagePath = `products/${product.slug || product.id}`;

    if (lang === 'ar') {
      title = `${pName} — مواصفات التصدير والحجز | أفيالينك`;
      description = `مواصفات تصدير ${pName} من مصر: الأصناف، درجات الجودة، خيارات التعبئة والتغليف، الحاويات المبردة، والشهادات المعتمدة لدى أفيالينك.`;
      keywords = `${pName}, تصدير ${pName}, مواصفات تصدير ${pName} مصر, شحن مبرد ${pName}`;
    } else if (lang === 'en') {
      title = `${pName} — Export Specifications & Quotation | AVIALINK`;
      description = `Detailed export grade specifications for ${pName} from Egypt: varieties, sizing, packaging options, cold-chain parameters, and international phytosanitary certifications.`;
      keywords = `${pName} export Egypt, fresh ${pName} wholesale, ${pName} reefer specs, ${pName} supplier Egypt`;
    } else if (lang === 'fr') {
      title = `${pName} — Spécifications d’Exportation | AVIALINK`;
      description = `Fiche technique d’exportation pour ${pName} d’Égypte: calibres, conditionnement, chaîne du froid et certifications.`;
      keywords = `${pName} egypte export, fiches techniques ${pName}`;
    } else if (lang === 'es') {
      title = `${pName} — Especificaciones de Exportación | AVIALINK`;
      description = `Especificaciones técnicas de exportación para ${pName} de Egipto: calibres, opciones de envasado y transporte reefer.`;
      keywords = `${pName} exportacion egipto, calidad exportacion ${pName}`;
    } else if (lang === 'de') {
      title = `${pName} — Exportspezifikationen | AVIALINK`;
      description = `Produktspezifikation für ${pName} aus Ägypten: Sorten, Kalibrierung, Verpackungsvarianten und Kühltransport.`;
      keywords = `${pName} Export Aegypten, Grosshandel ${pName}`;
    } else if (lang === 'ru') {
      title = `${pName} — Спецификация на экспорт | AVIALINK`;
      description = `Экспортные спецификации для ${pName} из Египта: калибровка, упаковка, температурный режим и сертификаты.`;
      keywords = `${pName} экспорт египет, оптовые поставки ${pName}`;
    }
  } else if (route === 'market-detail' && marketSlug) {
    pagePath = `markets/${marketSlug}`;
  }

  // 1. Update Title
  document.title = title;

  // 2. Update standard meta tags
  setOrCreateMeta('name', 'description', description);
  setOrCreateMeta('name', 'keywords', keywords);
  setOrCreateMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  // 3. Update Open Graph
  setOrCreateMeta('property', 'og:title', title);
  setOrCreateMeta('property', 'og:description', description);
  setOrCreateMeta('property', 'og:image', ogImage);
  setOrCreateMeta('property', 'og:url', `${BASE_URL}/${pagePath}`);
  setOrCreateMeta('property', 'og:type', product ? 'product' : 'website');
  setOrCreateMeta('property', 'og:site_name', 'AVIALINK');
  setOrCreateMeta('property', 'og:locale', getLocaleCode(lang));

  // 4. Update Twitter Card
  setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
  setOrCreateMeta('name', 'twitter:title', title);
  setOrCreateMeta('name', 'twitter:description', description);
  setOrCreateMeta('name', 'twitter:image', ogImage);

  // 5. Update Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', `${BASE_URL}/${pagePath}`);

  // 6. Update HTML lang and dir attributes on root
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  // 7. Inject Dynamic JSON-LD structured data for Google Rich Results
  injectStructuredData(route, lang, title, description, ogImage, product);
}

function setOrCreateMeta(keyAttr: 'name' | 'property', keyVal: string, content: string) {
  let meta = document.querySelector(`meta[${keyAttr}="${keyVal}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(keyAttr, keyVal);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function getLocaleCode(lang: Language): string {
  switch (lang) {
    case 'ar': return 'ar_EG';
    case 'en': return 'en_US';
    case 'fr': return 'fr_FR';
    case 'es': return 'es_ES';
    case 'de': return 'de_DE';
    case 'ru': return 'ru_RU';
    default: return 'en_US';
  }
}

function injectStructuredData(
  route: string,
  lang: Language,
  title: string,
  description: string,
  image: string,
  product?: Product | null
) {
  const SCRIPT_ID = 'avialink-dynamic-jsonld';
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const graph: any[] = [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'AVIALINK',
      alternateName: ['أفيالينك للصادرات الزراعية', 'AviaLink Agricultural Export'],
      url: BASE_URL,
      logo: `${BASE_URL}/pwa-512x512.png`,
      image: `${BASE_URL}/logo.jpg`,
      description: 'Premier Egyptian fresh agricultural produce export company serving Europe, GCC, and international wholesale markets.',
      email: 'export@avialink.com',
      telephone: '+201000000000',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Cairo-Alexandria Desert Road Logistics Hub',
        addressLocality: 'Alexandria / Cairo',
        addressRegion: 'Cairo',
        addressCountry: 'EG'
      },
      sameAs: [
        'https://facebook.com/avialink',
        'https://linkedin.com/company/avialink',
        'https://x.com/avialink'
      ]
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'AVIALINK Agricultural Export',
      inLanguage: ['ar', 'en', 'fr', 'es', 'de', 'ru'],
      publisher: { '@id': `${BASE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/products?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  ];

  if (route === 'product-detail' && product) {
    graph.push({
      '@type': 'Product',
      '@id': `${BASE_URL}/products/${product.slug}#product`,
      name: product.name,
      description: product.shortDescription || description,
      image: image,
      category: 'Fresh Produce / Agricultural Crops',
      countryOfOrigin: {
        '@type': 'Country',
        name: 'Egypt'
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: 'Contact for RFQ (B2B Wholesale Container)',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: { '@id': `${BASE_URL}/#organization` }
      }
    });
  }

  // Add BreadcrumbList Schema
  graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL
      },
      ...(route !== 'home' ? [
        {
          '@type': 'ListItem',
          position: 2,
          name: title,
          item: `${BASE_URL}/${route}`
        }
      ] : [])
    ]
  });

  // Add B2B FAQ Schema on Home page
  if (route === 'home') {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What agricultural products does AviaLink export from Egypt?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'AviaLink exports fresh Egyptian Sweet Potatoes (Beauregard, Bellevue), Citrus & Oranges (Valencia, Navel), Onions (Red, Golden), Potatoes (Spunta, Rosetta), Fresh Garlic, and Pomegranates.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is the Minimum Order Quantity (MOQ) for international orders?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The standard MOQ is one 40-foot High-Cube Reefer Container (approx. 24 to 26 metric tons depending on the crop).'
          }
        },
        {
          '@type': 'Question',
          name: 'Are AviaLink export crops certified under GlobalGAP and CAPQ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, all our farms and packhouse facilities adhere strictly to GlobalGAP food safety standards, EU MRL pesticide residue limits, and official Central Administration of Plant Quarantine (CAPQ) phytosanitary certificates.'
          }
        },
        {
          '@type': 'Question',
          name: 'What are the main export shipping ports and transit times to Europe?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We ship primarily from Alexandria and Port Said maritime terminals. Direct reefer transit times are 4-6 days to Mediterranean ports (Koper, Fos, Ravenna) and 8-12 days to North European ports (Rotterdam, Antwerp, Hamburg).'
          }
        }
      ]
    });
  }

  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph
  });
}
