export interface Lead {
  id: string;
  submittedAt: string;
  fullName: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  productInterest: string;
  quantity: number;
  quantityUnit: 'Tons' | 'Containers' | 'Pallets' | string;
  preferredPackaging: string;
  destinationPort: string;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  variety?: string;
  grade?: string;
  size?: string;
  incoterm?: string;
  preferredShipmentDate?: string;
  shippingNotes?: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  category?: string;
  heroImage?: string;
  shortDescription?: string;
  shortDescriptionEn?: string;
  description?: string;
  descriptionEn?: string;
  origin?: string;
  varieties: string[];
  grades: string[];
  sizes?: string[];
  packagingOptions: string[];
  exportWindow?: string;
  moq?: string;
  season?: {
    startMonth: string;
    endMonth: string;
    peakMonths: string[];
  };
  storageConditions?: string;
  MOQ?: string;
  loadingMethod?: string;
  specificationSheet?: {
    pdfName?: string;
    pdfUrl?: string;
    lastUpdated?: string;
    details: { label: string; value: string }[];
  };
  images?: string[];
  hsCode?: string;
  exportCertificationsAvailable?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  category: string;
  status: 'Verified' | 'Pending Official Upload';
  issuedBy?: string;
  fileUrl?: string;
  description: string;
  updatedAt: string;
}

export interface MarketLandingPage {
  slug: string;
  regionName: string;
  heroHeadline: string;
  regionalSubtext: string;
  popularProducts: string[];
  keyPorts: string[];
  transitTimeEstimate: string;
  complianceStandards: string[];
}

export interface PlaceholderItem {
  id: string;
  location: string;
  placeholderLabel: string;
  requiredDataDescription: string;
  updatedAt: string;
}

export interface AnalyticsSummary {
  pageViews: number;
  rfqStarts: number;
  rfqSubmissions: number;
  specDownloads: number;
  whatsAppClicks: number;
  topProductsViewed: Record<string, number>;
  topMarketsViewed: Record<string, number>;
}

export interface BuyerRating {
  id: string;
  rating: number;
  buyerCompany?: string;
  buyerCountry?: string;
  comment?: string;
  createdAt: string;
}

export interface CompanySettings {
  phone: string;
  email: string;
  whatsappNumber: string;
  whatsappLink: string;
  hotline: string;
  websiteUrl: string;
  locationText: {
    ar: string;
    en: string;
    fr?: string;
    es?: string;
    de?: string;
    ru?: string;
  };
  liveLocationUrl: string;
  mapEmbedUrl?: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube?: string;
  };
}

export interface ExhibitionItem {
  id: string;
  title: string;
  titleEn?: string;
  date: string;
  dates?: string;
  city?: string;
  country?: string;
  location?: string;
  locationEn?: string;
  badge?: string;
  badgeEn?: string;
  standNumber?: string;
  excerpt?: string;
  excerptEn?: string;
  description?: string;
  descriptionEn?: string;
  image: string;
  imageUrl?: string;
  category: string;
  categoryEn?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
  externalUrl?: string;
  updatedAt?: string;
}

export interface MetricFigureItem {
  id: string;
  value: string;
  valueEn?: string;
  label: string;
  labelEn?: string;
  sub: string;
  subEn?: string;
  iconName?: 'TrendingUp' | 'Globe2' | 'ShieldCheck' | 'ThermometerSnowflake' | 'Award' | 'PackageCheck';
}

export interface StrategicPillarItem {
  id: string;
  number: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  points: string[];
  pointsEn?: string[];
}

export interface ProtocolParameter {
  label: string;
  labelEn?: string;
  value: string;
  note?: string;
}

export interface ProtocolPhase {
  phase: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  desc?: string;
  descEn?: string;
}

export interface DynamicProtocolItem {
  id: string;
  cropKey: string;
  cropName: string;
  cropNameEn: string;
  badge: string;
  badgeEn?: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  image: string;
  standards: string[];
  parameters: ProtocolParameter[];
  phases: ProtocolPhase[];
  verifications: string[];
  criticalLimit: string;
  criticalLimitEn?: string;
}

export interface CSRSettings {
  badge: string;
  badgeEn?: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  axis1Title: string;
  axis1TitleEn?: string;
  axis1Desc: string;
  axis1DescEn?: string;
  axis2Title: string;
  axis2TitleEn?: string;
  axis2Desc: string;
  axis2DescEn?: string;
}

export interface AnnouncementBanner {
  enabled: boolean;
  text: string;
  textEn?: string;
  badge?: string;
  badgeEn?: string;
  linkText?: string;
  linkTextEn?: string;
  linkUrl?: string;
  type?: 'info' | 'urgent' | 'seasonal';
}

export interface SiteContent {
  announcement: AnnouncementBanner;
  exhibitions: ExhibitionItem[];
  figures: MetricFigureItem[];
  pillars: StrategicPillarItem[];
  protocols: DynamicProtocolItem[];
  csr: CSRSettings;
  updatedAt?: string;
}

export type { ExportProject } from './data/portfolioData';
