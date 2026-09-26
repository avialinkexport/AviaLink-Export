import { Lead, Product, CertificationItem, BuyerRating, PlaceholderItem, CompanySettings, SiteContent, ExhibitionItem, MetricFigureItem, StrategicPillarItem, DynamicProtocolItem, CSRSettings, AnnouncementBanner } from '../types';

export async function fetchCaptchaChallenge(): Promise<{
  challengeId: string;
  num1: number;
  num2: number;
  prompt: string;
}> {
  const res = await fetch('/api/rfq/captcha');
  if (!res.ok) throw new Error('Failed to load security challenge');
  return res.json();
}

export async function submitRFQ(payload: {
  fullName: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  productInterest: string;
  quantity: number;
  quantityUnit: string;
  variety?: string;
  grade?: string;
  size?: string;
  preferredPackaging?: string;
  destinationPort?: string;
  incoterm?: string;
  preferredShipmentDate?: string;
  shippingNotes?: string;
  message?: string;
  source?: string;
  honeypot?: string;
  captchaChallengeId?: string;
  captchaAnswer?: number;
}) {
  const res = await fetch('/api/rfq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    const error: any = new Error(data.error || 'Failed to submit quote request');
    error.details = data.details;
    throw error;
  }
  return data;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Failed to load products');
  return res.json();
}

export async function fetchCertifications(): Promise<CertificationItem[]> {
  const res = await fetch('/api/certifications');
  if (!res.ok) throw new Error('Failed to load certifications');
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch('/api/analytics');
  if (!res.ok) throw new Error('Failed to load analytics');
  return res.json();
}

export async function fetchRatings() {
  const res = await fetch('/api/ratings');
  if (!res.ok) throw new Error('Failed to load ratings');
  return res.json();
}

export async function submitRating(payload: { rating: number; buyerCompany?: string; buyerCountry?: string; comment?: string }) {
  const res = await fetch('/api/ratings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit feedback rating');
  return data;
}

export async function fetchPlaceholders(): Promise<PlaceholderItem[]> {
  const res = await fetch('/api/placeholders');
  if (!res.ok) throw new Error('Failed to load placeholders log');
  return res.json();
}

// Admin API
export async function fetchAdminLeads(password: string, status = 'all', search = '') {
  const params = new URLSearchParams({ status, search });
  const res = await fetch(`/api/admin/leads?${params.toString()}`, {
    headers: { Authorization: `Bearer ${password}` }
  });
  if (!res.ok) throw new Error('Admin authentication failed or invalid credentials');
  return res.json();
}

// Mints a short-lived, single-use token for the CSV export link, so the real
// admin password never has to be placed in a URL (window.open cannot attach
// custom headers to the request it makes).
export async function requestExportToken(password: string): Promise<string> {
  const res = await fetch('/api/admin/export-token', {
    method: 'POST',
    headers: { Authorization: `Bearer ${password}` }
  });
  if (!res.ok) throw new Error('Admin authentication failed or invalid credentials');
  const data = await res.json();
  return data.token as string;
}

export async function updateLeadStatus(password: string, leadId: string, status: string) {
  const res = await fetch(`/api/admin/leads/${leadId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${password}`
    },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update lead status');
  return res.json();
}

export async function saveAdminProduct(password: string, product: Partial<Product>) {
  const res = await fetch('/api/admin/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${password}`
    },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to save product');
  return res.json();
}

export async function deleteAdminProduct(password: string, id: string) {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${password}` }
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
}

export async function fetchPortfolio() {
  const res = await fetch('/api/portfolio');
  if (!res.ok) throw new Error('Failed to fetch portfolio projects');
  return res.json();
}

export async function saveAdminPortfolio(password: string, project: any) {
  const res = await fetch('/api/admin/portfolio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${password}`
    },
    body: JSON.stringify(project)
  });
  if (!res.ok) throw new Error('Failed to save portfolio project');
  return res.json();
}

export async function deleteAdminPortfolio(password: string, id: string) {
  const res = await fetch(`/api/admin/portfolio/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${password}` }
  });
  if (!res.ok) throw new Error('Failed to delete portfolio project');
  return res.json();
}

export async function fetchCompanySettings(): Promise<CompanySettings> {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Failed to fetch company settings');
  return res.json();
}

export async function saveAdminSettings(password: string, settings: Partial<CompanySettings>): Promise<CompanySettings> {
  const res = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${password}`
    },
    body: JSON.stringify(settings)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update company settings');
  return (data.settings || data) as CompanySettings;
}

export async function generateProductSpecsWithAI(password: string, promptCropName: string): Promise<Partial<Product>> {
  const res = await fetch('/api/admin/generate-product-specs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${password}`
    },
    body: JSON.stringify({ promptCropName })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to generate product specs with AI');
  return data.product;
}

export async function autoTranslateTextWithAI(password: string, text: string, sourceLang?: string): Promise<Record<string, string>> {
  const res = await fetch('/api/admin/auto-translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${password}`
    },
    body: JSON.stringify({ text, sourceLang })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to auto-translate text with AI');
  return data.translations;
}

// ==================== FULL CMS SITE CONTENT APIS ====================

export async function fetchSiteContent(): Promise<SiteContent> {
  const res = await fetch('/api/site-content');
  if (!res.ok) throw new Error('Failed to load dynamic site content');
  return res.json();
}

export async function saveAdminSiteContent(password: string, content: Partial<SiteContent>): Promise<SiteContent> {
  const res = await fetch('/api/admin/site-content', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${password}`
    },
    body: JSON.stringify(content)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update site content');
  return data.siteContent;
}

export async function saveAdminExhibition(password: string, exhibition: Partial<ExhibitionItem>): Promise<ExhibitionItem> {
  const res = await fetch('/api/admin/exhibitions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${password}`
    },
    body: JSON.stringify(exhibition)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save exhibition');
  return data.exhibition;
}

export async function deleteAdminExhibition(password: string, id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/admin/exhibitions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${password}` }
  });
  if (!res.ok) throw new Error('Failed to delete exhibition');
  return res.json();
}

export async function saveAdminProtocol(password: string, protocol: Partial<DynamicProtocolItem>): Promise<DynamicProtocolItem> {
  const res = await fetch('/api/admin/protocols', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${password}`
    },
    body: JSON.stringify(protocol)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save quality protocol');
  return data.protocol;
}

export async function deleteAdminProtocol(password: string, id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/admin/protocols/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${password}` }
  });
  if (!res.ok) throw new Error('Failed to delete quality protocol');
  return res.json();
}
