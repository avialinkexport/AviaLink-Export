import { SiteContent } from '../types';

export const defaultSiteContent: SiteContent = {
  announcement: {
    enabled: true,
    badge: 'معارض وفعاليات 2026',
    badgeEn: 'Exhibitions 2026',
    text: 'أفيا لينك تشارك في معرض Fruit Logistica برلين وGulfood دبي - ندعوكم لزيارة جناحنا وتوقيع بروتوكولات التوريد الموسمية',
    textEn: 'AviaLink is exhibiting at Fruit Logistica Berlin & Gulfood Dubai - Visit our booth and secure seasonal export contracts',
    linkText: 'حجز موعد في المعرض',
    linkTextEn: 'Book a Meeting',
    linkUrl: '#exhibitions',
    type: 'seasonal'
  },
  exhibitions: [
    {
      id: 'exhibit-01',
      title: 'معرض فروت لوجستيكا الدولي برلين (Fruit Logistica Berlin)',
      titleEn: 'Fruit Logistica Berlin Global Produce Summit',
      date: 'فبراير 2026',
      city: 'برلين',
      country: 'ألمانيا (Germany)',
      standNumber: 'Hall 2.2 / Stand C-14',
      excerpt: 'مشاركة استراتيجية لعرض أحدث خطوط إنتاج وتعبئة البطاطا الحلوة المعالجة حرارياً والبصل الفاخر، وتوقيع عقود التوريد السنوية مع كبرى سلاسل التوزيع الأوروبية.',
      excerptEn: 'Strategic participation presenting advanced curing sweet potatoes and calibrated dry onions, signing seasonal contracts with top European supermarket chains.',
      image: '/crops/sweet_potatoes.jpg',
      category: 'معارض زراعية دولية',
      categoryEn: 'International Trade Show',
      status: 'upcoming',
      externalUrl: 'https://www.fruitlogistica.com'
    },
    {
      id: 'exhibit-02',
      title: 'معرض جلفود للأغذية والضيافة دبي (Gulfood Dubai)',
      titleEn: 'Gulfood Dubai Global Food & Beverage Expo',
      date: 'نوفمبر 2025',
      city: 'دبي',
      country: 'الإمارات العربية المتحدة (UAE)',
      standNumber: 'Zabeel Hall / Stand Z6-B20',
      excerpt: 'لقاءات تجارية رفيعة المستوى مع كبار المستوردين في دول مجلس التعاون الخليجي واستعراض شحنات الثوم المصري الفاخر والبصل الأحمر المعتمد.',
      excerptEn: 'High-level business delegations with Gulf distributors showcasing premium Egyptian garlic and certified red onions under strict cold-chain compliance.',
      image: '/crops/garlic.jpg',
      category: 'أغذية وحاصلات طازجة',
      categoryEn: 'Fresh Produce & Trade',
      status: 'ongoing',
      externalUrl: 'https://www.gulfood.com'
    },
    {
      id: 'exhibit-03',
      title: 'ملتقى الابتكار الزراعي والاستدامة لماكفروت (Macfrut Italy)',
      titleEn: 'Macfrut Italy Fresh Produce Innovation Forum',
      date: 'مايو 2025',
      city: 'ريميني',
      country: 'إيطاليا (Italy)',
      standNumber: 'Pavilion B3 / Stand 045',
      excerpt: 'استعراض تقنيات فرز البصل الذكي بالكاميرات ثلاثية الأبعاد وبروتوكولات المعالجة الحرارية البيولوجية الآمنة الخالية من المبيدات الكيميائية.',
      excerptEn: 'Presenting multi-spectral 360° onion sorting technologies and bio-safe curing protocols compliant with strict EU organic standards.',
      image: '/crops/onions.jpg',
      category: 'ابتكار زراعي واستدامة',
      categoryEn: 'Agri-Tech & Sustainability',
      status: 'completed',
      externalUrl: 'https://www.macfrut.com'
    }
  ],
  figures: [
    {
      id: 'fig-01',
      value: '+45,000 طن',
      valueEn: '+45,000 Tons',
      label: 'حجم التصدير السنوي المعتمد',
      labelEn: 'Annual Export Volume',
      sub: 'محاصيل زراعية طازجة ومصنعة تم تصديرها عالمياً',
      subEn: 'Fresh & processed produce shipped globally',
      iconName: 'TrendingUp'
    },
    {
      id: 'fig-02',
      value: '+35 دولة',
      valueEn: '+35 Countries',
      label: 'وجهة استيرادية عالمية',
      labelEn: 'Export Destination Markets',
      sub: 'في الاتحاد الأوروبي والخليج وبريطانيا والشرق الأقصى',
      subEn: 'Across the EU, Gulf, UK, and Far East',
      iconName: 'Globe2'
    },
    {
      id: 'fig-03',
      value: '99.4%',
      valueEn: '99.4%',
      label: 'نسبة اجتياز الفحص الحجري المعتمد',
      labelEn: 'Phytosanitary Clearance Rate',
      sub: 'خلو كامل من المتبقيات ومطابقة صارمة للمواصفات',
      subEn: 'Zero tolerance for pests with full MRL compliance',
      iconName: 'ShieldCheck'
    },
    {
      id: 'fig-04',
      value: '100%',
      valueEn: '100%',
      label: 'سلسلة تبريد مبردة ومتصلة رقمياً',
      labelEn: 'Monitored Cold Chain Logistics',
      sub: 'تتبع لحظي للحرارة والرطوبة من الحقل حتى ميناء التفريغ',
      subEn: 'Real-time temperature and humidity tracking at sea',
      iconName: 'ThermometerSnowflake'
    }
  ],
  pillars: [
    {
      id: 'pillar-01',
      number: '01',
      title: 'الجودة المطلقة والسلامة الحجرية',
      titleEn: 'Total Quality & Phytosanitary Control',
      subtitle: 'فحص مجهري وتحليل مخبري معتمد لمتبقيات المبيدات (MRL) لكل شحنة دون استثناء.',
      subtitleEn: 'Rigorous multi-residue pesticide screening and microbiological certification per export batch.',
      points: [
        'تحاليل MRL في معامل معتمدة دولياً بنظام ISO 17025',
        'فحص حجر زراعي مصري وإصدار شهادات CAPQ مسبقة',
        'فرز بصري إلكتروني يستبعد أدنى عيوب القشرة'
      ],
      pointsEn: [
        'ISO 17025 accredited laboratory multi-residue pesticide tests',
        'Official CAPQ phytosanitary inspections and certificates',
        'Automated optical vision grading removing skin defects'
      ]
    },
    {
      id: 'pillar-02',
      number: '02',
      title: 'سلسلة التبريد المتكاملة والشحن الذكي',
      titleEn: 'Continuous Cold Chain & Smart Logistics',
      subtitle: 'تبريد أولي فوري في محطات التعبئة وحاويات بحرية ذكية بمسجلات حرارة دقيقة.',
      subtitleEn: 'Immediate packhouse pre-cooling and smart reefer containers with digital data-logging.',
      points: [
        'أنفاق تبريد فجائي (Force-Air Pre-Cooling) فور الحصاد',
        'حاويات مبردة ديجيتال متصلة بنظام التتبع الملاحي',
        'بروتوكول المعاملة بالتبريد (Cold Treatment) للأسواق البعيدة'
      ],
      pointsEn: [
        'Forced-air pre-cooling tunnels directly following field harvest',
        'Digital reefer containers connected to telematics tracking',
        'Certified In-Transit Cold Treatment protocol for distant destinations'
      ]
    },
    {
      id: 'pillar-03',
      number: '03',
      title: 'شراكات زراعية وتعاقدات مستدامة',
      titleEn: 'Direct Grower Partnerships & Fair Trade',
      subtitle: 'علاقات تعاقدية وثيقة مع مزارع مسجلة تكفل استقرار التوريد وعدالة الأسعار.',
      subtitleEn: 'Long-term contracts with GlobalGAP certified farms guaranteeing crop traceability.',
      points: [
        'تتبع كامل من البذرة ومياه الري حتى الصندوق النهائي',
        'إشراف زراعي دوري وتدريب العمالة على ممارسات الحصاد الآمن',
        'عقود توريد سنوية ثابتة تحمي المستورد من تقلبات الأسواق'
      ],
      pointsEn: [
        'Complete farm-to-fork batch traceability from seed to carton',
        'Agronomic field supervision and certified harvesting safety',
        'Fixed seasonal export agreements shielding buyers from volatility'
      ]
    },
    {
      id: 'pillar-04',
      number: '04',
      title: 'دقة المواعيد وسرعة الإبحار',
      titleEn: 'Punctual Dispatch & Optimized Transit Times',
      subtitle: 'تنسيق لوجستي فائق السرعة عبر موانئ الإسكندرية ودمياط وبورسعيد مع كبرى خطوط الملاحة.',
      subtitleEn: 'Fast-track terminal dispatch via Alexandria, Damietta, and Port Said with tier-1 shipping lines.',
      points: [
        'إبحار مباشر لموانئ كوبر، رافينا، روتردام، وجدة',
        'تخليص جمركي مسبق يقلل بقاء الشحنات داخل الموانئ',
        'مرونة عالية في توفير حاويات إضافية خلال ذروة المواسم'
      ],
      pointsEn: [
        'Direct express maritime sailings to Koper, Ravenna, Rotterdam, and Jeddah',
        'Pre-customs declaration minimizing terminal dwelling times',
        'High container allocation scalability during seasonal peak harvests'
      ]
    },
    {
      id: 'pillar-05',
      number: '05',
      title: 'الشفافية التجارية والنزاهة التعاقدية',
      titleEn: 'Commercial Transparency & Institutional Reliability',
      subtitle: 'التزام تام بكافة بنود وشروط عقود التصدير الدولية المعتمدة (Incoterms 2020).',
      subtitleEn: 'Uncompromising adherence to international agricultural trade terms and Incoterms 2020.',
      points: [
        'توفير صور وتقارير جودة حية قبل غلق وتشميع الحاوية',
        'تسعير واضح وعادل متوافق مع درجات الفرز والمواصفات',
        'فريق دعم وتنسيق ملاحي متعدد اللغات على مدار الساعة'
      ],
      pointsEn: [
        'Live loading photos and quality inspection dossiers before bolt sealing',
        'Clear, competitive export pricing benchmarked to exact grading',
        'Multilingual operational support desk active 24/7 across timezones'
      ]
    }
  ],
  protocols: [
    {
      id: 'curing-protocol',
      cropKey: 'sweet-potatoes',
      cropName: 'البطاطا الحلوة المصرية (بيورجارد وبيليفيو)',
      cropNameEn: 'Egyptian Sweet Potatoes (Beauregard & Bellevue)',
      badge: 'بروتوكول المعالجة الحرارية والتئام القشرة (CURING PROTOCOL)',
      badgeEn: 'THERMAL HEALING & CURING PROTOCOL',
      title: 'بروتوكول المعالجة الحرارية المعتمد للبطاطا الحلوة',
      titleEn: 'Certified Curing & Post-Harvest Protocol for Sweet Potatoes',
      subtitle: 'المعيار العلمي الإلزامي لتأهيل حبات البطاطا للشحن البحري الطويل، وإكسابها نسبة السكر المثالية وحماية القشرة من التلف.',
      subtitleEn: 'The mandatory scientific standard to prepare sweet potatoes for long maritime transit, optimizing natural sweetness and curing skin abrasions.',
      image: '/crops/sweet_potatoes.jpg',
      standards: ['GlobalGAP Compliant', 'CAPQ Phytosanitary Protocol', 'ISO 22000 Packhouse Certified'],
      parameters: [
        { label: 'درجة حرارة المعالجة (Curing Temp)', labelEn: 'Curing Temperature', value: '13.5°C ± 0.5°C', note: 'ثابتة ومسجلة بحساسات دقيقة' },
        { label: 'الرطوبة النسبية (Relative Humidity)', labelEn: 'Relative Humidity', value: '85% - 90% RH', note: 'ترطيب بالضباب الدقيق' },
        { label: 'مدة المعالجة الموصى بها', labelEn: 'Duration', value: '5 إلى 7 أيام متواصلة', note: 'حسب توقيت الحصاد' },
        { label: 'التهوية وتجديد الهواء', labelEn: 'Air Ventilation', value: 'CO₂ < 2,500 ppm', note: 'طرد الغازات الحيوية دورياً' },
        { label: 'درجة حرارة الشحن البحري', labelEn: 'Transit Reefer Setpoint', value: '+13.5°C في الحاوية المبردة', note: 'حظر التبريد تحت +12°C تماماً' },
        { label: 'نسبة الفاقد المسموح به', labelEn: 'Skin Defect Allowance', value: '< 0.5% تلف قشري', note: 'مطابقة لمواصفات السوبرماركت الأوروبي' }
      ],
      phases: [
        {
          phase: 'المرحلة 01',
          title: 'الحصاد الحذِر والنقل الأولي',
          titleEn: 'Gentle In-Field Harvest & Transfer',
          description: 'جمع يدوي فوري في صناديق حقلية بلاستيكية مبطنة مع تجنب الخدوش أو الارتطام بالتربة، ونقل سريع للمحطة خلال 4 ساعات من القلع.',
          descriptionEn: 'Immediate hand picking into lined plastic harvest crates avoiding soil abrasion, transferred to the packhouse within 4 hours.'
        },
        {
          phase: 'المرحلة 02',
          title: 'المعالجة الحرارية (Suberization)',
          titleEn: 'Suberization & Thermal Curing',
          description: 'إدخال الصناديق لغرف العزل الحراري عند 13.5°م ورطوبة 90% لتحفيز نمو طبقة الفلين الواقية (Suberin) على أي جروح سطحية وتركيز السكريات الطبيعية.',
          descriptionEn: 'Crates placed inside climate chambers at 13.5°C and 90% RH to trigger suberin formation on harvest wounds and enhance sugar density.'
        },
        {
          phase: 'المرحلة 03',
          title: 'الغسيل بالماء المعقم والتلميع',
          titleEn: 'Sanitized Water Washing & Polishing',
          description: 'تمرير المحصول عبر خط مائي بفرش دوارة ناعمة وتجفيف فوري بهواء دافئ معقم، لضمان مظهر برتقالي لامع ونظيف.',
          descriptionEn: 'Produce passes through soft brush washing lines and dries under sterile warm airflow, revealing vibrant, clean orange skin.'
        },
        {
          phase: 'المرحلة 04',
          title: 'الفرز الإلكتروني والتعبئة في كراتين التصدير',
          titleEn: 'Electronic Sizing & Carton Packing',
          description: 'معايرة الأحجام S, M, L1, L2, XL بدقة وتعبئة في كراتين تلسكوبية 6 كجم أو 10 كجم ووضعها على باليتات مدخنة مطابقة لمعيار ISPM-15.',
          descriptionEn: 'Precision weight sizing into S, M, L1, L2, XL grades packed into 6kg or 10kg telescopic cartons palletized on heat-treated ISPM-15 pallets.'
        }
      ],
      verifications: [
        'فحص خلو كامل من أعفان التربة وحشرات السوس',
        'شهادة مطابقة المتبقيات MRL المعتمدة من المعمل المركزي لتحليل متبقيات المبيدات',
        'شهادة الحجر الزراعي المصري CAPQ قبل مغادرة المحطة لميناء الإسكندرية / دمياط'
      ],
      criticalLimit: 'تحذير تشغيلي حرج: البطاطا الحلوة حساسة لبرودة الشتاء؛ أي انخفاض تحت +12°C يسبب تلون اللب الداخلي والتلف الفيزيولوجي (Chilling Injury).',
      criticalLimitEn: 'Critical Control Point: Sweet potatoes are chilling-sensitive. Exposure below +12°C leads to internal flesh breakdown and chilling injury.'
    },
    {
      id: 'onions-sorting-protocol',
      cropKey: 'onions',
      cropName: 'البصل المصري الجاف (الأحمر والذهبي)',
      cropNameEn: 'Egyptian Fresh Onions (Red & Golden Giza)',
      badge: 'بروتوكول الفرز الضوئي والتدريج الوزني للبصل',
      badgeEn: 'OPTICAL & DYNAMIC WEIGHT SORTING PROTOCOL',
      title: 'بروتوكول التجفيف والفرز الإلكتروني المتقدم للبصل',
      titleEn: 'Advanced Optical Grading & Weight Sizing for Egyptian Onions',
      subtitle: 'تقنيات الفرز بكاميرات 360 درجة والوزن فائق الدقة لضمان صلابة القشور وخلو البصل من الأعفان والازدواج.',
      subtitleEn: 'High-speed 360° computer vision inspection and load-cell calibration ensuring multi-layer skin retention and complete absence of defects.',
      image: '/crops/onions.jpg',
      standards: ['EU Class I Standard', 'ISO 22000 Packhouse', 'Continuous Weight Verification'],
      parameters: [
        { label: 'سرعة الفحص البصري', labelEn: 'Vision Inspection Speed', value: '25 حبة / ثانية / مسار', note: 'كاميرات رقمية متعددة الأطياف' },
        { label: 'دقة الوزن الإلكتروني', labelEn: 'Weight Cell Accuracy', value: '± 1.0 جرام', note: 'خلايا وزن ديناميكية ألمانية' },
        { label: 'معايرة الأقطار القياسية', labelEn: 'Caliber Calibration', value: '40-60، 50-70، 60-80، 70-90 مم', note: 'تدريج دقيق حسب طلب العميل' },
        { label: 'نسبة المادة الجافة', labelEn: 'Dry Matter Solids', value: '> 14.5% Dry Matter', note: 'صلابة ممتازة لتخزين ممتد' },
        { label: 'سلسلة التبريد أو الشحن', labelEn: 'Transit Environment', value: '+0.0°C إلى +2.0°C أو جاف مهوى', note: 'رطوبة منخفضة 65-70% لمنع التزريع' },
        { label: 'طبقات القشرة الورقية', labelEn: 'Papery Skin Layers', value: '2 إلى 3 طبقات جافة متماسكة', note: 'حماية كاملة من الرطوبة الخارجية' }
      ],
      phases: [
        {
          phase: 'المرحلة 01',
          title: 'التجفيف الطبيعي في الحقل (Field Curing)',
          titleEn: 'Natural In-Field Windrow Curing',
          description: 'تجفيف هوائي وشمسى تحت مظلات الحقل لمدة 10 إلى 15 يوماً لغلق العنق بالكامل وتصلب القشرة الخارجية وتحولها للون الذهبي أو القرمزي الداكن.',
          descriptionEn: 'Windrow drying under shaded fields for 10-15 days to completely close the neck and cure outer skins into rich gold or crimson.'
        },
        {
          phase: 'المرحلة 02',
          title: 'قص الأعناق وإزالة الشوائب',
          titleEn: 'Mechanical Topping & De-Dusting',
          description: 'قص ميكانيكي للعنق بطول 2-3 سم لمنع دخول الفطريات، وشفط الأتربة والقشور الزائدة بواسطة مضخات هواء قوية.',
          descriptionEn: 'Precision mechanical topping leaving 2-3 cm neck to seal entry vectors, followed by high-velocity pneumatic blowers to remove loose soil.'
        },
        {
          phase: 'المرحلة 03',
          title: 'الفحص البصري التلقائي (360° Vision)',
          titleEn: '360° Computer Vision Inspection',
          description: 'تصوير كل حبة بصل من جميع الزوايا لاكتشاف الرؤوس المزدوجة، حروق الشمس، والعيوب الغائرة واستبعادها آلياً.',
          descriptionEn: 'Each bulb rotated and scanned for double necks, sunscald, internal rot, and mechanical blemishes with automated reject gates.'
        },
        {
          phase: 'المرحلة 04',
          title: 'التعبئة في الأجولة الشبكية المقاومة للأشعة فوق البنفسجية',
          titleEn: 'UV-Stabilized Mesh Bag Packaging',
          description: 'تعبئة في شِباك 10 كجم أو 25 كجم مهواة بألوان متناسقة مع حياكة آلية قوية وتحميل آمن داخل الحاويات.',
          descriptionEn: 'Bagging into 10kg or 25kg ventilated UV-treated mesh sacks, automatically stitched with batch traceability codes.'
        }
      ],
      verifications: [
        'خلو تام من عفن الرقبة البوتريتس (Botrytis Neck Rot)',
        'فحص جفاف العنق بنسبة 100% وعدم وجود أي رطوبة متبقية',
        'تأمين حاويات مبردة جافة (Dehumidified Reefers) للشحنات البحرية التي تتجاوز 14 يوماً'
      ],
      criticalLimit: 'تحذير تشغيلي حرج: ممنوع شحن البصل في حاويات عالية الرطوبة (>75% RH) لتفادي ظهور العفن الأسود أو انبعاث الجذور أثناء الإبحار.',
      criticalLimitEn: 'Critical Control Point: Onions must never be loaded into high-humidity containers (>75% RH) to prevent black mold and root growth.'
    },
    {
      id: 'garlic-curing-protocol',
      cropKey: 'garlic',
      cropName: 'الثوم المصري البلدي والأرجواني الفاخر',
      cropNameEn: 'Egyptian Fresh White & Purple Garlic',
      badge: 'بروتوكول التجفيف المحكوم والتجذير (GARLIC CURING PROTOCOL)',
      badgeEn: 'CONTROLLED GARLIC DRYING & CURING PROTOCOL',
      title: 'بروتوكول المعالجة الهوائية والتجذير للثوم المصري الموجه للتصدير',
      titleEn: 'Controlled Air Curing & Root Trimming Protocol for Export Garlic',
      subtitle: 'المنظومة العلمية الصارمة للتجفيف الطبيعي وحماية الفصوص من التعفن أو الإنبات المبكر لضمان جودة تدوم لأشهر في الشحن والتخزين.',
      subtitleEn: 'Stringent post-harvest drying protocol preventing internal sprouting and fungal rot, ensuring export-grade shelf life across overseas markets.',
      image: '/crops/garlic.jpg',
      standards: ['GlobalGAP Compliant', 'CAPQ Phytosanitary Protocol', 'ISO 22000 Packhouse Certified'],
      parameters: [
        { label: 'الحرارة المثلى للشحن الجاف', labelEn: 'Transit Temperature', value: '-1.0°C إلى +0.0°C', note: 'حاوية جافة مبردة تمنع التبرعم' },
        { label: 'الرطوبة النسبية المحكومة', labelEn: 'Relative Humidity', value: '65% إلى 70% RH', note: 'بيئة جافة تمنع الأعفان السطحية' },
        { label: 'معامل التجذير والقص', labelEn: 'Root Trimming Standard', value: 'قص نظيف 3-5 مم', note: 'بدون جرح الساق القاعدية' },
        { label: 'طول الساق المتبقي', labelEn: 'Stem Length', value: '2.0 إلى 3.0 سم كحد أقصى', note: 'مقصوص ومفرز بعناية' },
        { label: 'كثافة القشرة الخارجية', labelEn: 'Outer Tunic Quality', value: 'طبقتان إلى 3 طبقات جافة', note: 'قشرة بيضاء أو بنفسجية متماسكة' },
        { label: 'فحص خلو الآفات الحجرية', labelEn: 'Quarantine Pest Free', value: 'خلو تام من Ditylenchus', note: 'فحص مجهري معتمد من الحجر' }
      ],
      phases: [
        {
          phase: 'المرحلة 01',
          title: 'التجفيف الهوائي الأولي بالحقل (Field Curing)',
          titleEn: 'Field Aeration & Sun-Curing',
          description: 'تجفيف هوائي مدروس تحت مظلات مهواة للتخلص من الرطوبة الزائدة للساق وتصلب القشرة الخارجية وحماية الفصوص.',
          descriptionEn: 'Shaded, ventilated air drying ensuring natural tunic tightening and gradual reduction of stem sap.'
        },
        {
          phase: 'المرحلة 02',
          title: 'القص الآلي والتنظيف الهوائي الدقيق',
          titleEn: 'Precision Trimming & Air Blowing',
          description: 'قص الجذور آلياً بدون إصابة القاعدة، وتنظيف الأتربة بواسطة تيارات هواء مضغوط نقية للحفاظ على نقاء الرؤوس.',
          descriptionEn: 'Mechanical root trimming preserving the basal plate, followed by high-pressure filtered air dust removal.'
        },
        {
          phase: 'المرحلة 03',
          title: 'الفرز الحجمي والمعايرة بالأقطار',
          titleEn: 'Diameter Caliber Grading',
          description: 'معايرة إلكترونية دقيقة بالأقطار (40/50، 50/60، 60/70 مم) مع عزل الرؤوس المزدوجة أو المفتوحة أو غير المكتملة.',
          descriptionEn: 'Electronic optical sizing into certified diameter tiers, eliminating malformed or split heads.'
        },
        {
          phase: 'المرحلة 04',
          title: 'التعبئة والتحميل في حاويات جافة مبردة',
          titleEn: 'Ventilated Packing & Dry Reefer Loading',
          description: 'تعبئة في كراتين مهواة أو أكياس شبكية وشحنها في حاويات ريفير مضبوطة الرطوبة لمنع أي تكثيف مائي سطحي.',
          descriptionEn: 'Packaged into ventilated telescopic cartons and loaded into low-humidity reefer reefers at negative setpoints.'
        }
      ],
      verifications: [
        'شهادة صحة نباتية CAPQ رسمية لكل لوط تثبت خلو الرؤوس من أي طفيليات أو أعفان',
        'فحص معملي لمتبقيات المبيدات MRL مطابق للمواصفات الأوروبية والخليجية',
        'شهادة منشأ مصدقة من الغرفة التجارية'
      ],
      criticalLimit: 'تحذير تشغيلي حرج: يُحظر الشحن في رطوبة أعلى من 75% لتجنب انبعاث الجذور أو تكون أعفان البنسليوم الزرقاء أثناء الرحلة.',
      criticalLimitEn: 'Critical Control Point: Loading garlic at ambient humidity above 75% RH is prohibited to avert root reactivation and mold spores.'
    },
    {
      id: 'bell-peppers-greenhouse-protocol',
      cropKey: 'colored-bell-peppers',
      cropName: 'الفلفل الألوان المصري المحمي (أحمر، أصفر، برتقالي)',
      cropNameEn: 'Egyptian Protected Colored Bell Peppers',
      badge: 'بروتوكول الصوب المحمية وسلسلة التبريد (GREENHOUSE COLD-CHAIN PROTOCOL)',
      badgeEn: 'GREENHOUSE HARVEST & COLD-CHAIN PROTOCOL',
      title: 'بروتوكول جني وتعبئة وتبريد الفلفل الألوان عالي الجودة',
      titleEn: 'Harvesting, Packing & Climate-Controlled Transit for Bell Peppers',
      subtitle: 'البروتوكول المعتمد لحفظ النضارة والقرمشة وحماية الثمار من فقدان الوزن أو تغير القوام طوال مسار التصدير.',
      subtitleEn: 'Strict post-harvest cold chain and humidity management safeguarding wall thickness, gloss, and crunch during sea transit.',
      image: '/crops/carrots.jpg',
      standards: ['GlobalGAP IFA Certified', 'ISO 22000 Certified', 'BRC Food Safety Standard'],
      parameters: [
        { label: 'حرارة التبريد والشحن', labelEn: 'Transit Temperature', value: '+7.5°C إلى +8.5°C', note: 'حساسة لدرجات البرودة الشديدة' },
        { label: 'الرطوبة النسبية المعتمدة', labelEn: 'Relative Humidity', value: '90% إلى 95% RH', note: 'لمنع تجعد القشرة وفقد الوزن' },
        { label: 'سمك الجدار اللحمي', labelEn: 'Wall Thickness', value: '6.5 مم - 8.0 مم', note: 'ثمار صلبة مقرمشة عالية الصلابة' },
        { label: 'توقيت الحصاد اليومي', labelEn: 'Harvest Window', value: 'الصباح الباكر قبل اشتداد الشمس', note: 'لتفادي الإجهاد الحراري للثمار' },
        { label: 'عمر الرف التجاري المتوقع', labelEn: 'Commercial Shelf Life', value: '21 إلى 28 يوماً', note: 'تحت ظروف التبريد المستمر' },
        { label: 'خلو المتبقيات الكيميائية', labelEn: 'MRL Clean Record', value: 'مطابقة تامة للمواصفات الأوروبية', note: 'زراعة بمكافحة حيوية متكاملة' }
      ],
      phases: [
        {
          phase: 'المرحلة 01',
          title: 'القطف اليدوي بمقصات معقمة',
          titleEn: 'Sanitized Manual Clipping',
          description: 'قص العنق باحترافية بطول 1-2 سم لمنع جرح الثمار المجاورة مع تطهير مقصات القطف بانتظام.',
          descriptionEn: 'Precision stem cutting leaving a clean 1-2 cm pedicel to protect neighboring fruits from puncture.'
        },
        {
          phase: 'المرحلة 02',
          title: 'التبريد الأولي السريع لإزالة حرارة الحقل',
          titleEn: 'Forced-Air Pre-Cooling',
          description: 'إدخال الثمار فور وصولها لمحطة التعبئة إلى غرف التبريد الهوائي الفجائي لخفض حرارتها إلى +8°م خلال 4 ساعات.',
          descriptionEn: 'Immediate forced-air cooling to reduce field heat to +8°C within 4 hours, halting respiration.'
        },
        {
          phase: 'المرحلة 03',
          title: 'الفرز البصري والتلميع والتعبئة التلسكوبية',
          titleEn: 'Optical Sorting & Telescopic Packing',
          description: 'فرز أوتوماتيكي حسب الحجم واللون ونقاء الثمرة مع تعبئة سريعة في كراتين تلسكوبية 5 كجم مبطنة.',
          descriptionEn: 'Automatic sorting by caliber and color uniformity, followed by gentle packing in ventilated 5kg cartons.'
        },
        {
          phase: 'المرحلة 04',
          title: 'الشحن في حاويات محكومة الهواء (CA Reefers)',
          titleEn: 'Controlled Atmosphere Reefing',
          description: 'ضبط مستويات الأكسجين وثاني أكسيد الكربون داخل الحاوية لإبطاء النضج ومنع تدهور جدران الثمار.',
          descriptionEn: 'Sea shipping with controlled atmospheric parameters to slow ripening and lock in crunchy texture.'
        }
      ],
      verifications: [
        'فحص العينات العشوائية للتأكد من صلابة الثمار ومطابقة الألوان المتفق عليها',
        'شهادة تحليل مخبري معتمدة لخلو المتبقيات من معامل معتمدة دولياً ISO 17025',
        'سجل حراري رقمي متصل يثبت الحفاظ على نطاق +7.5°م إلى +8.5°م'
      ],
      criticalLimit: 'تحذير تشغيلي حرج: ممنوع تخفيض درجة الحرارة عن +7.0°م لتفادي حدوث أعراض أضرار البرودة (Chilling Injury) وظهور النقر على القشرة.',
      criticalLimitEn: 'Critical Control Point: Temperature must never drop below +7.0°C to avert chilling injury, skin pitting, and premature decay.'
    }
  ],
  csr: {
    badge: 'ميثاق الاستدامة والمسؤولية المجتمعية',
    badgeEn: 'Sustainability & CSR Charter',
    title: 'تعهداتنا الراسخة نحو كوكب أكثر اخضراراً وزراعة مسؤولة',
    titleEn: 'Our Enduring Commitments to Sustainable Agriculture & Society',
    subtitle: 'نلتزم بأعلى معايير حماية البيئة المصرية والري بالتنقيط ودعم المجتمعات الريفية في الدلتا وصعيد مصر.',
    subtitleEn: 'Championing Egyptian environmental preservation, smart drip irrigation, and rural empowerment across Nile Delta and Upper Egypt.',
    axis1Title: 'المحور الأول: الزراعة المستدامة وترشيد الموارد',
    axis1TitleEn: 'Axis 1: Sustainable Farming & Resource Conservation',
    axis1Desc: 'اعتماد الري الذكي بالتنقيط بنسبة 100% في مزارعنا التعاقدية، واستخدام الطاقة الشمسية في محطات الفرز، وتقليل البصمة الكربونية للشحن البحري.',
    axis1DescEn: '100% smart drip irrigation in contracted groves, solar-powered sorting facilities, and carbon-optimized vessel chartering.',
    axis2Title: 'المحور الثاني: تمكين المزارعين وسلامة بيئة العمل',
    axis2TitleEn: 'Axis 2: Fair Labor & Community Empowerment',
    axis2Desc: 'ضمان أجور عادلة وبيئة عمل آمنة خالية من عمالة الأطفال، وبرامج تدريب مستمرة للمهندسين والعمال الزراعيين وفق معايير جلوبال جاب الدولية.',
    axis2DescEn: 'Strict adherence to fair wages, safe certified packhouse environments, and continuous agronomic training under GlobalGAP guidelines.'
  },
  updatedAt: new Date().toISOString()
};
