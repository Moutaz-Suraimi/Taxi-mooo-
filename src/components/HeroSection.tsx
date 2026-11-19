import React from 'react';
import { ShieldCheck, Clock, Wallet } from 'lucide-react';
import heroNight from '../assets/amsterdam-taxi-night.jpg';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  children?: React.ReactNode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ children }) => {
  const { t } = useLanguage();
  return (
    <section className="relative w-full overflow-hidden text-white min-h-[520px] sm:min-h-[600px] lg:min-h-[680px]">

      {/* ── Night photo background ── */}
      <img
        src={heroNight}
        alt="Zwarte taxi aan een Amsterdamse gracht bij nacht"
        className="absolute inset-0 w-full h-full object-cover object-[65%_center]"
        style={{ zIndex: 0 }}
        fetchPriority="high"
      />

      {/* ── Dark gradient: readable left, bright right ── */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: `
            linear-gradient(105deg,
              rgba(0,10,28,0.92) 0%,
              rgba(0,10,28,0.78) 38%,
              rgba(0,10,28,0.30) 65%,
              rgba(0,10,28,0.05) 100%),
            linear-gradient(180deg,
              rgba(0,10,28,0.15) 0%,
              rgba(0,10,28,0.00) 55%,
              rgba(0,10,28,0.70) 100%)
          `,
        }}
      />

      {/* ── Golden brand glow (bottom-left) ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          zIndex: 1,
          bottom: -60,
          left: -40,
          width: 440,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,184,0,0.20) 0%, transparent 70%)',
        }}
      />

      {/* ── Bottom fade to white content ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 2,
          height: 100,
          background: 'linear-gradient(to bottom, transparent, #F4F7FB)',
        }}
      />

      {/* ── Hero content ── */}
      <div
        className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-20 sm:pb-28 md:pb-36"
        style={{ zIndex: 3 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* ── LEFT: Headline + badges ── */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center">
            {/* Availability pill */}
            <div className="animate-hero inline-flex items-center gap-2 self-start mb-5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white/90 border border-white/20 backdrop-blur-md bg-white/10">
              <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
              {t('hero.pill')}
            </div>

            {/* Main headline */}
            <h1
              className="animate-hero delay-100 text-4xl sm:text-5xl md:text-[56px] lg:text-[62px] xl:text-[68px] font-black tracking-tight leading-[1.06] text-white select-none"
            >
              {t('hero.h1_1')}<br />
              {t('hero.h1_2')}{' '}
              <span
                className="text-[#FFB800]"
                style={{ textShadow: '0 0 40px rgba(255,184,0,0.35)' }}
              >
                {t('hero.h1_3')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="animate-hero delay-200 mt-5 text-base sm:text-lg md:text-xl font-normal text-white/85 leading-relaxed max-w-lg">
              {t('hero.sub')}
            </p>

            {/* Trust badges */}
            <div className="animate-hero delay-300 mt-7 flex flex-wrap items-center gap-5 sm:gap-7 text-sm sm:text-[15px] font-semibold text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#FFB800] shrink-0" />
                <span>{t('hero.reliable')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#FFB800] shrink-0" />
                <span>{t('hero.affordable')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FFB800] shrink-0" />
                <span>{t('hero.available247')}</span>
              </div>
            </div>

            {/* Stars rating */}
            <div className="animate-hero delay-300 mt-6 flex items-center gap-3">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-5 h-5 text-[#FFB800] fill-[#FFB800]" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-white/70">
                <span className="font-bold text-white">4.9</span> {t('hero.reviewsText')}
              </span>
            </div>

            {/* CTA button */}
            <div className="animate-hero delay-300 mt-8">
              <a
                href="#booking-form"
                onClick={e => {
                  e.preventDefault();
                  document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-[#FFB800] text-[#001331] font-black text-base shadow-lg shadow-[#FFB800]/30 hover:bg-[#FFA500] hover:shadow-[#FFB800]/50 hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
              >
                {t('hero.calcFare')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── RIGHT: empty — taxi photo shows through ── */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 pointer-events-none min-h-[400px]" />
        </div>
      </div>

      {children}
    </section>
  );
};
