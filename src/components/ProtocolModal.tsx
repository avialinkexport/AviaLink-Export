import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Thermometer, 
  Clock, 
  Sparkles, 
  Send, 
  FileText, 
  CheckCircle2, 
  Award, 
  ArrowRight, 
  ArrowLeft,
  Eye,
  Scale,
  Download,
  AlertCircle
} from 'lucide-react';
import { Language } from '../lib/i18n';
import { DynamicProtocolItem } from '../types';

export interface ProtocolData {
  id: string;
  cropKey: string;
  cropName: string;
  cropNameEn: string;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  standards: string[];
  parameters: {
    label: string;
    value: string;
    note?: string;
  }[];
  phases: {
    phase: string;
    title: string;
    description: string;
  }[];
  verifications: string[];
  criticalLimit: string;
}

const PROTOCOLS_DATA: Record<Language, ProtocolData[]> = {
  ar: [
    {
      id: 'curing-protocol',
      cropKey: 'sweet-potatoes',
      cropName: 'البطاطا الحلوة المصرية (بيورجارد وبيليفيو)',
      cropNameEn: 'Egyptian Sweet Potatoes (Beauregard & Bellevue)',
      image: '/crops/sweet_potatoes.jpg',
      badge: 'بروتوكول المعالجة الحرارية والتئام القشرة (CURING PROTOCOL)',
      title: 'بروتوكول المعالجة الحرارية المعتمد للبطاطا الحلوة',
      subtitle: 'المعيار العلمي الإلزامي لتأهيل حبات البطاطا للشحن البحري الطويل، وإكسابها نسبة السكر المثالية وحماية القشرة من التلف.',
      standards: ['GlobalGAP Compliant', 'CAPQ Phytosanitary Protocol', 'ISO 22000 Packhouse Certified'],
      parameters: [
        { label: 'درجة حرارة المعالجة (Curing Temp)', value: '13.5°C ± 0.5°C', note: 'ثابتة ومسجلة بحساسات دقيقة' },
        { label: 'الرطوبة النسبية (Relative Humidity)', value: '85% - 90% RH', note: 'ترطيب بالضباب الدقيق' },
        { label: 'مدة المعالجة الموصى بها', value: '5 إلى 7 أيام متواصلة', note: 'حسب توقيت الحصاد' },
        { label: 'التهوية وتجديد الهواء', value: 'CO₂ < 2,500 ppm', note: 'طرد الغازات الحيوية دورياً' },
        { label: 'درجة حرارة الشحن البحري', value: '+13.5°C في الحاوية المبردة', note: 'حظر التبريد تحت +12°C تماماً' },
        { label: 'نسبة الفاقد المسموح به', value: '< 0.5% تلف قشري', note: 'مطابقة لمواصفات السوبرماركت الأوروبي' }
      ],
      phases: [
        {
          phase: 'المرحلة 01',
          title: 'الحصاد الحذِر والنقل الأولي',
          description: 'جمع يدوي فوري في صناديق حقلية بلاستيكية مبطنة مع تجنب الخدوش أو الارتطام بالتربة، ونقل سريع للمحطة خلال 4 ساعات من القلع.'
        },
        {
          phase: 'المرحلة 02',
          title: 'المعالجة الحرارية (Suberization)',
          description: 'إدخال الصناديق لغرف العزل الحراري عند 13.5°م ورطوبة 90% لتحفيز نمو طبقة الفلين الواقية (Suberin) على أي جروح سطحية وتركيز السكريات الطبيعية.'
        },
        {
          phase: 'المرحلة 03',
          title: 'الغسيل بالماء المعقم والتلميع',
          description: 'تمرير المحصول عبر خط مائي بفرش دوارة ناعمة وتجفيف فوري بهواء دافئ معقم، لضمان مظهر برتقالي لامع ونظيف.'
        },
        {
          phase: 'المرحلة 04',
          title: 'الفرز الإلكتروني والتعبئة في كراتين التصدير',
          description: 'معايرة الأحجام S, M, L1, L2, XL بدقة وتعبئة في كراتين تلسكوبية 6 كجم أو 10 كجم ووضعها على باليتات مدخنة مطابقة لمعيار ISPM-15.'
        }
      ],
      verifications: [
        'فحص خلو كامل من أعفان التربة وحشرات السوس',
        'شهادة مطابقة المتبقيات MRL المعتمدة من المعمل المركزي لتحليل متبقيات المبيدات',
        'شهادة الحجر الزراعي المصري CAPQ قبل مغادرة المحطة لميناء الإسكندرية / دمياط'
      ],
      criticalLimit: 'تحذير تشغيلي حرج: البطاطا الحلوة حساسة لبرودة الشتاء؛ أي انخفاض تحت +12°C يسبب تلون اللب الداخلي والتلف الفيزيولوجي (Chilling Injury).'
    },
    {
      id: 'onions-sorting-protocol',
      cropKey: 'onions',
      cropName: 'البصل المصري الجاف (الأحمر والذهبي)',
      cropNameEn: 'Egyptian Fresh Onions (Red & Golden Giza)',
      image: '/crops/onions.jpg',
      badge: 'بروتوكول الفرز الضوئي والتدريج الوزني للبصل',
      title: 'بروتوكول التجفيف والفرز الإلكتروني المتقدم للبصل',
      subtitle: 'تقنيات الفرز بكاميرات 360 درجة والوزن فائق الدقة لضمان صلابة القشور وخلو البصل من الأعفان والازدواج.',
      standards: ['EU Class I Standard', 'ISO 22000 Packhouse', 'Continuous Weight Verification'],
      parameters: [
        { label: 'سرعة الفحص البصري', value: '25 حبة / ثانية / مسار', note: 'كاميرات رقمية متعددة الأطياف' },
        { label: 'دقة الوزن الإلكتروني', value: '± 1.0 جرام', note: 'خلايا وزن ديناميكية ألمانية' },
        { label: 'معايرة الأقطار القياسية', value: '40-60، 50-70، 60-80، 70-90 مم', note: 'تدريج دقيق حسب طلب العميل' },
        { label: 'نسبة المادة الجافة', value: '> 14.5% Dry Matter', note: 'صلابة ممتازة لتخزين ممتد' },
        { label: 'سلسلة التبريد أو الشحن', value: '+0.0°C إلى +2.0°C أو جاف مهوى', note: 'رطوبة منخفضة 65-70% لمنع التزريع' },
        { label: 'طبقات القشرة الورقية', value: '2 إلى 3 طبقات جافة متماسكة', note: 'حماية كاملة من الرطوبة الخارجية' }
      ],
      phases: [
        {
          phase: 'المرحلة 01',
          title: 'التجفيف الطبيعي في الحقل (Field Curing)',
          description: 'تجفيف هوائي وشمسى تحت مظلات الحقل لمدة 10 إلى 15 يوماً لغلق العنق بالكامل وتصلب القشرة الخارجية وتحولها للون الذهبي أو القرمزي الداكن.'
        },
        {
          phase: 'المرحلة 02',
          title: 'قص الأعناق وإزالة الشوائب',
          description: 'قص ميكانيكي للعنق بطول 2-3 سم لمنع دخول الفطريات، وشفط الأتربة والقشور الزائدة بواسطة مضخات هواء قوية.'
        },
        {
          phase: 'المرحلة 03',
          title: 'الفحص البصري التلقائي (360° Vision)',
          description: 'تصوير كل حبة بصل من جميع الزوايا لاكتشاف الرؤوس المزدوجة، حروق الشمس، والعيوب الغائرة واستبعادها آلياً.'
        },
        {
          phase: 'المرحلة 04',
          title: 'التعبئة في الأجولة الشبكية المقاومة للأشعة فوق البنفسجية',
          description: 'تعبئة في شِباك 10 كجم أو 25 كجم مهواة بألوان متناسقة مع حياكة آلية قوية وتحميل آمن داخل الحاويات.'
        }
      ],
      verifications: [
        'خلو تام من عفن الرقبة البوتريتس (Botrytis Neck Rot)',
        'فحص جفاف العنق بنسبة 100% وعدم وجود أي رطوبة متبقية',
        'تأمين حاويات مبردة جافة (Dehumidified Reefers) للشحنات البحرية التي تتجاوز 14 يوماً'
      ],
      criticalLimit: 'تحذير تشغيلي حرج: ممنوع شحن البصل في حاويات عالية الرطوبة (>75% RH) لتفادي ظهور العفن الأسود أو انبعاث الجذور أثناء الإبحار.'
    },
    {
      id: 'carrots-hydro-cooling-protocol',
      cropKey: 'carrots',
      cropName: 'الجزر المصري المغسول والمبرد هيدروليكياً',
      cropNameEn: 'Egyptian Hydro-Cooled Washed Carrots & Beetroot',
      image: '/crops/carrots.jpg',
      badge: 'بروتوكول التبريد المائي الفجائي (HYDRO-COOLING PROTOCOL)',
      title: 'بروتوكول التبريد المائي الفجائي والغسيل الميكانيكي للجزر',
      subtitle: 'المنظومة المتطورة لخفض حرارة لب الجزر من +28°م إلى +1.0°م في أقل من 15 دقيقة للحفاظ على النضارة ومنع التكسر أثناء الشحن البحري.',
      standards: ['GlobalGAP Accredited', 'EU MRL Certified', 'ISO 22000 Packhouse'],
      parameters: [
        { label: 'حرارة مياه التبريد الهيدروليكي', value: '+0.5°C إلى +1.0°C', note: 'مياه معقمة بالأوزون والكلور' },
        { label: 'زمن الدورة داخل الهيدروكولر', value: '12 إلى 15 دقيقة متصلة', note: 'نزول حرارة اللب لأقل من +2°م' },
        { label: 'نسبة الرطوبة النسبية للشحن', value: '95% إلى 98% RH', note: 'أكياس بولي إيثيلين مثقبة دقيقة' },
        { label: 'حرارة الحاوية المبردة (Reefer)', value: '+0.5°C ثابتة', note: 'سلسلة تبريد متصلة 24/7' },
        { label: 'نسبة المادة الصلبة والبريكس', value: '8.5° إلى 10.5° بريكس', note: 'حلاوة طبيعية ولون برتقالي زاهٍ' },
        { label: 'الفحص الميكروبيولوجي', value: 'خلو تام من الملوثات', note: 'شهادة مطابقة رسمية مع كل شحنة' }
      ],
      phases: [
        {
          phase: 'المرحلة 01',
          title: 'الغسيل الميكانيكي الأسطواني والتلميع',
          description: 'غسيل بالفرش الدوارة وتيار مائي نفاث لإزالة الرواسب الطينية وإبراز الملمس الأملس واللون البرتقالي اللامع دون تجريح القشرة.'
        },
        {
          phase: 'المرحلة 02',
          title: 'الصدمة الحرارية المائية (Hydro-Cooling)',
          description: 'تمرير الجزر داخل دش من المياه المثلجة عند +0.5°م لخفض الحرارة الحقلية سريعاً وإيقاف عملية التنفس الخلوي.'
        },
        {
          phase: 'المرحلة 03',
          title: 'الفرز البصري والليزر والتدريج الحجمي',
          description: 'استبعاد الثمار المكسورة أو المتفرعة آلياً وتدريج الحجم إلى أصناف تصديرية موحدة M (18-24سم) و L (24-30سم).'
        },
        {
          phase: 'المرحلة 04',
          title: 'التعبئة في أكياس ميكروبيرفوريتيد والكرتون التلسكوبي',
          description: 'تعبئة في أكياس مهواة دقيقة 1 كجم أو كرتون تصدير 5 و 10 كجم وتحميل فوري داخل الحاويات المبردة.'
        }
      ],
      verifications: [
        'فحص حرارة لب الثمار عند التحميل للتأكد من ثباتها عند +1.0°م',
        'شهادة رسمية مطابقة لشروط الحجر الزراعي والمواصفات الأوروبية والخليجية',
        'فحص ظاهري لخلو الشحنة من الانحناءات أو التشوهات الحقلية'
      ],
      criticalLimit: 'تحذير تشغيلي حرج: ممنوع تخزين أو شحن الجزر مع محاصيل مفرزة لغاز الإيثيلين مثل التفاح لتفادي تكون الطعم المر (Iso-coumarin).'
    },
    {
      id: 'garlic-curing-protocol',
      cropKey: 'garlic',
      cropName: 'الثوم المصري البلدي والصيني الفاخر',
      cropNameEn: 'Egyptian Dry Garlic Curing & Grading Protocol',
      image: '/crops/garlic.jpg',
      badge: 'بروتوكول التجفيف والتدريج والتصدير (DRY GARLIC EXPORT PROTOCOL)',
      title: 'بروتوكول التجفيف الحرفي والفرز الآلي للثوم المصري',
      subtitle: 'المعايير المعتمدة لضمان جفاف العنق وتصلب القشور الخارجية وحماية الفصوص من الرطوبة والعفن لتصدير ممتد الصلاحية لموانئ أوروبا والخليج.',
      standards: ['GlobalGAP Audit', 'CAPQ Phytosanitary Approved', 'ISO 22000 Certified'],
      parameters: [
        { label: 'رطوبة القشرة المستهدفة', value: '< 10% رطوبة سطحية', note: 'قشور خارجية جافة ورقية بيضاء/أرجوانية' },
        { label: 'حرارة الحاوية للشحن الطويل', value: '-1.0°C إلى 0.0°C', note: 'رطوبة نسبية جافة 65-70% لمنع التزريع' },
        { label: 'كثافة الفصوص والصلابة', value: '100% فصوص ممتلئة وصلبة', note: 'بدون أي فصوص فارغة أو ضامرة' },
        { label: 'أقطار الرؤوس القياسية', value: '45-55مم، 55-65مم، 65مم+', note: 'تدريج آلي دقيق' },
        { label: 'طول العنق المقصوص', value: '2 إلى 3 سم كحد أقصى', note: 'قص نظيف وجاف' },
        { label: 'فحص الحجر الزراعي', value: 'خلو تام من ديدان الساق ونيماتودا', note: 'فحص معملي دقيق لكل لوط' }
      ],
      phases: [
        {
          phase: 'المرحلة 01',
          title: 'التجفيف الشمسي والتهوية الحقلية المحكومة',
          description: 'تجفيف هوائي للرؤوس تحت مظلات الحقل لعدة أسابيع لضمان جفاف تام للعنق وتحول القشور إلى طبقات حماية جافة.'
        },
        {
          phase: 'المرحلة 02',
          title: 'القص والتشذيب وإزالة الجذور',
          description: 'قص العنق وتنظيف الشعيرات الجذرية يدوياً وآلياً وإزالة الأتربة والقشور الزائدة بتيارات هواء مضغوطة.'
        },
        {
          phase: 'المرحلة 03',
          title: 'التدريج الحجمي والفحص بالأشعة البصرية',
          description: 'فرز الرؤوس حسب القطر بدقة ملليمترية واستبعاد أي رؤوس مصابة برطوبة أو تلف.'
        },
        {
          phase: 'المرحلة 04',
          title: 'التعبئة في الأكياس الشبكية والكرتون المهوى',
          description: 'تعبئة في أكياس شبكية 5 أو 10 كجم أو كرتون 10 كجم مهوى وتحميل داخل حاويات مبردة جافة.'
        }
      ],
      verifications: [
        'شهادة الحجر الزراعي المصري CAPQ بخلو تام من نيماتودا الساق Ditylenchus dipsaci',
        'فحص نسبة الجفاف الداخلي والمادة الصلبة',
        'مراقبة الرطوبة النسبية داخل الحاويات لضمان عدم تجاوز 70% RH'
      ],
      criticalLimit: 'تحذير تشغيلي حرج: ممنوع تخزين أو شحن الثوم في بيئة عالية الرطوبة (>75%) أو حرارة بين +4°م و +10°م لتفادي تنشيط سكون البراعم وانبعاث النموات الخضراء.'
    }
  ],
  en: [
    {
      id: 'curing-protocol',
      cropKey: 'sweet-potatoes',
      cropName: 'Egyptian Premium Sweet Potatoes (Beauregard & Bellevue)',
      cropNameEn: 'Egyptian Sweet Potatoes (Beauregard & Bellevue)',
      image: '/crops/sweet_potatoes.jpg',
      badge: 'THERMAL HEALING & CURING PROTOCOL',
      title: 'Certified Curing & Post-Harvest Protocol for Sweet Potatoes',
      subtitle: 'The mandatory scientific standard to prepare sweet potatoes for long maritime transit, optimizing natural sweetness and curing skin abrasions.',
      standards: ['GlobalGAP Compliant', 'CAPQ Phytosanitary Protocol', 'ISO 22000 Packhouse Certified'],
      parameters: [
        { label: 'Curing Temperature', value: '13.5°C ± 0.5°C', note: 'Logged continuously with calibrated probes' },
        { label: 'Relative Humidity', value: '85% - 90% RH', note: 'Micro-fog ultrasonic humidification' },
        { label: 'Duration', value: '5 to 7 consecutive days', note: 'Determined by harvest window' },
        { label: 'Air Ventilation', value: 'CO₂ < 2,500 ppm', note: 'Periodic automated gas exhaust' },
        { label: 'Transit Reefer Setpoint', value: '+13.5°C in reefer', note: 'Strictly avoid storage below +12°C' },
        { label: 'Skin Defect Allowance', value: '< 0.5% skin defect', note: 'Meets European retail standards' }
      ],
      phases: [
        {
          phase: 'Phase 01',
          title: 'Gentle In-Field Harvest & Transfer',
          description: 'Immediate hand picking into lined plastic harvest crates avoiding soil abrasion, transferred to the packhouse within 4 hours.'
        },
        {
          phase: 'Phase 02',
          title: 'Suberization & Thermal Curing',
          description: 'Crates placed inside climate chambers at 13.5°C and 90% RH to trigger suberin formation on harvest wounds and enhance sugar density.'
        },
        {
          phase: 'Phase 03',
          title: 'Sanitized Water Washing & Polishing',
          description: 'Produce passes through soft brush washing lines and dries under sterile warm airflow, revealing vibrant, clean orange skin.'
        },
        {
          phase: 'Phase 04',
          title: 'Electronic Sizing & Carton Packing',
          description: 'Precision weight sizing into S, M, L1, L2, XL grades packed into 6kg or 10kg telescopic cartons palletized on heat-treated ISPM-15 pallets.'
        }
      ],
      verifications: [
        'Zero soil rots or weevil infestation verified per carton batch',
        'MRL multi-residue pesticide test certified by official laboratories',
        'Egyptian Agricultural Quarantine (CAPQ) clearance prior to port dispatch'
      ],
      criticalLimit: 'Critical Control Point: Sweet potatoes are chilling-sensitive. Exposure below +12°C leads to internal flesh breakdown and chilling injury.'
    },
    {
      id: 'onions-sorting-protocol',
      cropKey: 'onions',
      cropName: 'Egyptian Dry Onions (Red & Golden Giza)',
      cropNameEn: 'Egyptian Fresh Onions (Red & Golden Giza)',
      image: '/crops/onions.jpg',
      badge: 'OPTICAL & DYNAMIC WEIGHT SORTING PROTOCOL',
      title: 'Advanced Optical Grading & Weight Sizing for Egyptian Onions',
      subtitle: 'High-speed 360° computer vision inspection and load-cell calibration ensuring multi-layer skin retention and complete absence of defects.',
      standards: ['EU Class I Standard', 'ISO 22000 Packhouse', 'Continuous Weight Verification'],
      parameters: [
        { label: 'Vision Inspection Speed', value: '25 bulbs / sec / lane', note: 'Multi-spectral HD cameras' },
        { label: 'Weight Cell Accuracy', value: '± 1.0 g', note: 'Dynamic German load cells' },
        { label: 'Caliber Calibration', value: '40-60, 50-70, 60-80, 70-90 mm', note: 'Calibrated to buyer specification' },
        { label: 'Dry Matter Solids', value: '> 14.5% Dry Matter', note: 'High solidity for extended storage' },
        { label: 'Transit Environment', value: '+0.0°C to +2.0°C or dry air', note: 'Low RH 65-70% to inhibit sprouting' },
        { label: 'Papery Skin Layers', value: '2 to 3 intact dry layers', note: 'Protection against maritime moisture' }
      ],
      phases: [
        {
          phase: 'Phase 01',
          title: 'Natural In-Field Windrow Curing',
          description: 'Windrow drying under shaded fields for 10-15 days to completely close the neck and cure outer skins into rich gold or crimson.'
        },
        {
          phase: 'Phase 02',
          title: 'Mechanical Topping & De-Dusting',
          description: 'Precision mechanical topping leaving 2-3 cm neck to seal entry vectors, followed by high-velocity pneumatic blowers to remove loose soil.'
        },
        {
          phase: 'Phase 03',
          title: '360° Computer Vision Inspection',
          description: 'Each bulb rotated and scanned for double necks, sunscald, internal rot, and mechanical blemishes with automated reject gates.'
        },
        {
          phase: 'Phase 04',
          title: 'UV-Stabilized Mesh Bag Packaging',
          description: 'Bagging into 10kg or 25kg ventilated UV-treated mesh sacks, automatically stitched with batch traceability codes.'
        }
      ],
      verifications: [
        'Zero tolerance for Botrytis neck rot or wet breakdown',
        '100% cured neck verification before loading',
        'Dehumidified reefer container configuration for voyages exceeding 14 days'
      ],
      criticalLimit: 'Critical Control Point: Onions must never be loaded into high-humidity containers (>75% RH) to prevent black mold and root growth.'
    },
    {
      id: 'carrots-hydro-cooling-protocol',
      cropKey: 'carrots',
      cropName: 'Egyptian Hydro-Cooled Washed Carrots & Beetroot',
      cropNameEn: 'Egyptian Hydro-Cooled Washed Carrots & Beetroot',
      image: '/crops/carrots.jpg',
      badge: 'HYDRO-COOLING & SANITIZATION PROTOCOL',
      title: 'Hydro-Cooling & Mechanical Washing Protocol for Carrots & Beetroot',
      subtitle: 'Advanced forced-water chilling reducing core temperature from +28°C to +1.0°C within 15 minutes to guarantee crispness and extend shelf life.',
      standards: ['GlobalGAP Accredited', 'EU MRL Certified', 'ISO 22000 Packhouse'],
      parameters: [
        { label: 'Hydro-Cooling Water Temp', value: '+0.5°C to +1.0°C', note: 'Ozone-sanitized circulating water' },
        { label: 'Cycle Duration in Chiller', value: '12 to 15 continuous minutes', note: 'Core pulp reaches < +2.0°C' },
        { label: 'Relative Humidity Target', value: '95% to 98% RH', note: 'Micro-perforated liners' },
        { label: 'Reefer Container Temp', value: '+0.5°C constant', note: 'Unbroken cold-chain transit' },
        { label: 'Soluble Solids & Brix', value: '8.5° to 10.5° Brix', note: 'Rich sweetness and uniform color' },
        { label: 'Microbiological Analysis', value: 'Zero pathogens / E. coli / Listeria', note: 'Lab certified per batch' }
      ],
      phases: [
        {
          phase: 'Phase 01',
          title: 'Rotary Brush Washing & Polishing',
          description: 'High-pressure water jets and counter-rotating brushes cleanse clay deposits without abrading epidermal skin.'
        },
        {
          phase: 'Phase 02',
          title: 'Hydro-Cooling Thermal Shock',
          description: 'Submerging produce through chilled sanitized cascades at +0.5°C, arresting cellular respiration instantaneously.'
        },
        {
          phase: 'Phase 03',
          title: 'Laser Optical Sorting & Caliber Sizing',
          description: 'Defective or curved roots are automatically culled, sorting uniform export sizes (M: 18-24cm, L: 24-30cm).'
        },
        {
          phase: 'Phase 04',
          title: 'Micro-Perforated Bagging & Carton Stacking',
          description: 'Packing into 1kg retail bags or 5kg/10kg heavy-duty telescopic cartons with immediate reefer stuffing.'
        }
      ],
      verifications: [
        'Core pulp temperature log verifying +1.0°C at container sealing',
        'Official phytosanitary certificate complying with EU and GCC quarantine regulations',
        'Optical inspection confirming zero mechanical damage or blemishes'
      ],
      criticalLimit: 'Critical Control Point: Carrots must never be co-stored or co-shipped with ethylene-emitting fruits (e.g. apples) to prevent formation of bitter isocoumarins.'
    },
    {
      id: 'garlic-curing-protocol',
      cropKey: 'garlic',
      cropName: 'Egyptian Dry Garlic Curing & Grading Protocol',
      cropNameEn: 'Egyptian Dry Garlic Curing & Grading Protocol',
      image: '/crops/garlic.jpg',
      badge: 'DRY GARLIC EXPORT & CURING PROTOCOL',
      title: 'Artisanal Field Curing & Automated Grading Protocol for Egyptian Garlic',
      subtitle: 'Rigorous curing and sizing specifications ensuring complete neck dry-down and firm cloves for transatlantic and GCC voyages.',
      standards: ['GlobalGAP Audit', 'CAPQ Phytosanitary Approved', 'ISO 22000 Certified'],
      parameters: [
        { label: 'Target Skin Moisture', value: '< 10% surface humidity', note: 'Papery white/purple dry tunics' },
        { label: 'Transit Reefer Temp', value: '-1.0°C to 0.0°C', note: 'Dry 65-70% RH preventing shoot sprouting' },
        { label: 'Clove Firmness & Density', value: '100% full, firm cloves', note: 'Zero hollow or shriveled cloves' },
        { label: 'Standard Caliber Sizes', value: '45-55mm, 55-65mm, 65mm+', note: 'Calibrated mechanical grading' },
        { label: 'Trimmed Stem Length', value: '2 to 3 cm maximum', note: 'Clean, dry cut' },
        { label: 'Quarantine Stem Nematode Test', value: 'Certified free (Ditylenchus dipsaci)', note: 'Official CAPQ lab test' }
      ],
      phases: [
        {
          phase: 'Phase 01',
          title: 'Field Shade Curing & Dehydration',
          description: 'Bulbs are naturally cured under ventilated covers for several weeks until the neck seals completely.'
        },
        {
          phase: 'Phase 02',
          title: 'Stem Trimming & Root Brushing',
          description: 'Roots and stalks are trimmed, and outer soiled husks removed using controlled compressed-air systems.'
        },
        {
          phase: 'Phase 03',
          title: 'Mechanical Diameter Grading',
          description: 'Sizing rings classify bulbs into millimeter-precise tiers with simultaneous manual visual inspection.'
        },
        {
          phase: 'Phase 04',
          title: 'Mesh Bagging & Ventilated Carton Pack',
          description: 'Packaging into 5kg/10kg red raschel mesh sacks or 10kg telescopic cartons for immediate dry container loading.'
        }
      ],
      verifications: [
        'CAPQ phytosanitary certificate confirming freedom from stem nematodes and fungal spores',
        'Dry matter content and moisture percentage test report',
        'Continuous container humidity monitoring below 70% RH'
      ],
      criticalLimit: 'Critical Control Point: Garlic must never be held in warm humid conditions (+4°C to +10°C, >75% RH) which break dormancy and trigger internal green sprout emergence.'
    }
  ],
  fr: [],
  es: [],
  de: [],
  ru: []
};

// Fallback to English for French, Spanish, German, Russian if needed, but with French/Spanish/German/Russian headers
const getProtocolsForLang = (langInput: Language | string): ProtocolData[] => {
  const safeLang = (typeof langInput === 'string' && langInput in PROTOCOLS_DATA ? langInput : 'en') as Language;
  if (PROTOCOLS_DATA[safeLang] && PROTOCOLS_DATA[safeLang].length > 0) {
    return PROTOCOLS_DATA[safeLang];
  }
  return PROTOCOLS_DATA.en;
};

interface ProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyIndex: number | null;
  lang: Language;
  onOpenRFQ: (cropName?: string) => void;
  dynamicProtocols?: DynamicProtocolItem[];
}

export const ProtocolModal: React.FC<ProtocolModalProps> = ({
  isOpen,
  onClose,
  storyIndex,
  lang = 'ar',
  onOpenRFQ,
  dynamicProtocols
}) => {
  if (!isOpen || storyIndex === null) return null;

  const protocols = getProtocolsForLang(lang);
  const isRtl = lang === 'ar';
  
  const rawData = (dynamicProtocols && dynamicProtocols[storyIndex])
    ? {
        id: dynamicProtocols[storyIndex].id,
        cropKey: dynamicProtocols[storyIndex].cropKey,
        cropName: isRtl ? dynamicProtocols[storyIndex].cropName : (dynamicProtocols[storyIndex].cropNameEn || dynamicProtocols[storyIndex].cropName),
        cropNameEn: dynamicProtocols[storyIndex].cropNameEn || dynamicProtocols[storyIndex].cropName,
        image: dynamicProtocols[storyIndex].image || '/crops/sweet_potatoes.jpg',
        badge: isRtl ? dynamicProtocols[storyIndex].badge : (dynamicProtocols[storyIndex].badgeEn || dynamicProtocols[storyIndex].badge),
        title: isRtl ? dynamicProtocols[storyIndex].title : (dynamicProtocols[storyIndex].titleEn || dynamicProtocols[storyIndex].title),
        subtitle: isRtl ? dynamicProtocols[storyIndex].subtitle : (dynamicProtocols[storyIndex].subtitleEn || dynamicProtocols[storyIndex].subtitle),
        standards: dynamicProtocols[storyIndex].standards || [],
        parameters: dynamicProtocols[storyIndex].parameters || [],
        phases: (dynamicProtocols[storyIndex].phases || []).map((ph) => ({
          phase: ph.phase,
          title: isRtl ? ph.title : (ph.titleEn || ph.title),
          description: isRtl ? (ph.description || ph.desc || '') : (ph.descriptionEn || ph.descEn || ph.description || ph.desc || '')
        })),
        verifications: dynamicProtocols[storyIndex].verifications || [],
        criticalLimit: isRtl ? dynamicProtocols[storyIndex].criticalLimit : (dynamicProtocols[storyIndex].criticalLimitEn || dynamicProtocols[storyIndex].criticalLimit),
      }
    : (protocols[storyIndex] || protocols[0]);

  const data: ProtocolData = rawData as any;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleDownloadSpecs = () => {
    // Generate technical specs print or text download
    const content = `AVIALINK TECHNICAL QUALITY PROTOCOL SPECIFICATION
Product: ${data.cropName} (${data.cropNameEn})
Protocol: ${data.title}
Badge: ${data.badge}
Standards: ${data.standards.join(' | ')}
Key Parameters:
${data.parameters.map((p) => `- ${p.label}: ${p.value} (${p.note || ''})`).join('\n')}

Operational Phases:
${data.phases.map((ph) => `[${ph.phase}] ${ph.title}: ${ph.description}`).join('\n\n')}

Quality & Quarantine Verifications:
${data.verifications.map((v) => `* ${v}`).join('\n')}

Critical Limits & Warnings:
${data.criticalLimit}

AVIALINK AGRICULTURAL EXPORT GROUP
Cairo - Alexandria - Rotterdam - Jeddah
Official Portal: https://avialink.com
Phytosanitary Protocol Verified`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AVIALINK_Protocol_${data.cropKey}_2026.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRFQClick = () => {
    onClose();
    onOpenRFQ(data.cropName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto animate-scale-up text-white flex flex-col max-h-[92vh]">
        
        {/* Modal Header Panoramic with Real Product Image */}
        <div className="relative min-h-[200px] sm:min-h-[230px] p-6 sm:p-8 flex flex-col justify-end overflow-hidden shrink-0">
          <div className="absolute inset-0 z-0">
            <img 
              src={data.image} 
              alt={data.cropName} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-[#0F2133]/40" />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Content */}
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E0C078] text-[11px] font-bold tracking-wider uppercase backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{data.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {data.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {data.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {data.standards.map((std, i) => (
                <span 
                  key={i} 
                  className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-slate-900/90 border border-white/10 text-emerald-400"
                >
                  ✓ {std}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
          
          {/* Key Parameters Cards Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#E0C078] flex items-center gap-2 uppercase tracking-wider">
              <Thermometer className="w-4 h-4 text-[#C5A059]" />
              <span>{lang === 'ar' ? 'المعايير التشغيلية والفيزيائية المعتمدة' : 'Certified Operational & Physical Parameters'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {data.parameters.map((param, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-[#C5A059]/50 transition-colors"
                >
                  <span className="text-[11px] font-medium text-slate-400 block mb-1">
                    {param.label}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white block">
                    {param.value}
                  </span>
                  {param.note && (
                    <span className="text-[10px] text-[#C5A059] block mt-1">
                      {param.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sequential Phases Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#E0C078] flex items-center gap-2 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-[#C5A059]" />
              <span>{lang === 'ar' ? 'مراحل تنفيذ البروتوكول خطوة بخطوة' : 'Step-by-Step Protocol Execution Phases'}</span>
            </h3>

            <div className="space-y-3">
              {data.phases.map((ph, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3.5"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-xs font-bold text-[#E0C078] shrink-0 mt-0.5">
                    0{idx + 1}
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">
                      {ph.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {ph.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quarantine & Verification List */}
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'فحوصات الجودة والاعتماد الحجري' : 'Phytosanitary Verification & Quality Audits'}</span>
            </h4>
            <div className="space-y-2">
              {data.verifications.map((v, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Threshold Warning */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-300 text-xs leading-relaxed">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <span>{data.criticalLimit}</span>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          <button
            onClick={handleDownloadSpecs}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#C5A059]" />
            <span>{lang === 'ar' ? 'تنزيل وثيقة البروتوكول والمواصفات' : 'Download Certified Protocol Specs'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition-colors"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>

            <button
              onClick={handleRFQClick}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#d8b368] text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-[#C5A059]/20 transition-all cursor-pointer hover:scale-105"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'ar' ? 'طلب عرض سعر مع هذا البروتوكول (RFQ)' : 'Request RFQ with this Protocol'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
