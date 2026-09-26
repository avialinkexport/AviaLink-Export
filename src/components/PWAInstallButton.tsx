import React, { useState } from 'react';
import { usePWAInstall, ENABLE_PWA_INSTALL } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { Language, t } from '../lib/i18n';

interface PWAInstallButtonProps {
  lang?: Language;
  variant?: 'nav' | 'mobile-menu' | 'footer';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  lang = 'ar',
  variant = 'nav',
  className = ''
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If PWA installation is suspended or already running as an installed PWA, hide completely
  if (!ENABLE_PWA_INSTALL || isInstalled) {
    return null;
  }

  const pwaTexts: Record<Language, {
    btnInstall: string;
    mobileAction: string;
    mobileDesc: string;
    downloadTitle: string;
    downloadPwa: string;
    fallbackAlert: string;
    iosTitle: string;
    iosIntro: string;
    step1: string;
    step2: string;
    step3: string;
    gotIt: string;
  }> = {
    ar: {
      btnInstall: 'تثبيت التطبيق',
      mobileAction: 'تثبيت تطبيق أفيا لينك',
      mobileDesc: 'وصول فوري بدون متصفح وإشعارات',
      downloadTitle: 'تحميل الموقع كتطبيق (PWA)',
      downloadPwa: 'تثبيت تطبيق أفيا لينك',
      fallbackAlert: 'لتثبيت التطبيق على جهازك: اضغط على القائمة في متصفحك (⋮) ثم اختر "إضافة إلى الشاشة الرئيسية" أو "Install App".',
      iosTitle: 'تثبيت التطبيق على آيفون / آيباد',
      iosIntro: 'اتبع الخطوات البسيطة التالية لإضافة تطبيق أفيا لينك لشاشتك الرئيسية:',
      step1: 'اضغط على زر المشاركة (Share) أسفل المتصفح',
      step2: 'اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen)',
      step3: 'اضغط على "إضافة" أعلى الشاشة',
      gotIt: 'حسناً، فهمت'
    },
    en: {
      btnInstall: 'Install App',
      mobileAction: 'Install AviaLink App',
      mobileDesc: 'Direct home screen access & instant load',
      downloadTitle: 'Download PWA App',
      downloadPwa: 'Install AviaLink App',
      fallbackAlert: 'To install the app on your device: open your browser menu (⋮) and tap "Add to Home Screen" or "Install App".',
      iosTitle: 'Install on iPhone / iPad',
      iosIntro: 'Follow these steps to add AviaLink App to your iOS home screen:',
      step1: 'Tap the Share button in Safari toolbar',
      step2: 'Scroll and tap "Add to Home Screen"',
      step3: 'Tap "Add" in the top right corner',
      gotIt: 'Got it'
    },
    fr: {
      btnInstall: 'Installer l’application',
      mobileAction: 'Installer l’application AviaLink',
      mobileDesc: 'Accès direct sur l’écran d’accueil',
      downloadTitle: 'Télécharger l’application PWA',
      downloadPwa: 'Installer l’application AviaLink',
      fallbackAlert: 'Pour installer l’application : ouvrez le menu du navigateur (⋮) et appuyez sur "Ajouter à l’écran d’accueil".',
      iosTitle: 'Installer sur iPhone / iPad',
      iosIntro: 'Suivez ces étapes simples pour ajouter AviaLink à votre écran d’accueil :',
      step1: 'Appuyez sur le bouton Partager dans Safari',
      step2: 'Sélectionnez "Sur l’écran d’accueil"',
      step3: 'Appuyez sur "Ajouter" en haut à droite',
      gotIt: 'Compris'
    },
    es: {
      btnInstall: 'Instalar Aplicación',
      mobileAction: 'Instalar App AviaLink',
      mobileDesc: 'Acceso directo en pantalla de inicio',
      downloadTitle: 'Descargar App PWA',
      downloadPwa: 'Instalar App AviaLink',
      fallbackAlert: 'Para instalar la app: abra el menú de su navegador (⋮) y elija "Agregar a pantalla principal".',
      iosTitle: 'Instalar en iPhone / iPad',
      iosIntro: 'Siga estos sencillos pasos para agregar AviaLink a su pantalla de inicio:',
      step1: 'Toque el botón Compartir en Safari',
      step2: 'Seleccione "Agregar a pantalla de inicio"',
      step3: 'Toque "Agregar" en la esquina superior derecha',
      gotIt: 'Entendido'
    },
    de: {
      btnInstall: 'App installieren',
      mobileAction: 'AviaLink App installieren',
      mobileDesc: 'Schnellzugriff auf dem Startbildschirm',
      downloadTitle: 'PWA App herunterladen',
      downloadPwa: 'AviaLink App installieren',
      fallbackAlert: 'Um die App zu installieren: Öffnen Sie das Browsermenü (⋮) und tippen Sie auf "Zum Startbildschirm hinzufügen".',
      iosTitle: 'Auf iPhone / iPad installieren',
      iosIntro: 'Führen Sie diese einfachen Schritte aus, um die AviaLink-App hinzuzufügen:',
      step1: 'Tippen Sie auf das Teilen-Symbol in Safari',
      step2: 'Wählen Sie "Zum Home-Bildschirm"',
      step3: 'Tippen Sie oben rechts auf "Hinzufügen"',
      gotIt: 'Verstanden'
    },
    ru: {
      btnInstall: 'Установить приложение',
      mobileAction: 'Установить приложение AviaLink',
      mobileDesc: 'Прямой доступ с главного экрана',
      downloadTitle: 'Скачать PWA-приложение',
      downloadPwa: 'Установить AviaLink',
      fallbackAlert: 'Чтобы установить приложение: откройте меню браузера (⋮) и выберите "Добавить на главный экран".',
      iosTitle: 'Установка на iPhone / iPad',
      iosIntro: 'Следуйте этим шагам, чтобы добавить приложение AviaLink на экран "Домой":',
      step1: 'Нажмите кнопку "Поделиться" в браузере Safari',
      step2: 'Выберите пункт "На экран Домой"',
      step3: 'Нажмите "Добавить" в правом верхнем углу',
      gotIt: 'Понятно'
    }
  };

  const pTxt = pwaTexts[lang] || pwaTexts.ar;

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      alert(pTxt.fallbackAlert);
    }
  };

  const isRtl = lang === 'ar';

  return (
    <>
      {variant === 'nav' ? (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 bg-[#0F2133] hover:bg-[#1a334d] text-white text-xs font-bold px-3 py-1.5 rounded-full border border-slate-700 shadow-sm transition-all hover:scale-105 active:scale-95 ${className}`}
          title={pTxt.downloadTitle}
        >
          <Smartphone className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>{pTxt.btnInstall}</span>
        </button>
      ) : variant === 'mobile-menu' ? (
        <button
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#0F2133] to-[#162e47] text-white border border-[#C5A059]/30 shadow-md hover:border-[#C5A059] transition-all text-right group ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0 group-hover:scale-110 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="text-start">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{pTxt.mobileAction}</span>
                <span className="text-[10px] bg-[#C5A059] text-[#0F2133] px-1.5 py-0.2 rounded font-black">PWA</span>
              </div>
              <div className="text-[10px] text-slate-300 font-medium">
                {pTxt.mobileDesc}
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-[#C5A059] flex items-center gap-1">
            <Download className="w-4 h-4" />
          </div>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-2 bg-[#182C42] hover:bg-[#C5A059] hover:text-[#0B1A2C] text-slate-200 font-bold text-xs px-4 py-2 rounded-full border border-slate-700 shadow-sm transition-all ${className}`}
          title={pTxt.downloadTitle}
        >
          <Smartphone className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-[#0B1A2C]" />
          <span>{pTxt.downloadPwa}</span>
        </button>
      )}

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 relative text-slate-800">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 left-4 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-[#0F2133] rounded-2xl mx-auto flex items-center justify-center text-[#C5A059] shadow-md">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#0F2133]">
                {pTxt.iosTitle}
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {pTxt.iosIntro}
              </p>
            </div>

            <div className="mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-semibold space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#C5A059] text-white font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                <span>{pTxt.step1}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#C5A059] text-white font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                <span>{pTxt.step2}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#C5A059] text-white font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                <span>{pTxt.step3}</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full bg-[#0F2133] text-white font-bold py-2.5 rounded-full text-xs shadow-md"
            >
              {pTxt.gotIt}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
