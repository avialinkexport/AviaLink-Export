import React from 'react';
import { marketLandingPages } from '../data/markets';
import { ArrowLeft, ArrowRight, Ship, ShieldCheck, CheckCircle2, Globe } from 'lucide-react';
import { Language, LANGUAGES } from '../lib/i18n';

interface MarketLandingViewProps {
  slug: string;
  onBack: () => void;
  onOpenRFQ: (productName?: string) => void;
  lang?: Language;
}

const LOCALIZED_MARKET_DETAILS: Record<string, Record<Language, {
  regionName: string;
  heroHeadline: string;
  regionalSubtext: string;
  transitTimeEstimate: string;
}>> = {
  europe: {
    ar: {
      regionName: 'الاتحاد الأوروبي والمملكة المتحدة',
      heroHeadline: 'حاصلات زراعية مصرية مطابقة للاشتراطات الأوروبية مباشرة للموانئ الأوروبية',
      regionalSubtext: 'خطوط شحن مبردة مباشرة من الإسكندرية وبورسعيد إلى روتردام وهامبورغ وكوبر ومرسيليا وفيليكسستو. التزام كامل بحدود MRL وشهادات GlobalGAP وتتبع درجات الحرارة.',
      transitTimeEstimate: 'شحن بحري مباشر من 5 إلى 9 أيام'
    },
    en: {
      regionName: 'European Union & United Kingdom',
      heroHeadline: 'EU-Compliant Egyptian Agricultural Produce directly to European Ports',
      regionalSubtext: 'Direct reefer vessel shipping lines from Alexandria and Port Said to Rotterdam, Hamburg, Koper, Fos-sur-Mer, and Felixstowe. Strict adherence to EU MRL limits, GlobalGAP certification standards, and ETR guarantees.',
      transitTimeEstimate: '5 to 9 Days Direct Maritime Shipping'
    },
    fr: {
      regionName: 'Union Européenne & Royaume-Uni',
      heroHeadline: 'Produits agricoles égyptiens conformes aux normes UE vers les ports européens',
      regionalSubtext: 'Lignes directes de navires frigorifiques d’Alexandrie et Port-Saïd vers Rotterdam, Hambourg, Koper, Fos-sur-Mer et Felixstowe. Respect rigoureux des limites LMR de l’UE et traçabilité GlobalGAP.',
      transitTimeEstimate: '5 à 9 jours de transport maritime direct'
    },
    es: {
      regionName: 'Unión Europea y Reino Unido',
      heroHeadline: 'Productos agrícolas egipcios conformes a la UE directo a puertos europeos',
      regionalSubtext: 'Líneas directas de buques refrigerados desde Alejandría y Port Said a Rotterdam, Hamburgo, Koper, Fos-sur-Mer y Felixstowe. Estricto cumplimiento de límites LMR de la UE y GlobalGAP.',
      transitTimeEstimate: '5 a 9 días de envío marítimo directo'
    },
    de: {
      regionName: 'Europäische Union & Großbritannien',
      heroHeadline: 'EU-konforme ägyptische Agrarprodukte direkt zu europäischen Häfen',
      regionalSubtext: 'Direkte Kühlschifflinien von Alexandria und Port Said nach Rotterdam, Hamburg, Koper, Fos-sur-Mer und Felixstowe. Strikte Einhaltung von EU-MRL-Grenzwerten und GlobalGAP-Standards.',
      transitTimeEstimate: '5 bis 9 Tage direkte Seefracht'
    },
    ru: {
      regionName: 'Европейский Союз и Великобритания',
      heroHeadline: 'Египетская сельхозпродукция стандарта ЕС напрямую в европейские порты',
      regionalSubtext: 'Прямые рефрижераторные морские линии из Александрии и Порт-Саида в Роттердам, Гамбург, Копер, Фос-сюр-Мер и Феликстоу. Полное соблюдение лимитов MRL ЕС и GlobalGAP.',
      transitTimeEstimate: '5-9 дней прямой морской доставки'
    }
  },
  gcc: {
    ar: {
      regionName: 'الخليج العربي والشرق الأوسط',
      heroHeadline: 'إمداد يومي طازج وشحن بحري وبري سريع إلى دول الخليج العربي',
      regionalSubtext: 'خدمة المستوردين وأسواق النفع العام وسلاسل السوبرماركت في السعودية والإمارات وقطر والكويت وعمان والبحرين عبر سفاجا وضبا وميناء جدة الإسلامي.',
      transitTimeEstimate: 'شحن سريع من 3 إلى 6 أيام'
    },
    en: {
      regionName: 'GCC & Middle East',
      heroHeadline: 'Fresh Daily Supply & Express Overland / Maritime Shipping to the Gulf',
      regionalSubtext: 'Serving importers, central markets, and supermarket chains across Saudi Arabia, UAE, Qatar, Kuwait, Oman, and Bahrain. High-capacity reefer logistics and fast customs clearance via Safaga, Duba, and Jeddah.',
      transitTimeEstimate: '3 to 6 Days Express Route'
    },
    fr: {
      regionName: 'Pays du Golfe & Moyen-Orient',
      heroHeadline: 'Approvisionnement quotidien frais et fret express vers le Golfe',
      regionalSubtext: 'Au service des importateurs, marchés de gros et hypermarchés en Arabie Saoudite, EAU, Qatar, Koweït, Oman et Bahreïn avec logistique frigorifique rapide.',
      transitTimeEstimate: 'Route express de 3 à 6 jours'
    },
    es: {
      regionName: 'CCG y Medio Oriente',
      heroHeadline: 'Suministro diario fresco y transporte exprés terrestre/marítimo al Golfo',
      regionalSubtext: 'Servicio a importadores, mercados mayoristas y cadenas de supermercados en Arabia Saudita, EAU, Catar, Kuwait, Omán y Baréin.',
      transitTimeEstimate: 'Ruta exprés de 3 a 6 días'
    },
    de: {
      regionName: 'Golfstaaten & Naher Osten',
      heroHeadline: 'Täglich frische Lieferungen & Express-Versand in die Golfregion',
      regionalSubtext: 'Für Importeure, Großmärkte und Supermarktketten in Saudi-Arabien, den VAE, Katar, Kuwait, Oman und Bahrain mit schneller Zollabfertigung.',
      transitTimeEstimate: '3 bis 6 Tage Express-Route'
    },
    ru: {
      regionName: 'Страны Залива и Ближний Восток',
      heroHeadline: 'Ежедневные свежие поставки и экспресс-доставка в страны Залива',
      regionalSubtext: 'Обслуживание импортеров, оптовых рынков и гипермаркетов в Саудовской Аравии, ОАЭ, Катаре, Кувейте, Омане и Бахрейне с быстрой таможенной очисткой.',
      transitTimeEstimate: '3-6 дней экспресс-маршрутом'
    }
  },
  asia: {
    ar: {
      regionName: 'شرق آسيا والمحيط الهادئ',
      heroHeadline: 'موالح بمعالجة تبريدية معتمدة وحاصلات ممتازة إلى آسيا',
      regionalSubtext: 'حاويات تبريد معتمدة تُشحن عبر قناة السويس إلى سنغافورة وماليزيا والهند والصين وفيتنام مع توثيق صحي كامل واشتراطات حجر زراعي صارمة.',
      transitTimeEstimate: 'خط مباشر من 14 إلى 22 يوماً'
    },
    en: {
      regionName: 'Asia-Pacific & Far East',
      heroHeadline: 'Cold Treatment Protocol Citrus & Premium Produce to Asia',
      regionalSubtext: 'Certified cold treatment containers shipped via Suez Canal maritime routes to Singapore, Malaysia, India, China, and Vietnam with full phytosanitary documentation.',
      transitTimeEstimate: '14 to 22 Days Direct Liner Service'
    },
    fr: {
      regionName: 'Asie-Pacifique & Extrême-Orient',
      heroHeadline: 'Agrumes avec protocole de traitement par le froid vers l’Asie',
      regionalSubtext: 'Conteneurs certifiés avec traitement frigorifique expédiés via le canal de Suez vers Singapour, la Malaisie, l’Inde, la Chine et le Vietnam.',
      transitTimeEstimate: 'Service direct de 14 à 22 jours'
    },
    es: {
      regionName: 'Asia-Pacífico y Extremo Oriente',
      heroHeadline: 'Cítricos con protocolo de tratamiento en frío hacia Asia',
      regionalSubtext: 'Contenedores refrigerados certificados enviados vía Canal de Suez a Singapur, Malasia, India, China y Vietnam con documentación fitosanitaria completa.',
      transitTimeEstimate: 'Servicio directo de 14 a 22 días'
    },
    de: {
      regionName: 'Asien-Pazifik & Ferner Osten',
      heroHeadline: 'Kältebehandlungsprotokoll-Zitrusfrüchte & Premiumware nach Asien',
      regionalSubtext: 'Zertifizierte Kältebehandlungs-Container über den Sueskanal nach Singapur, Malaysia, Indien, China und Vietnam mit vollständigen Zertifikaten.',
      transitTimeEstimate: '14 bis 22 Tage direkter Liniendienst'
    },
    ru: {
      regionName: 'Азиатско-Тихоокеанский регион и Дальний Восток',
      heroHeadline: 'Цитрусовые с протоколом холодовой обработки в Азию',
      regionalSubtext: 'Сертифицированные рефрижераторные контейнеры через Суэцкий канал в Сингапур, Малайзию, Индию, Китай и Вьетнам с полной фитосанитарной документацией.',
      transitTimeEstimate: '14-22 дня регулярными рейсами'
    }
  }
};

const VIEW_TEXTS: Record<Language, {
  backBtn: string;
  gatewayBadge: string;
  submitRfqPrefix: string;
  routesTitle: string;
  dischargePortsLabel: string;
  transitDurationLabel: string;
  complianceTitle: string;
}> = {
  ar: {
    backBtn: 'العودة لجميع وجهات الشحن',
    gatewayBadge: 'البوابة الإقليمية المخصصة للتصدير',
    submitRfqPrefix: 'اطلب عرض سعر شحنة لـ',
    routesTitle: 'المسارات البحرية وموانئ الوصول',
    dischargePortsLabel: 'موانئ التفريغ المباشرة:',
    transitDurationLabel: 'مدة الإبحار المباشر:',
    complianceTitle: 'معايير واشتراطات الاعتماد الإقليمية'
  },
  en: {
    backBtn: 'Back to All Destinations',
    gatewayBadge: 'Dedicated Regional Export Gateway',
    submitRfqPrefix: 'Submit RFQ for',
    routesTitle: 'Key Maritime Routes & Discharge Ports',
    dischargePortsLabel: 'Direct Discharge Ports:',
    transitDurationLabel: 'Transit Duration:',
    complianceTitle: 'Regional Compliance Standards'
  },
  fr: {
    backBtn: 'Retour à toutes les destinations',
    gatewayBadge: 'Passerelle Régionale Dédiée à l’Exportation',
    submitRfqPrefix: 'Demander un devis pour',
    routesTitle: 'Lignes maritimes clés & ports de déchargement',
    dischargePortsLabel: 'Ports de déchargement direct :',
    transitDurationLabel: 'Durée du transit :',
    complianceTitle: 'Normes de conformité régionales'
  },
  es: {
    backBtn: 'Volver a todos los destinos',
    gatewayBadge: 'Portal Regional Especializado de Exportación',
    submitRfqPrefix: 'Solicitar cotización para',
    routesTitle: 'Rutas marítimas y puertos de descarga clave',
    dischargePortsLabel: 'Puertos de descarga directa:',
    transitDurationLabel: 'Duración del tránsito:',
    complianceTitle: 'Estándares regionales de cumplimiento'
  },
  de: {
    backBtn: 'Zurück zu allen Zielen',
    gatewayBadge: 'Regionales Export-Gateway',
    submitRfqPrefix: 'Angebot anfordern für',
    routesTitle: 'Haupthäfen & Seerouten',
    dischargePortsLabel: 'Direkte Entladungshäfen:',
    transitDurationLabel: 'Transportdauer:',
    complianceTitle: 'Regionale Konformitätsstandards'
  },
  ru: {
    backBtn: 'Назад ко всем направлениям',
    gatewayBadge: 'Региональный экспортный коридор',
    submitRfqPrefix: 'Запросить расчет для',
    routesTitle: 'Основные морские маршруты и порты выгрузки',
    dischargePortsLabel: 'Прямые порты выгрузки:',
    transitDurationLabel: 'Время в пути:',
    complianceTitle: 'Региональные стандарты соответствия'
  }
};

export const MarketLandingView: React.FC<MarketLandingViewProps> = ({
  slug,
  onBack,
  onOpenRFQ,
  lang = 'ar'
}) => {
  const baseMarket = marketLandingPages.find((m) => m.slug === slug) || marketLandingPages[0];
  const localizedData = LOCALIZED_MARKET_DETAILS[slug]?.[lang] || LOCALIZED_MARKET_DETAILS[slug]?.ar;
  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const isRtl = currentLangObj.dir === 'rtl';
  const tV = VIEW_TEXTS[lang] || VIEW_TEXTS.ar;

  const market = {
    ...baseMarket,
    regionName: localizedData?.regionName || baseMarket.regionName,
    heroHeadline: localizedData?.heroHeadline || baseMarket.heroHeadline,
    regionalSubtext: localizedData?.regionalSubtext || baseMarket.regionalSubtext,
    transitTimeEstimate: localizedData?.transitTimeEstimate || baseMarket.transitTimeEstimate
  };

  return (
    <div className="pt-24 pb-20 bg-[#0A1A14] text-white min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#C5A059] hover:text-white bg-[#12241C] border border-white/10 px-4 py-2 rounded-full transition-colors"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{tV.backBtn}</span>
        </button>

        {/* Hero Banner for Market */}
        <div className="bg-[#12241C] border border-white/5 rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-[#0A1A14] border border-[#C5A059]/30 text-[#C5A059] text-xs font-bold px-4 py-1.5 rounded-full">
            <Globe className="w-4 h-4 text-[#C5A059]" />
            <span>{tV.gatewayBadge}: /markets/{market.slug}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display text-white max-w-4xl leading-tight">
            {market.heroHeadline}
          </h1>

          <p className="text-white/70 text-base max-w-3xl leading-relaxed">
            {market.regionalSubtext}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onOpenRFQ()}
              className="bg-[#C5A059] hover:bg-white text-[#0A1A14] font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C5A059]/10"
            >
              <span>{tV.submitRfqPrefix} {market.regionName}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Regional Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Key Ports & Logistics */}
          <div className="bg-[#12241C] border border-white/5 rounded-3xl p-8 space-y-4 shadow-xl">
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Ship className="w-5 h-5 text-[#C5A059]" />
              <span>{tV.routesTitle}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-[#0A1A14] rounded-2xl border border-white/10">
                <span className="text-white/40 block mb-1">{tV.dischargePortsLabel}</span>
                <p className="text-white font-bold">{market.keyPorts.join(' • ')}</p>
              </div>

              <div className="p-4 bg-[#0A1A14] rounded-2xl border border-white/10 flex justify-between items-center">
                <span className="text-white/50">{tV.transitDurationLabel}</span>
                <span className="text-[#C5A059] font-bold">{market.transitTimeEstimate}</span>
              </div>
            </div>
          </div>

          {/* Compliance & Standards */}
          <div className="bg-[#12241C] border border-white/5 rounded-3xl p-8 space-y-4 shadow-xl">
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
              <span>{tV.complianceTitle}</span>
            </h3>

            <ul className="space-y-2.5 text-xs text-white/70">
              {market.complianceStandards.map((std, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>{std}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
