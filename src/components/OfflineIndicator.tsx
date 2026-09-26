import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { Language } from '../lib/i18n';

interface OfflineIndicatorProps {
  lang?: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ lang = 'ar' }) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  const offlineMessages: Record<Language, string> = {
    ar: 'وضع عدم الاتصال — يتم استخدام البيانات المحفوظة للتطبيق',
    en: 'Offline Mode — Using cached application data',
    fr: 'Mode hors ligne — Utilisation des données d’application en cache',
    es: 'Modo sin conexión — Usando datos en caché de la aplicación',
    de: 'Offline-Modus — Verwendung zwischengespeicherter App-Daten',
    ru: 'Автономный режим — используются кэшированные данные приложения'
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xl animate-bounce border border-amber-400">
      <WifiOff className="w-4 h-4 text-amber-200 shrink-0" />
      <span>
        {offlineMessages[lang] || offlineMessages.ar}
      </span>
    </div>
  );
};
