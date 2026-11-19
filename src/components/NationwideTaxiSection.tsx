import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, Car, Clock, Luggage } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NationwideTaxiSectionProps {
  onNavigateToBooking?: () => void;
  onNavigateToServices?: () => void;
}

export const NationwideTaxiSection: React.FC<NationwideTaxiSectionProps> = ({
  onNavigateToBooking,
  onNavigateToServices,
}) => {
  const { t } = useLanguage();
  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 my-14 sm:my-20">
      <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-[0_8px_30px_rgba(0,19,49,0.05)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Chauffeur in Mercedes Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-slate-100 border border-slate-200 group aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/4.5]">
              <img
                src="/chauffeur-mercedes.png"
                alt="Chauffeur in Mercedes-Benz Taxi mooo - Landelijke Dekking"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Quality Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-white/60 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#001331] text-[#FFB800] flex items-center justify-center shrink-0 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#001331]">{t('nationwide.certified')}</div>
                  <div className="text-[11px] text-gray-500">{t('nationwide.certifiedSub')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Rewritten Content */}
          <div className="lg:col-span-7 space-y-5">
            {/* Header Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-[#EBF2FC] text-[#0B2559] text-xs font-extrabold uppercase tracking-wider">
                {t('nationwide.badge')}
              </span>
              <span className="h-1 w-8 bg-[#FFB800] rounded-full"></span>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#07152B] leading-tight">
              {t('nationwide.title')}
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t('nationwide.p1')}
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t('nationwide.p2')}{' '}
              <button
                type="button"
                onClick={onNavigateToServices}
                className="text-[#0B2559] font-bold underline underline-offset-2 hover:text-[#001331] cursor-pointer"
              >
                {t('nationwide.servicesLink')}
              </button>
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="flex items-center gap-2 text-xs text-gray-700 font-semibold bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-[#0B2559] shrink-0" />
                <span>Altijd 100% privé-taxi • 100% Private taxi</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 font-semibold bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                <Luggage className="w-4 h-4 text-[#0B2559] shrink-0" />
                <span>Gratis bagage • Free luggage included</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 font-semibold bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                <Clock className="w-4 h-4 text-[#0B2559] shrink-0" />
                <span>Gratis annuleren tot 2u • Free cancel 2h</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 font-semibold bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                <Car className="w-4 h-4 text-[#0B2559] shrink-0" />
                <span>Mercedes-Benz sedans & taxibussen</span>
              </div>
            </div>

            {/* Action Buttons */}
            {onNavigateToBooking && (
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={onNavigateToBooking}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B2559] hover:bg-[#001331] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>{t('nationwide.bookBtn')}</span>
                  <ArrowRight className="w-4 h-4 text-[#FFB800]" />
                </button>

                {onNavigateToServices && (
                  <button
                    onClick={onNavigateToServices}
                    className="text-xs sm:text-sm font-bold text-[#0B2559] hover:underline cursor-pointer"
                  >
                    {t('nationwide.servicesBtn')} →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
