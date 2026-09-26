import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowRight, Globe, HelpCircle, ChevronDown, Search, Phone, MapPin, Clock, Sparkles } from 'lucide-react';
import { Language, LANGUAGES, t, GROUPE_BROUSSE_TRANSLATIONS } from '../lib/i18n';
import { PWAInstallButton } from './PWAInstallButton';
import { AnnouncementBanner, CompanySettings } from '../types';

interface NavbarProps {
  activeSection: string;
  onNavigate: (route: string) => void;
  onOpenRFQ: (productName?: string) => void;
  onOpenSearch?: () => void;
  lang: Language;
  onChangeLang?: (newLang: Language) => void;
  onSelectLang?: (newLang: Language) => void;
  announcement?: AnnouncementBanner;
  companySettings?: CompanySettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenRFQ,
  onOpenSearch,
  lang = 'ar',
  onChangeLang,
  onSelectLang,
  announcement,
  companySettings
}) => {
  const handleLangChange = (newLang: Language) => {
    if (onChangeLang) onChangeLang(newLang);
    if (onSelectLang) onSelectLang(newLang);
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const brousseTop = GROUPE_BROUSSE_TRANSLATIONS[lang]?.topBar || GROUPE_BROUSSE_TRANSLATIONS.en.topBar;

  const getHotlineDisplay = () => {
    const rawNumber = companySettings?.hotline || '+20 (0) 10 933 933 55';
    const fullText = brousseTop.hotline;
    const colonIdx = fullText.indexOf(':');
    if (colonIdx !== -1) {
      const label = fullText.substring(0, colonIdx + 1);
      return `${label} ${rawNumber}`;
    }
    return fullText;
  };

  const getHotlineTelLink = () => {
    const rawNumber = companySettings?.hotline || '+201093393355';
    const cleanNum = rawNumber.replace(/[^\d+]/g, '');
    return `tel:${cleanNum.startsWith('+') ? cleanNum : '+' + cleanNum}`;
  };

  const navLinks = [
    { label: t('nav_home', lang), route: 'home' },
    { label: t('nav_about', lang), route: 'about' },
    { label: t('nav_quality', lang), route: 'quality' },
    { label: t('nav_products', lang), route: 'products' },
    { label: t('nav_portfolio', lang), route: 'portfolio' },
    { label: t('nav_markets', lang), route: 'markets' },
    { label: t('nav_contact', lang), route: 'contact' }
  ];

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl'
          : 'bg-slate-950 border-b border-slate-800/80 shadow-md'
      }`}
      dir={currentLangObj.dir}
    >
      {/* Dynamic Top Announcement Banner from CMS */}
      {announcement?.enabled && (
        <div className="bg-gradient-to-r from-[#997328] via-[#C5A059] to-[#8C6418] text-slate-950 px-4 py-1.5 text-xs font-bold shadow-xs border-b border-[#C5A059]/40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="bg-slate-950 text-[#F3D78F] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-black shrink-0">
                {lang === 'ar' ? (announcement.badge || 'إعلان هـام') : (announcement.badgeEn || announcement.badge || 'Notice')}
              </span>
              <span className="truncate font-bold text-slate-950 text-[11px] sm:text-xs">
                {lang === 'ar' ? announcement.text : (announcement.textEn || announcement.text)}
              </span>
            </div>
            {announcement.linkUrl && (
              <a
                href={announcement.linkUrl}
                className="shrink-0 text-slate-950 hover:text-white underline transition-colors text-[11px] font-black"
              >
                {lang === 'ar' ? (announcement.linkText || 'التفاصيل') : (announcement.linkTextEn || announcement.linkText || 'Details')} →
              </a>
            )}
          </div>
        </div>
      )}
      {/* Top Corporate Utility Bar - Inspired by Groupe Brousse */}
      <div className="hidden lg:block bg-slate-900 border-b border-slate-800/80 text-[11px] text-slate-300 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Direct Phone & Operational Hubs */}
          <div className="flex items-center gap-6">
            <a 
              href={getHotlineTelLink()} 
              className="inline-flex items-center gap-1.5 hover:text-[#C5A059] transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{getHotlineDisplay()}</span>
            </a>

            <div className="hidden xl:flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{brousseTop.hubs}</span>
            </div>

            <div className="hidden 2xl:flex items-center gap-1.5 text-emerald-400 font-medium">
              <Clock className="w-3 h-3" />
              <span>{brousseTop.workingHours}</span>
            </div>
          </div>

          {/* Quick Shortcuts & Language Bar */}
          <div className="flex items-center gap-4">
            {/* Quick Search Shortcut */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#C5A059] bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 transition-all cursor-pointer"
                title="Smart Search (Ctrl+K)"
              >
                <Search className="w-3 h-3 text-[#C5A059]" />
                <span>{brousseTop.searchPrompt}</span>
              </button>
            )}

            {/* Quick Language Switcher Row (AR | EN | FR | ES | DE | RU) */}
            <div className="flex items-center gap-1 text-[10px] font-bold">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLangChange(l.code)}
                  className={`px-1.5 py-0.5 rounded transition-all uppercase ${
                    lang === l.code
                      ? 'bg-[#C5A059] text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {l.code}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleNavClick('placeholders')}
              className="text-[11px] text-slate-400 hover:text-[#C5A059] transition-colors flex items-center gap-1"
              title="Data Integrity & Verification"
            >
              <HelpCircle className="w-3 h-3 text-[#C5A059]" />
              <span>{t('nav_integrity', lang)}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between">
        
        {/* Brand Logo with 5-click secret admin trigger */}
        <div className="focus:outline-none group text-right shrink-0">
          <Logo 
            size="md" 
            variant="dark" 
            showSubtitle={true} 
            lang={lang} 
            onClick={() => handleNavClick('home')}
            onFiveClicks={() => onNavigate('admin')}
          />
        </div>

        {/* Center Desktop Links - Groupe Brousse Elegant Spaced Typography */}
        <nav className="hidden lg:flex items-center space-x-1 space-x-reverse xl:space-x-2 xl:space-x-reverse">
          {navLinks.map((link) => {
            const isActive = activeSection === link.route;
            return (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`px-3.5 py-2 rounded-lg text-xs xl:text-sm font-semibold tracking-wide uppercase transition-all ${
                  isActive
                    ? 'text-[#E0C078] bg-slate-800/90 font-bold border-b-2 border-[#C5A059]'
                    : 'text-slate-300 hover:text-[#C5A059] hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & RFQ Button (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Desktop PWA Install Button */}
          <PWAInstallButton lang={lang} variant="nav" />

          {/* Golden RFQ Button */}
          <button
            onClick={() => onOpenRFQ()}
            className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#d8b368] text-slate-950 font-bold text-xs px-5 py-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[#C5A059]/20"
          >
            <span>{t('nav_rfq_btn', lang)}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${currentLangObj.dir === 'rtl' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Mobile & Tablet Header Controls (< lg) */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Mobile Smart Search Trigger */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-slate-300 hover:text-[#C5A059] bg-slate-900 border border-slate-800 rounded-full transition-colors cursor-pointer"
              aria-label="Smart Search"
            >
              <Search className="w-4 h-4 text-[#C5A059]" />
            </button>
          )}

          {/* Single Universal Mobile Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="text-xs font-bold text-slate-200 hover:text-[#C5A059] bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-full flex items-center gap-1 transition-colors"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-bold text-xs">{currentLangObj.flag} {currentLangObj.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className={`absolute top-full mt-2 ${currentLangObj.dir === 'rtl' ? 'left-0' : 'right-0'} bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 w-44 z-50 animate-fade-in text-slate-200`}>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        handleLangChange(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-start px-4 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        lang === l.code ? 'text-[#C5A059] bg-slate-800/80 font-black' : 'text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.nativeName}</span>
                      </span>
                      {lang === l.code && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:bg-slate-900 rounded-xl border border-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-fade-in text-white">
          <div className="space-y-1 pt-1">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between ${
                  activeSection === link.route
                    ? 'text-[#C5A059] bg-[#C5A059]/10'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span>{link.label}</span>
                {activeSection === link.route && <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>}
              </button>
            ))}
          </div>

          {/* Mobile In-App Install Card */}
          <div className="pt-1">
            <PWAInstallButton lang={lang} variant="mobile-menu" />
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                onOpenRFQ();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#C5A059] text-slate-950 font-bold py-3 px-4 rounded-full text-center text-xs shadow-md"
            >
              <span>{t('nav_rfq_btn', lang)}</span>
              <ArrowRight className={`w-4 h-4 ${currentLangObj.dir === 'rtl' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};



