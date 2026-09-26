import React, { useState } from 'react';
import { ExhibitionItem } from '../../types';
import { saveAdminExhibition, deleteAdminExhibition } from '../../lib/api';
import { Calendar, MapPin, Plus, Edit, Trash2, ExternalLink, Image as ImageIcon, CheckCircle, Tag, Sparkles } from 'lucide-react';
import { Language } from '../../lib/i18n';

interface ExhibitionsManagerProps {
  adminPassword: string;
  exhibitions: ExhibitionItem[];
  onExhibitionsUpdated: (updated: ExhibitionItem[]) => void;
  lang?: Language;
}

export const ExhibitionsManager: React.FC<ExhibitionsManagerProps> = ({
  adminPassword,
  exhibitions,
  onExhibitionsUpdated,
  lang = 'ar'
}) => {
  const isAr = lang === 'ar';

  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState<Partial<ExhibitionItem>>({
    title: '',
    titleEn: '',
    date: '',
    city: '',
    country: '',
    standNumber: '',
    excerpt: '',
    excerptEn: '',
    image: '/crops/sweet_potatoes.jpg',
    category: 'معارض زراعية دولية',
    categoryEn: 'International Trade Show',
    status: 'upcoming',
    externalUrl: ''
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: '',
      titleEn: '',
      date: '',
      city: '',
      country: '',
      standNumber: '',
      excerpt: '',
      excerptEn: '',
      image: '/crops/sweet_potatoes.jpg',
      category: 'معارض زراعية دولية',
      categoryEn: 'International Trade Show',
      status: 'upcoming',
      externalUrl: ''
    });
  };

  const handleEdit = (item: ExhibitionItem) => {
    setEditingId(item.id);
    setForm({ ...item });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من رغبتك في حذف هذا المعرض / الفعالية؟' : 'Are you sure you want to delete this exhibition?')) {
      return;
    }
    setLoading(true);
    try {
      await deleteAdminExhibition(adminPassword, id);
      const updated = exhibitions.filter(e => e.id !== id);
      onExhibitionsUpdated(updated);
      setSuccessMsg(isAr ? 'تم حذف المعرض بنجاح' : 'Exhibition deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error deleting exhibition');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      setErrorMsg(isAr ? 'يرجى إدخال اسم المعرض' : 'Please enter exhibition title');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const payload: Partial<ExhibitionItem> = {
        ...form,
        id: editingId || `exhibit-${Date.now()}`
      };
      const res = await saveAdminExhibition(adminPassword, payload);
      
      let updated: ExhibitionItem[];
      if (editingId) {
        updated = exhibitions.map(e => e.id === editingId ? res : e);
      } else {
        updated = [res, ...exhibitions];
      }
      onExhibitionsUpdated(updated);
      setSuccessMsg(isAr ? 'تم حفظ بيانات المعرض وتطبيقها على الموقع بنجاح!' : 'Exhibition saved successfully and updated on site!');
      resetForm();
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save exhibition');
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
            <Calendar className="w-3.5 h-3.5" />
            <span>{isAr ? 'إدارة المعارض والفعاليات والأخبار' : 'Trade Shows, Events & News Management'}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isAr ? 'التحكم في مشاركات المعارض الدولية والأخبار' : 'International Trade Exhibitions & News'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isAr 
              ? 'إضافة وتعديل فعاليات المعارض كمعرض برلين وجلفود، وتحديد أرقام الأجنحة والتواريخ ليتواصل المستوردون معك مباشرة.'
              : 'Add, update, or remove international produce fairs like Berlin & Gulfood with stand locations, dates, and registration links.'}
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

      {/* Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          {editingId ? (
            <>
              <Edit className="w-5 h-5 text-[#C5A059]" />
              <span>{isAr ? 'تعديل بيانات المعرض' : 'Edit Exhibition Details'}</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 text-[#C5A059]" />
              <span>{isAr ? 'إضافة مشاركة في معرض دولي جديد' : 'Add New Exhibition Participation'}</span>
            </>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title AR */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'اسم المعرض (بالعربية) *' : 'Exhibition Title (Arabic) *'}
              </label>
              <input
                type="text"
                required
                value={form.title || ''}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder={isAr ? 'مثال: معرض فروت لوجستيكا الدولي برلين' : 'e.g. Fruit Logistica Berlin'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Title EN */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'اسم المعرض (بالإنجليزية)' : 'Exhibition Title (English)'}
              </label>
              <input
                type="text"
                value={form.titleEn || ''}
                onChange={e => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g. Fruit Logistica Berlin Global Produce Summit"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'تاريخ المعرض / فترة الانعقاد *' : 'Date / Period *'}
              </label>
              <input
                type="text"
                required
                value={form.date || ''}
                onChange={e => setForm({ ...form, date: e.target.value })}
                placeholder={isAr ? 'مثال: 5 - 7 فبراير 2026' : 'e.g. Feb 5 - 7, 2026'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Stand / Booth Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'رقم الجناح والقاعة (Stand & Hall Number)' : 'Stand & Hall Number'}
              </label>
              <input
                type="text"
                value={form.standNumber || ''}
                onChange={e => setForm({ ...form, standNumber: e.target.value })}
                placeholder="e.g. Hall 2.2 / Stand C-14"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* City & Country */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'المدينة والدولة' : 'City & Country'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={form.city || ''}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder={isAr ? 'المدينة (مثل: برلين)' : 'City (e.g. Berlin)'}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                />
                <input
                  type="text"
                  value={form.country || ''}
                  onChange={e => setForm({ ...form, country: e.target.value })}
                  placeholder={isAr ? 'الدولة (مثل: ألمانيا)' : 'Country (e.g. Germany)'}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Status & Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'حالة المشاركة والتصنيف' : 'Status & Category'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.status || 'upcoming'}
                  onChange={e => setForm({ ...form, status: e.target.value as any })}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="upcoming">{isAr ? 'فعالية قادمة (Upcoming)' : 'Upcoming'}</option>
                  <option value="ongoing">{isAr ? 'تنعقد حالياً (Ongoing)' : 'Ongoing'}</option>
                  <option value="completed">{isAr ? 'انتهت المشاركة (Completed)' : 'Completed'}</option>
                </select>

                <input
                  type="text"
                  value={form.category || ''}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  placeholder={isAr ? 'التصنيف (معارض زراعية)' : 'Category'}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'رابط الصورة (Image URL)' : 'Image URL'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.image || ''}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="/crops/sweet_potatoes.jpg"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {['/crops/sweet_potatoes.jpg', '/crops/onions.jpg', '/crops/oranges.jpg', '/crops/half_fried.jpg'].map(img => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setForm({ ...form, image: img })}
                    className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                      form.image === img ? 'bg-[#C5A059] text-slate-950 font-bold border-[#C5A059]' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {img.split('/').pop()?.replace('.jpg', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* External URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isAr ? 'رابط المعرض أو حجز موعد (Link / Registration URL)' : 'Official Link / Registration URL'}
              </label>
              <input
                type="text"
                value={form.externalUrl || ''}
                onChange={e => setForm({ ...form, externalUrl: e.target.value })}
                placeholder="https://www.fruitlogistica.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* Excerpt AR */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'نبذة وموضوع المشاركة في المعرض (بالعربية) *' : 'Description / Objectives (Arabic) *'}
            </label>
            <textarea
              rows={3}
              required
              value={form.excerpt || ''}
              onChange={e => setForm({ ...form, excerpt: e.target.value })}
              placeholder={isAr ? 'اكتب نبذة عن المعرض وما سيتم استعراضه فيه والاتفاقيات المستهدفة...' : 'Write exhibition overview...'}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Excerpt EN */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isAr ? 'نبذة وموضوع المشاركة (بالإنجليزية)' : 'Description / Objectives (English)'}
            </label>
            <textarea
              rows={3}
              value={form.excerptEn || ''}
              onChange={e => setForm({ ...form, excerptEn: e.target.value })}
              placeholder="English overview of the booth and export products featured..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#C5A059]"
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
              <span>{editingId ? (isAr ? 'حفظ التعديلات' : 'Update Exhibition') : (isAr ? 'إضافة المعرض للموقع' : 'Publish Exhibition')}</span>
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

      {/* Existing List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">
          {isAr ? `المعارض والفعاليات الحالية في الموقع (${exhibitions.length})` : `Current Exhibitions on Website (${exhibitions.length})`}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exhibitions.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#C5A059]/40 transition-all shadow-lg"
            >
              <div className="relative h-44 w-full bg-slate-800">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/80 border border-white/10 text-[11px] font-bold text-[#C5A059]">
                  {item.category}
                </span>

                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                  item.status === 'ongoing' ? 'bg-emerald-500 text-slate-950' :
                  item.status === 'completed' ? 'bg-slate-700 text-slate-300' :
                  'bg-[#C5A059] text-slate-950'
                }`}>
                  {item.status}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#E0C078]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                    {item.standNumber && (
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
                        {item.standNumber}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white leading-snug">
                    {item.title}
                  </h4>

                  {(item.city || item.country) && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{[item.city, item.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-slate-800 hover:bg-[#C5A059] text-slate-300 hover:text-slate-950 rounded-lg transition-colors"
                      title={isAr ? 'تعديل' : 'Edit'}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                      title={isAr ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.externalUrl && (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#C5A059] hover:underline flex items-center gap-1"
                    >
                      <span>{isAr ? 'الرابط' : 'Link'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
