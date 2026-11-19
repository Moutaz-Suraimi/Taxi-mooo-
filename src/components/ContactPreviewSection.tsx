import React from 'react';
import { Phone, MessageSquare, Mail, MapPin, ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactPreviewSectionProps {
  onNavigateToContact: () => void;
  onOpenContactModal?: () => void;
}

export const ContactPreviewSection: React.FC<ContactPreviewSectionProps> = ({
  onNavigateToContact,
  onOpenContactModal,
}) => {
  const { t } = useLanguage();
  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 my-14 sm:my-20">
      <div className="bg-[#FAFBFD] border border-blue-100 rounded-3xl sm:rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Info */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-[#0B2559] text-[#FFB800] text-xs font-extrabold uppercase tracking-wider">
                {t('contact.badge')}
              </span>
              <span className="h-1 w-8 bg-[#FFB800] rounded-full"></span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#07152B] leading-tight">
              {t('contact.title')}
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t('contact.sub')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100/60 shadow-sm">
                <Clock className="w-5 h-5 text-[#0B2559] shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-[#07152B]">24/7/365 Service</div>
                  <div className="text-gray-500">Live dispatching</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100/60 shadow-sm">
                <MapPin className="w-5 h-5 text-[#0B2559] shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-[#07152B]">{t('nationwide.badge')}</div>
                  <div className="text-gray-500">Amsterdam, Randstad & NL</div>
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={onNavigateToContact}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0B2559] hover:bg-[#001331] text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{t('nav.contact')}</span>
                <ArrowRight className="w-4 h-4 text-[#FFB800]" />
              </button>

              {onOpenContactModal && (
                <button
                  onClick={onOpenContactModal}
                  className="text-xs sm:text-sm font-bold text-[#0B2559] hover:underline cursor-pointer"
                >
                  {t('contact.openForm')}
                </button>
              )}
            </div>
          </div>

          {/* Right Fast Action Cards */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            {/* Direct Call Card */}
            <a
              href="tel:+31641212427"
              className="flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-yellow-50/50 rounded-2xl border border-blue-100 shadow-sm hover:border-[#FFB800] transition group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#FFB800] text-[#001331] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    Bel Onze Centrale
                  </div>
                  <div className="text-base sm:text-lg font-black text-[#07152B]">
                    +31 6 41212427
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-yellow-100 text-[#001331]">
                Direct live
              </span>
            </a>

            {/* WhatsApp Card */}
            <a
              href="https://wa.me/31641212427"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-green-50/50 rounded-2xl border border-green-100 shadow-sm hover:border-green-400 transition group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-green-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    WhatsApp Chat
                  </div>
                  <div className="text-base sm:text-lg font-black text-[#07152B]">
                    +31 6 41212427
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-green-100 text-green-800">
                &lt; 2 min antwoord
              </span>
            </a>

            {/* Email Card */}
            <a
              href="mailto:info@taximooo.nl"
              className="flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-blue-50/50 rounded-2xl border border-blue-100 shadow-sm hover:border-[#0B2559] transition group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#0B2559] text-[#FFB800] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    E-mail Klantenservice
                  </div>
                  <div className="text-sm sm:text-base font-black text-[#07152B]">
                    info@taximooo.nl
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-100 text-[#0B2559]">
                Binnen 1 uur
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
