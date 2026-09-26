import React, { useState } from 'react';
import { DynamicProtocolItem } from '../../types';
import { saveAdminProtocol, deleteAdminProtocol } from '../../lib/api';
import { ShieldCheck, Plus, Trash2, CheckCircle, Edit, Sparkles, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { Language } from '../../lib/i18n';

interface ProtocolsManagerProps {
  adminPassword: string;
  protocols: DynamicProtocolItem[];
  onProtocolsUpdated: (updated: DynamicProtocolItem[]) => void;
  lang?: Language;
}

export const ProtocolsManager: React.FC<ProtocolsManagerProps> = ({
  adminPassword,
  protocols,
  onProtocolsUpdated,
  lang = 'ar'
}) => {
  const isAr = lang === 'ar';
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState<Partial<DynamicProtocolItem>>({
    cropKey: 'sweet_potatoes',
    cropName: 'البطاطا الحلوة المصرية',
    cropNameEn: 'Egyptian Sweet Potatoes',
    badge: 'بروتوكول جودة ومعالجة كيورينج متقدم',
    badgeEn: 'Advanced Curing & Sizing Protocol',
    title: 'بروتوكول المعالجة الحرارية (Curing) والفرز الإلكتروني',
    titleEn: 'Thermal Curing & Optical Sorting Protocol',
    subtitle: 'بروتوكول متكامل لضبط مستويات السكر وشفاء القشرة والفرز حسب المقاييس الأوروبية والخليجية',
    subtitleEn: 'Complete curing and electronic sorting protocol compliant with GlobalG.A.P. standards',
    image: '/crops/sweet_potatoes.jpg',
    criticalLimit: 'فحص متبقيات المبيدات MRL قبل التصدير لكل دفعة بنتيجة عدم رصد (ND)',
    criticalLimitEn: 'Strict MRL compliance tested per lot prior to vessel loading',
    standards: ['GlobalG.A.P. IFA v6', 'BRCGS Food Safety', 'SMETA / Sedex'],
    verifications: ['فحص بصري إلكتروني بنسبة 100%', 'شهادة سلامة الغذاء صادرة مع كل بوليصة'],
    parameters: [
      { label: 'درجة حرارة الكيورينج', value: '29°C - 30°C', note: 'لمدة 5-7 أيام لشفاء القشرة' },
      { label: 'الرطوبة النسبية (RH)', value: '90% - 95%', note: 'تثبيت الرطوبة لمنع التجعد' },
      { label: 'حرارة الحفظ والتبريد', value: '13°C - 15°C', note: 'درجة حرارة الشحن الدائمة' }
    ],
    phases: [
      { phase: '01', title: 'الاستلام والفرز الأولي', desc: 'استبعاد العيوب الميكانيكية والتشوهات الحقلية' },
      { phase: '02', title: 'غرف المعالجة والكيورينج', desc: 'تنشيط شفاء الخدوش السطحية وتحويل النشويات إلى سكريات طبيعية' },
      { phase: '03', title: 'الغسيل والتجفيف والفرز الوزني', desc: 'فرز دقيق حسب الأوزان المطلوبة (S, M, L, XL)' }
    ]
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      cropKey: '',
      cropName: '',
      cropNameEn: '',
      badge: '',
      badgeEn: '',
      title: '',
      titleEn: '',
      subtitle: '',
      subtitleEn: '',
      image: '/crops/sweet_potatoes.jpg',
      criticalLimit: '',
      criticalLimitEn: '',
      standards: [],
      verifications: [],
      parameters: [],
      phases: []
    });
  };

  const handleEdit = (proto: DynamicProtocolItem) => {
    setEditingId(proto.id);
    setForm({ ...proto });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف بروتوكول الجودة هذا؟' : 'Are you sure you want to delete this protocol?')) {
      return;
    }
    setLoading(true);
    try {
      await deleteAdminProtocol(adminPassword, id);
      const updated = protocols.filter(p => p.id !== id);
      onProtocolsUpdated(updated);
      setSuccessMsg(isAr ? 'تم حذف البروتوكول بنجاح' : 'Protocol deleted');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error deleting protocol');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.cropKey) {
      setErrorMsg(isAr ? 'يرجى إدخال عنوان البروتوكول ورمز المحصول' : 'Please provide protocol title and crop key');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const payload: Partial<DynamicProtocolItem> = {
        ...form,
        id: editingId || `proto-${Date.now()}`
      };
      const res = await saveAdminProtocol(adminPassword, payload);
      
      let updated: DynamicProtocolItem[];
      if (editingId) {
        updated = protocols.map(p => p.id === editingId ? res : p);
      } else {
        updated = [...protocols, res];
      }
      onProtocolsUpdated(updated);
      setSuccessMsg(isAr ? 'تم حفظ بروتوكول الجودة وتحديث النافذة التفاعلية في الموقع بنجاح!' : 'Quality protocol updated successfully!');
      resetForm();
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save protocol');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#E0C078] text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAr ? 'إدارة بروتوكولات الجودة الفنية والتدرج الحجمي' : 'Quality Protocols & Technical Sizing'}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isAr ? 'تعديل بروتوكولات الفحص، الكيورينج والفرز الإلكتروني' : 'Manage Quality & Sizing Protocols'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isAr 
              ? 'التحكم في محتوى نوافذ بروتوكول الجودة (المواصفات الفنية، المعالجة الحرارية، محددات الرفض، والشهادات) المتاحة لكل محصول للمستوردين.'
              : 'Add or modify crop protocols opened by the "View Protocol" buttons across the website.'}
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-600/40 rounded-2xl flex items-center gap-3 text-emerald-300 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-950/80 border border-rose-600/40 rounded-2xl text-rose-300 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          {editingId ? (
            <>
              <Edit className="w-5 h-5 text-[#C5A059]" />
              <span>{isAr ? 'تعديل بروتوكول جودة قائم' : 'Edit Existing Protocol'}</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 text-[#C5A059]" />
              <span>{isAr ? 'إضافة بروتوكول جودة جديد لمحصول' : 'Add New Quality Protocol'}</span>
            </>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Crop Key & Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'رمز المحصول الفريد (Crop Identifier Key) *' : 'Crop Key *'}
              </label>
              <input
                type="text"
                required
                value={form.cropKey || ''}
                onChange={e => setForm({ ...form, cropKey: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                placeholder="sweet_potatoes, onions, oranges, french_fries"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'اسم المحصول (بالعربية) *' : 'Crop Name (Arabic) *'}
              </label>
              <input
                type="text"
                required
                value={form.cropName || ''}
                onChange={e => setForm({ ...form, cropName: e.target.value })}
                placeholder="البطاطا الحلوة المصرية"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Protocol Title AR */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'عنوان البروتوكول (بالعربية) *' : 'Protocol Title (Arabic) *'}
              </label>
              <input
                type="text"
                required
                value={form.title || ''}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="بروتوكول الكيورينج والفرز الإلكتروني"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Protocol Title EN */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'عنوان البروتوكول (بالإنجليزية)' : 'Protocol Title (English)'}
              </label>
              <input
                type="text"
                value={form.titleEn || ''}
                onChange={e => setForm({ ...form, titleEn: e.target.value })}
                placeholder="Thermal Curing & Sizing Protocol"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'صورة الغلاف للمحصول' : 'Cover Image'}
              </label>
              <input
                type="text"
                value={form.image || ''}
                onChange={e => setForm({ ...form, image: e.target.value })}
                placeholder="/crops/sweet_potatoes.jpg"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Critical Limit AR */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'المحدد الحرج للسلامة ونقطة الرقابة (Critical Limit)' : 'Critical Control Limit (Arabic)'}
              </label>
              <input
                type="text"
                value={form.criticalLimit || ''}
                onChange={e => setForm({ ...form, criticalLimit: e.target.value })}
                placeholder="فحص متبقيات المبيدات MRL قبل التصدير لكل دفعة"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* Subtitle AR */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'الوصف الشامل للبروتوكول (بالعربية)' : 'Comprehensive Protocol Overview (Arabic)'}
            </label>
            <textarea
              rows={2}
              value={form.subtitle || ''}
              onChange={e => setForm({ ...form, subtitle: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-gradient-to-r from-[#C5A059] to-[#9E7D3B] text-slate-950 font-bold rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span>{editingId ? (isAr ? 'حفظ تعديلات البروتوكول' : 'Update Protocol') : (isAr ? 'حفظ وإضافة البروتوكول' : 'Publish Protocol')}</span>
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors"
              >
                {isAr ? 'إلغاء التعديل' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Protocols List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">
          {isAr ? `بروتوكولات الجودة الحالية في النظام (${protocols.length})` : `Active Protocols (${protocols.length})`}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {protocols.map((proto) => (
            <div
              key={proto.id || proto.cropKey}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between space-y-4 shadow-xl hover:border-[#C5A059]/40 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#E0C078] text-[11px] font-bold uppercase font-mono">
                    {proto.cropKey}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">
                    {proto.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {proto.cropName}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(proto)}
                    className="p-2 bg-slate-800 hover:bg-[#C5A059] text-slate-300 hover:text-slate-950 rounded-lg transition-colors"
                    title={isAr ? 'تعديل' : 'Edit'}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proto.id)}
                    className="p-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                    title={isAr ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {proto.subtitle}
              </p>

              {proto.criticalLimit && (
                <div className="p-3 bg-amber-950/40 border border-amber-600/30 rounded-xl flex items-center gap-2 text-amber-300 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span className="line-clamp-1">{proto.criticalLimit}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
