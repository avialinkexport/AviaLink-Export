import React, { useState } from 'react';
import { MetricFigureItem } from '../../types';
import { saveAdminSiteContent } from '../../lib/api';
import { TrendingUp, Plus, Trash2, CheckCircle, BarChart3, Globe, ShieldCheck, Snowflake } from 'lucide-react';
import { Language } from '../../lib/i18n';

interface FiguresManagerProps {
  adminPassword: string;
  figures: MetricFigureItem[];
  onFiguresUpdated: (updated: MetricFigureItem[]) => void;
  lang?: Language;
}

export const FiguresManager: React.FC<FiguresManagerProps> = ({
  adminPassword,
  figures,
  onFiguresUpdated,
  lang = 'ar'
}) => {
  const isAr = lang === 'ar';
  const [items, setItems] = useState<MetricFigureItem[]>([...figures]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (index: number, field: keyof MetricFigureItem, val: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const handleAdd = () => {
    const newItem: MetricFigureItem = {
      id: `fig-${Date.now()}`,
      value: '+10,000 طن',
      label: 'مؤشر أداء جديد',
      labelEn: 'New Performance Metric',
      sub: 'تفاصيل إضافية عن المؤشر',
      subEn: 'Additional operational metric details',
      iconName: 'TrendingUp'
    };
    setItems([...items, newItem]);
  };

  const handleRemove = (index: number) => {
    if (items.length <= 1) {
      alert(isAr ? 'يجب الاحتفاظ بمؤشر واحد على الأقل' : 'At least one metric card must remain');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await saveAdminSiteContent(adminPassword, { figures: items });
      onFiguresUpdated(res.figures);
      setSuccessMsg(isAr ? 'تم حفظ مؤشرات وأرقام المجموعة بنجاح وتحديثها في الصفحة الرئيسية!' : 'Metrics updated successfully on the home page!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update figures');
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
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{isAr ? 'إحصائيات وأرقام المجموعة (Group in Figures)' : 'Group Key Metrics Management'}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isAr ? 'تعديل بطاقات الأرقام والمؤشرات الرئيسية للموقع' : 'Manage Figures & Performance KPIs'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isAr 
              ? 'تحكم كامل في الأرقام البارزة (كميات التصدير السنوية، عدد الأسواق والوجهات، معايير التتبع، قدرات التبريد).'
              : 'Edit annual tonnage, export corridors, traceability compliance, and pre-cooling capacities displayed on the homepage.'}
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>{isAr ? 'إضافة بطاقة رقم جديدة' : 'Add Metric Card'}</span>
        </button>
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

      {/* Grid of Metric Cards to edit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-[#C5A059]">
                #{idx + 1} {isAr ? 'بطاقة إحصائية' : 'Metric Card'}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                title={isAr ? 'حذف هذه البطاقة' : 'Remove this card'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Value AR & EN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'القيمة الرقمية بالعربية (مثال: +35 دولة / +45,000 طن) *' : 'Highlighted Value (Arabic) *'}
                </label>
                <input
                  type="text"
                  value={item.value}
                  onChange={e => handleChange(idx, 'value', e.target.value)}
                  placeholder="+45,000 طن"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-base font-bold focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'القيمة الرقمية باللغات الأجنبية (مثال: +35 Countries / +45,000 Tons)' : 'Highlighted Value (English / Global)'}
                </label>
                <input
                  type="text"
                  value={item.valueEn || ''}
                  onChange={e => handleChange(idx, 'valueEn', e.target.value)}
                  placeholder="+45,000 Tons"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-base font-bold focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Label AR & EN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'عنوان المؤشر (بالعربية)' : 'Label (Arabic)'}
                </label>
                <input
                  type="text"
                  value={item.label}
                  onChange={e => handleChange(idx, 'label', e.target.value)}
                  placeholder="حجم التصدير السنوي"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'عنوان المؤشر (بالإنجليزية)' : 'Label (English)'}
                </label>
                <input
                  type="text"
                  value={item.labelEn || ''}
                  onChange={e => handleChange(idx, 'labelEn', e.target.value)}
                  placeholder="Annual Export Volume"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Sub AR & EN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'شرح فرعي (بالعربية)' : 'Subtitle (Arabic)'}
                </label>
                <input
                  type="text"
                  value={item.sub}
                  onChange={e => handleChange(idx, 'sub', e.target.value)}
                  placeholder="بطاطا حلوة، بصل، موالح، بطاطس نصف مقلية"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'شرح فرعي (بالإنجليزية)' : 'Subtitle (English)'}
                </label>
                <input
                  type="text"
                  value={item.subEn || ''}
                  onChange={e => handleChange(idx, 'subEn', e.target.value)}
                  placeholder="Sweet potatoes, onions, citrus, french fries"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-3.5 bg-gradient-to-r from-[#C5A059] to-[#9E7D3B] text-slate-950 font-bold rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          <span>{isAr ? 'حفظ وتحديث جميع الأرقام والمؤشرات في الموقع' : 'Save & Publish All Metrics'}</span>
        </button>
      </div>
    </div>
  );
};
