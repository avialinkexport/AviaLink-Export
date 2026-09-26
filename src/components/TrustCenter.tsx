import React, { useState, useEffect } from 'react';
import { CertificationItem } from '../types';
import { fetchCertifications } from '../lib/api';
import { Award } from 'lucide-react';
import { Language, t } from '../lib/i18n';

interface TrustCenterProps {
  onOpenRFQ: () => void;
  lang: Language;
}

const TRUST_LOCALIZATION: Record<Language, {
  capqCompliance: string;
  issuedByLabel: string;
  verifiedBadge: string;
  activeBadge: string;
}> = {
  ar: {
    capqCompliance: 'الإدارة المركزية للحجر الزراعي المصري (CAPQ) والتزام كامل بحدود متبقيات المبيدات MRL.',
    issuedByLabel: 'الجهة المصدرة:',
    verifiedBadge: 'معتمد وموثق',
    activeBadge: 'ساري'
  },
  en: {
    capqCompliance: 'Central Administration of Plant Quarantine (CAPQ) & MRL Compliance.',
    issuedByLabel: 'Issued By:',
    verifiedBadge: 'Verified',
    activeBadge: 'Active'
  },
  fr: {
    capqCompliance: 'Administration Centrale de Quarantaine Végétale (CAPQ) et conformité LMR.',
    issuedByLabel: 'Délivré par :',
    verifiedBadge: 'Vérifié',
    activeBadge: 'Actif'
  },
  es: {
    capqCompliance: 'Administración Central de Cuarentena Vegetal (CAPQ) y cumplimiento de LMR.',
    issuedByLabel: 'Emitido por:',
    verifiedBadge: 'Verificado',
    activeBadge: 'Activo'
  },
  de: {
    capqCompliance: 'Zentralverwaltung für Pflanzenschutzquarantäne (CAPQ) & MRL-Konformität.',
    issuedByLabel: 'Ausgestellt von:',
    verifiedBadge: 'Verifiziert',
    activeBadge: 'Aktiv'
  },
  ru: {
    capqCompliance: 'Центральная администрация карантина растений (CAPQ) и соблюдение нормативов MRL.',
    issuedByLabel: 'Кем выдано:',
    verifiedBadge: 'Подтверждено',
    activeBadge: 'Действует'
  }
};

export const TrustCenter: React.FC<TrustCenterProps> = ({ onOpenRFQ, lang = 'ar' }) => {
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const tLocal = TRUST_LOCALIZATION[lang] || TRUST_LOCALIZATION.ar;

  useEffect(() => {
    fetchCertifications().then(setCertifications).catch(console.error);
  }, []);

  const isRtl = lang === 'ar';

  return (
    <section className="py-16 bg-white text-slate-900" id="quality" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase">
            {t('trust_badge', lang)}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-[#0F2133]">
            {t('trust_title', lang)}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('trust_sub', lang)}
          </p>
        </div>

        {/* Quality Control Storytelling 4-Stage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 relative overflow-hidden shadow-sm">
            <span className={`text-3xl font-black font-display text-slate-200 absolute top-4 ${isRtl ? 'left-4' : 'right-4'}`}>01</span>
            <div className="w-10 h-10 rounded-full bg-[#0F2133] text-[#C5A059] font-bold flex items-center justify-center">
              1
            </div>
            <h3 className="text-base font-bold text-[#0F2133]">{t('trust_step1_title', lang)}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('trust_step1_desc', lang)}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 relative overflow-hidden shadow-sm">
            <span className={`text-3xl font-black font-display text-slate-200 absolute top-4 ${isRtl ? 'left-4' : 'right-4'}`}>02</span>
            <div className="w-10 h-10 rounded-full bg-[#0F2133] text-[#C5A059] font-bold flex items-center justify-center">
              2
            </div>
            <h3 className="text-base font-bold text-[#0F2133]">{t('trust_step2_title', lang)}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('trust_step2_desc', lang)}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 relative overflow-hidden shadow-sm">
            <span className={`text-3xl font-black font-display text-slate-200 absolute top-4 ${isRtl ? 'left-4' : 'right-4'}`}>03</span>
            <div className="w-10 h-10 rounded-full bg-[#0F2133] text-[#C5A059] font-bold flex items-center justify-center">
              3
            </div>
            <h3 className="text-base font-bold text-[#0F2133]">{t('trust_step3_title', lang)}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('trust_step3_desc', lang)}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 relative overflow-hidden shadow-sm">
            <span className={`text-3xl font-black font-display text-slate-200 absolute top-4 ${isRtl ? 'left-4' : 'right-4'}`}>04</span>
            <div className="w-10 h-10 rounded-full bg-[#0F2133] text-[#C5A059] font-bold flex items-center justify-center">
              4
            </div>
            <h3 className="text-base font-bold text-[#0F2133]">{t('trust_step4_title', lang)}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('trust_step4_desc', lang)}
            </p>
          </div>
        </div>

        {/* Real Certifications Grid */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl font-bold text-[#0F2133] flex items-center gap-2">
                <Award className="w-6 h-6 text-[#C5A059]" />
                <span>{t('trust_certs_title', lang)}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {tLocal.capqCompliance}
              </p>
            </div>
            <button
              onClick={onOpenRFQ}
              className="bg-[#0F2133] hover:bg-[#182C42] text-white text-xs font-bold py-2.5 px-5 rounded-full transition-all"
            >
              {t('trust_audit_btn', lang)}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                      {cert.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        cert.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {cert.status === 'Verified' ? tLocal.verifiedBadge : tLocal.activeBadge}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#0F2133]">{cert.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{cert.description}</p>
                </div>

                {cert.issuedBy && (
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                    <strong className="text-slate-700">{tLocal.issuedByLabel}</strong> {cert.issuedBy}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};


