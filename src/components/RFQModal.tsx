import React, { useState, useEffect, useRef } from 'react';
import { submitRFQ, fetchCaptchaChallenge } from '../lib/api';
import { trackEvent } from '../lib/analytics';
import { 
  X, CheckCircle, ShieldCheck, Send, AlertCircle, RefreshCw, 
  ArrowRight, ArrowLeft, User, Package, Ship, CheckSquare, 
  Edit2, Clock, Globe2, Building2, Mail, Phone, Anchor, Info,
  MessageSquare, Copy, Check, ExternalLink
} from 'lucide-react';
import { 
  Language, t, LANGUAGES, EXPORT_COUNTRIES, INCOTERMS_OPTIONS, 
  getLocalizedCountryName, CountryOption, IncotermOption 
} from '../lib/i18n';
import { normalizeDigits, safeParseNumber, buildCompanyWhatsAppUrl, formatRFQForWhatsApp } from '../lib/whatsapp';
import { CompanySettings } from '../types';

interface RFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
  lang?: Language;
  companySettings?: CompanySettings;
}

type RFQStep = 1 | 2 | 3 | 4;

export const RFQModal: React.FC<RFQModalProps> = ({
  isOpen,
  onClose,
  initialProduct = 'Egyptian Fresh Sweet Potatoes',
  lang = 'ar',
  companySettings
}) => {
  const [currentStep, setCurrentStep] = useState<RFQStep>(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Buyer Info
    fullName: '',
    company: '',
    country: 'SA',
    email: '',
    phone: '',

    // Step 2: Crop & Specs
    productInterest: initialProduct,
    variety: '',
    grade: 'Class I',
    size: '',
    preferredPackaging: 'Standard Export Carton Box',
    quantity: '25',
    quantityUnit: 'Tons',
    prodNotes: '',

    // Step 3: Logistics
    destinationPort: 'Jeddah Islamic Port',
    incoterm: 'FOB',
    preferredShipmentDate: '',
    shippingNotes: '',

    // Anti-spam
    honeypot: '',
    captchaInput: ''
  });

  const [captchaChallenge, setCaptchaChallenge] = useState<{
    challengeId: string;
    num1: number;
    num2: number;
    prompt: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successResult, setSuccessResult] = useState<any | null>(null);
  const [waAutoDispatched, setWaAutoDispatched] = useState(false);
  const [waCountdown, setWaCountdown] = useState(3);
  const [copiedText, setCopiedText] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const isRtl = currentLangObj.dir === 'rtl';

  const loadCaptcha = async () => {
    try {
      const challenge = await fetchCaptchaChallenge();
      setCaptchaChallenge(challenge);
    } catch {
      setCaptchaChallenge({
        challengeId: 'fallback',
        num1: 6,
        num2: 4,
        prompt: '6 + 4 = ?'
      });
    }
  };

  // Sync initial product and reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFormData((prev) => {
        const defaultCountry = EXPORT_COUNTRIES[0];
        return {
          ...prev,
          productInterest: initialProduct || 'Egyptian Fresh Sweet Potatoes',
          country: prev.country || defaultCountry.code,
          destinationPort: prev.destinationPort || defaultCountry.defaultPort
        };
      });
      loadCaptcha();
      setErrorMsg(null);
      setFieldErrors({});
      setSuccessResult(null);
      trackEvent('rfq_modal_opened', { product: initialProduct, lang });

      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, initialProduct, lang]);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-suggest default port when country changes if user hasn't typed custom port
      if (name === 'country') {
        const selected = EXPORT_COUNTRIES.find((c) => c.code === value);
        if (selected && selected.defaultPort && (!prev.destinationPort || prev.destinationPort === 'Jeddah Islamic Port' || prev.destinationPort === 'Port of Rotterdam')) {
          updated.destinationPort = selected.defaultPort;
        }
      }

      return updated;
    });

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Step Validation Logic
  const validateStep = (step: RFQStep): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName || formData.fullName.trim().length < 2) {
        errors.fullName = t('rfq_err_name', lang);
      }
      if (!formData.company || formData.company.trim().length < 2) {
        errors.company = t('rfq_err_company', lang);
      }
      if (!formData.country) {
        errors.country = t('rfq_err_country', lang);
      }
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = t('rfq_err_email', lang);
      }
      if (!formData.phone || formData.phone.trim().length < 5) {
        errors.phone = t('rfq_err_phone', lang);
      }
    } else if (step === 2) {
      if (!formData.productInterest || formData.productInterest.trim().length === 0) {
        errors.productInterest = t('rfq_err_product', lang);
      }
      const qtyNum = Number(formData.quantity);
      if (!formData.quantity || isNaN(qtyNum) || qtyNum <= 0) {
        errors.quantity = t('rfq_err_qty', lang);
      }
    } else if (step === 3) {
      if (formData.incoterm === 'CIF' && !formData.destinationPort.trim()) {
        errors.destinationPort = t('rfq_err_port', lang);
      }
    } else if (step === 4) {
      if (!formData.captchaInput || formData.captchaInput.trim() === '') {
        errors.captchaInput = t('rfq_err_captcha', lang);
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setErrorMsg(null);
      const next = (currentStep + 1) as RFQStep;
      setCurrentStep(next);
      trackEvent('rfq_step_advance', { from: currentStep, to: next });
    }
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    const prev = (currentStep - 1) as RFQStep;
    setCurrentStep(prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) {
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // Find full country text for backend
      const countryObj = EXPORT_COUNTRIES.find((c) => c.code === formData.country);
      const fullCountryName = countryObj ? countryObj.names[lang] || countryObj.names.en : formData.country;

      const response = await submitRFQ({
        fullName: formData.fullName,
        company: formData.company,
        country: fullCountryName,
        email: formData.email,
        phone: formData.phone,
        productInterest: formData.productInterest,
        variety: formData.variety,
        grade: formData.grade,
        size: formData.size,
        quantity: safeParseNumber(formData.quantity) || 1,
        quantityUnit: formData.quantityUnit,
        preferredPackaging: formData.preferredPackaging,
        destinationPort: formData.destinationPort,
        incoterm: formData.incoterm,
        preferredShipmentDate: formData.preferredShipmentDate,
        shippingNotes: formData.shippingNotes,
        message: formData.prodNotes ? `[Quality Notes]: ${formData.prodNotes}` : '',
        honeypot: formData.honeypot,
        captchaChallengeId: captchaChallenge?.challengeId,
        captchaAnswer: safeParseNumber(formData.captchaInput),
        source: 'Multi-Step RFQ Wizard'
      });

      setSuccessResult(response);
      setWaCountdown(3);
      setWaAutoDispatched(false);

      // Prepare target WhatsApp URL for the export desk
      const targetWaUrl = response.companyWhatsAppUrl || buildCompanyWhatsAppUrl(
        companySettings?.whatsappNumber || '+201000000000',
        {
          id: response.leadId,
          fullName: formData.fullName,
          company: formData.company,
          country: fullCountryName,
          email: formData.email,
          phone: formData.phone,
          productInterest: formData.productInterest,
          variety: formData.variety,
          grade: formData.grade,
          size: formData.size,
          quantity: safeParseNumber(formData.quantity) || 1,
          quantityUnit: formData.quantityUnit,
          preferredPackaging: formData.preferredPackaging,
          destinationPort: formData.destinationPort,
          incoterm: formData.incoterm,
          preferredShipmentDate: formData.preferredShipmentDate,
          shippingNotes: formData.shippingNotes,
          message: formData.prodNotes
        },
        lang
      );

      // Attempt immediate automatic forward to WhatsApp
      try {
        const opened = window.open(targetWaUrl, '_blank');
        if (opened && !opened.closed && typeof opened.closed !== 'undefined') {
          setWaAutoDispatched(true);
        }
      } catch (e) {
        console.warn('Auto-open WhatsApp prevented by browser policy:', e);
      }

      trackEvent('rfq_submitted_success', {
        product: formData.productInterest,
        country: fullCountryName,
        incoterm: formData.incoterm
      });
    } catch (err: any) {
      setErrorMsg(err.message || t('rfq_err_general', lang));
      if (err.details) {
        setFieldErrors(err.details);
      }
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // Countdown effect to assist automatic WhatsApp redirection if initially blocked
  useEffect(() => {
    if (!successResult) return;
    if (waAutoDispatched) return;

    if (waCountdown > 0) {
      const timer = setTimeout(() => {
        setWaCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [successResult, waCountdown, waAutoDispatched]);

  const stepsData = [
    { num: 1, label: t('rfq_step_1_title', lang), icon: User },
    { num: 2, label: t('rfq_step_2_title', lang), icon: Package },
    { num: 3, label: t('rfq_step_3_title', lang), icon: Ship },
    { num: 4, label: t('rfq_step_4_title', lang), icon: CheckSquare }
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rfq-wizard-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#0E1F17] border border-emerald-900/40 text-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="bg-[#07130E] px-6 py-4 sm:py-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C5A059]/15 text-[#E2BC74] border border-[#C5A059]/30">
                <Globe2 className="w-3 h-3" />
                {t('rfq_desk_badge', lang)}
              </span>
            </div>
            <h2 id="rfq-wizard-title" className="text-lg sm:text-xl font-bold font-display text-white">
              {t('rfq_title', lang)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            aria-label={t('rfq_btn_close', lang)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar (Hidden if Success) */}
        {!successResult && (
          <div className="bg-[#0A1A14] px-4 sm:px-6 py-3 border-b border-white/5 shrink-0">
            <div className="grid grid-cols-4 gap-2">
              {stepsData.map((s) => {
                const isActive = currentStep === s.num;
                const isCompleted = currentStep > s.num;
                const StepIcon = s.icon;

                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      if (isCompleted) setCurrentStep(s.num as RFQStep);
                    }}
                    disabled={!isCompleted && !isActive}
                    className={`flex items-center gap-2 text-left p-1.5 sm:p-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#C5A059]/15 text-[#E2BC74] border border-[#C5A059]/40'
                        : isCompleted
                        ? 'text-emerald-400 hover:bg-white/5 cursor-pointer'
                        : 'text-white/30 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isActive
                          ? 'bg-[#C5A059] text-[#0A1A14]'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-white/5 text-white/40'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : s.num}
                    </div>
                    <span className="hidden sm:inline text-xs font-medium truncate">
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Scrollable Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {successResult ? (
            /* Success Receipt View */
            <div className="py-6 text-center space-y-5 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-950/60 border-2 border-emerald-400/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-display text-white">
                  {t('rfq_success_title', lang)}
                </h3>
                <p className="text-white/70 text-sm max-w-md mx-auto">
                  {t('rfq_success_desc', lang)}
                </p>
              </div>

              {/* Quotation Reference Badge */}
              <div className="bg-[#07130E] border border-[#C5A059]/30 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2.5" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                  <span className="text-white/60">{t('rfq_success_lead_id', lang)}</span>
                  <span className="font-mono font-bold text-[#E2BC74]">
                    {successResult.leadId || 'AVL-EXPORT-REQ'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                  <span className="text-white/60">{t('rfq_product_label', lang)}:</span>
                  <span className="font-medium text-white">{formData.productInterest}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                  <span className="text-white/60">{t('rfq_quantity_label', lang)}:</span>
                  <span className="font-medium text-white">
                    {formData.quantity} {formData.quantityUnit} ({formData.incoterm})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">{t('rfq_port_label', lang)}:</span>
                  <span className="font-medium text-white">{formData.destinationPort || 'Confirmed via Email'}</span>
                </div>
              </div>

              {/* Dual Confirmation Status: Admin System + WhatsApp Transmission */}
              <div className="space-y-3 max-w-md mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
                {/* 1. Admin System Confirmation */}
                <div className="bg-[#0A1A14] border border-emerald-500/40 rounded-2xl p-3.5 flex items-center gap-3 shadow-md">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-xs font-bold text-emerald-300">
                      {t('rfq_channel_admin_confirmed', lang)}
                    </p>
                    <p className="text-[11px] text-white/50">
                      {t('rfq_success_lead_id', lang)} <span className="font-mono text-[#E2BC74] font-bold">{successResult.leadId || 'AVL-RFQ'}</span>
                    </p>
                  </div>
                </div>

                {/* 2. Direct WhatsApp Transmission Box */}
                {(() => {
                  const leadData = {
                    id: successResult.leadId,
                    fullName: formData.fullName,
                    company: formData.company,
                    country: getLocalizedCountryName(formData.country, lang),
                    email: formData.email,
                    phone: formData.phone,
                    productInterest: formData.productInterest,
                    variety: formData.variety,
                    grade: formData.grade,
                    size: formData.size,
                    quantity: safeParseNumber(formData.quantity) || 1,
                    quantityUnit: formData.quantityUnit,
                    preferredPackaging: formData.preferredPackaging,
                    destinationPort: formData.destinationPort,
                    incoterm: formData.incoterm,
                    preferredShipmentDate: formData.preferredShipmentDate,
                    shippingNotes: formData.shippingNotes,
                    message: formData.prodNotes
                  };

                  const targetWaUrl = successResult.companyWhatsAppUrl || buildCompanyWhatsAppUrl(
                    companySettings?.whatsappNumber || '+201000000000',
                    leadData,
                    lang
                  );

                  return (
                    <div className="bg-[#0F241A] border-2 border-emerald-500/60 rounded-3xl p-5 shadow-2xl space-y-3 text-center">
                      <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                        <MessageSquare className="w-4 h-4" />
                        <span>{t('rfq_channel_wa_heading', lang)}</span>
                      </div>

                      <p className="text-xs text-white/80 leading-relaxed">
                        {t('rfq_channel_wa_desc', lang)}
                      </p>

                      {/* Auto-redirect or Opened Notice */}
                      {waAutoDispatched ? (
                        <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-2.5 text-xs text-emerald-200 flex items-center justify-center gap-1.5 font-medium animate-fade-in">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{t('rfq_channel_wa_opened', lang)}</span>
                        </div>
                      ) : waCountdown > 0 ? (
                        <p className="text-[11px] text-amber-300/90 font-medium">
                          {t('rfq_channel_wa_auto_redirecting', lang).replace('{seconds}', String(waCountdown))}
                        </p>
                      ) : null}

                      {/* Primary WhatsApp Action Button */}
                      <a
                        href={targetWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setWaAutoDispatched(true)}
                        className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 px-5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-98 animate-pulse hover:animate-none"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{t('rfq_channel_wa_btn_now', lang)}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>

                      {/* Secondary Actions: Copy formatted text & phone display */}
                      <div className="flex items-center justify-between pt-1 text-[11px] text-white/50 border-t border-white/10">
                        <span dir="ltr" className="font-mono text-emerald-400 font-medium">
                          {companySettings?.whatsappNumber || '+20 100 000 0000'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const formatted = formatRFQForWhatsApp(leadData, lang);
                            navigator.clipboard.writeText(formatted);
                            setCopiedText(true);
                            setTimeout(() => setCopiedText(false), 2500);
                          }}
                          className="hover:text-white flex items-center gap-1 transition-colors underline"
                        >
                          {copiedText ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">{t('rfq_channel_wa_copied', lang)}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{t('rfq_channel_wa_copy_btn', lang)}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="bg-[#C5A059] hover:bg-white text-[#0A1A14] font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  {t('rfq_btn_close', lang)}
                </button>
                <button
                  onClick={() => {
                    setSuccessResult(null);
                    setCurrentStep(1);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 px-5 rounded-full text-xs transition-colors"
                >
                  {t('rfq_btn_new', lang)}
                </button>
              </div>
            </div>
          ) : (
            /* Multi-Step Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Spam Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_hp">Leave empty</label>
                <input
                  id="website_hp"
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={handleChange}
                />
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-2xl text-red-200 text-xs flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STEP 1: BUYER & COMPANY PROFILE                                           */}
              {/* ========================================================================= */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border-b border-white/10 pb-2">
                    <h3 className="text-sm font-semibold text-[#E2BC74] flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {t('rfq_step_1_title', lang)}
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      {t('rfq_step_1_sub', lang)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rfq_fullName" className="block text-xs font-semibold text-white/80 mb-1">
                        {t('rfq_name_label', lang)} <span className="text-red-400">*</span>
                      </label>
                      <input
                        ref={firstInputRef}
                        id="rfq_fullName"
                        type="text"
                        name="fullName"
                        placeholder={t('rfq_ph_name', lang)}
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full bg-[#07130E] border ${
                          fieldErrors.fullName ? 'border-red-500' : 'border-white/15'
                        } rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors`}
                      />
                      {fieldErrors.fullName && (
                        <p className="text-red-400 text-[11px] mt-1 font-medium">{fieldErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="rfq_company" className="block text-xs font-semibold text-white/80 mb-1">
                        {t('rfq_company_label', lang)} <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="rfq_company"
                        type="text"
                        name="company"
                        placeholder={t('rfq_ph_company', lang)}
                        value={formData.company}
                        onChange={handleChange}
                        className={`w-full bg-[#07130E] border ${
                          fieldErrors.company ? 'border-red-500' : 'border-white/15'
                        } rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors`}
                      />
                      {fieldErrors.company && (
                        <p className="text-red-400 text-[11px] mt-1 font-medium">{fieldErrors.company}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="rfq_country" className="block text-xs font-semibold text-white/80 mb-1">
                        {t('rfq_country_label', lang)} <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="rfq_country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full bg-[#07130E] border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                      >
                        {EXPORT_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code} className="bg-[#07130E] text-white">
                            {c.flag} {c.names[lang] || c.names.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="rfq_email" className="block text-xs font-semibold text-white/80 mb-1">
                        {t('rfq_email_label', lang)} <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="rfq_email"
                        type="email"
                        name="email"
                        placeholder={t('rfq_ph_email', lang)}
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full bg-[#07130E] border ${
                          fieldErrors.email ? 'border-red-500' : 'border-white/15'
                        } rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]`}
                      />
                      {fieldErrors.email && (
                        <p className="text-red-400 text-[11px] mt-1 font-medium">{fieldErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="rfq_phone" className="block text-xs font-semibold text-white/80 mb-1">
                        {t('rfq_phone_label', lang)} <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="rfq_phone"
                        type="text"
                        name="phone"
                        placeholder={t('rfq_ph_phone', lang)}
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full bg-[#07130E] border ${
                          fieldErrors.phone ? 'border-red-500' : 'border-white/15'
                        } rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]`}
                      />
                      {fieldErrors.phone && (
                        <p className="text-red-400 text-[11px] mt-1 font-medium">{fieldErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STEP 2: CROP & SPECIFICATIONS                                             */}
              {/* ========================================================================= */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border-b border-white/10 pb-2">
                    <h3 className="text-sm font-semibold text-[#E2BC74] flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {t('rfq_step_2_title', lang)}
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      {t('rfq_step_2_sub', lang)}
                    </p>
                  </div>

                  {/* Crop Selection */}
                  <div>
                    <label htmlFor="rfq_productInterest" className="block text-xs font-semibold text-white/80 mb-1">
                      {t('rfq_product_label', lang)} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="rfq_productInterest"
                      type="text"
                      name="productInterest"
                      value={formData.productInterest}
                      onChange={handleChange}
                      placeholder={t('rfq_select_product', lang)}
                      className={`w-full bg-[#07130E] border ${
                        fieldErrors.productInterest ? 'border-red-500' : 'border-white/15'
                      } rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="rfq_variety" className="block text-xs font-semibold text-white/80 mb-1">
                        {t('rfq_variety_label', lang)}
                      </label>
                      <input
                        id="rfq_variety"
                        type="text"
                        name="variety"
                        placeholder={t('rfq_ph_variety', lang)}
                        value={formData.variety}
                        onChange={handleChange}
                        className="w-full bg-[#07130E] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label htmlFor="rfq_grade" className="block text-xs font-semibold text-white/80 mb-1">
                        {t('rfq_grade_label', lang)}
                      </label>
                      <select
                        id="rfq_grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full bg-[#07130E] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="Class I">{t('rfq_grade_opt_1', lang)}</option>
                        <option value="Class Extra">{t('rfq_grade_opt_2', lang)}</option>
                        <option value="Class II">{t('rfq_grade_opt_3', lang)}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="rfq_size" className="block text-xs font-semibold text-white/80 mb-1">
                        {t('rfq_size_label', lang)}
                      </label>
                      <input
                        id="rfq_size"
                        type="text"
                        name="size"
                        placeholder={t('rfq_ph_size', lang)}
                        value={formData.size}
                        onChange={handleChange}
                        className="w-full bg-[#07130E] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rfq_packaging" className="block text-xs font-semibold text-white/80 mb-1">
                        {t('rfq_packaging_label', lang)}
                      </label>
                      <input
                        id="rfq_packaging"
                        type="text"
                        name="preferredPackaging"
                        value={formData.preferredPackaging}
                        onChange={handleChange}
                        placeholder="6kg Open Top Carton / Jumbo Bags / 10kg Mesh Bags"
                        className="w-full bg-[#07130E] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label htmlFor="rfq_quantity" className="block text-xs font-semibold text-white/80 mb-1">
                          {t('rfq_quantity_label', lang)} <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="rfq_quantity"
                          type="number"
                          name="quantity"
                          min="1"
                          value={formData.quantity}
                          onChange={handleChange}
                          className={`w-full bg-[#07130E] border ${
                            fieldErrors.quantity ? 'border-red-500' : 'border-white/15'
                          } rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]`}
                        />
                        {fieldErrors.quantity && (
                          <p className="text-red-400 text-[11px] mt-1 font-medium">{fieldErrors.quantity}</p>
                        )}
                      </div>

                      <div className="w-36">
                        <label htmlFor="rfq_unit" className="block text-xs font-semibold text-white/80 mb-1">
                          {t('rfq_unit_label', lang)}
                        </label>
                        <select
                          id="rfq_unit"
                          name="quantityUnit"
                          value={formData.quantityUnit}
                          onChange={handleChange}
                          className="w-full bg-[#07130E] border border-white/15 rounded-xl px-2 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                        >
                          <option value="Tons">{t('rfq_unit_tons', lang)}</option>
                          <option value="Containers">{t('rfq_unit_containers', lang)}</option>
                          <option value="Pallets">{t('rfq_unit_pallets', lang)}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rfq_prodNotes" className="block text-xs font-semibold text-white/80 mb-1">
                      {t('rfq_prod_notes_label', lang)}
                    </label>
                    <textarea
                      id="rfq_prodNotes"
                      name="prodNotes"
                      rows={2}
                      placeholder={t('rfq_ph_prod_notes', lang)}
                      value={formData.prodNotes}
                      onChange={handleChange}
                      className="w-full bg-[#07130E] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STEP 3: SHIPPING & LOGISTICS                                              */}
              {/* ========================================================================= */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border-b border-white/10 pb-2">
                    <h3 className="text-sm font-semibold text-[#E2BC74] flex items-center gap-2">
                      <Ship className="w-4 h-4" />
                      {t('rfq_step_3_title', lang)}
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      {t('rfq_step_3_sub', lang)}
                    </p>
                  </div>

                  {/* Incoterms Selector Cards */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-2">
                      {t('rfq_incoterm_label', lang)}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {INCOTERMS_OPTIONS.map((inc) => {
                        const isSelected = formData.incoterm === inc.code;
                        return (
                          <div
                            key={inc.code}
                            onClick={() => setFormData((prev) => ({ ...prev, incoterm: inc.code }))}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#C5A059]/20 border-[#C5A059] text-white shadow-md'
                                : 'bg-[#07130E] border-white/10 text-white/70 hover:border-white/30'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-sm text-[#E2BC74]">
                                {inc.code}
                              </span>
                              {inc.recommended && (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-white/60 mt-1 leading-tight line-clamp-2">
                              {inc.descriptions[lang] || inc.descriptions.en}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rfq_destinationPort" className="block text-xs font-semibold text-white/80 mb-1">
                        {t('rfq_port_label', lang)}
                        {formData.incoterm === 'CIF' && (
                          <span className="text-red-400"> *</span>
                        )}
                      </label>
                      <input
                        id="rfq_destinationPort"
                        type="text"
                        name="destinationPort"
                        placeholder={t('rfq_ph_port', lang)}
                        value={formData.destinationPort}
                        onChange={handleChange}
                        className={`w-full bg-[#07130E] border ${
                          fieldErrors.destinationPort ? 'border-red-500' : 'border-white/15'
                        } rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]`}
                      />
                      {fieldErrors.destinationPort && (
                        <p className="text-red-400 text-[11px] mt-1 font-medium">{fieldErrors.destinationPort}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="rfq_shipDate" className="block text-xs font-semibold text-white/80 mb-1">
                        {t('rfq_ship_date_label', lang)}
                      </label>
                      <input
                        id="rfq_shipDate"
                        type="text"
                        name="preferredShipmentDate"
                        placeholder={t('rfq_ph_ship_date', lang)}
                        value={formData.preferredShipmentDate}
                        onChange={handleChange}
                        className="w-full bg-[#07130E] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rfq_shipNotes" className="block text-xs font-semibold text-white/80 mb-1">
                      {t('rfq_ship_notes_label', lang)}
                    </label>
                    <textarea
                      id="rfq_shipNotes"
                      name="shippingNotes"
                      rows={2}
                      placeholder={t('rfq_ph_ship_notes', lang)}
                      value={formData.shippingNotes}
                      onChange={handleChange}
                      className="w-full bg-[#07130E] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STEP 4: REVIEW & CONFIRMATION                                             */}
              {/* ========================================================================= */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border-b border-white/10 pb-2">
                    <h3 className="text-sm font-semibold text-[#E2BC74] flex items-center gap-2">
                      <CheckSquare className="w-4 h-4" />
                      {t('rfq_step_4_title', lang)}
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      {t('rfq_step_4_sub', lang)}
                    </p>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Buyer Summary */}
                    <div className="bg-[#07130E] border border-white/10 rounded-2xl p-3.5 space-y-2 relative">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <span className="text-[11px] font-bold text-[#C5A059] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          {t('rfq_review_buyer_title', lang)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          {t('rfq_btn_edit', lang)}
                        </button>
                      </div>
                      <div className="text-xs space-y-1 text-white/80">
                        <p className="font-semibold text-white">{formData.fullName}</p>
                        <p className="text-white/60">{formData.company}</p>
                        <p>{getLocalizedCountryName(formData.country, lang)}</p>
                        <p className="text-white/60 truncate">{formData.email}</p>
                        <p className="text-white/60">{formData.phone}</p>
                      </div>
                    </div>

                    {/* Product Summary */}
                    <div className="bg-[#07130E] border border-white/10 rounded-2xl p-3.5 space-y-2 relative">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <span className="text-[11px] font-bold text-[#C5A059] flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" />
                          {t('rfq_review_product_title', lang)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          {t('rfq_btn_edit', lang)}
                        </button>
                      </div>
                      <div className="text-xs space-y-1 text-white/80">
                        <p className="font-semibold text-white">{formData.productInterest}</p>
                        {formData.variety && <p className="text-white/60">Var: {formData.variety}</p>}
                        <p className="text-white/60">{formData.grade}</p>
                        <p className="font-bold text-[#E2BC74]">
                          {formData.quantity} {formData.quantityUnit}
                        </p>
                        <p className="text-[11px] text-white/50 truncate">{formData.preferredPackaging}</p>
                      </div>
                    </div>

                    {/* Logistics Summary */}
                    <div className="bg-[#07130E] border border-white/10 rounded-2xl p-3.5 space-y-2 relative">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <span className="text-[11px] font-bold text-[#C5A059] flex items-center gap-1.5">
                          <Ship className="w-3.5 h-3.5" />
                          {t('rfq_review_logistics_title', lang)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          {t('rfq_btn_edit', lang)}
                        </button>
                      </div>
                      <div className="text-xs space-y-1 text-white/80">
                        <p className="font-semibold text-[#E2BC74]">Incoterm: {formData.incoterm}</p>
                        <p className="text-white/70">{formData.destinationPort || 'To be agreed'}</p>
                        {formData.preferredShipmentDate && (
                          <p className="text-white/60">Date: {formData.preferredShipmentDate}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Security CAPTCHA Challenge */}
                  <div className="p-3.5 bg-[#07130E] border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-[#E2BC74]">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span className="font-mono">
                        {t('rfq_verify_label', lang)}{' '}
                        {captchaChallenge ? `${captchaChallenge.num1} + ${captchaChallenge.num2} =` : '...'}
                      </span>
                      <button
                        type="button"
                        onClick={loadCaptcha}
                        className="p-1 text-white/50 hover:text-white transition-colors"
                        title={t('rfq_refresh_captcha', lang)}
                        aria-label={t('rfq_refresh_captcha', lang)}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="captchaInput"
                        required
                        placeholder="?"
                        value={formData.captchaInput}
                        onChange={handleChange}
                        className={`w-20 bg-[#0E1F17] border ${
                          fieldErrors.captchaInput ? 'border-red-500' : 'border-white/20'
                        } rounded-xl px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:border-[#C5A059]`}
                      />
                      {fieldErrors.captchaInput && (
                        <p className="text-red-400 text-[10px]">{fieldErrors.captchaInput}</p>
                      )}
                    </div>
                  </div>

                  {/* Confidentiality Disclaimer */}
                  <div className="flex items-start gap-2 text-[11px] text-white/50 bg-white/5 p-3 rounded-xl">
                    <Info className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {t('rfq_consent_note', lang)}
                    </p>
                  </div>
                </div>
              )}

              {/* Step Navigation Controls */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/5 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                    <span>{t('rfq_btn_prev', lang)}</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-[#C5A059] hover:bg-white text-[#0A1A14] font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <span>{t('rfq_btn_next', lang)}</span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#C5A059] hover:bg-white text-[#0A1A14] font-bold py-3 px-8 rounded-full text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <span>{t('rfq_submitting_btn', lang)}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t('rfq_submit_btn', lang)}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
