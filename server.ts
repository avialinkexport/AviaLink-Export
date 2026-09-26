import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import compression from 'compression';
import { GoogleGenAI, Type } from '@google/genai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import multer from 'multer';
import sharp from 'sharp';

if (typeof (globalThis as any).WebSocket === 'undefined') {
  (globalThis as any).WebSocket = WebSocket;
}
import { initialProducts } from './src/data/products.js';
import { initialPlaceholdersLog } from './src/data/placeholdersLog.js';
import { initialExportProjects, ExportProject } from './src/data/portfolioData.js';
import { defaultSiteContent } from './src/data/defaultSiteContent.js';
import { Lead, Product, CertificationItem, BuyerRating, PlaceholderItem, CompanySettings, SiteContent, ExhibitionItem, DynamicProtocolItem } from './src/types.js';

// ==================== SUPABASE CLIENT INITIALIZATION ====================
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  });
  console.log('✅ Supabase client initialized with Service Role key.');
} else {
  console.warn('⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in environment. Falling back to local in-memory storage.');
  if (process.env.NODE_ENV === 'production') {
    console.error('\n************************************************************');
    console.error('🚨 CRITICAL WARNING (PRODUCTION):');
    console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined!');
    console.error('Data will NOT be persisted across app restarts on Railway.');
    console.error('Please configure your database credentials immediately!');
    console.error('************************************************************\n');
  }
}

// Default Fallback Company Settings
const defaultCompanySettings: CompanySettings = {
  phone: process.env.COMPANY_PHONE || '(03) 11345627',
  email: process.env.COMPANY_EMAIL || 'info@avialink-eg.com',
  whatsappNumber: process.env.COMPANY_WHATSAPP || '+20 100 000 0000',
  whatsappLink: process.env.COMPANY_WHATSAPP_LINK || 'https://wa.me/201000000000',
  hotline: process.env.COMPANY_HOTLINE || '+201093393355',
  websiteUrl: process.env.COMPANY_WEBSITE_URL || 'avialink.com',
  locationText: {
    ar: 'المنطقة اللوجستية الزراعية، طريق مصر إسكندرية الصحراوي، مصر',
    en: 'Agricultural Logistics Hub, Cairo-Alexandria Desert Road, Egypt',
    fr: 'Pôle logistique agricole, Route Le Caire-Alexandrie, Égypte',
    es: 'Centro logístico agrícola, Carretera El Cairo-Alejandría, Egipto',
    de: 'Agrarlogistikzentrum, Wüstenstraße Kairo-Alexandria, Ägypten',
    ru: 'Агрологистический узел, трасса Каир-Александрия, Египет'
  },
  liveLocationUrl: 'https://maps.google.com/?q=Cairo-Alexandria+Desert+Road,Egypt',
  mapEmbedUrl: '',
  socialLinks: {
    facebook: 'https://facebook.com/avialink',
    twitter: 'https://x.com/avialink',
    linkedin: 'https://linkedin.com/company/avialink',
    instagram: 'https://instagram.com/avialink',
    youtube: 'https://youtube.com/@avialink'
  }
};

// Default Certifications
const defaultCertificationsList: CertificationItem[] = [
  {
    id: 'cert-001',
    name: 'GlobalGAP (Good Agricultural Practice)',
    category: 'Farm Production & Food Safety',
    status: 'Pending Official Upload',
    description: 'Audit framework for farm assurance, pest management, and worker health. Scanned PDF document to be uploaded via Admin Panel.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cert-002',
    name: 'Phytosanitary Export Certificate (Ministry of Agriculture)',
    category: 'Customs & Quarantine Clearance',
    status: 'Pending Official Upload',
    description: 'CAPQ official inspection framework issued per export shipment. Document upload pending verification per live export batch.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cert-003',
    name: 'ISO 22000 Food Safety Management System',
    category: 'Packing Facility Standard',
    status: 'Pending Official Upload',
    description: 'HACCP-based food safety management standard for packing houses and cold storage facilities.',
    updatedAt: new Date().toISOString()
  }
];

// In-Memory Fallback Stores
let leadsStore: Lead[] = [];
let productsStore: Product[] = [...initialProducts];
let certificationsStore: CertificationItem[] = [...defaultCertificationsList];
let placeholdersStore: PlaceholderItem[] = [...initialPlaceholdersLog];
let portfolioStore: ExportProject[] = [...initialExportProjects];
let buyerRatingsStore: BuyerRating[] = [];
let companySettingsStore: CompanySettings = { ...defaultCompanySettings };

// Dynamic Site Content Store (CMS)
const SITE_CONTENT_FILE = path.join(process.cwd(), 'src', 'data', 'siteContent.json');
let siteContentStore: SiteContent = { ...defaultSiteContent };

try {
  if (fs.existsSync(SITE_CONTENT_FILE)) {
    const raw = fs.readFileSync(SITE_CONTENT_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    siteContentStore = {
      ...defaultSiteContent,
      ...parsed,
      announcement: { ...defaultSiteContent.announcement, ...(parsed.announcement || {}) },
      csr: { ...defaultSiteContent.csr, ...(parsed.csr || {}) }
    };
    console.log('✅ Loaded dynamic CMS site content from siteContent.json');
  }
} catch (e) {
  console.warn('⚠️ Could not load siteContent.json, falling back to default CMS content.');
}

async function persistSiteContent() {
  try {
    fs.writeFileSync(SITE_CONTENT_FILE, JSON.stringify(siteContentStore, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write siteContent.json:', e);
  }
  if (supabase) {
    try {
      const { error } = await supabase.from('site_content').upsert([mapSiteContentToRow(siteContentStore)]);
      if (error) {
        console.error('Failed to save site_content in Supabase:', error);
      } else {
        console.log('✅ Site content persisted successfully to Supabase');
      }
    } catch (e) {
      console.error('Error persisting site_content to Supabase:', e);
    }
  }
}

// ==================== DATABASE MAPPERS ====================

function mapLeadFromRow(row: any): Lead {
  if (row.data && typeof row.data === 'object') {
    return { ...row.data, id: row.id, submittedAt: row.submitted_at || row.data.submittedAt, status: row.status || row.data.status };
  }
  return {
    id: row.id,
    submittedAt: row.submitted_at || row.submittedAt,
    fullName: row.full_name || row.fullName,
    company: row.company,
    country: row.country,
    email: row.email,
    phone: row.phone,
    productInterest: row.product_interest || row.productInterest,
    quantity: Number(row.quantity) || 0,
    quantityUnit: row.quantity_unit || row.quantityUnit || 'Tons',
    preferredPackaging: row.preferred_packaging || row.preferredPackaging || '',
    destinationPort: row.destination_port || row.destinationPort || '',
    message: row.message || '',
    source: row.source || 'Direct RFQ Form',
    status: row.status || 'new',
    variety: row.variety,
    grade: row.grade,
    size: row.size,
    incoterm: row.incoterm,
    preferredShipmentDate: row.preferred_shipment_date || row.preferredShipmentDate,
    shippingNotes: row.shipping_notes || row.shippingNotes
  };
}

function mapLeadToRow(lead: Lead): any {
  return {
    id: lead.id,
    submitted_at: lead.submittedAt,
    full_name: lead.fullName,
    company: lead.company,
    country: lead.country,
    email: lead.email,
    phone: lead.phone,
    product_interest: lead.productInterest,
    quantity: lead.quantity,
    quantity_unit: lead.quantityUnit,
    preferred_packaging: lead.preferredPackaging,
    destination_port: lead.destinationPort,
    message: lead.message,
    source: lead.source,
    status: lead.status,
    variety: lead.variety || null,
    grade: lead.grade || null,
    size: lead.size || null,
    incoterm: lead.incoterm || null,
    preferred_shipment_date: lead.preferredShipmentDate || null,
    shipping_notes: lead.shippingNotes || null,
    data: lead
  };
}

function parseSeason(rawSeason: any, slug?: string): { startMonth: string; endMonth: string; peakMonths: string[] } {
  const fallback = initialProducts.find(p => p.slug === slug || p.id === slug)?.season || {
    startMonth: 'January',
    endMonth: 'December',
    peakMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };

  if (!rawSeason) return fallback;
  if (typeof rawSeason === 'object') {
    return {
      startMonth: rawSeason.startMonth || rawSeason.start_month || fallback.startMonth,
      endMonth: rawSeason.endMonth || rawSeason.end_month || fallback.endMonth,
      peakMonths: Array.isArray(rawSeason.peakMonths)
        ? rawSeason.peakMonths
        : Array.isArray(rawSeason.peak_months)
        ? rawSeason.peak_months
        : fallback.peakMonths
    };
  }
  if (typeof rawSeason === 'string') {
    const parts = rawSeason.split(/[-–—/]/).map((s: string) => s.trim());
    return {
      startMonth: parts[0] || fallback.startMonth,
      endMonth: parts[1] || parts[0] || fallback.endMonth,
      peakMonths: fallback.peakMonths
    };
  }
  return fallback;
}

function mapProductFromRow(row: any): Product {
  const slug = row.slug || row.data?.slug;
  const fallback = initialProducts.find(p => p.slug === slug || p.id === row.id);

  if (row.data && typeof row.data === 'object') {
    const data = row.data;
    return {
      ...fallback,
      ...data,
      id: row.id || data.id,
      slug: row.slug || data.slug,
      name: row.name || data.name,
      season: parseSeason(data.season || row.season, slug)
    };
  }
  return {
    ...fallback,
    id: row.id,
    name: row.name,
    nameEn: row.name_en || row.nameEn || fallback?.nameEn,
    slug: row.slug,
    category: row.category || fallback?.category,
    heroImage: row.hero_image || fallback?.heroImage,
    shortDescription: row.short_description || fallback?.shortDescription,
    origin: row.origin || fallback?.origin,
    varieties: (row.varieties && Array.isArray(row.varieties) && row.varieties.length > 0) ? row.varieties : (fallback?.varieties || []),
    grades: (row.grades && Array.isArray(row.grades) && row.grades.length > 0) ? row.grades : (fallback?.grades || []),
    sizes: (row.sizes && Array.isArray(row.sizes) && row.sizes.length > 0) ? row.sizes : (fallback?.sizes || []),
    packagingOptions: (row.packaging_options && Array.isArray(row.packaging_options) && row.packaging_options.length > 0) ? row.packaging_options : (fallback?.packagingOptions || []),
    exportWindow: row.export_window || fallback?.exportWindow,
    moq: row.moq || fallback?.moq,
    season: parseSeason(row.season, slug),
    storageConditions: row.storage_conditions || fallback?.storageConditions,
    loadingMethod: row.loading_method || fallback?.loadingMethod,
    specificationSheet: row.specification_sheet || fallback?.specificationSheet,
    images: (row.images && Array.isArray(row.images) && row.images.length > 0) ? row.images : (fallback?.images || []),
    hsCode: row.hs_code || fallback?.hsCode,
    exportCertificationsAvailable: (row.export_certifications_available && Array.isArray(row.export_certifications_available)) ? row.export_certifications_available : (fallback?.exportCertificationsAvailable || [])
  };
}

function mapProductToRow(product: Product): any {
  return {
    id: product.id,
    name: product.name,
    name_en: product.nameEn || null,
    slug: product.slug,
    category: product.category || null,
    hero_image: product.heroImage || null,
    short_description: product.shortDescription || null,
    origin: product.origin || null,
    varieties: product.varieties || [],
    grades: product.grades || [],
    sizes: product.sizes || [],
    packaging_options: product.packagingOptions || [],
    export_window: product.exportWindow || null,
    moq: product.moq || product.MOQ || null,
    season: product.season || null,
    storage_conditions: product.storageConditions || null,
    loading_method: product.loadingMethod || null,
    specification_sheet: product.specificationSheet || null,
    images: product.images || [],
    hs_code: product.hsCode || null,
    export_certifications_available: product.exportCertificationsAvailable || [],
    data: product
  };
}

function mapCertificationFromRow(row: any): CertificationItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    status: row.status || 'Verified',
    issuedBy: row.issued_by || row.issuedBy || '',
    fileUrl: row.file_url || row.fileUrl || '',
    description: row.description || '',
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString()
  };
}

function mapCertificationToRow(cert: CertificationItem): any {
  return {
    id: cert.id,
    name: cert.name,
    category: cert.category,
    status: cert.status,
    issued_by: cert.issuedBy || null,
    file_url: cert.fileUrl || null,
    description: cert.description || '',
    updated_at: cert.updatedAt || new Date().toISOString()
  };
}

function mapPortfolioFromRow(row: any): ExportProject {
  if (row.data && typeof row.data === 'object') {
    return {
      ...row.data,
      id: row.id,
      title: row.title,
      images: Array.isArray(row.data.images) ? row.data.images : (row.data.image ? [row.data.image] : [])
    };
  }
  const images = Array.isArray(row.images) ? row.images : (row.image ? [row.image] : []);
  return {
    id: row.id,
    productSlug: row.product_slug || row.productSlug,
    title: row.title,
    category: row.category,
    categoryLabel: row.category_label || row.categoryLabel || {},
    destination: row.destination,
    port: row.port,
    volumeTonnes: Number(row.volume_tonnes || row.volumeTonnes) || 0,
    containerCount: Number(row.container_count || row.containerCount) || 0,
    cropName: row.crop_name || row.cropName,
    image: row.image,
    images: images,
    completionDate: row.completion_date || row.completionDate,
    specsHighlight: row.specs_highlight || row.specsHighlight,
    phytosanitaryStatus: row.phytosanitary_status || row.phytosanitaryStatus,
    buyerFeedback: row.buyer_feedback || row.buyerFeedback || {}
  };
}

function mapPortfolioToRow(p: ExportProject): any {
  return {
    id: p.id,
    product_slug: p.productSlug || null,
    title: p.title,
    category: p.category,
    category_label: p.categoryLabel,
    destination: p.destination,
    port: p.port,
    volume_tonnes: p.volumeTonnes,
    container_count: p.containerCount,
    crop_name: p.cropName,
    image: p.image,
    images: p.images || [p.image].filter(Boolean),
    completion_date: p.completionDate,
    specs_highlight: p.specsHighlight,
    phytosanitary_status: p.phytosanitaryStatus,
    buyer_feedback: p.buyerFeedback,
    data: {
      ...p,
      images: p.images || [p.image].filter(Boolean)
    }
  };
}

function mapRatingFromRow(row: any): BuyerRating {
  return {
    id: row.id,
    rating: Number(row.rating),
    buyerCompany: row.buyer_company || row.buyerCompany,
    buyerCountry: row.buyer_country || row.buyerCountry,
    comment: row.comment || '',
    createdAt: row.created_at || row.createdAt
  };
}

function mapRatingToRow(r: BuyerRating): any {
  return {
    id: r.id,
    rating: r.rating,
    buyer_company: r.buyerCompany || null,
    buyer_country: r.buyerCountry || null,
    comment: r.comment || '',
    created_at: r.createdAt
  };
}

function mapPlaceholderFromRow(row: any): PlaceholderItem {
  return {
    id: row.id,
    location: row.location,
    placeholderLabel: row.placeholder_label || row.placeholderLabel,
    requiredDataDescription: row.required_data_description || row.requiredDataDescription,
    updatedAt: row.updated_at || row.updatedAt
  };
}

function mapPlaceholderToRow(ph: PlaceholderItem): any {
  return {
    id: ph.id,
    location: ph.location,
    placeholder_label: ph.placeholderLabel,
    required_data_description: ph.requiredDataDescription,
    updated_at: ph.updatedAt
  };
}

function mapSettingsFromRow(row: any): CompanySettings {
  return {
    phone: row.phone,
    email: row.email,
    whatsappNumber: row.whatsapp_number || row.whatsappNumber,
    whatsappLink: row.whatsapp_link || row.whatsappLink,
    hotline: row.social_links?.hotline || row.socialLinks?.hotline || row.hotline || '+201093393355',
    websiteUrl: row.social_links?.websiteUrl || row.socialLinks?.websiteUrl || row.website_url || row.websiteUrl || 'avialink.com',
    locationText: row.location_text || row.locationText,
    liveLocationUrl: row.live_location_url || row.liveLocationUrl,
    mapEmbedUrl: row.map_embed_url || row.mapEmbedUrl || '',
    socialLinks: row.social_links || row.socialLinks || {}
  };
}

function mapSettingsToRow(s: CompanySettings): any {
  const socialWithBackup = {
    ...(s.socialLinks || {}),
    hotline: s.hotline,
    websiteUrl: s.websiteUrl
  };
  return {
    id: 1,
    phone: s.phone,
    email: s.email,
    whatsapp_number: s.whatsappNumber,
    whatsapp_link: s.whatsappLink,
    location_text: s.locationText,
    live_location_url: s.liveLocationUrl,
    map_embed_url: s.mapEmbedUrl || '',
    social_links: socialWithBackup
  };
}

function mapSiteContentToRow(content: SiteContent): any {
  return {
    id: 1,
    data: content,
    updated_at: new Date().toISOString()
  };
}

function mapSiteContentFromRow(row: any): SiteContent {
  if (row && row.data && typeof row.data === 'object') {
    return {
      ...defaultSiteContent,
      ...row.data,
      announcement: { ...defaultSiteContent.announcement, ...(row.data.announcement || {}) },
      csr: { ...defaultSiteContent.csr, ...(row.data.csr || {}) }
    };
  }
  return { ...defaultSiteContent };
}

async function migrateBase64ImagesToSupabase() {
  if (!supabase) return;
  console.log('🔍 Checking for base64 images to migrate to Supabase Storage...');
  try {
    const bucketName = 'product-images';

    const uploadBase64 = async (base64Str: string, prefix: string): Promise<string | null> => {
      try {
        const matches = base64Str.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
        if (!matches || matches.length !== 3) return null;
        
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        const compressedBuffer = await sharp(buffer)
          .webp({ quality: 80 })
          .toBuffer();

        const fileName = `migrated-${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.webp`;

        const { data, error } = await supabase!.storage
          .from(bucketName)
          .upload(fileName, compressedBuffer, {
            contentType: 'image/webp',
            upsert: true
          });

        if (error) {
          console.error(`Migration upload failed for ${prefix}:`, error);
          return null;
        }

        const { data: { publicUrl } } = supabase!.storage
          .from(bucketName)
          .getPublicUrl(fileName);

        return publicUrl;
      } catch (err) {
        console.error('Error during base64 migration upload:', err);
        return null;
      }
    };

    const { data: products, error: prodErr } = await supabase.from('products').select('*');
    if (!prodErr && products) {
      for (const prod of products) {
        let updated = false;
        let heroImage = prod.hero_image || prod.heroImage;
        let images = prod.images || [];

        if (heroImage && heroImage.startsWith('data:image')) {
          console.log(`Migrating hero image for product: ${prod.slug}`);
          const publicUrl = await uploadBase64(heroImage, `prod-hero-${prod.slug}`);
          if (publicUrl) {
            heroImage = publicUrl;
            updated = true;
          }
        }

        if (Array.isArray(images)) {
          const newImages = [];
          for (let i = 0; i < images.length; i++) {
            const img = images[i];
            if (img && img.startsWith('data:image')) {
              console.log(`Migrating image ${i} for product: ${prod.slug}`);
              const publicUrl = await uploadBase64(img, `prod-img-${prod.slug}-${i}`);
              if (publicUrl) {
                newImages.push(publicUrl);
                updated = true;
              } else {
                newImages.push(img);
              }
            } else {
              newImages.push(img);
            }
          }
          if (updated) {
            images = newImages;
          }
        }

        if (updated) {
          const { error: updateErr } = await supabase
            .from('products')
            .update({ hero_image: heroImage, images })
            .eq('id', prod.id);
          if (updateErr) {
            console.error(`Failed to update migrated images for product ${prod.slug}:`, updateErr);
          } else {
            console.log(`✅ Migrated images for product: ${prod.slug}`);
          }
        }
      }
    }

    const { data: projects, error: projErr } = await supabase.from('portfolio_projects').select('*');
    if (!projErr && projects) {
      for (const proj of projects) {
        let image = proj.image;
        if (image && image.startsWith('data:image')) {
          console.log(`Migrating image for portfolio project: ${proj.id}`);
          const publicUrl = await uploadBase64(image, `portfolio-${proj.id}`);
          if (publicUrl) {
            const { error: updateErr } = await supabase
              .from('portfolio_projects')
              .update({ image: publicUrl })
              .eq('id', proj.id);
            if (updateErr) {
              console.error(`Failed to update migrated image for portfolio project ${proj.id}:`, updateErr);
            } else {
              console.log(`✅ Migrated image for portfolio project: ${proj.id}`);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

// ==================== DATABASE SEEDING ====================

async function seedInitialDataIfNeeded() {
  if (!supabase) return;

  try {
    // 1. Check products table
    const { data: prods, error: prodErr } = await supabase.from('products').select('id').limit(1);
    if (!prodErr && (!prods || prods.length === 0)) {
      console.log('🌱 Seeding initial products catalog into Supabase...');
      const prodRows = initialProducts.map(mapProductToRow);
      await supabase.from('products').insert(prodRows);
    }

    // 2. Check certifications table
    const { data: certs, error: certErr } = await supabase.from('certifications').select('id').limit(1);
    if (!certErr && (!certs || certs.length === 0)) {
      console.log('🌱 Seeding initial certifications into Supabase...');
      const certRows = defaultCertificationsList.map(mapCertificationToRow);
      await supabase.from('certifications').insert(certRows);
    }

    // 3. Check portfolio_projects table
    const { data: port, error: portErr } = await supabase.from('portfolio_projects').select('id').limit(1);
    if (!portErr && (!port || port.length === 0)) {
      console.log('🌱 Seeding initial export portfolio projects into Supabase...');
      const portRows = initialExportProjects.map(mapPortfolioToRow);
      await supabase.from('portfolio_projects').insert(portRows);
    }

    // 4. Check placeholders_log table
    const { data: phs, error: phErr } = await supabase.from('placeholders_log').select('id').limit(1);
    if (!phErr && (!phs || phs.length === 0)) {
      console.log('🌱 Seeding initial placeholders log into Supabase...');
      const phRows = initialPlaceholdersLog.map(mapPlaceholderToRow);
      await supabase.from('placeholders_log').insert(phRows);
    }

    // 5. Check company_settings table
    const { data: settings, error: setErr } = await supabase.from('company_settings').select('id').limit(1);
    if (!setErr && (!settings || settings.length === 0)) {
      console.log('🌱 Seeding initial company settings into Supabase...');
      await supabase.from('company_settings').insert([mapSettingsToRow(defaultCompanySettings)]);
    }

    // 6. Check site_content table
    const { data: siteContentRows, error: siteContentErr } = await supabase.from('site_content').select('id').limit(1);
    if (!siteContentErr && (!siteContentRows || siteContentRows.length === 0)) {
      console.log('🌱 Seeding initial site_content into Supabase...');
      await supabase.from('site_content').upsert([mapSiteContentToRow(siteContentStore)]);
    } else if (!siteContentErr && siteContentRows && siteContentRows.length > 0) {
      console.log('🌱 Loading site_content from Supabase...');
      const { data: contentData, error: loadErr } = await supabase.from('site_content').select('*').eq('id', 1).maybeSingle();
      if (!loadErr && contentData) {
        siteContentStore = mapSiteContentFromRow(contentData);
        console.log('✅ Loaded dynamic CMS site content from Supabase');
      }
    }

    // Run base64 image migration asynchronously in the background
    migrateBase64ImagesToSupabase().catch(err => console.error('Error during image migration:', err));
  } catch (err) {
    console.error('Error during Supabase initial database seeding:', err);
  }
}

async function startServer() {
  const app = express();
  // AI Studio runs behind an Nginx reverse proxy that ONLY routes to port 3000.
  // In AI Studio, we MUST listen on port 3000.
  // On hosting platforms like Railway, we must listen on the dynamically assigned process.env.PORT.
  // We distinguish Railway by checking for its native environment variables.
  const isRailway = !!(process.env.RAILWAY_STATIC_URL || process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_GIT_COMMIT_SHA);
  const PORT = isRailway && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Trust the first hop reverse proxy (Nginx, load balancer, CDN, etc.) so that
  // req.ip reflects the real visitor IP instead of the proxy's IP. Without this,
  // every visitor behind the same proxy would share a single rate-limit bucket,
  // making the per-IP anti-spam limits below meaningless in production.
  app.set('trust proxy', 1);

  // Initialize DB seeding asynchronously
  seedInitialDataIfNeeded().catch(err => console.error('DB seed error:', err));

  // 1. High-Performance Gzip/Deflate Compression for ultra-fast load times
  app.use((compression as any)({
    level: 6,
    threshold: 1024,
    filter: (req: any, res: any) => {
      if (req.headers && req.headers['x-no-compression']) {
        return false;
      }
      return (compression as any).filter(req, res);
    }
  }));

  // 2. Fast Speed & Security HTTP Headers
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Multer in-memory storage for handling files under multi-part uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file limit
  });

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ limit: '2mb', extended: true }));

  // Expose the local uploads folder statically for both /public/uploads and /uploads
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/public/uploads', express.static(uploadsDir));
  app.use('/uploads', express.static(uploadsDir));

  // Production Health Check for Railway / Cloud Run Load Balancers
  app.get('/api/health', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).json({
      status: 'ok',
      service: 'AVIALINK Export Platform',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // RESTORE AND SECURE IMAGE UPLOAD ROUTE WITH REAL PROCESSING
  app.post('/api/upload', authenticateAdmin, upload.single('image'), async (req: Request, res: Response) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(`upload:${clientIp}`, 20, 60000)) {
      res.status(429).json({ error: 'Too many upload requests. Please wait a moment.' });
      return;
    }

    try {
      if (!req.file) {
        res.status(400).json({ error: 'No image file uploaded' });
        return;
      }

      // Convert and compress to highly optimized webp format
      const compressedBuffer = await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toBuffer();

      const baseName = req.file.originalname ? path.parse(req.file.originalname).name : 'upload';
      const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const fileName = `${cleanBaseName}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.webp`;

      if (supabase) {
        // Attempt to upload to Supabase Storage Bucket
        const bucketName = 'product-images';
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, compressedBuffer, {
            contentType: 'image/webp',
            upsert: true
          });

        if (!error) {
          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);
          
          console.log(`✅ File uploaded successfully to Supabase: ${publicUrl}`);
          res.json({ url: publicUrl });
          return;
        }

        console.error('Supabase Storage upload error, falling back to local storage:', error);
      }

      // Fallback local storage saving
      const localFilePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(localFilePath, compressedBuffer);
      const localUrl = `/uploads/${fileName}`;
      console.log(`✅ File uploaded successfully to Local Storage fallback: ${localUrl}`);
      res.json({ url: localUrl });
    } catch (err: any) {
      console.error('Error in /api/upload handler:', err);
      res.status(500).json({ error: err.message || 'Image upload processing failed' });
    }
  });

  // Active server-side CAPTCHA challenges: challengeId -> { answer, expires }
  const captchaChallenges = new Map<string, { answer: number; expires: number }>();
  setInterval(() => {
    const now = Date.now();
    for (const [id, val] of captchaChallenges.entries()) {
      if (val.expires < now) {
        captchaChallenges.delete(id);
      }
    }
  }, 60000);

  // Helper to normalize Eastern Arabic and Persian digits to standard ASCII
  function normalizeArabicIndicDigits(val: any): string {
    if (val === undefined || val === null) return '';
    const s = String(val);
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return s
      .split('')
      .map((c) => {
        const aIdx = arabicDigits.indexOf(c);
        if (aIdx !== -1) return String(aIdx);
        const pIdx = persianDigits.indexOf(c);
        if (pIdx !== -1) return String(pIdx);
        return c;
      })
      .join('');
  }

  // Analytics tracking store
  let analyticsStore = {
    pageViews: 0,
    rfqStarts: 0,
    rfqSubmissions: 0,
    specDownloads: 0,
    whatsAppClicks: 0,
    topProductsViewed: {} as Record<string, number>,
    topMarketsViewed: {} as Record<string, number>
  };

  // Simple Rate Limiting Map (IP -> timestamps)
  // DESIGN LIMITATION DOCUMENTATION:
  // ⚠️ WARNING: This rate limiter uses a simple in-memory Map and is designed for a single-instance (Single Instance) deployment only.
  // In clustered or multi-instance environments (e.g., horizontally scaled containers), rate limits will not be shared across instances.
  // If scaling horizontally, replace this with a centralized store like Redis or use Supabase/database state.
  const rateLimitMap = new Map<string, number[]>();

  // Periodic cleanup interval to prevent memory leaks by completely pruning expired entries
  setInterval(() => {
    const now = Date.now();
    const maxWindowMs = 60000; // default rate-limit window
    for (const [ip, timestamps] of rateLimitMap.entries()) {
      const validTimestamps = timestamps.filter(ts => now - ts < maxWindowMs);
      if (validTimestamps.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, validTimestamps);
      }
    }
  }, 120000); // Run cleanup every 2 minutes

  function checkRateLimit(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const validTimestamps = timestamps.filter(ts => now - ts < windowMs);
    if (validTimestamps.length >= limit) {
      return false;
    }
    validTimestamps.push(now);
    rateLimitMap.set(ip, validTimestamps);
    return true;
  }

  // ==================== ADMIN AUTHENTICATION ====================
  // SECURITY: There is intentionally NO hardcoded fallback password. Shipping a
  // known default (e.g. "avialink2025") in source code means anyone who reads the
  // repository — or simply guesses it — gets full admin access on any deployment
  // where ADMIN_PASSWORD was not explicitly set. Instead:
  //   - If ADMIN_PASSWORD is set in the environment, it is used as-is.
  //   - If it is missing, a random one-time password is generated at boot and
  //     printed ONCE to the server console, so local/dev use still works without
  //     ever exposing a predictable credential.
  let resolvedAdminPassword = process.env.ADMIN_PASSWORD;
  if (!resolvedAdminPassword) {
    resolvedAdminPassword = crypto.randomBytes(9).toString('base64url');
    console.warn('⚠️  ADMIN_PASSWORD is not set in the environment.');
    console.warn(`⚠️  A temporary random admin password has been generated for this run only:`);
    console.warn(`⚠️      ${resolvedAdminPassword}`);
    console.warn('⚠️  Set a real ADMIN_PASSWORD in your .env before deploying to production.');
  }

  // Constant-time string comparison to avoid leaking password length/content
  // through response-timing side channels.
  function timingSafeStringEqual(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      // Still run a comparison of equal-length buffers so the function takes a
      // comparable amount of time whether or not the lengths match.
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  }

  // Admin auth middleware — accepts the password ONLY via the Authorization
  // header. Passing the real admin password as a URL query parameter is
  // deliberately not supported anywhere: query strings get written to server
  // access logs, browser history, and Referer headers. See the dedicated
  // one-time export-token flow used by the CSV export route further below.
  function authenticateAdmin(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    const providedToken = (authHeader && authHeader.startsWith('Bearer '))
      ? authHeader.substring(7)
      : undefined;

    if (providedToken && timingSafeStringEqual(providedToken, resolvedAdminPassword!)) {
      next();
      return;
    }
    res.status(401).json({ error: 'Unauthorized. Invalid admin credentials.' });
  }

  // ==================== SHORT-LIVED CSV EXPORT TOKENS ====================
  // The "download CSV" button in the admin panel opens the export URL in a new
  // browser tab/window, which cannot attach a custom Authorization header. To
  // avoid ever putting the real admin password in a URL, the admin panel first
  // calls POST /api/admin/export-token (authenticated normally, via header) to
  // mint a random, single-use token that is valid for 2 minutes and only good
  // for the CSV export route.
  const exportTokens = new Map<string, number>(); // token -> expiry timestamp
  function issueExportToken(): string {
    const token = crypto.randomBytes(24).toString('base64url');
    exportTokens.set(token, Date.now() + 2 * 60 * 1000);
    return token;
  }
  function consumeExportToken(token: string | undefined): boolean {
    if (!token) return false;
    const expiry = exportTokens.get(token);
    exportTokens.delete(token); // one-time use regardless of outcome
    return typeof expiry === 'number' && expiry >= Date.now();
  }
  setInterval(() => {
    const now = Date.now();
    for (const [tok, expiry] of exportTokens.entries()) {
      if (expiry < now) exportTokens.delete(tok);
    }
  }, 60000);

  // Helper to fetch current company settings (from Supabase or local memory)
  async function fetchCompanySettings(): Promise<CompanySettings> {
    if (supabase) {
      const { data, error } = await supabase.from('company_settings').select('*').eq('id', 1).maybeSingle();
      if (!error && data) {
        return mapSettingsFromRow(data);
      }
    }
    return companySettingsStore;
  }

  // ==================== API ROUTES ====================

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'AVIALINK Backend Service', time: new Date().toISOString() });
  });

  // Server-generated CAPTCHA challenge endpoint
  app.get('/api/rfq/captcha', (_req: Request, res: Response) => {
    const num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const num2 = Math.floor(Math.random() * 7) + 1; // 1 to 7
    const expires = Date.now() + 60 * 60 * 1000; // 60 minutes
    const checksum = (num1 * 17 + num2 * 23) % 997;
    const challengeId = `cap_v1_${num1}_${num2}_${expires}_${checksum}`;

    captchaChallenges.set(challengeId, {
      answer: num1 + num2,
      expires
    });

    res.json({
      challengeId,
      num1,
      num2,
      prompt: `${num1} + ${num2} = ?`
    });
  });

  // 1. RFQ Submission Endpoint (with validation, anti-spam honeypot, rate-limiting)
  app.post('/api/rfq', async (req: Request, res: Response) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    
    // Rate limit check (Max 10 RFQs per minute per IP)
    if (!checkRateLimit(clientIp, 10, 60000)) {
      res.status(429).json({ error: 'Too many quote requests from this connection. Please wait 1 minute before submitting again.' });
      return;
    }

    const {
      fullName,
      company,
      country,
      email,
      phone,
      productInterest,
      quantity,
      quantityUnit,
      variety,
      grade,
      size,
      preferredPackaging,
      destinationPort,
      incoterm,
      preferredShipmentDate,
      shippingNotes,
      message,
      source,
      honeypot,
      captchaChallengeId,
      captchaAnswer
    } = req.body;

    // Honeypot anti-spam validation
    if (honeypot && typeof honeypot === 'string' && honeypot.trim().length > 0) {
      res.json({ success: true, message: 'Quote request received successfully.' });
      return;
    }

    // Server-side CAPTCHA verification.
    // SECURITY: The only accepted proof is a challengeId that this exact server
    // process issued via GET /api/rfq/captcha and still holds in memory, whose
    // stored numeric answer matches what the client submitted. Every previous
    // "fallback" path (a fixed answer of 10, a self-verifying checksum a bot
    // could compute offline without ever calling the issuance endpoint, and an
    // acceptance of ANY positive number when no challenge matched) has been
    // removed, because each of those made the CAPTCHA trivially bypassable.
    const cleanCaptchaAnswer = normalizeArabicIndicDigits(captchaAnswer).trim();
    const numAnswer = parseInt(cleanCaptchaAnswer, 10);

    let isCaptchaValid = false;

    if (captchaChallengeId && typeof captchaChallengeId === 'string' && captchaChallenges.has(captchaChallengeId)) {
      const challenge = captchaChallenges.get(captchaChallengeId)!;
      if (challenge.expires >= Date.now() && !isNaN(numAnswer)) {
        isCaptchaValid = numAnswer === challenge.answer;
      }
      // One-time use: remove the challenge whether or not it was answered correctly.
      captchaChallenges.delete(captchaChallengeId);
    }

    if (!isCaptchaValid) {
      res.status(400).json({
        error: 'إجابة التحقق الأمني غير صحيحة أو منتهية الصلاحية. يرجى حل العملية الحسابية مجدداً.',
        details: { captchaInput: 'Incorrect security answer' }
      });
      return;
    }

    // Server-Side Field Validation
    const errors: Record<string, string> = {};

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name (minimum 2 characters).';
    }
    if (!company || typeof company !== 'string' || company.trim().length < 2) {
      errors.company = 'Please enter your registered company name.';
    }
    if (!country || typeof country !== 'string' || country.trim().length < 2) {
      errors.country = 'Please select or enter your target destination country.';
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid business email address.';
    }

    const cleanPhone = normalizeArabicIndicDigits(phone).trim();
    if (!cleanPhone || cleanPhone.length < 5) {
      errors.phone = 'Please provide a valid contact phone or WhatsApp number with country code.';
    }
    if (!productInterest || typeof productInterest !== 'string') {
      errors.productInterest = 'Please select the primary product of interest.';
    }

    const cleanQtyStr = normalizeArabicIndicDigits(quantity).replace(/,/g, '').trim();
    const parsedQty = parseFloat(cleanQtyStr);
    if (!quantity || isNaN(parsedQty) || parsedQty <= 0) {
      errors.quantity = 'Please enter a valid positive numeric order volume.';
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ error: 'Validation failed. Please correct the highlighted errors.', details: errors });
      return;
    }

    // Construct Lead Object
    const newLead: Lead = {
      id: `AVL-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      submittedAt: new Date().toISOString(),
      fullName: fullName.trim(),
      company: company.trim(),
      country: country.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      productInterest,
      variety: variety ? String(variety).trim() : undefined,
      grade: grade ? String(grade).trim() : undefined,
      size: size ? String(size).trim() : undefined,
      quantity: parsedQty,
      quantityUnit: quantityUnit || 'Tons',
      preferredPackaging: preferredPackaging ? String(preferredPackaging).trim() : 'Standard Export Packaging',
      destinationPort: destinationPort ? String(destinationPort).trim() : 'To Be Confirmed',
      incoterm: incoterm ? String(incoterm).trim() : 'CIF',
      preferredShipmentDate: preferredShipmentDate ? String(preferredShipmentDate).trim() : undefined,
      shippingNotes: shippingNotes ? String(shippingNotes).trim() : undefined,
      message: message ? String(message).trim() : '',
      source: source || 'Direct RFQ Form',
      status: 'new'
    };

    try {
      if (supabase) {
        const { error: dbError } = await supabase.from('leads').insert([mapLeadToRow(newLead)]);
        if (dbError) {
          console.error('Supabase lead insert error:', dbError);
          res.status(500).json({ error: 'Failed to record quote request in database: ' + dbError.message });
          return;
        }
      } else {
        leadsStore.unshift(newLead);
      }
    } catch (err: any) {
      console.error('Error saving lead:', err);
      res.status(500).json({ error: err.message || 'Database error occurred while processing lead.' });
      return;
    }

    analyticsStore.rfqSubmissions += 1;

    // Fetch live company settings for WhatsApp link
    const currentSettings = await fetchCompanySettings();
    const rawCompanyPhone = currentSettings.whatsappNumber || currentSettings.phone || '201000000000';
    const cleanCompanyWa = normalizeArabicIndicDigits(rawCompanyPhone).replace(/\D/g, '') || '201000000000';

    const orderLines = [
      `🌾 *طلب عرض سعر تصديري جديد - أفيا لينك (AVIALINK)* 🌾`,
      `📄 *رقم الطلب:* ${newLead.id}`,
      `🕒 *التاريخ:* ${new Date(newLead.submittedAt).toLocaleString('ar-EG')}`,
      `--------------------------------------`,
      `👤 *بيانات المشتري والشركة:*`,
      `• *الاسم:* ${newLead.fullName}`,
      `• *الشركة:* ${newLead.company}`,
      `• *الدولة:* ${newLead.country}`,
      `• *البريد:* ${newLead.email}`,
      `• *الهاتف/واتساب:* ${newLead.phone}`,
      `--------------------------------------`,
      `📦 *تفاصيل الشحنة والمحصول:*`,
      `• *المحصول:* ${newLead.productInterest}`,
      newLead.variety ? `• *الصنف:* ${newLead.variety}` : '',
      newLead.grade ? `• *الرتبة:* ${newLead.grade}` : '',
      newLead.size ? `• *الحجم:* ${newLead.size}` : '',
      `• *الكمية:* ${newLead.quantity} ${newLead.quantityUnit}`,
      newLead.preferredPackaging ? `• *التعبئة:* ${newLead.preferredPackaging}` : '',
      `--------------------------------------`,
      `🚢 *اللوجستيات والشحن:*`,
      newLead.incoterm ? `• *شرط الشحن (Incoterm):* ${newLead.incoterm}` : '',
      newLead.destinationPort ? `• *ميناء الوصول:* ${newLead.destinationPort}` : '',
      newLead.preferredShipmentDate ? `• *موعد الشحن المفضل:* ${newLead.preferredShipmentDate}` : '',
      newLead.shippingNotes ? `• *ملاحظات الشحن:* ${newLead.shippingNotes}` : '',
      newLead.message ? `• *ملاحظات الجودة:* ${newLead.message}` : '',
      `--------------------------------------`,
      `🌐 تم الإرسال عبر البوابة الإلكترونية لشركة أفيا لينك للحاصلات الزراعية.`
    ].filter(Boolean).join('\n');

    const companyWhatsAppUrl = `https://wa.me/${cleanCompanyWa}?text=${encodeURIComponent(orderLines)}`;

    // Optional CRM Webhook
    if (process.env.CRM_WEBHOOK_URL) {
      fetch(process.env.CRM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      }).catch(err => console.error('CRM Webhook error:', err));
    }

    // Optional WhatsApp Webhook Gateway
    if (process.env.WHATSAPP_WEBHOOK_URL) {
      fetch(process.env.WHATSAPP_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'new_rfq_lead',
          leadId: newLead.id,
          lead: newLead,
          destinationWhatsApp: cleanCompanyWa,
          whatsappMessage: orderLines
        })
      }).catch(err => console.error('WhatsApp Webhook error:', err));
    }

    res.json({
      success: true,
      leadId: newLead.id,
      lead: newLead,
      companyWhatsAppUrl,
      whatsappMessage: orderLines,
      message: 'Your Request for Quotation (RFQ) has been submitted successfully to AVIALINK Export Desk.',
      responsePromise: 'Our commercial export team will review your specifications and contact you within 24 business hours.',
      summary: {
        product: newLead.productInterest,
        volume: `${newLead.quantity} ${newLead.quantityUnit}`,
        destination: newLead.destinationPort
      }
    });
  });

  // 2. Admin Leads API
  app.get('/api/admin/leads', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { status, search } = req.query;

      if (supabase) {
        let query = supabase.from('leads').select('*').order('created_at', { ascending: false });

        if (status && typeof status === 'string' && status !== 'all') {
          query = query.eq('status', status);
        }

        if (search && typeof search === 'string' && search.trim()) {
          const q = search.trim();
          query = query.or(`full_name.ilike.%${q}%,company.ilike.%${q}%,country.ilike.%${q}%,product_interest.ilike.%${q}%,email.ilike.%${q}%`);
        }

        const { data, error } = await query;
        if (error) {
          res.status(500).json({ error: 'Database query failed: ' + error.message });
          return;
        }

        const leads = (data || []).map(mapLeadFromRow);
        res.json({ leads, total: leads.length });
        return;
      }

      // Memory fallback
      let filtered = [...leadsStore];
      if (status && typeof status === 'string' && status !== 'all') {
        filtered = filtered.filter(l => l.status === status);
      }
      if (search && typeof search === 'string' && search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          l =>
            l.fullName.toLowerCase().includes(q) ||
            l.company.toLowerCase().includes(q) ||
            l.country.toLowerCase().includes(q) ||
            l.productInterest.toLowerCase().includes(q) ||
            l.email.toLowerCase().includes(q)
        );
      }
      res.json({ leads: filtered, total: filtered.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch leads' });
    }
  });

  // Update Lead Status
  app.put('/api/admin/leads/:id', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['new', 'contacted', 'qualified', 'closed'].includes(status)) {
        res.status(400).json({ error: 'Invalid status value' });
        return;
      }

      if (supabase) {
        const { data, error } = await supabase
          .from('leads')
          .update({ status })
          .eq('id', id)
          .select('*')
          .single();

        if (error || !data) {
          res.status(404).json({ error: 'Lead not found or update failed: ' + (error?.message || '') });
          return;
        }

        res.json({ success: true, lead: mapLeadFromRow(data) });
        return;
      }

      // Memory fallback
      const lead = leadsStore.find(l => l.id === id);
      if (!lead) {
        res.status(404).json({ error: 'Lead not found' });
        return;
      }
      lead.status = status;
      res.json({ success: true, lead });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update lead status' });
    }
  });

  // Export Leads as CSV
  // Mint a short-lived, single-use token the admin panel can safely place in a
  // URL (opened in a new tab) without ever exposing the real admin password.
  app.post('/api/admin/export-token', authenticateAdmin, (_req: Request, res: Response) => {
    res.json({ token: issueExportToken(), expiresInSeconds: 120 });
  });

  // Escapes a CSV field against both quote-breaking AND formula-injection
  // (CSV/Excel injection): if a value starts with =, +, -, @, tab or CR, a
  // spreadsheet app may interpret it as a formula when the file is opened.
  // Prefixing with a leading apostrophe/space neutralizes that while keeping
  // the value human-readable.
  function csvSafeField(raw: unknown): string {
    let value = String(raw ?? '');
    if (/^[=+\-@\t\r]/.test(value)) {
      value = `'${value}`;
    }
    return `"${value.replace(/"/g, '""')}"`;
  }

  app.get('/api/admin/leads/export-csv', async (req: Request, res: Response) => {
    // Accept EITHER a normal admin Authorization header (for programmatic/API
    // use) OR a one-time export token minted via /api/admin/export-token (for
    // the browser "download" button, which cannot send custom headers on a
    // plain navigation/window.open). The raw admin password is never accepted
    // as a query parameter.
    const authHeader = req.headers.authorization;
    const bearerToken = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.substring(7) : undefined;
    const isHeaderAuthed = !!bearerToken && timingSafeStringEqual(bearerToken, resolvedAdminPassword!);
    const isTokenAuthed = consumeExportToken(req.query.token as string | undefined);

    if (!isHeaderAuthed && !isTokenAuthed) {
      res.status(401).json({ error: 'Unauthorized. Invalid or expired export token.' });
      return;
    }

    try {
      let leadsList: Lead[] = [];

      if (supabase) {
        const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (error) {
          res.status(500).json({ error: 'Failed to fetch leads for CSV export: ' + error.message });
          return;
        }
        leadsList = (data || []).map(mapLeadFromRow);
      } else {
        leadsList = leadsStore;
      }

      const headers = [
        'ID',
        'Submitted At',
        'Full Name',
        'Company',
        'Country',
        'Email',
        'Phone',
        'Product Interest',
        'Quantity',
        'Unit',
        'Packaging',
        'Destination Port',
        'Status'
      ];

      const rows = leadsList.map(l => [
        csvSafeField(l.id),
        csvSafeField(l.submittedAt),
        csvSafeField(l.fullName),
        csvSafeField(l.company),
        csvSafeField(l.country),
        csvSafeField(l.email),
        csvSafeField(l.phone),
        csvSafeField(l.productInterest),
        csvSafeField(l.quantity),
        csvSafeField(l.quantityUnit),
        csvSafeField(l.preferredPackaging),
        csvSafeField(l.destinationPort),
        csvSafeField(l.status)
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="avialink_rfq_leads.csv"');
      res.send(csvContent);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to export CSV' });
    }
  });

  // 3. Products Endpoints
  app.get('/api/products', async (_req: Request, res: Response) => {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          res.json(data.map(mapProductFromRow));
          return;
        }
      }

      res.json(productsStore.length > 0 ? productsStore : initialProducts);
    } catch (err: any) {
      res.json(productsStore.length > 0 ? productsStore : initialProducts);
    }
  });

  app.get('/api/products/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      if (supabase) {
        const { data, error } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
        if (!error && data) {
          res.json(mapProductFromRow(data));
          return;
        }
      }

      const product = productsStore.find(p => p.slug === slug || p.id === slug) || initialProducts.find(p => p.slug === slug || p.id === slug);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(product);
    } catch (err: any) {
      const fallback = initialProducts.find(p => p.slug === req.params.slug || p.id === req.params.slug);
      if (fallback) {
        res.json(fallback);
        return;
      }
      res.status(500).json({ error: err.message || 'Failed to fetch product' });
    }
  });

  app.post('/api/admin/products', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const productData = req.body as Product;
      if (!productData.name || !productData.slug) {
        res.status(400).json({ error: 'Product name and slug are required.' });
        return;
      }

      const id = productData.id || `prod-${Date.now()}`;
      const fullProd: Product = { ...productData, id };

      if (supabase) {
        const row = mapProductToRow(fullProd);
        const { data, error } = await supabase.from('products').upsert([row]).select('*').single();

        if (error) {
          res.status(500).json({ error: 'Failed to save product in database: ' + error.message });
          return;
        }

        const saved = mapProductFromRow(data);
        res.json({ success: true, product: saved, action: 'saved' });
        return;
      }

      // Memory fallback
      const existingIndex = productsStore.findIndex(p => p.id === fullProd.id || p.slug === fullProd.slug);
      if (existingIndex >= 0) {
        productsStore[existingIndex] = { ...productsStore[existingIndex], ...fullProd };
        res.json({ success: true, product: productsStore[existingIndex], action: 'updated' });
      } else {
        productsStore.push(fullProd);
        res.json({ success: true, product: fullProd, action: 'created' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to save product' });
    }
  });

  app.delete('/api/admin/products/:id', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (supabase) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
          res.status(500).json({ error: 'Failed to delete product from database: ' + error.message });
          return;
        }
        res.json({ success: true, message: 'Product removed successfully.' });
        return;
      }

      productsStore = productsStore.filter(p => p.id !== id);
      res.json({ success: true, message: 'Product removed successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete product' });
    }
  });

// Helper function for Gemini API calls with automatic retry & fallback models to handle 503 / high demand
async function callGeminiWithRetryAndFallback(
  ai: GoogleGenAI,
  requestParams: { contents: string | any; config: any },
  models: string[] = ['gemini-3.6-flash', 'gemini-3.8-flash']
) {
  let lastError: any = null;

  for (const modelName of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`🤖 Attempting Gemini API call with model '${modelName}' (Attempt ${attempt})...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: requestParams.contents,
          config: requestParams.config
        });
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`⚠️ Gemini model '${modelName}' error (Attempt ${attempt}):`, err?.message || err);
        const errStr = String(err?.message || err || '').toLowerCase();
        
        // If model is discontinued or not found, immediately break to next model
        if (errStr.includes('404') || errStr.includes('not found') || errStr.includes('no longer available')) {
          break;
        }

        const isRetryable = errStr.includes('503') || errStr.includes('unavailable') || errStr.includes('demand') || errStr.includes('429') || errStr.includes('quota') || errStr.includes('rate');
        
        if (isRetryable && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        } else {
          break; // Try next model
        }
      }
    }
  }

  throw lastError || new Error('All Gemini AI model attempts failed.');
}

  // AI Spec Generator for Admin
  app.post('/api/admin/generate-product-specs', authenticateAdmin, async (req: Request, res: Response) => {
    const { promptCropName } = req.body;
    if (!promptCropName || typeof promptCropName !== 'string' || !promptCropName.trim()) {
      res.status(400).json({ error: 'Please enter a crop or product name.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const response = await callGeminiWithRetryAndFallback(ai, {
        contents: `You are an expert Egyptian agricultural export specialist and FAO/GlobalGAP agronomist. 
Generate precise, technical, and accurate export product data for the following crop or produce: "${promptCropName.trim()}".

Respond in JSON format with exact specifications for Egyptian agricultural export:
- name: Full professional Arabic title (e.g. 'الفراولة المصرية الطازجة الفاخرة')
- nameEn: Full professional English title (e.g. 'Egyptian Fresh Strawberries')
- slug: Clean URL slug (e.g. 'strawberries')
- category: Category name (e.g. 'Citrus', 'Fruits', 'Vegetables', 'Roots', or 'Herbs')
- hsCode: Accurate 6-to-8 digit HS Code for customs (e.g. '0810.10')
- exportWindow: Months or season in Ar/En (e.g. 'نوفمبر - أبريل / November - April')
- moq: Minimum Order Quantity (e.g. '1 Forty-Foot Reefer Container (Approx. 12 Metric Tons)')
- storageConditions: Precise cold chain temperature & humidity (e.g. '+0.0°C to +1.0°C with 90-95% Relative Humidity')
- varieties: Array of 2 to 4 major export varieties (e.g. ['Fortuna', 'Sensation', 'Festival'])
- sizes: Array of export caliber or weight ranges (e.g. ['25-35mm', '35mm+'])
- packagingOptions: Array of export packaging formats (e.g. ['Open top carton 2.5 kg', 'Punnets 10x250g'])
- grades: Array of quality grades (e.g. ['Class 1 / FTI', 'Extra Grade'])
- translations: Object containing localized names and details for all 6 supported languages:
  - ar: { name: string, exportWindow: string, moq: string }
  - en: { name: string, exportWindow: string, moq: string }
  - fr: { name: string, exportWindow: string, moq: string }
  - es: { name: string, exportWindow: string, moq: string }
  - de: { name: string, exportWindow: string, moq: string }
  - ru: { name: string, exportWindow: string, moq: string }
- specificationSheet: Object containing "title" and "details" array of key-value objects, e.g.
  {
    "title": "بطاقة المواصفات الفنية المعتمدة",
    "details": [
      { "label": "Origin & Quality Standard", "value": "Egypt (GlobalGAP / CAPQ Certified)" },
      { "label": "Brix / Acid Ratio", "value": "Min 7.5° Brix" },
      { "label": "Cold Treatment / Temp", "value": "+0.5°C Controlled Reefer" },
      { "label": "Chilling Risk Threshold", "value": "None above 0°C" }
    ]
  }`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              nameEn: { type: Type.STRING },
              slug: { type: Type.STRING },
              category: { type: Type.STRING },
              hsCode: { type: Type.STRING },
              exportWindow: { type: Type.STRING },
              moq: { type: Type.STRING },
              storageConditions: { type: Type.STRING },
              varieties: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              sizes: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              packagingOptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              grades: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              translations: {
                type: Type.OBJECT,
                properties: {
                  ar: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, exportWindow: { type: Type.STRING }, moq: { type: Type.STRING } } },
                  en: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, exportWindow: { type: Type.STRING }, moq: { type: Type.STRING } } },
                  fr: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, exportWindow: { type: Type.STRING }, moq: { type: Type.STRING } } },
                  es: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, exportWindow: { type: Type.STRING }, moq: { type: Type.STRING } } },
                  de: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, exportWindow: { type: Type.STRING }, moq: { type: Type.STRING } } },
                  ru: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, exportWindow: { type: Type.STRING }, moq: { type: Type.STRING } } }
                }
              },
              specificationSheet: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  details: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.STRING }
                      },
                      required: ['label', 'value']
                    }
                  }
                },
                required: ['title', 'details']
              }
            },
            required: ['name', 'nameEn', 'slug', 'hsCode', 'exportWindow', 'moq', 'storageConditions', 'varieties', 'packagingOptions', 'specificationSheet']
          }
        }
      });

      const generatedData = JSON.parse(response.text || '{}');
      res.json({ success: true, product: generatedData });
    } catch (err: any) {
      console.error('Gemini AI specs generation error:', err);
      const errStr = String(err?.message || err || '');
      const userFriendlyMsg = (errStr.includes('503') || errStr.includes('UNAVAILABLE') || errStr.includes('demand'))
        ? 'خدمة الذكاء الاصطناعي تشهد ضغطاً عالياً مؤقتاً. يرجى المحاولة مرة أخرى بعد لحظات أو إدخال البيانات يدوياً.'
        : (err.message || 'فشل توليد مواصفات المنتج بواسطة الذكاء الاصطناعي.');
      res.status(500).json({ error: userFriendlyMsg });
    }
  });

  // AI Auto-Translate text to all 6 platform languages (AR, EN, FR, ES, DE, RU)
  app.post('/api/admin/auto-translate', authenticateAdmin, async (req: Request, res: Response) => {
    const { text, sourceLang } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'Text to translate is required.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const response = await callGeminiWithRetryAndFallback(ai, {
        contents: `Translate the following text into all 6 supported languages for Egyptian Agricultural Export Platform: Arabic (ar), English (en), French (fr), Spanish (es), German (de), Russian (ru).
Text to translate: "${text.trim()}". Source language: ${sourceLang || 'Arabic or English'}.

Respond strictly in JSON format with exact keys: ar, en, fr, es, de, ru.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ar: { type: Type.STRING },
              en: { type: Type.STRING },
              fr: { type: Type.STRING },
              es: { type: Type.STRING },
              de: { type: Type.STRING },
              ru: { type: Type.STRING }
            },
            required: ['ar', 'en', 'fr', 'es', 'de', 'ru']
          }
        }
      });

      const translations = JSON.parse(response.text || '{}');
      res.json({ success: true, translations });
    } catch (err: any) {
      console.error('Auto-translation error:', err);
      const errStr = String(err?.message || err || '');
      const userFriendlyMsg = (errStr.includes('503') || errStr.includes('UNAVAILABLE') || errStr.includes('demand'))
        ? 'خدمة الترجمة الآلية تشهد ضغطاً عالياً مؤقتاً. يرجى المحاولة مرة أخرى بعد قليل.'
        : (err.message || 'فشلت الترجمة التلقائية.');
      res.status(500).json({ error: userFriendlyMsg });
    }
  });

  // 3.5 Portfolio Track Record Endpoints
  app.get('/api/portfolio', async (_req: Request, res: Response) => {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('portfolio_projects').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          res.json(data.map(mapPortfolioFromRow));
          return;
        }
      }

      res.json(portfolioStore.length > 0 ? portfolioStore : initialExportProjects);
    } catch (err: any) {
      res.json(portfolioStore.length > 0 ? portfolioStore : initialExportProjects);
    }
  });

  app.post('/api/admin/portfolio', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const projData = req.body;
      if (!projData.title || !projData.cropName) {
        res.status(400).json({ error: 'Project title and crop name are required.' });
        return;
      }

      const id = projData.id || `proj-${Date.now()}`;
      const fullProj = { ...projData, id };

      if (supabase) {
        const row = mapPortfolioToRow(fullProj);
        const { data, error } = await supabase.from('portfolio_projects').upsert([row]).select('*').single();

        if (error) {
          res.status(500).json({ error: 'Failed to save portfolio project in database: ' + error.message });
          return;
        }

        const saved = mapPortfolioFromRow(data);
        res.json({ success: true, project: saved, action: 'saved' });
        return;
      }

      // Memory fallback
      const existingIndex = portfolioStore.findIndex(p => p.id === fullProj.id);
      if (existingIndex >= 0) {
        portfolioStore[existingIndex] = { ...portfolioStore[existingIndex], ...fullProj };
        res.json({ success: true, project: portfolioStore[existingIndex], action: 'updated' });
      } else {
        portfolioStore.unshift(fullProj);
        res.json({ success: true, project: fullProj, action: 'created' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to save portfolio project' });
    }
  });

  app.delete('/api/admin/portfolio/:id', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (supabase) {
        const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
        if (error) {
          res.status(500).json({ error: 'Failed to delete portfolio project: ' + error.message });
          return;
        }
        res.json({ success: true, message: 'Portfolio project removed successfully.' });
        return;
      }

      portfolioStore = portfolioStore.filter(p => p.id !== id);
      res.json({ success: true, message: 'Portfolio project removed successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete portfolio project' });
    }
  });

  // 4. Certifications Endpoints
  app.get('/api/certifications', async (_req: Request, res: Response) => {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('certifications').select('*').order('updated_at', { ascending: false });
        if (!error && data && data.length > 0) {
          res.json(data.map(mapCertificationFromRow));
          return;
        }
      }

      res.json(certificationsStore.length > 0 ? certificationsStore : defaultCertificationsList);
    } catch (err: any) {
      res.json(certificationsStore.length > 0 ? certificationsStore : defaultCertificationsList);
    }
  });

  app.post('/api/admin/certifications', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { name, category, status, issuedBy, description, fileUrl } = req.body;
      if (!name || !category) {
        res.status(400).json({ error: 'Name and category are required.' });
        return;
      }

      const newCert: CertificationItem = {
        id: `cert-${Date.now()}`,
        name,
        category,
        status: status === 'Verified' ? 'Verified' : 'Pending Official Upload',
        issuedBy: issuedBy || '',
        description: description || '',
        fileUrl: fileUrl || '',
        updatedAt: new Date().toISOString()
      };

      if (supabase) {
        const row = mapCertificationToRow(newCert);
        const { data, error } = await supabase.from('certifications').insert([row]).select('*').single();
        if (error) {
          res.status(500).json({ error: 'Failed to save certification in database: ' + error.message });
          return;
        }
        res.json({ success: true, certification: mapCertificationFromRow(data) });
        return;
      }

      certificationsStore.unshift(newCert);
      res.json({ success: true, certification: newCert });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create certification' });
    }
  });

  // 5. Analytics & Real Counter Endpoints
  app.get('/api/analytics', async (_req: Request, res: Response) => {
    try {
      let totalLeadsLogged = leadsStore.length;
      let ratingsList = buyerRatingsStore;

      if (supabase) {
        const { count: leadCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
        if (leadCount !== null && leadCount !== undefined) {
          totalLeadsLogged = leadCount;
        }

        const { data: ratingsData } = await supabase.from('buyer_ratings').select('rating');
        if (ratingsData) {
          ratingsList = ratingsData as any;
        }
      }

      const realRatingsCount = ratingsList.length;
      const avgRating = realRatingsCount > 0
        ? (ratingsList.reduce((acc, curr) => acc + Number(curr.rating), 0) / realRatingsCount).toFixed(1)
        : null;

      res.json({
        ...analyticsStore,
        totalLeadsLogged,
        realRatingsCount,
        averageRating: avgRating
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch analytics' });
    }
  });

  app.post('/api/analytics/event', (req: Request, res: Response) => {
    const { type, details } = req.body;
    if (type === 'page_view') analyticsStore.pageViews += 1;
    if (type === 'rfq_start') analyticsStore.rfqStarts += 1;
    if (type === 'spec_download') analyticsStore.specDownloads += 1;
    if (type === 'whatsapp_click') analyticsStore.whatsAppClicks += 1;

    if (type === 'product_view' && details?.productSlug) {
      analyticsStore.topProductsViewed[details.productSlug] = (analyticsStore.topProductsViewed[details.productSlug] || 0) + 1;
    }

    if (type === 'market_view' && details?.marketSlug) {
      analyticsStore.topMarketsViewed[details.marketSlug] = (analyticsStore.topMarketsViewed[details.marketSlug] || 0) + 1;
    }

    res.json({ recorded: true });
  });

  // 6. Ratings & Feedback
  app.get('/api/ratings', async (_req: Request, res: Response) => {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('buyer_ratings').select('*').order('created_at', { ascending: false });
        if (error) {
          res.status(500).json({ error: 'Failed to fetch ratings: ' + error.message });
          return;
        }
        const ratings = (data || []).map(mapRatingFromRow);
        const avg = ratings.length > 0
          ? Number((ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length).toFixed(1))
          : null;

        res.json({
          count: ratings.length,
          averageRating: avg,
          ratings
        });
        return;
      }

      const avg = buyerRatingsStore.length > 0 
        ? Number((buyerRatingsStore.reduce((acc, curr) => acc + curr.rating, 0) / buyerRatingsStore.length).toFixed(1))
        : null;

      res.json({
        count: buyerRatingsStore.length,
        averageRating: avg,
        ratings: buyerRatingsStore
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch ratings' });
    }
  });

  app.post('/api/ratings', async (req: Request, res: Response) => {
    try {
      const { rating, buyerCompany, buyerCountry, comment } = req.body;
      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        res.status(400).json({ error: 'Rating must be between 1 and 5.' });
        return;
      }

      const newRating: BuyerRating = {
        id: `rating-${Date.now()}`,
        rating: numRating,
        buyerCompany: buyerCompany ? String(buyerCompany).trim() : 'Verified Buyer',
        buyerCountry: buyerCountry ? String(buyerCountry).trim() : 'International',
        comment: comment ? String(comment).trim() : '',
        createdAt: new Date().toISOString()
      };

      if (supabase) {
        const row = mapRatingToRow(newRating);
        const { data, error } = await supabase.from('buyer_ratings').insert([row]).select('*').single();
        if (error) {
          res.status(500).json({ error: 'Failed to save buyer rating: ' + error.message });
          return;
        }
        res.json({ success: true, rating: mapRatingFromRow(data) });
        return;
      }

      buyerRatingsStore.unshift(newRating);
      res.json({ success: true, rating: newRating });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to post rating' });
    }
  });

  // 7. Placeholders Log API
  app.get('/api/placeholders', async (_req: Request, res: Response) => {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('placeholders_log').select('*').order('updated_at', { ascending: false });
        if (!error && data && data.length > 0) {
          res.json(data.map(mapPlaceholderFromRow));
          return;
        }
      }

      res.json(placeholdersStore.length > 0 ? placeholdersStore : initialPlaceholdersLog);
    } catch (err: any) {
      res.json(placeholdersStore.length > 0 ? placeholdersStore : initialPlaceholdersLog);
    }
  });

  app.post('/api/admin/placeholders', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { location, placeholderLabel, requiredDataDescription } = req.body;
      const newItem: PlaceholderItem = {
        id: `ph-${Date.now()}`,
        location: location || 'General Site Content',
        placeholderLabel: placeholderLabel || '[PLACEHOLDER: Pending Data]',
        requiredDataDescription: requiredDataDescription || 'Real company data to be provided.',
        updatedAt: new Date().toISOString()
      };

      if (supabase) {
        const row = mapPlaceholderToRow(newItem);
        const { data, error } = await supabase.from('placeholders_log').insert([row]).select('*').single();
        if (error) {
          res.status(500).json({ error: 'Failed to save placeholder item: ' + error.message });
          return;
        }
        res.json({ success: true, placeholder: mapPlaceholderFromRow(data) });
        return;
      }

      placeholdersStore.push(newItem);
      res.json({ success: true, placeholder: newItem });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create placeholder' });
    }
  });

  // 8. Company Settings & Main Contacts API (Admin editable)
  app.get('/api/settings', async (_req: Request, res: Response) => {
    try {
      const settings = await fetchCompanySettings();
      res.json(settings);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch settings' });
    }
  });

  const updateSettingsHandler = async (req: Request, res: Response) => {
    try {
      const current = await fetchCompanySettings();
      const { phone, email, whatsappNumber, whatsappLink, hotline, websiteUrl, locationText, liveLocationUrl, mapEmbedUrl, socialLinks } = req.body;
      
      const updated: CompanySettings = {
        phone: phone !== undefined ? String(phone).trim() : current.phone,
        email: email !== undefined ? String(email).trim() : current.email,
        whatsappNumber: whatsappNumber !== undefined ? String(whatsappNumber).trim() : current.whatsappNumber,
        whatsappLink: whatsappLink !== undefined ? String(whatsappLink).trim() : current.whatsappLink,
        hotline: hotline !== undefined ? String(hotline).trim() : current.hotline || '+201093393355',
        websiteUrl: websiteUrl !== undefined ? String(websiteUrl).trim() : current.websiteUrl || 'avialink.com',
        locationText: {
          ar: locationText?.ar !== undefined ? String(locationText.ar).trim() : current.locationText.ar,
          en: locationText?.en !== undefined ? String(locationText.en).trim() : current.locationText.en,
          fr: locationText?.fr !== undefined ? String(locationText.fr).trim() : current.locationText.fr,
          es: locationText?.es !== undefined ? String(locationText.es).trim() : current.locationText.es,
          de: locationText?.de !== undefined ? String(locationText.de).trim() : current.locationText.de,
          ru: locationText?.ru !== undefined ? String(locationText.ru).trim() : current.locationText.ru,
        },
        liveLocationUrl: liveLocationUrl !== undefined ? String(liveLocationUrl).trim() : current.liveLocationUrl,
        mapEmbedUrl: mapEmbedUrl !== undefined ? String(mapEmbedUrl).trim() : current.mapEmbedUrl,
        socialLinks: {
          facebook: socialLinks?.facebook !== undefined ? String(socialLinks.facebook).trim() : current.socialLinks.facebook,
          twitter: socialLinks?.twitter !== undefined ? String(socialLinks.twitter).trim() : current.socialLinks.twitter,
          linkedin: socialLinks?.linkedin !== undefined ? String(socialLinks.linkedin).trim() : current.socialLinks.linkedin,
          instagram: socialLinks?.instagram !== undefined ? String(socialLinks.instagram).trim() : current.socialLinks.instagram,
          youtube: socialLinks?.youtube !== undefined ? String(socialLinks.youtube).trim() : current.socialLinks.youtube,
        }
      };

      if (supabase) {
        const row = mapSettingsToRow(updated);
        const { data, error } = await supabase.from('company_settings').upsert([row]).select('*').single();
        if (error) {
          res.status(500).json({ error: 'Failed to update company settings in database: ' + error.message });
          return;
        }
        res.json({ success: true, settings: mapSettingsFromRow(data) });
        return;
      }

      companySettingsStore = updated;
      res.json({ success: true, settings: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update settings' });
    }
  };

  app.put('/api/admin/settings', authenticateAdmin, updateSettingsHandler);
  app.post('/api/admin/settings', authenticateAdmin, updateSettingsHandler);

  // ==================== DATABASE STATUS DIAGNOSTICS ENDPOINT ====================
  app.get('/api/admin/db-status', authenticateAdmin, async (_req: Request, res: Response) => {
    try {
      const dbConnected = !!supabase;
      const status: any = {
        connected: dbConnected,
        provider: dbConnected ? 'Supabase (PostgreSQL)' : 'In-Memory Cache & Local File Fallback',
        timestamp: new Date().toISOString()
      };

      if (dbConnected && supabase) {
        // Query the schema and connection statistics to verify tables are queryable
        const tables = ['products', 'leads', 'certifications', 'portfolio_projects', 'placeholders_log', 'company_settings', 'site_content'];
        const tableStatus: Record<string, any> = {};

        for (const t of tables) {
          try {
            const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
            if (error) {
              tableStatus[t] = { status: 'error', message: error.message };
            } else {
              tableStatus[t] = { status: 'ok', count: count || 0 };
            }
          } catch (e: any) {
            tableStatus[t] = { status: 'error', message: e.message || String(e) };
          }
        }
        status.tables = tableStatus;
      }

      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch database status' });
    }
  });

  // ==================== DYNAMIC SITE CONTENT (CMS) ENDPOINTS ====================
  app.get('/api/site-content', (_req: Request, res: Response) => {
    try {
      res.json(siteContentStore);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch site content' });
    }
  });

  app.put('/api/admin/site-content', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const updates = req.body as Partial<SiteContent>;
      siteContentStore = {
        ...siteContentStore,
        ...updates,
        announcement: updates.announcement !== undefined ? { ...siteContentStore.announcement, ...updates.announcement } : siteContentStore.announcement,
        csr: updates.csr !== undefined ? { ...siteContentStore.csr, ...updates.csr } : siteContentStore.csr,
        updatedAt: new Date().toISOString()
      };
      await persistSiteContent();
      res.json({ success: true, siteContent: siteContentStore });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update site content' });
    }
  });

  app.post('/api/admin/exhibitions', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const exhibit = req.body as Partial<ExhibitionItem>;
      if (!exhibit.title) {
        res.status(400).json({ error: 'Exhibition title is required' });
        return;
      }
      const existingIdx = siteContentStore.exhibitions.findIndex(e => e.id === exhibit.id);
      let updatedItem: ExhibitionItem;
      if (existingIdx >= 0) {
        updatedItem = {
          ...siteContentStore.exhibitions[existingIdx],
          ...exhibit,
          updatedAt: new Date().toISOString()
        } as ExhibitionItem;
        siteContentStore.exhibitions[existingIdx] = updatedItem;
      } else {
        updatedItem = {
          id: exhibit.id || `exhibit-${Date.now()}`,
          title: exhibit.title,
          titleEn: exhibit.titleEn || exhibit.title,
          date: exhibit.date || '',
          city: exhibit.city || '',
          country: exhibit.country || '',
          standNumber: exhibit.standNumber || '',
          excerpt: exhibit.excerpt || '',
          excerptEn: exhibit.excerptEn || exhibit.excerpt || '',
          image: exhibit.image || '/crops/sweet_potatoes.jpg',
          category: exhibit.category || 'معارض زراعية دولية',
          categoryEn: exhibit.categoryEn || 'International Trade Show',
          status: exhibit.status || 'upcoming',
          externalUrl: exhibit.externalUrl || '',
          updatedAt: new Date().toISOString()
        };
        siteContentStore.exhibitions.unshift(updatedItem);
      }
      await persistSiteContent();
      res.json({ success: true, exhibition: updatedItem, exhibitions: siteContentStore.exhibitions });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to save exhibition' });
    }
  });

  app.delete('/api/admin/exhibitions/:id', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      siteContentStore.exhibitions = siteContentStore.exhibitions.filter(e => e.id !== id);
      await persistSiteContent();
      res.json({ success: true, exhibitions: siteContentStore.exhibitions });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete exhibition' });
    }
  });

  app.post('/api/admin/protocols', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const protocol = req.body as Partial<DynamicProtocolItem>;
      if (!protocol.title || !protocol.cropKey) {
        res.status(400).json({ error: 'Protocol title and cropKey are required' });
        return;
      }
      const existingIdx = siteContentStore.protocols.findIndex(p => p.id === protocol.id || p.cropKey === protocol.cropKey);
      let updatedProtocol: DynamicProtocolItem;
      if (existingIdx >= 0) {
        updatedProtocol = {
          ...siteContentStore.protocols[existingIdx],
          ...protocol
        } as DynamicProtocolItem;
        siteContentStore.protocols[existingIdx] = updatedProtocol;
      } else {
        updatedProtocol = {
          id: protocol.id || `proto-${Date.now()}`,
          cropKey: protocol.cropKey,
          cropName: protocol.cropName || '',
          cropNameEn: protocol.cropNameEn || protocol.cropName || '',
          badge: protocol.badge || 'بروتوكول جودة معتمد',
          badgeEn: protocol.badgeEn || 'Certified Protocol',
          title: protocol.title,
          titleEn: protocol.titleEn || protocol.title,
          subtitle: protocol.subtitle || '',
          subtitleEn: protocol.subtitleEn || protocol.subtitle || '',
          image: protocol.image || '/crops/sweet_potatoes.jpg',
          standards: protocol.standards || [],
          parameters: protocol.parameters || [],
          phases: protocol.phases || [],
          verifications: protocol.verifications || [],
          criticalLimit: protocol.criticalLimit || '',
          criticalLimitEn: protocol.criticalLimitEn || protocol.criticalLimit || ''
        };
        siteContentStore.protocols.push(updatedProtocol);
      }
      await persistSiteContent();
      res.json({ success: true, protocol: updatedProtocol, protocols: siteContentStore.protocols });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to save quality protocol' });
    }
  });

  app.delete('/api/admin/protocols/:id', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      siteContentStore.protocols = siteContentStore.protocols.filter(p => p.id !== id && p.cropKey !== id);
      await persistSiteContent();
      res.json({ success: true, protocols: siteContentStore.protocols });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete protocol' });
    }
  });

  // ==================== FRONTEND VITE / STATIC SERVING & SEO ROUTES ====================

  // Explicit High-Performance SEO Routes (Sitemap & Robots)
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    res.sendFile(sitemapPath);
  });

  app.get('/robots.txt', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    res.sendFile(robotsPath);
  });

  const httpServer = http.createServer(app);

  const distPath = path.join(process.cwd(), 'dist');
  const distIndexExists = fs.existsSync(path.join(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' || distIndexExists;

  function serveStaticFiles() {
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath, {
        maxAge: '30d',
        setHeaders: (res, filePath) => {
          if (filePath.match(/\.(js|css|woff|woff2|ttf|eot)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          } else if (filePath.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=604800');
          }
        }
      }));
      app.get('*', (_req: Request, res: Response) => {
        res.setHeader('Cache-Control', 'no-cache');
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send('Index file not found');
        }
      });
    } else {
      app.get('*', (_req: Request, res: Response) => {
        res.status(500).send('Production build assets not found. Please run npm run build.');
      });
    }
  }

  if (!isProduction) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          hmr: {
            server: httpServer,
            clientPort: 443
          }
        },
        appType: 'spa'
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.warn('⚠️ Could not start Vite dev middleware, falling back to static dist serving:', viteErr);
      serveStaticFiles();
    }
  } else {
    serveStaticFiles();
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ AVIALINK Server active and listening on http://0.0.0.0:${PORT} (Production mode: ${isProduction})`);
  });
}

startServer().catch((err) => {
  console.error('❌ Fatal error during server startup:', err);
  process.exit(1);
});
