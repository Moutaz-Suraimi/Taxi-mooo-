import React from 'react';
import {
  ShieldCheck,
  Award,
  Clock,
  Car,
  Users,
  ChevronRight,
  Phone,
  HeartHandshake,
  Star,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigateToBooking: () => void;
  onOpenContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateHome,
  onNavigateToBooking,
  onOpenContact,
}) => {
  const { t } = useLanguage();
  return (
    <div className="w-full">
      {/* Top Banner / Hero */}
      <section className="relative bg-gradient-to-r from-[#001331] via-[#001a3f] to-[#00255c] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-200/80 mb-6">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#FFB800] transition cursor-pointer flex items-center gap-1"
            >
              {t('nav.home')}
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#FFB800] font-bold">{t('about.page.breadcrumb')}</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#FFB800] text-xs font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('about.page.badge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {t('about.page.h1')}
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
              {t('about.page.sub')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-16 sm:space-y-24">
        {/* Section 1: Story */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#EBF2FC] text-[#00255c] text-xs font-extrabold uppercase tracking-wider">
                {t('about.page.ourStory')}
              </span>
              <span className="h-1 w-8 bg-[#FFD500] rounded-full"></span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#07152B] tracking-tight">
              {t('about.page.storyTitle')}
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t('about.page.storyP1')}
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t('about.page.storyP2')}
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#EBF2FC] border border-slate-200">
                <div className="font-bold text-[#00255c] text-base mb-1">{t('about.page.promiseTitle')}</div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t('about.page.promiseText')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#EBF2FC] border border-slate-200">
                <div className="font-bold text-[#00255c] text-base mb-1">{t('about.page.driversTitle')}</div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t('about.page.driversText')}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-blue-100">
              <img
                src="/hero-car-clean.png"
                alt="Taxi mooo Mercedes Wagenpark"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07152B]/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xs uppercase tracking-wider font-bold text-[#FFD500]">
                    {t('about.page.imgCaption1')}
                  </div>
                  <div className="text-lg font-black">{t('about.page.imgCaption2')}</div>
                </div>
              </div>
            </div>

            {/* Float badge */}
            <div className="absolute -bottom-6 -left-4 sm:left-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFD500] text-[#07152B] flex items-center justify-center font-black">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="text-base font-black text-[#07152B]">{t('about.page.ratingBadge')}</div>
                <div className="text-xs text-gray-500">{t('about.page.ratingCount')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: 4 Pillars */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3.5 py-1.5 rounded-full bg-[#EBF2FC] text-[#00255c] text-xs font-extrabold uppercase tracking-wider">
              {t('about.page.whyBadge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#07152B] tracking-tight">
              {t('about.page.pillarsTitle')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {t('about.page.pillarsSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#EBF2FC] text-[#00255c] flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#07152B] mb-2">{t('about.page.p1Title')}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t('about.page.p1Text')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#EBF2FC] text-[#00255c] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#07152B] mb-2">{t('about.page.p2Title')}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t('about.page.p2Text')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#EBF2FC] text-[#00255c] flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#07152B] mb-2">{t('about.page.p3Title')}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t('about.page.p3Text')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#EBF2FC] text-[#00255c] flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#07152B] mb-2">{t('about.page.p4Title')}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t('about.page.p4Text')}
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Fleet */}
        <section className="bg-gradient-to-br from-[#F8F5FE] to-[#F1EAFF] rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200">
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#00255c] text-[#FFD500] text-xs font-extrabold uppercase tracking-wider">
              {t('about.page.fleetBadge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#07152B]">
              {t('about.page.fleetTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              {t('about.page.fleetSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#00255c] flex items-center justify-center font-black mb-3">
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-[#07152B]">{t('about.page.car1Title')}</h3>
                <p className="text-xs text-[#0B2559] font-bold mb-3">
                  {t('about.page.car1Sub')}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {t('about.page.car1Desc')}
                </p>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 pt-3 border-t border-gray-100">
                <li className="flex items-center gap-2">✓ {t('about.page.car1f1')}</li>
                <li className="flex items-center gap-2">✓ {t('about.page.car1f2')}</li>
                <li className="flex items-center gap-2">✓ {t('about.page.car1f3')}</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#00255c] flex items-center justify-center font-black mb-3">
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-[#07152B]">{t('about.page.car2Title')}</h3>
                <p className="text-xs text-[#0B2559] font-bold mb-3">
                  {t('about.page.car2Sub')}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {t('about.page.car2Desc')}
                </p>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 pt-3 border-t border-gray-100">
                <li className="flex items-center gap-2">✓ {t('about.page.car2f1')}</li>
                <li className="flex items-center gap-2">✓ {t('about.page.car2f2')}</li>
                <li className="flex items-center gap-2">✓ {t('about.page.car2f3')}</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#00255c] flex items-center justify-center font-black mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-[#07152B]">{t('about.page.car3Title')}</h3>
                <p className="text-xs text-[#0B2559] font-bold mb-3">
                  {t('about.page.car3Sub')}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {t('about.page.car3Desc')}
                </p>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 pt-3 border-t border-gray-100">
                <li className="flex items-center gap-2">✓ {t('about.page.car3f1')}</li>
                <li className="flex items-center gap-2">✓ {t('about.page.car3f2')}</li>
                <li className="flex items-center gap-2">✓ {t('about.page.car3f3')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Stats */}
        <section className="bg-gradient-to-r from-[#001331] to-[#00255c] rounded-3xl p-8 sm:p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-[#FFD500]">50.000+</div>
              <div className="text-xs sm:text-sm text-blue-200">{t('about.page.stat1')}</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-[#FFD500]">99.4%</div>
              <div className="text-xs sm:text-sm text-blue-200">{t('about.page.stat2')}</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-[#FFD500]">24/7</div>
              <div className="text-xs sm:text-sm text-blue-200">{t('about.page.stat3')}</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-[#FFD500]">100%</div>
              <div className="text-xs sm:text-sm text-blue-200">{t('about.page.stat4')}</div>
            </div>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center max-w-3xl mx-auto space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black text-[#07152B]">
            {t('about.page.ctaTitle')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t('about.page.ctaSub')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateToBooking}
              className="px-8 py-3.5 rounded-full bg-[#FFD500] hover:bg-yellow-400 text-[#07152B] font-bold text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              {t('about.page.ctaBook')}
            </button>
            <button
              onClick={onOpenContact}
              className="px-8 py-3.5 rounded-full bg-[#00255c] hover:bg-[#001331] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#FFD500]" />
              <span>{t('about.page.ctaContact')}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
