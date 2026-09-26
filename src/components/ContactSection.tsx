import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageSquare, Globe, ArrowRight, MapPin, ExternalLink } from 'lucide-react';
import { Language, t } from '../lib/i18n';
import { fetchCompanySettings } from '../lib/api';
import { CompanySettings } from '../types';

interface ContactSectionProps {
  onOpenRFQ: () => void;
  lang: Language;
  companySettings?: CompanySettings;
}

const CONTACT_TEXTS: Record<Language, {
  hubTitle: string;
  hubDesc: string;
  stationTitle: string;
  stationDesc: string;
  responseLabel: string;
  responseTime: string;
  liveMapBtn: string;
}> = {
  ar: {
    hubTitle: 'مركز التصدير بموانئ الإسكندرية وبورسعيد',
    hubDesc: 'تدار كافة العمليات والتحميل بالقرب من ميناء الإسكندرية وميناء الدخيلة وبورسعيد لضمان سرعة الشحن على سفن الحاويات المبردة.',
    stationTitle: 'محطات فرز وتعبئة أفيا لينك المعتمدة',
    stationDesc: 'شحن بحري وجوي مباشر إلى الموانئ الأوروبية والخليجية وموانئ البحر الأحمر.',
    responseLabel: 'متوسط زمن الرد على عروض الأسعار:',
    responseTime: 'خلال 24 ساعة كحد أقصى',
    liveMapBtn: 'عرض الموقع الحي على خرائط جوجل'
  },
  en: {
    hubTitle: 'Alexandria & Port Said Export Maritime Hub',
    hubDesc: 'Operations managed adjacent to Alexandria Port, El-Dekheila, and Port Said for immediate ocean reefer vessel loading.',
    stationTitle: 'AviaLink Certified Cold-Chain Packing Stations',
    stationDesc: 'Direct maritime and air dispatch to European, GCC, and global ports.',
    responseLabel: 'Average RFQ Response Time:',
    responseTime: 'Within 24 Hours',
    liveMapBtn: 'Open Live Location on Google Maps'
  },
  fr: {
    hubTitle: 'Pôle d’exportation maritime d’Alexandrie & Port-Saïd',
    hubDesc: 'Opérations gérées à proximité des ports d’Alexandrie et de Port-Saïd pour un chargement immédiat sur navires frigorifiques.',
    stationTitle: 'Stations de conditionnement certifiées AviaLink',
    stationDesc: 'Expédition directe vers les ports européens, méditerranéens et du Golfe.',
    responseLabel: 'Délai moyen de réponse aux devis :',
    responseTime: 'Moins de 24 heures',
    liveMapBtn: 'Voir l’emplacement en direct sur Google Maps'
  },
  es: {
    hubTitle: 'Centro de exportación de Alejandría y Port Said',
    hubDesc: 'Operaciones gestionadas cerca de los puertos de Alejandría y Port Said para carga inmediata en buques frigoríficos.',
    stationTitle: 'Estaciones de embalaje y frío certificadas AviaLink',
    stationDesc: 'Despacho marítimo directo a puertos europeos, del Golfo y mundiales.',
    responseLabel: 'Tiempo medio de respuesta (RFQ):',
    responseTime: 'En menos de 24 horas',
    liveMapBtn: 'Ver ubicación en vivo en Google Maps'
  },
  de: {
    hubTitle: 'Export-Drehkreuz Alexandria & Port Said',
    hubDesc: 'Standorte an den Haupthäfen Alexandria und Port Said für direkte Beladung moderner Kühlschiffe.',
    stationTitle: 'Zertifizierte AviaLink Kühl- und Packstationen',
    stationDesc: 'Direkte See- und Luftfrachtanbindung an europäische und weltweite Häfen.',
    responseLabel: 'Durchschnittliche Antwortzeit:',
    responseTime: 'Innerhalb von 24 Stunden',
    liveMapBtn: 'Live-Standort auf Google Maps öffnen'
  },
  ru: {
    hubTitle: 'Экспортный логистический узел Александрии и Порт-Саида',
    hubDesc: 'Координация отгрузок вблизи портов Александрии и Порт-Саида для быстрой погрузки на рефрижераторные суда.',
    stationTitle: 'Сертифицированные упаковочные станции AviaLink',
    stationDesc: 'Прямые морские и авиаперевозки в порты Европы, стран Залива и мира.',
    responseLabel: 'Время ответа на заявку (RFQ):',
    responseTime: 'В течение 24 часов',
    liveMapBtn: 'Открыть геолокацию на Google Maps'
  }
};

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenRFQ, lang = 'ar', companySettings }) => {
  const isRtl = lang === 'ar';
  const cTxt = CONTACT_TEXTS[lang] || CONTACT_TEXTS.ar;

  const [settings, setSettings] = useState<CompanySettings>(() => companySettings || {
    phone: '(03) 11345627',
    email: 'export@avialink.com',
    whatsappNumber: '+20 100 000 0000',
    whatsappLink: 'https://wa.me/201000000000',
    hotline: '+20 10 933 933 55',
    websiteUrl: 'avialink.com',
    locationText: {
      ar: 'المنطقة اللوجستية الزراعية، طريق مصر إسكندرية الصحراوي، مصر',
      en: 'Agricultural Logistics Hub, Cairo-Alexandria Desert Road, Egypt',
      fr: 'Pôle logistique agricole, Route Le Caire-Alexandrie, Égypte',
      es: 'Centro logístico agrícola, Carretera El Cairo-Alejandría, Egipto',
      de: 'Agrarlogistikzentrum, Wüstenstraße Kairo-Alexandria, Ägypten',
      ru: 'Агрологистический узел, трасса Каир-Александрия, Египет'
    },
    liveLocationUrl: 'https://maps.google.com/?q=Alexandria+Port,Egypt',
    mapEmbedUrl: '',
    socialLinks: {
      facebook: 'https://facebook.com/avialink',
      twitter: 'https://x.com/avialink',
      linkedin: 'https://linkedin.com/company/avialink',
      instagram: 'https://instagram.com/avialink',
      youtube: 'https://youtube.com/@avialink'
    }
  });

  useEffect(() => {
    if (companySettings) {
      setSettings(companySettings);
    } else {
      fetchCompanySettings().then(setSettings).catch(console.error);
    }
  }, [companySettings]);

  const localizedLocation = settings.locationText[lang] || settings.locationText.ar || settings.locationText.en;

  return (
    <section className="py-16 bg-slate-100 text-slate-900" id="contact" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase">
            {t('contact_badge', lang)}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-[#0F2133]">
            {t('contact_title', lang)}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('contact_sub', lang)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Direct Operations Contact Cards */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-xl font-bold font-display text-[#0F2133]">
                {t('contact_title', lang)}
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <Phone className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#0F2133] block">{t('contact_phone_label', lang)}</span>
                    <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} dir="ltr" className="text-slate-700 font-bold mt-0.5 text-sm hover:text-[#C5A059] transition-colors block">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <Mail className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#0F2133] block">{t('contact_email_label', lang)}</span>
                    <a href={`mailto:${settings.email}`} className="text-[#C5A059] font-bold hover:underline text-sm block mt-0.5">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#0F2133] block">{t('contact_whatsapp_label', lang)}</span>
                    <a
                      href={settings.whatsappLink || `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 font-bold hover:underline text-sm block mt-0.5"
                    >
                      {settings.whatsappNumber}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#0F2133] block">{t('footer_address', lang)}</span>
                    <p className="text-slate-700 font-medium mt-0.5 text-xs leading-relaxed">
                      {localizedLocation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0F2133] text-white rounded-3xl p-6 sm:p-8 space-y-3 shadow-md">
              <h4 className="font-bold text-white text-base">{t('hero_btn_rfq', lang)}</h4>
              <p className="text-xs text-slate-300">
                {t('rfq_subtitle', lang)}
              </p>
              <button
                onClick={onOpenRFQ}
                className="w-full bg-[#C5A059] hover:bg-[#b08d4a] text-white font-bold py-3 px-6 rounded-full text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>{t('hero_btn_rfq', lang)}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right: Map / Port Location Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-4 shadow-sm">
            <div>
              <h3 className="text-xl font-bold font-display text-[#0F2133] mb-2">
                {cTxt.hubTitle}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {cTxt.hubDesc}
              </p>

              {/* Styled Visual Port Map Card with Live Location button */}
              <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                <div className="text-center p-6 space-y-3 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#0F2133] text-[#C5A059] flex items-center justify-center mx-auto">
                    <Globe className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F2133]">{cTxt.stationTitle}</h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                      {localizedLocation}
                    </p>
                  </div>
                  {settings.liveLocationUrl && (
                    <a
                      href={settings.liveLocationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F2133] hover:bg-[#1a334d] text-[#C5A059] text-xs font-bold rounded-full transition-all shadow-sm"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{cTxt.liveMapBtn}</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 flex justify-between items-center">
              <span>{cTxt.responseLabel}</span>
              <span className="text-[#C5A059] font-bold">{cTxt.responseTime}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

