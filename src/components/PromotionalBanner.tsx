import React from 'react';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';

interface PromotionalBannerProps {
  onOpenContact: () => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ onOpenContact }) => {
  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#001331] text-white p-8 sm:p-12 md:p-14 shadow-2xl shadow-[#001331]/40">

        {/* ── Background texture: subtle radial glow ── */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, #FFB800 0%, transparent 65%)' }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #0046cc 0%, transparent 65%)' }}
          />
        </div>

        {/* ── Yellow accent bar on left ── */}
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#FFB800] rounded-l-[28px]" />

        {/* ── Dutch skyline silhouette (bottom-right) ── */}
        <div className="absolute bottom-0 right-0 left-1/3 h-24 sm:h-32 pointer-events-none opacity-[0.07] flex items-end justify-end overflow-hidden">
          <svg className="w-full max-w-[600px] h-full" viewBox="0 0 600 100" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 100L20 65 30 65 30 55 40 55 40 48 50 48 50 55 60 55 60 65 70 65 70 100Z" />
            <path d="M80 100L80 55 95 42 110 55 110 100Z" />
            <path d="M120 100L120 60 130 60 130 50 140 42 150 50 150 60 160 60 160 100Z" />
            <path d="M225 100L225 50 235 36 235 20 240 8 245 20 245 36 255 50 255 100Z" />
            <path d="M270 100L270 55 285 44 300 55 300 100Z" />
            <path d="M310 100L310 58 325 46 340 58 340 100Z" />
            <g transform="translate(410,15)">
              <polygon points="30,85 40,30 60,30 70,85" />
              <line x1="50" y1="25" x2="15" y2="-5" stroke="white" strokeWidth="3" />
              <line x1="50" y1="25" x2="85" y2="55" stroke="white" strokeWidth="3" />
              <line x1="50" y1="25" x2="15" y2="55" stroke="white" strokeWidth="3" />
              <line x1="50" y1="25" x2="85" y2="-5" stroke="white" strokeWidth="3" />
            </g>
            <path d="M500 100L500 65 515 55 530 65 530 100Z" />
            <path d="M540 100L540 60 560 46 580 60 580 100Z" />
          </svg>
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pl-4 sm:pl-6">

          {/* Left: Text */}
          <div className="max-w-xl">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFB800]/15 border border-[#FFB800]/30 text-[#FFB800] text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
              Jouw taxipartner in Nederland
            </span>

            <h3 className="text-3xl sm:text-4xl md:text-[42px] font-black tracking-tight text-white leading-tight">
              Taxi mooo –{' '}
              <span className="text-[#FFB800]">Altijd betrouwbaar</span>
            </h3>
            <p className="mt-3 text-base sm:text-lg text-white/70 font-medium leading-relaxed">
              24/7 beschikbaar, vaste prijzen, professionele chauffeurs.<br className="hidden sm:inline" />
              Van Haarlem en Amsterdam tot heel Nederland.
            </p>

            {/* Quick contact icons */}
            <div className="mt-5 flex flex-wrap gap-4">
              <a href="tel:+31641212427" className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-[#FFB800] transition-colors">
                <Phone className="w-4 h-4 text-[#FFB800]" />
                +31 6 41212427
              </a>
              <a href="https://wa.me/31641212427" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-[#FFB800] transition-colors">
                <MessageCircle className="w-4 h-4 text-[#FFB800]" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Right: CTA button */}
          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={onOpenContact}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#FFB800] hover:bg-[#FFA500] text-[#001331] font-black text-base shadow-xl shadow-[#FFB800]/20 hover:shadow-[#FFB800]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <span>Neem contact op</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
