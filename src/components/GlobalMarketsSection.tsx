import React, { useState } from 'react';
import { marketLandingPages } from '../data/markets';
import { Ship, ArrowRight, CheckCircle2, Clock, Shield } from 'lucide-react';
import { Language, t, LANGUAGES } from '../lib/i18n';

interface GlobalMarketsSectionProps {
  onOpenRFQ: (productName?: string) => void;
  onNavigateMarket: (marketSlug: string) => void;
  lang: Language;
}

const LOCALIZED_MARKETS: Record<string, Record<Language, {
  regionName: string;
  heroHeadline: string;
  regionalSubtext: string;
  transitTimeEstimate: string;
}>> = {
  europe: {
    ar: {
      regionName: 'الاتحاد الأوروبي والمملكة المتحدة',
      heroHeadline: 'حاصلات زراعية مصرية مطابقة للاشتراطات الأوروبية مباشرة للموانئ الأوروبية',
      regionalSubtext: 'خطوط شحن مبردة مباشرة من الإسكندرية وبورسعيد إلى روتردام وهامبورغ وكوبر وفوس ومرسيليا وفيليكسستو. التزام كامل بحدود MRL وشهادات GlobalGAP وتتبع درجات الحرارة.',
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

const SECTION_TEXTS: Record<Language, {
  corridorBadge: string;
  complianceTitle: string;
  popularCrops: string;
  pipelineSub: string;
  step5Title: string;
  step5Desc: string;
  step6Title: string;
  step6Desc: string;
}> = {
  ar: {
    corridorBadge: 'ممر لوجستي سريع ومباشر',
    complianceTitle: 'معايير الامتثال والجودة الإقليمية',
    popularCrops: 'أهم المحاصيل المطلوبة:',
    pipelineSub: 'فحص الحجر الزراعي CAPQ واختبارات متبقيات المبيدات MRL والنقل المبرد المتكامل.',
    step5Title: 'التخليص الجمركي وتجهيز الحاويات',
    step5Desc: 'التخليص الجمركي السريع وتعبئة الحاويات المبردة (Reefer Containers) وتنشيط مسجلات الحرارة.',
    step6Title: 'الشحن البحري المباشر للموانئ',
    step6Desc: 'شحن بحري سريع ومباشر لموانئ روتردام، هامبورغ، جدة، ورافينا مع المتابعة اللحظية.'
  },
  en: {
    corridorBadge: 'Express Logistics Corridor',
    complianceTitle: 'Regional Compliance Standards',
    popularCrops: 'Popular Crops:',
    pipelineSub: 'CAPQ Plant Quarantine clearance, MRL residue testing & integrated cold-chain transport.',
    step5Title: 'Customs Clearance & Container Stuffing',
    step5Desc: 'Fast-track customs clearance, professional reefer container stuffing, and temperature logger activation.',
    step6Title: 'Direct Ocean Freight & Port Delivery',
    step6Desc: 'Fast direct ocean freight to Rotterdam, Hamburg, Jeddah, Ravenna with live vessel tracking.'
  },
  fr: {
    corridorBadge: 'Couloir Logistique Express',
    complianceTitle: 'Normes Régionales de Conformité',
    popularCrops: 'Cultures Populaires :',
    pipelineSub: 'Dédouanement phytosanitaire CAPQ, analyses LMR et transport sous chaîne du froid.',
    step5Title: 'Dédouanement & Empotage Frigorifique',
    step5Desc: 'Dédouanement express, empotage professionnel en conteneurs frigorifiques et activation des enregistreurs thermiques.',
    step6Title: 'Fret Maritime Direct & Livraison',
    step6Desc: 'Fret maritime rapide vers Rotterdam, Hambourg, Djeddah, Ravenne avec suivi en direct.'
  },
  es: {
    corridorBadge: 'Corredor Logístico Exprés',
    complianceTitle: 'Estándares Regionales de Conformidad',
    popularCrops: 'Cultivos Populares:',
    pipelineSub: 'Despacho fitosanitario CAPQ, análisis LMR y transporte refrigerado integral.',
    step5Title: 'Despacho Aduanero y Carga Reefer',
    step5Desc: 'Despacho aduanero rápido, carga profesional de contenedores reefer y activación de registradores térmicos.',
    step6Title: 'Flete Marítimo Directo y Entrega',
    step6Desc: 'Flete marítimo directo y rápido a Rotterdam, Hamburgo, Yeda, Rávena con seguimiento en vivo.'
  },
  de: {
    corridorBadge: 'Express-Logistikkorridor',
    complianceTitle: 'Regionale Konformitätsstandards',
    popularCrops: 'Beliebte Feldfrüchte:',
    pipelineSub: 'CAPQ-Pflanzenschutzabfertigung, MRL-Rückstandsanalysen und integrierte Kühlkettenlogistik.',
    step5Title: 'Zollabfertigung & Kühlcontainer-Beladung',
    step5Desc: 'Schnelle Zollabfertigung, fachgerechte Kühlcontainer-Beladung und Aktivierung der Datenlogger.',
    step6Title: 'Direkte Seefracht & Hafenlieferung',
    step6Desc: 'Schnelle Seefracht nach Rotterdam, Hamburg, Dschidda, Ravenna mit Echtzeitverfolgung.'
  },
  ru: {
    corridorBadge: 'Экспресс-логистический коридор',
    complianceTitle: 'Региональные стандарты соответствия',
    popularCrops: 'Популярные культуры:',
    pipelineSub: 'Фитосанитарное оформление CAPQ, тесты MRL и комплексная доставка в холодовой цепи.',
    step5Title: 'Таможенная очистка и погрузка',
    step5Desc: 'Оперативное таможенное оформление, загрузка рефконтейнеров и активация регистраторов температуры.',
    step6Title: 'Прямой морской фрахт и доставка',
    step6Desc: 'Быстрый морской фрахт в порты Роттердам, Гамбург, Джидда, Равенна с отслеживанием судов.'
  }
};

export const GlobalMarketsSection: React.FC<GlobalMarketsSectionProps> = ({
  onOpenRFQ,
  onNavigateMarket,
  lang = 'ar'
}) => {
  const [activeTab, setActiveTab] = useState<string>('europe');
  const baseMarket = marketLandingPages.find((m) => m.slug === activeTab) || marketLandingPages[0];
  const localizedData = LOCALIZED_MARKETS[activeTab]?.[lang] || LOCALIZED_MARKETS[activeTab]?.ar;

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const isRtl = currentLangObj.dir === 'rtl';
  const secTexts = SECTION_TEXTS[lang] || SECTION_TEXTS.ar;

  const activeMarket = {
    ...baseMarket,
    regionName: localizedData?.regionName || baseMarket.regionName,
    heroHeadline: localizedData?.heroHeadline || baseMarket.heroHeadline,
    regionalSubtext: localizedData?.regionalSubtext || baseMarket.regionalSubtext,
    transitTimeEstimate: localizedData?.transitTimeEstimate || baseMarket.transitTimeEstimate
  };

  const EXPORT_STEPS = [
    { step: '01', title: t('trust_step1_title', lang), desc: t('trust_step1_desc', lang) },
    { step: '02', title: t('trust_step2_title', lang), desc: t('trust_step2_desc', lang) },
    { step: '03', title: t('trust_step3_title', lang), desc: t('trust_step3_desc', lang) },
    { step: '04', title: t('trust_step4_title', lang), desc: t('trust_step4_desc', lang) },
    { step: '05', title: secTexts.step5Title, desc: secTexts.step5Desc },
    { step: '06', title: secTexts.step6Title, desc: secTexts.step6Desc }
  ];

  return (
    <section className="py-16 bg-slate-100 text-slate-900" id="markets" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* SECTION 1: Regional Market Destinations */}
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase">
              {t('markets_badge', lang)}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-[#0F2133]">
              {t('markets_title', lang)}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {t('markets_sub', lang)}
            </p>
          </div>

          {/* Regional Tabs */}
          <div className="flex justify-center border-b border-slate-200 pb-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {marketLandingPages.map((market) => {
                const tabTitle = LOCALIZED_MARKETS[market.slug]?.[lang]?.regionName || market.regionName;
                return (
                  <button
                    key={market.slug}
                    onClick={() => setActiveTab(market.slug)}
                    className={`py-2 px-5 text-xs font-bold rounded-full transition-all ${
                      activeTab === market.slug
                        ? 'bg-[#0F2133] text-white shadow font-bold'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {tabTitle}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Market Content Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center shadow-md">
            <div className="lg:col-span-2 space-y-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-[#0F2133] border border-slate-200 inline-block">
                {secTexts.corridorBadge}
              </span>
              <h3 className="text-2xl font-bold font-display text-[#0F2133]">
                {activeMarket.heroHeadline}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {activeMarket.regionalSubtext}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#0F2133]">
                    <Ship className="w-4 h-4 text-[#C5A059]" />
                    <span>{t('markets_ports_label', lang)}</span>
                  </div>
                  <p className="text-slate-600">{activeMarket.keyPorts.join(' • ')}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#0F2133]">
                    <Clock className="w-4 h-4 text-[#C5A059]" />
                    <span>{t('markets_transit_label', lang)}</span>
                  </div>
                  <p className="text-[#C5A059] font-bold">{activeMarket.transitTimeEstimate}</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => onOpenRFQ(activeMarket.popularProducts?.[0] || 'Egyptian Fresh Agricultural Produce')}
                  className="bg-[#C5A059] hover:bg-[#b08d4a] text-white font-bold py-3 px-6 rounded-full text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#C5A059]/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{t('markets_inquire_btn', lang)} ({activeMarket.regionName})</span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateMarket(activeMarket.slug)}
                  className="bg-slate-100 hover:bg-slate-200 text-[#0F2133] border border-slate-300 font-bold py-3 px-5 rounded-full text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>{isRtl ? 'تفاصيل الموانئ والمسار' : 'View Ports & Route'}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-[#0F2133] flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#C5A059]" />
                <span>{secTexts.complianceTitle}</span>
              </h4>

              <ul className="space-y-2 text-slate-700">
                {activeMarket.complianceStandards.map((std, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{std}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block mb-1 font-semibold">{secTexts.popularCrops}</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeMarket.popularProducts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => onOpenRFQ(p)}
                      title={isRtl ? `طلب تسعير لـ ${p}` : `Request quote for ${p}`}
                      className="bg-white hover:bg-[#0F2133] hover:text-[#C5A059] text-[#0F2133] border border-slate-200 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                    >
                      + {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: 6-Step Export Pipeline */}
        <div className="space-y-8" id="process">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase">
              {t('markets_badge', lang)}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-[#0F2133]">
              {t('markets_pipeline_title', lang)}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {secTexts.pipelineSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXPORT_STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-slate-200 hover:border-[#C5A059] rounded-2xl p-6 space-y-2.5 relative group transition-all shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-display text-[#C5A059]">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0F2133]">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};


