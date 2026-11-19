import React from 'react';
import { Award, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AboutPreviewSectionProps {
  onNavigateToAbout: () => void;
}

export const AboutPreviewSection: React.FC<AboutPreviewSectionProps> = ({ onNavigateToAbout }) => {
  const { t } = useLanguage();
  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 my-14 sm:my-20">
      <div className="bg-gradient-to-br from-[#001331] via-[#001c44] to-[#00275c] rounded-3xl sm:rounded-[32px] p-6 sm:p-10 lg:p-12 text-white shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#FFB800]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-[#FFB800] text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm border border-white/10">
                {t('about.badge')}
              </span>
              <span className="h-1 w-8 bg-[#FFB800] rounded-full"></span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              {t('about.title')}
            </h2>

            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              {t('about.desc')}
            </p>

            {/* Quick check points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#FFB800] shrink-0" />
                <span className="text-xs sm:text-sm text-blue-100 font-medium">
                  TX-Keurmerk gecertificeerd
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#FFB800] shrink-0" />
                <span className="text-xs sm:text-sm text-blue-100 font-medium">
                  {t('fare.fixedPriceGuaranteed')}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#FFB800] shrink-0" />
                <span className="text-xs sm:text-sm text-blue-100 font-medium">
                  Mercedes-Benz sedans & bussen
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#FFB800] shrink-0" />
                <span className="text-xs sm:text-sm text-blue-100 font-medium">
                  {t('hero.available247')}
                </span>
              </div>
            </div>

            {/* CTA button to dedicated page */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onNavigateToAbout}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFB800] hover:bg-yellow-400 text-[#001331] font-black text-sm shadow-lg shadow-yellow-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{t('about.moreBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Highlights Cards Column */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#FFB800]/20 text-[#FFB800] flex items-center justify-center mx-auto mb-3">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{t('about.stat3')}</div>
              <p className="text-xs text-blue-200 mt-1">{t('about.stat3Label')}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#FFB800]/20 text-[#FFB800] flex items-center justify-center mx-auto mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">99.4%</div>
              <p className="text-xs text-blue-200 mt-1">Punctual & On Time</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 text-center col-span-2">
              <div className="text-2xl font-black text-[#FFB800]">{t('about.stat1')}</div>
              <p className="text-xs text-blue-200 mt-1">{t('about.stat1Label')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
