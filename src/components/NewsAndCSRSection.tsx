import React, { useState } from 'react';
import { Language, GROUPE_BROUSSE_TRANSLATIONS } from '../lib/i18n';
import { ExhibitionItem, CSRSettings } from '../types';
import { Newspaper, Leaf, Users, ArrowRight, ArrowLeft, Download, CheckCircle, ShieldCheck, X } from 'lucide-react';

interface NewsAndCSRSectionProps {
  lang: Language;
  onOpenRFQ?: () => void;
  exhibitions?: ExhibitionItem[];
  csr?: CSRSettings;
}

export const NewsAndCSRSection: React.FC<NewsAndCSRSectionProps> = ({
  lang,
  onOpenRFQ,
  exhibitions,
  csr
}) => {
  const tNews = GROUPE_BROUSSE_TRANSLATIONS[lang]?.news || GROUPE_BROUSSE_TRANSLATIONS.en.news;
  const tCSR = GROUPE_BROUSSE_TRANSLATIONS[lang]?.commitments || GROUPE_BROUSSE_TRANSLATIONS.en.commitments;
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [showCharterModal, setShowCharterModal] = useState(false);

  // Map exhibitions from CMS if available
  const newsItems = (exhibitions && exhibitions.length > 0)
    ? exhibitions.map(ex => ({
        title: isRtl ? ex.title : (ex.titleEn || ex.title),
        tag: isRtl ? (ex.badge || ex.location) : (ex.badgeEn || ex.locationEn || ex.badge || ex.location),
        date: ex.dates,
        image: ex.imageUrl || '/crops/carrots.jpg',
        excerpt: isRtl ? ex.description : (ex.descriptionEn || ex.description),
        fullArticle: isRtl ? ex.description : (ex.descriptionEn || ex.description)
      }))
    : tNews.items;

  // CSR data from CMS if available
  const csrTitle = csr ? (isRtl ? csr.title : (csr.titleEn || csr.title)) : tCSR.title;
  const csrSubtitle = csr ? (isRtl ? csr.subtitle : (csr.subtitleEn || csr.subtitle)) : tCSR.subtitle;
  const csrBadge = csr ? (isRtl ? csr.badge : (csr.badgeEn || csr.badge)) : tCSR.badge;
  const csrAxis1Title = csr ? (isRtl ? csr.axis1Title : (csr.axis1TitleEn || csr.axis1Title)) : tCSR.axis1Title;
  const csrAxis1Desc = csr ? (isRtl ? csr.axis1Desc : (csr.axis1DescEn || csr.axis1Desc)) : tCSR.axis1Desc;
  const csrAxis2Title = csr ? (isRtl ? csr.axis2Title : (csr.axis2TitleEn || csr.axis2Title)) : tCSR.axis2Title;
  const csrAxis2Desc = csr ? (isRtl ? csr.axis2Desc : (csr.axis2DescEn || csr.axis2Desc)) : tCSR.axis2Desc;

  return (
    <section id="news-csr" className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* ================= Part 1: News & Trade Events ================= */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#E0C078] text-xs font-semibold tracking-wider uppercase">
              <Newspaper className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{tNews.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {tNews.title}
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              {tNews.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {newsItems.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-[#C5A059]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#C5A059]/10 cursor-pointer"
                onClick={() => setSelectedNews(item)}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />
                  
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#E0C078] tracking-wider uppercase">
                    {item.tag}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-slate-400">{item.date}</span>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#F3D78F] transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-[#C5A059] group-hover:underline">
                    <span>{tNews.readMore}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= Part 2: CSR Commitments (Nos Engagements) ================= */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-800 border border-slate-700/80 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-10">
            
            {/* Header */}
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>{csrBadge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                {csrTitle}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {csrSubtitle}
              </p>
            </div>

            {/* The 2 Strategic Axes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Axis 1: Sustainable Agriculture */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 hover:border-emerald-500/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-600/30 flex items-center justify-center text-emerald-400 mb-2">
                  <Leaf className="w-6 h-6" />
                </div>

                <h4 className="text-lg font-bold text-white">
                  {csrAxis1Title}
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {csrAxis1Desc}
                </p>
              </div>

              {/* Axis 2: Societal & Farmer Well-being */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 hover:border-[#C5A059]/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#E0C078] mb-2">
                  <Users className="w-6 h-6" />
                </div>

                <h4 className="text-lg font-bold text-white">
                  {csrAxis2Title}
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {csrAxis2Desc}
                </p>
              </div>

            </div>

            {/* CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>GlobalGAP • SMETA Sedex • ISO 22000 • Zero Residue MRL Policy</span>
              </div>

              <button
                onClick={() => setShowCharterModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#d8b368] text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg hover:shadow-[#C5A059]/20 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{tCSR.ctaBtn}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 sm:p-8 space-y-5 shadow-2xl text-white">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-56 w-full rounded-xl overflow-hidden relative">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-slate-900/90 border border-white/10 text-xs font-bold text-[#E0C078]">
                {selectedNews.tag}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400">{selectedNews.date}</span>
              <h3 className="text-xl font-bold text-white">{selectedNews.title}</h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedNews.excerpt}
            </p>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-semibold"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSR Charter Modal */}
      {showCharterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 p-6 sm:p-8 space-y-5 shadow-2xl text-white">
            <button
              onClick={() => setShowCharterModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-600/30 flex items-center justify-center text-emerald-400">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ar' ? 'وثيقة ميثاق الاستدامة والمسؤولية المجتمعية (RSE)' : 'Sustainability & CSR Charter'}
                </h3>
                <p className="text-xs text-slate-400">AVIALINK Corporate Agricultural Governance</p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Water Stewardship:</strong> 100% precision drip irrigation with soil moisture sensors across all partner farms.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Zero Waste Packaging:</strong> Heavy-duty corrugated cartons crafted from 100% recycled fibers.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Ethical Sourcing:</strong> Regular SMETA social audits ensuring fair wages and youth farmer empowerment.</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <span className="text-xs text-slate-400">Doc ID: AVL-CSR-2026-v2</span>
              <button
                onClick={() => setShowCharterModal(false)}
                className="px-5 py-2 rounded-lg bg-[#C5A059] hover:bg-[#d8b368] text-slate-950 text-xs sm:text-sm font-bold"
              >
                {lang === 'ar' ? 'تم، إغلاق' : 'Done, Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
