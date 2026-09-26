import React, { useState } from 'react';
import { StrategicPillarItem } from '../../types';
import { saveAdminSiteContent } from '../../lib/api';
import { Shield, CheckCircle, Plus, Trash2, Layers } from 'lucide-react';
import { Language } from '../../lib/i18n';

interface PillarsManagerProps {
  adminPassword: string;
  pillars: StrategicPillarItem[];
  onPillarsUpdated: (updated: StrategicPillarItem[]) => void;
  lang?: Language;
}

export const PillarsManager: React.FC<PillarsManagerProps> = ({
  adminPassword,
  pillars,
  onPillarsUpdated,
  lang = 'ar'
}) => {
  const isAr = lang === 'ar';
  const [items, setItems] = useState<StrategicPillarItem[]>([...pillars]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (index: number, field: keyof StrategicPillarItem, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const handleAddPoint = (pillarIdx: number) => {
    const updated = [...items];
    const pts = [...(updated[pillarIdx].points || [])];
    pts.push(isAr ? 'نقطة معيارية جديدة' : 'New standard check');
    updated[pillarIdx] = { ...updated[pillarIdx], points: pts };
    setItems(updated);
  };

  const handleRemovePoint = (pillarIdx: number, ptIdx: number) => {
    const updated = [...items];
    const pts = [...(updated[pillarIdx].points || [])].filter((_, i) => i !== ptIdx);
    updated[pillarIdx] = { ...updated[pillarIdx], points: pts };
    setItems(updated);
  };

  const handlePointChange = (pillarIdx: number, ptIdx: number, val: string) => {
    const updated = [...items];
    const pts = [...(updated[pillarIdx].points || [])];
    pts[ptIdx] = val;
    updated[pillarIdx] = { ...updated[pillarIdx], points: pts };
    setItems(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await saveAdminSiteContent(adminPassword, { pillars: items });
      onPillarsUpdated(res.pillars);
      setSuccessMsg(isAr ? 'تم حفظ وتحديث الركائز الاستراتيجية الخمس بنجاح!' : 'Strategic pillars updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update pillars');
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
            <Layers className="w-3.5 h-3.5" />
            <span>{isAr ? 'الركائز الاستراتيجية الخمس (The 5 Strategic Pillars)' : 'Five Strategic Pillars Management'}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isAr ? 'تعديل محاور القوة التشغيلية والركائز الخمس' : 'Edit Strategic & Operational Pillars'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isAr 
              ? 'تعديل نصوص الركائز الخمس (التحكم في المنبع، الجودة والمطابقة، اللوجستيات وسلسلة التبريد، شراكات التوزيع، والمرونة).'
              : 'Customize the narrative and operational proof points for each of the 5 core pillars.'}
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

      {/* Pillars List */}
      <div className="space-y-6">
        {items.map((pillar, idx) => (
          <div
            key={pillar.number || idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative space-y-5 shadow-xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-black text-[#C5A059]">
                  {pillar.number}
                </span>
                <span className="text-sm font-bold text-white">
                  {pillar.title}
                </span>
              </div>
            </div>

            {/* Titles AR & EN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'عنوان الركيزة (بالعربية) *' : 'Pillar Title (Arabic) *'}
                </label>
                <input
                  type="text"
                  value={pillar.title}
                  onChange={e => handleChange(idx, 'title', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'عنوان الركيزة (بالإنجليزية)' : 'Pillar Title (English)'}
                </label>
                <input
                  type="text"
                  value={pillar.titleEn || ''}
                  onChange={e => handleChange(idx, 'titleEn', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Subtitles / Narratives AR & EN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'النص التفصيلي والشرح (بالعربية)' : 'Narrative & Description (Arabic)'}
                </label>
                <textarea
                  rows={3}
                  value={pillar.subtitle}
                  onChange={e => handleChange(idx, 'subtitle', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isAr ? 'النص التفصيلي والشرح (بالإنجليزية)' : 'Narrative & Description (English)'}
                </label>
                <textarea
                  rows={3}
                  value={pillar.subtitleEn || ''}
                  onChange={e => handleChange(idx, 'subtitleEn', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Operational Check Points */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  {isAr ? 'النقاط التشغيلية المعيارية المعتمدة' : 'Operational Verification Bullet Points'}
                </span>
                <button
                  type="button"
                  onClick={() => handleAddPoint(idx)}
                  className="text-xs text-[#C5A059] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إضافة نقطة' : 'Add Point'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {(pillar.points || []).map((pt, ptIdx) => (
                  <div key={ptIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={pt}
                      onChange={e => handlePointChange(idx, ptIdx, e.target.value)}
                      className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePoint(idx, ptIdx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
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
          <span>{isAr ? 'حفظ وتحديث الركائز الاستراتيجية بالكامل' : 'Save & Publish All 5 Pillars'}</span>
        </button>
      </div>
    </div>
  );
};
