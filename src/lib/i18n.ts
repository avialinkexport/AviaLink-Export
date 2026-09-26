import { Product } from '../types';
import { initialProducts } from '../data/products';

export type Language = 'ar' | 'en' | 'fr' | 'es' | 'de' | 'ru';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'rtl' | 'ltr';
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇪🇬', dir: 'rtl' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
];

export function detectUserLanguage(): Language {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('avialink_user_lang') as Language | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      return saved;
    }
  }

  if (typeof navigator !== 'undefined') {
    const userLangs = navigator.languages || [navigator.language];
    for (const langStr of userLangs) {
      if (!langStr) continue;
      const primaryCode = langStr.toLowerCase().split('-')[0] as Language;
      if (LANGUAGES.some((l) => l.code === primaryCode)) {
        return primaryCode;
      }
    }

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
      if (
        tz.includes('cairo') || tz.includes('riyadh') || tz.includes('dubai') ||
        tz.includes('baghdad') || tz.includes('amman') || tz.includes('beirut') ||
        tz.includes('casablanca') || tz.includes('tunis') || tz.includes('algiers')
      ) {
        return 'ar';
      }
      if (tz.includes('paris') || tz.includes('brussels') || tz.includes('dakar')) {
        return 'fr';
      }
      if (tz.includes('madrid') || tz.includes('mexico') || tz.includes('buenos_aires')) {
        return 'es';
      }
      if (tz.includes('berlin') || tz.includes('vienna') || tz.includes('zurich')) {
        return 'de';
      }
      if (tz.includes('moscow') || tz.includes('minsk') || tz.includes('almaty')) {
        return 'ru';
      }
    } catch (e) {
      // ignore
    }
  }

  return 'ar';
}

export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  ar: {
    // Nav & General
    nav_home: 'الرئيسية',
    nav_about: 'عنا',
    nav_quality: 'خدمات التصدير',
    nav_products: 'منتجاتنا',
    nav_markets: 'لوجستيات الشحن',
    nav_portfolio: 'سابقة الأعمال',
    nav_contact: 'اتصل بنا',
    nav_integrity: 'نزاهة البيانات',
    nav_rfq_btn: 'اطلب عرض سعر الآن',
    nav_admin: 'بوابة الأدمن',
    
    // Logo
    logo_brand_name: 'أفيالينك',
    logo_export: 'للتصدير',
    logo_subtitle: 'للتصدير',
    logo_tagline: 'البوابة المصرية المعتمدة للتصدير الزراعي المباشر',

    // Portfolio
    portfolio_title: 'سابقة الأعمال والمشاريع التصديرية',
    portfolio_subtitle: 'سجل حافل من الشحنات الناجحة وتصدير آلاف الأطنان من الحاصلات الزراعية المصرية إلى مختلف الموانئ والمستوردين عالمياً.',
    portfolio_stat_shipments: 'حاوية وشحنة مكتملة',
    portfolio_stat_tonnage: 'طن صادرات سنوية',
    portfolio_stat_countries: 'دولة مستوردة',
    portfolio_stat_satisfaction: 'نسبة رضا المستوردين',
    portfolio_filter_all: 'جميع الشحنات والمشاريع',
    portfolio_filter_europe: 'أوروبا والغرب',
    portfolio_filter_gcc: 'الخليج العربي',
    portfolio_filter_asia: 'شرق آسيا',
    portfolio_filter_americas: 'المملكة المتحدة والأمريكتان',
    portfolio_case_details: 'تفاصيل الشحنة والاعتماد',
    portfolio_rfq_prompt: 'هل ترغب في الانضمام لشبكة مستوردينا وتأمين شحنتك القادمة؟',
    
    // Hero
    hero_badge: 'مصدر زراعي مصري معتمد دولياً',
    hero_title: 'أفيا لينك لتصدير الحاصلات الزراعية',
    hero_subtitle: 'نربط خصوبة الأرض المصرية وأجود المحاصيل بجميع الأسواق العالمية. محاصيل فرز أول طازجة مُجهزة طبقاً لأعلى المواصفات الأوروبية والعالمية.',
    hero_btn_rfq: 'طلب عرض سعر الشحنة (RFQ)',
    hero_btn_catalog: 'استعراض المنتجات المتاحة',
    hero_stat_countries: 'دول نستورد منها ونصدر إليها',
    hero_stat_tonnage: 'طن صادرات سنوية',
    hero_stat_compliance: 'جودة واشتراطات مطابقة',
    hero_feat_coldchain: 'سلسلة تبريد حديثة',
    hero_feat_phytosanitary: 'شهادات حجر زراعي',
    hero_feat_sorting: 'فرز وتدريج آلي',
    hero_feat_express: 'شحن بحري سريع',

    // Product Catalog
    catalog_title: 'منتجاتنا الزراعية الطازجة',
    catalog_subtitle: 'محاصيل زراعية مصرية فائقة الجودة مُجهزة ومفروزة لأعلى معايير التصدير الأوروبية والعالمية.',
    catalog_search_ph: 'ابحث باسم المحصول أو صنف التصدير...',
    catalog_cat_all: 'كل المحاصيل',
    catalog_cat_carrots: 'الجزر والبنجر',
    catalog_cat_citrus: 'الجزر والبنجر',
    catalog_cat_potatoes: 'البطاطس الطازجة',
    catalog_cat_sweet_potatoes: 'البطاطا الحلوة',
    catalog_cat_onions: 'البصل والثوم',
    catalog_specs_btn: 'المواصفات الفنية',
    catalog_rfq_btn: 'اطلب عرض سعر',
    catalog_details_btn: 'تفاصيل كاملة',
    catalog_moq_label: 'أدنى كمية (MOQ):',
    catalog_varieties_label: 'الأصناف:',
    catalog_origin_badge: 'إنتاج مصري',

    // Product Detail
    detail_back: 'العودة لكتالوج المنتجات',
    detail_season: 'الموسم التصديري',
    detail_origin: 'منشأ الزراعة',
    detail_hs_code: 'رمز المنسق الجمركي (HS Code)',
    detail_specs_title: 'المواصفات الفنية المعتمدة',
    detail_sizes: 'الأحجام والأوزان المتاحة',
    detail_packaging: 'خيارات التعبئة والتغليف',
    detail_storage: 'ظروف التبريد والتخزين',
    detail_loading: 'طريقة التحميل والحاويات',
    detail_certifications: 'شهادات السلامة المتاحة',

    // Trust Center
    trust_badge: 'الجودة والاعتماد والتتبع',
    trust_title: 'مركز الجودة وضمان الصلاحية',
    trust_sub: 'تلتزم أفيا لينك بأعلى المعايير الصحية والزراعية الدولية مع شهادات الحجر الزراعي وضمان سلاسل التبريد بالتفصيل.',
    trust_step1_title: 'زراعة خاضعة للرقابة',
    trust_step1_desc: 'محاصيل مزروعة في أراضٍ معتمدة بمصر مع فحص دوري للمبيدات ومطابقة معايير MRL الأوروبية.',
    trust_step2_title: 'الفرز والتدريج الإلكتروني',
    trust_step2_desc: 'محطات تعبئة بفرز آلي دقيق حسب الأحجام والأوزان وغسيل وتجفيف آمن لكل منتج.',
    trust_step3_title: 'الفحص والشهادات الصحية',
    trust_step3_desc: 'فحص معملي دقيق وإصدار شهادة الحجر الزراعي المصرية الرسمية قبل التصدير.',
    trust_step4_title: 'التبريد الأولي والتجهيز',
    trust_step4_desc: 'تبريد أولي سريع في محطات التعبئة لحماية طزاجة المنتجات وتجهيز الحاويات المبردة.',
    trust_certs_title: 'شهادات الجودة والتصدير',
    trust_audit_btn: 'طلب ملف الاعتماد والجودة',

    // Global Markets
    markets_badge: 'الأسواق العالمية والشحن',
    markets_title: 'من مصر إلى جميع الموانئ العالمية',
    markets_sub: 'سلاسل إمداد مبردة ومباشرة لأوروبا، المملكة المتحدة، والخليج العربي.',
    markets_ports_label: 'موانئ الوصول الرئيسية',
    markets_transit_label: 'مدة الشحن البحري المتوقعة',
    markets_inquire_btn: 'استفسر عن خط الشحن',
    markets_pipeline_title: 'سلسلة التوريد والتبريد: رحلة المحصول من المزرعة إلى ميناء الوصول',

    // About
    about_badge: 'نبذة عن الشركة ورؤية التصدير',
    about_title: 'عن أفيا لينك للتصدير الزراعي',
    about_sub: 'نصل جودة الأرض المصرية الغنية بالأسواق العالمية من خلال الجودة المعتمدة والالتزام الكامل بسلاسل التبريد.',
    about_mission_title: 'مهمتنا التصديرية',
    about_mission_desc: 'أن نكون الجسر الموثوق والأول بين المزارع المصرية المتميزة ومستوردي الحاصلات الزراعية وشبكات السوبرماركت في العالم.',
    about_guarantee_title: 'ضمان الجودة والرقابة',
    about_guarantee_desc: 'نخضع كل شحنة لفحص دقيق بنسبة 100% قبل التصدير، مع استخدام أحدث تقنيات الفرز والتدريج الضوئي.',

    // Contact
    contact_badge: 'مكتب عمليات التصدير',
    contact_title: 'تواصل مع أفيا لينك للتصدير',
    contact_sub: 'فريق متخصص لمساعدة المستوردين وتأكيد أسعار الحاويات وتوافر الكميات الموسمية فوراً.',
    contact_phone_label: 'الهاتف المباشر / الإدارة',
    contact_email_label: 'البريد الإلكتروني الرسمي للتصدير',
    contact_wa_label: 'المحادثة السريعة عبر واتساب',
    contact_rfq_box_title: 'هل ترغب في طلب عرض سعر شحنة؟',
    contact_rfq_box_sub: 'أرسل طلب السعر بالصنف المطلوب، الكمية بالطن، وميناء الوصول المستهدف.',
    contact_response_time: 'سرعة الاستجابة للطلبات: خلال 24 ساعة عمل',

    // Footer
    footer_desc: 'أفيا لينك للتصدير الزراعي - نربط جودة الحاصلات المصرية بجميع الأسواق العالمية.',
    footer_rights: 'جميع الحقوق محفوظة. مصر.',
    footer_data_log: '[سجل نزاهة البيانات]',
    footer_admin_link: 'دخول الأدمن',

    // RFQ Modal & Multi-Step Wizard
    rfq_title: 'طلب عرض سعر تصديري رسمي (RFQ)',
    rfq_sub: 'حدد متطلبات الشحنة ومواصفات الفرز للحصول على تسعير فوري وتأكيد توافر الحاويات المبردة.',
    rfq_subtitle: 'حدد متطلبات الشحنة ومواصفات الفرز للحصول على تسعير فوري وتأكيد توافر الحاويات المبردة.',
    rfq_desk_badge: 'المكتب التجاري وقسم التصدير الدولي',
    rfq_step_1_title: 'بيانات المستورد والشركة',
    rfq_step_2_title: 'المحصول والمواصفات',
    rfq_step_3_title: 'الشحن واللوجستيات',
    rfq_step_4_title: 'مراجعة وتأكيد الطلب',
    rfq_step_1_sub: 'بيانات التواصل ومسؤول المشتريات بالشركة المستوردة',
    rfq_step_2_sub: 'تحديد المحصول، الصنف، رتبة الجودة، التعبئة وحجم الطلبية',
    rfq_step_3_sub: 'ميناء الوصول، شروط التجارة الدولية (Incoterms)، وموعد الإبحار',
    rfq_step_4_sub: 'مراجعة بيانات الشحنة بدقة قبل الإرسال النهائي لفريق العمليات',
    
    // Step 1 Fields
    rfq_field_name: 'الاسم الكامل / مسؤول المشتريات',
    rfq_name_label: 'الاسم الكامل / مسؤول المشتريات',
    rfq_ph_name: 'مثال: محمد طارق / أليكس جونسون',
    rfq_field_company: 'اسم الشركة المستوردة',
    rfq_company_label: 'اسم الشركة المستوردة',
    rfq_ph_company: 'مثال: شركة الاستيراد والتوزيع الدولية',
    rfq_field_country: 'الدولة المستوردة / الوجهة',
    rfq_country_label: 'الدولة المستوردة / الوجهة',
    rfq_select_country: 'اختر دولة الوصول...',
    rfq_field_email: 'البريد الإلكتروني للعمل',
    rfq_email_label: 'البريد الإلكتروني للعمل',
    rfq_ph_email: 'procurement@company.com',
    rfq_field_phone: 'رقم الهاتف / واتساب مع كود الدولة',
    rfq_phone_label: 'رقم الهاتف / واتساب مع كود الدولة',
    rfq_ph_phone: '+966 50 123 4567 أو +31 6 12345678',

    // Step 2 Fields
    rfq_field_product: 'المحصول الزراعي المطلوب',
    rfq_product_label: 'المحصول الزراعي المطلوب',
    rfq_select_product: 'اختر المحصول من القائمة...',
    rfq_field_variety: 'الصنف / النوع الزراعي',
    rfq_variety_label: 'الصنف / النوع الزراعي',
    rfq_ph_variety: 'مثال: بيورجارد، فالنسيا، سبونتا، أحمر...',
    rfq_field_grade: 'رتبة الجودة والفرز',
    rfq_grade_label: 'رتبة الجودة والفرز',
    rfq_grade_opt_1: 'فرز أول تصدير (Class I - Export Grade)',
    rfq_grade_opt_2: 'فرز سوبر إكسترا (Class Extra - Super Premium)',
    rfq_grade_opt_3: 'فرز تصنيعي / مائدة (Class II / Processing)',
    rfq_field_size: 'المقاس / العيار / الوزن',
    rfq_size_label: 'المقاس / العيار / الوزن',
    rfq_ph_size: 'مثال: أحجام L/M أو 45-65 مم أو 48/56/64',
    rfq_field_packaging: 'خيارات التعبئة والتغليف',
    rfq_packaging_label: 'خيارات التعبئة والتغليف',
    rfq_select_packaging: 'اختر نوع التعبئة المفضل...',
    rfq_field_qty: 'الكمية المطلوبة',
    rfq_quantity_label: 'الكمية المطلوبة',
    rfq_ph_qty: '25',
    rfq_field_unit: 'وحدة القياس',
    rfq_unit_label: 'وحدة القياس',
    rfq_unit_tons: 'طن متري (Metric Tons)',
    rfq_unit_containers: 'حاويات مبردة 40 قدم (40ft Reefer FCL)',
    rfq_unit_pallets: 'طبالي أوروبية (Euro Pallets)',
    rfq_field_prod_notes: 'ملاحظات إضافية ومواصفات الجودة الخاصة (اختياري)',
    rfq_prod_notes_label: 'ملاحظات إضافية ومواصفات الجودة الخاصة (اختياري)',
    rfq_ph_prod_notes: 'أي اشتراطات خاصة بنسبة السكر (Brix)، الفحص المعملي، الشمع، أو نوع الكرتون...',

    // Step 3 Fields
    rfq_field_port: 'ميناء الوصول والتفريغ المستهدف',
    rfq_port_label: 'ميناء الوصول والتفريغ المستهدف',
    rfq_ph_port: 'مثال: ميناء روتردام، ميناء جدة الإسلامي، ميناء جبل علي، ميناء هامبورغ...',
    rfq_field_incoterm: 'شروط التسعير والتجارة الدولية (Incoterms)',
    rfq_incoterm_label: 'شروط التسعير والتجارة الدولية (Incoterms)',
    rfq_incoterm_cif: 'CIF - التكلفة والتأمين وأجرة الشحن حتى ميناء الوصول (الأكثر طلباً)',
    rfq_incoterm_cfr: 'CFR - التكلفة وأجرة الشحن البحري لميناء الوصول',
    rfq_incoterm_fob: 'FOB - تسليم ظهر السفينة بالموانئ المصرية',
    rfq_incoterm_exw: 'EXW - تسليم أرض محطة التعبئة بمصر',
    rfq_incoterm_dap: 'DAP - تسليم مستودع المشتري بالوجهة',
    rfq_field_ship_date: 'تاريخ الشحن / نافذة التصدير المفضلة',
    rfq_ship_date_label: 'تاريخ الشحن / نافذة التصدير المفضلة',
    rfq_ph_ship_date: 'مثال: فوري / الموسم الحالي، الأسبوع القادم، شهر محدد...',
    rfq_field_ship_notes: 'تعليمات التبريد والشحن البحري (اختياري)',
    rfq_ship_notes_label: 'تعليمات التبريد والشحن البحري (اختياري)',
    rfq_ph_ship_notes: 'درجة حرارة التبريد المفضلة، خط الشحن المفضل (Maersk / MSC / CMA CGM)، أو شروط الفحص المسبق...',

    // Step 4 & Navigation
    rfq_review_buyer_title: 'بيانات المستورد والشركة',
    rfq_review_product_title: 'المحصول والمواصفات الفنية',
    rfq_review_logistics_title: 'الشحن واللوجستيات وشروط التجارة',
    rfq_btn_edit: 'تعديل',
    rfq_btn_next: 'الخطوة التالية',
    rfq_btn_prev: 'الخطوة السابقة',
    rfq_submit_btn: 'إرسال طلب عرض السعر الآن',
    rfq_submitting_btn: 'جاري إرسال وتشفير الطلب...',
    rfq_verify_label: 'التحقق الأمني لمكافحة السبام:',
    rfq_refresh_captcha: 'تحديث مسألة التحقق',
    rfq_consent_note: 'بإرسال هذا النموذج، فإنك تطلب عرض سعر رسمي من شركة أفيا لينك للتصدير الزراعي. بياناتك تخضع لسرية المعاملات التجارية المعتمدة.',
    rfq_success_title: 'تم استلام طلب عرض السعر بنجاح!',
    rfq_success_lead_id: 'رقم المرجع التصديري:',
    rfq_success_desc: 'شكراً لتواصلك معنا. قام فريق العمليات التصديرية باستلام طلبك، وسيتم مراجعة توافر الحاويات والمواصفات وإرسال عرض السعر المعتمد خلال 24 ساعة عمل.',
    rfq_btn_close: 'إغلاق النافذة',
    rfq_btn_new: 'طلب عرض سعر لمحصول آخر',
    rfq_send_whatsapp_btn: 'إرسال تفاصيل الطلب مباشرة إلى واتساب الموقع المسجل',
    rfq_whatsapp_notice: 'لضمان سرعة الرد والمتابعة الفورية مع فريق العمليات، اضغط الزر أعلاه لإرسال ملخص شحنتك لواتساب الشركة.',
    admin_view_lead_btn: 'عرض تفاصيل الطلب',
    admin_lead_modal_title: 'تفاصيل طلب عرض السعر التصديري',
    admin_send_to_company_wa: 'إرسال إلى واتساب الموقع المسجل',
    admin_chat_with_buyer_wa: 'مراسلة العميل على واتساب',
    admin_copy_lead_details: 'نسخ ملخص الطلب',
    admin_copied: 'تم النسخ!',
    rfq_channel_admin_confirmed: '✓ تم حفظ الطلب بنجاح في لوحة تحكم الإدارة (صفحة الأدمن)',
    rfq_channel_wa_heading: 'إرسال تفاصيل الشحنة لمسؤول التصدير عبر واتساب',
    rfq_channel_wa_desc: 'يتم إرسال نسخة كاملة ومفصلة من طلبك مباشرة إلى رقم واتساب إدارة التصدير للمتابعة الفورية.',
    rfq_channel_wa_auto_redirecting: 'جارٍ فتح محادثة واتساب تلقائياً خلال {seconds} ثوانٍ...',
    rfq_channel_wa_opened: 'تم فتح نافذة واتساب! يرجى الضغط على زر (إرسال) داخل التطبيق لإتمام الطلب.',
    rfq_channel_wa_btn_now: 'إرسال الطلب الآن عبر واتساب',
    rfq_channel_wa_copy_btn: 'نسخ نص الطلب',
    rfq_channel_wa_copied: 'تم النسخ للحافظة!',
    admin_wa_explanation: 'هذا هو رقم الواتساب الذي ستصل عليه إشعارات وطلبات عروض الأسعار التصديرية فور إرسالها من العملاء.',

    // Validations & Aliases
    rfq_err_name: 'يرجى إدخال الاسم الكامل (حرفين على الأقل).',
    rfq_err_company: 'يرجى إدخال اسم الشركة المستوردة.',
    rfq_err_country: 'يرجى اختيار دولة الوصول المستهدفة.',
    rfq_err_email: 'يرجى إدخال بريد إلكتروني صالح.',
    rfq_err_phone: 'يرجى إدخال رقم هاتف أو واتساب صحيح مع كود الدولة.',
    rfq_err_product: 'يرجى اختيار المحصول المطلوب.',
    rfq_err_qty: 'يرجى إدخال كمية صحيحة أكبر من الصفر.',
    rfq_err_port: 'يرجى تحديد ميناء الوصول لطلبات CIF / CFR.',
    rfq_err_captcha: 'إجابة التحقق الأمني غير صحيحة، يرجى المحاولة ثانية.',
    rfq_err_general: 'حدث خطأ أثناء إرسال الطلب، يرجى إعادة المحاولة.',
    rfq_field_notes: 'ملاحظات خاصة بالمواصفات والأحجام',
    rfq_success_msg: 'تم إرسال طلب عرض السعر بنجاح! سيتواصل معك فريق التصدير فوراً.',

    // Spec Sheet Modal
    spec_title: 'بطاقة المواصفات الفنية للشحنة',
    spec_download_btn: 'تحميل ملف PDF للمواصفات',
    spec_updated: 'آخر تحديث للمواصفات:',

    // Admin
    admin_title: 'لوحة تحكم إدارة التصدير',
    admin_tab_products: 'إدارة المنتجات',
    admin_tab_leads: 'طلبات الأسعار (Leads)',
    admin_add_product_btn: 'إضافة محصول جديد',
  },

  en: {
    // Nav & General
    nav_home: 'Home',
    nav_about: 'About Us',
    nav_quality: 'Export Services',
    nav_products: 'Products',
    nav_markets: 'Shipping Logistics',
    nav_portfolio: 'Export Track Record',
    nav_contact: 'Contact Us',
    nav_integrity: 'Data Integrity',
    nav_rfq_btn: 'Request Quote Now',
    nav_admin: 'Admin Portal',

    // Logo
    logo_brand_name: 'Avialink',
    logo_export: 'EXPORT',
    logo_subtitle: 'EXPORT',
    logo_tagline: 'Certified Egyptian Agricultural Export Gateway',

    // Portfolio
    portfolio_title: 'Export Track Record & Projects',
    portfolio_subtitle: 'A proven track record exporting thousands of tonnes of fresh Egyptian crops to ports and buyers worldwide.',
    portfolio_stat_shipments: 'Containers & Shipments',
    portfolio_stat_tonnage: 'Tons Exported Annually',
    portfolio_stat_countries: 'Destination Countries',
    portfolio_stat_satisfaction: 'Client Satisfaction Rate',
    portfolio_filter_all: 'All Projects',
    portfolio_filter_europe: 'Europe & West',
    portfolio_filter_gcc: 'GCC & Middle East',
    portfolio_filter_asia: 'East Asia',
    portfolio_filter_americas: 'UK & Americas',
    portfolio_case_details: 'Shipment Details',
    portfolio_rfq_prompt: 'Ready to partner with us for your next shipment?',

    // Hero
    hero_badge: 'Certified Egyptian Agricultural Exporter',
    hero_title: 'AviaLink Agricultural Export',
    hero_subtitle: 'Connecting fertile Egyptian soil and top-grade harvests to global markets. Premium washed, sorted, and graded produce compliant with European & international standards.',
    hero_btn_rfq: 'Request Shipment Quote (RFQ)',
    hero_btn_catalog: 'Browse Export Portfolio',
    hero_stat_countries: 'Destination Countries',
    hero_stat_tonnage: 'Tons Exported Annually',
    hero_stat_compliance: 'Quality & Phytosanitary Compliance',
    hero_feat_coldchain: 'Modern Cold Chain',
    hero_feat_phytosanitary: 'Phytosanitary Certified',
    hero_feat_sorting: 'Optical & Weight Grading',
    hero_feat_express: 'Express Ocean Freight',

    // Product Catalog
    catalog_title: 'Our Fresh Produce Portfolio',
    catalog_subtitle: 'Premium Egyptian crops harvested, sorted, and packed to top European & international buyer standards.',
    catalog_search_ph: 'Search variety, crop, or export grade...',
    catalog_cat_all: 'All Crops',
    catalog_cat_carrots: 'Carrots & Beetroot',
    catalog_cat_citrus: 'Carrots & Beetroot',
    catalog_cat_potatoes: 'Fresh Potatoes',
    catalog_cat_sweet_potatoes: 'Sweet Potatoes',
    catalog_cat_onions: 'Onions & Garlic',
    catalog_specs_btn: 'Tech Specs',
    catalog_rfq_btn: 'Request Quote',
    catalog_details_btn: 'Full Details',
    catalog_moq_label: 'MOQ:',
    catalog_varieties_label: 'Varieties:',
    catalog_origin_badge: 'Egypt Origin',

    // Product Detail
    detail_back: 'Back to Catalog',
    detail_season: 'Export Season',
    detail_origin: 'Cultivation Origin',
    detail_hs_code: 'Harmonized System Code (HS Code)',
    detail_specs_title: 'Certified Technical Specifications',
    detail_sizes: 'Available Calibers & Sizes',
    detail_packaging: 'Packaging Options',
    detail_storage: 'Reefer Storage & Temp',
    detail_loading: 'Container Loading Method',
    detail_certifications: 'Export Certifications Available',

    // Trust Center
    trust_badge: 'Quality, Certification & Traceability',
    trust_title: 'Trust & Compliance Center',
    trust_sub: 'AviaLink adheres to strict international health and agronomic standards with full plant quarantine compliance and cold-chain integrity.',
    trust_step1_title: 'Controlled Farming',
    trust_step1_desc: 'Cultivated in pre-inspected Egyptian soil with strictly monitored irrigation and MRL pesticide compliance.',
    trust_step2_title: 'Optical & Caliber Sorting',
    trust_step2_desc: 'Modern packing facilities with automated caliber sorting, washing, and gentle handling per crop.',
    trust_step3_title: 'Phytosanitary Clearance',
    trust_step3_desc: 'Central Administration of Plant Quarantine (CAPQ) pre-export batch testing and official certification.',
    trust_step4_title: 'Pre-Cooling & Packing Prep',
    trust_step4_desc: 'Rapid pre-cooling at packing facilities to maintain optimal field freshness and produce quality.',
    trust_certs_title: 'Quality & Export Certifications',
    trust_audit_btn: 'Request Compliance Audit File',

    // Global Markets
    markets_badge: 'Global Markets & Logistics',
    markets_title: 'From Egypt to Global Destination Ports',
    markets_sub: 'Direct temperature-controlled reefer corridors serving European, UK, and GCC trade channels.',
    markets_ports_label: 'Primary Discharge Ports',
    markets_transit_label: 'Estimated Maritime Transit',
    markets_inquire_btn: 'Inquire for Shipping Route',
    markets_pipeline_title: 'End-to-End Cold Chain & Export Logistics Journey',

    // About
    about_badge: 'Corporate Profile & Vision',
    about_title: 'About AviaLink Agricultural Export',
    about_sub: 'Bridging Egypt’s agricultural rich soil with global food markets through certified quality and cold-chain integrity.',
    about_mission_title: 'Our Export Mission',
    about_mission_desc: 'To be the premier, trusted bridge between Egyptian growers and international importers, distributors, and supermarket chains.',
    about_guarantee_title: 'Quality Guarantee & Inspection',
    about_guarantee_desc: 'Every container undergoes 100% pre-shipment inspections, optical sorting, and certified pesticide residue testing.',

    // Contact
    contact_badge: 'Export Operations Desk',
    contact_title: 'Contact AviaLink Export Desk',
    contact_sub: 'Our international trade specialists are ready to provide instant caliber specs, container availability, and freight quotes.',
    contact_phone_label: 'Direct Phone / HQ',
    contact_email_label: 'Official Export Email',
    contact_wa_label: 'Instant WhatsApp Chat',
    contact_rfq_box_title: 'Ready to Request a Container Quote?',
    contact_rfq_box_sub: 'Submit an RFQ with your requested crop, tonnage, destination port, and arrival week.',
    contact_response_time: 'Response Time: Within 24 Business Hours',

    // Footer
    footer_desc: 'AviaLink Agricultural Export - Connecting premium Egyptian crops to global markets.',
    footer_rights: 'All Rights Reserved. Egypt.',
    footer_data_log: '[Data Integrity Policy]',
    footer_admin_link: 'Admin Portal',

    // RFQ Modal & Multi-Step Wizard
    rfq_title: 'Request Official Export Quotation (RFQ)',
    rfq_sub: 'Submit shipment specifications to receive competitive EXW/FOB pricing and reefer container slot confirmation.',
    rfq_subtitle: 'Submit shipment specifications to receive competitive EXW/FOB pricing and reefer container slot confirmation.',
    rfq_desk_badge: 'AVIALINK Commercial Desk & International Trade',
    rfq_step_1_title: 'Buyer & Company Profile',
    rfq_step_2_title: 'Crop & Specifications',
    rfq_step_3_title: 'Shipping & Logistics',
    rfq_step_4_title: 'Review & Confirmation',
    rfq_step_1_sub: 'Procurement contact and company registration details',
    rfq_step_2_sub: 'Select crop, variety, export grade, packaging and order volume',
    rfq_step_3_sub: 'Destination port, Incoterms, and preferred shipment timeframe',
    rfq_step_4_sub: 'Verify quotation specifications before dispatch to export desk',
    
    // Step 1 Fields
    rfq_field_name: 'Full Name / Procurement Officer',
    rfq_name_label: 'Full Name / Procurement Officer',
    rfq_ph_name: 'e.g. John Doe / Alex Smith',
    rfq_field_company: 'Importing Company Name',
    rfq_company_label: 'Importing Company Name',
    rfq_ph_company: 'e.g. Global Agri Foods Ltd.',
    rfq_field_country: 'Destination Country',
    rfq_country_label: 'Destination Country',
    rfq_select_country: 'Select target destination country...',
    rfq_field_email: 'Corporate Email Address',
    rfq_email_label: 'Corporate Email Address',
    rfq_ph_email: 'procurement@company.com',
    rfq_field_phone: 'Phone / WhatsApp (with country code)',
    rfq_phone_label: 'Phone / WhatsApp (with country code)',
    rfq_ph_phone: '+31 6 12345678 or +966 50 123 4567',

    // Step 2 Fields
    rfq_field_product: 'Requested Crop / Produce',
    rfq_product_label: 'Requested Crop / Produce',
    rfq_select_product: 'Choose crop from portfolio...',
    rfq_field_variety: 'Crop Variety / Cultivar',
    rfq_variety_label: 'Crop Variety / Cultivar',
    rfq_ph_variety: 'e.g. Beauregard, Valencia, Spunta, Red Onions...',
    rfq_field_grade: 'Export Quality Grade',
    rfq_grade_label: 'Export Quality Grade',
    rfq_grade_opt_1: 'Class I (Standard Export Grade)',
    rfq_grade_opt_2: 'Class Extra (Super Premium)',
    rfq_grade_opt_3: 'Class II (Processing / Table)',
    rfq_field_size: 'Caliber / Size / Weight Range',
    rfq_size_label: 'Caliber / Size / Weight Range',
    rfq_ph_size: 'e.g. M (250-350g), 45-65mm, or 48/56/64 count',
    rfq_field_packaging: 'Preferred Packaging',
    rfq_packaging_label: 'Preferred Packaging',
    rfq_select_packaging: 'Select preferred packaging option...',
    rfq_field_qty: 'Required Quantity',
    rfq_quantity_label: 'Required Quantity',
    rfq_ph_qty: '25',
    rfq_field_unit: 'Unit',
    rfq_unit_label: 'Unit',
    rfq_unit_tons: 'Metric Tons (MT)',
    rfq_unit_containers: '40ft High-Cube Reefer Containers (FCL)',
    rfq_unit_pallets: 'Euro Pallets',
    rfq_field_prod_notes: 'Additional Quality & Agronomic Notes (Optional)',
    rfq_prod_notes_label: 'Additional Quality & Agronomic Notes (Optional)',
    rfq_ph_prod_notes: 'Specific Brix level, washing requirements, MRL testing, wax coating...',

    // Step 3 Fields
    rfq_field_port: 'Target Discharge / Destination Port',
    rfq_port_label: 'Target Discharge / Destination Port',
    rfq_ph_port: 'e.g. Port of Rotterdam, Jeddah Islamic Port, Jebel Ali, Hamburg...',
    rfq_field_incoterm: 'Pricing & Delivery Terms (Incoterms 2020)',
    rfq_incoterm_label: 'Pricing & Delivery Terms (Incoterms 2020)',
    rfq_incoterm_cif: 'CIF - Cost, Insurance & Freight to Destination Port (Most Popular)',
    rfq_incoterm_cfr: 'CFR - Cost & Ocean Freight to Destination Port',
    rfq_incoterm_fob: 'FOB - Free on Board (Egyptian Sea Ports)',
    rfq_incoterm_exw: 'EXW - Ex Works (Egyptian Packhouse)',
    rfq_incoterm_dap: 'DAP - Delivered at Place (Buyer Facility)',
    rfq_field_ship_date: 'Target Shipment Date / Export Window',
    rfq_ship_date_label: 'Target Shipment Date / Export Window',
    rfq_ph_ship_date: 'e.g. Immediate / Current Season, Next Month, Week 45...',
    rfq_field_ship_notes: 'Reefer Logistics & Temperature Instructions (Optional)',
    rfq_ship_notes_label: 'Reefer Logistics & Temperature Instructions (Optional)',
    rfq_ph_ship_notes: 'Required setpoint temp (+13.5°C), controlled atmosphere, preferred carrier...',

    // Step 4 & Navigation
    rfq_review_buyer_title: 'Buyer & Company Profile',
    rfq_review_product_title: 'Crop & Specifications',
    rfq_review_logistics_title: 'Shipping & Commercial Logistics',
    rfq_btn_edit: 'Edit',
    rfq_btn_next: 'Next Step',
    rfq_btn_prev: 'Previous Step',
    rfq_submit_btn: 'Submit Quotation Request',
    rfq_submitting_btn: 'Processing & Transmitting...',
    rfq_verify_label: 'Anti-Spam Security Check:',
    rfq_refresh_captcha: 'Refresh security challenge',
    rfq_consent_note: 'By submitting, you request an official B2B quotation from AviaLink Agricultural Export. Your data is protected under international trade confidentiality.',
    rfq_success_title: 'Quotation Request Received Successfully!',
    rfq_success_lead_id: 'Quotation Reference:',
    rfq_success_desc: 'Thank you for choosing AviaLink. Our export commercial desk will review your specifications, verify reefer freight space, and return an official quotation within 24 business hours.',
    rfq_btn_close: 'Close Window',
    rfq_btn_new: 'Submit Another RFQ',
    rfq_send_whatsapp_btn: 'Send Order Details Directly to Registered WhatsApp',
    rfq_whatsapp_notice: 'For immediate response and expedited dispatch handling, click above to send your order summary to our export WhatsApp.',
    admin_view_lead_btn: 'View RFQ Details',
    admin_lead_modal_title: 'Export RFQ Details',
    admin_send_to_company_wa: 'Forward to Company WhatsApp',
    admin_chat_with_buyer_wa: 'Message Buyer on WhatsApp',
    admin_copy_lead_details: 'Copy Order Summary',
    admin_copied: 'Copied!',
    rfq_channel_admin_confirmed: '✓ Request successfully recorded in Export Admin Control Panel',
    rfq_channel_wa_heading: 'Direct WhatsApp Transmission to Export Desk',
    rfq_channel_wa_desc: 'A full specification sheet is being forwarded directly to our commercial operations WhatsApp.',
    rfq_channel_wa_auto_redirecting: 'Opening WhatsApp chat automatically in {seconds}s...',
    rfq_channel_wa_opened: 'WhatsApp window opened! Please click Send inside WhatsApp to finalize your dispatch.',
    rfq_channel_wa_btn_now: 'Send Order Now via WhatsApp',
    rfq_channel_wa_copy_btn: 'Copy Order Text',
    rfq_channel_wa_copied: 'Copied to clipboard!',
    admin_wa_explanation: 'This is the registered WhatsApp number where new RFQ quote requests and order alerts are forwarded upon submission.',

    // Validations & Aliases
    rfq_err_name: 'Full name must be at least 2 characters.',
    rfq_err_company: 'Company name is required.',
    rfq_err_country: 'Please select a destination country.',
    rfq_err_email: 'Please provide a valid business email address.',
    rfq_err_phone: 'Please provide a valid phone or WhatsApp number with country code.',
    rfq_err_product: 'Please select a requested crop.',
    rfq_err_qty: 'Please enter a valid numeric quantity greater than 0.',
    rfq_err_port: 'Please specify destination port for CIF/CFR quotes.',
    rfq_err_captcha: 'Incorrect security challenge answer. Please try again.',
    rfq_err_general: 'Error submitting quote request. Please try again.',
    rfq_field_notes: 'Specific Caliber / Specs Notes',
    rfq_success_msg: 'RFQ submitted successfully! Our export desk will contact you immediately.',

    // Spec Sheet Modal
    spec_title: 'Technical Specification Sheet',
    spec_download_btn: 'Download Spec Sheet PDF',
    spec_updated: 'Last Spec Audit:',

    // Admin
    admin_title: 'Export Management Dashboard',
    admin_tab_products: 'Products Manager',
    admin_tab_leads: 'Quotes & Leads',
    admin_add_product_btn: 'Add New Crop',
  },

  fr: {
    // Nav & General
    nav_home: 'Accueil',
    nav_about: 'À propos',
    nav_quality: 'Services d’exportation',
    nav_products: 'Nos produits',
    nav_markets: 'Logistique & Expédition',
    nav_portfolio: 'Réalisations & Exportations',
    nav_contact: 'Contactez-nous',

    // Portfolio
    portfolio_title: 'Réalisations & Projets d’Exportation',
    portfolio_subtitle: 'Un historique éprouvé d’exportation de milliers de tonnes de cultures égyptiennes fraîches vers les ports et acheteurs du monde entier.',
    portfolio_stat_shipments: 'Conteneurs & Expéditions',
    portfolio_stat_tonnage: 'Tonnes exportées / an',
    portfolio_stat_countries: 'Pays de destination',
    portfolio_stat_satisfaction: 'Taux de satisfaction client',
    portfolio_filter_all: 'Tous les projets',
    portfolio_filter_europe: 'Europe & Ouest',
    portfolio_filter_gcc: 'Moyen-Orient & Golfe',
    portfolio_filter_asia: 'Asie de l’Est',
    portfolio_filter_americas: 'Royaume-Uni & Amériques',
    portfolio_case_details: 'Détails de l’expédition',
    portfolio_rfq_prompt: 'Prêt à collaborer avec nous pour votre prochaine expédition ?',
    nav_integrity: 'Intégrité des données',
    nav_rfq_btn: 'Demander un devis',
    nav_admin: 'Portail Admin',

    // Logo
    logo_brand_name: 'Avialink',
    logo_export: 'EXPORTATION',
    logo_subtitle: 'EXPORT',
    logo_tagline: 'Des fermes égyptiennes aux marchés mondiaux',

    // Hero
    hero_badge: 'Exportateur agricole égyptien certifié',
    hero_title: 'AviaLink Exportation Agricole',
    hero_subtitle: 'Liaison directe entre les terres fertiles d’Égypte et les marchés mondiaux. Produits frais triés, lavés et calibrés aux normes européennes.',
    hero_btn_rfq: 'Demander un devis d’expédition (RFQ)',
    hero_btn_catalog: 'Explorer le catalogue',
    hero_stat_countries: 'Pays de destination',
    hero_stat_tonnage: 'Tonnes exportées / an',
    hero_stat_compliance: 'Conformité phytosanitaire',
    hero_feat_coldchain: 'Chaîne du froid moderne',
    hero_feat_phytosanitary: 'Certificats phytosanitaires',
    hero_feat_sorting: 'Calibrage optique & poids',
    hero_feat_express: 'Fret maritime express',

    // Product Catalog
    catalog_title: 'Nos produits agricoles frais',
    catalog_subtitle: 'Cultures égyptiennes de qualité supérieure récoltées et emballées selon les exigences des acheteurs mondiaux.',
    catalog_search_ph: 'Rechercher une variété ou catégorie...',
    catalog_cat_all: 'Tous les produits',
    catalog_cat_carrots: 'Carottes & Betteraves',
    catalog_cat_citrus: 'Carottes & Betteraves',
    catalog_cat_potatoes: 'Pommes de terre fraîches',
    catalog_cat_sweet_potatoes: 'Patates douces',
    catalog_cat_onions: 'Oignons & Ail',
    catalog_specs_btn: 'Fiche technique',
    catalog_rfq_btn: 'Demander devis',
    catalog_details_btn: 'Détails complets',
    catalog_moq_label: 'QTE Min (MOQ):',
    catalog_varieties_label: 'Variétés:',
    catalog_origin_badge: 'Origine Égypte',

    // Product Detail
    detail_back: 'Retour au catalogue',
    detail_season: 'Saison d’exportation',
    detail_origin: 'Origine de culture',
    detail_hs_code: 'Code du système harmonisé (SH)',
    detail_specs_title: 'Spécifications techniques certifiées',
    detail_sizes: 'Calibres et tailles disponibles',
    detail_packaging: 'Options d’emballage',
    detail_storage: 'Conditions de réfrigération',
    detail_loading: 'Méthode de chargement des conteneurs',
    detail_certifications: 'Certifications de sécurité disponibles',

    // Trust Center
    trust_badge: 'Qualité, Certification & Traçabilité',
    trust_title: 'Centre de Qualité et Conformité',
    trust_sub: 'AviaLink garantit le respect rigoureux des normes phytosanitaires internationales et le suivi de la chaîne du froid.',
    trust_step1_title: 'Culture contrôlée',
    trust_step1_desc: 'Cultures réalisées sur des sols contrôlés en Égypte avec analyse systématique des résidus MRL.',
    trust_step2_title: 'Tri optique & calibrage',
    trust_step2_desc: 'Centres de conditionnement équipés de trieuses optiques de précision et de systèmes de lavage adaptés.',
    trust_step3_title: 'Contrôle phytosanitaire',
    trust_step3_desc: 'Inspections par la quarantaine végétale égyptienne (CAPQ) et délivrance de certificats officiels.',
    trust_step4_title: 'Préréfrigération & Préparation',
    trust_step4_desc: 'Préréfrigération rapide en station pour préserver la fraîcheur optimale et la qualité du produit.',
    trust_certs_title: 'Certifications de qualité & d’exportation',
    trust_audit_btn: 'Demander le dossier de conformité',

    // Global Markets
    markets_badge: 'Marchés mondiaux & Logistique',
    markets_title: 'De l’Égypte vers les ports internationaux',
    markets_sub: 'Lignes maritimes directes sous température contrôlée vers l’Europe, le Royaume-Uni et le Golfe.',
    markets_ports_label: 'Principaux ports de débarquement',
    markets_transit_label: 'Temps de transit maritime estimé',
    markets_inquire_btn: 'Se renseigner sur la route maritime',
    markets_pipeline_title: 'Les 6 étapes de l’exportation',

    // About
    about_badge: 'Profil d’entreprise & Vision',
    about_title: 'À propos d’AviaLink Exportation Agricole',
    about_sub: 'Relier les terres fertiles d’Égypte aux marchés mondiaux grâce à une qualité certifiée et une chaîne du froid irréprochable.',
    about_mission_title: 'Notre mission d’exportation',
    about_mission_desc: 'Être le partenaire de confiance privilégié entre les producteurs égyptiens et les importateurs mondiaux.',
    about_guarantee_title: 'Garantie de qualité',
    about_guarantee_desc: 'Chaque conteneur fait l’objet d’un contrôle à 100 % avant expédition et d’analyses de laboratoire certifiées.',

    // Contact
    contact_badge: 'Bureau des opérations d’export',
    contact_title: 'Contacter l’équipe AviaLink',
    contact_sub: 'Nos spécialistes sont à votre disposition pour fournir calibres, disponibilités de conteneurs et tarifs de fret.',
    contact_phone_label: 'Téléphone direct / Siège',
    contact_email_label: 'E-mail officiel export',
    contact_wa_label: 'Chat WhatsApp direct',
    contact_rfq_box_title: 'Besoin d’un devis par conteneur ?',
    contact_rfq_box_sub: 'Soumettez votre demande avec le produit, le tonnage et le port de destination.',
    contact_response_time: 'Délai de réponse : sous 24h ouvrées',

    // Footer
    footer_desc: 'AviaLink Exportation Agricole - Reliant les récoltes d’Égypte aux marchés internationaux.',
    footer_rights: 'Tous droits réservés. Égypte.',
    footer_data_log: '[Charte d’intégrité des données]',
    footer_admin_link: 'Portail Admin',

    // RFQ Modal & Multi-Step Wizard
    rfq_title: 'Demande de devis d’exportation officiel (RFQ)',
    rfq_sub: 'Précisez vos critères d’expédition pour recevoir une offre tarifaire EXW/FOB compétitive et la confirmation des conteneurs.',
    rfq_desk_badge: 'Bureau Commercial & Exportation Internationale',
    rfq_step_1_title: 'Profil de l’acheteur & Société',
    rfq_step_2_title: 'Culture & Spécifications',
    rfq_step_3_title: 'Expédition & Logistique',
    rfq_step_4_title: 'Vérification & Confirmation',
    rfq_step_1_sub: 'Coordonnées de l’acheteur et de l’entité d’importation',
    rfq_step_2_sub: 'Sélection de la culture, variété, calibre, emballage et volume',
    rfq_step_3_sub: 'Port de déchargement, Incoterms et date d’expédition cible',
    rfq_step_4_sub: 'Vérification complète de la demande avant transmission',
    
    // Step 1 Fields
    rfq_field_name: 'Nom complet / Responsable achats',
    rfq_name_label: 'Nom complet / Responsable achats',
    rfq_ph_name: 'ex. Jean Dupont / Marc Lambert',
    rfq_field_company: 'Nom de la société importatrice',
    rfq_company_label: 'Nom de la société importatrice',
    rfq_ph_company: 'ex. Société Internationale d’Importation',
    rfq_field_country: 'Pays de destination',
    rfq_country_label: 'Pays de destination',
    rfq_select_country: 'Sélectionnez le pays de destination...',
    rfq_field_email: 'Adresse e-mail professionnelle',
    rfq_email_label: 'Adresse e-mail professionnelle',
    rfq_ph_email: 'achats@entreprise.com',
    rfq_field_phone: 'Téléphone / WhatsApp avec indicatif',
    rfq_phone_label: 'Téléphone / WhatsApp avec indicatif',
    rfq_ph_phone: '+33 6 12 34 56 78',

    // Step 2 Fields
    rfq_field_product: 'Produit agricole demandé',
    rfq_product_label: 'Produit agricole demandé',
    rfq_select_product: 'Choisissez un produit...',
    rfq_field_variety: 'Variété / Cultivar',
    rfq_variety_label: 'Variété / Cultivar',
    rfq_ph_variety: 'ex. Beauregard, Valencia, Spunta...',
    rfq_field_grade: 'Classe de qualité export',
    rfq_grade_label: 'Classe de qualité export',
    rfq_grade_opt_1: 'Classe I (Standard Export)',
    rfq_grade_opt_2: 'Classe Extra (Super Premium)',
    rfq_grade_opt_3: 'Classe II (Industrie / Transformation)',
    rfq_field_size: 'Calibre / Taille / Poids',
    rfq_size_label: 'Calibre / Taille / Poids',
    rfq_ph_size: 'ex. M (250-350g), 45-65mm, count 56/64',
    rfq_field_packaging: 'Options d’emballage souhaitées',
    rfq_packaging_label: 'Options d’emballage souhaitées',
    rfq_select_packaging: 'Sélectionnez l’emballage souhaité...',
    rfq_field_qty: 'Quantité requise',
    rfq_quantity_label: 'Quantité requise',
    rfq_ph_qty: '25',
    rfq_field_unit: 'Unité de mesure',
    rfq_unit_label: 'Unité de mesure',
    rfq_unit_tons: 'Tonnes métriques (MT)',
    rfq_unit_containers: 'Conteneurs frigorifiques 40ft (FCL)',
    rfq_unit_pallets: 'Palettes Europe',
    rfq_field_prod_notes: 'Exigences qualitatives et agronomiques (Optionnel)',
    rfq_prod_notes_label: 'Exigences qualitatives et agronomiques (Optionnel)',
    rfq_ph_prod_notes: 'Taux de Brix, exigences de lavage, contrôle MRL, cire alimentaire...',

    // Step 3 Fields
    rfq_field_port: 'Port de destination / Déchargement',
    rfq_port_label: 'Port de destination / Déchargement',
    rfq_ph_port: 'ex. Port de Rotterdam, Port de Marseille, Hambourg, Djeddah...',
    rfq_field_incoterm: 'Conditions de livraison (Incoterms 2020)',
    rfq_incoterm_label: 'Conditions de livraison (Incoterms 2020)',
    rfq_incoterm_cif: 'CIF - Coût, assurance et fret maritime jusqu’au port d’arrivée',
    rfq_incoterm_cfr: 'CFR - Coût et fret maritime jusqu’au port d’arrivée',
    rfq_incoterm_fob: 'FOB - Franco à bord (Ports maritimes égyptiens)',
    rfq_incoterm_exw: 'EXW - À l’usine (Station de conditionnement Égypte)',
    rfq_incoterm_dap: 'DAP - Rendu au lieu de destination',
    rfq_field_ship_date: 'Date d’embarquement souhaitée',
    rfq_ship_date_label: 'Date d’embarquement souhaitée',
    rfq_ph_ship_date: 'ex. Immédiat, mois prochain, semaine 42...',
    rfq_field_ship_notes: 'Consignes de réfrigération et logistique (Optionnel)',
    rfq_ship_notes_label: 'Consignes de réfrigération et logistique (Optionnel)',
    rfq_ph_ship_notes: 'Température de consigne (+13.5°C), armateur préféré (Maersk/CMA CGM)...',

    // Step 4 & Navigation
    rfq_review_buyer_title: 'Profil de l’acheteur & Société',
    rfq_review_product_title: 'Culture & Spécifications',
    rfq_review_logistics_title: 'Expédition & Conditions commerciales',
    rfq_btn_edit: 'Modifier',
    rfq_btn_next: 'Étape suivante',
    rfq_btn_prev: 'Étape précédente',
    rfq_submit_btn: 'Envoyer la demande de devis',
    rfq_submitting_btn: 'Envoi et chiffrement en cours...',
    rfq_verify_label: 'Contrôle de sécurité anti-spam :',
    rfq_refresh_captcha: 'Actualiser le test de sécurité',
    rfq_consent_note: 'En soumettant cette demande, vous sollicitez un devis officiel auprès d’AviaLink Export. Vos données sont protégées par le secret commercial.',
    rfq_success_title: 'Demande de devis reçue avec succès !',
    rfq_success_lead_id: 'Numéro de référence RFQ :',
    rfq_success_desc: 'Merci pour votre confiance. Notre équipe commerciale étudie vos spécifications et vous transmettra une offre officielle sous 24 heures ouvrées.',
    rfq_btn_close: 'Fermer la fenêtre',
    rfq_btn_new: 'Demander un autre devis',
    rfq_send_whatsapp_btn: 'Envoyer les détails directement sur le WhatsApp enregistré',
    rfq_whatsapp_notice: 'Pour une réponse rapide et un traitement prioritaire, cliquez ci-dessus pour envoyer votre récapitulatif sur notre WhatsApp.',
    admin_view_lead_btn: 'Voir la demande',
    admin_lead_modal_title: 'Détails de la demande de devis export',
    admin_send_to_company_wa: 'Transférer sur le WhatsApp de l’entreprise',
    admin_chat_with_buyer_wa: 'Contacter le client sur WhatsApp',
    admin_copy_lead_details: 'Copier le récapitulatif',
    admin_copied: 'Copié !',
    rfq_channel_admin_confirmed: '✓ Demande enregistrée dans le panneau d’administration export',
    rfq_channel_wa_heading: 'Transmission directe de la demande sur WhatsApp',
    rfq_channel_wa_desc: 'Une fiche récapitulative complète est transmise directement au WhatsApp de la direction export pour traitement prioritaire.',
    rfq_channel_wa_auto_redirecting: 'Ouverture automatique de WhatsApp dans {seconds}s...',
    rfq_channel_wa_opened: 'WhatsApp est ouvert ! Veuillez cliquer sur Envoyer dans l’application pour finaliser l’envoi.',
    rfq_channel_wa_btn_now: 'Envoyer la demande maintenant via WhatsApp',
    rfq_channel_wa_copy_btn: 'Copier le texte',
    rfq_channel_wa_copied: 'Copié dans le presse-papiers !',
    admin_wa_explanation: 'Numéro WhatsApp officiel sur lequel les demandes de devis et alertes RFQ sont transmises dès soumission.',

    // Validations & Aliases
    rfq_err_name: 'Le nom complet doit comporter au moins 2 caractères.',
    rfq_err_company: 'Le nom de l’entreprise est obligatoire.',
    rfq_err_country: 'Veuillez sélectionner le pays de destination.',
    rfq_err_email: 'Veuillez saisir une adresse e-mail valide.',
    rfq_err_phone: 'Veuillez saisir un numéro de téléphone ou WhatsApp valide.',
    rfq_err_product: 'Veuillez sélectionner un produit.',
    rfq_err_qty: 'Veuillez indiquer une quantité supérieure à zéro.',
    rfq_err_port: 'Veuillez préciser le port de destination pour les devis CIF/CFR.',
    rfq_err_captcha: 'Réponse de sécurité incorrecte. Veuillez réessayer.',
    rfq_err_general: 'Erreur lors de l’envoi de la demande. Veuillez réessayer.',
    rfq_field_notes: 'Remarques spécifiques sur les calibres',
    rfq_success_msg: 'Demande envoyée avec succès ! Notre équipe vous recontacte immédiatement.',

    // Spec Sheet Modal
    spec_title: 'Fiche de spécifications techniques',
    spec_download_btn: 'Télécharger la fiche PDF',
    spec_updated: 'Dernière mise à jour :',

    // Admin
    admin_title: 'Tableau de bord de gestion d’export',
    admin_tab_products: 'Gestion des produits',
    admin_tab_leads: 'Demandes de devis',
    admin_add_product_btn: 'Ajouter un produit',
  },

  es: {
    // Nav & General
    nav_home: 'Inicio',
    nav_about: 'Nosotros',
    nav_quality: 'Servicios de Exportación',
    nav_products: 'Nuestros Productos',
    nav_markets: 'Logística de Envío',
    nav_portfolio: 'Historial de Exportaciones',
    nav_contact: 'Contacto',

    // Portfolio
    portfolio_title: 'Historial de Exportaciones y Proyectos',
    portfolio_subtitle: 'Un historial comprobado exportando miles de toneladas de productos frescos egipcios a puertos y compradores de todo el mundo.',
    portfolio_stat_shipments: 'Contenedores y Envíos',
    portfolio_stat_tonnage: 'Toneladas exportadas / año',
    portfolio_stat_countries: 'Países de destino',
    portfolio_stat_satisfaction: 'Tasa de satisfacción del cliente',
    portfolio_filter_all: 'Todos los proyectos',
    portfolio_filter_europe: 'Europa y Occidente',
    portfolio_filter_gcc: 'Golfo Pérsico y Medio Oriente',
    portfolio_filter_asia: 'Asia Oriental',
    portfolio_filter_americas: 'Reino Unido y Américas',
    portfolio_case_details: 'Detalles del envío',
    portfolio_rfq_prompt: '¿Listo para asociarse con nosotros en su próximo envío?',
    nav_integrity: 'Integridad de Datos',
    nav_rfq_btn: 'Solicitar Cotización',
    nav_admin: 'Portal Admin',

    // Logo
    logo_brand_name: 'Avialink',
    logo_export: 'EXPORTACIÓN',
    logo_subtitle: 'EXPORT',
    logo_tagline: 'De las granjas egipcias a los mercados globales',

    // Hero
    hero_badge: 'Exportador Agrícola Egipcio Certificado',
    hero_title: 'AviaLink Exportación Agrícola',
    hero_subtitle: 'Conectando los fértiles suelos de Egipto con los mercados globales. Cultivos frescos seleccionados, lavados y clasificados bajo estándares internacionales.',
    hero_btn_rfq: 'Solicitar Cotización de Envío (RFQ)',
    hero_btn_catalog: 'Ver Catálogo de Productos',
    hero_stat_countries: 'Países de Destino',
    hero_stat_tonnage: 'Toneladas Exportadas / Año',
    hero_stat_compliance: 'Cumplimiento Fitosanitario',
    hero_feat_coldchain: 'Cadena de Frío Moderna',
    hero_feat_phytosanitary: 'Certificados Fitosanitarios',
    hero_feat_sorting: 'Clasificación Óptica y Peso',
    hero_feat_express: 'Flete Marítimo Express',

    // Product Catalog
    catalog_title: 'Nuestros Productos Frescos',
    catalog_subtitle: 'Cultivos egipcios de calidad superior cosechados y empaquetados según las especificaciones de compradores internacionales.',
    catalog_search_ph: 'Buscar variedad o categoría...',
    catalog_cat_all: 'Todos los Cultivos',
    catalog_cat_carrots: 'Zanahorias y Remolachas',
    catalog_cat_citrus: 'Zanahorias y Remolachas',
    catalog_cat_potatoes: 'Patatas / Papas Frescas',
    catalog_cat_sweet_potatoes: 'Batatas / Camotes',
    catalog_cat_onions: 'Cebollas y Ajos',
    catalog_specs_btn: 'Ficha Técnica',
    catalog_rfq_btn: 'Cotizar',
    catalog_details_btn: 'Detalles Completos',
    catalog_moq_label: 'Cantidad Mín (MOQ):',
    catalog_varieties_label: 'Variedades:',
    catalog_origin_badge: 'Origen Egipto',

    // Product Detail
    detail_back: 'Volver al Catálogo',
    detail_season: 'Temporada de Exportación',
    detail_origin: 'Origen de Cultivo',
    detail_hs_code: 'Código Arancelario (HS Code)',
    detail_specs_title: 'Especificaciones Técnicas Certificadas',
    detail_sizes: 'Calibres y Tamaños Disponibles',
    detail_packaging: 'Opciones de Empaque',
    detail_storage: 'Almacenamiento Refrigerado',
    detail_loading: 'Método de Carga en Contenedores',
    detail_certifications: 'Certificaciones Disponibles',

    // Trust Center
    trust_badge: 'Calidad, Certificación y Trazabilidad',
    trust_title: 'Centro de Calidad y Cumplimiento',
    trust_sub: 'AviaLink cumple rigurosamente con las normativas fitosanitarias internacionales y garantiza la integridad de la cadena de frío.',
    trust_step1_title: 'Cultivo Controlado',
    trust_step1_desc: 'Cultivos producidos en tierras analizadas con estricto control de residuos MRL.',
    trust_step2_title: 'Clasificación Óptica',
    trust_step2_desc: 'Plantas de empaque modernas con clasificadoras ópticas y lavado adecuado por tipo de cultivo.',
    trust_step3_title: 'Inspección Fitosanitaria',
    trust_step3_desc: 'Inspección oficial de la Cuarentena Vegetal de Egipto (CAPQ) y emisión de certificados.',
    trust_step4_title: 'Preenfriamiento y Preparación',
    trust_step4_desc: 'Preenfriamiento rápido en plantas de empaque para preservar la frescura y calidad óptima.',
    trust_certs_title: 'Certificaciones de Calidad y Exportación',
    trust_audit_btn: 'Solicitar Informe de Cumplimiento',

    // Global Markets
    markets_badge: 'Mercados Globales y Logística',
    markets_title: 'De Egipto a los Puertos del Mundo',
    markets_sub: 'Líneas marítimas directas refrigeradas a Europa, Reino Unido y el Golfo Pérsico.',
    markets_ports_label: 'Puertos Principales de Llegada',
    markets_transit_label: 'Tiempo Estimado de Tránsito',
    markets_inquire_btn: 'Consultar Ruta Marítima',
    markets_pipeline_title: 'Las 6 Etapas del Proceso de Exportación',

    // About
    about_badge: 'Perfil de la Empresa y Visión',
    about_title: 'Sobre AviaLink Exportación Agrícola',
    about_sub: 'Conectando el rico suelo agrícola de Egipto con los mercados mundiales mediante calidad certficada.',
    about_mission_title: 'Nuestra Misión de Exportación',
    about_mission_desc: 'Ser el socio de confianza principal entre productores egipcios e importadores internacionales.',
    about_guarantee_title: 'Garantía de Calidad e Inspección',
    about_guarantee_desc: 'Cada contenedor es inspeccionado al 100% antes del embarque con análisis certificados.',

    // Contact
    contact_badge: 'Oficina de Operaciones de Exportación',
    contact_title: 'Contacte con AviaLink Export',
    contact_sub: 'Nuestros especialistas están listos para proporcionar calibres, disponibilidad y tarifas de flete.',
    contact_phone_label: 'Teléfono Directo / Sede',
    contact_email_label: 'Correo Oficial de Exportación',
    contact_wa_label: 'Chat de WhatsApp Directo',
    contact_rfq_box_title: '¿Desea solicitar una cotización por contenedor?',
    contact_rfq_box_sub: 'Envíe su solicitud indicando producto, tonelaje y puerto de destino.',
    contact_response_time: 'Tiempo de respuesta: Dentro de 24 horas laborales',

    // Footer
    footer_desc: 'AviaLink Exportación Agrícola - Conectando la calidad de Egipto con los mercados del mundo.',
    footer_rights: 'Todos los derechos reservados. Egipto.',
    footer_data_log: '[Política de Integridad de Datos]',
    footer_admin_link: 'Portal Admin',

    // RFQ Modal & Multi-Step Wizard
    rfq_title: 'Solicitud de Cotización Oficial de Exportación (RFQ)',
    rfq_sub: 'Indique los requisitos del embarque para recibir precios EXW/FOB competitivos y confirmación de contenedores refrigerados.',
    rfq_desk_badge: 'Mesa Comercial de Exportación Internacional',
    rfq_step_1_title: 'Perfil del Comprador y Empresa',
    rfq_step_2_title: 'Producto y Especificaciones',
    rfq_step_3_title: 'Envío y Logística',
    rfq_step_4_title: 'Revisión y Confirmación',
    rfq_step_1_sub: 'Datos de contacto y entidad importadora',
    rfq_step_2_sub: 'Selección de cultivo, variedad, categoría de calidad, empaque y volumen',
    rfq_step_3_sub: 'Puerto de destino, Incoterms y fecha prevista de embarque',
    rfq_step_4_sub: 'Verificación detallada de especificaciones antes del envío final',
    
    // Step 1 Fields
    rfq_field_name: 'Nombre Completo / Encargado de Compras',
    rfq_name_label: 'Nombre Completo / Encargado de Compras',
    rfq_ph_name: 'ej. Carlos Mendoza / Alejandro Silva',
    rfq_field_company: 'Nombre de la Empresa Importadora',
    rfq_company_label: 'Nombre de la Empresa Importadora',
    rfq_ph_company: 'ej. Importadora Global de Alimentos S.A.',
    rfq_field_country: 'País de Destino',
    rfq_country_label: 'País de Destino',
    rfq_select_country: 'Seleccione el país de destino...',
    rfq_field_email: 'Correo Electrónico Corporativo',
    rfq_email_label: 'Correo Electrónico Corporativo',
    rfq_ph_email: 'compras@empresa.com',
    rfq_field_phone: 'Teléfono / WhatsApp con código de país',
    rfq_phone_label: 'Teléfono / WhatsApp con código de país',
    rfq_ph_phone: '+34 600 123 456 o +52 55 1234 5678',

    // Step 2 Fields
    rfq_field_product: 'Cultivo Agrícola Solicitado',
    rfq_product_label: 'Cultivo Agrícola Solicitado',
    rfq_select_product: 'Seleccione un producto...',
    rfq_field_variety: 'Variedad / Cultivar',
    rfq_variety_label: 'Variedad / Cultivar',
    rfq_ph_variety: 'ej. Beauregard, Valencia, Spunta, Cebolla Roja...',
    rfq_field_grade: 'Categoría de Calidad de Exportación',
    rfq_grade_label: 'Categoría de Calidad de Exportación',
    rfq_grade_opt_1: 'Clase I (Estándar de Exportación)',
    rfq_grade_opt_2: 'Clase Extra (Super Premium)',
    rfq_grade_opt_3: 'Clase II (Industrial / Procesamiento)',
    rfq_field_size: 'Calibre / Tamaño / Rango de Peso',
    rfq_size_label: 'Calibre / Tamaño / Rango de Peso',
    rfq_ph_size: 'ej. M (250-350g), 45-65mm, calibre 48/56/64',
    rfq_field_packaging: 'Opciones de Empaque Preferidas',
    rfq_packaging_label: 'Opciones de Empaque Preferidas',
    rfq_select_packaging: 'Seleccione el tipo de empaque...',
    rfq_field_qty: 'Cantidad Requerida',
    rfq_quantity_label: 'Cantidad Requerida',
    rfq_ph_qty: '25',
    rfq_field_unit: 'Unidad de Medida',
    rfq_unit_label: 'Unidad de Medida',
    rfq_unit_tons: 'Toneladas Métricas (MT)',
    rfq_unit_containers: 'Contenedores Refrigerados 40ft (FCL)',
    rfq_unit_pallets: 'Palets Europeos (Euro Pallets)',
    rfq_field_prod_notes: 'Requisitos Adicionales de Calidad (Opcional)',
    rfq_prod_notes_label: 'Requisitos Adicionales de Calidad (Opcional)',
    rfq_ph_prod_notes: 'Nivel de Brix, requisitos de lavado, control MRL, encerado...',

    // Step 3 Fields
    rfq_field_port: 'Puerto de Destino / Desembarque',
    rfq_port_label: 'Puerto de Destino / Desembarque',
    rfq_ph_port: 'ej. Puerto de Rotterdam, Valencia, Algeciras, Hamburgo, Jeddah...',
    rfq_field_incoterm: 'Términos Comerciales de Entrega (Incoterms 2020)',
    rfq_incoterm_label: 'Términos Comerciales de Entrega (Incoterms 2020)',
    rfq_incoterm_cif: 'CIF - Coste, seguro y flete marítimo hasta puerto de destino',
    rfq_incoterm_cfr: 'CFR - Coste y flete marítimo hasta puerto de destino',
    rfq_incoterm_fob: 'FOB - Franco a bordo (Puertos egipcios)',
    rfq_incoterm_exw: 'EXW - En fábrica (Planta de empaque Egipto)',
    rfq_incoterm_dap: 'DAP - Entregado en lugar de destino',
    rfq_field_ship_date: 'Fecha Prevista de Embarque',
    rfq_ship_date_label: 'Fecha Prevista de Embarque',
    rfq_ph_ship_date: 'ej. Inmediato, próximo mes, semana 45...',
    rfq_field_ship_notes: 'Instrucciones Logísticas y de Refrigeración (Opcional)',
    rfq_ship_notes_label: 'Instrucciones Logísticas y de Refrigeración (Opcional)',
    rfq_ph_ship_notes: 'Temperatura de ajuste (+13.5°C), naviera de preferencia (Maersk/MSC)...',

    // Step 4 & Navigation
    rfq_review_buyer_title: 'Perfil del Comprador y Empresa',
    rfq_review_product_title: 'Producto y Especificaciones',
    rfq_review_logistics_title: 'Envío y Términos Comerciales',
    rfq_btn_edit: 'Modificar',
    rfq_btn_next: 'Siguiente Paso',
    rfq_btn_prev: 'Paso Anterior',
    rfq_submit_btn: 'Enviar Solicitud de Cotización',
    rfq_submitting_btn: 'Transmitiendo y Cifrando...',
    rfq_verify_label: 'Verificación de Seguridad Anti-Spam:',
    rfq_refresh_captcha: 'Actualizar desafío de seguridad',
    rfq_consent_note: 'Al enviar este formulario, usted solicita una cotización formal de AviaLink Export. Sus datos están protegidos bajo estricta confidencialidad comercial.',
    rfq_success_title: '¡Solicitud de Cotización Recibida con Éxito!',
    rfq_success_lead_id: 'Referencia de Cotización:',
    rfq_success_desc: 'Gracias por su consulta. Nuestro equipo comercial analizará sus requerimientos y le enviará una oferta formal en menos de 24 horas laborales.',
    rfq_btn_close: 'Cerrar Ventana',
    rfq_btn_new: 'Solicitar Otra Cotización',
    rfq_send_whatsapp_btn: 'Enviar detalles directamente al WhatsApp registrado',
    rfq_whatsapp_notice: 'Para una respuesta inmediata y seguimiento comercial, haga clic arriba para enviar el resumen a nuestro WhatsApp.',
    admin_view_lead_btn: 'Ver solicitud',
    admin_lead_modal_title: 'Detalles de la solicitud de cotización',
    admin_send_to_company_wa: 'Reenviar al WhatsApp de la empresa',
    admin_chat_with_buyer_wa: 'Contactar al cliente por WhatsApp',
    admin_copy_lead_details: 'Copiar resumen',
    admin_copied: '¡Copiado!',
    rfq_channel_admin_confirmed: '✓ Solicitud guardada en el panel de administración de exportación',
    rfq_channel_wa_heading: 'Transmisión directa del pedido a WhatsApp de Exportación',
    rfq_channel_wa_desc: 'Se envía un resumen detallado con especificaciones directamente al WhatsApp de operaciones comerciales.',
    rfq_channel_wa_auto_redirecting: 'Abriendo WhatsApp automáticamente en {seconds}s...',
    rfq_channel_wa_opened: '¡WhatsApp abierto! Haga clic en Enviar dentro de la aplicación para confirmar.',
    rfq_channel_wa_btn_now: 'Enviar pedido ahora por WhatsApp',
    rfq_channel_wa_copy_btn: 'Copiar texto',
    rfq_channel_wa_copied: '¡Copiado al portapapeles!',
    admin_wa_explanation: 'Número oficial de WhatsApp donde se recibirán las solicitudes de cotización de clientes inmediatamente.',

    // Validations & Aliases
    rfq_err_name: 'El nombre completo debe tener al menos 2 caracteres.',
    rfq_err_company: 'El nombre de la empresa es obligatorio.',
    rfq_err_country: 'Por favor seleccione el país de destino.',
    rfq_err_email: 'Por favor ingrese un correo electrónico válido.',
    rfq_err_phone: 'Por favor ingrese un teléfono o WhatsApp válido con código de país.',
    rfq_err_product: 'Por favor seleccione un producto.',
    rfq_err_qty: 'Por favor ingrese una cantidad numérica mayor a 0.',
    rfq_err_port: 'Por favor indique el puerto de destino para cotizaciones CIF/CFR.',
    rfq_err_captcha: 'Respuesta de seguridad incorrecta. Inténtelo de nuevo.',
    rfq_err_general: 'Error al enviar la solicitud. Inténtelo de nuevo.',
    rfq_field_notes: 'Notas Específicas de Calibre o Especificaciones',
    rfq_success_msg: '¡Solicitud enviada con éxito! Nuestro departamento de exportación se pondrá en contacto de inmediato.',

    // Spec Sheet Modal
    spec_title: 'Ficha de Especificaciones Técnicas',
    spec_download_btn: 'Descargar PDF de Especificaciones',
    spec_updated: 'Última actualización:',

    // Admin
    admin_title: 'Panel de Control de Exportaciones',
    admin_tab_products: 'Gestión de Productos',
    admin_tab_leads: 'Cotizaciones Recibidas',
    admin_add_product_btn: 'Agregar Nuevo Producto',
  },

  de: {
    // Nav & General
    nav_home: 'Startseite',
    nav_about: 'Über uns',
    nav_quality: 'Exportdienste',
    nav_products: 'Produkte',
    nav_markets: 'Versandlogistik',
    nav_portfolio: 'Export-Erfolgsbilanz',
    nav_contact: 'Kontakt',

    // Portfolio
    portfolio_title: 'Export-Erfolgsbilanz & Projekte',
    portfolio_subtitle: 'Eine bewährte Erfolgsbilanz beim Export von Tausenden Tonnen frischer ägyptischer Erzeugnisse an Häfen und Käufer weltweit.',
    portfolio_stat_shipments: 'Container & Lieferungen',
    portfolio_stat_tonnage: 'Jährlich exportierte Tonnen',
    portfolio_stat_countries: 'Zielländer',
    portfolio_stat_satisfaction: 'Kundenzufriedenheitsrate',
    portfolio_filter_all: 'Alle Projekte',
    portfolio_filter_europe: 'Europa & Westen',
    portfolio_filter_gcc: 'Golfregion & Naher Osten',
    portfolio_filter_asia: 'Ostasien',
    portfolio_filter_americas: 'GB & Amerika',
    portfolio_case_details: 'Lieferdetails',
    portfolio_rfq_prompt: 'Bereit für die Zusammenarbeit bei Ihrer nächsten Lieferung?',
    nav_integrity: 'Datenintegrität',
    nav_rfq_btn: 'Angebot anfordern',
    nav_admin: 'Admin-Portal',

    // Logo
    logo_brand_name: 'Avialink',
    logo_export: 'EXPORT',
    logo_subtitle: 'EXPORT',
    logo_tagline: 'Von ägyptischen Farmen zu den Weltmärkten',

    // Hero
    hero_badge: 'Zertifizierter ägyptischer Agrar-Exporteur',
    hero_title: 'AviaLink Agrar-Export',
    hero_subtitle: 'Verbindung zwischen fruchtbaren ägyptischen Böden und globalen Märkten. Erstklassige, gewaschene und sortierte Erzeugnisse nach europäischen Standards.',
    hero_btn_rfq: 'Versandangebot anfordern (RFQ)',
    hero_btn_catalog: 'Produktkatalog durchsuchen',
    hero_stat_countries: 'Zielländer',
    hero_stat_tonnage: 'Jährlich exportierte Tonnen',
    hero_stat_compliance: 'Pflanzenschutz-Konformität',
    hero_feat_coldchain: 'Moderne Kühlkette',
    hero_feat_phytosanitary: 'Pflanzenschutzzeugnisse',
    hero_feat_sorting: 'Optische Sortierung & Gewicht',
    hero_feat_express: 'Express-Seefracht',

    // Product Catalog
    catalog_title: 'Unser Frische-Portfolio',
    catalog_subtitle: 'Hochwertige ägyptische Erzeugnisse, geerntet und verpackt nach den Standards internationaler Käufer.',
    catalog_search_ph: 'Sorte oder Kategorie suchen...',
    catalog_cat_all: 'Alle Erzeugnisse',
    catalog_cat_carrots: 'Möhren & Rote Bete',
    catalog_cat_citrus: 'Möhren & Rote Bete',
    catalog_cat_potatoes: 'Frische Kartoffeln',
    catalog_cat_sweet_potatoes: 'Süßkartoffeln',
    catalog_cat_onions: 'Zwiebeln & Knoblauch',
    catalog_specs_btn: 'Tech-Spezifikation',
    catalog_rfq_btn: 'Angebot anfragen',
    catalog_details_btn: 'Vollständige Details',
    catalog_moq_label: 'Mindestmenge (MOQ):',
    catalog_varieties_label: 'Sorten:',
    catalog_origin_badge: 'Herkunft Ägypten',

    // Product Detail
    detail_back: 'Zurück zum Katalog',
    detail_season: 'Exportsaison',
    detail_origin: 'Anbaugebiet',
    detail_hs_code: 'Zolltarifnummer (HS-Code)',
    detail_specs_title: 'Zertifizierte technische Spezifikationen',
    detail_sizes: 'Verfügbare Kaliber & Größen',
    detail_packaging: 'Verpackungsoptionen',
    detail_storage: 'Kühllagerung & Temperatur',
    detail_loading: 'Container-Verlademethode',
    detail_certifications: 'Verfügbare Exportzertifikate',

    // Trust Center
    trust_badge: 'Qualität, Zertifizierung & Rückverfolgbarkeit',
    trust_title: 'Zentrum für Qualität und Konformität',
    trust_sub: 'AviaLink hält strikte internationale Gesundheits- und Anbaustandards mit vollständiger Pflanzenschutzprüfung ein.',
    trust_step1_title: 'Kontrollierter Anbau',
    trust_step1_desc: 'Anbau auf geprüften Böden mit strenger MRL-Rückstandskontrolle.',
    trust_step2_title: 'Optische Sortierung',
    trust_step2_desc: 'Moderne Verpackungsanlagen mit präziser Kalibersortierung und passender Wäsche.',
    trust_step3_title: 'Pflanzenschutzprüfung',
    trust_step3_desc: 'Amtliche Prüfung durch die ägyptische Pflanzenquarantäne (CAPQ) und Ausstellung von Zertifikaten.',
    trust_step4_title: 'Vorkühlung & Vorbereitung',
    trust_step4_desc: 'Schnelle Vorkühlung in Packstationen zur Erhaltung der optimalen Erntefrische und Qualität.',
    trust_certs_title: 'Qualitäts- & Exportzertifikate',
    trust_audit_btn: 'Audit-Akte anfordern',

    // Global Markets
    markets_badge: 'Globale Märkte & Logistik',
    markets_title: 'Von Ägypten zu den Häfen der Welt',
    markets_sub: 'Direkte temperaturgeführte Schifffahrtskorridore nach Europa, Großbritannien und in die Golfregion.',
    markets_ports_label: 'Haupt-Entladehäfen',
    markets_transit_label: 'Geschätzte Seefracht-Transitzeit',
    markets_inquire_btn: 'Versandroute anfragen',
    markets_pipeline_title: 'Der 6-stufige Exportprozess',

    // About
    about_badge: 'Unternehmensprofil & Vision',
    about_title: 'Über AviaLink Agrar-Export',
    about_sub: 'Verbindung fruchtbarer ägyptischer Agrarböden mit weltweiten Märkten durch zertifizierte Qualität.',
    about_mission_title: 'Unsere Exportmission',
    about_mission_desc: 'Der bevorzugte, verlässliche Partner zwischen ägyptischen Erzeugern und internationalen Importeuren zu sein.',
    about_guarantee_title: 'Qualitätsgarantie',
    about_guarantee_desc: 'Jeder Container wird vor der Verladung zu 100 % geprüft und im Labor zertifiziert.',

    // Contact
    contact_badge: 'Export-Abwicklung',
    contact_title: 'AviaLink Export-Team kontaktieren',
    contact_sub: 'Unsere Handelsspezialisten bieten Ihnen umgehend Kaliber-Spezifikationen, Containerverfügbarkeit und Frachtpreise.',
    contact_phone_label: 'Direkttelefon / Zentrale',
    contact_email_label: 'Offizielle Export-E-Mail',
    contact_wa_label: 'Direkter WhatsApp-Chat',
    contact_rfq_box_title: 'Möchten Sie ein Container-Angebot anfordern?',
    contact_rfq_box_sub: 'Senden Sie Ihre Anfrage mit Erzeugnis, Tonnage und Zielhafen.',
    contact_response_time: 'Antwortzeit: Innerhalb von 24 Arbeitsstunden',

    // Footer
    footer_desc: 'AviaLink Agrar-Export - Verknüpfung ägyptischer Erntequalität mit weltweiten Märkten.',
    footer_rights: 'Alle Rechte vorbehalten. Ägypten.',
    footer_data_log: '[Datenintegritäts-Richtlinie]',
    footer_admin_link: 'Admin-Portal',

    // RFQ Modal & Multi-Step Wizard
    rfq_title: 'Offizielle Export-Angebotsanfrage (RFQ)',
    rfq_sub: 'Geben Sie Ihre Frachtdaten ein, um verbindliche EXW/FOB-Preise und gesicherte Kühlcontainer-Slots zu erhalten.',
    rfq_desk_badge: 'Handelsabteilung & Internationales Exportbüro',
    rfq_step_1_title: 'Käufer- & Unternehmensprofil',
    rfq_step_2_title: 'Erzeugnis & Spezifikationen',
    rfq_step_3_title: 'Versand & Logistik',
    rfq_step_4_title: 'Überprüfung & Bestätigung',
    rfq_step_1_sub: 'Kontaktdaten des Einkäufers und des Importunternehmens',
    rfq_step_2_sub: 'Auswahl von Erzeugnis, Sorte, Güteklasse, Verpackung und Bestellvolumen',
    rfq_step_3_sub: 'Zielhafen, Incoterms und gewünschtes Versandzeitfenster',
    rfq_step_4_sub: 'Detaillierte Spezifikationsprüfung vor der endgültigen Übermittlung',
    
    // Step 1 Fields
    rfq_field_name: 'Vollständiger Name / Einkauf',
    rfq_name_label: 'Vollständiger Name / Einkauf',
    rfq_ph_name: 'z.B. Klaus Müller / Michael Schmidt',
    rfq_field_company: 'Importunternehmen / Firmenname',
    rfq_company_label: 'Importunternehmen / Firmenname',
    rfq_ph_company: 'z.B. Internationale Agrarhandel GmbH',
    rfq_field_country: 'Zielland / Bestimmungsland',
    rfq_country_label: 'Zielland / Bestimmungsland',
    rfq_select_country: 'Zielland auswählen...',
    rfq_field_email: 'Geschäftliche E-Mail-Adresse',
    rfq_email_label: 'Geschäftliche E-Mail-Adresse',
    rfq_ph_email: 'einkauf@unternehmen.de',
    rfq_field_phone: 'Telefon / WhatsApp mit Ländervorwahl',
    rfq_phone_label: 'Telefon / WhatsApp mit Ländervorwahl',
    rfq_ph_phone: '+49 170 1234567 oder +41 79 1234567',

    // Step 2 Fields
    rfq_field_product: 'Gewünschtes Agrar-Erzeugnis',
    rfq_product_label: 'Gewünschtes Agrar-Erzeugnis',
    rfq_select_product: 'Erzeugnis auswählen...',
    rfq_field_variety: 'Sorte / Kultivar',
    rfq_variety_label: 'Sorte / Kultivar',
    rfq_ph_variety: 'z.B. Beauregard, Valencia, Spunta, Rote Zwiebeln...',
    rfq_field_grade: 'Export-Güteklasse',
    rfq_grade_label: 'Export-Güteklasse',
    rfq_grade_opt_1: 'Klasse I (Standard Export)',
    rfq_grade_opt_2: 'Klasse Extra (Super Premium)',
    rfq_grade_opt_3: 'Klasse II (Verarbeitung / Industrie)',
    rfq_field_size: 'Kaliber / Größe / Gewicht',
    rfq_size_label: 'Kaliber / Größe / Gewicht',
    rfq_ph_size: 'z.B. M (250-350g), 45-65mm, 48/56/64 count',
    rfq_field_packaging: 'Bevorzugte Verpackung',
    rfq_packaging_label: 'Bevorzugte Verpackung',
    rfq_select_packaging: 'Verpackungsart auswählen...',
    rfq_field_qty: 'Benötigte Menge',
    rfq_quantity_label: 'Benötigte Menge',
    rfq_ph_qty: '25',
    rfq_field_unit: 'Maßeinheit',
    rfq_unit_label: 'Maßeinheit',
    rfq_unit_tons: 'Metrische Tonnen (MT)',
    rfq_unit_containers: '40ft Kühlcontainer (Reefer FCL)',
    rfq_unit_pallets: 'Europaletten',
    rfq_field_prod_notes: 'Zusätzliche Qualitäts- und Prüfvorgaben (Optional)',
    rfq_prod_notes_label: 'Zusätzliche Qualitäts- und Prüfvorgaben (Optional)',
    rfq_ph_prod_notes: 'Brix-Gehalt, Waschzustand, MRL-Rückstandskontrolle, Wachsung...',

    // Step 3 Fields
    rfq_field_port: 'Ziel- / Entladehafen',
    rfq_port_label: 'Ziel- / Entladehafen',
    rfq_ph_port: 'z.B. Hafen Hamburg, Rotterdam, Bremerhaven, Dschidda...',
    rfq_field_incoterm: 'Handelsklauseln (Incoterms 2020)',
    rfq_incoterm_label: 'Handelsklauseln (Incoterms 2020)',
    rfq_incoterm_cif: 'CIF - Kosten, Versicherung und Seefracht bis zum Bestimmungshafen',
    rfq_incoterm_cfr: 'CFR - Kosten und Seefracht bis zum Bestimmungshafen',
    rfq_incoterm_fob: 'FOB - Frei an Bord (ägyptische Seehäfen)',
    rfq_incoterm_exw: 'EXW - Ab Werk (Packstation Ägypten)',
    rfq_incoterm_dap: 'DAP - Geliefert benannter Ort',
    rfq_field_ship_date: 'Gewünschtes Verladedatum',
    rfq_ship_date_label: 'Gewünschtes Verladedatum',
    rfq_ph_ship_date: 'z.B. Sofort, nächster Monat, Kalenderwoche 45...',
    rfq_field_ship_notes: 'Kühlketten- und Logistikhinweise (Optional)',
    rfq_ship_notes_label: 'Kühlketten- und Logistikhinweise (Optional)',
    rfq_ph_ship_notes: 'Kühltemperatur (+13.5°C), bevorzugte Reederei (Maersk / Hapag-Lloyd / MSC)...',

    // Step 4 & Navigation
    rfq_review_buyer_title: 'Käufer- & Unternehmensprofil',
    rfq_review_product_title: 'Erzeugnis & Spezifikationen',
    rfq_review_logistics_title: 'Versand & Handelsbedingungen',
    rfq_btn_edit: 'Bearbeiten',
    rfq_btn_next: 'Nächster Schritt',
    rfq_btn_prev: 'Vorheriger Schritt',
    rfq_submit_btn: 'Export-Anfrage absenden',
    rfq_submitting_btn: 'Übermittlung läuft...',
    rfq_verify_label: 'Sicherheitsprüfung gegen Spam:',
    rfq_refresh_captcha: 'Sicherheitsaufgabe erneuern',
    rfq_consent_note: 'Mit dem Absenden fordern Sie ein offizielles Handelsangebot von AviaLink Agrar-Export an. Ihre Daten unterliegen strenger Vertraulichkeit.',
    rfq_success_title: 'Anfrage erfolgreich eingegangen!',
    rfq_success_lead_id: 'Anfrage-Referenznummer:',
    rfq_success_desc: 'Vielen Dank für Ihre Anfrage. Unser Export-Team prüft Ihre Spezifikationen und wird Ihnen innerhalb von 24 Arbeitsstunden ein verbindliches Angebot zusenden.',
    rfq_btn_close: 'Fenster schließen',
    rfq_btn_new: 'Weitere Anfrage stellen',
    rfq_send_whatsapp_btn: 'Bestelldetails direkt an registriertes WhatsApp senden',
    rfq_whatsapp_notice: 'Für eine sofortige Antwort klicken Sie oben, um die Zusammenfassung an unser Export-WhatsApp zu senden.',
    admin_view_lead_btn: 'Anfrage ansehen',
    admin_lead_modal_title: 'Details der Export-Preisanfrage',
    admin_send_to_company_wa: 'An Firmen-WhatsApp weiterleiten',
    admin_chat_with_buyer_wa: 'Käufer auf WhatsApp kontaktieren',
    admin_copy_lead_details: 'Zusammenfassung kopieren',
    admin_copied: 'Kopiert!',
    rfq_channel_admin_confirmed: '✓ Anfrage erfolgreich im Export-Admin-Panel protokolliert',
    rfq_channel_wa_heading: 'Direkte Übermittlung an Export-WhatsApp',
    rfq_channel_wa_desc: 'Ein vollständiges Spezifikationsblatt wird für eine unmittelbare Bearbeitung an das WhatsApp unserer Exportleitung übertragen.',
    rfq_channel_wa_auto_redirecting: 'WhatsApp-Chat wird automatisch in {seconds}s geöffnet...',
    rfq_channel_wa_opened: 'WhatsApp-Fenster geöffnet! Bitte klicken Sie in der App auf Senden.',
    rfq_channel_wa_btn_now: 'Bestellung jetzt per WhatsApp senden',
    rfq_channel_wa_copy_btn: 'Text kopieren',
    rfq_channel_wa_copied: 'In Zwischenablage kopiert!',
    admin_wa_explanation: 'Offizielle Firmen-WhatsApp-Nummer, an die Kundenanfragen und Bestellbenachrichtigungen weitergeleitet werden.',

    // Validations & Aliases
    rfq_err_name: 'Der vollständige Name muss mindestens 2 Zeichen lang sein.',
    rfq_err_company: 'Der Unternehmensname ist erforderlich.',
    rfq_err_country: 'Bitte wählen Sie das Bestimmungsland aus.',
    rfq_err_email: 'Bitte geben Sie eine gültige geschäftliche E-Mail-Adresse ein.',
    rfq_err_phone: 'Bitte geben Sie eine gültige Telefonnummer mit Ländervorwahl an.',
    rfq_err_product: 'Bitte wählen Sie ein Erzeugnis aus.',
    rfq_err_qty: 'Bitte geben Sie eine Menge größer als 0 ein.',
    rfq_err_port: 'Bitte geben Sie den Zielhafen für CIF/CFR-Anfragen an.',
    rfq_err_captcha: 'Falsche Sicherheitsantwort. Bitte versuchen Sie es erneut.',
    rfq_err_general: 'Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut.',
    rfq_field_notes: 'Besondere Anmerkungen zu Kalibern oder Spezifikationen',
    rfq_success_msg: 'Anfrage erfolgreich übermittelt! Unser Export-Team wird Sie umgehend kontaktieren.',

    // Spec Sheet Modal
    spec_title: 'Technisches Spezifikationsblatt',
    spec_download_btn: 'Spezifikations-PDF herunterladen',
    spec_updated: 'Letzte Aktualisierung:',

    // Admin
    admin_title: 'Export-Management-Dashboard',
    admin_tab_products: 'Produkt-Manager',
    admin_tab_leads: 'Anfragen & Angebote',
    admin_add_product_btn: 'Neues Erzeugnis hinzufügen',
  },

  ru: {
    // Nav & General
    nav_home: 'Главная',
    nav_about: 'О нас',
    nav_quality: 'Экспортные услуги',
    nav_products: 'Продукция',
    nav_markets: 'Логистика и доставка',
    nav_portfolio: 'Экспортное портфолио',
    nav_contact: 'Контакты',

    // Portfolio
    portfolio_title: 'Экспортное портфолио и проекты',
    portfolio_subtitle: 'Подтвержденный опыт экспортных поставок тысяч тонн свежей египетской продукции в порты и покупателям по всему миру.',
    portfolio_stat_shipments: 'Контейнеры и поставки',
    portfolio_stat_tonnage: 'Экспортировано тонн в год',
    portfolio_stat_countries: 'Страны назначения',
    portfolio_stat_satisfaction: 'Уровень удовлетворенности',
    portfolio_filter_all: 'Все проекты',
    portfolio_filter_europe: 'Европа и Запад',
    portfolio_filter_gcc: 'Залив и Ближний Восток',
    portfolio_filter_asia: 'Восточная Азия',
    portfolio_filter_americas: 'Великобритания и Америка',
    portfolio_case_details: 'Детали поставки',
    portfolio_rfq_prompt: 'Готовы к сотрудничеству для вашей следующей поставки?',
    nav_integrity: 'Целостность данных',
    nav_rfq_btn: 'Запросить расчет цены',
    nav_admin: 'Админ-панель',

    // Logo
    logo_brand_name: 'Avialink',
    logo_export: 'ЭКСПОРТ',
    logo_subtitle: 'ЭКСПОРТ',
    logo_tagline: 'От египетских полей к мировым рынкам',

    // Hero
    hero_badge: 'Сертифицированный экспортер сельхозпродукции Египта',
    hero_title: 'AviaLink Экспорт Сельхозпродукции',
    hero_subtitle: 'Прямые поставки свежего урожая с плодородных земель Египта на мировые рынки. Калиброванная и мытая продукция по европейским стандартам качества.',
    hero_btn_rfq: 'Запросить коммерческое предложение (RFQ)',
    hero_btn_catalog: 'Каталог продукции',
    hero_stat_countries: 'Стран назначения',
    hero_stat_tonnage: 'Тонн экспорта в год',
    hero_stat_compliance: 'Фитосанитарный контроль',
    hero_feat_coldchain: 'Современная хладоцепь',
    hero_feat_phytosanitary: 'Фитосанитарные сертификаты',
    hero_feat_sorting: 'Оптическая сортировка и вес',
    hero_feat_express: 'Экспресс морская доставка',

    // Product Catalog
    catalog_title: 'Свежая сельхозпродукция Египта',
    catalog_subtitle: 'Высококачественный урожай, отсортированный и упакованный по международным требованиям закупщиков.',
    catalog_search_ph: 'Поиск сорта или категории...',
    catalog_cat_all: 'Вся продукция',
    catalog_cat_carrots: 'Морковь и свекла',
    catalog_cat_citrus: 'Морковь и свекла',
    catalog_cat_potatoes: 'Свежий картофель',
    catalog_cat_sweet_potatoes: 'Батат (сладкий картофель)',
    catalog_cat_onions: 'Лук и чеснок',
    catalog_specs_btn: 'Спецификация',
    catalog_rfq_btn: 'Запросить цену',
    catalog_details_btn: 'Подробнее',
    catalog_moq_label: 'Мин. заказ (MOQ):',
    catalog_varieties_label: 'Сорта:',
    catalog_origin_badge: 'Происхождение: Египет',

    // Product Detail
    detail_back: 'Назад в каталог',
    detail_season: 'Сезон экспорта',
    detail_origin: 'Регион выращивания',
    detail_hs_code: 'Код ТН ВЭД (HS Code)',
    detail_specs_title: 'Сертифицированные технические характеристики',
    detail_sizes: 'Доступные калибры и размеры',
    detail_packaging: 'Варианты упаковки',
    detail_storage: 'Температурный режим хранения',
    detail_loading: 'Способ погрузки контейнеров',
    detail_certifications: 'Доступные сертификаты качества',

    // Trust Center
    trust_badge: 'Качество, сертификация и прослеживаемость',
    trust_title: 'Центр качества и фитосанитарии',
    trust_sub: 'AviaLink строго соблюдает международные требования фитосанитарного контроля и обеспечивает непрерывность холодовой цепи.',
    trust_step1_title: 'Контролируемое выращивание',
    trust_step1_desc: 'Выращивание на сертифицированных почвах с контролем пестицидов и норм MRL.',
    trust_step2_title: 'Оптическая сортировка',
    trust_step2_desc: 'Современные упаковочные комплексы с автоматической калибровкой и мытьем.',
    trust_step3_title: 'Фитосанитарная инспекция',
    trust_step3_desc: 'Официальный инспекционный контроль карантинной службы Египта (CAPQ).',
    trust_step4_title: 'Предварительное охлаждение',
    trust_step4_desc: 'Быстрое предварительное охлаждение на упаковочных комплексах для сохранения свежести урожая.',
    trust_certs_title: 'Сертификаты качества и экспорта',
    trust_audit_btn: 'Запросить аудит соответствия',

    // Global Markets
    markets_badge: 'Мировые рынки и логистика',
    markets_title: 'Из Египта во все порты мира',
    markets_sub: 'Прямые рефрижераторные маршруты в Европу, Великобританию и страны Персидского залива.',
    markets_ports_label: 'Основные порты назначения',
    markets_transit_label: 'Ориентировочное время морского транзита',
    markets_inquire_btn: 'Узнать подробности маршрута',
    markets_pipeline_title: '6 этапов процесса экспорта',

    // About
    about_badge: 'О компании и видение',
    about_title: 'О компании AviaLink Экспорт',
    about_sub: 'Соединяя богатые земли Египта с мировыми рынками через гарантированное качество.',
    about_mission_title: 'Наша миссия',
    about_mission_desc: 'Быть надежным мостом между египетскими производителями и международными импортерами.',
    about_guarantee_title: 'Гарантия качества',
    about_guarantee_desc: '100% инспекционный контроль каждого контейнера перед погрузкой.',

    // Contact
    contact_badge: 'Отдел экспортных операций',
    contact_title: 'Связаться с AviaLink Export',
    contact_sub: 'Наши специалисты готовы предоставить информацию о калибрах, наличии контейнеров и ставках фрахта.',
    contact_phone_label: 'Прямой телефон / Офис',
    contact_email_label: 'Официальная почта экспорта',
    contact_wa_label: 'Прямой чат в WhatsApp',
    contact_rfq_box_title: 'Хотите запросить расчет цены на контейнер?',
    contact_rfq_box_sub: 'Отправьте запрос с указанием культуры, тоннажа и порта назначения.',
    contact_response_time: 'Время ответа: В течение 24 рабочих часов',

    // Footer
    footer_desc: 'AviaLink Экспорт - Высококачественные урожаи Египта для мировых рынков.',
    footer_rights: 'Все права защищены. Египет.',
    footer_data_log: '[Политика целостности данных]',
    footer_admin_link: 'Панель администратора',

    // RFQ Modal & Multi-Step Wizard
    rfq_title: 'Запрос официального коммерческого предложения (RFQ)',
    rfq_sub: 'Укажите параметры поставки для получения расчетной цены EXW/FOB и подтверждения слотов в рефконтейнерах.',
    rfq_desk_badge: 'Коммерческий отдел международного экспорта AviaLink',
    rfq_step_1_title: 'Профиль покупателя и компании',
    rfq_step_2_title: 'Культура и спецификации',
    rfq_step_3_title: 'Доставка и логистика',
    rfq_step_4_title: 'Проверка и подтверждение',
    rfq_step_1_sub: 'Контактные данные закупщика и компании-импортера',
    rfq_step_2_sub: 'Выбор культуры, сорта, категории качества, упаковки и объема',
    rfq_step_3_sub: 'Порт назначения, Инкотермс и планируемый период отгрузки',
    rfq_step_4_sub: 'Итоговая проверка спецификации перед отправкой в отдел экспорта',
    
    // Step 1 Fields
    rfq_field_name: 'ФИО / Ответственный за закупки',
    rfq_name_label: 'ФИО / Ответственный за закупки',
    rfq_ph_name: 'напр. Алексей Иванов / Дмитрий Смирнов',
    rfq_field_company: 'Компания-импортер',
    rfq_company_label: 'Компания-импортер',
    rfq_ph_company: 'напр. ООО «Международный Агроимпорт»',
    rfq_field_country: 'Страна назначения',
    rfq_country_label: 'Страна назначения',
    rfq_select_country: 'Выберите страну назначения...',
    rfq_field_email: 'Корпоративная электронная почта',
    rfq_email_label: 'Корпоративная электронная почта',
    rfq_ph_email: 'procurement@company.com',
    rfq_field_phone: 'Телефон / WhatsApp с кодом страны',
    rfq_phone_label: 'Телефон / WhatsApp с кодом страны',
    rfq_ph_phone: '+7 999 123-45-67 или +971 50 123 4567',

    // Step 2 Fields
    rfq_field_product: 'Запрашиваемая агрокультура',
    rfq_product_label: 'Запрашиваемая агрокультура',
    rfq_select_product: 'Выберите культуру из каталога...',
    rfq_field_variety: 'Сорт / Культивар',
    rfq_variety_label: 'Сорт / Культивар',
    rfq_ph_variety: 'напр. Бьюргард, Валенсия, Спунта, красный лук...',
    rfq_field_grade: 'Категория качества экспорта',
    rfq_grade_label: 'Категория качества экспорта',
    rfq_grade_opt_1: 'Класс I (Экспортный стандарт)',
    rfq_grade_opt_2: 'Класс Экстра (Супер Премиум)',
    rfq_grade_opt_3: 'Класс II (Переработка / Столовый)',
    rfq_field_size: 'Калибр / Размер / Диапазон веса',
    rfq_size_label: 'Калибр / Размер / Диапазон веса',
    rfq_ph_size: 'напр. M (250-350г), 45-65мм, калибр 48/56/64',
    rfq_field_packaging: 'Предпочитаемая упаковка',
    rfq_packaging_label: 'Предпочитаемая упаковка',
    rfq_select_packaging: 'Выберите вид упаковки...',
    rfq_field_qty: 'Необходимый объем',
    rfq_quantity_label: 'Необходимый объем',
    rfq_ph_qty: '25',
    rfq_field_unit: 'Единица измерения',
    rfq_unit_label: 'Единица измерения',
    rfq_unit_tons: 'Метрические тонны (MT)',
    rfq_unit_containers: '40-футовые рефконтейнеры (FCL)',
    rfq_unit_pallets: 'Евро-паллеты',
    rfq_field_prod_notes: 'Дополнительные требования к качеству (Опционально)',
    rfq_prod_notes_label: 'Дополнительные требования к качеству (Опционально)',
    rfq_ph_prod_notes: 'Уровень Brix, требования к мойке, контроль пестицидов MRL, воскование...',

    // Step 3 Fields
    rfq_field_port: 'Порт назначения / Выгрузки',
    rfq_port_label: 'Порт назначения / Выгрузки',
    rfq_ph_port: 'напр. Порт Роттердам, Новороссийск, Джидда, Джебель-Али, Гамбург...',
    rfq_field_incoterm: 'Условия поставки (Инкотермс 2020)',
    rfq_incoterm_label: 'Условия поставки (Инкотермс 2020)',
    rfq_incoterm_cif: 'CIF - Стоимость, страхование и морской фрахт до порта назначения',
    rfq_incoterm_cfr: 'CFR - Стоимость и морской фрахт до порта назначения',
    rfq_incoterm_fob: 'FOB - Франко-борт (Морские порты Египта)',
    rfq_incoterm_exw: 'EXW - Франко-завод (Упаковочный комплекс Египет)',
    rfq_incoterm_dap: 'DAP - Поставка в место назначения',
    rfq_field_ship_date: 'Желаемый период отгрузки',
    rfq_ship_date_label: 'Желаемый период отгрузки',
    rfq_ph_ship_date: 'напр. Немедленно, следующий месяц, 45-я неделя...',
    rfq_field_ship_notes: 'Инструкции по температуре и логистике (Опционально)',
    rfq_ship_notes_label: 'Инструкции по температуре и логистике (Опционально)',
    rfq_ph_ship_notes: 'Температурный режим (+13.5°C), предпочтительная судоходная линия (Maersk/MSC)...',

    // Step 4 & Navigation
    rfq_review_buyer_title: 'Профиль покупателя и компании',
    rfq_review_product_title: 'Культура и спецификации',
    rfq_review_logistics_title: 'Доставка и торговые условия',
    rfq_btn_edit: 'Изменить',
    rfq_btn_next: 'Следующий шаг',
    rfq_btn_prev: 'Предыдущий шаг',
    rfq_submit_btn: 'Отправить запрос котировки',
    rfq_submitting_btn: 'Обработка и отправка...',
    rfq_verify_label: 'Проверка безопасности (Анти-спам):',
    rfq_refresh_captcha: 'Обновить пример',
    rfq_consent_note: 'Отправляя форму, вы запрашиваете официальное предложение от AviaLink Export. Ваши данные защищены коммерческой тайной.',
    rfq_success_title: 'Запрос успешно получен!',
    rfq_success_lead_id: 'Номер запроса:',
    rfq_success_desc: 'Спасибо за обращение. Наш коммерческий отдел проверит спецификацию и предоставит официальный расчет в течение 24 рабочих часов.',
    rfq_btn_close: 'Закрыть окно',
    rfq_btn_new: 'Отправить еще один запрос',
    rfq_send_whatsapp_btn: 'Отправить детали заказа напрямую в зарегистрированный WhatsApp',
    rfq_whatsapp_notice: 'Для быстрого ответа и приоритетной обработки нажмите выше, чтобы отправить сводку заказа в наш WhatsApp.',
    admin_view_lead_btn: 'Просмотр заявки',
    admin_lead_modal_title: 'Детали экспортного запроса цен',
    admin_send_to_company_wa: 'Переслать на рабочий WhatsApp компании',
    admin_chat_with_buyer_wa: 'Написать покупателю в WhatsApp',
    admin_copy_lead_details: 'Скопировать сводку',
    admin_copied: 'Скопировано!',
    rfq_channel_admin_confirmed: '✓ Заявка успешно сохранена в панели управления экспортом',
    rfq_channel_wa_heading: 'Прямая отправка деталей заказа в WhatsApp отдела экспорта',
    rfq_channel_wa_desc: 'Полная спецификация передается напрямую на рабочий WhatsApp коммерческого отдела для оперативной обработки.',
    rfq_channel_wa_auto_redirecting: 'Чат WhatsApp откроется автоматически через {seconds} сек...',
    rfq_channel_wa_opened: 'Окно WhatsApp открыто! Пожалуйста, нажмите «Отправить» в приложении.',
    rfq_channel_wa_btn_now: 'Отправить заказ в WhatsApp сейчас',
    rfq_channel_wa_copy_btn: 'Скопировать текст',
    rfq_channel_wa_copied: 'Скопировано в буфер обмена!',
    admin_wa_explanation: 'Официальный номер WhatsApp компании, на который перенаправляются запросы цен и уведомления от клиентов.',

    // Validations & Aliases
    rfq_err_name: 'ФИО должно содержать не менее 2 символов.',
    rfq_err_company: 'Название компании обязательно для заполнения.',
    rfq_err_country: 'Пожалуйста, выберите страну назначения.',
    rfq_err_email: 'Пожалуйста, введите корректный адрес электронной почты.',
    rfq_err_phone: 'Пожалуйста, укажите корректный номер телефона с кодом страны.',
    rfq_err_product: 'Пожалуйста, выберите культуру.',
    rfq_err_qty: 'Пожалуйста, введите количество больше 0.',
    rfq_err_port: 'Пожалуйста, укажите порт назначения для условий CIF/CFR.',
    rfq_err_captcha: 'Неверный ответ на проверочный вопрос.',
    rfq_err_general: 'Ошибка при отправке запроса. Пожалуйста, попробуйте снова.',
    rfq_field_notes: 'Особые пожелания к калибру и спецификации',
    rfq_success_msg: 'Запрос успешно отправлен! Наш отдел экспорта свяжется с вами в ближайшее время.',

    // Spec Sheet Modal
    spec_title: 'Техническая спецификация',
    spec_download_btn: 'Скачать спецификацию в PDF',
    spec_updated: 'Последнее обновление:',

    // Admin
    admin_title: 'Панель управления экспортом',
    admin_tab_products: 'Управление продукцией',
    admin_tab_leads: 'Запросы и предложения',
    admin_add_product_btn: 'Добавить новую культуру',
  }
};

/**
 * Get localized string by key with smart alias fallback & key cleanup
 */
export function t(key: string, lang: Language | string = 'ar'): string {
  if (!key) return '';
  const safeLang = (lang as Language) || 'ar';
  const langDict = UI_TRANSLATIONS[safeLang] || UI_TRANSLATIONS['ar'];
  
  if (langDict[key]) return langDict[key];
  if (UI_TRANSLATIONS['ar']?.[key]) return UI_TRANSLATIONS['ar'][key];
  if (UI_TRANSLATIONS['en']?.[key]) return UI_TRANSLATIONS['en'][key];
  
  // Specific alias mappings
  if (key === 'rfq_subtitle' || key === 'rfq_sub_title') {
    return langDict['rfq_sub'] || UI_TRANSLATIONS['ar']['rfq_sub'] || 'تأكيد مواصفات الشحنة والطلب';
  }

  // Clean fallback for developer keys with underscores
  const cleanedKey = key
    .replace(/^(rfq_|nav_|catalog_|hero_|about_|contact_|footer_|trust_|markets_|admin_)/i, '')
    .replace(/_/g, ' ')
    .trim();

  return cleanedKey ? cleanedKey.charAt(0).toUpperCase() + cleanedKey.slice(1) : key;
}

export function localizeMetricValue(val: string, lang: Language | string = 'ar'): string {
  if (!val) return '';
  const safeLang = (lang as Language) || 'ar';

  if (safeLang === 'ar') {
    return val
      .replace(/Tons|Tonnes|Toneladas|Tonnen|Тонн/gi, 'طن')
      .replace(/Countries|Country|Pays|Países|Länder|Стран/gi, 'دولة')
      .replace(/Containers|Container|Conteneurs|Contenedores|Контейнеров/gi, 'حاوية')
      .replace(/Hubs|Hub|Bureaux|Oficinas|Standorte|Офисов/gi, 'مكاتب');
  }

  const unitMaps: Record<Language, { tons: string; countries: string; containers: string; hubs: string }> = {
    ar: { tons: 'طن', countries: 'دولة', containers: 'حاوية', hubs: 'مكاتب' },
    en: { tons: 'Tons', countries: 'Countries', containers: 'Containers', hubs: 'Hubs' },
    fr: { tons: 'Tonnes', countries: 'Pays', containers: 'Conteneurs', hubs: 'Bureaux' },
    es: { tons: 'Toneladas', countries: 'Países', containers: 'Contenedores', hubs: 'Oficinas' },
    de: { tons: 'Tonnen', countries: 'Länder', containers: 'Container', hubs: 'Standorte' },
    ru: { tons: 'Тонн', countries: 'Стран', containers: 'Контейнеров', hubs: 'Офисов' }
  };

  const u = unitMaps[safeLang] || unitMaps.en;

  let res = val;
  // Replace Arabic keywords
  res = res
    .replace(/طن متري|طن/gi, u.tons)
    .replace(/دولة|دول/gi, u.countries)
    .replace(/حاوية|حاويات/gi, u.containers)
    .replace(/مكتب|مكاتب/gi, u.hubs);

  // If language is not English, replace English unit terms
  if (safeLang !== 'en') {
    res = res
      .replace(/Metric Tons|Tons|Tonnes/gi, u.tons)
      .replace(/Countries|Country/gi, u.countries)
      .replace(/Containers|Container/gi, u.containers)
      .replace(/Hubs|Hub/gi, u.hubs);
  }

  return res;
}

/**
 * Dynamic Dictionary for Crops & Trade Terms to translate ANY newly added product!
 */
export const CROP_TRANSLATION_MAP: Record<string, Record<Language, string>> = {
  // Arabic Product Name Keys Mapping
  'البطاطا الحلوة المصرية الفاخرة': {
    ar: 'البطاطا الحلوة المصرية الفاخرة',
    en: 'Egyptian Premium Sweet Potatoes',
    fr: 'Patates douces égyptiennes de qualité supérieure',
    es: 'Batatas / Camotes Egipcios de Calidad Premium',
    de: 'Ägyptische Premium-Süßkartoffeln',
    ru: 'Египетский премиальный батат'
  },
  'البطاطس المصرية للطعام والتصنيع': {
    ar: 'البطاطس المصرية للطعام والتصنيع',
    en: 'Egyptian Fresh Ware & Processing Potatoes',
    fr: 'Pommes de terre fraîches d’Égypte (Table & Industrie)',
    es: 'Patatas Frescas de Egipto (Consumo y Proceso)',
    de: 'Ägyptische Speise- & Speiseindustriekartoffeln',
    ru: 'Египетский свежий картофель (столовый и чипсовый)'
  },
  'البصل المصري الذهبي والأحمر': {
    ar: 'البصل المصري الذهبي والأحمر',
    en: 'Egyptian Golden & Red Onions',
    fr: 'Oignons rouges et dorés d’Égypte',
    es: 'Cebollas Rojas y Doradas de Egipto',
    de: 'Ägyptische gelbe und rote Zwiebeln',
    ru: 'Египетский репчатый луك (красный и желтый)'
  },
  'الجزر المصري الطازج': {
    ar: 'الجزر المصري الطازج',
    en: 'Egyptian Fresh Orange Carrots',
    fr: 'Carottes oranges fraîches d’Égypte',
    es: 'Zanahorias Frescas de Egipto',
    de: 'Ägyptische frische Karotten',
    ru: 'Египетская свежая морковь'
  },
  'البنجر الأحمر المصري (الشمندر)': {
    ar: 'البنجر الأحمر المصري (الشمندر)',
    en: 'Egyptian Dark Red Beetroot',
    fr: 'Betterave rouge fraîche d’Égypte',
    es: 'Remolacha Roja Fresca de Egipto',
    de: 'Ägyptische frische Rote Bete',
    ru: 'Египетская свежая свекла'
  },
  'الثوم المصري الطازج (الأبيض والأرجواني)': {
    ar: 'الثوم المصري الطازج (الأبيض والأرجواني)',
    en: 'Egyptian Fresh White & Purple Garlic',
    fr: 'Ail frais blanc et violet d’Égypte',
    es: 'Ajo Fresco Blanco y Morado de Egipto',
    de: 'Ägyptischer frischer weißer & violetter Knoblauch',
    ru: 'Египетский свежий белый и фиолетовый чеснок'
  },
  'الرمان المصري الطازج (وندرفول)': {
    ar: 'الرمان المصري الطازج (وندرفول)',
    en: 'Egyptian Fresh Wonderful Pomegranates',
    fr: 'Grenades Wonderful fraîches d’Égypte',
    es: 'Granadas Frescas Wonderful de Egipto',
    de: 'Ägyptische frische Wonderful Granatäpfel',
    ru: 'Египетский свежий гранат Вандерفул'
  },
  'الموالح والبرتقال المصري (فالنسيا وأبو سرة)': {
    ar: 'الموالح والبرتقال المصري (فالنسيا وأبو سرة)',
    en: 'Egyptian Fresh Citrus & Valencia Oranges',
    fr: 'Agrumes frais et Oranges Valencia d’Égypte',
    es: 'Cítricos Frescos y Naranjas Valencia de Egipto',
    de: 'Ägyptische frische Zitrusfrüchte & Valencia-Orangen',
    ru: 'Египетские цитрусовые и апельсины Валенсия'
  },
  'البطاطس المجمدة والمجهزة (بوم فريت)': {
    ar: 'البطاطس المجمدة والمجهزة (بوم فريت)',
    en: 'Egyptian Frozen French Fries (Pommes Frites)',
    fr: 'Frites surgelées égyptiennes (Pommes Frites)',
    es: 'Patatas Fritas Congeladas de Egipto',
    de: 'Ägyptische gefrorene Pommes Frites',
    ru: 'Египетский замороженный картофель фри'
  },
  'البطاطس والبطاطا الحلوة نصف المقلية': {
    ar: 'البطاطس والبطاطا الحلوة نصف المقلية',
    en: 'Half-Fried Potatoes & Half-Fried Sweet Potatoes',
    fr: 'Pommes de terre et patates douces mi-cuites',
    es: 'Patatas y Batatas Semicongeladas Semi-fritas',
    de: 'Halbfrittierte Kartoffeln & Süßkartoffeln',
    ru: 'Полужареный картофель и батат'
  },
  'الفلفل الألوان المصري الفاخر': {
    ar: 'الفلفل الألوان المصري الفاخر',
    en: 'Egyptian Premium Colored Bell Peppers',
    fr: 'Poivrons de couleur égyptiens de première qualité',
    es: 'Pimientos Morrón de Colores Egipcios Premium',
    de: 'Ägyptische bunte Premium-Paprika',
    ru: 'Египетский сладкий цветной перец премиум'
  },
  'فلفل ألوان': {
    ar: 'فلفل ألوان مصري طازج',
    en: 'Egyptian Fresh Colored Bell Peppers',
    fr: 'Poivrons de couleur frais d’Égypte',
    es: 'Pimientos de Colores Frescos de Egipto',
    de: 'Ägyptische frische bunte Paprika',
    ru: 'Египетский свежий цветной перец'
  },
  'فلفل الوان': {
    ar: 'فلفل ألوان مصري طازج',
    en: 'Egyptian Fresh Colored Bell Peppers',
    fr: 'Poivrons de couleur frais d’Égypte',
    es: 'Pimientos de Colores Frescos de Egipto',
    de: 'Ägyptische frische bunte Paprika',
    ru: 'Египетский свежий цветной перец'
  },
  'الفلفل الألوان': {
    ar: 'الفلفل الألوان المصري الفاخر',
    en: 'Egyptian Premium Colored Bell Peppers',
    fr: 'Poivrons de couleur égyptiens',
    es: 'Pimientos de colores egipcios',
    de: 'Ägyptische bunte Paprika',
    ru: 'Египетский цветной перец'
  },

  // English Product Name Keys Mapping
  'Egyptian Premium Colored Bell Peppers': {
    ar: 'الفلفل الألوان المصري الفاخر',
    en: 'Egyptian Premium Colored Bell Peppers',
    fr: 'Poivrons de couleur égyptiens de première qualité',
    es: 'Pimientos Morrón de Colores Egipcios Premium',
    de: 'Ägyptische bunte Premium-Paprika',
    ru: 'Египетский сладкий цветной перец премиум'
  },
  'Egyptian Fresh Colored Bell Peppers': {
    ar: 'الفلفل الألوان المصري الفاخر',
    en: 'Egyptian Fresh Colored Bell Peppers',
    fr: 'Poivrons de couleur frais d’Égypte',
    es: 'Pimientos de Colores Frescos de Egipto',
    de: 'Ägyptische frische bunte Paprika',
    ru: 'Египетский свежий цветной перец'
  },
  'Egyptian Fresh Sweet Potatoes': {
    ar: 'البطاطا الحلوة المصرية الطازجة',
    en: 'Egyptian Fresh Sweet Potatoes',
    fr: 'Patates douces fraîches d’Égypte',
    es: 'Batatas / Camotes Frescos de Egipto',
    de: 'Ägyptische frische Süßkartoffeln',
    ru: 'Египетский свежий батат'
  },
  'Egyptian Premium Sweet Potatoes': {
    ar: 'البطاطا الحلوة المصرية الفاخرة',
    en: 'Egyptian Premium Sweet Potatoes',
    fr: 'Patates douces égyptiennes de qualité supérieure',
    es: 'Batatas / Camotes Egipcios de Calidad Premium',
    de: 'Ägyptische Premium-Süßkartoffeln',
    ru: 'Египетский премиальный батат'
  },
  'Egyptian Fresh Red & Golden Onions': {
    ar: 'البصل المصري الطازج (الأحمر والأصفر)',
    en: 'Egyptian Fresh Red & Golden Onions',
    fr: 'Oignons rouges et dorés frais d’Égypte',
    es: 'Cebollas Frescas Rojas y Doradas de Egipto',
    de: 'Ägyptische frische rote & gelbe Zwiebeln',
    ru: 'Египетский свежий красный и желтый лук'
  },
  'Egyptian Fresh Orange Carrots': {
    ar: 'الجزر المصري الطازج',
    en: 'Egyptian Fresh Orange Carrots',
    fr: 'Carottes oranges fraîches d’Égypte',
    es: 'Zanahorias Frescas de Egipto',
    de: 'Ägyptische frische Karotten',
    ru: 'Египетская свежая морковь'
  },
  'Egyptian Dark Red Beetroot': {
    ar: 'البنجر الأحمر المصري (الشمندر)',
    en: 'Egyptian Dark Red Beetroot',
    fr: 'Betterave rouge fraîche d’Égypte',
    es: 'Remolacha Roja Fresca de Egipto',
    de: 'Ägyptische frische Rote Bete',
    ru: 'Египетская свежая свекла'
  },
  'Egyptian Fresh White & Purple Garlic': {
    ar: 'الثوم المصري الطازج (الأبيض والأرجواني)',
    en: 'Egyptian Fresh White & Purple Garlic',
    fr: 'Ail frais blanc et violet d’Égypte',
    es: 'Ajo Fresco Blanco y Morado de Egipto',
    de: 'Ägyptischer frischer weißer & violetter Knoblauch',
    ru: 'Египетский свежий белый и фиолетовый чеснок'
  },
  'Egyptian Fresh Wonderful Pomegranates': {
    ar: 'الرمان المصري الطازج (وندرفول)',
    en: 'Egyptian Fresh Wonderful Pomegranates',
    fr: 'Grenades Wonderful fraîches d’Égypte',
    es: 'Granadas Frescas Wonderful de Egipto',
    de: 'Ägyptische frische Wonderful Granatäpfel',
    ru: 'Египетский свежий гранат Вандерفул'
  },
  'Egyptian Fresh Citrus & Valencia Oranges': {
    ar: 'الموالح والبرتقال المصري (فالنسيا وأبو سرة)',
    en: 'Egyptian Fresh Citrus & Valencia Oranges',
    fr: 'Agrumes frais et Oranges Valencia d’Égypte',
    es: 'Cítricos Frescos y Naranjas Valencia de Egipto',
    de: 'Ägyptische frische Zitrusfrüchte & Valencia-Orangen',
    ru: 'Египетские цитрусовые и апельсины Валенсия'
  },
  'Egyptian Frozen French Fries (Pommes Frites)': {
    ar: 'البطاطس المجمدة والمجهزة (بوم فريت)',
    en: 'Egyptian Frozen French Fries (Pommes Frites)',
    fr: 'Frites surgelées égyptiennes (Pommes Frites)',
    es: 'Patatas Fritas Congeladas de Egipto',
    de: 'Ägyptische gefrorene Pommes Frites',
    ru: 'Египетский замороженный картофель фри'
  },
  'Half-Fried Potatoes & Half-Fried Sweet Potatoes': {
    ar: 'البطاطس والبطاطا الحلوة نصف المقلية',
    en: 'Half-Fried Potatoes & Half-Fried Sweet Potatoes',
    fr: 'Pommes de terre et patates douces mi-cuites',
    es: 'Patatas y Batatas Semicongeladas Semi-fritas',
    de: 'Halbfrittierte Kartoffeln & Süßkartoffeln',
    ru: 'Полужареный картофель и батат'
  },
  'Egyptian Fresh Ware & Processing Potatoes': {
    ar: 'البطاطس المصرية للطعام والتصنيع',
    en: 'Egyptian Fresh Ware & Processing Potatoes',
    fr: 'Pommes de terre fraîches d’Égypte (Table & Industrie)',
    es: 'Patatas Frescas de Egipto (Consumo y Proceso)',
    de: 'Ägyptische Speise- & Speiseindustriekartoffeln',
    ru: 'Египетский свежий картофель (столовый и чипсовый)'
  },
  'Egyptian Golden & Red Onions': {
    ar: 'البصل المصري الذهبي والأحمر',
    en: 'Egyptian Golden & Red Onions',
    fr: 'Oignons rouges et dorés d’Égypte',
    es: 'Cebollas Rojas y Doradas de Egipto',
    de: 'Ägyptische gelbe und rote Zwiebeln',
    ru: 'Египетский репчатый лук (красный и желтый)'
  },
  'Egyptian Fresh Citrus (Valencia, Navel, Lemons & Mandarins)': {
    ar: 'الموالح المصرية (برتقال فالنسيا، بسرة، ليمون ويوستفي)',
    en: 'Egyptian Fresh Citrus (Valencia, Navel, Lemons & Mandarins)',
    fr: 'Agrumes frais d’Égypte (Valencia, Navel, Citrons & Mandarines)',
    es: 'Cítricos Frescos de Egipto (Valencia, Navel, Limones y Mandarinas)',
    de: 'Ägyptische frische Zitrusfrüchte (Valencia, Navel, Zitronen & Mandarinen)',
    ru: 'Египетские цитрусовые (Валенсия, Навель, Лимоны и Мандарины)'
  },
  'Egyptian Fresh Garlic & Wonderful Pomegranates': {
    ar: 'الثوم المصري والرمان الوندرفول الطازج',
    en: 'Egyptian Fresh Garlic & Wonderful Pomegranates',
    fr: 'Ail frais et Grenades Wonderful d’Égypte',
    es: 'Ajo Fresco y Granadas Wonderful de Egipto',
    de: 'Ägyptischer frischer Knoblauch & Wonderful Granatäpfel',
    ru: 'Египетский свежий чеснок и гранаты "Вандерفул"'
  },

  // Varieties
  'Bellevue': { ar: 'بيليفيو', en: 'Bellevue', fr: 'Bellevue', es: 'Bellevue', de: 'Bellevue', ru: 'Бельвю' },
  'Beauregard': { ar: 'بورجارد', en: 'Beauregard', fr: 'Beauregard', es: 'Beauregard', de: 'Beauregard', ru: 'Борегард' },
  'Evangeline': { ar: 'إيفانجلين', en: 'Evangeline', fr: 'Evangeline', es: 'Evangeline', de: 'Evangeline', ru: 'Эванджелин' },
  'Spunta (Tableware)': { ar: 'سبونتا (للطعام)', en: 'Spunta (Tableware)', fr: 'Spunta (Consommation)', es: 'Spunta (Mesa)', de: 'Spunta (Speise)', ru: 'Спунта (столовый)' },
  'Lady Rosetta (Chipping)': { ar: 'ليدي روزيتا (للتصنيع والشيبس)', en: 'Lady Rosetta (Chipping)', fr: 'Lady Rosetta (Croustilles)', es: 'Lady Rosetta (Chips)', de: 'Lady Rosetta (Chips)', ru: 'Леди Розетта (чипсовый)' },
  'Hermes (Processing)': { ar: 'هيرمس (تصنيع)', en: 'Hermes (Processing)', fr: 'Hermes (Industrie)', es: 'Hermes (Proceso)', de: 'Hermes (Verarbeitung)', ru: 'Хермес (переработка)' },
  'Valencia Oranges': { ar: 'برتقال فالنسيا الصيفي', en: 'Valencia Oranges', fr: 'Oranges Valencia', es: 'Naranjas Valencia', de: 'Valencia-Orangen', ru: 'Апельсины Валенсия' },
  'Navel Oranges': { ar: 'برتقال أبو سرة', en: 'Navel Oranges', fr: 'Oranges Navel', es: 'Naranjas Navel', de: 'Navel-Orangen', ru: 'Апельсины Навель' },
  'Red Onions (Giza 6)': { ar: 'بصل أحمر (جيزة 6)', en: 'Red Onions (Giza 6)', fr: 'Oignons rouges (Giza 6)', es: 'Cebolla Roja (Giza 6)', de: 'Rote Zwiebeln (Giza 6)', ru: 'Красный лук (Гиза 6)' },
  'Golden / Yellow Onions (Giza 20)': { ar: 'بصل ذهبي/أصفر (جيزة 20)', en: 'Golden / Yellow Onions (Giza 20)', fr: 'Oignons jaunes (Giza 20)', es: 'Cebolla Amarilla (Giza 20)', de: 'Gelbe Zwiebeln (Giza 20)', ru: 'Желтый лук (Гиза 20)' },
  'Baladi White Garlic': { ar: 'ثوم بلدي أبيض', en: 'Baladi White Garlic', fr: 'Ail blanc Baladi', es: 'Ajo Blanco Baladi', de: 'Weißer Baladi-Knoblauch', ru: 'Белый чеснок Баладо' },
  'Chinese Purple Garlic': { ar: 'ثوم أحمر/بنفسجي', en: 'Chinese Purple Garlic', fr: 'Ail violet', es: 'Ajo Morado', de: 'Violetter Knoblauch', ru: 'Фиолетовый чеснок' },
  'Wonderful Pomegranates': { ar: 'رمان وندرفول', en: 'Wonderful Pomegranates', fr: 'Grenades Wonderful', es: 'Granadas Wonderful', de: 'Wonderful-Granatäpfel', ru: 'Гранаты Вандерفул' },

  // General Terms
  'Egypt': { ar: 'مصر', en: 'Egypt', fr: 'Égypte', es: 'Egipto', de: 'Ägypten', ru: 'Египет' },
  'Class I (Export Standard)': { ar: 'فرز أول (معيار التصدير)', en: 'Class I (Export Standard)', fr: 'Classe I (Standard Export)', es: 'Clase I (Estándar Exportación)', de: 'Klasse I (Exportstandard)', ru: 'Класс I (Экспортный)' },
  'Class I Export Grade': { ar: 'درجة أولى تصدير', en: 'Class I Export Grade', fr: 'Classe I Exportation', es: 'Clase I Grado Exportación', de: 'Klasse I Exportqualität', ru: 'Класс I Экспортный' },
};

export const CROP_DESCRIPTIONS: Record<string, Record<Language, string>> = {
  'sweet-potatoes': {
    ar: 'بطاطا حلوة برتقالية مصرية فاخرة مزروعة في أراضي الدلتا الغنية، تمتاز بالجلد الناعم ونسبة السكر العالية وعمر تخزيني طويل.',
    en: 'Premium Egyptian orange-fleshed Beauregard sweet potatoes grown in rich Nile Delta soils, featuring smooth skin, high sugar content, and extended shelf life.',
    fr: 'Patates douces égyptiennes Beauregard à chair orange de qualité supérieure, cultivées dans le Delta du Nil, réputées pour leur peau lisse, leur taux de sucre élevé et leur longue conservation.',
    es: 'Batatas/camotes frescos egipcios Beauregard de pulpa naranja cultivados en los ricos suelos del Delta del Nilo, reconocidos por su piel suave y larga vida útil.',
    de: 'Erstklassige ägyptische orangefleischige Beauregard Süßkartoffeln aus dem Nildelta, bekannt für glatte Schale, hohen Zuckergehalt und lange Haltbarkeit.',
    ru: 'Премиальный египетский оранжевый батат сорта Борегард из дельты Нила, отличается гладкой кожицей, высоким содержанием сахара и длительным хранением.'
  },
  'potatoes': {
    ar: 'بطاطس مصرية عالية الجودة للطعام والتصنيع والشيبس (سبونتا وليدي روزيتا وهيرمس)، محصودة من أجود المناطق الزراعية تحت إشراف صحي دقيق.',
    en: 'High-quality Egyptian fresh ware and processing potatoes (Spunta, Lady Rosetta, Hermes), harvested from prime agricultural regions with strict phytosanitary control.',
    fr: 'Pommes de terre fraîches d’Égypte (Spunta, Lady Rosetta, Hermes) pour la consommation et l’industrie, récoltées dans les meilleures régions agricoles selon des normes phytosanitaires strictes.',
    es: 'Patatas frescas egipcias (Spunta, Lady Rosetta, Hermes) para consumo y procesamiento industrial, cosechadas bajo estrictas normas fitosanitarias.',
    de: 'Hochwertige Speise- und Verarbeitungs-Kartoffeln (Spunta, Lady Rosetta, Hermes) aus Ägyptens besten Anbaugebieten unter strengen Pflanzenschutzrichtlinien.',
    ru: 'Высококачественный столовый и чипсовый картофель (Спунта, Леди Розетта, Хермес), собранный со строгим фитосанитарным контролем.'
  },
  'onions': {
    ar: 'بصل مصري صلب جاف (أحمر وأصفر) عالي المادة الجافة بصلابة ممتازة، مثالي للشحن البحري الطويل والتخزين الممتد.',
    en: 'Firm, dry Egyptian red and golden onions with high dry matter content and thick skin, ideal for long maritime transit and extended storage.',
    fr: 'Oignons rouges et dorés égyptiens fermes à forte teneur en matière sèche avec une peau extérieure solide, idéaux pour le transit maritime long.',
    es: 'Cebollas egipcias rojas y amarillas firmes con alto contenido de materia seca y pieles exteriores resistentes, ideales para largos viajes marítimos.',
    de: 'Feste ägyptische rote und gelbe Zwiebeln mit hohem Trockensubstanzgehalt und starker Schale, ideal für lange Seetransporte.',
    ru: 'Твердый египетский красный и желтый лук с высоким содержанием сухого вещества, идеален для длительной морской транспортировки.'
  },
  'carrots': {
    ar: 'جزر برتقالي مصري طازج غني بالبيتا كاروتين، مغسول آلياً ومفرز بعناية بأحجام موحدة ونضارة عالية للتصدير المباشر.',
    en: 'Fresh Egyptian orange carrots rich in beta-carotene, optically washed and polished with uniform sizing and crisp texture for global export.',
    fr: 'Carottes oranges fraîches d’Égypte riches en bêta-carotène, lavées et polies optiquement avec un calibrage uniforme pour l’exportation.',
    es: 'Zanahorias frescas de Egipto ricas en betacaroteno, lavadas y pulidas ópticamente con tamaño uniforme y alta frescura.',
    de: 'Frische ägyptische Karotten reich an Beta-Carotin, optisch gewaschen und poliert mit einheitlicher Kalibrierung für den Export.',
    ru: 'Свежая египетская морковь, богатая бета-каротином, промытая и откалиброванная с высокой свежестью для экспорта.'
  },
  'red-beet': {
    ar: 'بنجر أحمر داكن طازج (شمندر) ذو نسبة سكر عالية ولون داكن مميز، مجهز للتصدير ومثالي للاستهلاك المباشر ومصانع الأغذية.',
    en: 'Fresh deep red Egyptian beetroot with high Brix content and intense crimson color, ideal for fresh produce markets and food processing.',
    fr: 'Betterave rouge fraîche d’Égypte à forte teneur en sucre et couleur cramoisi intense, idéale pour les marchés frais et l’agroalimentaire.',
    es: 'Remolacha roja fresca de Egipto con alto contenido de azúcar y color carmesí intenso, ideal para consumo fresco y procesado.',
    de: 'Frische Rote Bete aus Ägypten mit hohem Zuckergehalt und tiefroter Farbe, ideal für Frischemärkte und Lebensmittelindustrie.',
    ru: 'Свежая египетская свекла с высоким содержанием сахара и насыщенным темным цветом, идеальна для переработки и продаж.'
  },
  'garlic': {
    ar: 'ثوم مصري طازج وجاف (بلدي أبيض وأرجواني) ذو فصوص متماسكة ونكهة قوية نفاذة، يجهز بأعلى معايير التجفيف والتجذير للتصدير.',
    en: 'Fresh and cured Egyptian garlic (Baladi White & Purple) with firm cloves and intense aroma, professionally dried and rooted for export.',
    fr: 'Ail frais et séché d’Égypte (Blanc Baladi & Violet) aux gousses fermes et arôme puissant, séché et préparé pour l’exportation.',
    es: 'Ajo fresco y curado de Egipto (Blanco Baladi y Morado) con dientes firmes y aroma intenso, secado y procesado para exportación.',
    de: 'Frischer und getrockneter ägyptischer Knoblauch (Weiß & Violett) mit festen Zehen und intensivem Aroma für den Export.',
    ru: 'Свежий и сушеный египетский чеснок (белый и фиолетовый) с плотными зубчиками и насыщенным ароматом для экспорта.'
  },
  'pomegranates': {
    ar: 'رمان وندرفول مصري طازج ذو حبات حمراء ياقوتية داكنة ونسبة عصير عالية وطعم حامض حلو متوازن، مرغوب عالمياً.',
    en: 'Fresh Egyptian Wonderful pomegranates with deep ruby-red arils, high juice yield, and balanced sweet-tart flavor profile.',
    fr: 'Grenades Wonderful fraîches d’Égypte aux grains rouge rubis profond, rendement élevé en jus et saveur acidulée équilibrée.',
    es: 'Granadas Wonderful frescas de Egipto con arilos color rojo rubí intenso, alto rendimiento de jugo y excelente sabor.',
    de: 'Frische ägyptische Wonderful Granatäpfel mit tief rubinroten Arillen, hohem Saftgehalt und ausgewogenem Geschmack.',
    ru: 'Свежий египетский гранат Вандерфул с глубоко-рубиновыми зернами, высоким выходом сока и гармоничным вкусом.'
  },
  'citrus': {
    ar: 'موالح وبرتقال مصري طازج (فالنسيا، أبو سرة، ليمون ويوستفي) محصود من المزارع المعتمدة، نكهة ممتازة ونسبة عصير تتجاوز 48%.',
    en: 'Fresh Egyptian citrus (Valencia & Navel Oranges) with over 48% juice content, vibrant golden skin, and full Cold Treatment compliance.',
    fr: 'Agrumes frais d’Égypte (Oranges Valencia et Navel) offrant plus de 48% de jus, peau dorée éclatante et traitement frigorifique certifié.',
    es: 'Cítricos frescos de Egipto (Naranjas Valencia y Navel) con más del 48% de contenido de jugo y cumplimiento de tratamiento en frío.',
    de: 'Frische ägyptische Zitrusfrüchte (Valencia & Navel) mit über 48% Saftgehalt, goldener Schale und Kältebehandlungsprotokoll.',
    ru: 'Свежие египетские цитрусовые (апельсины Валенсия и Навель) с содержанием сока более 48% и соблюдением протоколов охлаждения.'
  },
  'oranges': {
    ar: 'موالح وبرتقال مصري طازج (فالنسيا، أبو سرة، ليمون ويوستفي) محصود من المزارع المعتمدة، نكهة ممتازة ونسبة عصير تتجاوز 48%.',
    en: 'Fresh Egyptian citrus (Valencia & Navel Oranges) with over 48% juice content, vibrant golden skin, and full Cold Treatment compliance.',
    fr: 'Agrumes frais d’Égypte (Oranges Valencia et Navel) offrant plus de 48% de jus, peau dorée éclatante et traitement frigorifique certifié.',
    es: 'Cítricos frescos de Egipto (Naranjas Valencia y Navel) con más del 48% de contenido de jugo y cumplimiento de tratamiento en frío.',
    de: 'Frische ägyptische Zitrusfrüchte (Valencia & Navel) mit über 48% Saftgehalt, goldener Schale und Kältebehandlungsprotokoll.',
    ru: 'Свежие египетские цитрусовые (апельсины Валенсия и Навель) с содержанием сока более 48% и соблюдением протоколов охлаждения.'
  },
  'french-fries': {
    ar: 'بطاطس مفرزة ومجمدة سريعاً (IQF) أصابع بوم فريت جودة عالية، مقرمشة ذهبية مناسبة لسلاسل المطاعم والفنادق والتجزئة (HORECA).',
    en: 'Premium IQF frozen French fries (Pommes Frites) made from selected Egyptian processing potatoes, offering golden crispiness for HORECA and retail.',
    fr: 'Frites surgelées IQF de qualité supérieure (Pommes Frites) préparées à partir de pommes de terre égyptiennes sélectionnées pour le secteur HORECA.',
    es: 'Patatas fritas congeladas IQF de calidad premium para el sector HORECA y distribución, doradas y crujientes.',
    de: 'Erstklassige IQF-gefrorene Pommes Frites aus ausgewählten ägyptischen Kartoffeln für Gastronomie und Handel.',
    ru: 'Премиальный замороженный картофель фри (IQF), золотистый и хрустящий, для сегмента HoReCa и розницы.'
  },
  'half-fried-potatoes': {
    ar: 'بطاطس وبطاطا حلوة نصف مقلية مجهزة ومجمدة (Half-Fried)، توفر الوقت والجهد في القلي السريع بنكهة طبيعية ممتازة للقطاع الفندقي والمطاعم.',
    en: 'Half-fried frozen potatoes and half-fried sweet potatoes designed for fast commercial frying with premium natural taste for foodservice.',
    fr: 'Pommes de terre et patates douces mi-cuites surgelées pour une friture rapide en restauration professionnelle.',
    es: 'Patatas y batatas semi-fritas congeladas listas para freído rápido comercial con sabor natural premium.',
    de: 'Halbfrittierte Kartoffeln und Süßkartoffeln für schnelles Frittieren in Gastronomie und Hotellerie.',
    ru: 'Полужареный замороженный картофель и батат для быстрого приготовления в сегменте HoReCa.'
  },
  'half-fried': {
    ar: 'بطاطس وبطاطا حلوة نصف مقلية مجهزة ومجمدة (Half-Fried)، توفر الوقت والجهد في القلي السريع بنكهة طبيعية ممتازة للقطاع الفندقي والمطاعم.',
    en: 'Half-fried frozen potatoes and half-fried sweet potatoes designed for fast commercial frying with premium natural taste for foodservice.',
    fr: 'Pommes de terre et patates douces mi-cuites surgelées pour une friture rapide en restauration professionnelle.',
    es: 'Patatas y batatas semi-fritas congeladas listas para freído rápido comercial con sabor natural premium.',
    de: 'Halbfrittierte Kartoffeln und Süßkartoffeln für schnelles Frittieren in Gastronomie und Hotellerie.',
    ru: 'Полужареный замороженный картофель и батат для быстрого приготовления в сегменте HoReCa.'
  },
  'colored-bell-peppers': {
    ar: 'فلفل ألوان مصري طازج ومقرمش عالي الجودة (أحمر، أصفر، برتقالي) مزروع تحت البيوت المحمية الحديثة والتحكم الكامل في المناخ، يمتاز بجدران سميكة وعمر تخزيني ممتد للشحن المبرد للأسواق العالمية.',
    en: 'Premium Egyptian fresh colored bell peppers (Red, Yellow, Orange) grown in state-of-the-art climate-controlled greenhouses, featuring thick crunchy walls and extended reefer shelf life.',
    fr: 'Poivrons de couleur frais d’Égypte (Rouge, Jaune, Orange) de première qualité, cultivés sous serres climatisées, offrant des parois épaisses et une longue conservation.',
    es: 'Pimientos morrones de colores frescos egipcios (rojo, amarillo, naranja) de calidad superior cultivados en invernaderos climatizados con paredes gruesas y crujientes.',
    de: 'Frische ägyptische bunte Paprika (Rot, Gelb, Orange) aus modernen Gewächshäusern mit dicken, knackigen Wänden und langer Haltbarkeit.',
    ru: 'Свежий египетский сладкий перец (красный, желтый, оранжевый) из современных теплиц с толстыми хрустящими стенками и долгим сроком хранения.'
  },
  'bell-peppers': {
    ar: 'فلفل ألوان مصري طازج ومقرمش عالي الجودة (أحمر، أصفر، برتقالي) مزروع تحت البيوت المحمية الحديثة والتحكم الكامل في المناخ، يمتاز بجدران سميكة وعمر تخزيني ممتد للشحن المبرد للأسواق العالمية.',
    en: 'Premium Egyptian fresh colored bell peppers (Red, Yellow, Orange) grown in state-of-the-art climate-controlled greenhouses, featuring thick crunchy walls and extended reefer shelf life.',
    fr: 'Poivrons de couleur frais d’Égypte (Rouge, Jaune, Orange) de première qualité, cultivés sous serres climatisées, offrant des parois épaisses et une longue conservation.',
    es: 'Pimientos morrones de colores frescos egipcios (rojo, amarillo, naranja) de calidad superior cultivados en invernaderos climatizados con paredes gruesas y crujientes.',
    de: 'Frische ägyptische bunte Paprika (Rot, Gelb, Orange) aus modernen Gewächshäusern mit dicken, knackigen Wänden und langer Haltbarkeit.',
    ru: 'Свежий египетский сладкий перец (красный, желтый, оранжевый) из современных теплиц с толстыми хрустящими стенками и долгим сроком хранения.'
  },
  'الفلفل الألوان المصري الفاخر': {
    ar: 'فلفل ألوان مصري طازج ومقرمش عالي الجودة (أحمر، أصفر، برتقالي) مزروع تحت البيوت المحمية الحديثة والتحكم الكامل في المناخ، يمتاز بجدران سميكة وعمر تخزيني ممتد للشحن المبرد للأسواق العالمية.',
    en: 'Premium Egyptian fresh colored bell peppers (Red, Yellow, Orange) grown in state-of-the-art climate-controlled greenhouses, featuring thick crunchy walls and extended reefer shelf life.',
    fr: 'Poivrons de couleur frais d’Égypte (Rouge, Jaune, Orange) de première qualité, cultivés sous serres climatisées, offrant des parois épaisses et une longue conservation.',
    es: 'Pimientos morrones de colores frescos egipcios (rojo, amarillo, naranja) de calidad superior cultivados en invernaderos climatizados con paredes gruesas y crujientes.',
    de: 'Frische ägyptische bunte Paprika (Rot, Gelb, Orange) aus modernen Gewächshäusern mit dicken, knackigen Wänden und langer Haltbarkeit.',
    ru: 'Свежий египетский сладкий перец (красный, желтый, оранжевый) из современных теплиц с толстыми хрустящими стенками и долгим сроком хранения.'
  }
};

export const MONTH_MAP: Record<string, Record<Language, string>> = {
  'January': { ar: 'يناير', en: 'January', fr: 'Janvier', es: 'Enero', de: 'Januar', ru: 'Январь' },
  'February': { ar: 'فبراير', en: 'February', fr: 'Février', es: 'Febrero', de: 'Februar', ru: 'Февраль' },
  'March': { ar: 'مارس', en: 'March', fr: 'Mars', es: 'Marzo', de: 'März', ru: 'Март' },
  'April': { ar: 'أبريل', en: 'April', fr: 'Avril', es: 'Abril', de: 'April', ru: 'Апрель' },
  'May': { ar: 'مايو', en: 'May', fr: 'Mai', es: 'Mayo', de: 'Mai', ru: 'Май' },
  'June': { ar: 'يونيو', en: 'June', fr: 'Juin', es: 'Junio', de: 'Juni', ru: 'Июнь' },
  'July': { ar: 'يوليو', en: 'July', fr: 'Juillet', es: 'Julio', de: 'Juli', ru: 'Июль' },
  'August': { ar: 'أغسطس', en: 'August', fr: 'Août', es: 'Agosto', de: 'August', ru: 'Август' },
  'September': { ar: 'سبتمبر', en: 'September', fr: 'Septembre', es: 'Septiembre', de: 'September', ru: 'Сентябрь' },
  'October': { ar: 'أكتوبر', en: 'October', fr: 'Octobre', es: 'Octubre', de: 'Oktober', ru: 'Октябрь' },
  'November': { ar: 'نوفمبر', en: 'November', fr: 'Novembre', es: 'Noviembre', de: 'November', ru: 'Ноябрь' },
  'December': { ar: 'ديسمبر', en: 'December', fr: 'Décembre', es: 'Diciembre', de: 'Dezember', ru: 'Декабрь' },
  'Year-Round': { ar: 'طوال العام', en: 'Year-Round', fr: 'Toute l’année', es: 'Todo el año', de: 'Ganzjährig', ru: 'Круглый год' },
  'Peak Season': { ar: 'ذروة الموسم', en: 'Peak Season', fr: 'Pleine saison', es: 'Temporada alta', de: 'Hauptsaison', ru: 'Пик сезона' }
};

export const STANDARD_MONTH_KEYS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function parseMonthIndex(mStr?: string): number {
  if (!mStr) return -1;
  const s = mStr.trim().toLowerCase();

  if (/^(jan|january|يناير|janvier|janv|enero|ene|januar|январь|янв)/.test(s)) return 0;
  if (/^(feb|february|فبراير|février|fevrier|fév|fev|febrero|februar|февраль|фев)/.test(s)) return 1;
  if (/^(mar|march|مارس|mars|marzo|mürz|märz|marz|mär|март|мар)/.test(s)) return 2;
  if (/^(apr|april|أبريل|ابريل|avril|avr|abril|апрель|апр)/.test(s)) return 3;
  if (/^(may|مايو|mai|mayo|май)/.test(s)) return 4;
  if (/^(jun|june|يونيو|juin|junio|juni|июнь|июн)/.test(s)) return 5;
  if (/^(jul|july|يوليو|juillet|juil|julio|juli|июль|июл)/.test(s)) return 6;
  if (/^(aug|august|أغسطس|اغسطس|août|aout|agosto|август|авг)/.test(s)) return 7;
  if (/^(sep|sept|september|سبتمبر|septembre|septiembre|сентябрь|сен)/.test(s)) return 8;
  if (/^(oct|okt|october|أكتوبر|اكتوبر|octobre|octubre|oktober|октябрь|окт)/.test(s)) return 9;
  if (/^(nov|november|نوفمبر|novembre|noviembre|ноябрь|ноя)/.test(s)) return 10;
  if (/^(dec|dez|december|ديسمبر|décembre|decembre|déc|diciembre|dezember|декабрь|дек)/.test(s)) return 11;

  return -1;
}

export function formatLocalizedMonth(mStr?: string, lang: Language | string = 'ar'): string {
  if (!mStr || typeof mStr !== 'string') return '';
  const idx = parseMonthIndex(mStr);
  if (idx === -1) return mStr;
  const englishKey = STANDARD_MONTH_KEYS[idx];
  return MONTH_MAP[englishKey]?.[lang as Language] || mStr;
}

export const PACKAGING_MAP: Record<string, Record<Language, string>> = {
  '6 kg Open-Top Carton Box': {
    ar: 'كرتون مفتوح من الأعلى 6 كجم',
    en: '6 kg Open-Top Carton Box',
    fr: 'Carton ouvert 6 kg',
    es: 'Caja de cartón abierto de 6 kg',
    de: '6 kg offener Karton',
    ru: 'Открытый картонный ящик 6 кг'
  },
  '10 kg Corrugated Carton Box': {
    ar: 'كرتون مقوى مموج 10 كجم',
    en: '10 kg Corrugated Carton Box',
    fr: 'Carton ondulé 10 kg',
    es: 'Caja de cartón corrugado de 10 kg',
    de: '10 kg Wellpappkarton',
    ru: 'Гофрокороб 10 кг'
  },
  '15 kg Telescopic Export Carton': {
    ar: 'كرتون تلسكوبي للتصدير 15 كجم',
    en: '15 kg Telescopic Export Carton',
    fr: 'Carton télescopique export 15 kg',
    es: 'Caja de cartón telescópica 15 kg',
    de: '15 kg Teleskopkarton Export',
    ru: 'Телескопический короб 15 кг'
  },
  '25 kg Mesh Bags (Red/Yellow)': {
    ar: 'أكياس شبكية 25 كجم (أحمر/أصفر)',
    en: '25 kg Mesh Bags (Red/Yellow)',
    fr: 'Sacs filet 25 kg (Rouge/Jaune)',
    es: 'Sacos de malla 25 kg (Rojo/Amarillo)',
    de: '25 kg Netzsäcke (Rot/Gelb)',
    ru: 'Сетчатые мешки 25 кг (красный/желтый)'
  },
  '1000 kg Jumbo Bulk Bags': {
    ar: 'أكياس جامبو ضخمة 1000 كجم',
    en: '1000 kg Jumbo Bulk Bags',
    fr: 'Sacs Jumbo 1000 kg en vrac',
    es: 'Sacos Jumbo de 1000 kg',
    de: '1000 kg Big Bags (Jumbo)',
    ru: 'Биг-бэги 1000 кг (Джамбо)'
  },
  '10 kg / 25 kg Polypropylene Bags': {
    ar: 'أكياس بولي بروبيلين 10 كجم / 25 كجم',
    en: '10 kg / 25 kg Polypropylene Bags',
    fr: 'Sacs en polypropylène 10 kg / 25 kg',
    es: 'Sacos de polipropileno de 10 kg / 25 kg',
    de: '10 kg / 25 kg PP-Säcke',
    ru: 'Полипропиленовые мешки 10 кг / 25 кг'
  }
};

/**
 * Smart Product Localizer function:
 * Translates any Product into the selected language dynamically!
 */
export function getLocalizedProduct(rawProduct: Product | undefined | null, lang: Language | string = 'ar'): Product {
  const safeLang = (lang as Language) || 'ar';
  const matchingInitial = initialProducts.find(p => 
    (p.slug && rawProduct?.slug && p.slug === rawProduct.slug) || 
    (p.id && rawProduct?.id && p.id === rawProduct.id)
  );

  // CRITICAL FIX:
  // If rawProduct matches an initial product by slug or id, merge rawProduct over matchingInitial.
  // BUT if rawProduct is a custom product added by the user, DO NOT merge initialProducts[0] (sweet potatoes)!
  const product: Product = rawProduct
    ? (matchingInitial ? { ...matchingInitial, ...rawProduct } : { ...rawProduct })
    : (matchingInitial || initialProducts[0]);

  // Always ensure heroImage takes priority and is the first item in safeImages
  const heroImg = product.heroImage || (product.images && product.images.length > 0 ? product.images[0] : '');
  let safeImages: string[] = [];
  if (heroImg) {
    const otherImgs = (product.images || []).filter(img => img && img !== heroImg);
    safeImages = [heroImg, ...otherImgs];
  } else if (product.images && product.images.length > 0) {
    safeImages = product.images;
  }

  // Safe season calculation without ever throwing startMonth undefined
  let rawSeason = product.season || matchingInitial?.season;
  if (!rawSeason) {
    rawSeason = {
      startMonth: 'January',
      endMonth: 'December',
      peakMonths: ['January', 'December']
    };
  }

  const safeSeasonObj = {
    startMonth: rawSeason.startMonth || 'January',
    endMonth: rawSeason.endMonth || 'December',
    peakMonths: Array.isArray(rawSeason.peakMonths) && rawSeason.peakMonths.length > 0
      ? rawSeason.peakMonths
      : ['January', 'December']
  };

  const localizedSeason = {
    ...safeSeasonObj,
    startMonth: formatLocalizedMonth(safeSeasonObj.startMonth, safeLang) || safeSeasonObj.startMonth,
    endMonth: formatLocalizedMonth(safeSeasonObj.endMonth, safeLang) || safeSeasonObj.endMonth,
    peakMonths: safeSeasonObj.peakMonths.map((m: string) => formatLocalizedMonth(m, safeLang) || m)
  };

  // Check if product has explicit saved translation object
  if ((product as any).translations && (product as any).translations[safeLang]) {
    const tr = (product as any).translations[safeLang];
    return {
      ...product,
      heroImage: heroImg,
      images: safeImages,
      ...tr,
      season: (tr.season && tr.season.startMonth) ? {
        startMonth: formatLocalizedMonth(tr.season.startMonth, safeLang) || tr.season.startMonth,
        endMonth: formatLocalizedMonth(tr.season.endMonth || tr.season.startMonth, safeLang) || (tr.season.endMonth || tr.season.startMonth),
        peakMonths: Array.isArray(tr.season.peakMonths)
          ? tr.season.peakMonths.map((m: string) => formatLocalizedMonth(m, safeLang) || m)
          : localizedSeason.peakMonths
      } : localizedSeason
    };
  }

  // Otherwise, run smart automatic crop & spec translator
  const pName = product.name || '';
  const pNameEn = product.nameEn || '';
  let localizedName = CROP_TRANSLATION_MAP[pName]?.[safeLang] || 
                      CROP_TRANSLATION_MAP[pNameEn]?.[safeLang] ||
                      (product.slug ? CROP_TRANSLATION_MAP[product.slug]?.[safeLang] : undefined);
  if (!localizedName) {
    if (safeLang === 'ar') {
      localizedName = pName || pNameEn; // In admin form, 'name' is Arabic name
    } else {
      localizedName = pNameEn || pName;
    }
  }
  
  const rawVarieties = Array.isArray(product.varieties) ? product.varieties : [];
  const localizedVarieties = rawVarieties.map(
    (v) => CROP_TRANSLATION_MAP[v]?.[safeLang] || v
  );

  const rawGrades = Array.isArray(product.grades) ? product.grades : [];
  const localizedGrades = rawGrades.map(
    (g) => CROP_TRANSLATION_MAP[g]?.[safeLang] || g
  );

  const rawPackaging = Array.isArray(product.packagingOptions) ? product.packagingOptions : [];
  const localizedPackaging = rawPackaging.map(
    (pkg) => PACKAGING_MAP[pkg]?.[safeLang] || pkg
  );

  // Translate Origin string
  let localizedOrigin = product.origin || 'مصر (معتمدة GlobalGAP للتصدير)';
  if (safeLang === 'ar') {
    localizedOrigin = localizedOrigin
      .replace('Egypt', 'مصر')
      .replace('Nile Delta', 'دلتـا النيل')
      .replace('Reclaimed Desert Land', 'الأراضي الصحراوية المستصلحة')
      .replace('Upper Egypt', 'الصعيد')
      .replace('Desert Road', 'الطريق الصحراوي');
  } else if (safeLang === 'fr') {
    localizedOrigin = localizedOrigin.replace('Egypt', 'Égypte');
  } else if (safeLang === 'es') {
    localizedOrigin = localizedOrigin.replace('Egypt', 'Egipto');
  } else if (safeLang === 'de') {
    localizedOrigin = localizedOrigin.replace('Egypt', 'Ägypten');
  } else if (safeLang === 'ru') {
    localizedOrigin = localizedOrigin.replace('Egypt', 'Египет');
  }

  // Translate MOQ
  let localizedMOQ = product.MOQ || (product as any).moq || '1 Forty-Foot Reefer Container (Approx. 24 Metric Tons)';
  if (safeLang === 'ar') {
    localizedMOQ = localizedMOQ
      .replace(/1 Forty-Foot Reefer Container/gi, 'حاوية مبردة 40 قدم')
      .replace(/1 Forty-Foot Container/gi, 'حاوية 40 قدم')
      .replace(/Approx\./gi, 'تقريباً')
      .replace(/Metric Tons/gi, 'طن متري')
      .replace(/Tons/gi, 'طن');
  } else {
    localizedMOQ = localizeMetricValue(localizedMOQ, safeLang);
  }

  // Translate Short Description dynamically
  // PRIORITY: If the product has its own custom shortDescription (e.g. from admin or AI), USE IT!
  let localizedDesc = '';
  if (safeLang === 'ar' && product.shortDescription) {
    localizedDesc = product.shortDescription;
  } else if (product.slug && CROP_DESCRIPTIONS[product.slug]?.[safeLang]) {
    localizedDesc = CROP_DESCRIPTIONS[product.slug][safeLang];
  } else if (product.name && CROP_DESCRIPTIONS[product.name]?.[safeLang]) {
    localizedDesc = CROP_DESCRIPTIONS[product.name][safeLang];
  } else if (product.nameEn && CROP_DESCRIPTIONS[product.nameEn]?.[safeLang]) {
    localizedDesc = CROP_DESCRIPTIONS[product.nameEn][safeLang];
  }

  // 2. If not found in static dictionary, check language specific fields on product object
  if (!localizedDesc) {
    if (safeLang === 'ar') {
      localizedDesc = product.shortDescription || product.description || product.name;
    } else if (safeLang === 'en') {
      localizedDesc = (product as any).shortDescriptionEn || (product as any).descriptionEn || product.shortDescription || product.description || product.nameEn || product.name;
    } else {
      localizedDesc = (product as any).shortDescriptionEn || (product as any).descriptionEn || product.shortDescription || product.description;
    }
  }

  // Translate Specification Sheet Details Labels & Values
  const specDetails = product.specificationSheet?.details || matchingInitial?.specificationSheet?.details || [];
  const localizedSpecDetails = specDetails.map((detail) => {
    let label = detail.label;
    let value = detail.value;

    if (safeLang === 'ar') {
      const labelMap: Record<string, string> = {
        'Crop Origin': 'منشأ المحصول',
        'Primary Varieties': 'الأصناف الرئيسية',
        'Flesh Color': 'لون الثمرة الداخلي',
        'Skin Condition': 'حالة القشرة والغسيل',
        'Pesticide Residue': 'متبقيات المبيدات',
        'Temperature Control': 'درجة حرارة التبريد',
        'Brix Level': 'نسبة السكر (Brix)',
        'Shelf Life': 'العمر التخزيني',
        'Phytosanitary Status': 'حالة الحجر الزراعي',
        'Defects Threshold': 'نسبة العيوب المسموحة',
        'Dry Matter %': 'نسبة المادة الجافة %',
        'Washing State': 'حالة الغسيل والفرز',
        'Ventilation': 'التهوية والتبريد',
        'Chemical Residue': 'الفحص الكيميائي',
        'Outer Skin Layers': 'طبقات القشرة الخارجية',
        'Juice Content': 'نسبة العصير',
        'Brix / Acid Ratio': 'نسبة السكر للحموضة',
        'Waxing & Fungicide': 'التشزير والشمع',
        'Cold Treatment': 'بروتوكول المعالجة بالبرودة',
        'Chilling Risk Threshold': 'حد الخطر وعفن البرودة',
        'Freezing Temp': 'درجة التجميد المستمر',
        'Storage Temp': 'درجة حرارة التخزين المبردة',
        'Origin': 'منشأ المحصول',
        'Variety': 'الصنف',
        'Varieties': 'الأصناف',
        'Export Season': 'موسم التصدير',
        'Seasonality': 'الموسمية',
        'Target Market': 'الأسواق المستهدفة',
        'Freezing Method': 'طريقة التجميد',
        'Product Lines': 'خطوط الإنتاج',
        'Certifications': 'الشهادات المعتمدة',
        'Wall Thickness': 'سمك جدار الثمرة',
        'Relative Humidity': 'الرطوبة النسبية للتخزين',
        'Export Window': 'نافذة موسم التصدير'
      };
      if (labelMap[label]) label = labelMap[label];
      value = value
        .replace(/Egypt/gi, 'مصر')
        .replace(/EU \/ MRL Compliant/gi, 'مطابق لمعايير الاتحاد الأوروبي MRL')
        .replace(/Washed, Cured & Smooth/gi, 'مغسولة ومجففة وناعمة')
        .replace(/Deep Orange/gi, 'برتقالي داكن')
        .replace(/Up to 6 months/gi, 'حتى 6 أشهر')
        .replace(/Certified zero illegal residues/gi, 'معتمدة خالية من أي متبقيات');
    } else {
      value = localizeMetricValue(value, safeLang);
    }

    return { label, value };
  });

  return {
    ...product,
    heroImage: heroImg,
    images: safeImages,
    name: localizedName,
    origin: localizedOrigin,
    varieties: localizedVarieties,
    grades: localizedGrades,
    packagingOptions: localizedPackaging,
    season: localizedSeason,
    MOQ: localizedMOQ,
    shortDescription: localizedDesc,
    specificationSheet: {
      ...product.specificationSheet,
      details: localizedSpecDetails
    }
  };
}

/**
 * Smart Export Project Localizer function
 */
export function getLocalizedProject(project: any, lang: Language | string = 'ar'): any {
  const safeLang = (lang as Language) || 'ar';

  const PROJECT_TRANSLATIONS: Record<string, Record<Language, Partial<any>>> = {
    'proj-sp-1': {
      ar: {
        title: 'شحنات البطاطا الحلوة البيورجارد لموانئ فيليكسستو وروتردام',
        destination: 'المملكة المتحدة وهولندا (Felixstowe / Rotterdam)',
        port: 'ميناء فيليكسستو وميناء روتردام',
        cropName: 'بطاطا حلوة بيورجارد حمراء (Beauregard)',
        completionDate: 'موسم 2025 / 2026',
        specsHighlight: 'أحجام L/XL/M، غسيل آلي، تجفيف وعلاج حراري (Curing) متكامل، كرتون 6 كجم، تبريد +13.5°م',
        phytosanitaryStatus: 'شهادات صحة نباتية CAPQ وخلو من الآفات والـ MRL الأوروبية المعتمدة'
      },
      en: {
        title: 'Beauregard Sweet Potatoes Fleet to Felixstowe and Rotterdam',
        destination: 'United Kingdom & Netherlands (Felixstowe / Rotterdam)',
        port: 'Port of Felixstowe & Port of Rotterdam',
        cropName: 'Red Beauregard Sweet Potatoes',
        completionDate: 'Season 2025 / 2026',
        specsHighlight: 'Sizes L/XL/M, washed, automated curing, 6kg carton, +13.5°C reefer',
        phytosanitaryStatus: 'Official CAPQ Phytosanitary Certificate & EU MRL Compliant'
      },
      fr: {
        title: 'Expéditions de patates douces Beauregard vers Felixstowe et Rotterdam',
        destination: 'Royaume-Uni et Pays-Bas (Felixstowe / Rotterdam)',
        port: 'Port de Felixstowe & Port de Rotterdam',
        cropName: 'Patates douces rouges Beauregard',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Tailles L/XL/M, lavage automatisé, séchage & curing, carton 6 kg, +13.5°C',
        phytosanitaryStatus: 'Certificat phytosanitaire officiel CAPQ et conformité MRL UE'
      },
      es: {
        title: 'Flota de Batata Dulce Beauregard a Felixstowe y Rotterdam',
        destination: 'Reino Unido y Países Bajos (Felixstowe / Rotterdam)',
        port: 'Puerto de Felixstowe y Puerto de Rotterdam',
        cropName: 'Batata Dulce Roja Beauregard',
        completionDate: 'Temporada 2025 / 2026',
        specsHighlight: 'Calibres L/XL/M, lavado automatizado, curado térmico, caja 6 kg, +13.5°C',
        phytosanitaryStatus: 'Certificado fitosanitario oficial CAPQ y cumplimiento MRL de la UE'
      },
      de: {
        title: 'Beauregard Süßkartoffel-Lieferungen nach Felixstowe & Rotterdam',
        destination: 'Großbritannien & Niederlande (Felixstowe / Rotterdam)',
        port: 'Hafen Felixstowe & Hafen Rotterdam',
        cropName: 'Rote Beauregard Süßkartoffeln',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Größen L/XL/M, gewaschen, thermisch behandelt (Curing), 6kg Karton, +13.5°C',
        phytosanitaryStatus: 'Amtliches CAPQ-Pflanzenschutzzertifikat & EU-MRL-Konformität'
      },
      ru: {
        title: 'Поставки сладкого картофеля Борегард в Феликстоу и Роттердам',
        destination: 'Великобритания и Нидерланды (Felixstowe / Rotterdam)',
        port: 'Порт Феликстоу и Порт Роттердам',
        cropName: 'Красный сладкий картофель Борегард',
        completionDate: 'Сезон 2025 / 2026',
        specsHighlight: 'Калибры L/XL/M, мойка, термообработка (Curing), картон 6 кг, +13.5°C',
        phytosanitaryStatus: 'Официальный фитосанитарный сертификат CAPQ и нормы MRL ЕС'
      }
    },
    'proj-sp-2': {
      ar: {
        title: 'شحنات البطاطا الحلوة بيليفيو وإيفانجلين لموانئ جدة وهامبورغ',
        destination: 'المملكة العربية السعودية وألمانيا (Jeddah / Hamburg)',
        port: 'ميناء جدة الإسلامي وميناء هامبورغ',
        cropName: 'بطاطا حلوة بيليفيو وإيفانجلين (Bellevue & Evangeline)',
        completionDate: 'موسم 2025 / 2026',
        specsHighlight: 'أحجام موحدة S/M/L، كرتون تلسكوبي 10 كجم وأكياس جامبو، سلسلة تبريد مستمرة +13.5°م',
        phytosanitaryStatus: 'مطابقة تامة لاشتراطات هيئة الغذاء والدواء السعودية SFDA ومعايير الاتحاد الأوروبي'
      },
      en: {
        title: 'Bellevue & Evangeline Sweet Potatoes to Jeddah & Hamburg',
        destination: 'Saudi Arabia & Germany (Jeddah / Hamburg)',
        port: 'Jeddah Islamic Port & Port of Hamburg',
        cropName: 'Bellevue & Evangeline Sweet Potatoes',
        completionDate: 'Season 2025 / 2026',
        specsHighlight: 'Uniform sizes S/M/L, 10kg telescopic cartons & jumbo bags, +13.5°C cold chain',
        phytosanitaryStatus: 'Full compliance with SFDA standards & EU phytosanitary directives'
      },
      fr: {
        title: 'Patates douces Bellevue & Evangeline vers Djeddah et Hambourg',
        destination: 'Arabie Saoudite & Allemagne (Jeddah / Hamburg)',
        port: 'Port Islamique de Djeddah & Port de Hambourg',
        cropName: 'Patates douces Bellevue & Evangeline',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Tailles S/M/L, carton télescopique 10 kg et sacs jumbo, chaîne du froid +13.5°C',
        phytosanitaryStatus: 'Conformité totale avec les normes SFDA et les directives phytosanitaires UE'
      },
      es: {
        title: 'Batata Dulce Bellevue y Evangeline a Yeda y Hamburgo',
        destination: 'Arabia Saudita y Alemania (Jeddah / Hamburg)',
        port: 'Puerto Islámico de Yeda y Puerto de Hamburgo',
        cropName: 'Batata Dulce Bellevue y Evangeline',
        completionDate: 'Temporada 2025 / 2026',
        specsHighlight: 'Calibres S/M/L, cartón telescópico 10 kg y bolsas jumbo, cadena de frío +13.5°C',
        phytosanitaryStatus: 'Conformidad total con normas SFDA y directivas fitosanitarias de la UE'
      },
      de: {
        title: 'Bellevue & Evangeline Süßkartoffeln nach Dschidda & Hamburg',
        destination: 'Saudi-Arabien & Deutschland (Jeddah / Hamburg)',
        port: 'Dschidda Hafen & Hafen Hamburg',
        cropName: 'Bellevue & Evangeline Süßkartoffeln',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Einheitliche Größen S/M/L, 10kg Teleskopkartons & Jumbosäcke, +13.5°C Kühlkette',
        phytosanitaryStatus: 'Vollständige Einhaltung der SFDA-Standards und EU-Pflanzenschutzrichtlinien'
      },
      ru: {
        title: 'Сладкий картофель Бельвю и Эванджелин в Джидду и Гамбург',
        destination: 'Саудовская Аравия и Германия (Jeddah / Hamburg)',
        port: 'Исламский порт Джидда и Порт Гамбург',
        cropName: 'Сладкий картофель Бельвю и Эванджелин',
        completionDate: 'Сезон 2025 / 2026',
        specsHighlight: 'Калибры S/M/L, телескопический картон 10 кг и биг-бэги, холод +13.5°C',
        phytosanitaryStatus: 'Полное соответствие нормам SFDA и директивам ЕС'
      }
    },
    'proj-oni-1': {
      ar: {
        title: 'شحنات البصل الأحمر والجاف الفاخر لموانئ روتردام وجدة والدمام',
        destination: 'هولندا والمملكة العربية السعودية (Rotterdam / Dammam)',
        port: 'ميناء روتردام وميناء الملك عبد العزيز بالدمام',
        cropName: 'البصل المصري الأحمر والذهبي الجاف (Red & Golden Onions)',
        completionDate: 'موسم 2025 / 2026',
        specsHighlight: 'أحجام 50-70مم و70-90مم، تجفيف طبيعي وتهوية محكومة، أكياس شبك 25 كجم، تبريد +5.0°م',
        phytosanitaryStatus: 'شهادات فحص الحجر الزراعي CAPQ ومطابقة نسبة المادة الجافة Dry Matter > 14.5%'
      },
      en: {
        title: 'Premium Red & Dry Onions Shipments to Rotterdam, Jeddah & Dammam',
        destination: 'Netherlands & Saudi Arabia (Rotterdam / Dammam)',
        port: 'Port of Rotterdam & King Abdulaziz Port in Dammam',
        cropName: 'Egyptian Red & Golden Dry Onions',
        completionDate: 'Season 2025 / 2026',
        specsHighlight: 'Sizes 50-70mm & 70-90mm, natural curing & controlled ventilation, 25kg mesh bags, +5.0°C reefer',
        phytosanitaryStatus: 'Egyptian CAPQ Quarantine Inspection Certificates & Dry Matter > 14.5% Compliant'
      },
      fr: {
        title: 'Expéditions d’oignons rouges et secs de qualité supérieure vers Rotterdam, Djeddah & Dammam',
        destination: 'Pays-Bas & Arabie Saoudite (Rotterdam / Dammam)',
        port: 'Port de Rotterdam & Port Roi Abdulaziz à Dammam',
        cropName: 'Oignons rouges et jaunes secs d’Égypte',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Tailles 50-70mm & 70-90mm, séchage naturel & ventilation contrôlée, sacs filet 25 kg, +5.0°C',
        phytosanitaryStatus: 'Certificats phytosanitaires CAPQ et conformité matière sèche > 14,5%'
      },
      es: {
        title: 'Envíos de Cebolla Roja y Seca Premium a Rotterdam, Yeda y Dammam',
        destination: 'Países Bajos y Arabia Saudita (Rotterdam / Dammam)',
        port: 'Puerto de Rotterdam y Puerto Rey Abdulaziz en Dammam',
        cropName: 'Cebolla Roja y Dorada Seca de Egipto',
        completionDate: 'Temporada 2025 / 2026',
        specsHighlight: 'Calibres 50-70mm y 70-90mm, curado natural y ventilación controlada, sacos de malla 25 kg, +5.0°C',
        phytosanitaryStatus: 'Certificados de inspección fitosanitaria CAPQ y materia seca > 14.5%'
      },
      de: {
        title: 'Premium Rote & Gelbe Zwiebeln Lieferungen nach Rotterdam, Dschidda & Dammam',
        destination: 'Niederlande & Saudi-Arabien (Rotterdam / Dammam)',
        port: 'Hafen Rotterdam & König-Abdulaziz-Hafen Dammam',
        cropName: 'Ägyptische rote & gelbe Speisezwiebeln',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Größen 50-70mm & 70-90mm, natürliche Trocknung & kontrollierte Belüftung, 25kg Netzbeutel, +5.0°C',
        phytosanitaryStatus: 'Ägyptische CAPQ-Quarantänezertifikate & Trockensubstanz > 14,5%'
      },
      ru: {
        title: 'Поставки премиального красного и репчатого лука в Роттердам, Джидду и Даммам',
        destination: 'Нидерланды и Саудовская Аравия (Rotterdam / Dammam)',
        port: 'Порт Роттердама и Порт Короля Абдул-Азиза в Даммаме',
        cropName: 'Египетский красный и сухой желтый лук',
        completionDate: 'Сезон 2025 / 2026',
        specsHighlight: 'Калибры 50-70 мм и 70-90 мм, естественная сушка и вентиляция, сетки 25 кг, рефрижератор +5.0°C',
        phytosanitaryStatus: 'Фитосанитарный контроль CAPQ и сухое вещество > 14,5%'
      }
    },
    'proj-car-1': {
      ar: {
        title: 'شحنات الجزر البرتقالي المغسول والمفرز لموانئ جبل علي وهامبورغ',
        destination: 'الإمارات العربية المتحدة وألمانيا (Jebel Ali / Hamburg)',
        port: 'ميناء جبل علي وميناء هامبورغ',
        cropName: 'الجزر البرتقالي نانتس المغسول (Nantes Orange Carrots)',
        completionDate: 'موسم 2025 / 2026',
        specsHighlight: 'غسيل وتلميع بصري، فرز أحجام M/L، كرتون تلسكوبي 10 كجم، سلسلة تبريد +0.5°م',
        phytosanitaryStatus: 'شهادة GlobalGAP وحجر زراعي CAPQ وتطهير خطوط التعبئة والتغليف'
      },
      en: {
        title: 'Washed & Sized Nantes Orange Carrots Fleet to Jebel Ali & Hamburg',
        destination: 'UAE & Germany (Jebel Ali / Hamburg)',
        port: 'Jebel Ali Port & Port of Hamburg',
        cropName: 'Washed Nantes Orange Carrots',
        completionDate: 'Season 2025 / 2026',
        specsHighlight: 'Optically washed & polished, M/L sizing, 10kg telescopic carton, +0.5°C cold chain',
        phytosanitaryStatus: 'GlobalGAP Certified, Official CAPQ Quarantine Inspection & Sanitized Packing Lines'
      },
      fr: {
        title: 'Carottes oranges Nantes lavées et calibrées vers Jebel Ali & Hambourg',
        destination: 'Émirats & Allemagne (Jebel Ali / Hamburg)',
        port: 'Port de Jebel Ali & Port de Hambourg',
        cropName: 'Carottes oranges lavées Nantes',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Lavage et polissage optique, calibrage M/L, carton télescopique 10 kg, chaîne du froid +0.5°C',
        phytosanitaryStatus: 'Certifié GlobalGAP, contrôle phytosanitaire CAPQ & lignes d’emballage assainies'
      },
      es: {
        title: 'Zanahoria Naranja Nantes Lavada y Clasificada a Jebel Ali y Hamburgo',
        destination: 'EAU y Alemania (Jebel Ali / Hamburg)',
        port: 'Puerto de Jebel Ali y Puerto de Hamburgo',
        cropName: 'Zanahoria Naranja Lavada Nantes',
        completionDate: 'Temporada 2025 / 2026',
        specsHighlight: 'Lavado y pulido óptico, clasificación M/L, caja telescópica de 10 kg, cadena de frío +0.5°C',
        phytosanitaryStatus: 'Certificación GlobalGAP, inspección de cuarentena CAPQ y líneas desinfectadas'
      },
      de: {
        title: 'Gewaschene & Sortierte Nantes Karotten Lieferungen nach Jebel Ali & Hamburg',
        destination: 'VAE & Deutschland (Jebel Ali / Hamburg)',
        port: 'Hafen Jebel Ali & Hafen Hamburg',
        cropName: 'Gewaschene Nantes Karotten',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Optisch gewaschen & poliert, Größen M/L, 10kg Teleskopkarton, Kühlkette bei +0.5°C',
        phytosanitaryStatus: 'GlobalGAP-zertifiziert, amtliche CAPQ-Quarantänekontrolle & desinfizierte Packstraßen'
      },
      ru: {
        title: 'Партии мытой и отсортированной моркови Нантская в Джебель-Али и Гамбург',
        destination: 'ОАЭ и Германия (Jebel Ali / Hamburg)',
        port: 'Порт Джебель-Али и Порт Гамбурга',
        cropName: 'Мытая оранжевая морковь Нантская',
        completionDate: 'Сезон 2025 / 2026',
        specsHighlight: 'Оптическая мойка и полировка, калибровка M/L, картон 10 кг, рефрижератор +0.5°C',
        phytosanitaryStatus: 'Сертификация GlobalGAP, фитосанитарный контроль CAPQ и дезинфекция линий'
      }
    },
    'proj-garlic-1': {
      ar: {
        title: 'صادرات الثوم البلدي الأبيض والأرجواني لموانئ مارسيليا وجدة',
        destination: 'فرنسا والمملكة العربية السعودية (Marseilles / Jeddah)',
        port: 'ميناء مارسيليا وميناء جدة',
        cropName: 'الثوم المصري البلدي والصيني (White & Purple Garlic)',
        completionDate: 'موسم 2025 / 2026',
        specsHighlight: 'أحجام 55-65 مم، تجفيف هوائي محكوم وتجذير آلي، صناديق كرتون 10 كجم، تبريد +1.0°م',
        phytosanitaryStatus: 'مطابقة الفحص الميكروبيولوجي واشتراطات الحجر الزراعي CAPQ'
      },
      en: {
        title: 'White & Purple Egyptian Garlic Exports to Marseilles & Jeddah',
        destination: 'France & Saudi Arabia (Marseilles / Jeddah)',
        port: 'Port of Marseilles & Jeddah Islamic Port',
        cropName: 'Egyptian White & Purple Garlic',
        completionDate: 'Season 2025 / 2026',
        specsHighlight: 'Sizes 55-65mm, controlled air curing & mechanical de-rooting, 10kg cartons, +1.0°C reefer',
        phytosanitaryStatus: 'Microbiological Compliance Certified & Egyptian CAPQ Quarantine Inspected'
      },
      fr: {
        title: 'Exportations d’ail blanc et violet égyptien vers Marseille et Djeddah',
        destination: 'France & Arabie Saoudite (Marseilles / Jeddah)',
        port: 'Port de Marseille & Port Islamique de Djeddah',
        cropName: 'Ail blanc et violet d’Égypte',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Tailles 55-65mm, séchage à air contrôlé & déracinement mécanique, cartons 10 kg, +1.0°C',
        phytosanitaryStatus: 'Conformité microbiologique certifiée & contrôle phytosanitaire CAPQ'
      },
      es: {
        title: 'Exportaciones de Ajo Blanco y Violeta a Marsella y Yeda',
        destination: 'Francia y Arabia Saudita (Marseilles / Jeddah)',
        port: 'Puerto de Marsella y Puerto Islámico de Yeda',
        cropName: 'Ajo Blanco y Violeta de Egipto',
        completionDate: 'Temporada 2025 / 2026',
        specsHighlight: 'Calibres 55-65mm, curado por aire controlado y desraizado mecánico, cajas 10 kg, +1.0°C',
        phytosanitaryStatus: 'Inspección microbiológica aprobada y cuarentena fitosanitaria CAPQ'
      },
      de: {
        title: 'Ägyptische Weiß- und Knoblauch-Exporte nach Marseille & Dschidda',
        destination: 'Frankreich & Saudi-Arabien (Marseilles / Jeddah)',
        port: 'Hafen Marseille & Dschidda Hafen',
        cropName: 'Ägyptischer Weißer & Violetter Knoblauch',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Größen 55-65mm, kontrollierte Lufttrocknung & Entwurzelung, 10kg Kartons, +1.0°C',
        phytosanitaryStatus: 'Mikrobiologische Prüfung bestanden & amtliche CAPQ-Quarantänekontrolle'
      },
      ru: {
        title: 'Экспорт белого и фиолетового египетского чеснока в Марсель и Джидду',
        destination: 'Франция и Саудовская Аравия (Marseilles / Jeddah)',
        port: 'Порт Марселя и Исламский порт Джидда',
        cropName: 'Египетский белый и фиолетовый чеснок',
        completionDate: 'Сезон 2025 / 2026',
        specsHighlight: 'Калибры 55-65 мм, сушка с контролируемым воздухом, картон 10 кг, рефрижератор +1.0°C',
        phytosanitaryStatus: 'Микробиологическая проверка и фитосанитарный контроль CAPQ'
      }
    },
    'proj-pom-1': {
      ar: {
        title: 'شحنات الرمان الوندرفول الياقوتي لموانئ روتردام وسنغافورة',
        destination: 'هولندا وسنغافورة (Rotterdam / Singapore)',
        port: 'ميناء روتردام وميناء سنغافورة',
        cropName: 'رمان وندرفول طازج (Wonderful Pomegranates)',
        completionDate: 'موسم 2025 / 2026',
        specsHighlight: 'أحجام Count 10/12/14، نسبة سكر Brix 17°، كرتون Open-Top 4.5 كجم، تبريد +6.5°م',
        phytosanitaryStatus: 'شهادات GlobalGAP وفحص خلو من ذبابة الفاكهة وفق البروتوكول الأوروبي'
      },
      en: {
        title: 'Fresh Wonderful Pomegranates Fleet to Rotterdam & Singapore',
        destination: 'Netherlands & Singapore (Rotterdam / Singapore)',
        port: 'Port of Rotterdam & Port of Singapore',
        cropName: 'Fresh Wonderful Pomegranates',
        completionDate: 'Season 2025 / 2026',
        specsHighlight: 'Counts 10/12/14, Brix 17°+, 4.5kg Open-Top cartons, +6.5°C temperature control',
        phytosanitaryStatus: 'GlobalGAP Certified & Fruit-Fly Free Certification per EU Protocol'
      },
      fr: {
        title: 'Expéditions de grenades Wonderful fraîches vers Rotterdam et Singapour',
        destination: 'Pays-Bas & Singapour (Rotterdam / Singapore)',
        port: 'Port de Rotterdam & Port de Singapour',
        cropName: 'Grenades fraîches Wonderful',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Calibres 10/12/14, Brix 17°+, cartons Open-Top 4,5 kg, contrôle température +6.5°C',
        phytosanitaryStatus: 'Certifié GlobalGAP et contrôle certifié exempt de mouche des fruits UE'
      },
      es: {
        title: 'Flota de Granada Wonderful Fresca a Rotterdam y Singapur',
        destination: 'Países Bajos y Singapur (Rotterdam / Singapore)',
        port: 'Puerto de Rotterdam y Puerto de Singapur',
        cropName: 'Granadas Frescas Wonderful',
        completionDate: 'Temporada 2025 / 2026',
        specsHighlight: 'Conteos 10/12/14, Brix 17°+, cajas Open-Top de 4.5 kg, control térmico +6.5°C',
        phytosanitaryStatus: 'Certificación GlobalGAP y libre de mosca de la fruta según protocolo UE'
      },
      de: {
        title: 'Frische Wonderful Granatapfel-Lieferung nach Rotterdam & Singapur',
        destination: 'Niederlande & Singapur (Rotterdam / Singapore)',
        port: 'Hafen Rotterdam & Hafen Singapur',
        cropName: 'Frische Wonderful Granatäpfel',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Größen 10/12/14, Brix 17°+, 4.5kg Open-Top Kartons, Temperaturführung bei +6.5°C',
        phytosanitaryStatus: 'GlobalGAP-zertifiziert & fruchtfliegenfrei gemäß EU-Protokoll'
      },
      ru: {
        title: 'Партии свежего граната Вондерфул в Роттердам и Сингапур',
        destination: 'Нидерланды и Сингапур (Rotterdam / Singapore)',
        port: 'Порт Роттердама и Порт Сингапура',
        cropName: 'Свежий гранат Вондерфул',
        completionDate: 'Сезон 2025 / 2026',
        specsHighlight: 'Калибры 10/12/14, Brix 17°+, открытые коробки 4,5 кг, температура +6.5°C',
        phytosanitaryStatus: 'Сертификация GlobalGAP и отсутствие мухи согласно протоколам ЕС'
      }
    },
    'proj-ora-1': {
      ar: {
        title: 'شحنات البرتقال والموالح الفالنسيا لموانئ شنغهاي وروتردام',
        destination: 'الصين وهولندا (Shanghai / Rotterdam)',
        port: 'ميناء شنغهاي وميناء روتردام',
        cropName: 'البرتقال الصيفي فالنسيا (Valencia Citrus Oranges)',
        completionDate: 'موسم 2025 / 2026',
        specsHighlight: 'أحجام Counts 56-88، نسبة عصير > 48%، شمع بروتوكولي، تلسكوبي 15 كجم، تبريد +4°م',
        phytosanitaryStatus: 'بروتوكول المعاملة بالتبريد الشديد Cold Treatment المعتمد للحجر الصيني والأوروبي'
      },
      en: {
        title: 'Valencia Citrus Oranges Cargo to Ports of Shanghai & Rotterdam',
        destination: 'China & Netherlands (Shanghai / Rotterdam)',
        port: 'Port of Shanghai & Port of Rotterdam',
        cropName: 'Fresh Valencia Citrus Oranges',
        completionDate: 'Season 2025 / 2026',
        specsHighlight: 'Counts 56-88, juice content > 48%, food-grade wax, 15kg telescopic carton, +4.0°C reefer',
        phytosanitaryStatus: 'Official In-Transit Cold Treatment Protocol Certified for GACC China & EU Quarantine'
      },
      fr: {
        title: 'Cargaison d’oranges Valencia vers les ports de Shanghai et Rotterdam',
        destination: 'Chine & Pays-Bas (Shanghai / Rotterdam)',
        port: 'Port de Shanghai & Port de Rotterdam',
        cropName: 'Oranges douces Valencia',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Calibres 56-88, teneur en jus > 48%, cire alimentaire, carton télescopique 15 kg, +4.0°C',
        phytosanitaryStatus: 'Protocole de traitement par le froid officiel certifié pour la Chine (GACC) et l’UE'
      },
      es: {
        title: 'Cargamento de Naranja Valencia a los Puertos de Shanghái y Rotterdam',
        destination: 'China y Países Bajos (Shanghai / Rotterdam)',
        port: 'Puerto de Shanghái y Puerto de Rotterdam',
        cropName: 'Naranjas Frescas Valencia',
        completionDate: 'Temporada 2025 / 2026',
        specsHighlight: 'Conteos 56-88, contenido de jugo > 48%, cera alimenticia, caja de 15 kg, reefer +4.0°C',
        phytosanitaryStatus: 'Protocolo de tratamiento en frío certificado para cuarentena de China GACC y la UE'
      },
      de: {
        title: 'Valencia Saftorangen-Lieferung zu den Häfen Shanghai & Rotterdam',
        destination: 'China & Niederlande (Shanghai / Rotterdam)',
        port: 'Hafen Shanghai & Hafen Rotterdam',
        cropName: 'Frische Valencia Saftorangen',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Größen 56-88, Saftgehalt > 48%, Lebensmittelwachs, 15kg Teleskopkarton, +4.0°C',
        phytosanitaryStatus: 'Offizielles Cold-Treatment-Protokoll für GACC China & EU-Quarantäne zertifiziert'
      },
      ru: {
        title: 'Партия сочных апельсинов Валенсия в порты Шанхай и Роттердам',
        destination: 'Китай и Нидерланды (Shanghai / Rotterdam)',
        port: 'Порт Шанхай и Порт Роттердам',
        cropName: 'Свежие апельсины Валенсия',
        completionDate: 'Сезон 2025 / 2026',
        specsHighlight: 'Калибры 56-88, сочность > 48%, пищевой воск, телескопический картон 15 кг, +4.0°C',
        phytosanitaryStatus: 'Протокол холодовой обработки Cold Treatment для Китая (GACC) и ЕС'
      }
    },
    'proj-fries-1': {
      ar: {
        title: 'شحنات البطاطس المجمدة بوم فريت لسلاسل المطاعم والتجزئة',
        destination: 'الإمارات العربية المتحدة والسعودية (Jebel Ali / Jeddah)',
        port: 'ميناء جبل علي وميناء جدة',
        cropName: 'بطاطس مفرزة ومجمدة IQF أصابع (Frozen French Fries)',
        completionDate: 'موسم 2025 / 2026',
        specsHighlight: 'مقاسات 9x9 مم و10x10 مم، قرمشة عالية، كرتون 10 كجم (4 أكياس × 2.5 كجم)، تجميد -18°م',
        phytosanitaryStatus: 'شهادات سلامة الغذاء ISO 22000 وHACCP وشهادة الحلال الرسمية Halal'
      },
      en: {
        title: 'Frozen IQF French Fries Shipments to Foodservice & QSR Chains',
        destination: 'UAE & Saudi Arabia (Jebel Ali / Jeddah)',
        port: 'Jebel Ali Port & Jeddah Islamic Port',
        cropName: 'Frozen IQF French Fries',
        completionDate: 'Season 2025 / 2026',
        specsHighlight: 'Cuts 9x9mm & 10x10mm, high crispiness, 10kg master carton (4 x 2.5kg bags), -18°C deep freeze',
        phytosanitaryStatus: 'ISO 22000, HACCP Food Safety Certified & Official Halal Certification'
      },
      fr: {
        title: 'Expéditions de frites surgelées IQF pour les chaînes de restauration',
        destination: 'Émirats & Arabie Saoudite (Jebel Ali / Jeddah)',
        port: 'Port de Jebel Ali & Port Islamique de Djeddah',
        cropName: 'Frites surgelées IQF',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Coupes 9x9mm & 10x10mm, haute croustillance, carton 10 kg (4 x 2.5 kg), surgélation -18°C',
        phytosanitaryStatus: 'Certifié sécurité alimentaire ISO 22000, HACCP & certification Halal officielle'
      },
      es: {
        title: 'Envíos de Papas Fritas Congeladas IQF para Cadenas de Restaurantes',
        destination: 'EAU y Arabia Saudita (Jebel Ali / Jeddah)',
        port: 'Puerto de Jebel Ali y Puerto Islámico de Yeda',
        cropName: 'Papas Fritas Congeladas IQF',
        completionDate: 'Temporada 2025 / 2026',
        specsHighlight: 'Cortes 9x9mm y 10x10mm, alta crocancia, caja de 10 kg (4 x 2.5 kg), congelación -18°C',
        phytosanitaryStatus: 'Certificaciones ISO 22000, HACCP de inocuidad alimentaria y certificado Halal'
      },
      de: {
        title: 'Tiefgekühlte IQF Pommes Frites Lieferungen für Gastronomieketten',
        destination: 'VAE & Saudi-Arabien (Jebel Ali / Jeddah)',
        port: 'Hafen Jebel Ali & Dschidda Hafen',
        cropName: 'Tiefgekühlte IQF Pommes Frites',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Schnitt 9x9mm & 10x10mm, hohe Krossheit, 10kg Umkarton (4 x 2.5kg Beutel), -18°C Tiefkühlung',
        phytosanitaryStatus: 'ISO 22000, HACCP Lebensmittelsicherheit & offizielles Halal-Zertifikat'
      },
      ru: {
        title: 'Поставки замороженного картофеля фри IQF для сетей питания',
        destination: 'ОАЭ и Саудовская Аравия (Jebel Ali / Jeddah)',
        port: 'Порт Джебель-Али и Исламский порт Джидда',
        cropName: 'Замороженный картофель фри IQF',
        completionDate: 'Сезон 2025 / 2026',
        specsHighlight: 'Нарезка 9х9 мм и 10х10 мм, хрустящий, картон 10 кг (4 х 2.5 кг), заморозка -18°C',
        phytosanitaryStatus: 'Сертификаты пищевой безопасности ISO 22000, HACCP и сертификат Халяль'
      }
    },
    'proj-half-1': {
      ar: {
        title: 'شحنات البطاطس والبطاطا الحلوة نصف المقلية للأسواق الخليجية',
        destination: 'الكويت والشويخ (Shuwaikh / Dammam)',
        port: 'ميناء الشويخ وميناء الدمام',
        cropName: 'بطاطس وبطاطا حلوة نصف مقلية (Half-Fried Potatoes & Sweet Potatoes)',
        completionDate: 'موسم 2025 / 2026',
        specsHighlight: 'تجهيز نصف مقلي Half-Fried، تقطيع Steak Cut & Crinkle، عبوات 10 كجم، تجميد -18°م',
        phytosanitaryStatus: 'شهادات الحلال ومطابقة الهيئة العامة للغذء والدواء وقوانين السلامة للخليج'
      },
      en: {
        title: 'Half-Fried Potatoes & Sweet Potatoes Cargo to GCC Markets',
        destination: 'Kuwait & Saudi Arabia (Shuwaikh / Dammam)',
        port: 'Shuwaikh Port & King Abdulaziz Port Dammam',
        cropName: 'Half-Fried Potatoes & Sweet Potatoes',
        completionDate: 'Season 2025 / 2026',
        specsHighlight: 'Half-Fried pre-cooked, Steak Cut & Crinkle styles, 10kg bags, -18°C deep freeze',
        phytosanitaryStatus: 'Official Halal Certified & Compliant with GCC Food Safety Regulations & SFDA'
      },
      fr: {
        title: 'Cargaison de pommes de terre & patates douces mi-cuites vers le Golfe',
        destination: 'Koweït & Arabie Saoudite (Shuwaikh / Dammam)',
        port: 'Port de Shuwaikh & Port de Dammam',
        cropName: 'Pommes de terre & patates douces mi-cuites',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Pré-cuites Half-Fried, coupes Steak Cut & Crinkle, sachet 10 kg, surgélation -18°C',
        phytosanitaryStatus: 'Certifié Halal & conforme aux réglementations de sécurité alimentaire du Golfe'
      },
      es: {
        title: 'Cargamento de Papas y Camotes Prefritos a los Mercados del Golfo',
        destination: 'Kuwait y Arabia Saudita (Shuwaikh / Dammam)',
        port: 'Puerto de Shuwaikh y Puerto de Dammam',
        cropName: 'Papas y Camotes Prefritos',
        completionDate: 'Temporada 2025 / 2026',
        specsHighlight: 'Prefritos Half-Fried, cortes Steak Cut y Ondulado, cajas 10 kg, congelación -18°C',
        phytosanitaryStatus: 'Certificado Halal y conformidad con las regulaciones alimentarias del Golfo'
      },
      de: {
        title: 'Vorgebackene Kartoffeln & Süßkartoffeln-Lieferung in die Golfregion',
        destination: 'Kuwait & Saudi-Arabien (Shuwaikh / Dammam)',
        port: 'Hafen Shuwaikh & Hafen Dammam',
        cropName: 'Vorgebackene Kartoffeln & Süßkartoffeln',
        completionDate: 'Saison 2025 / 2026',
        specsHighlight: 'Half-Fried vorgebacken, Steak Cut & Wellenschnitt, 10kg Beutel, -18°C Tiefkühlung',
        phytosanitaryStatus: 'Offizielles Halal-Zertifikat & Konformität mit Lebensmittelvorschriften der Golfstaaten'
      },
      ru: {
        title: 'Партии полуобжаренного картофеля и батата в страны Залива',
        destination: 'Кувейт и Саудовская Аравия (Shuwaikh / Dammam)',
        port: 'Порт Шувайх и Порт Даммам',
        cropName: 'Полуобжаренный картофель и батат',
        completionDate: 'Сезон 2025 / 2026',
        specsHighlight: 'Предварительная обжарка, нарезка Стейк и Рифленая, упаковка 10 кг, заморозка -18°C',
        phytosanitaryStatus: 'Сертификат Халяль и соответствие стандартам пищевой безопасности Залива'
      }
    }
  };

  const override = PROJECT_TRANSLATIONS[project.id]?.[safeLang];
  const catLabel = project.categoryLabel?.[safeLang] || project.categoryLabel?.['ar'] || project.categoryLabel;
  const feedback = project.buyerFeedback?.[safeLang] || project.buyerFeedback?.['ar'] || project.buyerFeedback;

  let result = {
    ...project,
    categoryLabel: catLabel,
    buyerFeedback: feedback
  };

  if (override) {
    result = {
      ...result,
      ...override
    };
  }

  // If non-Arabic and fields still contain Arabic words, dynamically sanitize/translate them
  if (safeLang !== 'ar') {
    const seasonPrefix = safeLang === 'fr' || safeLang === 'de' ? 'Saison' : safeLang === 'es' ? 'Temporada' : safeLang === 'ru' ? 'Сезон' : 'Season';
    
    if (result.completionDate && typeof result.completionDate === 'string') {
      result.completionDate = result.completionDate.replace(/موسم/g, seasonPrefix);
    }

    if (result.destination && typeof result.destination === 'string') {
      result.destination = result.destination
        .replace(/الإمارات العربية المتحدة/g, 'UAE')
        .replace(/المملكة العربية السعودية/g, 'Saudi Arabia')
        .replace(/ألمانيا/g, 'Germany')
        .replace(/هولندا/g, 'Netherlands')
        .replace(/فرنسا/g, 'France')
        .replace(/إيطاليا/g, 'Italy')
        .replace(/المملكة المتحدة/g, 'United Kingdom')
        .replace(/روسيا/g, 'Russia')
        .replace(/ماليزيا/g, 'Malaysia')
        .replace(/سنغافورة/g, 'Singapore')
        .replace(/الصين/g, 'China')
        .replace(/الكويت/g, 'Kuwait');
    }

    if (result.port && typeof result.port === 'string') {
      result.port = result.port
        .replace(/ميناء/g, 'Port of')
        .replace(/و/g, '&');
    }
  }

  return result;
}

export interface CountryOption {
  code: string;
  flag: string;
  names: Record<Language, string>;
  defaultPort: string;
}

export const EXPORT_COUNTRIES: CountryOption[] = [
  { code: 'NL', flag: '🇳🇱', defaultPort: 'Port of Rotterdam', names: { ar: 'هولندا (مملكة الأراضي المنخفضة)', en: 'Netherlands', fr: 'Pays-Bas', es: 'Países Bajos', de: 'Niederlande', ru: 'Нидерланды' } },
  { code: 'SA', flag: '🇸🇦', defaultPort: 'Jeddah Islamic Port', names: { ar: 'المملكة العربية السعودية', en: 'Saudi Arabia', fr: 'Arabie Saoudite', es: 'Arabia Saudita', de: 'Saudi-Arabien', ru: 'Саудовская Аравия' } },
  { code: 'AE', flag: '🇦🇪', defaultPort: 'Jebel Ali Port (Dubai)', names: { ar: 'الإمارات العربية المتحدة', en: 'United Arab Emirates', fr: 'Émirats arabes unis', es: 'Emiratos Árabes Unidos', de: 'Vereinigte Arabische Emirate', ru: 'ОАЭ' } },
  { code: 'DE', flag: '🇩🇪', defaultPort: 'Port of Hamburg', names: { ar: 'ألمانيا', en: 'Germany', fr: 'Allemagne', es: 'Alemania', de: 'Deutschland', ru: 'Германия' } },
  { code: 'GB', flag: '🇬🇧', defaultPort: 'Port of Felixstowe / London Gateway', names: { ar: 'المملكة المتحدة (بريطانيا)', en: 'United Kingdom', fr: 'Royaume-Uni', es: 'Reino Unido', de: 'Vereinigtes Königreich', ru: 'Великобритания' } },
  { code: 'FR', flag: '🇫🇷', defaultPort: 'Port of Marseille / Le Havre', names: { ar: 'فرنسا', en: 'France', fr: 'France', es: 'Francia', de: 'Frankreich', ru: 'Франция' } },
  { code: 'IT', flag: '🇮🇹', defaultPort: 'Port of Genoa / Trieste', names: { ar: 'إيطاليا', en: 'Italy', fr: 'Italie', es: 'Italia', de: 'Italien', ru: 'Италия' } },
  { code: 'ES', flag: '🇪🇸', defaultPort: 'Port of Valencia / Algeciras', names: { ar: 'إسبانيا', en: 'Spain', fr: 'Espagne', es: 'España', de: 'Spanien', ru: 'Испания' } },
  { code: 'RU', flag: '🇷🇺', defaultPort: 'Port of Novorossiysk / St. Petersburg', names: { ar: 'روسيا الاتحادية', en: 'Russian Federation', fr: 'Russie', es: 'Rusia', de: 'Russland', ru: 'Россия' } },
  { code: 'KW', flag: '🇰🇼', defaultPort: 'Shuwaikh Port (Kuwait)', names: { ar: 'الكويت', en: 'Kuwait', fr: 'Koweït', es: 'Kuwait', de: 'Kuwait', ru: 'Кувейт' } },
  { code: 'QA', flag: '🇶🇦', defaultPort: 'Hamad Port (Doha)', names: { ar: 'قطر', en: 'Qatar', fr: 'Qatar', es: 'Catar', de: 'Katar', ru: 'Катар' } },
  { code: 'OM', flag: '🇴🇲', defaultPort: 'Port Sultan Qaboos / Sohar', names: { ar: 'سلطنة عمان', en: 'Oman', fr: 'Oman', es: 'Omán', de: 'Oman', ru: 'Оман' } },
  { code: 'JO', flag: '🇯🇴', defaultPort: 'Port of Aqaba', names: { ar: 'الأردن', en: 'Jordan', fr: 'Jordanie', es: 'Jordania', de: 'Jordanien', ru: 'Иордания' } },
  { code: 'PL', flag: '🇵🇱', defaultPort: 'Port of Gdansk / Gdynia', names: { ar: 'بولندا', en: 'Poland', fr: 'Pologne', es: 'Polonia', de: 'Polen', ru: 'Польша' } },
  { code: 'GR', flag: '🇬🇷', defaultPort: 'Port of Piraeus', names: { ar: 'اليونان', en: 'Greece', fr: 'Grèce', es: 'Grecia', de: 'Griechenland', ru: 'Греция' } },
  { code: 'MY', flag: '🇲🇾', defaultPort: 'Port Klang', names: { ar: 'ماليزيا', en: 'Malaysia', fr: 'Malaisie', es: 'Malasia', de: 'Malaysia', ru: 'Малайзия' } },
  { code: 'SG', flag: '🇸🇬', defaultPort: 'Port of Singapore', names: { ar: 'سنغافورة', en: 'Singapore', fr: 'Singapour', es: 'Singapur', de: 'Singapur', ru: 'Сингапур' } },
  { code: 'TR', flag: '🇹🇷', defaultPort: 'Port of Mersin / Istanbul', names: { ar: 'تركيا', en: 'Turkey', fr: 'Turquie', es: 'Turquía', de: 'Türkei', ru: 'Турция' } },
  { code: 'IN', flag: '🇮🇳', defaultPort: 'Jawaharlal Nehru Port (JNPT)', names: { ar: 'الهند', en: 'India', fr: 'Inde', es: 'India', de: 'Indien', ru: 'Индия' } },
  { code: 'CA', flag: '🇨🇦', defaultPort: 'Port of Montreal / Halifax', names: { ar: 'كندا', en: 'Canada', fr: 'Canada', es: 'Canadá', de: 'Kanada', ru: 'Канада' } },
  { code: 'US', flag: '🇺🇸', defaultPort: 'Port of New York / Newark', names: { ar: 'الولايات المتحدة الأمريكية', en: 'United States', fr: 'États-Unis', es: 'Estados Unidos', de: 'Vereinigte Staaten', ru: 'США' } },
  { code: 'OTHER', flag: '🌐', defaultPort: '', names: { ar: 'دولة أخرى (يرجى كتابة الميناء)', en: 'Other Country (Specify Port)', fr: 'Autre pays (Préciser)', es: 'Otro país (Especificar)', de: 'Anderes Land (Angeben)', ru: 'Другая страна' } }
];

export interface IncotermOption {
  code: string;
  badge: string;
  recommended?: boolean;
  descriptions: Record<Language, string>;
}

export const INCOTERMS_OPTIONS: IncotermOption[] = [
  {
    code: 'EXW',
    badge: 'EXW (Ex Works)',
    descriptions: {
      ar: 'تسليم أرض محطة الفرز والتعبئة في مصر',
      en: 'Ex Works at AviaLink sorting & packhouse facilities in Egypt',
      fr: 'Départ usine aux stations de conditionnement AviaLink en Égypte',
      es: 'En fábrica en las instalaciones de empaque de AviaLink en Egipto',
      de: 'Ab Werk an den AviaLink-Packstationen in Ägypten',
      ru: 'Франко-завод на упаковочных комплексах AviaLink в Египте'
    }
  },
  {
    code: 'FOB',
    badge: 'FOB (Free On Board)',
    recommended: true,
    descriptions: {
      ar: 'تسليم ظهر السفينة بالموانئ المصرية (الإسكندرية / دمياط / بورسعيد)',
      en: 'Free On Board at Egyptian seaports (Alexandria, Damietta, Port Said)',
      fr: 'Franco à bord aux ports maritimes égyptiens (Alexandrie, Damiette, Port-Saïd)',
      es: 'Franco a bordo en puertos egipcios (Alejandría, Damietta, Port Said)',
      de: 'Frei an Bord in ägyptischen Seehäfen (Alexandria, Damiette, Port Said)',
      ru: 'Франко-борт в морских портах Египта (Александрия, Дамиетта, Порт-Саид)'
    }
  },
  {
    code: 'CIF',
    badge: 'CIF (Cost, Insurance & Freight)',
    descriptions: {
      ar: 'التكلفة والتأمين والشحن البحري حتى ميناء الوصول',
      en: 'Cost, Insurance & Ocean Freight to destination discharge port',
      fr: 'Coût, assurance et fret maritime jusqu’au port de déchargement',
      es: 'Costo, seguro y flete marítimo hasta el puerto de destino',
      de: 'Kosten, Versicherung und Seefracht bis zum Bestimmungshafen',
      ru: 'Стоимость, страхование и морской фрахт до порта назначения'
    }
  }
];

export function getLocalizedCountryName(codeOrName: string, lang: Language | string = 'ar'): string {
  const safeLang = (lang as Language) || 'ar';
  const found = EXPORT_COUNTRIES.find(c => c.code === codeOrName || c.names.en.toLowerCase() === codeOrName.toLowerCase() || c.names.ar === codeOrName);
  if (found) {
    return `${found.flag} ${found.names[safeLang] || found.names.en}`;
  }
  return codeOrName;
}

export interface GroupeBrousseTexts {
  topBar: {
    hotline: string;
    hubs: string;
    workingHours: string;
    searchPrompt: string;
  };
  universes: {
    badge: string;
    title: string;
    subtitle: string;
    exploreBtn: string;
    rfqBtn: string;
    items: {
      id: string;
      title: string;
      baseline: string;
      tag: string;
      cropKey: string;
      image: string;
    }[];
  };
  pillars: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      number: string;
      headline: string;
      desc: string;
    }[];
  };
  figures: {
    badge: string;
    title: string;
    items: {
      value: string;
      label: string;
      sub: string;
    }[];
  };
  outside: {
    badge: string;
    title: string;
    subtitle: string;
    ctaBtn: string;
    stories: {
      title: string;
      category: string;
      desc: string;
      tag: string;
      image: string;
    }[];
  };
  news: {
    badge: string;
    title: string;
    subtitle: string;
    readMore: string;
    items: {
      date: string;
      category: string;
      title: string;
      excerpt: string;
      tag: string;
      image: string;
    }[];
  };
  commitments: {
    badge: string;
    title: string;
    subtitle: string;
    axis1Title: string;
    axis1Desc: string;
    axis2Title: string;
    axis2Desc: string;
    ctaBtn: string;
  };
}

export const GROUPE_BROUSSE_TRANSLATIONS: Record<Language, GroupeBrousseTexts> = {
  ar: {
    topBar: {
      hotline: 'هاتف التصدير المباشر: +20 (0) 10 933 933 55',
      hubs: 'محطات الشحن: الإسكندرية • السادات • روتردام • جدة',
      workingHours: 'غرفة عمليات التصدير: 24/7',
      searchPrompt: 'البحث السريع (Ctrl+K)'
    },
    universes: {
      badge: 'محاور المنتجات وعوالم التوريد (PRODUCT UNIVERSES)',
      title: 'محاور التصدير الزراعي المصري',
      subtitle: 'مجموعة منتقاة من أجود المحاصيل الطازجة والمجمدة المجهزة وفق أعلى المعايير الدولية لتلبية متطلبات كبرى سلاسل التوزيع والتجزئة عالمياً.',
      exploreBtn: 'استكشف المحاصيل والمواصفات',
      rfqBtn: 'طلب عرض سعر فوري (RFQ)',
      items: [
        {
          id: 'sweet-potatoes',
          title: 'البطاطا الحلوة التصديرية الفاخرة',
          baseline: 'خبير البطاطا الحلوة المصرية — أصناف بيورجارد وبيليفيو معالجة حرارياً عند 13.5°C',
          tag: 'THE SWEET POTATO SPECIALIST',
          cropKey: 'sweet-potatoes',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          id: 'onions-garlic',
          title: 'البصل الذهبي والأحمر والثوم البلدي',
          baseline: 'خبير البصل والثوم طويل التحمل — تجفيف شمسي طبيعي، فرز إلكتروني وتعبئة تصديرية',
          tag: 'THE ALLIUM EXPERT',
          cropKey: 'onions',
          image: '/crops/onions.jpg'
        },
        {
          id: 'carrots-beetroot',
          title: 'الجزر والشمندر الطازج المغسول',
          baseline: 'جزر نانتس وبنجر مائدة مغسول ومبرد هيدروليكياً بنسبة سكر طبيعية ومظهر تصديري نضر',
          tag: 'HYDRO-COOLED VEGETABLES',
          cropKey: 'carrots',
          image: '/crops/carrots.jpg'
        }
      ]
    },
    pillars: {
      badge: 'الركائز الخمس للمجموعة (THE 5 KEY PILLARS)',
      title: 'الركائز الخمس لمجموعة أفيالينك',
      subtitle: 'القيم المؤسسية والمبادئ التشغيلية التي تقود كافة عملياتنا الزراعية واللوجستية حول العالم.',
      items: [
        {
          number: '01 /',
          headline: 'ثقافة مؤسسية ذات جذور عائلية راسخة',
          desc: 'رؤية طويلة الأجل توجه كافة قراراتنا وشراكاتنا الزراعية، مرتكزة على تقاليد زراعية عريقة في وادي ودلتا النيل.'
        },
        {
          number: '02 /',
          headline: 'مرونة واستجابة وتحكم دقيق في سلسلة التبريد',
          desc: 'فرق عمل متخصصة ومراقبة حرارية مستمرة 24/7 من محطة التعبئة وحتى ميناء الوصول لضمان أعلى مستويات الرضا.'
        },
        {
          number: '03 /',
          headline: 'سياسة جودة متأصلة بعمق في حمضنا النووي',
          desc: 'معايير صارمة وشهادات GlobalGAP و ISO 22000 وفحوصات متبقيات المبيدات لضمان التميز المطلق لكل شحنة.'
        },
        {
          number: '04 /',
          headline: 'شراكة وثيقة ومسؤولة مع مزارعينا المعتمدين',
          desc: 'تعاقدات زراعية مباشرة في أكثر من 500 هكتار تخضع للتدقيق الدوري والرقابة الحقلية المتواصلة من المزرعة للحاوية.'
        },
        {
          number: '05 /',
          headline: 'علاقة ثقة ودعم استشاري دائم مع عملائنا',
          desc: 'بناء شراكات متبادلة مستدامة عبر عقود طويلة الأمد، ومتابعة لوجستية لحظية، وشفافية تسعيرية كاملة CIF و FOB.'
        }
      ]
    },
    figures: {
      badge: 'المجموعة في أرقام (THE GROUP IN FIGURES)',
      title: 'أرقام تعكس ريادتنا في التصدير الزراعي',
      items: [
        { value: '45,000+', label: 'طن صادرات سنوية', sub: 'من الحاصلات الطازجة والمجمدة' },
        { value: '35+', label: 'دولة وميناء وصول', sub: 'في أوروبا والخليج والشرق الأوسط وآسيا' },
        { value: '99.4%', label: 'نسبة اجتياز الحجر الصحي', sub: 'مطابقة تامة للمواصفات الأوروبية' },
        { value: '100%', label: 'سلسلة تبريد مبردة 24/7', sub: 'حرارة محكومة من -18°C إلى +14°C' }
      ]
    },
    outside: {
      badge: 'أفيالينك خارج الحدود (AVIALINK OUTSIDE)',
      title: 'جولة ميدانية: من الحقول المصرية إلى موانئ العالم',
      subtitle: 'سلسلة ميدانية تأخذكم عبر المزارع ومحطات التعبئة لمقابلة مزارعينا واستكشاف تقنيات الفرز والتبريد الفائق.',
      ctaBtn: 'استكشف رحلة التوريد الكاملة',
      stories: [
        {
          title: 'حصاد ومعالجة البطاطا الحلوة (Curing Protocol)',
          category: 'المعالجة الحرارية',
          desc: 'داخل غرف التجفيف والترميم الحراري عند 13.5°C ورطوبة 85% لرفع تركيز السكر وضمان بقاء القشرة ملساء لمدة أشهر.',
          tag: 'سلسلة التبريد',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          title: 'الفرز الضوئي الآلي والوزني للبصل الجاف',
          category: 'الفرز والتدريج',
          desc: 'خطوط إلكترونية متطورة لفحص الوزن والحجم وكثافة القشور قبل التعبئة في أجولة شبكية مهواة 10 و 25 كجم.',
          tag: 'فرز إلكتروني',
          image: '/crops/onions.jpg'
        },
        {
          title: 'التبريد المائي الفجائي للجزر المصري (Hydro-Cooling)',
          category: 'التبريد المائي الفجائي',
          desc: 'غسيل ميكانيكي وتبريد مائي فجائي للمحصول بخفض حرارة اللب إلى +1.0°م للسيطرة على التنفس وضمان الصلابة.',
          tag: 'Hydro-Cooling',
          image: '/crops/carrots.jpg'
        },
        {
          title: 'بروتوكول التجفيف والقص الحرفي للثوم البلدي',
          category: 'معالجة الثوم للتصدير',
          desc: 'تجفيف هوائي محكوم وقص ميكانيكي للجذور مع تنظيف هوائي مضغوط لحماية الفصوص من الرطوبة والتزريع.',
          tag: 'Garlic Curing',
          image: '/crops/garlic.jpg'
        }
      ]
    },
    news: {
      badge: 'الأخبار والابتكارات (NEWS & INNOVATIONS)',
      title: 'آخر التطورات والمعارض الزراعية الدولية',
      subtitle: 'متابعة حية لمشاركاتنا في المعارض العالمية، افتتاح المواسم الزراعية، والابتكارات في التعبئة والتصنيع.',
      readMore: 'اقرأ المزيد',
      items: [
        {
          date: '10 سبتمبر 2026',
          category: 'المعارض الدولية',
          title: 'أفيالينك تستعد للمشاركة في معرض Fruit Attraction بمدريد',
          excerpt: 'فريق التصدير يلتقي بكبار المستوردين وممثلي سلاسل السوبرماركت الأوروبية لعرض تعاقدات موسم البطاطا الحلوة والبصل والثوم 2026/2027.',
          tag: 'معارض دولية',
          image: '/crops/carrots.jpg'
        },
        {
          date: '28 أغسطس 2026',
          category: 'المواسم والحصاد',
          title: 'انطلاق موسم تصدير البطاطا الحلوة البيورجارد بجودة استثنائية',
          excerpt: 'بدء شحن أولى الحاويات المبردة إلى موانئ روتردام وفيليكسستو بعد اكتمال مرحلة العلاج الحراري واجتياز الفحوصات.',
          tag: 'موسم الحصاد',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          date: '15 يوليو 2026',
          category: 'الابتكار والتوسعات',
          title: 'تطوير خطوط التبريد الهوائي والمائي لمحطة تعبئة الثوم والجزر',
          excerpt: 'مجمع معالجة حديث بقدرات استيعابية مضاعفة لتلبية الطلب المتزايد في السوق الأوروبي والخليجي على الثوم والجزر التصديري.',
          tag: 'توسعات المحطة',
          image: '/crops/garlic.jpg'
        }
      ]
    },
    commitments: {
      badge: 'التزاماتنا المؤسسية (OUR COMMITMENTS - RSE)',
      title: 'المسؤولية المجتمعية والبيئية في صميم رسالتنا',
      subtitle: 'نلتزم بالجمع بين التميز التصديري وحماية الموارد الطبيعية ودعم مجتمعات المزارعين في ريف مصر.',
      axis1Title: 'المحور الأول: الزراعة المستدامة وحماية البيئة',
      axis1Desc: 'اعتماد شبكات الري بالتنقيط الذكية لتقليل استهلاك المياه بنسبة 40%، وإعادة تدوير المخلفات العضوية كأسمدة حيوية، واستخدام كراتين قابلة للتحلل 100%.',
      axis2Title: 'المحور الثاني: الالتزام المجتمعي وعدالة سلاسل التوريد',
      axis2Desc: 'ضمان أسعار عادلة ومربحة لصغار المزارعين، وتوفير بيئة عمل آمنة وصحية مطابقة لشهادات SMETA، ودعم برامج التدريب الزراعي لشباب القرى.',
      ctaBtn: 'طلب وثيقة معايير الاستدامة والشهادات'
    }
  },
  en: {
    topBar: {
      hotline: 'Direct Export Hotline: +20 (0) 10 933 933 55',
      hubs: 'Shipping Hubs: Alexandria • Sadat City • Rotterdam • Jeddah',
      workingHours: 'Export Operations Desk: 24/7',
      searchPrompt: 'Quick Search (Ctrl+K)'
    },
    universes: {
      badge: 'PRODUCT UNIVERSES & SOURCING DIVISIONS',
      title: 'Egyptian Agricultural Export Universes',
      subtitle: 'A specialized selection of premier fresh and value-added produce tailored to European and global supermarket and wholesale specifications.',
      exploreBtn: 'Explore Crops & Specifications',
      rfqBtn: 'Request Instant Quotation (RFQ)',
      items: [
        {
          id: 'sweet-potatoes',
          title: 'Export-Grade Sweet Potatoes & Roots',
          baseline: 'The Sweet Potato Specialist — Beauregard & Bellevue scientifically cured at 13.5°C',
          tag: 'THE SWEET POTATO SPECIALIST',
          cropKey: 'sweet-potatoes',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          id: 'onions-garlic',
          title: 'Golden & Red Onions & Egyptian Garlic',
          baseline: 'The Long-Transit Allium Expert — Optically sized, naturally field-cured and export-ventilated',
          tag: 'THE ALLIUM EXPERT',
          cropKey: 'onions',
          image: '/crops/onions.jpg'
        },
        {
          id: 'carrots-beetroot',
          title: 'Hydro-Cooled Carrots & Fresh Beetroot',
          baseline: 'Polished Nantes carrots & table beetroot hydro-cooled for long-lasting crispness and European standards',
          tag: 'HYDRO-COOLED VEGETABLES',
          cropKey: 'carrots',
          image: '/crops/carrots.jpg'
        }
      ]
    },
    pillars: {
      badge: 'THE 5 KEY PILLARS OF AVIALINK GROUP',
      title: 'The 5 Key Pillars of AviaLink Group',
      subtitle: 'The foundational principles and corporate values guiding our farming and cold-chain operations worldwide.',
      items: [
        {
          number: '01 /',
          headline: 'A corporate culture with solid family roots',
          desc: 'A long-term generational approach coloring all our agricultural partnerships across the Nile Valley and Delta.'
        },
        {
          number: '02 /',
          headline: 'Agility, expertise and 24/7 cold-chain mastery',
          desc: 'Uninterrupted temperature surveillance from post-harvest pre-cooling to ocean discharge ports.'
        },
        {
          number: '03 /',
          headline: 'A quality policy burned deep in our DNA',
          desc: 'GlobalGAP, CAPQ, ISO 22000 certifications and rigorous zero-residue MRL testing guaranteeing top quality.'
        },
        {
          number: '04 /',
          headline: 'Responsible, direct partnerships with our growers',
          desc: 'Controlled contract farming across 500+ audited hectares ensuring 100% field-to-pallet traceability.'
        },
        {
          number: '05 /',
          headline: 'Long-term client trust & dedicated support',
          desc: 'Enduring trade alliances built over transparent CIF/FOB pricing, responsive export desks, and custom solutions.'
        }
      ]
    },
    figures: {
      badge: 'THE GROUP IN FIGURES',
      title: 'Key Figures Demonstrating Our Export Strength',
      items: [
        { value: '45,000+', label: 'Metric Tons Exported Annually', sub: 'Of fresh & IQF agricultural produce' },
        { value: '35+', label: 'Destination Ports & Countries', sub: 'Across Europe, GCC, and global corridors' },
        { value: '99.4%', label: 'First-Time Quarantine Pass Rate', sub: 'Full compliance with EU & GCC MRL standards' },
        { value: '100%', label: 'Monitored 24/7 Reefer Logistics', sub: 'Precise cold chain from -18°C to +14°C' }
      ]
    },
    outside: {
      badge: 'AVIALINK OUTSIDE SERIES',
      title: 'Field Expeditions: From Egyptian Soil to World Tables',
      subtitle: 'A documentary series exploring our harvest origins, meeting the growers, and witnessing high-precision grading.',
      ctaBtn: 'Discover the Full Supply Chain',
      stories: [
        {
          title: 'Sweet Potato Curing Science in Beheira',
          category: 'Thermal Conditioning',
          desc: 'Inside curing rooms held at 13.5°C and 85% humidity to heal skin abrasions and elevate natural sugar concentrations.',
          tag: 'Cold Chain',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          title: 'Optical Sizing & Weight Sorting of Egyptian Onions',
          category: 'Grading & Sizing',
          desc: 'State-of-the-art grading machines sorting by precise gram weight and skin color before packaging into breathable export sacks.',
          tag: 'Optical Sorting',
          image: '/crops/onions.jpg'
        },
        {
          title: 'Hydro-Cooling & Washing Protocol for Export Carrots',
          category: 'Hydro-Cooling Shock',
          desc: 'Precision mechanical washing and forced ice-water cooling dropping pulp temp to +1.0°C for extended crunchy shelf life.',
          tag: 'Hydro-Cooling',
          image: '/crops/carrots.jpg'
        },
        {
          title: 'Controlled Air Curing & Precision Trimming for Egyptian Garlic',
          category: 'Garlic Post-Harvest',
          desc: 'Shaded air curing and calibrated root trimming with pressurized air-blowing protecting bulbs from moisture and sprouting.',
          tag: 'Garlic Curing',
          image: '/crops/garlic.jpg'
        }
      ]
    },
    news: {
      badge: 'NEWS & EXPORT INNOVATIONS',
      title: 'Latest Developments & International Trade Events',
      subtitle: 'Stay updated with our global trade show presence, seasonal harvest launches, and processing innovations.',
      readMore: 'Read More',
      items: [
        {
          date: '10 September 2026',
          category: 'Trade Shows',
          title: 'AviaLink Prepares for Fruit Attraction Madrid 2026',
          excerpt: 'Our commercial team will meet European retail buyers and distribution directors to finalize 2026/2027 fresh export contracts.',
          tag: 'Trade Fair',
          image: '/crops/carrots.jpg'
        },
        {
          date: '28 August 2026',
          category: 'Harvest Seasons',
          title: 'Launch of the Egyptian Beauregard Sweet Potato Campaign',
          excerpt: 'First cured reefer containers dispatched to Rotterdam and Felixstowe following successful phytosanitary clearance.',
          tag: 'Harvest Launch',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          date: '15 July 2026',
          category: 'Packhouse Expansion',
          title: 'Expansion of Hydro-Cooling & Air-Curing Facilities for Garlic & Carrots',
          excerpt: 'Newly upgraded post-harvest processing hub doubling daily capacity for European and GCC export corridors.',
          tag: 'Innovation',
          image: '/crops/garlic.jpg'
        }
      ]
    },
    commitments: {
      badge: 'OUR COMMITMENTS (CSR & QUALITY)',
      title: 'Corporate Social & Environmental Responsibility at Our Core',
      subtitle: 'Committed to balancing trade excellence with environmental stewardship and equitable farming communities.',
      axis1Title: 'Axis 1: Sustainable Agriculture & Eco-Friendly Operations',
      axis1Desc: 'Smart precision drip irrigation reducing water consumption by 40%, organic waste composting, and 100% recyclable carton packing.',
      axis2Title: 'Axis 2: Societal Engagement & Fair Grower Partnerships',
      axis2Desc: 'Guaranteed living income for local growers, safe certified working conditions under SMETA standards, and youth agronomy workshops.',
      ctaBtn: 'Download Sustainability & CSR Charter'
    }
  },
  fr: {
    topBar: {
      hotline: 'Ligne Export Directe : +20 (0) 10 933 933 55',
      hubs: 'Hubs Logistiques : Alexandrie • Sadat City • Rotterdam • Djeddah',
      workingHours: 'Cellule Opérationnelle Export : 24/7',
      searchPrompt: 'Recherche Rapide (Ctrl+K)'
    },
    universes: {
      badge: 'UNIVERS PRODUITS & PÔLES DE SOURCING',
      title: 'Les Univers d’Exportation Agricole Égyptienne',
      subtitle: 'Une sélection rigoureuse de récoltes fraîches et produits surgelés élaborée selon les standards les plus exigeants de la distribution européenne et mondiale.',
      exploreBtn: 'Découvrir les cultures et spécifications',
      rfqBtn: 'Demander un devis instantané (RFQ)',
      items: [
        {
          id: 'sweet-potatoes',
          title: 'Patates Douces & Racines d’Excellence',
          baseline: "L'expert de la patate douce égyptienne — Variétés Beauregard & Bellevue affinées scientifiquement à 13,5°C",
          tag: 'THE SWEET POTATO SPECIALIST',
          cropKey: 'sweet-potatoes',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          id: 'onions-garlic',
          title: 'Oignons Jaunes & Rouges, Ail Traditionnel',
          baseline: "L'expert des alliacées longue conservation — Calibrage optique, séchage naturel au champ et aération export",
          tag: 'THE ALLIUM EXPERT',
          cropKey: 'onions',
          image: '/crops/onions.jpg'
        },
        {
          id: 'carrots-beetroot',
          title: 'Carottes Hydro-Réfrigérées & Betteraves',
          baseline: 'Carottes Nantes lavées et betteraves de table refroidies à l’eau glacée pour une fraîcheur durable',
          tag: 'HYDRO-COOLED VEGETABLES',
          cropKey: 'carrots',
          image: '/crops/carrots.jpg'
        }
      ]
    },
    pillars: {
      badge: 'LES 5 PILIERS DU GROUPE AVIALINK',
      title: 'Les 5 Piliers Clés du Groupe AviaLink',
      subtitle: 'Les principes fondateurs et valeurs d’entreprise guidant nos activités agricoles et logistiques à travers le monde.',
      items: [
        {
          number: '01 /',
          headline: "Une culture d'entreprise aux racines solides",
          desc: "Une approche à long terme imprégnant l'ensemble de nos partenariats avec les producteurs du Nil."
        },
        {
          number: '02 /',
          headline: 'Agilité, expertise et maîtrise de la chaîne du froid 24/7',
          desc: 'Surveillance thermique ininterrompue du pré-refroidissement en station jusqu’au port de débarquement.'
        },
        {
          number: '03 /',
          headline: 'Une politique qualité ancrée au cœur de notre ADN',
          desc: 'Certifications GlobalGAP, CAPQ, ISO 22000 et analyses systématiques des résidus pour une conformité absolue.'
        },
        {
          number: '04 /',
          headline: 'Des partenariats de proximité et responsables avec nos producteurs',
          desc: 'Contrats de culture sur plus de 500 hectares audités garantissant une traçabilité intégrale du champ à la palette.'
        },
        {
          number: '05 /',
          headline: 'Confiance durable et accompagnement sur mesure de nos clients',
          desc: 'Relations de long terme fondées sur la clarté des tarifs CIF/FOB et un suivi commercial multilingue réactif.'
        }
      ]
    },
    figures: {
      badge: 'LE GROUPE EN CHIFFRES',
      title: 'Des Chiffres Témoins de Notre Envergure Export',
      items: [
        { value: '45 000+', label: 'Tonnes Exportées par An', sub: 'De fruits, légumes frais et IQF' },
        { value: '35+', label: 'Pays et Ports Desservis', sub: 'En Europe, au Moyen-Orient et à l’international' },
        { value: '99,4%', label: 'Taux de Passage Phytosanitaire', sub: 'Parfaite conformité aux normes UE' },
        { value: '100%', label: 'Lignes Réfrigérées Monitorées 24/7', sub: 'Maîtrise thermique de -18°C à +14°C' }
      ]
    },
    outside: {
      badge: 'LA SÉRIE AVIALINK OUTSIDE',
      title: 'Expéditions de Terroir : Des Champs d’Égypte aux Tables du Monde',
      subtitle: 'Une immersion dans nos bassins de production pour rencontrer nos producteurs et découvrir la précision de nos stations.',
      ctaBtn: 'Découvrir la filière complète',
      stories: [
        {
          title: 'Science du Curing de la Patate Douce à Beheira',
          category: 'Affinage Thermique',
          desc: 'Dans les chambres de curing régulées à 13,5°C et 85% d’hygrométrie pour cicatriser la peau et densifier les sucres.',
          tag: 'Chaîne du Froid',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          title: 'Calibrage Optique & Tri Pondéral des Oignons',
          category: 'Tri & Conditionnement',
          desc: 'Lignes électroniques de pointe triant au gramme près la couleur et la fermeté avant ensachage en filets respirants.',
          tag: 'Tri Optique',
          image: '/crops/onions.jpg'
        },
        {
          title: 'Protocole d’Hydro-Réfrigération des Carottes d’Exportation',
          category: 'Hydro-Cooling',
          desc: 'Lavage mécanique de précision et douche d’eau glacée abaissant la température à cœur à +1,0°C pour une fraîcheur croquante.',
          tag: 'Hydro-Cooling',
          image: '/crops/carrots.jpg'
        },
        {
          title: 'Séchage Contrôlé et Ébarbage de l’Ail Égyptien',
          category: 'Conditionnement d’Ail',
          desc: 'Séchage sous abri et ébarbage calibré avec soufflage d’air sous pression pour protéger les gousses contre l’humidité.',
          tag: 'Séchage d’Ail',
          image: '/crops/garlic.jpg'
        }
      ]
    },
    news: {
      badge: 'ACTUALITÉS & INNOVATIONS EXPORT',
      title: 'Derniers Développements & Salons Professionnels',
      subtitle: 'Suivez nos présences sur les salons internationaux, les ouvertures de campagnes et les innovations agroalimentaires.',
      readMore: 'Lire la suite',
      items: [
        {
          date: '10 Septembre 2026',
          category: 'Salons Professionnels',
          title: 'AviaLink Prépare sa Participation à Fruit Attraction Madrid',
          excerpt: 'Nos équipes commerciales rencontreront les acheteurs de la grande distribution pour finaliser les volumes d’exportation 2026/2027.',
          tag: 'Salon International',
          image: '/crops/carrots.jpg'
        },
        {
          date: '28 Août 2026',
          category: 'Campagnes Agricoles',
          title: 'Lancement de la Campagne de Patate Douce Beauregard',
          excerpt: 'Départ des premiers conteneurs réfrigérés vers Rotterdam et Felixstowe après contrôle phytosanitaire rigoureux.',
          tag: 'Récolte 2026',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          date: '15 Juillet 2026',
          category: 'Extension Industrielle',
          title: 'Extension des Unités d’Hydro-Cooling et Séchage d’Ail et Carottes',
          excerpt: 'Un pôle de préparation moderne doublant nos capacités quotidiennes pour desservir les marchés européens et du Golfe.',
          tag: 'Innovation',
          image: '/crops/garlic.jpg'
        }
      ]
    },
    commitments: {
      badge: 'NOS ENGAGEMENTS (RSE & QUALITÉ)',
      title: 'Responsabilité Sociétale et Environnementale au Cœur de Notre Action',
      subtitle: 'Concilier performance économique internationale, préservation des ressources et respect de nos producteurs.',
      axis1Title: 'Axe 1 : Agriculture Durable & Respect de l’Environnement',
      axis1Desc: 'Irrigation goutte-à-goutte réduisant de 40% la consommation d’eau, compostage systématique et emballages 100% recyclables.',
      axis2Title: 'Axe 2 : Engagement Sociétal & Partenariats Agricoles Équitables',
      axis2Desc: 'Revenu décent garanti à nos agriculteurs partenaires, conditions de travail certifiées SMETA et formations agronomiques.',
      ctaBtn: 'Télécharger notre charte RSE et nos certifications'
    }
  },
  es: {
    topBar: {
      hotline: 'Línea Directa de Exportación: +20 (0) 10 933 933 55',
      hubs: 'Centros Logísticos: Alejandría • Sadat City • Róterdam • Yeda',
      workingHours: 'Mesa de Operaciones de Exportación: 24/7',
      searchPrompt: 'Búsqueda Rápida (Ctrl+K)'
    },
    universes: {
      badge: 'UNIVERSOS DE PRODUCTOS Y DIVISIONES DE ORIGEN',
      title: 'Los Universos de Exportación Agrícola Egipcia',
      subtitle: 'Una rigurosa selección de cosechas frescas y productos ultracongelados diseñados para cumplir con las normas de los supermercados y mayoristas internacionales.',
      exploreBtn: 'Explorar Cultivos y Especificaciones',
      rfqBtn: 'Solicitar Cotización Inmediata (RFQ)',
      items: [
        {
          id: 'sweet-potatoes',
          title: 'Batatas Dulces de Exportación Premium',
          baseline: 'El especialista en batatas egipcias — Variedades Beauregard y Bellevue curadas térmicamente a 13.5°C',
          tag: 'THE SWEET POTATO SPECIALIST',
          cropKey: 'sweet-potatoes',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          id: 'onions-garlic',
          title: 'Cebollas Amarillas, Rojas y Ajo Egipcio',
          baseline: 'El experto en aliáceas de larga conservación — Calibrado óptico, curado natural al campo y sacos ventilados',
          tag: 'THE ALLIUM EXPERT',
          cropKey: 'onions',
          image: '/crops/onions.jpg'
        },
        {
          id: 'carrots-beetroot',
          title: 'Zanahorias Hidroenfriadas y Remolacha',
          baseline: 'Zanahorias Nantes lavadas e hidrorrefrigeradas para una frescura crujiente prolongada y normas europeas',
          tag: 'HYDRO-COOLED VEGETABLES',
          cropKey: 'carrots',
          image: '/crops/carrots.jpg'
        }
      ]
    },
    pillars: {
      badge: 'LOS 5 PILARES DEL GRUPO AVIALINK',
      title: 'Los 5 Pilares Clave del Grupo AviaLink',
      subtitle: 'Los principios fundacionales y valores corporativos que guían nuestras operaciones agrícolas y de cadena de frío.',
      items: [
        {
          number: '01 /',
          headline: 'Una cultura corporativa con sólidas raíces familiares',
          desc: 'Un enfoque a largo plazo que nutre todas nuestras alianzas con los productores en el Valle y Delta del Nilo.'
        },
        {
          number: '02 /',
          headline: 'Agilidad, experiencia y dominio de la cadena de frío 24/7',
          desc: 'Monitoreo continuo de la temperatura desde el preenfriamiento en planta hasta el puerto de destino.'
        },
        {
          number: '03 /',
          headline: 'Una política de calidad arraigada en nuestro ADN',
          desc: 'Certificaciones GlobalGAP, CAPQ, ISO 22000 y análisis de residuos que garantizan una calidad indiscutible.'
        },
        {
          number: '04 /',
          headline: 'Asociaciones responsables y cercanas con nuestros agricultores',
          desc: 'Agricultura bajo contrato en más de 500 hectáreas auditadas asegurando una trazabilidad completa de campo a pallet.'
        },
        {
          number: '05 /',
          headline: 'Confianza duradera y respaldo personalizado a nuestros clientes',
          desc: 'Relaciones a largo plazo construidas sobre precios transparentes CIF/FOB y atención comercial multilingüe.'
        }
      ]
    },
    figures: {
      badge: 'EL GRUPO EN CIFRAS',
      title: 'Cifras que Demuestran Nuestra Fuerza Exportadora',
      items: [
        { value: '45.000+', label: 'Toneladas Métricas Anuales', sub: 'De frutas, hortalizas frescas e IQF' },
        { value: '35+', label: 'Países y Puertos de Destino', sub: 'En Europa, el Golfo Pérsico y corredores globales' },
        { value: '99,4%', label: 'Tasa de Aprobación Fitosanitaria', sub: 'Cumplimiento estricto de las normas UE' },
        { value: '100%', label: 'Logística Frigorífica Monitoreada 24/7', sub: 'Cadena de frío controlada de -18°C a +14°C' }
      ]
    },
    outside: {
      badge: 'SERIE AVIALINK OUTSIDE',
      title: 'Expediciones de Campo: Del Suelo Egipcio a las Mesas del Mundo',
      subtitle: 'Una serie documental para explorar nuestros orígenes, conocer a los productores y presenciar la clasificación de precisión.',
      ctaBtn: 'Descubra la Cadena de Suministro Completa',
      stories: [
        {
          title: 'Ciencia del Curado de Batata en Beheira',
          category: 'Acondicionamiento Térmico',
          desc: 'En cámaras de curado a 13.5°C y 85% de humedad para cicatrizar la piel y concentrar la dulzura natural.',
          tag: 'Cadena de Frío',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          title: 'Calibrado Óptico y Clasificación por Peso de Cebollas',
          category: 'Clasificación y Envasado',
          desc: 'Líneas electrónicas de última generación que clasifican con precisión antes del ensacado en mallas transpirables.',
          tag: 'Clasificación Óptica',
          image: '/crops/onions.jpg'
        },
        {
          title: 'Protocolo de Hidroenfriamiento y Lavado de Zanahorias',
          category: 'Hidroenfriamiento',
          desc: 'Lavadoras mecánicas de precisión y ducha de agua helada que reduce la temperatura pulpar a +1.0°C para una frescura crujiente.',
          tag: 'Hydro-Cooling',
          image: '/crops/carrots.jpg'
        },
        {
          title: 'Curado Controlado y Recorte de Raíces del Ajo Egipcio',
          category: 'Poscosecha de Ajo',
          desc: 'Curado al aire a la sombra y corte calibrado de raíces con soplado de aire a presión para proteger los bulbos.',
          tag: 'Curado de Ajo',
          image: '/crops/garlic.jpg'
        }
      ]
    },
    news: {
      badge: 'NOTICIAS E INNOVACIONES EXPORT',
      title: 'Últimos Acontecimientos y Eventos Comerciales',
      subtitle: 'Manténgase al día con nuestras ferias internacionales, aperturas de cosechas e innovaciones agroalimentarias.',
      readMore: 'Leer más',
      items: [
        {
          date: '10 Septiembre 2026',
          category: 'Ferias Comerciales',
          title: 'AviaLink se Prepara para Fruit Attraction Madrid 2026',
          excerpt: 'Nuestro equipo comercial se reunirá con directores de compras de la gran distribución para cerrar contratos de exportación 2026/2027.',
          tag: 'Feria Internacional',
          image: '/crops/carrots.jpg'
        },
        {
          date: '28 Agosto 2026',
          category: 'Campañas de Cosecha',
          title: 'Lanzamiento de la Campaña de Batata Beauregard',
          excerpt: 'Salida de los primeros contenedores refrigerados hacia Róterdam y Felixstowe con certificación fitosanitaria completa.',
          tag: 'Cosecha 2026',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          date: '15 Julio 2026',
          category: 'Ampliación de Planta',
          title: 'Ampliación de Instalaciones de Hidroenfriamiento y Curado de Ajo y Zanahoria',
          excerpt: 'Un moderno centro de procesamiento que duplica la capacidad diaria para los corredores de exportación a Europa y el Golfo.',
          tag: 'Innovación',
          image: '/crops/garlic.jpg'
        }
      ]
    },
    commitments: {
      badge: 'NUESTROS COMPROMISOS (RSE Y CALIDAD)',
      title: 'Responsabilidad Social y Ambiental en el Núcleo de Nuestro Trabajo',
      subtitle: 'Comprometidos a equilibrar la excelencia exportadora con el cuidado ambiental y el bienestar de las comunidades rurales.',
      axis1Title: 'Eje 1: Agricultura Sostenible y Operaciones Eco-Responsables',
      axis1Desc: 'Riego por goteo de precisión reduciendo un 40% el consumo de agua, compostaje orgánico y embalajes 100% reciclables.',
      axis2Title: 'Eje 2: Compromiso Social y Alianzas Agrícolas Justas',
      axis2Desc: 'Ingresos justos garantizados para agricultores locales, normas laborales seguras certificadas SMETA y talleres agronómicos.',
      ctaBtn: 'Descargar Carta de Sostenibilidad y RSE'
    }
  },
  de: {
    topBar: {
      hotline: 'Direkte Export-Hotline: +20 (0) 10 933 933 55',
      hubs: 'Logistik-Hubs: Alexandria • Sadat City • Rotterdam • Dschidda',
      workingHours: 'Export-Leitstand: 24/7 besetzt',
      searchPrompt: 'Schnellsuche (Ctrl+K)'
    },
    universes: {
      badge: 'PRODUKT-UNIVERSEN & SOURCING-BEREICHE',
      title: 'Die Exportwelten Ägyptischer Agrarerzeugnisse',
      subtitle: 'Eine handverlesene Auswahl erstklassiger frischer und tiefgekühlter Feldfrüchte, abgestimmt auf europäische Supermarkt- und Großhandelsstandards.',
      exploreBtn: 'Kulturen & Spezifikationen ansehen',
      rfqBtn: 'Sofortiges Angebot anfordern (RFQ)',
      items: [
        {
          id: 'sweet-potatoes',
          title: 'Premium-Exportsüßkartoffeln & Knollen',
          baseline: 'Der Süßkartoffel-Spezialist — Sorten Beauregard & Bellevue, fachgerecht thermisch gereift bei 13,5°C',
          tag: 'THE SWEET POTATO SPECIALIST',
          cropKey: 'sweet-potatoes',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          id: 'onions-garlic',
          title: 'Gelbe & Rote Zwiebeln, Ägyptischer Knoblauch',
          baseline: 'Der Experte für langlebige Allium-Kulturen — Optisch kalibriert, sonnengetrocknet und belüftet verpackt',
          tag: 'THE ALLIUM EXPERT',
          cropKey: 'onions',
          image: '/crops/onions.jpg'
        },
        {
          id: 'carrots-beetroot',
          title: 'Hydrogekühlte Karotten & Frische Rote Bete',
          baseline: 'Gewaschene Nantes-Möhren und Rote Bete, hydrogekühlt für dauerhafte Knackigkeit nach EU-Kriterien',
          tag: 'HYDRO-COOLED VEGETABLES',
          cropKey: 'carrots',
          image: '/crops/carrots.jpg'
        }
      ]
    },
    pillars: {
      badge: 'DIE 5 SCHLÜSSELPFEILER DER AVIALINK-GRUPPE',
      title: 'Die 5 Kernpfeiler der AviaLink-Gruppe',
      subtitle: 'Die Grundwerte und Betriebsleitlinien, die unsere Landwirtschafts- und Kühlkettenprozesse weltweit prägen.',
      items: [
        {
          number: '01 /',
          headline: 'Eine Unternehmenskultur mit soliden familiären Wurzeln',
          desc: 'Ein langfristig angelegter Generationenansatz, der unsere Partnerschaften im Niltal und Nildelta leitet.'
        },
        {
          number: '02 /',
          headline: 'Agilität, Fachwissen und 24/7-Kühlkettenbeherrschung',
          desc: 'Lückenlose Temperaturüberwachung von der Vorkühlung in der Packstation bis zum Zielhafen.'
        },
        {
          number: '03 /',
          headline: 'Eine tief in unserer DNA verankerte Qualitätspolitik',
          desc: 'GlobalGAP, CAPQ, ISO 22000-Zertifizierungen und MRL-Rückstandsanalysen garantieren erstklassige Güte.'
        },
        {
          number: '04 /',
          headline: 'Verantwortungsvolle, partnerschaftliche Nähe zu unseren Erzeugern',
          desc: 'Vertragsanbau auf über 500 auditierten Hektar sichert eine 100%ige Rückverfolgbarkeit vom Feld bis zur Palette.'
        },
        {
          number: '05 /',
          headline: 'Dauerhaftes Kundenvertrauen & maßgeschneiderte Betreuung',
          desc: 'Nachhaltige Handelsbeziehungen mit transparenter CIF/FOB-Preisgestaltung und mehrsprachigen Ansprechpartnern.'
        }
      ]
    },
    figures: {
      badge: 'DIE GRUPPE IN ZAHLEN',
      title: 'Zahlen, die Unsere Exportkompetenz Belegen',
      items: [
        { value: '45.000+', label: 'Tonnen Jährlicher Export', sub: 'An frischen und IQF-Agrarprodukten' },
        { value: '35+', label: 'Zielhäfen & Bestimmungsländer', sub: 'In Europa, dem Nahen Osten und Übersee' },
        { value: '99,4%', label: 'Pflanzengesundheitliche Freigabe', sub: 'Vollständige Einhaltung aller EU-Vorgaben' },
        { value: '100%', label: '24/7 Überwachte Kühltransporte', sub: 'Präzise gesteuerte Kühlkette von -18°C bis +14°C' }
      ]
    },
    outside: {
      badge: 'AVIALINK OUTSIDE-SERIE',
      title: 'Feldexpeditionen: Vom Ägyptischen Boden auf die Tische der Welt',
      subtitle: 'Eine Reiseserie, die Sie zu den Erzeugern führt und modernste Sortier- und Vorkühltechnik erlebbar macht.',
      ctaBtn: 'Die Gesamte Lieferkette Entdecken',
      stories: [
        {
          title: 'Die Wissenschaft des Süßkartoffel-Curings in Beheira',
          category: 'Thermische Veredelung',
          desc: 'In Curing-Kammern bei 13,5°C und 85% Luftfeuchtigkeit zur Wundheilung der Schale und Zuckerkonzentration.',
          tag: 'Kühlkette',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          title: 'Optische Sortierung & Gewichtskalibrierung von Zwiebeln',
          category: 'Kalibrierung & Verpackung',
          desc: 'Modernste elektronische Anlagen sortieren grammgenau Schalenfestigkeit und Kaliber vor dem Abpacken in Raschelsäcke.',
          tag: 'Optische Sortierung',
          image: '/crops/onions.jpg'
        },
        {
          title: 'Hydro-Cooling & Waschprotokoll für Exportkarotten',
          category: 'Hydro-Cooling',
          desc: 'Präzisionswaschanlagen und Eiswasser-Schockkühlung senken die Kern-Temperatur auf +1,0°C für lange Knackigkeit.',
          tag: 'Hydro-Cooling',
          image: '/crops/carrots.jpg'
        },
        {
          title: 'Kontrolliertes Luft-Curing & Wurzelschnitt für Ägyptischen Knoblauch',
          category: 'Knoblauch-Aufbereitung',
          desc: 'Schattentrocknung und präziser Wurzelschnitt mit Druckluftreinigung schützen die Knollen vor Feuchtigkeit und Austrieb.',
          tag: 'Knoblauch-Curing',
          image: '/crops/garlic.jpg'
        }
      ]
    },
    news: {
      badge: 'AKTUELLES & EXPORT-INNOVATIONEN',
      title: 'Neueste Entwicklungen & Internationale Fachmessen',
      subtitle: 'Bleiben Sie informiert über unsere Messeauftritte, Kampagnenstarts und Innovationen in der Lebensmittelverarbeitung.',
      readMore: 'Weiterlesen',
      items: [
        {
          date: '10. September 2026',
          category: 'Fachmessen',
          title: 'AviaLink Bereitet Sich auf die Fruit Attraction Madrid Vor',
          excerpt: 'Unser Vertriebsteam trifft europäische Facheinkäufer, um Frische-Exportkontrakte für die Saison 2026/2027 zu finalisieren.',
          tag: 'Fachmesse',
          image: '/crops/carrots.jpg'
        },
        {
          date: '28. August 2026',
          category: 'Erntekampagnen',
          title: 'Start der Beauregard-Süßkartoffel-Exportsaison',
          excerpt: 'Die ersten temperaturgeführten Container laufen nach bestandener Pflanzengesundheitsprüfung in Richtung Rotterdam aus.',
          tag: 'Ernte 2026',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          date: '15. Juli 2026',
          category: 'Packstation-Erweiterung',
          title: 'Erweiterung der Hydro-Cooling- & Knoblauch-Trocknungsanlagen',
          excerpt: 'Modernisiertes Aufbereitungszentrum verdoppelt die Tageskapazität für den europäischen und arabischen Markt.',
          tag: 'Innovation',
          image: '/crops/garlic.jpg'
        }
      ]
    },
    commitments: {
      badge: 'UNSERE VERPFLICHTUNGEN (CSR & QUALITÄT)',
      title: 'Gesellschaftliche & Ökologische Verantwortung im Mittelpunkt',
      subtitle: 'Wir verbinden verlässliche Exportleistung mit dem Schutz natürlicher Ressourcen und fairer Vergütung der Bauern.',
      axis1Title: 'Säule 1: Nachhaltige Landwirtschaft & Umweltschutz',
      axis1Desc: 'Präzisions-Tröpfchenbewässerung spart 40% Wasser, Verwertung organischer Reststoffe und 100% recyclingfähige Kartons.',
      axis2Title: 'Säule 2: Gesellschaftliches Engagement & Faire Partnerschaften',
      axis2Desc: 'Faire Erzeugerpreise für Familienbetriebe, sichere Arbeitsbedingungen nach SMETA-Audits und Schulungen junger Landwirte.',
      ctaBtn: 'Nachhaltigkeitscharta & Zertifikate anfordern'
    }
  },
  ru: {
    topBar: {
      hotline: 'Прямая экспортная линия: +20 (0) 10 933 933 55',
      hubs: 'Логистические хабы: Александрия • Садат-Сити • Роттердам • Джидда',
      workingHours: 'Операционный экспортный центр: 24/7',
      searchPrompt: 'Быстрый поиск (Ctrl+K)'
    },
    universes: {
      badge: 'ПРОДУКТОВЫЕ НАПРАВЛЕНИЯ И ЗОНЫ СОРСИНГА',
      title: 'Направления Египетского Сельскохозяйственного Экспорта',
      subtitle: 'Тщательно отобранная свежая и замороженная продукция, подготовленная в строгом соответствии со стандартами торговых сетей Европы и мира.',
      exploreBtn: 'Каталог культур и спецификации',
      rfqBtn: 'Запросить расчет стоимости (RFQ)',
      items: [
        {
          id: 'sweet-potatoes',
          title: 'Экспортный Батат Высшего Качества',
          baseline: 'Эксперт по египетскому батату — Сорта Борегард и Бельвю с термообработкой при 13.5°C',
          tag: 'THE SWEET POTATO SPECIALIST',
          cropKey: 'sweet-potatoes',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          id: 'onions-garlic',
          title: 'Желтый и Красный Лук, Египетский Чеснок',
          baseline: 'Эксперт по луковым культурам длительного хранения — Оптическая калибровка, естественная сушка и вентилируемая упаковка',
          tag: 'THE ALLIUM EXPERT',
          cropKey: 'onions',
          image: '/crops/onions.jpg'
        },
        {
          id: 'carrots-beetroot',
          title: 'Гидроохлажденная Морковь и Свежая Свекла',
          baseline: 'Мытая морковь Нантская и столовая свекла с гидроохлаждением для длительного сохранения свежести по стандартам ЕС',
          tag: 'HYDRO-COOLED VEGETABLES',
          cropKey: 'carrots',
          image: '/crops/carrots.jpg'
        }
      ]
    },
    pillars: {
      badge: '5 ОСНОВНЫХ СТОЛПОВ ГРУППЫ AVIALINK',
      title: '5 Ключевых Столпов Группы AviaLink',
      subtitle: 'Корпоративные принципы и операционные стандарты, определяющие всю нашу работу в поле и холодильной цепи.',
      items: [
        {
          number: '01 /',
          headline: 'Корпоративная культура с прочными семейными корнями',
          desc: 'Долгосрочный подход на поколения вперед, объединяющий наших партнеров в дельте и долине Нила.'
        },
        {
          number: '02 /',
          headline: 'Гибкость, экспертный опыт и непрерывный контроль холода 24/7',
          desc: 'Круглосуточный мониторинг температуры от упаковочного цеха до порта разгрузки судна.'
        },
        {
          number: '03 /',
          headline: 'Политика бескомпромиссного качества в ДНК компании',
          desc: 'Сертификация GlobalGAP, CAPQ, ISO 22000 и строгий лабораторный контроль на остатки пестицидов.'
        },
        {
          number: '04 /',
          headline: 'Ответственное и прямое партнерство с фермерами',
          desc: 'Контрактное фермерство на более чем 500 сертифицированных гектарах с гарантией 100% прослеживаемости.'
        },
        {
          number: '05 /',
          headline: 'Многолетнее доверие и индивидуальная поддержка клиентов',
          desc: 'Надежные контракты, прозрачные цены на условиях CIF и FOB, а также поддержка персональных менеджеров.'
        }
      ]
    },
    figures: {
      badge: 'ГРУППА В ЦИФРАХ',
      title: 'Цифры, Подтверждающие Наш Экспортный Масштаб',
      items: [
        { value: '45 000+', label: 'Тонн Экспорта Ежегодно', sub: 'Свежей и быстрозамороженной продукции' },
        { value: '35+', label: 'Стран и Портов Назначения', sub: 'В Европе, на Ближнем Востоке и по всему миру' },
        { value: '99.4%', label: 'Успешное Прохождение Фитоконтроля', sub: 'Полное соответствие нормативам ЕС и ЕАЭС' },
        { value: '100%', label: 'Контролируемые Рефконтейнеры 24/7', sub: 'Температурные режимы от -18°C до +14°C' }
      ]
    },
    outside: {
      badge: 'СЕРИЯ AVIALINK OUTSIDE',
      title: 'Полевые Экспедиции: От Полей Египта до Мировых Прилавков',
      subtitle: 'Документальный проект, знакомящий с процессом сбора урожая, нашими фермерами и технологиями калибровки.',
      ctaBtn: 'Узнать Всю Цепочку Поставок',
      stories: [
        {
          title: 'Наука Кьюринга (Термозаживления) Батата в Бухейре',
          category: 'Термическая Подготовка',
          desc: 'Специальные камеры с температурой 13.5°C и влажностью 85% для заживления кожицы и концентрации сахаров.',
          tag: 'Холодовая цепь',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          title: 'Оптическая и Весовая Сортировка Лука',
          category: 'Сортировка и Упаковка',
          desc: 'Автоматические линии калибровки по весу и плотности чешуи перед фасовкой в проветриваемые экспортные сетки.',
          tag: 'Оптическая сортировка',
          image: '/crops/onions.jpg'
        },
        {
          title: 'Протокол Гидроохлаждения и Мойки Экспортной Моркови',
          category: 'Гидроохлаждение',
          desc: 'Механическая мойка и ледяной душ, снижающий температуру сердцевины до +1.0°C для длительного сохранения хруста.',
          tag: 'Гидроохлаждение',
          image: '/crops/carrots.jpg'
        },
        {
          title: 'Контролируемая Сушка и Обрезка Корней Египетского Чеснока',
          category: 'Обработка Чеснока',
          desc: 'Воздушная сушка в тени и точная обрезка корней с обдувом сжатым воздухом для защиты от влаги и прорастания.',
          tag: 'Сушка чеснока',
          image: '/crops/garlic.jpg'
        }
      ]
    },
    news: {
      badge: 'НОВОСТИ И ЭКСПОРТНЫЕ ИННОВАЦИИ',
      title: 'Последние События и Международные Выставки',
      subtitle: 'Следите за нашим участием в выставках, стартом уборочных кампаний и новыми технологиями переработки.',
      readMore: 'Читать далее',
      items: [
        {
          date: '10 Сентября 2026',
          category: 'Международные Выставки',
          title: 'AviaLink Готовится к Выставке Fruit Attraction в Мадриде',
          excerpt: 'Наша коммерческая команда встретится с европейскими байерами для согласования объемов поставок на сезон 2026/2027.',
          tag: 'Выставка',
          image: '/crops/carrots.jpg'
        },
        {
          date: '28 Августа 2026',
          category: 'Сезон Урожая',
          title: 'Старт Экспортного Сезона Батата Сорта Борегард',
          excerpt: 'Отправка первых рефрижераторных контейнеров в порты Роттердама и Феликстоу после фитосанитарного освидетельствования.',
          tag: 'Урожай 2026',
          image: '/crops/sweet_potatoes.jpg'
        },
        {
          date: '15 Июля 2026',
          category: 'Расширение Мощностей',
          title: 'Модернизация Комплекса Гидроохлаждения и Сушки Чеснока и Моркови',
          excerpt: 'Высокотехнологичный комплекс удваивает суточную мощность переработки для экспортных поставок в Европу и страны Персидского залива.',
          tag: 'Инновация',
          image: '/crops/garlic.jpg'
        }
      ]
    },
    commitments: {
      badge: 'НАШИ ОБЯЗАТЕЛЬСТВА (КСО И КАЧЕСТВО)',
      title: 'Социальная и Экологическая Ответственность — Фундамент Бизнеса',
      subtitle: 'Гармоничное сочетание экспортной эффективности, бережного отношения к природе и поддержки фермеров.',
      axis1Title: 'Направление 1: Устойчивое Земледелие и Экология',
      axis1Desc: 'Капельное орошение снижает расход воды на 40%, переработка растительных остатков и упаковка из 100% перерабатываемого картона.',
      axis2Title: 'Направление 2: Социальная Ответственность и Честное Партнерство',
      axis2Desc: 'Гарантированные справедливые цены для фермеров, условия труда по стандартам SMETA и агрономические программы для молодежи.',
      ctaBtn: 'Запросить Хартию Устойчивого Развития и Сертификаты'
    }
  }
};

