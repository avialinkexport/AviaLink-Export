import React from 'react';
import { Logo } from './Logo';
import { Mail, Phone, Globe, Facebook, Twitter, Linkedin, Instagram, Youtube, Code2, Sparkles } from 'lucide-react';
import { Language, t, LANGUAGES } from '../lib/i18n';
import { CompanySettings } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface FooterProps {
  onNavigate: (route: string) => void;
  onOpenRFQ: () => void;
  lang: Language;
  companySettings?: CompanySettings;
}

const FOOTER_TEXTS: Record<Language, {
  tagline: string;
  rights: string;
  adminPortal: string;
  developerLabel: string;
  developerName: string;
}> = {
  ar: {
    tagline: 'أفيالينك للتصدير (Avialink Export) - نربط أجود المحاصيل الزراعية المصرية بالأسواق العالمية بأعلى معايير الجودة والتبريد.',
    rights: 'جميع الحقوق محفوظة لشركة أفيالينك للتصدير (Avialink Export).',
    adminPortal: 'بوابة الإدارة والتتبع',
    developerLabel: 'تصميم وتطوير المنصة:',
    developerName: 'Eng. Mohammed Tarek'
  },
  en: {
    tagline: 'Avialink Export - Connecting premium Egyptian crops to global markets with cold chain excellence.',
    rights: 'All Rights Reserved. Avialink Export.',
    adminPortal: 'Admin Portal',
    developerLabel: 'Designed & Developed by:',
    developerName: 'Eng. Mohammed Tarek'
  },
  fr: {
    tagline: 'Avialink Export - Relier les meilleures récoltes égyptiennes aux marchés mondiaux avec excellence.',
    rights: 'Tous droits réservés. Avialink Export.',
    adminPortal: 'Portail d’administration',
    developerLabel: 'Conception et développement :',
    developerName: 'Eng. Mohammed Tarek'
  },
  es: {
    tagline: 'Avialink Export - Conectando los mejores cultivos egipcios con los mercados mundiales con excelencia.',
    rights: 'Todos los derechos reservados. Avialink Export.',
    adminPortal: 'Portal de Administración',
    developerLabel: 'Diseñado y desarrollado por:',
    developerName: 'Eng. Mohammed Tarek'
  },
  de: {
    tagline: 'Avialink Export - Wir verbinden erstklassige ägyptische Feldfrüchte mit globalen Märkten.',
    rights: 'Alle Rechte vorbehalten. Avialink Export.',
    adminPortal: 'Admin-Portal',
    developerLabel: 'Design & Entwicklung von:',
    developerName: 'Eng. Mohammed Tarek'
  },
  ru: {
    tagline: 'Avialink Export - Поставка отборной египетской сельхозпродукции на мировые рынки с гарантией свежести.',
    rights: 'Все права защищены. Avialink Export.',
    adminPortal: 'Панель администратора',
    developerLabel: 'Дизайн и разработка:',
    developerName: 'Eng. Mohammed Tarek'
  }
};

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenRFQ, lang = 'ar', companySettings }) => {
  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const isRtl = currentLangObj.dir === 'rtl';
  const footTxt = FOOTER_TEXTS[lang] || FOOTER_TEXTS.ar;

  const phone = companySettings?.phone || '(03) 11345627';
  const email = companySettings?.email || 'export@avialink.com';
  const websiteUrl = companySettings?.websiteUrl || 'avialink.com';
  const social = companySettings?.socialLinks;

  return (
    <footer className="bg-[#0B1A2C] text-slate-300 border-t border-slate-800/80 pt-14 pb-10" dir={currentLangObj.dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand & Social Icons (Left) */}
          <div className="space-y-4 text-center md:text-right">
            <Logo 
              size="lg" 
              variant="dark" 
              showSubtitle={true} 
              lang={lang} 
              onClick={() => onNavigate('home')}
              onFiveClicks={() => onNavigate('admin')}
            />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {footTxt.tagline}
            </p>

            {/* Social Media Circular Buttons */}
            <div className="flex items-center justify-center md:justify-start gap-2.5 pt-1">
              {social?.facebook && (
                <a 
                  href={social.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-[#182C42] border border-slate-700 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0B1A2C] transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {social?.twitter && (
                <a 
                  href={social.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-[#182C42] border border-slate-700 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0B1A2C] transition-all"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {social?.linkedin && (
                <a 
                  href={social.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-[#182C42] border border-slate-700 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0B1A2C] transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {social?.instagram && (
                <a 
                  href={social.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-[#182C42] border border-slate-700 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0B1A2C] transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {social?.youtube && (
                <a 
                  href={social.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-[#182C42] border border-slate-700 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0B1A2C] transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation Links (Center) */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold">
            <button onClick={() => onNavigate('home')} className="hover:text-[#C5A059] transition-colors">
              {t('nav_home', lang)}
            </button>
            <button onClick={() => onNavigate('products')} className="hover:text-[#C5A059] transition-colors">
              {t('nav_products', lang)}
            </button>
            <button onClick={() => onNavigate('portfolio')} className="hover:text-[#C5A059] transition-colors">
              {t('nav_portfolio', lang)}
            </button>
            <button onClick={() => onNavigate('quality')} className="hover:text-[#C5A059] transition-colors">
              {t('nav_quality', lang)}
            </button>
            <button onClick={() => onNavigate('markets')} className="hover:text-[#C5A059] transition-colors">
              {t('nav_markets', lang)}
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-[#C5A059] transition-colors">
              {t('nav_about', lang)}
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#C5A059] transition-colors">
              {t('nav_contact', lang)}
            </button>
          </div>

          {/* Contact Details (Right / Bottom) */}
          <div className="text-xs space-y-2 text-center md:text-left text-slate-300 font-medium">
            <div className="flex items-center justify-center md:justify-end gap-2">
              <span dir="ltr" className="font-bold text-white">{phone}</span>
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
            </div>
            <div className="flex items-center justify-center md:justify-end gap-2">
              <a href={`mailto:${email}`} className="hover:text-[#C5A059] underline">
                {email}
              </a>
              <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
            </div>
            <div className="flex items-center justify-center md:justify-end gap-2">
              <span className="text-slate-400">{websiteUrl}</span>
              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
            </div>

            {/* PWA In-App Install in Footer */}
            <div className="pt-2 flex items-center justify-center md:justify-end">
              <PWAInstallButton lang={lang} variant="footer" />
            </div>
          </div>

        </div>

        {/* Bottom Legal Rights & Professional Developer Credit */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800/60">
          <p>© {new Date().getFullYear()} {footTxt.rights}</p>
          
          {/* Eng. Mohammed Tarek Developer Credit */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#102235]/90 border border-[#C5A059]/40 text-xs text-slate-200 shadow-sm hover:border-[#C5A059] transition-all">
            <Code2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span className="text-slate-300 font-normal">{footTxt.developerLabel}</span>
            <span className="font-bold text-[#C5A059] tracking-wide" dir="ltr">
              {footTxt.developerName}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span>ISO 22000 & CAPQ Quality Frameworks</span>
          </div>
        </div>

      </div>
    </footer>
  );
};


