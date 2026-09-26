import React from 'react';
import { trackEvent } from '../lib/analytics';
import { MessageSquare } from 'lucide-react';
import { Language } from '../lib/i18n';
import { CompanySettings } from '../types';

interface WhatsAppButtonProps {
  lang?: Language;
  companySettings?: CompanySettings;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ lang = 'ar', companySettings }) => {
  const whatsappMessages: Record<Language, { label: string; text: string; aria: string }> = {
    ar: {
      label: 'واتساب مكتب التصدير',
      text: 'مرحباً مكتب تصدير أفيا لينك، أود الاستفسار بخصوص مواصفات المحاصيل الزراعية المتاحة للشحن وجداول الحاويات.',
      aria: 'تواصل مع مكتب تصدير أفيا لينك عبر واتساب'
    },
    en: {
      label: 'Export Desk WhatsApp',
      text: 'Hello AVIALINK Export Desk, I would like to inquire about agricultural export specifications and container availability.',
      aria: 'Contact AVIALINK Export Desk via WhatsApp'
    },
    fr: {
      label: 'Bureau Export WhatsApp',
      text: 'Bonjour le bureau export AVIALINK, je souhaite me renseigner sur les spécifications des produits et la disponibilité des conteneurs.',
      aria: 'Contacter le bureau export AVIALINK sur WhatsApp'
    },
    es: {
      label: 'Oficina Export WhatsApp',
      text: 'Hola AVIALINK Export Desk, deseo consultar sobre especificaciones de exportación agrícola y disponibilidad de contenedores.',
      aria: 'Contactar a la oficina de exportación AVIALINK por WhatsApp'
    },
    de: {
      label: 'Exportbüro WhatsApp',
      text: 'Hallo AVIALINK Export Desk, ich möchte mich über landwirtschaftliche Exportspezifikationen und Containerverfügbarkeit erkundigen.',
      aria: 'AVIALINK Export Desk über WhatsApp kontaktieren'
    },
    ru: {
      label: 'Отдел экспорта WhatsApp',
      text: 'Здравствуйте, экспортный отдел AVIALINK! Хочу уточнить спецификации сельскохозяйственной продукции и наличие контейнеров.',
      aria: 'Связаться с экспортным отделом AVIALINK в WhatsApp'
    }
  };

  const item = whatsappMessages[lang] || whatsappMessages.ar;

  const handleClick = () => {
    trackEvent('whatsapp_click');
    const defaultText = encodeURIComponent(item.text);
    
    if (companySettings?.whatsappLink && companySettings.whatsappLink.trim().length > 0) {
      const link = companySettings.whatsappLink.trim();
      const finalUrl = link.includes('?') ? `${link}&text=${defaultText}` : `${link}?text=${defaultText}`;
      window.open(finalUrl, '_blank');
      return;
    }

    const rawPhone = companySettings?.whatsappNumber || companySettings?.phone || '201000000000';
    const cleanPhone = rawPhone.replace(/\D/g, '') || '201000000000';
    window.open(`https://wa.me/${cleanPhone}?text=${defaultText}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      <button
        onClick={handleClick}
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold py-3 px-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-emerald-400/30"
        aria-label={item.aria}
        title={item.label}
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageSquare className="w-5 h-5 fill-white text-[#25D366]" />
        <span className="hidden sm:inline text-sm font-bold tracking-wide">{item.label}</span>
      </button>
    </div>
  );
};

