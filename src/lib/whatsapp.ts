import { Lead } from '../types';

/**
 * Normalizes Arabic/Persian/Indic digits to standard Latin ASCII digits (0-9).
 */
export function normalizeDigits(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return '';
  const str = String(input);
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str
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

/**
 * Safely parses any number, handling Arabic numerals, spaces, and commas.
 */
export function safeParseNumber(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleanStr = normalizeDigits(val).replace(/,/g, '').trim();
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Cleans phone number to international format for wa.me links
 */
export function cleanWhatsAppNumber(phone: string | undefined | null): string {
  if (!phone) return '201000000000';
  const digitsOnly = normalizeDigits(phone).replace(/\D/g, '');
  if (!digitsOnly) return '201000000000';
  // If starts with 00, replace with nothing
  if (digitsOnly.startsWith('00')) return digitsOnly.substring(2);
  return digitsOnly;
}

/**
 * Formats full RFQ details into a neat, human-readable WhatsApp message
 */
export function formatRFQForWhatsApp(lead: Partial<Lead>, lang: string = 'ar'): string {
  const isRtl = lang === 'ar';
  const refId = lead.id || 'AVL-EXPORT-RFQ';

  if (isRtl) {
    const lines = [
      `🌾 *طلب عرض سعر تصديري جديد - أفيا لينك (AVIALINK)* 🌾`,
      `📄 *رقم المرجع:* ${refId}`,
      lead.submittedAt ? `🕒 *التاريخ:* ${new Date(lead.submittedAt).toLocaleString('ar-EG')}` : '',
      `--------------------------------------`,
      `👤 *بيانات المشتري والشركة:*`,
      `• *الاسم الكامل:* ${lead.fullName || '-'}`,
      `• *الشركة:* ${lead.company || '-'}`,
      `• *دولة الوصول:* ${lead.country || '-'}`,
      `• *البريد الإلكتروني:* ${lead.email || '-'}`,
      `• *الهاتف / واتساب:* ${lead.phone || '-'}`,
      `--------------------------------------`,
      `📦 *تفاصيل الشحنة والمحصول:*`,
      `• *المحصول المطلوب:* ${lead.productInterest || '-'}`,
      lead.variety ? `• *الصنف:* ${lead.variety}` : '',
      lead.grade ? `• *الرتبة:* ${lead.grade}` : '',
      lead.size ? `• *الحجم / المقاس:* ${lead.size}` : '',
      `• *الكمية المطلوبة:* ${lead.quantity || '-'} ${lead.quantityUnit || 'طن'}`,
      lead.preferredPackaging ? `• *التعبئة المفضلة:* ${lead.preferredPackaging}` : '',
      `--------------------------------------`,
      `🚢 *اللوجستيات والشحن:*`,
      lead.incoterm ? `• *شرط الشحن (Incoterm):* ${lead.incoterm}` : '',
      lead.destinationPort ? `• *ميناء الوصول المستهدف:* ${lead.destinationPort}` : '',
      lead.preferredShipmentDate ? `• *موعد الشحن المفضل:* ${lead.preferredShipmentDate}` : '',
      lead.shippingNotes ? `• *ملاحظات الشحن:* ${lead.shippingNotes}` : '',
      lead.message ? `• *ملاحظات الجودة / تعليمات خاصة:* ${lead.message}` : '',
      `--------------------------------------`,
      `🌐 تم الإرسال عبر البوابة الإلكترونية لشركة أفيا لينك للحاصلات الزراعية والتصدير الدولي.`
    ];
    return lines.filter(Boolean).join('\n');
  }

  // English/International default
  const lines = [
    `🌾 *New Export RFQ Inquiry - AVIALINK Agricultural Export* 🌾`,
    `📄 *Reference ID:* ${refId}`,
    lead.submittedAt ? `🕒 *Date:* ${new Date(lead.submittedAt).toUTCString()}` : '',
    `--------------------------------------`,
    `👤 *Buyer & Company Profile:*`,
    `• *Full Name:* ${lead.fullName || '-'}`,
    `• *Company:* ${lead.company || '-'}`,
    `• *Destination Country:* ${lead.country || '-'}`,
    `• *Email:* ${lead.email || '-'}`,
    `• *Phone / WhatsApp:* ${lead.phone || '-'}`,
    `--------------------------------------`,
    `📦 *Cargo & Crop Specifications:*`,
    `• *Requested Crop:* ${lead.productInterest || '-'}`,
    lead.variety ? `• *Variety:* ${lead.variety}` : '',
    lead.grade ? `• *Grade:* ${lead.grade}` : '',
    lead.size ? `• *Caliber / Size:* ${lead.size}` : '',
    `• *Order Volume:* ${lead.quantity || '-'} ${lead.quantityUnit || 'Tons'}`,
    lead.preferredPackaging ? `• *Preferred Packaging:* ${lead.preferredPackaging}` : '',
    `--------------------------------------`,
    `🚢 *Logistics & Freight Terms:*`,
    lead.incoterm ? `• *Incoterm:* ${lead.incoterm}` : '',
    lead.destinationPort ? `• *Port of Discharge:* ${lead.destinationPort}` : '',
    lead.preferredShipmentDate ? `• *Target Shipment Date:* ${lead.preferredShipmentDate}` : '',
    lead.shippingNotes ? `• *Shipping Notes:* ${lead.shippingNotes}` : '',
    lead.message ? `• *Buyer Notes:* ${lead.message}` : '',
    `--------------------------------------`,
    `🌐 Submitted via AviaLink Agricultural Export Commercial Portal.`
  ];
  return lines.filter(Boolean).join('\n');
}

/**
 * Builds direct WhatsApp URL to company's registered WhatsApp
 */
export function buildCompanyWhatsAppUrl(
  companyWhatsApp: string | undefined | null,
  lead: Partial<Lead>,
  lang: string = 'ar'
): string {
  const cleanNumber = cleanWhatsAppNumber(companyWhatsApp);
  const message = formatRFQForWhatsApp(lead, lang);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds direct WhatsApp URL to message the buyer
 */
export function buildBuyerWhatsAppUrl(lead: Partial<Lead>, lang: string = 'ar'): string {
  const cleanNumber = cleanWhatsAppNumber(lead.phone);
  const isRtl = lang === 'ar';
  const greeting = isRtl
    ? `السلام عليكم أستاذ/ة ${lead.fullName || ''}، تحياتنا من شركة أفيا لينك (AVIALINK) للحاصلات الزراعية والتصدير. بخصوص طلبكم رقم (${lead.id || 'AVL-RFQ'}) لمحصول ${lead.productInterest || ''}: يسعدنا تواصلكم ويسرنا تزويدكم بكافة التفاصيل وعرض السعر.`
    : `Hello ${lead.fullName || ''}, greetings from AviaLink Agricultural Export. Regarding your quotation request (${lead.id || 'AVL-RFQ'}) for ${lead.productInterest || 'fresh produce'}: we are pleased to connect and share commercial terms.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`;
}
