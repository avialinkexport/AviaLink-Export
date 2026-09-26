import { useEffect, useState } from 'react';

/**
 * =========================================================================
 * 🛑 مفتاح تشغيل / إيقاف تثبيت تطبيق الـ PWA (PWA Install Feature Flag)
 * =========================================================================
 * تم تعليق ميزة تثبيت التطبيق حالياً بناءً على طلبك (القيمة: false).
 * 
 * 💡 كيفية إعادة تشغيل وتفعيل تثبيت التطبيق في أي وقت:
 * فقط قم بتغيير القيمة أدناه من false إلى true:
 * 
 *    export const ENABLE_PWA_INSTALL = true;
 * 
 * بمجرد تغييرها إلى true، ستعود أزرار التثبيت للظهور تلقائياً في شريط التنقل (Navbar)،
 * القائمة الجانبية للهاتف، وتذييل الصفحة (Footer).
 * =========================================================================
 */
export const ENABLE_PWA_INSTALL = false;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // If PWA install is disabled, do not register prompt listeners
    if (!ENABLE_PWA_INSTALL) {
      return;
    }

    // Detect standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!ENABLE_PWA_INSTALL || !deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: ENABLE_PWA_INSTALL && !!deferredPrompt,
    isInstalled,
    isIOS: ENABLE_PWA_INSTALL && isIOS,
    install,
    isEnabled: ENABLE_PWA_INSTALL,
  };
}
