import React, { useState } from 'react';
import { CSRSettings } from '../../types';
import { saveAdminSiteContent } from '../../lib/api';
import { Leaf, CheckCircle, HeartHandshake, ShieldCheck } from 'lucide-react';
import { Language } from '../../lib/i18n';

interface CSRManagerProps {
  adminPassword: string;
  csr: CSRSettings;
  onCSRUpdated: (updated: CSRSettings) => void;
  lang?: Language;
}

export const CSRManager: React.FC<CSRManagerProps> = ({
  adminPassword,
  csr,
  onCSRUpdated,
  lang = 'ar'
}) => {
  const isAr = lang === 'ar';
  const [form, setForm] = useState<CSRSettings>({ ...csr });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await saveAdminSiteContent(adminPassword, { csr: form });
      onCSRUpdated(res.csr);
      setSuccessMsg(isAr ? 'تم حفظ وتحديث ميثاق المسؤولية المجتمعية والبيئية بنجاح!' : 'CSR settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update CSR settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Leaf className="w-3.5 h-3.5" />
            <span>{isAr ? 'المسؤولية المجتمعية والبيئية (CSR & Sustainability)' : 'CSR & Sustainability Management'}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isAr ? 'تعديل التزامات الاستدامة والميثاق البيئي' : 'Edit Sustainability & CSR Commitments'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isAr 
              ? 'تعديل نصوص ميثاق الاستدامة الزراعية، ترشيد الري، تقليل البصمة الكربونية، ودعم المزارعين والعمالة الريفية.'
              : 'Customize environmental stewardship, water management, Sedex/SMETA compliance, and farmer partnership narratives.'}
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
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Badge */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'شارة القسم (بالعربية)' : 'Badge (Arabic)'}
            </label>
            <input
              type="text"
              value={form.badge || ''}
              onChange={e => setForm({ ...form, badge: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'شارة القسم (بالإنجليزية)' : 'Badge (English)'}
            </label>
            <input
              type="text"
              value={form.badgeEn || ''}
              onChange={e => setForm({ ...form, badgeEn: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'عنوان القسم الرئيسي (بالعربية) *' : 'Main Title (Arabic) *'}
            </label>
            <input
              type="text"
              required
              value={form.title || ''}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'عنوان القسم الرئيسي (بالإنجليزية)' : 'Main Title (English)'}
            </label>
            <input
              type="text"
              value={form.titleEn || ''}
              onChange={e => setForm({ ...form, titleEn: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        {/* Subtitle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'الوصف التمهيدي للالتزام (بالعربية)' : 'Intro Narrative (Arabic)'}
            </label>
            <textarea
              rows={2}
              value={form.subtitle || ''}
              onChange={e => setForm({ ...form, subtitle: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'الوصف التمهيدي للالتزام (بالإنجليزية)' : 'Intro Narrative (English)'}
            </label>
            <textarea
              rows={2}
              value={form.subtitleEn || ''}
              onChange={e => setForm({ ...form, subtitleEn: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        {/* Axis 1: Environmental / Agriculture */}
        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Leaf className="w-4 h-4" />
            <span>{isAr ? 'المحور الأول: الزراعة المستدامة وحماية الموارد' : 'Axis 1: Sustainable Agriculture'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'عنوان المحور الأول (بالعربية)' : 'Axis 1 Title (Arabic)'}
              </label>
              <input
                type="text"
                value={form.axis1Title || ''}
                onChange={e => setForm({ ...form, axis1Title: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'عنوان المحور الأول (بالإنجليزية)' : 'Axis 1 Title (English)'}
              </label>
              <input
                type="text"
                value={form.axis1TitleEn || ''}
                onChange={e => setForm({ ...form, axis1TitleEn: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'تفاصيل المحور الأول (بالعربية)' : 'Axis 1 Details (Arabic)'}
              </label>
              <textarea
                rows={3}
                value={form.axis1Desc || ''}
                onChange={e => setForm({ ...form, axis1Desc: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'تفاصيل المحور الأول (بالإنجليزية)' : 'Axis 1 Details (English)'}
              </label>
              <textarea
                rows={3}
                value={form.axis1DescEn || ''}
                onChange={e => setForm({ ...form, axis1DescEn: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </div>

        {/* Axis 2: Social & Farmers */}
        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-[#E0C078] font-bold text-sm">
            <HeartHandshake className="w-4 h-4" />
            <span>{isAr ? 'المحور الثاني: المسؤولية المجتمعية وشراكة المزارعين' : 'Axis 2: Social Responsibility & Farmer Welfare'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'عنوان المحور الثاني (بالعربية)' : 'Axis 2 Title (Arabic)'}
              </label>
              <input
                type="text"
                value={form.axis2Title || ''}
                onChange={e => setForm({ ...form, axis2Title: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'عنوان المحور الثاني (بالإنجليزية)' : 'Axis 2 Title (English)'}
              </label>
              <input
                type="text"
                value={form.axis2TitleEn || ''}
                onChange={e => setForm({ ...form, axis2TitleEn: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'تفاصيل المحور الثاني (بالعربية)' : 'Axis 2 Details (Arabic)'}
              </label>
              <textarea
                rows={3}
                value={form.axis2Desc || ''}
                onChange={e => setForm({ ...form, axis2Desc: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isAr ? 'تفاصيل المحور الثاني (بالإنجليزية)' : 'Axis 2 Details (English)'}
              </label>
              <textarea
                rows={3}
                value={form.axis2DescEn || ''}
                onChange={e => setForm({ ...form, axis2DescEn: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-800">
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
            <span>{isAr ? 'حفظ وتحديث ميثاق المسؤولية المجتمعية والبيئية' : 'Save & Publish CSR Commitments'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
