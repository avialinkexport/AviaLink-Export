import React, { useState, useEffect } from 'react';
import { 
  fetchAdminLeads, 
  updateLeadStatus, 
  fetchAnalytics, 
  fetchProducts, 
  saveAdminProduct, 
  deleteAdminProduct, 
  fetchPortfolio, 
  saveAdminPortfolio, 
  deleteAdminPortfolio,
  fetchCompanySettings,
  saveAdminSettings,
  generateProductSpecsWithAI,
  autoTranslateTextWithAI,
  fetchSiteContent,
  requestExportToken
} from '../lib/api';
import { Lead, Product, CertificationItem, CompanySettings, SiteContent } from '../types';
import { initialExportProjects, ExportProject } from '../data/portfolioData';
import { defaultSiteContent } from '../data/defaultSiteContent';
import { ExhibitionsManager } from './admin/ExhibitionsManager';
import { FiguresManager } from './admin/FiguresManager';
import { PillarsManager } from './admin/PillarsManager';
import { ProtocolsManager } from './admin/ProtocolsManager';
import { AnnouncementManager } from './admin/AnnouncementManager';
import { CSRManager } from './admin/CSRManager';
import { Lock, LogOut, Download, Search, CheckCircle, RefreshCw, BarChart3, Users, Box, Award, ShieldAlert, ArrowLeft, Plus, Trash2, Edit, Image as ImageIcon, Check, Settings, Sliders, MapPin, Globe, Phone, Mail, MessageSquare, Share2, Upload, X, Eye, Copy, ExternalLink, Calendar, Sparkles, Layers, Megaphone, Leaf, TrendingUp, ShieldCheck } from 'lucide-react';
import { buildCompanyWhatsAppUrl, buildBuyerWhatsAppUrl, formatRFQForWhatsApp } from '../lib/whatsapp';

import { Language, LANGUAGES } from '../lib/i18n';

interface AdminPanelProps {
  onBackToSite: () => void;
  lang?: Language;
  onSettingsUpdated?: (settings: CompanySettings) => void;
  onNavigateToProduct?: (product: Product) => void;
  onProductsUpdated?: (products: Product[]) => void;
  siteContent?: SiteContent;
  onSiteContentUpdated?: (content: SiteContent) => void;
}

export const ADMIN_TRANSLATIONS: Record<Language, Record<string, string>> = {
  ar: {
    loginTitle: 'منطقة إدارة أفيا لينك',
    loginSubtitle: 'بوابة مصرحة لفريق العمليات التجارية التصديرية وإدارة المحتوى.',
    passwordLabel: 'كلمة مرور مدير النظام',
    passwordPlaceholder: 'أدخل كلمة المرور...',
    defaultPassHint: 'كلمة المرور الافتراضية:',
    loginBtn: 'تسجيل الدخول للوحة التحكم',
    backToSite: 'العودة للموقع الرئيسي',
    authFailed: 'فشل تسجيل الدخول. كلمة مرور غير صحيحة.',
    badge: 'العمليات التجارية وإدارة المحتوى التصديري',
    title: 'لوحة تحكم إدارة أفيا لينك',
    viewSite: 'معاينة الموقع',
    signOut: 'تسجيل الخروج',
    tabLeads: 'طلبات الأسعار والرغبات',
    tabProducts: 'إدارة المنتجات الزراعية',
    tabPortfolio: 'إدارة سابقة الأعمال والشحنات',
    tabAnalytics: 'التحليلات والإحصائيات الحية',
    tabSettings: 'إعدادات الشركة والبيانات الرئيسية',
    settingsTitle: 'تعديل البيانات الرئيسية ومعلومات التواصل والموقع',
    settingsSub: 'تحديث أرقام الهواتف، البريد الإلكتروني، رابط واتساب للزر العائم، روابط التواصل الاجتماعي وعناوين وموقع الشركة الحي',
    phoneLabel: 'رقم الهاتف الرئيسي (Phone Number)',
    hotlineLabel: 'هاتف التصدير المباشر (Direct Export Hotline)',
    hotlineExplanation: 'رقم الهاتف المباشر لقسم التصدير الذي يظهر في الشريط العلوي للموقع (Top Utility Bar).',
    emailLabel: 'البريد الإلكتروني التجاري (Commercial Email)',
    websiteUrlLabel: 'رابط / نطاق الموقع الإلكتروني (Website URL / Domain)',
    websiteUrlExplanation: 'اسم النطاق لموقعكم (مثل avialink.com) الذي يظهر في أسفل الصفحة وفي تذييل الموقع والروابط المرجعية.',
    whatsappNumberLabel: 'رقم الواتساب الظاهر (WhatsApp Display Number)',
    whatsappNumberExplanation: 'هذا هو رقم الواتساب الذي ستصل عليه جميع طلبات عروض الأسعار والشحنات الجديدة مباشرة من العملاء فور إرسالها.',
    whatsappLinkLabel: 'رابط الواتساب المباشر للزر العائم (Floating Button WhatsApp Link)',
    locationArLabel: 'عنوان المقر والمستودعات (بالعربية)',
    locationEnLabel: 'Headquarters & Logistics Address (English)',
    liveLocationUrlLabel: 'رابط الموقع الحي على خرائط جوجل (Google Maps Live Location URL)',
    socialSectionTitle: 'روابط منصات التواصل الاجتماعي الرسمية',
    btnSaveSettings: 'حفظ وتحديث بيانات الشركة الرئيسية',
    settingsSavedSuccess: 'تم حفظ وتحديث جميع البيانات بنجاح وتطبيقها على كامل الموقع!',
    allStatuses: 'جميع الحالات',
    statusNew: 'طلب استفسار جديد',
    statusContacted: 'تم التواصل مع العميل',
    statusQualified: 'عميل مؤهل وجاهز للتعاقد',
    statusClosed: 'تم إتمام الصفقة وتأكيد الشحن',
    searchLeadsPlaceholder: 'بحث باسم العميل أو الشركة...',
    exportCsv: 'تصدير ملف CSV',
    addProductTitle: 'إضافة محصول زراعي جديد للدليل',
    editProductTitle: 'تعديل بيانات المحصول',
    productSub: 'تحكم كامل بالمواصفات، الصور، مواسم التصدير والتعبئة',
    cancelEdit: 'إلغاء التعديل والإضافة من جديد',
    labelNameAr: 'اسم المحصول (بالعربية)',
    labelNameEn: 'Product Name (English)',
    labelCategory: 'الفئة / التصنيف',
    labelImage: 'رابط صورة المحصول (Image URL)',
    labelSeason: 'نافذة التصدير / الموسم (Export Season)',
    labelHsCode: 'رمز الجمرك (HS Code)',
    btnSaveProduct: 'إضافة المحصول للدليل الآن',
    btnUpdateProduct: 'حفظ التعديلات على المحصول',
    currentProductsList: 'قائمة المنتجات الحالية',
    addPortfolioTitle: 'إضافة شحنة/مشروع جديد لسابقة الأعمال',
    editPortfolioTitle: 'تعديل مشروع/شحنة سابقة الأعمال',
    portfolioSub: 'سيظهر المشروع مباشرة في المعرض التفاعلي واكتساب ثقة المستوردين',
    labelProjTitle: 'عنوان المشروع / الشحنة',
    labelCropName: 'اسم المحصول المصدّر (Crop)',
    labelDest: 'الدولة المستوردة (Destination)',
    labelPort: 'اسم الميناء (Target Port)',
    labelVolumeTonnes: 'حجم الشحنة (بالأطنان)',
    labelContainerCount: 'عدد الحاويات (Containers Count)',
    labelProjImage: 'رابط صورة الشحنة/المشروع (Image URL)',
    labelFeedback: 'تقييم/رأي المستورد (Buyer Feedback Quote)',
    btnSavePortfolio: 'إضافة الشحنة لسابقة الأعمال الآن',
    btnUpdatePortfolio: 'حفظ تعديلات الشحنة',
    currentPortfolioList: 'قائمة شحنات سابقة الأعمال الحالية',
    totalPageViews: 'إجمالي المشاهدات',
    rfqStarts: 'بدء تعبئة نموذج RFQ',
    totalLeads: 'طلبات الأسعار المسجلة',
    specDownloads: 'تحميلات بطاقات المواصفات',
    integrityNote: 'ضمان نزاهة البيانات (§1): تعكس جميع العدادات أعلاه تفاعلات حقيقية للزوار مسجلة في قاعدة البيانات الفعلية دون أي أرقام عشوائية.',
    noLeads: 'لا توجد طلبات مسجلة حالياً تطابق معايير البحث.',
    colDate: 'تاريخ الطلب',
    colBuyer: 'المشتري والشركة',
    colCountry: 'الدولة',
    colProduct: 'المحصول المطلوب',
    colVolume: 'الكمية',
    colPort: 'ميناء الوصول',
    colStatus: 'حالة الطلب',
    colActions: 'الإجراءات',
    viewLeadBtn: 'عرض تفاصيل الطلب',
    leadModalTitle: 'تفاصيل طلب عرض السعر التصديري',
    sendToCompanyWa: 'إرسال إلى واتساب الموقع المسجل',
    chatWithBuyerWa: 'مراسلة العميل على واتساب',
    copyLeadDetails: 'نسخ ملخص الطلب',
    copiedText: 'تم النسخ!',
    buyerProfileSection: 'بيانات المشتري والجهة الطالبة',
    specsSection: 'المحصول والمواصفات الفنية',
    logisticsSection: 'اللوجستيات وشروط الشحن والتسليم',
    notesSection: 'ملاحظات العميل وتعليمات الجودة',
    closeModal: 'إغلاق',
    updateStatusLabel: 'تحديث حالة الطلب:',
    viewProductBtn: 'عرض وتفاصيل',
    productModalTitle: 'تفاصيل المحصول والمواصفات التصديرية',
    shareProductWa: 'مشاركة مواصفات المحصول عبر واتساب',
    openProductLive: 'معاينة صفحة المنتج بالموقع',
    copyProductSummary: 'نسخ مواصفات المحصول',
    prodVarietiesLabel: 'الأصناف المزروعة المتاحة',
    prodSizesLabel: 'الأحجام والفرز',
    prodPackagingLabel: 'خيارات التعبئة والشحن',
    prodMoqLabel: 'الحد الأدنى للطلب (MOQ)'
  },
  en: {
    loginTitle: 'AVIALINK Admin Area',
    loginSubtitle: 'Authorized portal for export commercial operations & content management.',
    passwordLabel: 'Admin Authentication Password',
    passwordPlaceholder: 'Enter admin password...',
    defaultPassHint: 'Default password:',
    loginBtn: 'Log In to Admin Portal',
    backToSite: 'Return to Public Website',
    authFailed: 'Authentication failed. Invalid admin password.',
    badge: 'Commercial Operations & Content Management',
    title: 'AVIALINK Admin Dashboard',
    viewSite: 'View Public Site',
    signOut: 'Sign Out',
    tabLeads: 'RFQ Inquiries & Leads',
    tabProducts: 'Agricultural Products Management',
    tabPortfolio: 'Export Portfolio & Shipments',
    tabAnalytics: 'Real-time Traffic & Analytics',
    tabSettings: 'Company Settings & Main Contacts',
    settingsTitle: 'Company Core Settings, Contacts & Live Location',
    settingsSub: 'Update phone, email, floating WhatsApp link, social media profiles, written address, and live Google Maps location',
    phoneLabel: 'Main Phone Number',
    hotlineLabel: 'Direct Export Hotline',
    hotlineExplanation: 'Direct phone number for the export department shown in the top corporate utility bar of the website.',
    emailLabel: 'Commercial Email',
    websiteUrlLabel: 'Website Domain / URL',
    websiteUrlExplanation: 'The domain name of your website (e.g. avialink.com) shown in the footer and reference links.',
    whatsappNumberLabel: 'WhatsApp Display Number',
    whatsappNumberExplanation: 'This is the WhatsApp number that will directly receive all incoming quotation requests and shipment inquiries submitted by clients.',
    whatsappLinkLabel: 'Direct WhatsApp Link for Floating Button (https://wa.me/...)',
    locationArLabel: 'Headquarters & Logistics Address (Arabic)',
    locationEnLabel: 'Headquarters & Logistics Address (English)',
    liveLocationUrlLabel: 'Google Maps Live Location URL',
    socialSectionTitle: 'Official Social Media Profiles',
    btnSaveSettings: 'Save & Apply Company Settings',
    settingsSavedSuccess: 'All company settings and links updated successfully across the entire platform!',
    allStatuses: 'All Statuses',
    statusNew: 'New Inquiry',
    statusContacted: 'Contacted',
    statusQualified: 'Qualified Lead',
    statusClosed: 'Deal Closed / Shipped',
    searchLeadsPlaceholder: 'Search buyer, company, country...',
    exportCsv: 'Export CSV',
    addProductTitle: 'Add New Crop to Catalog',
    editProductTitle: 'Edit Crop Specifications',
    productSub: 'Full control over export specs, varieties, grades, and packaging options',
    cancelEdit: 'Cancel edit and add new',
    labelNameAr: 'Crop Name (Arabic)',
    labelNameEn: 'Product Name (English)',
    labelCategory: 'Category / Division',
    labelImage: 'Crop Image URL',
    labelSeason: 'Export Window / Seasonality',
    labelHsCode: 'HS Tariff Code',
    btnSaveProduct: 'Add Crop to Catalog',
    btnUpdateProduct: 'Save Crop Changes',
    currentProductsList: 'Current Catalog Products',
    addPortfolioTitle: 'Add Project to Export Portfolio',
    editPortfolioTitle: 'Edit Export Portfolio Project',
    portfolioSub: 'Directly displayed in the interactive portfolio gallery for global importers',
    labelProjTitle: 'Project / Shipment Title',
    labelCropName: 'Exported Crop',
    labelDest: 'Destination Country',
    labelPort: 'Target Port of Discharge',
    labelVolumeTonnes: 'Shipment Volume (Tons)',
    labelContainerCount: 'Containers Count',
    labelProjImage: 'Shipment Image URL',
    labelFeedback: 'Buyer Feedback Quote',
    btnSavePortfolio: 'Add Project to Portfolio',
    btnUpdatePortfolio: 'Save Project Changes',
    currentPortfolioList: 'Current Portfolio Shipments',
    totalPageViews: 'Total Page Views',
    rfqStarts: 'RFQ Form Starts',
    totalLeads: 'Total Leads Logged',
    specDownloads: 'Spec Sheet Downloads',
    integrityNote: 'Data Integrity Guarantee (§1): All counters above reflect real visitor interactions logged in the backend. No fabricated numbers.',
    noLeads: 'No leads found matching criteria. Submit a test quotation through the website to see it logged here!',
    colDate: 'Submitted At',
    colBuyer: 'Buyer & Company',
    colCountry: 'Country',
    colProduct: 'Product Interest',
    colVolume: 'Volume',
    colPort: 'Port',
    colStatus: 'Status',
    colActions: 'Actions',
    viewLeadBtn: 'View Details',
    leadModalTitle: 'Export RFQ Details & Inquiry',
    sendToCompanyWa: 'Forward to Company WhatsApp',
    chatWithBuyerWa: 'Message Buyer on WhatsApp',
    copyLeadDetails: 'Copy Order Summary',
    copiedText: 'Copied!',
    buyerProfileSection: 'Buyer & Company Profile',
    specsSection: 'Crop Specifications & Caliber',
    logisticsSection: 'Shipping Logistics & Delivery Terms',
    notesSection: 'Buyer Notes & Quality Instructions',
    closeModal: 'Close',
    updateStatusLabel: 'Update Lead Status:',
    viewProductBtn: 'View Details',
    productModalTitle: 'Export Crop Specifications & Details',
    shareProductWa: 'Share Specs via WhatsApp',
    openProductLive: 'View Live Product Page',
    copyProductSummary: 'Copy Crop Specs',
    prodVarietiesLabel: 'Available Cultivars & Varieties',
    prodSizesLabel: 'Sizes & Calibers',
    prodPackagingLabel: 'Packaging & Reefer Shipping',
    prodMoqLabel: 'Minimum Order Quantity (MOQ)'
  },
  fr: {
    loginTitle: 'Espace Administration AVIALINK',
    loginSubtitle: 'Portail autorisé pour les opérations commerciales et la gestion du contenu.',
    passwordLabel: 'Mot de passe d’administration',
    passwordPlaceholder: 'Entrez le mot de passe...',
    defaultPassHint: 'Mot de passe par défaut :',
    loginBtn: 'Connexion au Portail Admin',
    backToSite: 'Retour au site public',
    authFailed: 'Échec de l’authentification. Mot de passe invalide.',
    badge: 'Opérations commerciales & Gestion du contenu',
    title: 'Tableau de bord administrateur AVIALINK',
    viewSite: 'Voir le site',
    signOut: 'Déconnexion',
    tabLeads: 'Demandes de devis (Leads)',
    tabProducts: 'Gestion des produits agricoles',
    tabPortfolio: 'Gestion des projets d’exportation',
    tabAnalytics: 'Statistiques & Trafic en direct',
    tabSettings: 'Paramètres d’entreprise & Contacts',
    settingsTitle: 'Paramètres principaux, contacts et localisation',
    settingsSub: 'Mettez à jour le téléphone, l’e-mail, WhatsApp flottant, les réseaux sociaux et la localisation en direct',
    phoneLabel: 'Numéro de téléphone principal',
    hotlineLabel: 'Ligne Export Directe',
    hotlineExplanation: 'Numéro de téléphone direct pour le service export affiché dans la barre supérieure du site.',
    emailLabel: 'E-mail commercial',
    websiteUrlLabel: 'Noms de domaine / URL',
    websiteUrlExplanation: 'Le nom de domaine de votre site (ex: avialink.com) affiché dans le pied de page et les liens de référence.',
    whatsappNumberLabel: 'Numéro WhatsApp affiché',
    whatsappNumberExplanation: 'Numéro WhatsApp qui recevra directement toutes les nouvelles demandes de devis transmises par les clients.',
    whatsappLinkLabel: 'Lien direct WhatsApp pour le bouton flottant',
    locationArLabel: 'Adresse du siège et logistique (Arabe)',
    locationEnLabel: 'Adresse du siège et logistique (Anglais)',
    liveLocationUrlLabel: 'URL de localisation en direct Google Maps',
    socialSectionTitle: 'Réseaux sociaux officiels',
    btnSaveSettings: 'Enregistrer les paramètres de l’entreprise',
    settingsSavedSuccess: 'Tous les paramètres et liens ont été mis à jour avec succès !',
    allStatuses: 'Tous les statuts',
    statusNew: 'Nouvelle demande',
    statusContacted: 'Contacté',
    statusQualified: 'Prospect qualifié',
    statusClosed: 'Contrat conclu / Expédié',
    searchLeadsPlaceholder: 'Rechercher acheteur, entreprise...',
    exportCsv: 'Exporter en CSV',
    addProductTitle: 'Ajouter un nouveau produit au catalogue',
    editProductTitle: 'Modifier les spécifications du produit',
    productSub: 'Contrôle complet des calibres, photos, emballages et saisons d’export',
    cancelEdit: 'Annuler la modification',
    labelNameAr: 'Nom du produit (Arabe)',
    labelNameEn: 'Nom du produit (Anglais)',
    labelCategory: 'Catégorie',
    labelImage: 'URL de l’image',
    labelSeason: 'Calendrier d’exportation',
    labelHsCode: 'Code douanier (HS Code)',
    btnSaveProduct: 'Ajouter le produit au catalogue',
    btnUpdateProduct: 'Enregistrer les modifications',
    currentProductsList: 'Catalogue de produits actuels',
    addPortfolioTitle: 'Ajouter un projet d’exportation',
    editPortfolioTitle: 'Modifier le projet d’exportation',
    portfolioSub: 'Affiché directement dans la galerie pour renforcer la confiance des acheteurs',
    labelProjTitle: 'Titre du projet / de l’expédition',
    labelCropName: 'Produit exporté',
    labelDest: 'Pays de destination',
    labelPort: 'Port de déchargement',
    labelVolumeTonnes: 'Volume expédié (Tonnes)',
    labelContainerCount: 'Nombre de conteneurs',
    labelProjImage: 'URL de l’image de l’expédition',
    labelFeedback: 'Avis de l’acheteur',
    btnSavePortfolio: 'Ajouter au portefeuille',
    btnUpdatePortfolio: 'Enregistrer les modifications',
    currentPortfolioList: 'Expéditions du portefeuille actuel',
    totalPageViews: 'Pages vues totales',
    rfqStarts: 'Formulaires RFQ entamés',
    totalLeads: 'Devis enregistrés',
    specDownloads: 'Fiches techniques téléchargées',
    integrityNote: 'Garantie d’intégrité des données (§1) : Toutes les données ci-dessus proviennent d’interactions réelles.',
    noLeads: 'Aucune demande trouvée selon les critères actuels.',
    colDate: 'Date',
    colBuyer: 'Acheteur & Société',
    colCountry: 'Pays',
    colProduct: 'Produit souhaité',
    colVolume: 'Volume',
    colPort: 'Port d’arrivée',
    colStatus: 'Statut',
    colActions: 'Actions',
    viewLeadBtn: 'Voir les détails',
    leadModalTitle: 'Détails de la demande de devis export',
    sendToCompanyWa: 'Transférer sur le WhatsApp de l’entreprise',
    chatWithBuyerWa: 'Contacter le client sur WhatsApp',
    copyLeadDetails: 'Copier le récapitulatif',
    copiedText: 'Copié !',
    buyerProfileSection: 'Profil acheteur & entreprise',
    specsSection: 'Spécifications & Calibre du produit',
    logisticsSection: 'Logistique & Conditions d’expédition',
    notesSection: 'Notes du client & Instructions qualité',
    closeModal: 'Fermer',
    updateStatusLabel: 'Modifier le statut :',
    viewProductBtn: 'Voir Détails',
    productModalTitle: 'Spécifications et détails de la culture d’export',
    shareProductWa: 'Partager les spécifications sur WhatsApp',
    openProductLive: 'Voir la page du produit',
    copyProductSummary: 'Copier les spécifications',
    prodVarietiesLabel: 'Variétés cultivées disponibles',
    prodSizesLabel: 'Calibres et tailles',
    prodPackagingLabel: 'Conditionnement et transport',
    prodMoqLabel: 'Commande minimale (MOQ)'
  },
  es: {
    loginTitle: 'Área de Administración AVIALINK',
    loginSubtitle: 'Portal autorizado para operaciones comerciales y gestión de contenidos.',
    passwordLabel: 'Contraseña de administrador',
    passwordPlaceholder: 'Introduzca la contraseña...',
    defaultPassHint: 'Contraseña por defecto:',
    loginBtn: 'Iniciar sesión en el Portal',
    backToSite: 'Volver al sitio público',
    authFailed: 'Autenticación fallida. Contraseña incorrecta.',
    badge: 'Operaciones Comerciales y Gestión de Contenidos',
    title: 'Panel de Control AVIALINK',
    viewSite: 'Ver sitio público',
    signOut: 'Cerrar sesión',
    tabLeads: 'Cotizaciones y Leads',
    tabProducts: 'Gestión de Productos Agrícolas',
    tabPortfolio: 'Gestión de Envíos y Proyectos',
    tabAnalytics: 'Estadísticas y Tráfico en Vivo',
    tabSettings: 'Configuración de Empresa y Contactos',
    settingsTitle: 'Datos principales, contactos y ubicación en vivo',
    settingsSub: 'Actualice teléfono, correo, WhatsApp flotante, redes sociales y ubicación de Google Maps',
    phoneLabel: 'Número de teléfono principal',
    hotlineLabel: 'Línea Directa de Exportación',
    hotlineExplanation: 'Número de teléfono directo para el departamento de exportación que se muestra en la barra superior del sitio.',
    emailLabel: 'Correo electrónico comercial',
    websiteUrlLabel: 'Dominio / URL del Sitio Web',
    websiteUrlExplanation: 'El nombre de dominio de su sitio web (por ejemplo, avialink.com) que se muestra en el pie de página.',
    whatsappNumberLabel: 'Número de WhatsApp visible',
    whatsappNumberExplanation: 'Número de WhatsApp que recibirá directamente todas las solicitudes de cotización enviadas por los clientes.',
    whatsappLinkLabel: 'Enlace directo de WhatsApp para el botón flotante',
    locationArLabel: 'Dirección de sede y logística (Árabe)',
    locationEnLabel: 'Dirección de sede y logística (Inglés)',
    liveLocationUrlLabel: 'Enlace de ubicación en vivo de Google Maps',
    socialSectionTitle: 'Perfiles oficiales en redes sociales',
    btnSaveSettings: 'Guardar configuración de la empresa',
    settingsSavedSuccess: '¡Se han guardado y actualizado todos los datos correctamente en todo el sitio!',
    allStatuses: 'Todos los estados',
    statusNew: 'Nueva consulta',
    statusContacted: 'Contactado',
    statusQualified: 'Lead calificado',
    statusClosed: 'Cerrado / Enviado',
    searchLeadsPlaceholder: 'Buscar comprador, empresa...',
    exportCsv: 'Exportar CSV',
    addProductTitle: 'Agregar nuevo cultivo al catálogo',
    editProductTitle: 'Modificar datos del cultivo',
    productSub: 'Control total de especificaciones, empaques y temporadas de exportación',
    cancelEdit: 'Cancelar edición',
    labelNameAr: 'Nombre del cultivo (Árabe)',
    labelNameEn: 'Nombre del cultivo (Inglés)',
    labelCategory: 'Categoría',
    labelImage: 'URL de la imagen',
    labelSeason: 'Temporada de exportación',
    labelHsCode: 'Código Arancelario (HS Code)',
    btnSaveProduct: 'Agregar cultivo al catálogo',
    btnUpdateProduct: 'Guardar cambios del cultivo',
    currentProductsList: 'Lista de cultivos actuales',
    addPortfolioTitle: 'Agregar proyecto de exportación',
    editPortfolioTitle: 'Modificar proyecto de exportación',
    portfolioSub: 'Visible directamente en la galería de proyectos para importadores globales',
    labelProjTitle: 'Título del proyecto / envío',
    labelCropName: 'Cultivo exportado',
    labelDest: 'País de destino',
    labelPort: 'Puerto de descarga',
    labelVolumeTonnes: 'Volumen (Toneladas)',
    labelContainerCount: 'Número de contenedores',
    labelProjImage: 'URL de imagen del envío',
    labelFeedback: 'Opinión del importador',
    btnSavePortfolio: 'Agregar al portafolio',
    btnUpdatePortfolio: 'Guardar cambios',
    currentPortfolioList: 'Envíos actuales en el portafolio',
    totalPageViews: 'Vistas de página totales',
    rfqStarts: 'Formularios RFQ iniciados',
    totalLeads: 'Solicitudes registradas',
    specDownloads: 'Fichas técnicas descargadas',
    integrityNote: 'Garantía de integridad de datos (§1): Todos los contadores provienen de interacciones reales registradas.',
    noLeads: 'No se encontraron consultas con los criterios seleccionados.',
    colDate: 'Fecha',
    colBuyer: 'Comprador y Empresa',
    colCountry: 'País',
    colProduct: 'Cultivo de interés',
    colVolume: 'Volumen',
    colPort: 'Puerto',
    colStatus: 'Estado',
    colActions: 'Acciones',
    viewLeadBtn: 'Ver detalles',
    leadModalTitle: 'Detalles de la cotización de exportación',
    sendToCompanyWa: 'Reenviar al WhatsApp de la empresa',
    chatWithBuyerWa: 'Contactar al cliente por WhatsApp',
    copyLeadDetails: 'Copiar resumen del pedido',
    copiedText: '¡Copiado!',
    buyerProfileSection: 'Perfil del comprador y empresa',
    specsSection: 'Especificaciones del cultivo y calibre',
    logisticsSection: 'Logística de envío y términos de entrega',
    notesSection: 'Notas del cliente e instrucciones de calidad',
    closeModal: 'Cerrar',
    updateStatusLabel: 'Actualizar estado:',
    viewProductBtn: 'Ver Detalles',
    productModalTitle: 'Especificaciones y detalles del cultivo de exportación',
    shareProductWa: 'Compartir especificaciones por WhatsApp',
    openProductLive: 'Ver página del producto',
    copyProductSummary: 'Copiar especificaciones',
    prodVarietiesLabel: 'Variedades cultivadas disponibles',
    prodSizesLabel: 'Calibres y tamaños',
    prodPackagingLabel: 'Empaque y transporte refrigerado',
    prodMoqLabel: 'Pedido mínimo (MOQ)'
  },
  de: {
    loginTitle: 'AVIALINK Administrationsbereich',
    loginSubtitle: 'Autorisiertes Portal für Exportgeschäft und Content-Management.',
    passwordLabel: 'Administrator-Passwort',
    passwordPlaceholder: 'Passwort eingeben...',
    defaultPassHint: 'Standardpasswort:',
    loginBtn: 'Im Admin-Portal anmelden',
    backToSite: 'Zurück zur Website',
    authFailed: 'Authentifizierung fehlgeschlagen. Ungültiges Passwort.',
    badge: 'Export-Geschäftsabläufe & Content-Management',
    title: 'AVIALINK Admin-Dashboard',
    viewSite: 'Website ansehen',
    signOut: 'Abmelden',
    tabLeads: 'Preisanfragen & Leads',
    tabProducts: 'Agrarprodukte verwalten',
    tabPortfolio: 'Exportprojekte verwalten',
    tabAnalytics: 'Echtzeit-Statistiken & Traffic',
    tabSettings: 'Unternehmenseinstellungen & Kontakte',
    settingsTitle: 'Stammdaten, Kontakte & Live-Standort',
    settingsSub: 'Aktualisieren Sie Telefon, E-Mail, Floating WhatsApp, Social Media und Live-Standort',
    phoneLabel: 'Haupttelefonnummer',
    hotlineLabel: 'Direkte Export-Hotline',
    hotlineExplanation: 'Direkte Telefonnummer der Exportabteilung, die in der oberen Leiste der Website angezeigt wird.',
    emailLabel: 'Geschäftliche E-Mail',
    websiteUrlLabel: 'Website-Domain / URL',
    websiteUrlExplanation: 'Der Domain-Name Ihrer Website (z.B. avialink.com), der im Footer angezeigt wird.',
    whatsappNumberLabel: 'WhatsApp-Anzeigenummer',
    whatsappNumberExplanation: 'WhatsApp-Nummer, an die alle neuen Preisanfragen von Kunden direkt nach dem Absenden gesendet werden.',
    whatsappLinkLabel: 'Direkter WhatsApp-Link für Floating-Button',
    locationArLabel: 'Hauptsitz & Logistikadresse (Arabisch)',
    locationEnLabel: 'Hauptsitz & Logistikadresse (Englisch)',
    liveLocationUrlLabel: 'Google Maps Live-Standort-URL',
    socialSectionTitle: 'Offizielle Social-Media-Profile',
    btnSaveSettings: 'Unternehmenseinstellungen speichern',
    settingsSavedSuccess: 'Alle Unternehmensdaten und Links wurden erfolgreich gespeichert und angewendet!',
    allStatuses: 'Alle Status',
    statusNew: 'Neue Anfrage',
    statusContacted: 'Kontaktiert',
    statusQualified: 'Qualifizierter Lead',
    statusClosed: 'Abgeschlossen / Versandt',
    searchLeadsPlaceholder: 'Käufer, Firma, Land suchen...',
    exportCsv: 'CSV exportieren',
    addProductTitle: 'Neues Produkt zum Katalog hinzufügen',
    editProductTitle: 'Produktdaten bearbeiten',
    productSub: 'Vollständige Kontrolle über Spezifikationen, Sorten und Exportzeiträume',
    cancelEdit: 'Bearbeitung abbrechen',
    labelNameAr: 'Produktname (Arabisch)',
    labelNameEn: 'Produktname (Englisch)',
    labelCategory: 'Kategorie',
    labelImage: 'Bild-URL',
    labelSeason: 'Exportsaison',
    labelHsCode: 'Zolltarifnummer (HS Code)',
    btnSaveProduct: 'Produkt zum Katalog hinzufügen',
    btnUpdateProduct: 'Änderungen speichern',
    currentProductsList: 'Aktuelle Produkte im Katalog',
    addPortfolioTitle: 'Neues Exportprojekt hinzufügen',
    editPortfolioTitle: 'Exportprojekt bearbeiten',
    portfolioSub: 'Wird direkt in der Galerie für internationale Importeure angezeigt',
    labelProjTitle: 'Projekttitel / Sendung',
    labelCropName: 'Exportiertes Agrarprodukt',
    labelDest: 'Zielland',
    labelPort: 'Zielhafen',
    labelVolumeTonnes: 'Sendungsvolumen (Tonnen)',
    labelContainerCount: 'Containeranzahl',
    labelProjImage: 'Bild-URL der Sendung',
    labelFeedback: 'Käufer-Feedback',
    btnSavePortfolio: 'Zum Portfolio hinzufügen',
    btnUpdatePortfolio: 'Projektänderungen speichern',
    currentPortfolioList: 'Aktuelle Portfoliosendungen',
    totalPageViews: 'Seitenaufrufe insgesamt',
    rfqStarts: 'RFQ-Formular gestartet',
    totalLeads: 'Eingegangene Anfragen',
    specDownloads: 'Spezifikations-Downloads',
    integrityNote: 'Datenintegritäts-Garantie (§1): Alle Zähler spiegeln echte Besucherinteraktionen wider.',
    noLeads: 'Keine Anfragen gefunden.',
    colDate: 'Eingereicht am',
    colBuyer: 'Käufer & Firma',
    colCountry: 'Land',
    colProduct: 'Gewünschtes Produkt',
    colVolume: 'Menge',
    colPort: 'Zielhafen',
    colStatus: 'Status',
    colActions: 'Aktionen',
    viewLeadBtn: 'Details ansehen',
    leadModalTitle: 'Details der Export-Preisanfrage',
    sendToCompanyWa: 'An Firmen-WhatsApp weiterleiten',
    chatWithBuyerWa: 'Käufer auf WhatsApp kontaktieren',
    copyLeadDetails: 'Bestellzusammenfassung kopieren',
    copiedText: 'Kopiert!',
    buyerProfileSection: 'Käufer- & Unternehmensprofil',
    specsSection: 'Produktspezifikationen & Kaliber',
    logisticsSection: 'Versandlogistik & Lieferbedingungen',
    notesSection: 'Kundenhinweise & Qualitätsvorgaben',
    closeModal: 'Schließen',
    updateStatusLabel: 'Status aktualisieren:',
    viewProductBtn: 'Details anzeigen',
    productModalTitle: 'Exportspezifikationen & Produktdetails',
    shareProductWa: 'Spezifikationen per WhatsApp teilen',
    openProductLive: 'Live-Produktseite ansehen',
    copyProductSummary: 'Spezifikationen kopieren',
    prodVarietiesLabel: 'Verfügbare Sorten',
    prodSizesLabel: 'Kaliber & Größen',
    prodPackagingLabel: 'Verpackung & Kühltransport',
    prodMoqLabel: 'Mindestbestellmenge (MOQ)'
  },
  ru: {
    loginTitle: 'Панель управления AVIALINK',
    loginSubtitle: 'Авторизованный портал для коммерческих операций и управления контентом.',
    passwordLabel: 'Пароль администратора',
    passwordPlaceholder: 'Введите пароль...',
    defaultPassHint: 'Пароль по умолчанию:',
    loginBtn: 'Войти в панель управления',
    backToSite: 'Вернуться на сайт',
    authFailed: 'Ошибка аутентификации. Неверный пароль.',
    badge: 'Коммерческие операции и контент-менеджмент',
    title: 'Панель управления AVIALINK',
    viewSite: 'Перейти на сайт',
    signOut: 'Выйти',
    tabLeads: 'Запросы цен и лиды',
    tabProducts: 'Управление сельхозпродукцией',
    tabPortfolio: 'Управление экспортом и проектами',
    tabAnalytics: 'Статистика и трафик в реальном времени',
    tabSettings: 'Настройки компании и контакты',
    settingsTitle: 'Основные данные, контакты и геолокация',
    settingsSub: 'Обновление телефона, почты, плавающей кнопки WhatsApp, соцсетей и геолокации',
    phoneLabel: 'Основной номер телефона',
    hotlineLabel: 'Прямая экспортная линия',
    hotlineExplanation: 'Прямой номер телефона отдела экспорта, отображаемый в верхней панели сайта.',
    emailLabel: 'Корпоративная электронная почта',
    websiteUrlLabel: 'Домен / URL сайта',
    websiteUrlExplanation: 'Доменное имя вашего веб-сайта (например, avialink.com), отображаемое в футере.',
    whatsappNumberLabel: 'Отображаемый номер WhatsApp',
    whatsappNumberExplanation: 'Номер WhatsApp, на который будут напрямую поступать все новые запросы цен от клиентов сразу после отправки.',
    whatsappLinkLabel: 'Прямая ссылка WhatsApp для плавающей кнопки',
    locationArLabel: 'Адрес штаб-квартиры и логистики (Арабский)',
    locationEnLabel: 'Адрес штаб-квартиры и логистики (Английский)',
    liveLocationUrlLabel: 'Ссылка на местоположение в Google Maps',
    socialSectionTitle: 'Официальные профили в социальных сетях',
    btnSaveSettings: 'Сохранить настройки компании',
    settingsSavedSuccess: 'Все настройки компании и ссылки успешно сохранены и обновлены на сайте!',
    allStatuses: 'Все статусы',
    statusNew: 'Новый запрос',
    statusContacted: 'Связались с клиентом',
    statusQualified: 'Квалифицированный лид',
    statusClosed: 'Сделка закрыта / Отгружено',
    searchLeadsPlaceholder: 'Поиск покупателя, компании...',
    exportCsv: 'Экспорт в CSV',
    addProductTitle: 'Добавить культуру в каталог',
    editProductTitle: 'Редактировать параметры культуры',
    productSub: 'Полный контроль спецификаций, сортов, упаковки и сезонов экспорта',
    cancelEdit: 'Отменить редактирование',
    labelNameAr: 'Название товара (Арабский)',
    labelNameEn: 'Название товара (Английский)',
    labelCategory: 'Категория',
    labelImage: 'URL изображения товара',
    labelSeason: 'Сезон экспорта',
    labelHsCode: 'Код ТН ВЭД (HS Code)',
    btnSaveProduct: 'Добавить товар в каталог',
    btnUpdateProduct: 'Сохранить изменения товара',
    currentProductsList: 'Текущие товары в каталоге',
    addPortfolioTitle: 'Добавить экспортный проект',
    editPortfolioTitle: 'Редактировать экспортный проект',
    portfolioSub: 'Отображается в портфолио для доверия зарубежных покупателей',
    labelProjTitle: 'Название проекта / поставки',
    labelCropName: 'Экспортируемая культура',
    labelDest: 'Страна назначения',
    labelPort: 'Порт выгрузки',
    labelVolumeTonnes: 'Объем поставки (тонн)',
    labelContainerCount: 'Количество контейнеров',
    labelProjImage: 'URL изображения поставки',
    labelFeedback: 'Отзыв импортера',
    btnSavePortfolio: 'Добавить в портфолио',
    btnUpdatePortfolio: 'Сохранить изменения',
    currentPortfolioList: 'Текущие поставки в портфолио',
    totalPageViews: 'Всего просмотров страниц',
    rfqStarts: 'Заполнений формы RFQ',
    totalLeads: 'Зарегистрированных запросов',
    specDownloads: 'Скачиваний спецификаций',
    integrityNote: 'Гарантия целостности данных (§1): Все счетчики отражают реальные действия посетителей.',
    noLeads: 'Запросов не найдено.',
    colDate: 'Дата запроса',
    colBuyer: 'Покупатель и компания',
    colCountry: 'Страна',
    colProduct: 'Интересующая культура',
    colVolume: 'Объем',
    colPort: 'Порт',
    colStatus: 'Статус',
    colActions: 'Действия',
    viewLeadBtn: 'Просмотр заявки',
    leadModalTitle: 'Детали экспортного запроса цен',
    sendToCompanyWa: 'Переслать на рабочий WhatsApp компании',
    chatWithBuyerWa: 'Написать покупателю в WhatsApp',
    copyLeadDetails: 'Скопировать сводку заказа',
    copiedText: 'Скопировано!',
    buyerProfileSection: 'Профиль покупателя и компании',
    specsSection: 'Спецификации культуры и калибр',
    logisticsSection: 'Логистика доставки и условия поставки',
    notesSection: 'Примечания клиента и требования к качеству',
    closeModal: 'Закрыть',
    updateStatusLabel: 'Обновить статус заявки:',
    viewProductBtn: 'Просмотр',
    productModalTitle: 'Экспортные спецификации и параметры культуры',
    shareProductWa: 'Поделиться спецификацией в WhatsApp',
    openProductLive: 'Перейти на страницу товара',
    copyProductSummary: 'Скопировать спецификацию',
    prodVarietiesLabel: 'Доступные сорта',
    prodSizesLabel: 'Калибры и размеры',
    prodPackagingLabel: 'Упаковка и рефрижераторная доставка',
    prodMoqLabel: 'Минимальный объем (MOQ)'
  }
};

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  btnText?: string;
  placeholderUrl?: string;
  password?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  btnText = 'رفع صورة مباشرة من الجهاز',
  placeholderUrl = 'أو ضع رابط صورة مباشر (https://...)',
  password
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً، يرجى اختيار ملف يقل عن 10 ميجابايت');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const headers: Record<string, string> = {};
      if (password) {
        headers['Authorization'] = `Bearer ${password}`;
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'فشل رفع الصورة');
      }

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        throw new Error('لم يتم استلام رابط الصورة');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      alert(`خطأ في رفع الملف: ${err.message || String(err)}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 col-span-1 sm:col-span-2 md:col-span-3 bg-[#0A1A14]/60 p-4 rounded-2xl border border-white/10">
      <label className="block text-white/80 font-bold text-xs">{label}</label>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {value ? (
          <div className="relative group shrink-0">
            <img
              src={value}
              alt="Preview"
              className="w-24 h-24 rounded-2xl object-cover border-2 border-[#C5A059] shadow-lg bg-black/40"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition-transform group-hover:scale-110"
              title="إزالة الصورة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 bg-black/20 shrink-0">
            <ImageIcon className="w-8 h-8 mb-1 text-white/30" />
            <span className="text-[10px]">لا توجد صورة</span>
          </div>
        )}

        <div className="flex-1 w-full space-y-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-white text-[#0A1A14] rounded-xl font-bold text-xs cursor-pointer transition-all shadow-md active:scale-95">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'جاري رفع الصورة...' : btnText}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            {value && (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                تم تعيين الصورة بنجاح
              </span>
            )}
          </div>

          <input
            type="text"
            placeholder={placeholderUrl}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059] text-xs"
          />
        </div>
      </div>
    </div>
  );
};

interface MultiImageUploadFieldProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  password?: string;
}

const MultiImageUploadField: React.FC<MultiImageUploadFieldProps> = ({
  label,
  value = [],
  onChange,
  password
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls = [...value];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) {
          alert(`حجم الصورة ${file.name} كبير جداً، يرجى اختيار ملف يقل عن 10 ميجابايت`);
          continue;
        }

        const formData = new FormData();
        formData.append('image', file);

        const headers: Record<string, string> = {};
        if (password) {
          headers['Authorization'] = `Bearer ${password}`;
        }

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers,
          body: formData
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'فشل رفع الصورة');
        }

        const data = await res.json();
        if (data.url) {
          newUrls.push(data.url);
        }
      }
      onChange(newUrls);
    } catch (err: any) {
      console.error('File upload error:', err);
      alert(`خطأ في رفع الملفات: ${err.message || String(err)}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newUrls = value.filter((_, idx) => idx !== indexToRemove);
    onChange(newUrls);
  };

  return (
    <div className="space-y-3 col-span-1 sm:col-span-2 md:col-span-3 bg-[#0A1A14]/60 p-4 rounded-2xl border border-white/10">
      <div className="flex justify-between items-center">
        <label className="block text-white/80 font-bold text-xs">{label}</label>
        <span className="text-[10px] text-white/40">{value.length} صور مضافة</span>
      </div>

      {/* Thumbnails grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {value.map((url, idx) => (
            <div key={idx} className="relative group shrink-0 aspect-square">
              <img
                src={url}
                alt={`Preview ${idx + 1}`}
                className="w-full h-full rounded-xl object-cover border-2 border-white/10 hover:border-[#C5A059] transition-all bg-black/40"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition-transform group-hover:scale-110"
                title="إزالة الصورة"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-1 left-1 bg-black/70 text-white/80 text-[9px] px-1.5 py-0.5 rounded-md font-mono">
                #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button and URL adder */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs cursor-pointer transition-all shadow-md active:scale-95">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'جاري رفع الصور...' : 'رفع صور متعددة من الجهاز'}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
        
        <input
          type="text"
          placeholder="أو أضف رابط صورة مباشر واضغط Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.currentTarget;
              const url = input.value.trim();
              if (url) {
                onChange([...value, url]);
                input.value = '';
              }
            }
          }}
          className="flex-1 w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059] text-xs"
        />
      </div>
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onBackToSite, 
  lang = 'ar', 
  onSettingsUpdated, 
  onNavigateToProduct,
  onProductsUpdated,
  siteContent,
  onSiteContentUpdated
}) => {
  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const isRtl = currentLangObj.dir === 'rtl';
  const tA = ADMIN_TRANSLATIONS[lang] || ADMIN_TRANSLATIONS.ar;
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'leads' | 'products' | 'portfolio' | 'exhibitions' | 'figures' | 'pillars' | 'protocols' | 'announcement' | 'csr' | 'analytics' | 'settings'>('leads');
  
  // Dynamic Site Content (CMS) State
  const [siteContentState, setSiteContentState] = useState<SiteContent>(siteContent || defaultSiteContent);

  useEffect(() => {
    if (siteContent) {
      setSiteContentState(siteContent);
    } else {
      fetchSiteContent().then(setSiteContentState).catch(console.error);
    }
  }, [siteContent]);

  const handleSiteContentUpdated = (updated: SiteContent) => {
    setSiteContentState(updated);
    if (onSiteContentUpdated) {
      onSiteContentUpdated(updated);
    }
  };

  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [copiedLead, setCopiedLead] = useState(false);

  // Products Detail Modal & Copy State
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [copiedProduct, setCopiedProduct] = useState(false);

  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Company Settings State
  const [settingsForm, setSettingsForm] = useState<CompanySettings>({
    phone: '(03) 11345627',
    email: 'export@avialink.com',
    whatsappNumber: '+20 100 000 0000',
    whatsappLink: 'https://wa.me/201000000000',
    hotline: '+20 10 933 933 55',
    websiteUrl: 'avialink.com',
    locationText: {
      ar: 'المنطقة اللوجستية الزراعية، طريق مصر إسكندرية الصحراوي، مصر',
      en: 'Agricultural Logistics Hub, Cairo-Alexandria Desert Road, Egypt',
      fr: 'Pôle logistique agricole, Route Le Caire-Alexandrie, Égypte',
      es: 'Centro logístico agrícola, Carretera El Cairo-Alejandría, Egipto',
      de: 'Agrarlogistikzentrum, Wüstenstraße Kairo-Alexandria, Ägypten',
      ru: 'Агрологистический узел, трасса Каир-Александрия, Египет'
    },
    liveLocationUrl: 'https://maps.google.com/?q=Alexandria+Port,Egypt',
    mapEmbedUrl: '',
    socialLinks: {
      facebook: 'https://facebook.com/avialink',
      twitter: 'https://x.com/avialink',
      linkedin: 'https://linkedin.com/company/avialink',
      instagram: 'https://instagram.com/avialink',
      youtube: 'https://youtube.com/@avialink'
    }
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Refs for smooth scroll on edit
  const productFormRef = React.useRef<HTMLDivElement>(null);
  const portfolioFormRef = React.useRef<HTMLDivElement>(null);

  // Products State
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [productForm, setProductForm] = useState<any>({
    name: '',
    nameEn: '',
    slug: '',
    category: 'Citrus',
    heroImage: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80',
    exportWindow: '',
    hsCode: '',
    moq: '1 Container (FCL ~24 Tons)',
    varieties: '',
    grades: 'First Class / FTI, Extra Grade',
    packagingOptions: ''
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // AI Product Generator State
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [generatingWithAi, setGeneratingWithAi] = useState(false);
  const [aiGenerateError, setAiGenerateError] = useState<string | null>(null);

  const handleGenerateProductWithAI = async () => {
    if (!aiPromptInput.trim()) {
      alert('الرجاء كتابة اسم المحصول أو وصف بسيط (مثال: مانجو فص عويس أو الفراولة الطازجة أو الفلفل الألوان)');
      return;
    }
    setGeneratingWithAi(true);
    setAiGenerateError(null);
    try {
      const aiProduct = await generateProductSpecsWithAI(password, aiPromptInput);
      if (aiProduct) {
        setProductForm((prev: any) => ({
          ...prev,
          ...aiProduct,
          varieties: Array.isArray(aiProduct.varieties) ? aiProduct.varieties.join(', ') : (aiProduct.varieties || ''),
          packagingOptions: Array.isArray(aiProduct.packagingOptions) ? aiProduct.packagingOptions.join(', ') : (aiProduct.packagingOptions || ''),
          grades: Array.isArray(aiProduct.grades) ? aiProduct.grades.join(', ') : (aiProduct.grades || ''),
          sizes: Array.isArray(aiProduct.sizes) ? aiProduct.sizes : prev.sizes,
          specificationSheet: aiProduct.specificationSheet || prev.specificationSheet
        }));
      }
    } catch (err: any) {
      setAiGenerateError(err.message || 'حدث خطأ أثناء توليد البيانات بالذكاء الاصطناعي');
    } finally {
      setGeneratingWithAi(false);
    }
  };

  const [translatingLocation, setTranslatingLocation] = useState(false);
  const handleAutoTranslateLocation = async () => {
    const textToTranslate = settingsForm.locationText.ar || settingsForm.locationText.en;
    if (!textToTranslate || !textToTranslate.trim()) {
      alert('الرجاء كتابة العنوان باللغة العربية أو الإنجليزية أولاً ثم الضغط على زر الترجمة التلقائية');
      return;
    }
    setTranslatingLocation(true);
    try {
      const translatedMap = await autoTranslateTextWithAI(password, textToTranslate, settingsForm.locationText.ar ? 'Arabic' : 'English');
      if (translatedMap) {
        setSettingsForm(prev => ({
          ...prev,
          locationText: {
            ar: translatedMap.ar || prev.locationText.ar,
            en: translatedMap.en || prev.locationText.en,
            fr: translatedMap.fr || prev.locationText.fr,
            es: translatedMap.es || prev.locationText.es,
            de: translatedMap.de || prev.locationText.de,
            ru: translatedMap.ru || prev.locationText.ru,
          }
        }));
        alert('✨ تم ترجمة عنوان الشركة تلقائياً لجميع اللغات الست (العربية، الإنجليزية، الفرنسية، الإسبانية، الألمانية، الروسية) بنجاح!');
      }
    } catch (err: any) {
      alert('خطأ أثناء الترجمة التلقائية: ' + (err.message || 'فشلت الترجمة'));
    } finally {
      setTranslatingLocation(false);
    }
  };

  // Portfolio State
  const [portfolioList, setPortfolioList] = useState<ExportProject[]>([]);
  const [portfolioForm, setPortfolioForm] = useState<Partial<ExportProject>>({
    title: '',
    category: 'europe',
    destination: '',
    port: '',
    volumeTonnes: 1000,
    containerCount: 40,
    cropName: '',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80',
    completionDate: '2026',
    specsHighlight: '',
    phytosanitaryStatus: 'CAPQ Official Certificate Verified',
    buyerFeedback: {
      ar: '',
      en: '',
      fr: '',
      es: '',
      de: '',
      ru: ''
    }
  });
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);

  const handleStartEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({
      ...p,
      varieties: Array.isArray(p.varieties) ? p.varieties.join(', ') : (p.varieties || ''),
      packagingOptions: Array.isArray(p.packagingOptions) ? p.packagingOptions.join(', ') : (p.packagingOptions || ''),
      grades: Array.isArray(p.grades) ? p.grades.join(', ') : (p.grades || ''),
      heroImage: p.heroImage || ''
    });
    setTimeout(() => {
      productFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleStartEditPortfolio = (p: ExportProject) => {
    setEditingPortfolioId(p.id);
    setPortfolioForm(p);
    setTimeout(() => {
      portfolioFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const data = await fetchAdminLeads(password, 'all', '');
      setLeads(data.leads);
      setIsAuthenticated(true);
      loadAnalytics();
      loadProductsData();
      loadPortfolioData();
      loadSettingsData();
    } catch (err: any) {
      setAuthError('Authentication failed. Invalid admin password.');
    }
  };

  const loadSettingsData = async () => {
    try {
      const setts = await fetchCompanySettings();
      if (setts) {
        setSettingsForm(setts);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    try {
      const updated = await saveAdminSettings(password, settingsForm);
      setSettingsForm(updated);
      setSettingsSuccess(true);
      if (onSettingsUpdated) {
        onSettingsUpdated(updated);
      }
      setTimeout(() => setSettingsSuccess(false), 5000);
    } catch (err: any) {
      alert('حدث خطأ أثناء حفظ الإعدادات: ' + (err.message || 'Error'));
    } finally {
      setSavingSettings(false);
    }
  };

  const loadProductsData = async () => {
    try {
      const prods = await fetchProducts();
      setProductsList(prods);
      if (onProductsUpdated) {
        onProductsUpdated(prods);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadPortfolioData = async () => {
    try {
      const ports = await fetchPortfolio();
      setPortfolioList(ports);
    } catch (e) {
      setPortfolioList(initialExportProjects);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) {
      alert('الرجاء كتابة اسم المحصول باللغة العربية');
      return;
    }

    const nameEn = productForm.nameEn || productForm.name;
    const computedSlug = productForm.slug?.trim() || 
      (productForm.nameEn ? productForm.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '') ||
      `crop-${Date.now()}`;

    const varietiesArr = typeof productForm.varieties === 'string'
      ? (productForm.varieties as string).split(',').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(productForm.varieties) ? productForm.varieties : []);

    const packagingArr = typeof productForm.packagingOptions === 'string'
      ? (productForm.packagingOptions as string).split(',').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(productForm.packagingOptions) ? productForm.packagingOptions : []);

    const gradesArr = typeof productForm.grades === 'string'
      ? (productForm.grades as string).split(',').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(productForm.grades) ? productForm.grades : ['First Class / FTI', 'Extra Grade']);

    const heroImg = productForm.heroImage || 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80';
    const imagesArr = Array.isArray(productForm.images) && productForm.images.length > 0
      ? [heroImg, ...productForm.images.filter((img: string) => img !== heroImg)]
      : [heroImg];

    const payload: Partial<Product> = {
      ...productForm,
      id: editingProductId || `prod-${Date.now()}`,
      name: productForm.name,
      nameEn,
      slug: computedSlug,
      heroImage: heroImg,
      images: imagesArr,
      varieties: varietiesArr,
      packagingOptions: packagingArr,
      grades: gradesArr,
      moq: productForm.moq || '1 Container (FCL ~24 Tons)',
    };

    try {
      await saveAdminProduct(password, payload);
      alert(editingProductId ? 'تم تحديث المحصول بنجاح!' : 'تمت إضافة المحصول الجديد بنجاح إلى دليل المنتجات!');
      setEditingProductId(null);
      setProductForm({
        name: '',
        nameEn: '',
        slug: '',
        category: 'Vegetables',
        heroImage: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80',
        exportWindow: '',
        hsCode: '',
        moq: '1 Container (FCL ~24 Tons)',
        varieties: [],
        grades: ['First Class / FTI', 'Extra Grade'],
        packagingOptions: []
      });
      loadProductsData();
    } catch (err: any) {
      alert('حدث خطأ أثناء حفظ المحصول: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`هل أنت تأكد من رغبتك في حذف محصول "${name}"؟`)) return;
    try {
      await deleteAdminProduct(password, id);
      alert('تم حذف المحصول بنجاح.');
      loadProductsData();
    } catch (err: any) {
      alert('فشل حذف المحصول: ' + err.message);
    }
  };

  const buildProductWhatsAppUrl = (whatsappNumber: string, product: Product, targetLang: Language) => {
    const pName = targetLang === 'ar' ? product.name : product.nameEn || product.name;
    const varieties = product.varieties?.join(', ') || '-';
    const sizes = product.sizes?.join(', ') || '-';
    const packaging = Array.isArray(product.packagingOptions) ? product.packagingOptions.join(', ') : (product.packagingOptions || '-');
    const moq = product.moq || product.MOQ || '1x40ft FCL Reefer';
    const season = product.exportWindow || 'Active Export Season';

    const domain = settingsForm?.websiteUrl || 'avialink.com';
    const text = `🌱 *AVIALINK Fresh Agricultural Export - ${pName}*\n\n` +
      `📦 *Product:* ${pName} (${product.nameEn})\n` +
      `🌿 *Varieties:* ${varieties}\n` +
      `📏 *Sizes/Calibers:* ${sizes}\n` +
      `📦 *Packaging:* ${packaging}\n` +
      `🚢 *MOQ:* ${moq}\n` +
      `📅 *Season:* ${season}\n` +
      `📋 *HS Code:* ${product.hsCode || '-'}\n\n` +
      `🌐 *Full Specs & Shipments:* https://${domain}/products/${product.slug}`;

    const cleanNum = whatsappNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
  };

  const handleCopyProductSummary = (product: Product) => {
    const pName = lang === 'ar' ? product.name : product.nameEn || product.name;
    const varieties = product.varieties?.join(', ') || '-';
    const sizes = product.sizes?.join(', ') || '-';
    const packaging = Array.isArray(product.packagingOptions) ? product.packagingOptions.join(', ') : (product.packagingOptions || '-');
    const summary = `Product: ${pName} (${product.nameEn})\nHS Code: ${product.hsCode || '-'}\nSeason: ${product.exportWindow || '-'}\nVarieties: ${varieties}\nSizes: ${sizes}\nPackaging: ${packaging}\nMOQ: ${product.moq || product.MOQ || '-'}`;
    navigator.clipboard.writeText(summary);
    setCopiedProduct(true);
    setTimeout(() => setCopiedProduct(false), 3000);
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioForm.title || !portfolioForm.cropName) {
      alert('الرجاء كتابة عنوان الشحنة واسم المحصول');
      return;
    }

    const payload = {
      ...portfolioForm,
      id: editingPortfolioId || `proj-${Date.now()}`,
      categoryLabel: {
        ar: 'مشروع مصدّر',
        en: 'Export Project',
        fr: 'Projet d’exportation',
        es: 'Proyecto de exportación',
        de: 'Exportprojekt',
        ru: 'Экспортный проект'
      }
    };

    try {
      await saveAdminPortfolio(password, payload);
      alert(editingPortfolioId ? 'تم تحديث سابقة الأعمال بنجاح!' : 'تمت إضافة الشحنة بنجاح لسجل سابقة الأعمال!');
      setEditingPortfolioId(null);
      setPortfolioForm({
        title: '',
        category: 'europe',
        destination: '',
        port: '',
        volumeTonnes: 1000,
        containerCount: 40,
        cropName: '',
        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80',
        completionDate: '2026',
        specsHighlight: '',
        phytosanitaryStatus: 'CAPQ Official Certificate Verified',
        buyerFeedback: { ar: '', en: '', fr: '', es: '', de: '', ru: '' }
      });
      loadPortfolioData();
    } catch (err: any) {
      alert('حدث خطأ أثناء حفظ الشحنة: ' + err.message);
    }
  };

  const handleDeletePortfolio = async (id: string, title: string) => {
    if (!confirm(`هل أنت تأكد من رغبتك في حذف شحنة "${title}" من سابقة الأعمال؟`)) return;
    try {
      await deleteAdminPortfolio(password, id);
      alert('تم حذف الشحنة من سابقة الأعمال بنجاح.');
      loadPortfolioData();
    } catch (err: any) {
      alert('فشل حذف الشحنة: ' + err.message);
    }
  };

  const loadLeads = async () => {
    if (!isAuthenticated) return;
    setLoadingLeads(true);
    try {
      const data = await fetchAdminLeads(password, statusFilter, searchTerm);
      setLeads(data.leads);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLeads(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await fetchAnalytics();
      setAnalyticsData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadLeads();
    }
  }, [statusFilter, searchTerm, isAuthenticated]);

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    try {
      await updateLeadStatus(password, leadId, newStatus);
      loadLeads();
    } catch (err) {
      alert('Failed to update lead status');
    }
  };

  const handleExportCSV = async () => {
    try {
      // A short-lived, single-use token is minted first (sent via a normal
      // authenticated header request) so the real admin password never has to
      // travel inside a URL that a new browser tab opens.
      const token = await requestExportToken(password);
      window.open(`/api/admin/leads/export-csv?token=${encodeURIComponent(token)}`, '_blank');
    } catch (err) {
      alert('Failed to prepare CSV export. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A1A14] flex items-center justify-center p-4 text-white" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="bg-[#12241C] border border-white/10 p-8 rounded-3xl w-full max-w-md space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#0A1A14] border border-[#C5A059]/40 rounded-2xl flex items-center justify-center mx-auto text-[#C5A059]">
              <Lock className="w-6 h-6 text-[#C5A059]" />
            </div>
            <h1 className="text-2xl font-bold font-display text-white">{tA.loginTitle}</h1>
            <p className="text-xs text-white/60">
              {tA.loginSubtitle}
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-2xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{tA.authFailed}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                {tA.passwordLabel}
              </label>
              <input
                type="password"
                required
                placeholder={tA.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A1A14] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#C5A059] hover:bg-white text-[#0A1A14] font-bold py-3 rounded-full text-xs uppercase tracking-wider transition-all"
            >
              {tA.loginBtn}
            </button>

            <button
              type="button"
              onClick={onBackToSite}
              className="w-full text-center text-xs text-white/50 hover:text-white flex items-center justify-center gap-1 pt-2"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              <span>{tA.backToSite}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1A14] text-white pt-24 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-[#12241C] border border-white/5 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">
              {tA.badge}
            </span>
            <h1 className="text-2xl font-bold font-display text-white mt-0.5">
              {tA.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-full transition-colors"
            >
              {tA.viewSite}
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-200 text-xs font-bold rounded-full flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{tA.signOut}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('leads')}
            className={`text-xs font-bold flex items-center gap-2 transition-all rounded-full px-4 py-2 ${
              activeTab === 'leads'
                ? 'bg-[#C5A059] text-[#0A1A14]'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{tA.tabLeads} ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`text-xs font-bold flex items-center gap-2 transition-all rounded-full px-4 py-2 ${
              activeTab === 'products'
                ? 'bg-[#C5A059] text-[#0A1A14]'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>{tA.tabProducts} ({productsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`text-xs font-bold flex items-center gap-2 transition-all rounded-full px-4 py-2 ${
              activeTab === 'portfolio'
                ? 'bg-[#C5A059] text-[#0A1A14]'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{tA.tabPortfolio} ({portfolioList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`text-xs font-bold flex items-center gap-2 transition-all rounded-full px-4 py-2 ${
              activeTab === 'analytics'
                ? 'bg-[#C5A059] text-[#0A1A14]'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{tA.tabAnalytics}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`text-xs font-bold flex items-center gap-2 transition-all rounded-full px-4 py-2 ${
              activeTab === 'settings'
                ? 'bg-[#C5A059] text-[#0A1A14]'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{tA.tabSettings}</span>
          </button>

          {/* CMS DYNAMIC SITE CONTENT TABS */}
          <button
            onClick={() => setActiveTab('exhibitions')}
            className={`text-xs font-bold flex items-center gap-2 transition-all rounded-full px-4 py-2 ${
              activeTab === 'exhibitions'
                ? 'bg-[#C5A059] text-[#0A1A14]'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{isRtl ? 'المعارض والأخبار' : 'Exhibitions & News'} ({siteContentState.exhibitions?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('figures')}
            className={`text-xs font-bold flex items-center gap-2 transition-all rounded-full px-4 py-2 ${
              activeTab === 'figures'
                ? 'bg-[#C5A059] text-[#0A1A14]'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{isRtl ? 'أرقام وإحصائيات المجموعة' : 'Key Figures'} ({siteContentState.figures?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('pillars')}
            className={`text-xs font-bold flex items-center gap-2 transition-all rounded-full px-4 py-2 ${
              activeTab === 'pillars'
                ? 'bg-[#C5A059] text-[#0A1A14]'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isRtl ? 'الركائز الاستراتيجية الخمس' : 'Strategic Pillars'} ({siteContentState.pillars?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('protocols')}
            className={`text-xs font-bold flex items-center gap-2 transition-all rounded-full px-4 py-2 ${
              activeTab === 'protocols'
                ? 'bg-[#C5A059] text-[#0A1A14]'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isRtl ? 'بروتوكولات الجودة والفرز' : 'Quality Protocols'} ({siteContentState.protocols?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcement')}
            className={`text-xs font-bold flex items-center gap-2 transition-all rounded-full px-4 py-2 ${
              activeTab === 'announcement'
                ? 'bg-[#C5A059] text-[#0A1A14]'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>{isRtl ? 'شريط الإعلانات العاجلة' : 'Announcement Bar'} {siteContentState.announcement?.enabled ? '🟢' : '⚪'}</span>
          </button>

          <button
            onClick={() => setActiveTab('csr')}
            className={`text-xs font-bold flex items-center gap-2 transition-all rounded-full px-4 py-2 ${
              activeTab === 'csr'
                ? 'bg-[#C5A059] text-[#0A1A14]'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>{isRtl ? 'المسؤولية المجتمعية (CSR)' : 'CSR & Commitments'}</span>
          </button>
        </div>

        {/* TAB 1: LEADS MANAGEMENT */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            
            {/* Filters Bar */}
            <div className="bg-[#12241C] border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#0A1A14] border border-white/10 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="all">{tA.allStatuses}</option>
                  <option value="new">{tA.statusNew}</option>
                  <option value="contacted">{tA.statusContacted}</option>
                  <option value="qualified">{tA.statusQualified}</option>
                  <option value="closed">{tA.statusClosed}</option>
                </select>

                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-white/40" />
                  <input
                    type="text"
                    placeholder={tA.searchLeadsPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadLeads}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs"
                  title="Refresh leads list"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingLeads ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleExportCSV}
                  className="bg-[#C5A059] hover:bg-white text-[#0A1A14] text-xs font-bold py-2 px-4 rounded-full flex items-center gap-1.5 uppercase tracking-wider transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{tA.exportCsv}</span>
                </button>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-[#12241C] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              {leads.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-xs">
                  {tA.noLeads}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0A1A14] text-white/50 border-b border-white/10">
                      <tr>
                        <th className="p-4">{tA.colDate}</th>
                        <th className="p-4">{tA.colBuyer}</th>
                        <th className="p-4">{tA.colCountry}</th>
                        <th className="p-4">{tA.colProduct}</th>
                        <th className="p-4">{tA.colVolume}</th>
                        <th className="p-4">{tA.colPort}</th>
                        <th className="p-4">{tA.colStatus}</th>
                        <th className="p-4">{tA.colActions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leads.map((l) => (
                        <tr key={l.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-4 text-white/50 whitespace-nowrap">
                            {new Date(l.submittedAt).toLocaleDateString()} {new Date(l.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-4 font-semibold text-white">
                            <button
                              onClick={() => setViewingLead(l)}
                              className="text-left group-hover:text-[#C5A059] transition-colors font-bold block"
                            >
                              {l.fullName}
                            </button>
                            <div className="text-[11px] text-[#C5A059] font-normal">{l.company} ({l.email})</div>
                          </td>
                          <td className="p-4 text-white/80">{l.country}</td>
                          <td className="p-4 text-[#C5A059] font-bold">{l.productInterest}</td>
                          <td className="p-4 text-white font-bold">{l.quantity} {l.quantityUnit}</td>
                          <td className="p-4 text-white/70">{l.destinationPort || '-'}</td>
                          <td className="p-4">
                            <select
                              value={l.status}
                              onChange={(e) => handleStatusUpdate(l.id, e.target.value)}
                              className="bg-[#0A1A14] border border-white/10 text-[11px] rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-[#C5A059]"
                            >
                              <option value="new">{tA.statusNew}</option>
                              <option value="contacted">{tA.statusContacted}</option>
                              <option value="qualified">{tA.statusQualified}</option>
                              <option value="closed">{tA.statusClosed}</option>
                            </select>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <button
                              onClick={() => setViewingLead(l)}
                              className="bg-[#C5A059]/15 hover:bg-[#C5A059] text-[#E2BC74] hover:text-[#0A1A14] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs active:scale-95 shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{tA.viewLeadBtn}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Detailed Lead Modal with Registered WhatsApp Feature */}
            {viewingLead && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={() => setViewingLead(null)}
              >
                <div 
                  className="bg-[#0F241A] border border-[#C5A059]/40 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  {/* Modal Header */}
                  <div className="p-5 sm:p-6 bg-[#091710] border-b border-white/10 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-[#C5A059]/20 text-[#E2BC74] px-2.5 py-0.5 rounded-full border border-[#C5A059]/30">
                          {viewingLead.id}
                        </span>
                        <span className="text-xs text-white/50 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(viewingLead.submittedAt).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                        {tA.leadModalTitle}
                      </h3>
                    </div>
                    <button
                      onClick={() => setViewingLead(null)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                      aria-label={tA.closeModal}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
                    {/* Buyer & Company Info */}
                    <div className="bg-[#07130E] border border-white/10 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5 border-b border-white/10 pb-2">
                        <Users className="w-3.5 h-3.5" />
                        <span>{tA.buyerProfileSection}</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white">
                        <div>
                          <span className="text-white/50 block mb-0.5">{tA.colBuyer}:</span>
                          <span className="font-bold text-sm text-white">{viewingLead.fullName}</span>
                        </div>
                        <div>
                          <span className="text-white/50 block mb-0.5">Company:</span>
                          <span className="font-semibold text-white">{viewingLead.company}</span>
                        </div>
                        <div>
                          <span className="text-white/50 block mb-0.5">{tA.colCountry}:</span>
                          <span className="font-medium text-white">{viewingLead.country}</span>
                        </div>
                        <div>
                          <span className="text-white/50 block mb-0.5">Email:</span>
                          <a href={`mailto:${viewingLead.email}`} className="text-[#C5A059] hover:underline font-medium break-all">
                            {viewingLead.email}
                          </a>
                        </div>
                        <div>
                          <span className="text-white/50 block mb-0.5">Phone:</span>
                          <a href={`tel:${viewingLead.phone}`} className="text-white hover:text-[#C5A059] font-medium" dir="ltr">
                            {viewingLead.phone}
                          </a>
                        </div>
                        <div>
                          <span className="text-white/50 block mb-0.5">{tA.updateStatusLabel}</span>
                          <select
                            value={viewingLead.status}
                            onChange={(e) => {
                              const updated = e.target.value;
                              handleStatusUpdate(viewingLead.id, updated);
                              setViewingLead({ ...viewingLead, status: updated as any });
                            }}
                            className="bg-[#12241C] border border-white/20 text-xs rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-[#C5A059] font-medium"
                          >
                            <option value="new">{tA.statusNew}</option>
                            <option value="contacted">{tA.statusContacted}</option>
                            <option value="qualified">{tA.statusQualified}</option>
                            <option value="closed">{tA.statusClosed}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Crop Specs */}
                    <div className="bg-[#07130E] border border-white/10 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5 border-b border-white/10 pb-2">
                        <Box className="w-3.5 h-3.5" />
                        <span>{tA.specsSection}</span>
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="text-white/50 block mb-0.5">{tA.colProduct}:</span>
                          <span className="font-bold text-[#E2BC74] text-sm">{viewingLead.productInterest}</span>
                        </div>
                        <div>
                          <span className="text-white/50 block mb-0.5">Variety:</span>
                          <span className="text-white font-medium">{viewingLead.variety || '-'}</span>
                        </div>
                        <div>
                          <span className="text-white/50 block mb-0.5">Grade:</span>
                          <span className="text-white font-medium">{viewingLead.grade || '-'}</span>
                        </div>
                        <div>
                          <span className="text-white/50 block mb-0.5">Size / Caliber:</span>
                          <span className="text-white font-medium">{viewingLead.size || '-'}</span>
                        </div>
                        <div>
                          <span className="text-white/50 block mb-0.5">{tA.colVolume}:</span>
                          <span className="text-white font-bold">{viewingLead.quantity} {viewingLead.quantityUnit}</span>
                        </div>
                        <div>
                          <span className="text-white/50 block mb-0.5">Packaging:</span>
                          <span className="text-white font-medium">{viewingLead.preferredPackaging || '-'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Logistics & Shipping */}
                    <div className="bg-[#07130E] border border-white/10 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5 border-b border-white/10 pb-2">
                        <Globe className="w-3.5 h-3.5" />
                        <span>{tA.logisticsSection}</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="text-white/50 block mb-0.5">Incoterm:</span>
                          <span className="font-bold text-white uppercase">{viewingLead.incoterm || '-'}</span>
                        </div>
                        <div>
                          <span className="text-white/50 block mb-0.5">{tA.colPort}:</span>
                          <span className="text-white font-medium">{viewingLead.destinationPort || '-'}</span>
                        </div>
                        <div>
                          <span className="text-white/50 block mb-0.5">Target Shipment Date:</span>
                          <span className="text-white font-medium">{viewingLead.preferredShipmentDate || '-'}</span>
                        </div>
                      </div>
                      {viewingLead.shippingNotes && (
                        <div className="pt-2 border-t border-white/5 text-white/80">
                          <span className="text-white/50 block mb-0.5">Shipping / Transit Notes:</span>
                          <p className="bg-[#0A1A14] p-2.5 rounded-xl border border-white/5 font-mono text-[11px] leading-relaxed">
                            {viewingLead.shippingNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Buyer Message / Notes */}
                    {viewingLead.message && (
                      <div className="bg-[#07130E] border border-white/10 rounded-2xl p-4 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5 border-b border-white/10 pb-2">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{tA.notesSection}</span>
                        </h4>
                        <p className="text-white/80 bg-[#0A1A14] p-3 rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed">
                          {viewingLead.message}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Modal Footer / Direct WhatsApp Transmission */}
                  <div className="p-4 sm:p-5 bg-[#091710] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* 1. Forward to Site's Registered WhatsApp */}
                      <a
                        href={buildCompanyWhatsAppUrl(settingsForm.whatsappNumber || '+201000000000', viewingLead, lang)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-98"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{tA.sendToCompanyWa}</span>
                      </a>

                      {/* 2. Message Buyer Directly on WhatsApp */}
                      <a
                        href={buildBuyerWhatsAppUrl(viewingLead, lang)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{tA.chatWithBuyerWa}</span>
                      </a>

                      {/* 3. Copy Order Summary */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(formatRFQForWhatsApp(viewingLead, lang));
                          setCopiedLead(true);
                          setTimeout(() => setCopiedLead(false), 2500);
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                      >
                        {copiedLead ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLead ? tA.copiedText : tA.copyLeadDetails}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setViewingLead(null)}
                      className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors"
                    >
                      {tA.closeModal}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Add / Edit Product Form */}
            <div ref={productFormRef} className={`bg-[#12241C] border ${editingProductId ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30' : 'border-[#C5A059]/30'} rounded-3xl p-6 shadow-xl space-y-6 transition-all`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                    {editingProductId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{editingProductId ? tA.editProductTitle : tA.addProductTitle}</span>
                      {editingProductId && (
                        <span className="bg-[#C5A059]/20 text-[#C5A059] text-[10px] px-2.5 py-0.5 rounded-full border border-[#C5A059]/40">
                          {tA.editingNotice || 'وضع التعديل'}
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-white/60">
                      {tA.productSub}
                    </p>
                  </div>
                </div>

                {editingProductId && (
                  <button
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm({
                        name: '',
                        nameEn: '',
                        slug: '',
                        category: 'Citrus',
                        heroImage: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80',
                        exportWindow: '',
                        hsCode: '',
                        moq: '1 Container (FCL ~24 Tons)',
                        varieties: [],
                        grades: ['First Class / FTI', 'Extra Grade'],
                        packagingOptions: []
                      });
                    }}
                    className="text-xs text-red-400 hover:text-red-300 font-bold bg-red-950/40 border border-red-800/50 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{tA.cancelEdit}</span>
                  </button>
                )}
              </div>

              {/* AI Spec Generator Assistance Widget */}
              <div className="bg-gradient-to-r from-[#0A1A14] to-[#122B20] border border-[#C5A059]/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#C5A059] font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-[#E2BC74]" />
                    <span>مساعد الذكاء الاصطناعي لكتابة المنتجات والمواصفات (AI Product Spec Assistant)</span>
                  </div>
                  <span className="text-[10px] text-[#E2BC74] bg-[#C5A059]/10 px-2.5 py-0.5 rounded-full border border-[#C5A059]/30 font-semibold">
                    Gemini AI
                  </span>
                </div>
                <p className="text-[11px] text-white/70">
                  اكتب اسم المحصول أو الفاكهة/الخضار المراد إضافته، وسيقوم الذكاء الاصطناعي بتوليد الاسم الدقيق بالعربية والإنجليزية، كود الـ HS Code الجمركي، أشهر موسم التصدير، الأصناف، التعبئة، والدرجات، واشتراطات الحفظ المبرد تلقائياً.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="مثال: مانجو فص عويس / Egyptian Fresh Strawberries / الفلفل الألوان..."
                    value={aiPromptInput}
                    onChange={(e) => setAiPromptInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleGenerateProductWithAI(); } }}
                    className="flex-1 bg-[#050D09] border border-[#C5A059]/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateProductWithAI}
                    disabled={generatingWithAi}
                    className="bg-[#C5A059] hover:bg-[#E2BC74] disabled:opacity-50 text-[#0A1A14] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap"
                  >
                    {generatingWithAi ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>جاري استخراج البيانات...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>توليد البيانات بالذكاء الاصطناعي</span>
                      </>
                    )}
                  </button>
                </div>
                {aiGenerateError && (
                  <p className="text-red-400 text-[11px] font-semibold bg-red-950/40 border border-red-800/40 p-2 rounded-lg">
                    ⚠️ {aiGenerateError}
                  </p>
                )}
              </div>

              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelNameAr}</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: البرتقال الفالنسيا المصري"
                    value={productForm.name || ''}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelNameEn}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Egyptian Valencia Oranges"
                    value={productForm.nameEn || ''}
                    onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelCategory}</label>
                  <select
                    value={productForm.category || 'Citrus'}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Citrus">Citrus (موالح)</option>
                    <option value="Roots">Roots & Tubers (درنيات وجذور)</option>
                    <option value="Vegetables">Fresh Vegetables (خضروات طازجة)</option>
                    <option value="Fruits">Tropical Fruits (فواكه)</option>
                    <option value="Herbs">Herbs & Spices (أعشاب)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelSeason}</label>
                  <input
                    type="text"
                    placeholder="Dec - May / ديسمبر حتى مايو"
                    value={productForm.exportWindow || ''}
                    onChange={(e) => setProductForm({ ...productForm, exportWindow: e.target.value })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelHsCode}</label>
                  <input
                    type="text"
                    placeholder="0805.10"
                    value={productForm.hsCode || ''}
                    onChange={(e) => setProductForm({ ...productForm, hsCode: e.target.value })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelMoq || 'الحد الأدنى للطلب (MOQ)'}</label>
                  <input
                    type="text"
                    placeholder="1 Container (FCL ~24 Tons)"
                    value={productForm.moq || ''}
                    onChange={(e) => setProductForm({ ...productForm, moq: e.target.value })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 md:col-span-3">
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelVarieties || 'الأصناف (مفصولة بفواصل)'}</label>
                  <input
                    type="text"
                    placeholder="Valencia, Navel, Baladi, Salustiana"
                    value={Array.isArray(productForm.varieties) ? productForm.varieties.join(', ') : (productForm.varieties || '')}
                    onChange={(e) => setProductForm({ ...productForm, varieties: e.target.value as any })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 md:col-span-3">
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelPackaging || 'خيارات التعبئة والكراتين (مفصولة بفواصل)'}</label>
                  <input
                    type="text"
                    placeholder="Telescopic Carton 15kg, Open Top 10kg, Plastic Box 8kg"
                    value={Array.isArray(productForm.packagingOptions) ? productForm.packagingOptions.join(', ') : (productForm.packagingOptions || '')}
                    onChange={(e) => setProductForm({ ...productForm, packagingOptions: e.target.value as any })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* Direct File Image Upload */}
                <ImageUploadField
                  label={tA.labelImage || 'صورة المحصول الرئيسية'}
                  value={productForm.heroImage || ''}
                  onChange={(url) => setProductForm({ ...productForm, heroImage: url })}
                  btnText={tA.uploadDeviceBtn}
                  password={password}
                />

                {/* Direct Multiple File Images Upload */}
                <MultiImageUploadField
                  label="صور إضافية للمنتج (معرض الصور)"
                  value={productForm.images || []}
                  onChange={(urls) => setProductForm({ ...productForm, images: urls })}
                  password={password}
                />

                <div className="col-span-1 sm:col-span-2 md:col-span-3 pt-2">
                  <button
                    type="submit"
                    className="bg-[#C5A059] hover:bg-white text-[#0A1A14] font-bold py-3.5 px-8 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 w-full sm:w-auto"
                  >
                    {editingProductId ? tA.btnUpdateProduct : tA.btnSaveProduct}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Products List */}
            <div className="bg-[#12241C] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center justify-between">
                <span>{tA.currentProductsList} ({productsList.length})</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productsList.map((p) => (
                  <div key={p.id} className={`bg-[#0A1A14] border ${editingProductId === p.id ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-white/10'} rounded-2xl p-4 flex gap-4 items-center transition-all`}>
                    <img src={p.heroImage} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-bold text-white text-xs truncate">{p.name}</h3>
                      <p className="text-[11px] text-[#C5A059] truncate">{p.nameEn}</p>
                      <p className="text-[10px] text-white/50">{p.exportWindow || 'Active Season'}</p>
                    </div>

                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setViewingProduct(p)}
                        className="p-2 bg-emerald-950/80 hover:bg-emerald-700 text-emerald-300 hover:text-white rounded-xl font-bold transition-all flex items-center gap-1 text-xs cursor-pointer"
                        title={tA.viewProductBtn || 'عرض وتفاصيل'}
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">{tA.viewProductBtn || 'عرض'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartEditProduct(p)}
                        className="p-2 bg-[#C5A059]/20 hover:bg-[#C5A059] text-[#C5A059] hover:text-[#0A1A14] rounded-xl font-bold transition-all flex items-center gap-1 text-xs cursor-pointer"
                        title="تعديل المحصول"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">تعديل</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-2 bg-red-950/80 hover:bg-red-600 text-red-200 hover:text-white rounded-xl font-bold transition-all flex items-center gap-1 text-xs cursor-pointer"
                        title="حذف المحصول"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Product Modal with Specs & WhatsApp Sharing */}
            {viewingProduct && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={() => setViewingProduct(null)}
              >
                <div 
                  className="bg-[#0F241A] border border-[#C5A059]/40 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  {/* Modal Header */}
                  <div className="p-5 sm:p-6 bg-[#091710] border-b border-white/10 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-[#C5A059]/20 text-[#E2BC74] px-2.5 py-0.5 rounded-full border border-[#C5A059]/30">
                          {viewingProduct.category}
                        </span>
                        {viewingProduct.hsCode && (
                          <span className="text-xs text-white/50 font-mono">
                            HS: {viewingProduct.hsCode}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                        <span>{lang === 'ar' ? viewingProduct.name : viewingProduct.nameEn || viewingProduct.name}</span>
                        {lang !== 'ar' && viewingProduct.name && (
                          <span className="text-xs text-white/50 font-normal">({viewingProduct.name})</span>
                        )}
                        {lang === 'ar' && viewingProduct.nameEn && (
                          <span className="text-xs text-white/50 font-normal">({viewingProduct.nameEn})</span>
                        )}
                      </h3>
                    </div>
                    <button
                      onClick={() => setViewingProduct(null)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                      aria-label={tA.closeModal}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
                    {/* Hero Image & Primary Info Card */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start bg-[#07130E] border border-white/10 rounded-2xl p-4">
                      <img 
                        src={viewingProduct.heroImage} 
                        alt={viewingProduct.name} 
                        className="w-full sm:w-36 h-36 rounded-xl object-cover border border-white/10 shrink-0" 
                      />
                      <div className="space-y-2 flex-1 min-w-0 text-white">
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-white/50 block mb-0.5">{tA.labelSeason}:</span>
                            <span className="font-semibold text-[#E2BC74]">{viewingProduct.exportWindow || 'Active Season'}</span>
                          </div>
                          <div>
                            <span className="text-white/50 block mb-0.5">{tA.prodMoqLabel}:</span>
                            <span className="font-semibold text-white">{viewingProduct.moq || viewingProduct.MOQ || '1x40ft FCL Reefer'}</span>
                          </div>
                          <div>
                            <span className="text-white/50 block mb-0.5">HS Code:</span>
                            <span className="font-mono text-white/90">{viewingProduct.hsCode || '-'}</span>
                          </div>
                          <div>
                            <span className="text-white/50 block mb-0.5">Grade:</span>
                            <span className="font-semibold text-white">Class I / Export Standard</span>
                          </div>
                        </div>
                        {viewingProduct.description && (
                          <p className="text-white/70 text-xs leading-relaxed pt-1 border-t border-white/5">
                            {viewingProduct.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Varieties */}
                    <div className="bg-[#07130E] border border-white/10 rounded-2xl p-4 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5 border-b border-white/10 pb-2">
                        <Box className="w-3.5 h-3.5" />
                        <span>{tA.prodVarietiesLabel}</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {viewingProduct.varieties?.map((v) => (
                          <span key={v} className="bg-white/5 border border-white/10 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Sizes & Calibers */}
                    <div className="bg-[#07130E] border border-white/10 rounded-2xl p-4 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5 border-b border-white/10 pb-2">
                        <Award className="w-3.5 h-3.5" />
                        <span>{tA.prodSizesLabel}</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {viewingProduct.sizes?.map((s) => (
                          <span key={s} className="bg-[#12241C] border border-[#C5A059]/30 text-[#E2BC74] px-2.5 py-1 rounded-full text-xs font-mono">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Packaging Options */}
                    <div className="bg-[#07130E] border border-white/10 rounded-2xl p-4 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5 border-b border-white/10 pb-2">
                        <Box className="w-3.5 h-3.5" />
                        <span>{tA.prodPackagingLabel}</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {Array.isArray(viewingProduct.packagingOptions) ? (
                          viewingProduct.packagingOptions.map((pkg, i) => (
                            <span key={i} className="bg-white/5 border border-white/10 text-white/90 px-2.5 py-1 rounded-xl text-xs">
                              {pkg}
                            </span>
                          ))
                        ) : (
                          <span className="text-white/80">{viewingProduct.packagingOptions}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer / WhatsApp & Actions */}
                  <div className="p-4 sm:p-5 bg-[#091710] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* WhatsApp Share Button */}
                      <a
                        href={buildProductWhatsAppUrl(settingsForm.whatsappNumber || '+201000000000', viewingProduct, (lang as Language) || 'ar')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-98"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{tA.shareProductWa}</span>
                      </a>

                      {/* Open Live Product Page */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onNavigateToProduct) {
                            onNavigateToProduct(viewingProduct);
                          } else {
                            window.open(`/products/${viewingProduct.slug}`, '_blank');
                          }
                        }}
                        className="bg-[#12241C] hover:bg-[#1A3326] border border-[#C5A059]/40 text-[#E2BC74] font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{tA.openProductLive}</span>
                      </button>

                      {/* Copy Summary */}
                      <button
                        type="button"
                        onClick={() => handleCopyProductSummary(viewingProduct)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedProduct ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">{tA.copiedText}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{tA.copyProductSummary}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Edit Crop Button */}
                    <button
                      type="button"
                      onClick={() => {
                        handleStartEditProduct(viewingProduct);
                        setViewingProduct(null);
                      }}
                      className="bg-[#C5A059] hover:bg-white text-[#0A1A14] font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{tA.editProductTitle}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PORTFOLIO MANAGEMENT */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8">
            {/* Form */}
            <div ref={portfolioFormRef} className={`bg-[#12241C] border ${editingPortfolioId ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30' : 'border-[#C5A059]/30'} rounded-3xl p-6 shadow-xl space-y-6 transition-all`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                    {editingPortfolioId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{editingPortfolioId ? tA.editPortfolioTitle : tA.addPortfolioTitle}</span>
                      {editingPortfolioId && (
                        <span className="bg-[#C5A059]/20 text-[#C5A059] text-[10px] px-2.5 py-0.5 rounded-full border border-[#C5A059]/40">
                          {tA.editingNotice || 'وضع التعديل'}
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-white/60">
                      {tA.portfolioSub}
                    </p>
                  </div>
                </div>

                {editingPortfolioId && (
                  <button
                    onClick={() => {
                      setEditingPortfolioId(null);
                      setPortfolioForm({
                        title: '',
                        category: 'europe',
                        destination: '',
                        port: '',
                        volumeTonnes: 1000,
                        containerCount: 40,
                        cropName: '',
                        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80',
                        completionDate: '2026',
                        specsHighlight: '',
                        phytosanitaryStatus: 'CAPQ Official Certificate Verified',
                        buyerFeedback: { ar: '', en: '', fr: '', es: '', de: '', ru: '' }
                      });
                    }}
                    className="text-xs text-red-400 hover:text-red-300 font-bold bg-red-950/40 border border-red-800/50 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{tA.cancelEdit}</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleSavePortfolio} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelProjTitle}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Export fleet of Valencia Oranges to Rotterdam"
                    value={portfolioForm.title || ''}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelCropName}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Valencia Oranges Grade A"
                    value={portfolioForm.cropName || ''}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, cropName: e.target.value })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelDest}</label>
                  <input
                    type="text"
                    placeholder="e.g. Netherlands / Germany"
                    value={portfolioForm.destination || ''}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, destination: e.target.value })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelPort}</label>
                  <input
                    type="text"
                    placeholder="Port of Rotterdam"
                    value={portfolioForm.port || ''}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, port: e.target.value })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelVolumeTonnes}</label>
                  <input
                    type="number"
                    value={portfolioForm.volumeTonnes || 1000}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, volumeTonnes: Number(e.target.value) })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelContainerCount}</label>
                  <input
                    type="number"
                    value={portfolioForm.containerCount || 40}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, containerCount: Number(e.target.value) })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* Direct File Image Upload for Portfolio */}
                <ImageUploadField
                  label={tA.labelProjImage || 'صورة الشحنة / المشحون'}
                  value={portfolioForm.image || ''}
                  onChange={(url) => setPortfolioForm({ ...portfolioForm, image: url })}
                  btnText={tA.uploadDeviceBtn}
                  password={password}
                />

                {/* Direct Multiple File Images Upload for Portfolio */}
                <MultiImageUploadField
                  label="صور إضافية للشحنة / العملية (سابقة الأعمال)"
                  value={portfolioForm.images || []}
                  onChange={(urls) => {
                    const updatedForm: any = { ...portfolioForm, images: urls };
                    if (urls.length > 0 && !portfolioForm.image) {
                      updatedForm.image = urls[0];
                    }
                    setPortfolioForm(updatedForm);
                  }}
                  password={password}
                />

                <div className="col-span-1 sm:col-span-2 md:col-span-3">
                  <label className="block text-white/70 font-semibold mb-1">{tA.labelFeedback}</label>
                  <input
                    type="text"
                    placeholder="Quote from importer..."
                    value={portfolioForm.buyerFeedback?.ar || ''}
                    onChange={(e) => setPortfolioForm({
                      ...portfolioForm,
                      buyerFeedback: {
                        ar: e.target.value,
                        en: e.target.value,
                        fr: e.target.value,
                        es: e.target.value,
                        de: e.target.value,
                        ru: e.target.value
                      }
                    })}
                    className="w-full bg-[#0A1A14] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 md:col-span-3 pt-2">
                  <button
                    type="submit"
                    className="bg-[#C5A059] hover:bg-white text-[#0A1A14] font-bold py-3.5 px-8 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 w-full sm:w-auto"
                  >
                    {editingPortfolioId ? tA.btnUpdatePortfolio : tA.btnSavePortfolio}
                  </button>
                </div>
              </form>
            </div>

            {/* List */}
            <div className="bg-[#12241C] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white">{tA.currentPortfolioList} ({portfolioList.length})</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolioList.map((item) => (
                  <div key={item.id} className={`bg-[#0A1A14] border ${editingPortfolioId === item.id ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-white/10'} rounded-2xl p-4 flex gap-4 items-start transition-all`}>
                    <img src={item.image} alt={item.title} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-white/10" />
                    <div className="flex-1 min-w-0 space-y-1 text-xs">
                      <h3 className="font-bold text-white text-xs leading-snug">{item.title}</h3>
                      <p className="text-[11px] text-[#C5A059] font-semibold">{item.cropName} • {item.volumeTonnes} T ({item.containerCount} FCL)</p>
                      <p className="text-[10px] text-white/50">{item.port} ({item.destination})</p>
                    </div>

                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEditPortfolio(item)}
                        className="p-2 bg-[#C5A059]/20 hover:bg-[#C5A059] text-[#C5A059] hover:text-[#0A1A14] rounded-xl font-bold transition-all flex items-center gap-1 text-xs"
                        title="تعديل الشحنة"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">تعديل</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePortfolio(item.id, item.title)}
                        className="p-2 bg-red-950/80 hover:bg-red-600 text-red-200 hover:text-white rounded-xl font-bold transition-all flex items-center gap-1 text-xs"
                        title="حذف الشحنة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE ANALYTICS */}
        {activeTab === 'analytics' && analyticsData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs">
              <div className="bg-[#12241C] border border-white/5 p-6 rounded-3xl space-y-1 shadow-xl">
                <span className="text-white/50">{tA.totalPageViews}</span>
                <p className="text-3xl font-bold font-display text-white">{analyticsData.pageViews}</p>
              </div>

              <div className="bg-[#12241C] border border-white/5 p-6 rounded-3xl space-y-1 shadow-xl">
                <span className="text-white/50">{tA.rfqStarts}</span>
                <p className="text-3xl font-bold font-display text-[#C5A059]">{analyticsData.rfqStarts}</p>
              </div>

              <div className="bg-[#12241C] border border-white/5 p-6 rounded-3xl space-y-1 shadow-xl">
                <span className="text-white/50">{tA.totalLeads}</span>
                <p className="text-3xl font-bold font-display text-white">{analyticsData.totalLeadsLogged}</p>
              </div>

              <div className="bg-[#12241C] border border-white/5 p-6 rounded-3xl space-y-1 shadow-xl">
                <span className="text-white/50">{tA.specDownloads}</span>
                <p className="text-3xl font-bold font-display text-[#C5A059]">{analyticsData.specDownloads}</p>
              </div>
            </div>

            <div className="p-5 bg-[#12241C] border border-[#C5A059]/30 rounded-2xl text-xs text-[#C5A059]">
              {tA.integrityNote}
            </div>
          </div>
        )}

        {/* TAB 5: SITE SETTINGS & MAIN DATA */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <form onSubmit={handleSaveSettings} className="space-y-8">
              
              {/* Header Box */}
              <div className="bg-[#12241C] border border-white/5 p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#C5A059]/10 text-[#C5A059]">
                        <Sliders className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                        {tA.settingsTitle}
                      </h2>
                    </div>
                    <p className="text-xs text-white/50 max-w-2xl">
                      {tA.settingsSub}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-6 py-3 bg-[#C5A059] hover:bg-[#d4b068] text-[#0A1A14] text-xs font-bold rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {savingSettings ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{tA.btnSaveSettings}</span>
                  </button>
                </div>

                {settingsSuccess && (
                  <div className="p-4 bg-emerald-950/80 border border-emerald-700/60 rounded-2xl text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{tA.settingsSavedSuccess}</span>
                  </div>
                )}
              </div>

              {/* Section 1: Contact Details & Floating WhatsApp */}
              <div className="bg-[#12241C] border border-white/5 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Phone className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {tA.phoneLabel} & WhatsApp
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-2">
                    <label className="text-white/70 font-semibold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{tA.phoneLabel}</span>
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      placeholder="(03) 11345627"
                      className="w-full bg-[#0A1A14] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059]"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 font-semibold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{tA.hotlineLabel}</span>
                    </label>
                    <input
                      type="text"
                      value={settingsForm.hotline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hotline: e.target.value })}
                      placeholder="+20 10 933 933 55"
                      className="w-full bg-[#0A1A14] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059]"
                      dir="ltr"
                    />
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      {tA.hotlineExplanation}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 font-semibold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{tA.emailLabel}</span>
                    </label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      placeholder="export@avialink.com"
                      className="w-full bg-[#0A1A14] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059]"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 font-semibold flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{tA.websiteUrlLabel}</span>
                    </label>
                    <input
                      type="text"
                      value={settingsForm.websiteUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, websiteUrl: e.target.value })}
                      placeholder="avialink.com"
                      className="w-full bg-[#0A1A14] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059]"
                      dir="ltr"
                    />
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      {tA.websiteUrlExplanation}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 font-semibold flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{tA.whatsappNumberLabel}</span>
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      placeholder="+20 100 000 0000"
                      className="w-full bg-[#0A1A14] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059]"
                      dir="ltr"
                    />
                    <p className="text-[11px] text-emerald-400/90 leading-relaxed font-medium">
                      {tA.whatsappNumberExplanation}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 font-semibold flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{tA.whatsappLinkLabel}</span>
                    </label>
                    <input
                      type="url"
                      value={settingsForm.whatsappLink}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappLink: e.target.value })}
                      placeholder="https://wa.me/201000000000"
                      className="w-full bg-[#0A1A14] border border-emerald-500/30 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-emerald-400"
                      dir="ltr"
                    />
                    <span className="text-[11px] text-white/40 block">
                      هذا الرابط سيتم فتحه فوراً عند النقر على الزر العائم للواتساب في كامل صفحات الموقع.
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Written Address & Live Location */}
              <div className="bg-[#12241C] border border-white/5 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      {tA.locationArLabel} & Live Google Maps
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoTranslateLocation}
                    disabled={translatingLocation}
                    className="bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#E2BC74] border border-[#C5A059]/40 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    {translatingLocation ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    )}
                    <span>ترجمة العنوان تلقائياً للغات الست (Auto-Translate)</span>
                  </button>
                </div>

                <div className="space-y-5 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-white/70 font-semibold block">
                        {tA.locationArLabel}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.locationText.ar}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm,
                          locationText: { ...settingsForm.locationText, ar: e.target.value }
                        })}
                        placeholder="المنطقة اللوجستية الزراعية، طريق مصر إسكندرية الصحراوي، مصر"
                        className="w-full bg-[#0A1A14] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059]"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-white/70 font-semibold block">
                        {tA.locationEnLabel}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.locationText.en}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm,
                          locationText: { ...settingsForm.locationText, en: e.target.value }
                        })}
                        placeholder="Agricultural Logistics Hub, Cairo-Alexandria Desert Road, Egypt"
                        className="w-full bg-[#0A1A14] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059]"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{tA.liveLocationUrlLabel}</span>
                      </span>
                      {settingsForm.liveLocationUrl && (
                        <a
                          href={settingsForm.liveLocationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C5A059] hover:underline text-[11px]"
                        >
                          معاينة الرابط ↗
                        </a>
                      )}
                    </label>
                    <input
                      type="url"
                      value={settingsForm.liveLocationUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, liveLocationUrl: e.target.value })}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full bg-[#0A1A14] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059]"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Social Media Links */}
              <div className="bg-[#12241C] border border-white/5 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Share2 className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {tA.socialSectionTitle}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                  <div className="space-y-2">
                    <label className="text-white/70 font-semibold flex items-center gap-1.5">
                      <span>Facebook URL</span>
                    </label>
                    <input
                      type="url"
                      value={settingsForm.socialLinks.facebook}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, facebook: e.target.value }
                      })}
                      placeholder="https://facebook.com/avialink"
                      className="w-full bg-[#0A1A14] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059]"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 font-semibold flex items-center gap-1.5">
                      <span>X (Twitter) URL</span>
                    </label>
                    <input
                      type="url"
                      value={settingsForm.socialLinks.twitter}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, twitter: e.target.value }
                      })}
                      placeholder="https://x.com/avialink"
                      className="w-full bg-[#0A1A14] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059]"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 font-semibold flex items-center gap-1.5">
                      <span>LinkedIn URL</span>
                    </label>
                    <input
                      type="url"
                      value={settingsForm.socialLinks.linkedin}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/company/avialink"
                      className="w-full bg-[#0A1A14] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059]"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 font-semibold flex items-center gap-1.5">
                      <span>Instagram URL</span>
                    </label>
                    <input
                      type="url"
                      value={settingsForm.socialLinks.instagram}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, instagram: e.target.value }
                      })}
                      placeholder="https://instagram.com/avialink"
                      className="w-full bg-[#0A1A14] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059]"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 font-semibold flex items-center gap-1.5">
                      <span>YouTube URL</span>
                    </label>
                    <input
                      type="url"
                      value={settingsForm.socialLinks.youtube}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...settingsForm.socialLinks, youtube: e.target.value }
                      })}
                      placeholder="https://youtube.com/@avialink"
                      className="w-full bg-[#0A1A14] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C5A059]"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-8 py-3.5 bg-[#C5A059] hover:bg-[#d4b068] text-[#0A1A14] text-xs font-bold rounded-full flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                >
                  {savingSettings ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{tA.btnSaveSettings}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* CMS TAB 6: EXHIBITIONS & NEWS */}
        {activeTab === 'exhibitions' && (
          <ExhibitionsManager
            adminPassword={password}
            exhibitions={siteContentState.exhibitions || []}
            onExhibitionsUpdated={(updated) => handleSiteContentUpdated({ ...siteContentState, exhibitions: updated })}
            lang={lang}
          />
        )}

        {/* CMS TAB 7: GROUP IN FIGURES */}
        {activeTab === 'figures' && (
          <FiguresManager
            adminPassword={password}
            figures={siteContentState.figures || []}
            onFiguresUpdated={(updated) => handleSiteContentUpdated({ ...siteContentState, figures: updated })}
            lang={lang}
          />
        )}

        {/* CMS TAB 8: THE FIVE STRATEGIC PILLARS */}
        {activeTab === 'pillars' && (
          <PillarsManager
            adminPassword={password}
            pillars={siteContentState.pillars || []}
            onPillarsUpdated={(updated) => handleSiteContentUpdated({ ...siteContentState, pillars: updated })}
            lang={lang}
          />
        )}

        {/* CMS TAB 9: QUALITY & SIZING PROTOCOLS */}
        {activeTab === 'protocols' && (
          <ProtocolsManager
            adminPassword={password}
            protocols={siteContentState.protocols || []}
            onProtocolsUpdated={(updated) => handleSiteContentUpdated({ ...siteContentState, protocols: updated })}
            lang={lang}
          />
        )}

        {/* CMS TAB 10: TOP ANNOUNCEMENT BANNER */}
        {activeTab === 'announcement' && (
          <AnnouncementManager
            adminPassword={password}
            announcement={siteContentState.announcement}
            onAnnouncementUpdated={(updated) => handleSiteContentUpdated({ ...siteContentState, announcement: updated })}
            lang={lang}
          />
        )}

        {/* CMS TAB 11: CSR & SUSTAINABILITY COMMITMENTS */}
        {activeTab === 'csr' && (
          <CSRManager
            adminPassword={password}
            csr={siteContentState.csr}
            onCSRUpdated={(updated) => handleSiteContentUpdated({ ...siteContentState, csr: updated })}
            lang={lang}
          />
        )}

      </div>
    </div>
  );
};
