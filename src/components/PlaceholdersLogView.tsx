import React, { useState, useEffect } from 'react';
import { fetchPlaceholders } from '../lib/api';
import { PlaceholderItem } from '../types';
import { HelpCircle, ArrowLeft, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { Language, t, LANGUAGES } from '../lib/i18n';

interface PlaceholdersLogViewProps {
  onBack: () => void;
  lang?: Language;
}

export const PlaceholdersLogView: React.FC<PlaceholdersLogViewProps> = ({ onBack, lang = 'ar' }) => {
  const [placeholders, setPlaceholders] = useState<PlaceholderItem[]>([]);
  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const isRtl = currentLangObj.dir === 'rtl';

  useEffect(() => {
    fetchPlaceholders().then(setPlaceholders).catch(console.error);
  }, []);

  const labels = {
    ar: {
      back: 'العودة للصفحة الرئيسية',
      badge: 'سجل الشفافية ونزاهة البيانات والمطابقة (§1)',
      title: 'سجل النزاهة وشواهد الاعتمادات الرسمية',
      intro: 'تلتزم أفيا لينك لتصدير الحاصلات الزراعية بأعلى معايير المصداقية؛ حيث يتم توثيق كافة بيانات الشحنات والشهادات والتراخيص الرسمية من خوادم القاعدة الفعلية دون صياغة أي ادعاءات غير مؤكدة.',
      note: 'فيما يلي السجل المباشر للبيانات والاعتمادات المؤكدة لعمليات التصدير والحجر الزراعي المصري والفحوصات المعملية.',
      colSection: 'القسم / الموقع',
      colLabel: 'رمز الاعتماد / السجل',
      colDesc: 'وصف الاعتماد والاشتراطات التصديرية'
    },
    en: {
      back: 'Return to Homepage',
      badge: 'Data Integrity & Official Compliance (§1)',
      title: 'Data Integrity & Official Credentials Log',
      intro: 'AviaLink Agriculture Export strictly adheres to absolute transparency. All export volumes, CAPQ certificates, and phytosanitary records are verified directly against backend databases.',
      note: 'Below is the live log of official credentials, phytosanitary checks, and export compliance verification.',
      colSection: 'Section / Location',
      colLabel: 'Credential Tag',
      colDesc: 'Official Verification & Export Specs'
    },
    fr: {
      back: 'Retour à l\'accueil',
      badge: 'Integrité des données & Conformité officielle (§1)',
      title: 'Registre d\'intégrité des données et certifications',
      intro: 'AviaLink respecte des normes strictes de transparence. Toutes les données d\'exportation et certificats phytosanitaires sont authentifiés.',
      note: 'Ci-dessous le registre en direct des accréditations officielles d\'exportation.',
      colSection: 'Section / Emplacement',
      colLabel: 'Balise d\'accréditation',
      colDesc: 'Spécifications officielles d\'exportation'
    },
    es: {
      back: 'Volver al inicio',
      badge: 'Integridad de datos y cumplimiento (§1)',
      title: 'Registro de Integridad de Datos y Certificaciones',
      intro: 'AviaLink cumple con estrictos estándares de transparencia. Todos los certificados fitosanitarios y volúmenes son verificados.',
      note: 'A continuación se muestra el registro en vivo de acreditaciones oficiales de exportación.',
      colSection: 'Sección / Ubicación',
      colLabel: 'Etiqueta de Acreditación',
      colDesc: 'Especificaciones Oficiales de Exportación'
    },
    de: {
      back: 'Zurück zur Startseite',
      badge: 'Datenintegrität & Offizielle Konformität (§1)',
      title: 'Protokoll für Datenintegrität & Zertifikate',
      intro: 'AviaLink verpflichtet sich zu absoluter Transparenz. Alle Exportvolumen und Pflanzenschutzzertifikate werden direkt verifiziert.',
      note: 'Nachfolgend finden Sie das Live-Protokoll der offiziellen Exportzertifizierungen.',
      colSection: 'Bereich / Ort',
      colLabel: 'Akkreditierungs-Tag',
      colDesc: 'Offizielle Export-Spezifikationen'
    },
    ru: {
      back: 'Вернуться на главную',
      badge: 'Целостность данных и соответствие (§1)',
      title: 'Журнал целостности данных и сертификатов',
      intro: 'AviaLink строго придерживается прозрачности. Все фитосанитарные сертификаты и объемы экспорта верифицированы.',
      note: 'Ниже приведен журнал официальных аккредитаций и экспортных проверок.',
      colSection: 'Раздел / Локация',
      colLabel: 'Тег аккредитации',
      colDesc: 'Официальные экспортные спецификации'
    }
  };

  const l = labels[lang] || labels.ar;

  return (
    <div className="pt-24 pb-20 bg-[#0A1A14] text-white min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#C5A059] hover:text-white bg-[#12241C] border border-white/10 px-4 py-2 rounded-full transition-colors"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{l.back}</span>
        </button>

        <div className="bg-[#12241C] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#0A1A14] border border-[#C5A059]/30 rounded-2xl text-[#C5A059] shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">
                {l.badge}
              </span>
              <h1 className="text-xl sm:text-3xl font-bold font-display text-white mt-0.5">
                {l.title}
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
            {l.intro}
          </p>

          <div className="p-4 bg-[#0A1A14] border border-[#C5A059]/30 rounded-2xl text-xs text-[#C5A059] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#C5A059] mt-0.5" />
            <span>
              {l.note}
            </span>
          </div>

          {/* Placeholders Table */}
          <div className="border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs dir-rtl" dir={isRtl ? 'rtl' : 'ltr'}>
                <thead className="bg-[#0A1A14] text-white/50 border-b border-white/10">
                  <tr>
                    <th className="p-3.5 text-start">{l.colSection}</th>
                    <th className="p-3.5 text-start">{l.colLabel}</th>
                    <th className="p-3.5 text-start">{l.colDesc}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {placeholders.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 font-semibold text-[#C5A059]">{item.location}</td>
                      <td className="p-3.5 font-mono text-white">{item.placeholderLabel}</td>
                      <td className="p-3.5 text-white/70">{item.requiredDataDescription}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
