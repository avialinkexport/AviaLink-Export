import { Product } from '../types';

export const initialProducts: Product[] = [
  {
    id: 'prod-sweet-potatoes',
    name: 'البطاطا الحلوة المصرية الفاخرة',
    nameEn: 'Egyptian Premium Sweet Potatoes',
    slug: 'sweet-potatoes',
    category: 'sweet-potatoes',
    shortDescription: 'محصولنا الرئيسي الاستراتيجي للتصدير - بطاطا حلوة برتقالية مصرية فاخرة (بيورجارد وبيليفيو وبلدي) مزروعة في أراضي الدلتا والأراضي المستصلحة، تمتاز بالطعم الحلو الفاخر وعمر تخزيني ممتد.',
    origin: 'مصر (دلتا النيل والأراضي المستصلحة)',
    varieties: ['Baladi', 'Bellevue', 'Beauregard'],
    grades: ['Class I (Export Standard)'],
    sizes: ['S (80-150g)', 'M (150-300g)', 'L1 (300-450g)', 'L2 (450-600g)', 'XL (600-800g)'],
    packagingOptions: [
      '6 kg Open-Top Carton Box',
      '10 kg Corrugated Carton Box',
      '15 kg Telescopic Export Carton',
      '1000 kg Jumbo Bulk Bags'
    ],
    season: {
      startMonth: 'July',
      endMonth: 'June',
      peakMonths: ['August', 'September', 'October', 'November', 'December', 'January']
    },
    exportWindow: 'Baladi: Jul–Jan | Bellevue: Jul–Dec | Beauregard: Dec–Jul',
    storageConditions: '+13.0°C to +15.0°C (Set-point: +13.5°C) with 85-90% Relative Humidity. Require cured ventilation.',
    MOQ: '1 Forty-Foot Reefer Container (Approx. 24-25 Metric Tons)',
    moq: '1 Forty-Foot Reefer Container (Approx. 24-25 Metric Tons)',
    loadingMethod: '40ft High-Cube Reefer Container (20 Pallets, approx. 2,400 to 2,800 cartons)',
    hsCode: '071420',
    exportCertificationsAvailable: ['GlobalGAP (Farm Audit Protocol)', 'Phytosanitary Certificate (CAPQ per batch)', 'Certificate of Origin (Chamber of Commerce)'],
    images: [
      '/crops/sweet_potatoes.jpg'
    ],
    specificationSheet: {
      pdfName: 'AVIALINK_Spec_Sweet_Potatoes.pdf',
      lastUpdated: '2026-09-01',
      details: [
        { label: 'Crop Origin', value: 'Egypt' },
        { label: 'Primary Varieties', value: 'Baladi, Bellevue & Beauregard' },
        { label: 'Baladi Season', value: 'July – January' },
        { label: 'Bellevue Season', value: 'July – December' },
        { label: 'Beauregard Season', value: 'December – July' },
        { label: 'Flesh Color', value: 'Deep Orange / Naturally Sweet' },
        { label: 'Temperature Control', value: '+13.5°C during sea transport (RH 85-90%)' },
        { label: 'Chilling Risk Threshold', value: 'Never store below +12°C' }
      ]
    }
  },
  {
    id: 'prod-onions',
    name: 'البصل المصري الطازج (الأحمر والأصفر)',
    nameEn: 'Egyptian Fresh Red & Golden Onions',
    slug: 'onions',
    category: 'onions',
    shortDescription: 'بصل مصري صلب جاف عالي المادة الجافة بصلابة ممتازة وقشرة خارجية سميكة، مثالي للشحن البحري الطويل والتخزين الممتد للأسواق الأوروبية والعربية.',
    origin: 'مصر (الصعيد والدلتا والفيوم)',
    varieties: ['Red Onions (Giza 6)', 'Golden / Yellow Onions (Giza 20)'],
    grades: ['Class I Export Grade'],
    sizes: ['40-60 mm', '50-70 mm', '60-80 mm', '70-90 mm', '80-100+ mm'],
    packagingOptions: [
      '25 kg Mesh Bags (Red/Yellow)',
      '10 kg / 25 kg Polypropylene Bags',
      '1000 kg Jumbo Bulk Bags'
    ],
    season: {
      startMonth: 'February',
      endMonth: 'October',
      peakMonths: ['March', 'April', 'May', 'June', 'July', 'August']
    },
    exportWindow: 'Fresh Spring Crop: Feb–May | Cured Dry Crop: May–Oct',
    storageConditions: '+0.0°C to +2.0°C with 65-70% Relative Humidity (Dry Reefer setting) or ambient dry ventilated storage.',
    MOQ: '1 Forty-Foot Container (Approx. 26-28 Metric Tons)',
    moq: '1 Forty-Foot Container (Approx. 26-28 Metric Tons)',
    loadingMethod: '40ft Reefer/Dry Container (1,080 to 1,120 mesh bags of 25kg on 20 pallets)',
    hsCode: '070310',
    exportCertificationsAvailable: ['Phytosanitary Certificate (CAPQ per batch)', 'GlobalGAP (Farm Audit Protocol)', 'Certificate of Origin'],
    images: [
      '/crops/onions.jpg'
    ],
    specificationSheet: {
      pdfName: 'AVIALINK_Spec_Onions.pdf',
      lastUpdated: '2026-09-01',
      details: [
        { label: 'Crop Origin', value: 'Egypt' },
        { label: 'Primary Varieties', value: 'Red (Giza 6) & Golden (Giza 20)' },
        { label: 'Dry Matter %', value: '> 14.5% High Solidity' },
        { label: 'Skin Quality', value: 'Double/Triple Layer Outer Papery Skin' },
        { label: 'Export Season', value: 'February – October' },
        { label: 'Temperature Control', value: '+0°C to +2°C (Dry Reefer 65-70% RH)' },
        { label: 'Pesticide Residue', value: 'Strict EU & GCC MRL Compliant' }
      ]
    }
  },
  {
    id: 'prod-carrots',
    name: 'الجزر المصري الطازج',
    nameEn: 'Egyptian Fresh Orange Carrots',
    slug: 'carrots',
    category: 'carrots',
    shortDescription: 'جزر برتقالي مصري طازج غني بالبيتا كاروتين، مغسول آلياً ومفرز بعناية بأحجام موحدة ونضارة عالية للتصدير المباشر.',
    origin: 'مصر (الأراضي الصحراوية والدلتا)',
    varieties: ['Japanese Variety (Nantes)', 'French Variety'],
    grades: ['Class I Export Grade'],
    sizes: ['M (100-200g)', 'L (200-300g)', 'XL (300g+)'],
    packagingOptions: [
      '10 kg Corrugated Carton Box',
      '15 kg Telescopic Export Carton',
      '6 kg Open-Top Carton Box'
    ],
    season: {
      startMonth: 'December',
      endMonth: 'June',
      peakMonths: ['January', 'February', 'March', 'April', 'May']
    },
    exportWindow: 'December to June (Peak Winter & Spring Season)',
    storageConditions: '+0.0°C to +1.0°C (Set-point: +0.5°C) with 95% Relative Humidity.',
    MOQ: '1 Forty-Foot Reefer Container (Approx. 24-25 Metric Tons)',
    moq: '1 Forty-Foot Reefer Container (Approx. 24-25 Metric Tons)',
    loadingMethod: '40ft High-Cube Reefer Container (20 Pallets, approx. 2,400 to 2,500 cartons)',
    hsCode: '070610',
    exportCertificationsAvailable: ['GlobalGAP (Farm Audit Protocol)', 'Phytosanitary Certificate (CAPQ)', 'ISO 22000'],
    images: [
      '/crops/carrots.jpg'
    ],
    specificationSheet: {
      pdfName: 'AVIALINK_Spec_Carrots.pdf',
      lastUpdated: '2026-09-01',
      details: [
        { label: 'Crop Origin', value: 'Egypt' },
        { label: 'Varieties', value: 'Nantes (Japanese) & French' },
        { label: 'Color', value: 'Vibrant Deep Orange' },
        { label: 'Washing State', value: 'Optically Washed & Polished' },
        { label: 'Temperature Control', value: '+0.5°C Sea Transit (RH 95%)' }
      ]
    }
  },
  {
    id: 'prod-red-beet',
    name: 'البنجر الأحمر المصري (الشمندر)',
    nameEn: 'Egyptian Dark Red Beetroot',
    slug: 'red-beet',
    category: 'red-beet',
    shortDescription: 'بنجر أحمر داكن طازج ذو نسبة سكر عالية ولون داكن مميز، مجهز للتصدير ومثالي للاستهلاك المباشر ومصانع الأغذية.',
    origin: 'مصر (الدلتا والصعيد)',
    varieties: ['Egyptian Red Beetroot'],
    grades: ['Class I Export Grade'],
    sizes: ['S (50-80mm)', 'M (80-120mm)', 'L (120-150mm)'],
    packagingOptions: [
      '10 kg Corrugated Carton Box',
      '15 kg Telescopic Export Carton',
      '25 kg Mesh Bags (Red/Yellow)'
    ],
    season: {
      startMonth: 'November',
      endMonth: 'May',
      peakMonths: ['December', 'January', 'February', 'March', 'April']
    },
    exportWindow: 'November to May',
    storageConditions: '+0.0°C to +2.0°C (Set-point: +1.0°C) with 90-95% Relative Humidity.',
    MOQ: '1 Forty-Foot Reefer Container (Approx. 24 Metric Tons)',
    moq: '1 Forty-Foot Reefer Container (Approx. 24 Metric Tons)',
    loadingMethod: '40ft High-Cube Reefer Container (20 Pallets)',
    hsCode: '070690',
    exportCertificationsAvailable: ['Phytosanitary Certificate (CAPQ)', 'GlobalGAP', 'Certificate of Origin'],
    images: [
      '/crops/red_beet.jpg'
    ],
    specificationSheet: {
      pdfName: 'AVIALINK_Spec_Red_Beet.pdf',
      lastUpdated: '2026-09-01',
      details: [
        { label: 'Crop Origin', value: 'Egypt' },
        { label: 'Flesh Color', value: 'Deep Crimson Red' },
        { label: 'Export Season', value: 'November – May' },
        { label: 'Temperature Control', value: '+1.0°C Sea Transit (RH 90-95%)' }
      ]
    }
  },
  {
    id: 'prod-garlic',
    name: 'الثوم المصري الطازج (الأبيض والأرجواني)',
    nameEn: 'Egyptian Fresh White & Purple Garlic',
    slug: 'garlic',
    category: 'garlic',
    shortDescription: 'ثوم مصري طازج وجاف (بلدي أبيض وأرجواني) ذو فصوص متماسكة ونكهة قوية نفاذة، يجهز بأعلى معايير التجفيف والتجذير للتصدير.',
    origin: 'مصر (بني سويف والمنيا والفيوم)',
    varieties: ['Baladi White Garlic', 'Chinese Purple Garlic'],
    grades: ['Class I Export Grade'],
    sizes: ['40-50 mm', '50-60 mm', '60-70 mm', '70+ mm'],
    packagingOptions: [
      '10 kg Corrugated Carton Box',
      '10 kg / 25 kg Polypropylene Bags',
      '6 kg Open-Top Carton Box'
    ],
    season: {
      startMonth: 'February',
      endMonth: 'August',
      peakMonths: ['March', 'April', 'May', 'June']
    },
    exportWindow: 'Fresh Green Garlic: Feb–Apr | Cured Dry Garlic: Apr–Aug',
    storageConditions: '-1.0°C to +0.0°C with 65-70% Relative Humidity (Dry Reefer setting to prevent sprouting).',
    MOQ: '1 Forty-Foot Reefer Container (Approx. 24-26 Metric Tons)',
    moq: '1 Forty-Foot Reefer Container (Approx. 24-26 Metric Tons)',
    loadingMethod: '40ft High-Cube Reefer Container (20 Pallets)',
    hsCode: '070320',
    exportCertificationsAvailable: ['Phytosanitary Certificate (CAPQ per batch)', 'GlobalGAP', 'Certificate of Origin'],
    images: [
      '/crops/garlic.jpg'
    ],
    specificationSheet: {
      pdfName: 'AVIALINK_Spec_Garlic.pdf',
      lastUpdated: '2026-09-01',
      details: [
        { label: 'Crop Origin', value: 'Egypt' },
        { label: 'Varieties', value: 'Baladi White & Purple' },
        { label: 'Seasonality', value: 'February – August' },
        { label: 'Aroma & Taste', value: 'Intense Pungent Natural Flavor' },
        { label: 'Temperature Control', value: '-1°C to 0°C (Dry Reefer 65-70% RH)' }
      ]
    }
  },
  {
    id: 'prod-colored-peppers',
    name: 'الفلفل الألوان المصري الفاخر',
    nameEn: 'Egyptian Premium Colored Bell Peppers',
    slug: 'colored-bell-peppers',
    category: 'Vegetables',
    shortDescription: 'فلفل ألوان مصري طازج ومقرمش عالي الجودة (أحمر، أصفر، برتقالي) مزروع تحت البيوت المحمية الحديثة والتحكم الكامل في المناخ، يمتاز بجدران سميكة وعمر تخزيني ممتد للشحن المبرد للأسواق العالمية.',
    origin: 'مصر (الصوب الزراعية الحديثة - الإسماعيلية والنوبارية)',
    varieties: ['Red Blocky', 'Yellow Blocky', 'Orange Blocky'],
    grades: ['Class I Export Standard', 'Extra Grade'],
    sizes: ['G (80-90 mm)', 'GG (90-100 mm)', '180g - 250g', '250g+'],
    packagingOptions: [
      '5 kg Net Telescopic Export Carton',
      'Traffic Light Flow-pack (3 pcs)',
      'Plastic Crates 6 kg'
    ],
    season: {
      startMonth: 'November',
      endMonth: 'May',
      peakMonths: ['December', 'January', 'February', 'March', 'April']
    },
    exportWindow: 'November – May (نوفمبر - مايو)',
    storageConditions: '+7.0°C to +8.5°C with 90-95% Relative Humidity. Ethylene sensitive.',
    MOQ: '1 Forty-Foot Reefer Container (Approx. 12-14 Metric Tons)',
    moq: '1 Forty-Foot Reefer Container (Approx. 12-14 Metric Tons)',
    loadingMethod: '40ft High-Cube Reefer Container (20 Pallets, approx. 2,400 to 2,600 cartons)',
    hsCode: '070960',
    exportCertificationsAvailable: ['GlobalGAP (Farm Protocol)', 'Phytosanitary Certificate (CAPQ)', 'Certificate of Origin'],
    heroImage: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=1200'
    ],
    specificationSheet: {
      pdfName: 'AVIALINK_Spec_Colored_Bell_Peppers.pdf',
      lastUpdated: '2026-09-01',
      details: [
        { label: 'Crop Origin', value: 'Egypt (Protected Modern Greenhouses)' },
        { label: 'Primary Varieties', value: 'Red Blocky, Yellow Blocky & Orange Blocky' },
        { label: 'Wall Thickness', value: '6.5mm – 8.0mm Heavy & Crunchy Walls' },
        { label: 'Temperature Control', value: '+7.5°C Controlled Atmosphere Reefer' },
        { label: 'Relative Humidity', value: '90% – 95% RH' },
        { label: 'Pesticide Residue', value: 'Strict EU & Global MRL Standards' },
        { label: 'Export Window', value: 'November through May' }
      ]
    }
  }
];


