import React, { useState, useEffect, Suspense, lazy } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { TrustCenter } from './components/TrustCenter';
import { GlobalMarketsSection } from './components/GlobalMarketsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { PortfolioSection } from './components/PortfolioSection';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { GroupeBrousseGrid } from './components/GroupeBrousseGrid';
import { FivePillarsSection } from './components/FivePillarsSection';
import { GroupInFigures } from './components/GroupInFigures';
import { OutsideSeriesSection } from './components/OutsideSeriesSection';
import { NewsAndCSRSection } from './components/NewsAndCSRSection';

// Lazy-loaded routes and modals for ultra-fast initial page load
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const PlaceholdersLogView = lazy(() => import('./components/PlaceholdersLogView').then(m => ({ default: m.PlaceholdersLogView })));
const ProductDetailPage = lazy(() => import('./components/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const MarketLandingView = lazy(() => import('./components/MarketLandingView').then(m => ({ default: m.MarketLandingView })));
const RFQModal = lazy(() => import('./components/RFQModal').then(m => ({ default: m.RFQModal })));
const SpecSheetModal = lazy(() => import('./components/SpecSheetModal').then(m => ({ default: m.SpecSheetModal })));
const QuickSearchModal = lazy(() => import('./components/QuickSearchModal').then(m => ({ default: m.QuickSearchModal })));

const LazyRouteFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-12">
    <div className="w-10 h-10 border-3 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

import { fetchProducts, fetchAnalytics, fetchCompanySettings, fetchSiteContent } from './lib/api';
import { trackEvent } from './lib/analytics';
import { Product, CompanySettings, SiteContent } from './types';
import { initialProducts } from './data/products';
import { Language, LANGUAGES, detectUserLanguage, getLocalizedProduct } from './lib/i18n';
import { updatePageSEO } from './lib/seo';

function parseLocation(pathname: string, productsList: Product[]) {
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  const safePool = (productsList && productsList.length > 0) ? productsList : initialProducts;

  if (cleanPath === '/' || cleanPath === '') {
    return { route: 'home', product: null, marketSlug: null };
  }
  if (cleanPath === '/admin') {
    return { route: 'admin', product: null, marketSlug: null };
  }
  if (cleanPath === '/placeholders') {
    return { route: 'placeholders', product: null, marketSlug: null };
  }
  if (cleanPath === '/products') {
    return { route: 'products', product: null, marketSlug: null };
  }
  if (cleanPath.startsWith('/products/')) {
    const slug = cleanPath.replace('/products/', '');
    const found = safePool.find((p) => p.slug === slug || p.id === slug) || initialProducts.find((p) => p.slug === slug || p.id === slug);
    return { route: 'product-detail', product: found || initialProducts[0], marketSlug: null, slug };
  }
  if (cleanPath.startsWith('/markets/')) {
    const mSlug = cleanPath.replace('/markets/', '');
    return { route: 'market-detail', product: null, marketSlug: mSlug };
  }
  if (cleanPath === '/markets' || cleanPath === '/routes' || cleanPath === '/process') {
    return { route: 'markets', product: null, marketSlug: null };
  }
  if (cleanPath === '/quality' || cleanPath === '/verification' || cleanPath === '/trust') {
    return { route: 'quality', product: null, marketSlug: null };
  }
  if (cleanPath === '/portfolio') {
    return { route: 'portfolio', product: null, marketSlug: null };
  }
  if (cleanPath === '/about') {
    return { route: 'about', product: null, marketSlug: null };
  }
  if (cleanPath === '/contact') {
    return { route: 'contact', product: null, marketSlug: null };
  }
  return { route: 'home', product: null, marketSlug: null };
}

export default function App() {
  const [splashCompleted, setSplashCompleted] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [lang, setLang] = useState<Language>(() => detectUserLanguage());

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProducts[0]);
  const [selectedMarketSlug, setSelectedMarketSlug] = useState<string>('europe');

  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [rfqInitialProduct, setRfqInitialProduct] = useState('Egyptian Fresh Sweet Potatoes');

  const [specModalOpen, setSpecModalOpen] = useState(false);
  const [specModalProduct, setSpecModalProduct] = useState<Product | null>(null);

  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const [analyticsSummary, setAnalyticsSummary] = useState<any>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | undefined>(undefined);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);

  // Global Ctrl+K / Cmd+K search shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync initial URL path and load company settings & site CMS content
  useEffect(() => {
    fetchProducts().then((data) => {
      const activeData = (data && Array.isArray(data) && data.length > 0) ? data : initialProducts;
      setProducts(activeData);
      const parsed = parseLocation(window.location.pathname, activeData);
      setCurrentRoute(parsed.route);
      if (parsed.product) {
        setSelectedProduct(parsed.product);
      } else if (activeData.length > 0) {
        setSelectedProduct(activeData[0]);
      }
      if (parsed.marketSlug) {
        setSelectedMarketSlug(parsed.marketSlug);
      }
    }).catch(() => {
      setProducts(initialProducts);
      const parsed = parseLocation(window.location.pathname, initialProducts);
      setCurrentRoute(parsed.route);
      setSelectedProduct(parsed.product || initialProducts[0]);
    });

    fetchCompanySettings().then(setCompanySettings).catch(console.error);
    fetchAnalytics().then(setAnalyticsSummary).catch(console.error);
    fetchSiteContent().then(setSiteContent).catch(console.error);
    trackEvent('page_view', { path: window.location.pathname });
  }, []);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseLocation(window.location.pathname, products);
      setCurrentRoute(parsed.route);
      if (parsed.product) setSelectedProduct(parsed.product);
      if (parsed.marketSlug) setSelectedMarketSlug(parsed.marketSlug);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  // Dynamic document title, meta tags, OpenGraph & JSON-LD schema update
  useEffect(() => {
    updatePageSEO(currentRoute, lang, selectedProduct, selectedMarketSlug);
  }, [currentRoute, lang, selectedProduct, selectedMarketSlug]);

  const handleSelectLang = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('avialink_user_lang', newLang);
    }
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const handleOpenRFQ = (productName?: string) => {
    if (productName) {
      setRfqInitialProduct(productName);
    }
    setRfqModalOpen(true);
  };

  const handleOpenSpecSheet = (product: Product) => {
    setSpecModalProduct(product);
    setSpecModalOpen(true);
  };

  const handleSelectCrop = (cropKey: string) => {
    const matched = products.find(
      (p) =>
        p.slug.includes(cropKey) ||
        p.id.includes(cropKey) ||
        p.name.toLowerCase().includes(cropKey)
    );
    if (matched) {
      handleSelectProduct(matched);
    } else {
      const el = document.getElementById('products-catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else handleNavigate('products');
    }
  };

  const handleOpenRFQForCrop = (cropKey: string) => {
    let cropName = 'Egyptian Agricultural Produce';
    if (cropKey === 'sweet-potato' || cropKey === 'sweet-potatoes') cropName = 'Egyptian Fresh Sweet Potatoes (Beauregard / Bellevue)';
    else if (cropKey === 'onions' || cropKey === 'onions-garlic') cropName = 'Premium Golden & Red Egyptian Onions & Garlic';
    else if (cropKey === 'carrots' || cropKey === 'carrots-beetroot') cropName = 'Hydro-Cooled Nantes Carrots & Fresh Beetroot';
    else if (cropKey === 'garlic') cropName = 'Fresh Egyptian Garlic (Baladi & Purple)';
    handleOpenRFQ(cropName);
  };

  const handleProductsUpdated = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    if (selectedProduct) {
      const updated = updatedProducts.find((p) => p.id === selectedProduct.id || p.slug === selectedProduct.slug);
      if (updated) {
        setSelectedProduct(updated);
      } else if (updatedProducts.length > 0) {
        setSelectedProduct(updatedProducts[0]);
      }
    } else if (updatedProducts.length > 0) {
      setSelectedProduct(updatedProducts[0]);
    }
  };

  const handleNavigate = (route: string) => {
    let path = '/';
    if (route === 'home') path = '/';
    else if (route === 'quality') path = '/verification';
    else path = `/${route}`;

    if (window.location.pathname !== path) {
      window.history.pushState({ route }, '', path);
    }

    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('page_view', { route, path });

    // Always ensure fresh products when navigating back to site
    if (route !== 'admin') {
      fetchProducts().then(handleProductsUpdated).catch(console.error);
    }
  };

  const handleSelectProduct = (product: Product) => {
    const path = `/products/${product.slug}`;
    if (window.location.pathname !== path) {
      window.history.pushState({ route: 'product-detail', slug: product.slug }, '', path);
    }
    setSelectedProduct(product);
    setCurrentRoute('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('page_view', { route: 'product-detail', product: product.slug });
  };

  const handleNavigateMarket = (marketSlug: string) => {
    const path = `/markets/${marketSlug}`;
    if (window.location.pathname !== path) {
      window.history.pushState({ route: 'market-detail', slug: marketSlug }, '', path);
    }
    setSelectedMarketSlug(marketSlug);
    setCurrentRoute('market-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('page_view', { route: 'market-detail', market: marketSlug });
  };

  return (
    <div 
      className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-[#C5A059] selection:text-white"
      dir={currentLangObj.dir}
    >
      
      {/* 1. Fast Splash Screen (§4 - 1.5s max) */}
      {!splashCompleted && (
        <SplashScreen onComplete={() => setSplashCompleted(true)} lang={lang} />
      )}

      {/* 2. Primary Navigation Bar */}
      <Navbar
        activeSection={currentRoute}
        onNavigate={handleNavigate}
        onOpenRFQ={handleOpenRFQ}
        onOpenSearch={() => setSearchModalOpen(true)}
        lang={lang}
        onChangeLang={handleSelectLang}
        onSelectLang={handleSelectLang}
        announcement={siteContent?.announcement}
        companySettings={companySettings}
      />

      {/* 3. Main Views Routing */}
      <main className="flex-grow">
        {currentRoute === 'admin' ? (
          <Suspense fallback={<LazyRouteFallback />}>
            <AdminPanel 
              onBackToSite={() => handleNavigate('home')} 
              lang={lang} 
              onSettingsUpdated={(newSettings) => setCompanySettings(newSettings)}
              onNavigateToProduct={(product) => handleSelectProduct(product)}
              onProductsUpdated={handleProductsUpdated}
              siteContent={siteContent || undefined}
              onSiteContentUpdated={(newContent) => setSiteContent(newContent)}
            />
          </Suspense>
        ) : currentRoute === 'placeholders' ? (
          <Suspense fallback={<LazyRouteFallback />}>
            <PlaceholdersLogView onBack={() => handleNavigate('home')} lang={lang} />
          </Suspense>
        ) : currentRoute === 'product-detail' ? (
          <Suspense fallback={<LazyRouteFallback />}>
            <ProductDetailPage
              product={getLocalizedProduct(selectedProduct || products[0] || initialProducts[0], lang)}
              onBack={() => handleNavigate('products')}
              onOpenSpecSheet={handleOpenSpecSheet}
              onOpenRFQ={handleOpenRFQ}
              lang={lang}
            />
          </Suspense>
        ) : currentRoute === 'market-detail' ? (
          <Suspense fallback={<LazyRouteFallback />}>
            <MarketLandingView
              slug={selectedMarketSlug}
              onBack={() => handleNavigate('markets')}
              onOpenRFQ={handleOpenRFQ}
              lang={lang}
            />
          </Suspense>
        ) : (
          <>
            {/* Standard Homepage Scroll Layout */}
            {currentRoute === 'home' && (
              <>
                <HeroSection
                  onNavigate={handleNavigate}
                  onOpenRFQ={handleOpenRFQ}
                  analyticsSummary={analyticsSummary}
                  lang={lang}
                />

                {/* Groupe Brousse Design: Signature Product Universes Bento Grid */}
                <GroupeBrousseGrid
                  lang={lang}
                  onSelectCrop={handleSelectCrop}
                  onOpenRFQForCrop={handleOpenRFQForCrop}
                />

                {/* Groupe Brousse Design: The 5 Strategic Pillars */}
                <FivePillarsSection
                  lang={lang}
                  onOpenRFQ={() => handleOpenRFQ()}
                  pillars={siteContent?.pillars}
                />

                {/* Groupe Brousse Design: Key Figures & Global Metrics */}
                <GroupInFigures
                  lang={lang}
                  figures={siteContent?.figures}
                />

                {/* Detailed Interactive Product Catalog */}
                <ProductCatalog
                  products={products.length > 0 ? products : initialProducts}
                  onSelectProduct={handleSelectProduct}
                  onOpenSpecSheet={handleOpenSpecSheet}
                  onOpenRFQ={handleOpenRFQ}
                  lang={lang}
                  isDedicatedPage={false}
                />

                {/* Groupe Brousse Design: AviaLink OUTSIDE Field Expeditions Series */}
                <OutsideSeriesSection
                  lang={lang}
                  onNavigateSupplyChain={() => handleNavigate('markets')}
                  onOpenRFQ={handleOpenRFQ}
                  dynamicProtocols={siteContent?.protocols}
                />

                {/* Verified Shipments Portfolio */}
                <PortfolioSection
                  onOpenRFQ={handleOpenRFQ}
                  lang={lang}
                />

                {/* Quality, Standards & Trust Center */}
                <TrustCenter onOpenRFQ={() => handleOpenRFQ()} lang={lang} />

                {/* Groupe Brousse Design: International News & Dual-Axis CSR Commitments */}
                <NewsAndCSRSection
                  lang={lang}
                  onOpenRFQ={() => handleOpenRFQ()}
                  exhibitions={siteContent?.exhibitions}
                  csr={siteContent?.csr}
                />

                {/* Global Markets & Shipping Logistics */}
                <GlobalMarketsSection
                  onOpenRFQ={handleOpenRFQ}
                  onNavigateMarket={handleNavigateMarket}
                  lang={lang}
                />

                <AboutSection onOpenRFQ={() => handleOpenRFQ()} lang={lang} />
                <ContactSection onOpenRFQ={() => handleOpenRFQ()} lang={lang} companySettings={companySettings} />
              </>
            )}

            {/* Dedicated Products Catalog View */}
            {currentRoute === 'products' && (
              <ProductCatalog
                products={products.length > 0 ? products : initialProducts}
                onSelectProduct={handleSelectProduct}
                onOpenSpecSheet={handleOpenSpecSheet}
                onOpenRFQ={handleOpenRFQ}
                lang={lang}
                isDedicatedPage={true}
              />
            )}

            {/* Dedicated Portfolio View */}
            {currentRoute === 'portfolio' && (
              <div className="pt-16">
                <PortfolioSection
                  onOpenRFQ={handleOpenRFQ}
                  lang={lang}
                />
              </div>
            )}

            {/* Dedicated Quality & Standards View */}
            {currentRoute === 'quality' && (
              <div className="pt-16">
                <TrustCenter onOpenRFQ={() => handleOpenRFQ()} lang={lang} />
              </div>
            )}

            {/* Dedicated Global Markets & Shipping Logistics View */}
            {(currentRoute === 'markets' || currentRoute === 'process') && (
              <div className="pt-16">
                <GlobalMarketsSection
                  onOpenRFQ={handleOpenRFQ}
                  onNavigateMarket={handleNavigateMarket}
                  lang={lang}
                />
              </div>
            )}

            {/* Dedicated About View */}
            {currentRoute === 'about' && (
              <div className="pt-16">
                <AboutSection onOpenRFQ={() => handleOpenRFQ()} lang={lang} />
              </div>
            )}

            {/* Dedicated Contact View */}
            {currentRoute === 'contact' && (
              <div className="pt-16">
                <ContactSection onOpenRFQ={() => handleOpenRFQ()} lang={lang} companySettings={companySettings} />
              </div>
            )}
          </>
        )}
      </main>

      {/* 4. Footer */}
      {currentRoute !== 'admin' && (
        <Footer 
          onNavigate={handleNavigate} 
          onOpenRFQ={() => handleOpenRFQ()} 
          lang={lang} 
          companySettings={companySettings}
        />
      )}

      {/* 5. Persistent Floating WhatsApp Button */}
      <WhatsAppButton lang={lang} companySettings={companySettings} />

      {/* 6. RFQ Workflow Modal */}
      {rfqModalOpen && (
        <Suspense fallback={null}>
          <RFQModal
            isOpen={rfqModalOpen}
            onClose={() => setRfqModalOpen(false)}
            initialProduct={rfqInitialProduct}
            lang={lang}
            companySettings={companySettings}
          />
        </Suspense>
      )}

      {/* 7. Specification Sheet Modal */}
      {specModalOpen && (
        <Suspense fallback={null}>
          <SpecSheetModal
            product={specModalProduct ? getLocalizedProduct(specModalProduct, lang) : null}
            isOpen={specModalOpen}
            onClose={() => setSpecModalOpen(false)}
            onOpenRFQ={handleOpenRFQ}
            lang={lang}
          />
        </Suspense>
      )}

      {/* 8. Global Smart Search Modal */}
      {searchModalOpen && (
        <Suspense fallback={null}>
          <QuickSearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
            lang={lang}
            onSelectProduct={(p) => {
              handleSelectProduct(p);
              handleNavigate('product-detail');
            }}
            onNavigate={(route) => handleNavigate(route)}
            onOpenRFQ={(pName) => handleOpenRFQ(pName)}
            onOpenSpecSheet={(p) => handleOpenSpecSheet(p)}
          />
        </Suspense>
      )}

      {/* 9. Offline PWA Status Indicator */}
      <OfflineIndicator lang={lang} />

    </div>
  );
}

