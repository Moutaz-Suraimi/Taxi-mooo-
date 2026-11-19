import React from 'react';
import {
  Plane,
  Briefcase,
  Landmark,
  Ticket,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ServicesSectionProps {
  onSelectService?: (serviceName: string) => void;
  onNavigateToServices?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  onNavigateToServices,
}) => {
  const { t } = useLanguage();
  const services = [
    {
      id: 1,
      image: '/services/service-1.jpg',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
          />
        </svg>
      ),
      title: t('services.nightTitle'),
      description: t('services.nightDesc'),
      tag: 'Populair',
    },
    {
      id: 2,
      image: '/services/service-2.jpg',
      icon: <Plane className="w-5 h-5 fill-current" />,
      title: t('services.airportTitle'),
      description: t('services.airportDesc'),
      tag: 'Schiphol',
    },
    {
      id: 3,
      image: '/services/service-3.jpg',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M10 4a2 2 0 0 1 4 0v6h6a2 2 0 0 1 0 4h-6v6a2 2 0 0 1-4 0v-6H4a2 2 0 0 1 0-4h6V4z" />
        </svg>
      ),
      title: t('services.careTitle'),
      description: t('services.careDesc'),
      tag: 'Zorg',
    },
    {
      id: 4,
      image: '/services/service-4.jpg',
      icon: <Briefcase className="w-5 h-5 fill-current" />,
      title: t('services.businessTitle'),
      description: t('services.businessDesc'),
      tag: 'Zakelijk',
    },
    {
      id: 5,
      image: '/services/service-5.jpg',
      icon: <Landmark className="w-5 h-5 fill-current" />,
      title: t('services.courierTitle'),
      description: t('services.courierDesc'),
      tag: 'Sightseeing',
    },
    {
      id: 6,
      image: '/services/service-6.jpg',
      icon: <Ticket className="w-5 h-5 fill-current" />,
      title: t('services.groupTitle'),
      description: t('services.groupDesc'),
      tag: 'Events',
    },
  ];

  const handleCardClick = (title: string) => {
    if (onNavigateToServices) {
      onNavigateToServices();
    } else if (onSelectService) {
      onSelectService(title);
    }
  };

  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 my-14 sm:my-20">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
        {/* Left: Badge & Main Title */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-[#EBF2FC] text-[#0B2559] text-xs font-extrabold uppercase tracking-wider">
              {t('services.badge')}
            </span>
            <span className="h-1 w-10 bg-[#FFB800] rounded-full"></span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#07152B] leading-[1.15]">
            {t('services.title')}
          </h2>
        </div>

        {/* Right: Subtitle description + link */}
        <div className="lg:max-w-md lg:border-l lg:border-gray-200 lg:pl-6 space-y-3">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {t('services.sub')}
          </p>
          {onNavigateToServices && (
            <button
              onClick={onNavigateToServices}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0B2559] hover:text-[#001331] hover:underline cursor-pointer"
            >
              <span>{t('services.viewAll')}</span>
              <ArrowRight className="w-4 h-4 text-[#FFB800]" />
            </button>
          )}
        </div>
      </div>

      {/* 6 Services Grid (3 cols x 2 rows) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {services.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item.title)}
            className="group bg-white rounded-2xl border border-blue-100/70 shadow-[0_8px_30px_rgba(0,34,84,0.05)] hover:shadow-[0_16px_45px_rgba(0,34,84,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
          >
            {/* Top Image */}
            <div className="h-48 sm:h-52 w-full overflow-hidden bg-blue-50 relative">
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 select-none"
                loading="lazy"
              />
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#0B2559] shadow-sm">
                {item.tag}
              </span>
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#EBF2FC] text-[#0B2559] flex items-center justify-center mb-4 group-hover:bg-[#0B2559] group-hover:text-[#FFB800] transition-all duration-300 shadow-sm">
                  {item.icon}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#07152B] mb-2 group-hover:text-[#0B2559] transition-colors tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-normal mb-5">
                  {item.description}
                </p>
              </div>

              {/* Link Action */}
              <div className="pt-3 border-t border-blue-50 flex items-center justify-between text-sm font-bold text-[#0B2559] group-hover:text-[#001331] transition-all">
                <span>{t('about.moreBtn')}</span>
                <div className="w-7 h-7 rounded-full bg-[#EBF2FC] group-hover:bg-[#0B2559] group-hover:text-[#FFB800] flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Bar */}
      {onNavigateToServices && (
        <div className="mt-10 p-5 sm:p-6 bg-[#EBF2FC] rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#0B2559] shrink-0" />
            <div className="text-xs sm:text-sm text-[#07152B]">
              <span className="font-bold">{t('services.title')} • </span>
              {t('services.sub')}
            </div>
          </div>
          <button
            onClick={onNavigateToServices}
            className="shrink-0 px-5 py-2.5 rounded-full bg-[#0B2559] hover:bg-[#001331] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
          >
            {t('services.viewAll')} →
          </button>
        </div>
      )}
    </section>
  );
};
