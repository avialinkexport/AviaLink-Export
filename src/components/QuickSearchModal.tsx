import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Package, 
  Ship, 
  Globe2, 
  FileText, 
  Sparkles, 
  MapPin, 
  Calendar, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Language, LANGUAGES, getLocalizedProduct, getLocalizedProject } from '../lib/i18n';
import { initialProducts } from '../data/products';
import { initialExportProjects } from '../data/portfolioData';
import { marketLandingPages } from '../data/markets';
import { Product, ExportProject } from '../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  onSelectProduct?: (product: Product) => void;
  onNavigate?: (route: string) => void;
  onOpenRFQ?: (productName?: string) => void;
  onOpenSpecSheet?: (product: Product) => void;
}

const SEARCH_TEXTS: Record<Language, {
  placeholder: string;
  badge: string;
  noResults: string;
  typeMinChar: string;
  cropsTitle: string;
  shipmentsTitle: string;
  marketsTitle: string;
  quickActionRfq: string;
  quickActionSpec: string;
  pressEsc: string;
  popularSearches: string[];
}> = {
  ar: {
    placeholder: 'ابحث عن محصول (بطاطا، بصل، برتقال، ثوم...)، صنف، ميناء، أو كود جمركي...',
    badge: 'محرك البحث الذكي للتصدير الزراعي',
    noResults: 'لم نجد نتائج تطابق بحثك. جرّب البحث باسم المحصول، الميناء، أو الصنف.',
    typeMinChar: 'ابدأ الكتابة للبحث الفوري في جميع محاصيل وشحنات أفيالينك...',
    cropsTitle: 'المحاصيل والمنتجات الزراعية',
    shipmentsTitle: 'الشحنات وموانئ التصدير',
    marketsTitle: 'الأسواق والممرات العالمية',
    quickActionRfq: 'طلب عرض سعر',
    quickActionSpec: 'المواصفات',
    pressEsc: 'اضغط ESC للإغلاق',
    popularSearches: ['بطاطا بيورجارد', 'بصل أحمر', 'برتقال فالنسيا', 'ميناء روتردام', 'ثوم جاف', 'رمان أسيوطي']
  },
  en: {
    placeholder: 'Search crops (Sweet Potatoes, Onions, Oranges...), variety, port, or HS code...',
    badge: 'Smart Agricultural Export Search Engine',
    noResults: 'No exact matches found. Try searching by crop, port, variety, or country.',
    typeMinChar: 'Type any character for instant search across all products & shipments...',
    cropsTitle: 'Agricultural Crops & Produce',
    shipmentsTitle: 'Export Shipments & Ports',
    marketsTitle: 'Global Markets & Corridors',
    quickActionRfq: 'Request Quote',
    quickActionSpec: 'Spec Sheet',
    pressEsc: 'Press ESC to close',
    popularSearches: ['Beauregard Sweet Potatoes', 'Red Onions', 'Valencia Oranges', 'Port of Rotterdam', 'Dry Garlic', 'Pomegranates']
  },
  fr: {
    placeholder: 'Rechercher une culture (Patates douces, Oignons...), variété, port ou code SH...',
    badge: 'Moteur de Recherche Export Intelligent',
    noResults: 'Aucun résultat. Essayez de chercher par culture, port, variété ou pays.',
    typeMinChar: 'Tapez une lettre pour lancer la recherche instantanée...',
    cropsTitle: 'Cultures & Produits Agricoles',
    shipmentsTitle: 'Expéditions & Ports d’exportation',
    marketsTitle: 'Marchés & Corridors Mondiaux',
    quickActionRfq: 'Demander un devis',
    quickActionSpec: 'Spécifications',
    pressEsc: 'Appuyez sur ÉCHAP pour fermer',
    popularSearches: ['Patates douces Beauregard', 'Oignons rouges', 'Oranges Valencia', 'Port de Rotterdam', 'Ail sec']
  },
  es: {
    placeholder: 'Buscar cultivos (Camote, Cebollas, Naranjas...), variedad, puerto o código SA...',
    badge: 'Motor de Búsqueda Inteligente de Exportación',
    noResults: 'No se encontraron resultados. Intente buscar por cultivo, puerto o variedad.',
    typeMinChar: 'Escriba cualquier letra para buscar al instante...',
    cropsTitle: 'Cultivos & Productos Agrícolas',
    shipmentsTitle: 'Envíos & Puertos de Exportación',
    marketsTitle: 'Mercados & Corredores Globales',
    quickActionRfq: 'Solicitar cotización',
    quickActionSpec: 'Ficha técnica',
    pressEsc: 'Presione ESC para cerrar',
    popularSearches: ['Camote Beauregard', 'Cebolla Roja', 'Naranja Valencia', 'Puerto de Rotterdam', 'Ajo Seco']
  },
  de: {
    placeholder: 'Kulturen suchen (Süßkartoffeln, Zwiebeln...), Sorte, Hafen oder HS-Code...',
    badge: 'Intelligente Agrar-Export-Suchmaschine',
    noResults: 'Keine Ergebnisse gefunden. Suchen Sie nach Kultur, Hafen oder Sorte.',
    typeMinChar: 'Geben Sie einen Buchstaben für die Sofortsuche ein...',
    cropsTitle: 'Agrarprodukte & Kulturen',
    shipmentsTitle: 'Export-Lieferungen & Häfen',
    marketsTitle: 'Weltweite Märkte & Korridore',
    quickActionRfq: 'Angebot anfordern',
    quickActionSpec: 'Datenblatt',
    pressEsc: 'ESC drücken zum Schließen',
    popularSearches: ['Süßkartoffeln Beauregard', 'Rote Zwiebeln', 'Valencia Orangen', 'Hafen Rotterdam', 'Knoblauch']
  },
  ru: {
    placeholder: 'Поиск культур (Батат, Лук, Апельсины...), сорта, порта или кода ТН ВЭД...',
    badge: 'Умный поисковый движок агроэкспорта',
    noResults: 'Ничего не найдено. Попробуйте найти по названию культуры, порту или сорту.',
    typeMinChar: 'Введите любой символ для мгновенного поиска...',
    cropsTitle: 'Сельскохозяйственные культуры',
    shipmentsTitle: 'Экспортные поставки и порты',
    marketsTitle: 'Мировые рынки и коридоры',
    quickActionRfq: 'Запросить расчет',
    quickActionSpec: 'Спецификация',
    pressEsc: 'Нажмите ESC для закрытия',
    popularSearches: ['Батат Борегард', 'Красный лук', 'Апельсины Валенсия', 'Порт Роттердам', 'Чеснок']
  }
};

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  lang = 'ar',
  onSelectProduct,
  onNavigate,
  onOpenRFQ,
  onOpenSpecSheet
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const isRtl = currentLangObj.dir === 'rtl';
  const txt = SEARCH_TEXTS[lang] || SEARCH_TEXTS.ar;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter(Boolean);

  // 1. Filter Crops / Products
  const matchedProducts = initialProducts.map((p) => ({
    original: p,
    localized: getLocalizedProduct(p, lang)
  })).filter(({ original, localized }) => {
    if (!q) return false;
    const nameLoc = (localized.name || '').toLowerCase();
    const nameOrig = (original.name || '').toLowerCase();
    const slug = (original.slug || '').toLowerCase();
    const desc = (localized.shortDescription || '').toLowerCase();
    const varieties = (localized.varieties || []).join(' ').toLowerCase();
    const hs = (original.hsCode || '').toLowerCase();

    return tokens.every((t) =>
      nameLoc.includes(t) ||
      nameOrig.includes(t) ||
      slug.includes(t) ||
      desc.includes(t) ||
      varieties.includes(t) ||
      hs.includes(t)
    );
  });

  // 2. Filter Export Shipments / Portfolio
  const matchedShipments = initialExportProjects.map((proj) => ({
    original: proj,
    localized: getLocalizedProject(proj, lang)
  })).filter(({ original, localized }) => {
    if (!q) return false;
    const crop = (localized.cropName || original.cropName || '').toLowerCase();
    const title = (localized.title || original.title || '').toLowerCase();
    const dest = (localized.destination || original.destination || '').toLowerCase();
    const port = (localized.port || original.port || '').toLowerCase();
    const specs = (localized.specsHighlight || original.specsHighlight || '').toLowerCase();

    return tokens.every((t) =>
      crop.includes(t) ||
      title.includes(t) ||
      dest.includes(t) ||
      port.includes(t) ||
      specs.includes(t)
    );
  });

  // 3. Filter Global Markets
  const matchedMarkets = marketLandingPages.filter((m) => {
    if (!q) return false;
    const regionName = (m.regionName || '').toLowerCase();
    const ports = (m.keyPorts || []).join(' ').toLowerCase();
    const crops = (m.popularProducts || []).join(' ').toLowerCase();
    const slug = (m.slug || '').toLowerCase();

    return tokens.every((t) =>
      regionName.includes(t) ||
      ports.includes(t) ||
      crops.includes(t) ||
      slug.includes(t)
    );
  });

  const totalResultsCount = matchedProducts.length + matchedShipments.length + matchedMarkets.length;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20 animate-fade-in"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#0F2133] border border-[#C5A059]/30 text-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-scale-up"
      >
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0A1622] space-y-3 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{txt.badge}</span>
            </span>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex items-center">
            <Search className={`w-5 h-5 text-[#C5A059] absolute ${isRtl ? 'right-4' : 'left-4'}`} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={txt.placeholder}
              className={`w-full bg-[#152B42] text-white placeholder-slate-400 text-sm sm:text-base font-medium py-3.5 rounded-2xl border border-white/15 focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all ${
                isRtl ? 'pr-12 pl-10' : 'pl-12 pr-10'
              }`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className={`absolute ${isRtl ? 'left-3' : 'right-3'} p-1 text-slate-400 hover:text-white cursor-pointer`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results Container / Empty State */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {!q ? (
            <div className="space-y-3 py-8 text-center">
              <Search className="w-8 h-8 text-[#C5A059]/60 mx-auto" />
              <p className="text-slate-300 font-medium text-sm max-w-sm mx-auto">
                {txt.typeMinChar}
              </p>
            </div>
          ) : totalResultsCount === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-slate-300 font-bold text-sm max-w-md mx-auto">
                {txt.noResults}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* 🌾 Products Category */}
              {matchedProducts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-[#C5A059] uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                    <Package className="w-4 h-4" />
                    <span>{txt.cropsTitle} ({matchedProducts.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {matchedProducts.map(({ original, localized }) => (
                      <div
                        key={original.id}
                        className="bg-[#152B42] hover:bg-[#1C3957] border border-white/10 hover:border-[#C5A059]/50 rounded-2xl p-3.5 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div
                          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                          onClick={() => {
                            if (onSelectProduct) onSelectProduct(original);
                            if (onNavigate) onNavigate('products');
                            onClose();
                          }}
                        >
                          <img
                            src={original.heroImage || original.images?.[0] || ''}
                            alt={localized.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                          />
                          <div className="min-w-0">
                            <h4 className="font-black text-sm text-white group-hover:text-[#C5A059] transition-colors truncate">
                              {localized.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">
                              {localized.varieties.join(', ')} • {localized.origin}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {onOpenSpecSheet && (
                            <button
                              type="button"
                              onClick={() => {
                                onOpenSpecSheet(original);
                                onClose();
                              }}
                              className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                            >
                              {txt.quickActionSpec}
                            </button>
                          )}
                          {onOpenRFQ && (
                            <button
                              type="button"
                              onClick={() => {
                                onOpenRFQ(localized.name);
                                onClose();
                              }}
                              className="bg-[#C5A059] hover:bg-[#b08d4a] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-xs cursor-pointer"
                            >
                              {txt.quickActionRfq}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🚢 Export Shipments / Portfolio Category */}
              {matchedShipments.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-[#C5A059] uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                    <Ship className="w-4 h-4" />
                    <span>{txt.shipmentsTitle} ({matchedShipments.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {matchedShipments.map(({ original, localized }) => (
                      <div
                        key={original.id}
                        onClick={() => {
                          if (onNavigate) onNavigate('portfolio');
                          onClose();
                        }}
                        className="bg-[#152B42] hover:bg-[#1C3957] border border-white/10 hover:border-[#C5A059]/50 rounded-2xl p-3.5 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{localized.destination} — {localized.port}</span>
                          </div>
                          <h4 className="font-bold text-sm text-white group-hover:text-[#C5A059]">
                            {localized.cropName} ({localized.volumeTonnes} طن / {localized.containerCount} حاوية)
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {localized.specsHighlight}
                          </p>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 group-hover:text-[#C5A059] ${isRtl ? 'rotate-180' : ''}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🌍 Global Markets Category */}
              {matchedMarkets.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-[#C5A059] uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                    <Globe2 className="w-4 h-4" />
                    <span>{txt.marketsTitle} ({matchedMarkets.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {matchedMarkets.map((m) => (
                      <div
                        key={m.slug}
                        onClick={() => {
                          if (onNavigate) onNavigate('markets');
                          onClose();
                        }}
                        className="bg-[#152B42] hover:bg-[#1C3957] border border-white/10 hover:border-[#C5A059]/50 rounded-2xl p-3 transition-all flex items-center justify-between gap-2 cursor-pointer group"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#C5A059]">
                            <Globe2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                            <span className="truncate">{m.regionName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">
                            {m.keyPorts?.join(', ')}
                          </p>
                        </div>
                        {onOpenRFQ && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenRFQ(m.popularProducts?.[0] || 'Egyptian Produce');
                              onClose();
                            }}
                            className="bg-[#C5A059] hover:bg-[#b08d4a] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer"
                          >
                            RFQ
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3 bg-[#0A1622] border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>{txt.pressEsc}</span>
          <span className="font-mono text-[#C5A059]">AVIALINK SMART SEARCH</span>
        </div>
      </div>
    </div>
  );
};
