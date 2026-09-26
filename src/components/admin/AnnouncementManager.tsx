import React, { useState } from 'react';
import { AnnouncementBanner } from '../../types';
import { saveAdminSiteContent } from '../../lib/api';
import { Megaphone, CheckCircle, BellRing, Sparkles } from 'lucide-react';
import { Language } from '../../lib/i18n';

interface AnnouncementManagerProps {
  adminPassword: string;
  announcement: AnnouncementBanner;
  onAnnouncementUpdated: (updated: AnnouncementBanner) => void;
  lang?: Language;
}

export const AnnouncementManager: React.FC<AnnouncementManagerProps> = ({
  adminPassword,
  announcement,
  onAnnouncementUpdated,
  lang = 'ar'
}) => {
  const isAr = lang === 'ar';
  const [form, setForm] = useState<AnnouncementBanner>({ ...announcement });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await saveAdminSiteContent(adminPassword, { announcement: form });
      onAnnouncementUpdated(res.announcement);
      setSuccessMsg(isAr ? 'تم تحديث شريط الإعلانات العاجلة بنجاح وتطبيقه على الموقع فوراً!' : 'Announcement bar updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update announcement');
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
            <Megaphone className="w-3.5 h-3.5" />
            <span>{isAr ? 'إدارة شريط الإعلانات العاجلة وأعلى الموقع' : 'Top Announcement Banner Management'}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isAr ? 'التحكم في شريط الإعلانات أعلى الموقع' : 'Top Banner Alert & Announcements'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isAr 
              ? 'تفعيل أو إخفاء شريط الإعلانات في أعلى الموقع، لتنبيه الزوار بموسم تصديري جديد، أو المشاركة في معرض قادم، أو شهادة جودة جديدة.'
              : 'Turn on/off and customize the announcement bar placed above the navbar for trade alerts and fair invitations.'}
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

      {/* Live Preview Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {isAr ? 'معاينة حية لشريط الإعلان' : 'Live Banner Preview'}
        </h4>
        
        {form.enabled ? (
          <div className="bg-gradient-to-r from-[#997328] via-[#C5A059] to-[#8C6418] text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="bg-slate-950 text-[#F3D78F] text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-black">
                {form.badge || 'إعلان'}
              </span>
              <span>{form.text || 'نص الإعلان...'}</span>
            </div>
            {form.linkUrl && (
              <span className="underline text-[11px] font-black">
                {form.linkText || 'التفاصيل'} →
              </span>
            )}
          </div>
        ) : (
          <div className="p-4 bg-slate-800/60 rounded-xl border border-dashed border-slate-700 text-slate-500 text-xs text-center">
            {isAr ? 'شريط الإعلانات معطل حالياً ولا يظهر للزوار' : 'Announcement banner is currently disabled'}
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Toggle Switch */}
        <div className="flex items-center justify-between p-4 bg-slate-800/60 border border-slate-700 rounded-2xl">
          <div>
            <h4 className="text-sm font-bold text-white">
              {isAr ? 'تفعيل ظهور شريط الإعلانات في الموقع' : 'Enable Announcement Banner'}
            </h4>
            <p className="text-xs text-slate-400">
              {isAr ? 'عند التفعيل، سيظهر الشريط فوراً أعلى جميع صفحات الموقع' : 'When enabled, banner will be visible above the navbar.'}
            </p>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={e => setForm({ ...form, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C5A059]"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Badge AR */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'شارة الإعلان (بالعربية)' : 'Banner Tag (Arabic)'}
            </label>
            <input
              type="text"
              value={form.badge || ''}
              onChange={e => setForm({ ...form, badge: e.target.value })}
              placeholder="معرض فروت لوجستيكا 2026"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Badge EN */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'شارة الإعلان (بالإنجليزية)' : 'Banner Tag (English)'}
            </label>
            <input
              type="text"
              value={form.badgeEn || ''}
              onChange={e => setForm({ ...form, badgeEn: e.target.value })}
              placeholder="Fruit Logistica Berlin 2026"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Text AR */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'نص الإعلان الرئيسي (بالعربية) *' : 'Main Text (Arabic) *'}
            </label>
            <input
              type="text"
              required={form.enabled}
              value={form.text || ''}
              onChange={e => setForm({ ...form, text: e.target.value })}
              placeholder="يسعدنا استقبالكم في جناح أفيا لينك (Hall 2.2 - Stand C-14)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Text EN */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'نص الإعلان الرئيسي (بالإنجليزية)' : 'Main Text (English)'}
            </label>
            <input
              type="text"
              value={form.textEn || ''}
              onChange={e => setForm({ ...form, textEn: e.target.value })}
              placeholder="Meet AviaLink team at Fruit Logistica Berlin (Hall 2.2, Stand C-14)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Link Text AR */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'نص الرابط (بالعربية)' : 'Link Button Text (Arabic)'}
            </label>
            <input
              type="text"
              value={form.linkText || ''}
              onChange={e => setForm({ ...form, linkText: e.target.value })}
              placeholder="احجز موعدك الآن"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Link Text EN */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'نص الرابط (بالإنجليزية)' : 'Link Button Text (English)'}
            </label>
            <input
              type="text"
              value={form.linkTextEn || ''}
              onChange={e => setForm({ ...form, linkTextEn: e.target.value })}
              placeholder="Book B2B Meeting"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Link URL */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'رابط التوجيه (Link Destination URL)' : 'Link Destination URL'}
            </label>
            <input
              type="text"
              value={form.linkUrl || ''}
              onChange={e => setForm({ ...form, linkUrl: e.target.value })}
              placeholder="#news-csr أو رابط خارجي https://..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
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
            <span>{isAr ? 'حفظ وتحديث شريط الإعلانات' : 'Save & Publish Announcement'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
