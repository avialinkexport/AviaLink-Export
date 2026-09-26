import React from 'react';
import { Product } from '../types';
import { trackEvent } from '../lib/analytics';
import { X, FileText, ShieldCheck, Printer } from 'lucide-react';
import { Language, t, LANGUAGES, getLocalizedProduct } from '../lib/i18n';

interface SpecSheetModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRFQ: (productName: string) => void;
  lang?: Language;
}

const SPEC_TEXTS: Record<Language, {
  specTitle: string;
  downloadPrint: string;
  dossierSubtitle: string;
  cropOriginTitle: string;
  qualityParamsTitle: string;
  labSpecsTitle: string;
  tableParam: string;
  tableStandard: string;
}> = {
  ar: {
    specTitle: 'بطاقة المواصفات الفنية',
    downloadPrint: 'طباعة / حفظ PDF',
    dossierSubtitle: 'ملف الفحص الحجري والمواصفات التصديرية — المنشأ: جمهورية مصر العربية',
    cropOriginTitle: 'بيانات المحصول والمنشأ',
    qualityParamsTitle: 'معايير الجودة والأحجام',
    labSpecsTitle: 'الفحوصات المعملية والاشتراطات الصحية',
    tableParam: 'المعيار / الفحص',
    tableStandard: 'المواصفة والنسبة'
  },
  en: {
    specTitle: 'Specification Sheet',
    downloadPrint: 'Download / Print',
    dossierSubtitle: 'Phytosanitary & Export Specification Dossier — Egypt Origin',
    cropOriginTitle: 'Crop & Origin Profile',
    qualityParamsTitle: 'Quality & Size Parameters',
    labSpecsTitle: 'Phytosanitary & Lab Specifications',
    tableParam: 'Parameter',
    tableStandard: 'Standard / Limit'
  },
  fr: {
    specTitle: 'Fiche Technique de Spécification',
    downloadPrint: 'Imprimer / Enregistrer PDF',
    dossierSubtitle: 'Dossier phytosanitaire et spécifications d’exportation — Origine Égypte',
    cropOriginTitle: 'Profil de la culture et origine',
    qualityParamsTitle: 'Paramètres de qualité et calibres',
    labSpecsTitle: 'Spécifications phytosanitaires et de laboratoire',
    tableParam: 'Paramètre',
    tableStandard: 'Norme / Seuil'
  },
  es: {
    specTitle: 'Ficha Técnica de Especificaciones',
    downloadPrint: 'Imprimir / Guardar PDF',
    dossierSubtitle: 'Dossier fitosanitario y especificaciones de exportación — Origen Egipto',
    cropOriginTitle: 'Perfil del cultivo y origen',
    qualityParamsTitle: 'Parámetros de calidad y calibres',
    labSpecsTitle: 'Especificaciones fitosanitarias y de laboratorio',
    tableParam: 'Parámetro',
    tableStandard: 'Norma / Límite'
  },
  de: {
    specTitle: 'Technisches Datenblatt',
    downloadPrint: 'Drucken / PDF speichern',
    dossierSubtitle: 'Pflanzenschutz- und Exportspezifikationsdossier — Herkunft Ägypten',
    cropOriginTitle: 'Erntegut- & Herkunftsprofil',
    qualityParamsTitle: 'Qualitäts- und Größenparameter',
    labSpecsTitle: 'Pflanzenschutz- und Laborspezifikationen',
    tableParam: 'Parameter',
    tableStandard: 'Standard / Grenzwert'
  },
  ru: {
    specTitle: 'Лист технических спецификаций',
    downloadPrint: 'Печать / Сохранить PDF',
    dossierSubtitle: 'Фитосанитарное и экспортное досье — Происхождение Египет',
    cropOriginTitle: 'Профиль культуры и происхождение',
    qualityParamsTitle: 'Параметры качества и калибры',
    labSpecsTitle: 'Фитосанитарные и лабораторные спецификации',
    tableParam: 'Параметр',
    tableStandard: 'Стандарт / Лимит'
  }
};

export const SpecSheetModal: React.FC<SpecSheetModalProps> = ({
  product: rawProduct,
  isOpen,
  onClose,
  onOpenRFQ,
  lang = 'ar'
}) => {
  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const isRtl = currentLangObj.dir === 'rtl';
  const txt = SPEC_TEXTS[lang] || SPEC_TEXTS.ar;

  // Keyboard accessibility: Escape to close
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !rawProduct) return null;
  const product = getLocalizedProduct(rawProduct, lang);

  const handlePrint = () => {
    trackEvent('spec_download', { product: product.name });
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in print:p-0 print:bg-white print:static" 
      dir={isRtl ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      aria-labelledby="spec-sheet-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#12241C] print:bg-white print:text-black border border-white/10 text-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Floating Screen-Only Sticky Close Button on Top Corner */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold shadow-lg transition-all active:scale-95 print:hidden cursor-pointer`}
          title={isRtl ? 'إغلاق نافذة المواصفات (Esc)' : 'Close Specification Sheet (Esc)'}
        >
          <X className="w-4 h-4" />
          <span>{isRtl ? 'خروج' : 'Close'}</span>
        </button>

        {/* Header - Screen only */}
        <div className="bg-[#0A1A14] px-6 py-5 border-b border-white/10 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#C5A059]" />
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase">
                {txt.specTitle}
              </span>
              <h2 className="text-xl font-bold font-display text-white">
                {product.name}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-[#C5A059] hover:bg-white text-[#0A1A14] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{txt.downloadPrint}</span>
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1 px-3 py-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-red-600/80 transition-colors text-xs font-bold cursor-pointer"
              aria-label="Close modal"
              title={isRtl ? 'إغلاق' : 'Close'}
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">{isRtl ? 'إغلاق' : 'Close'}</span>
            </button>
          </div>
        </div>

        {/* Spec Sheet Body (Printable Document Layout) */}
        <div className="p-6 space-y-6 print:text-black">
          
          {/* Printable Document Header */}
          <div className="border-b border-white/10 print:border-black pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold font-display tracking-wider text-white print:text-black uppercase">
                AVIALINK <span className="text-[#C5A059]">AGRICULTURAL EXPORT</span>
              </h1>
              <p className="text-xs text-[#C5A059] print:text-gray-700 font-semibold">
                {txt.dossierSubtitle}
              </p>
            </div>
            <div className="text-right text-xs text-white/50 print:text-gray-600">
              <p>Ref: {product.specificationSheet?.pdfName || `AVIALINK-${product.slug.toUpperCase()}-2026`}</p>
            </div>
          </div>

          {/* Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-[#C5A059] print:text-emerald-800 uppercase tracking-wider mb-2">
                {txt.cropOriginTitle}
              </h3>
              <p className="text-xs text-white/70 print:text-gray-800 leading-relaxed mb-4">
                {product.shortDescription}
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-white/10 print:border-gray-300 py-1">
                  <span className="text-white/50 print:text-gray-600">{t('prod_origin', lang)}:</span>
                  <span className="font-semibold text-white print:text-black">{product.origin}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 print:border-gray-300 py-1">
                  <span className="text-white/50 print:text-gray-600">{t('prod_hscode', lang)}:</span>
                  <span className="font-mono text-[#C5A059] print:text-black font-semibold">{product.hsCode || '071420'}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 print:border-gray-300 py-1">
                  <span className="text-white/50 print:text-gray-600">{t('prod_moq', lang)}:</span>
                  <span className="font-semibold text-white print:text-black">{product.MOQ}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0A1A14] print:bg-gray-50 border border-white/10 print:border-gray-300 rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#C5A059] print:text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>{txt.qualityParamsTitle}</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-white/50 print:text-gray-600 block">{t('prod_varieties', lang)}:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.varieties?.map((v) => (
                      <span key={v} className="bg-[#12241C] print:bg-gray-200 text-[#C5A059] print:text-black border border-white/10 px-2.5 py-1 rounded-full text-[11px] font-medium">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-white/50 print:text-gray-600 block">{t('prod_sizes', lang)}:</span>
                  <span className="text-white/80 print:text-gray-800">{product.sizes?.join(' | ') || ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specs Details Table */}
          <div>
            <h3 className="text-sm font-bold text-[#C5A059] print:text-emerald-800 uppercase tracking-wider mb-2">
              {txt.labSpecsTitle}
            </h3>
            <div className="border border-white/10 print:border-gray-400 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A1A14] print:bg-gray-200 text-white/50 print:text-black border-b border-white/10 print:border-gray-400">
                  <tr>
                    <th className="p-3 font-semibold">{txt.tableParam}</th>
                    <th className="p-3 font-semibold">{txt.tableStandard}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-gray-300">
                  {product.specificationSheet?.details?.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-[#12241C]/50 print:bg-white' : 'bg-[#0A1A14]/50 print:bg-gray-50'}>
                      <td className="p-3 font-medium text-white/70 print:text-gray-900">{item.label}</td>
                      <td className="p-3 text-white print:text-black font-semibold">
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Action - Screen only */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <button
              onClick={() => {
                onClose();
                onOpenRFQ(product.name);
              }}
              className="w-full sm:w-auto bg-[#C5A059] hover:bg-white text-[#0A1A14] font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all"
            >
              {t('rfq_title', lang)} ({product.name})
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-red-950/60 text-slate-200 hover:text-white border border-slate-700 hover:border-red-500/50 font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              <X className="w-4 h-4 text-red-400" />
              <span>{lang === 'ar' ? 'إغلاق البطاقة والخروج' :
               lang === 'fr' ? 'Fermer la fiche' :
               lang === 'es' ? 'Cerrar ficha' :
               lang === 'de' ? 'Schließen & Zurück' :
               lang === 'ru' ? 'Закрыть и выйти' : 'Close & Exit'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

