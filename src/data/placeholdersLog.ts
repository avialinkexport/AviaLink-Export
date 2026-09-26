import { PlaceholderItem } from '../types';

export const initialPlaceholdersLog: PlaceholderItem[] = [
  {
    id: 'ph-001',
    location: 'Footer & Contact Page',
    placeholderLabel: '[PLACEHOLDER: Physical Headquarters Address & Tax ID]',
    requiredDataDescription: 'Official registered business street address, city, Postal Code, and Egyptian Tax Registration ID.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ph-002',
    location: 'Trust & Compliance Center',
    placeholderLabel: '[PLACEHOLDER: Official GlobalGAP & ISO Certification Files]',
    requiredDataDescription: 'Scanned PDF certificates and official registration audit numbers for GlobalGAP, ISO 22000, and BRC food safety standards.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ph-003',
    location: 'Homepage & About Page Statistics',
    placeholderLabel: '[PLACEHOLDER: Certified Annual Export Tonnage & Country Count]',
    requiredDataDescription: 'Audited customs export volume figures and verified list of destination countries served in the previous fiscal year.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ph-004',
    location: 'Products Specification Sheets',
    placeholderLabel: '[PLACEHOLDER: Exact Caliber & Brix Grade Specifications]',
    requiredDataDescription: 'Lab-certified grading chart for Sweet Potato calibers (L, XL, XXL) and Citrus Brix sweet levels for specific harvests.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ph-005',
    location: 'Testimonials / Client Logos',
    placeholderLabel: '[PLACEHOLDER: Verified Importer Case Studies & Consent]',
    requiredDataDescription: 'Written consent and verified logo/quote assets from international retail/import partners.',
    updatedAt: new Date().toISOString()
  }
];
