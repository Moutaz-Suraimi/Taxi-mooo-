import React from 'react';
import { X, Plane, Users, Briefcase } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface InfoModalProps {
  type: 'about' | 'services' | 'faq' | null;
  onClose: () => void;
}

export const InformationModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  const { t } = useLanguage();
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-[28px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#001331] to-[#00255c] text-white">
          <h3 className="font-bold text-lg">
            {type === 'about' && t('about.page.badge')}
            {type === 'services' && t('services.page.badge')}
            {type === 'faq' && t('faq.page.badge')}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-gray-700">
          {type === 'about' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#EBF2FC] rounded-2xl border border-slate-200">
                <h4 className="font-bold text-[#00255c] text-base mb-1">
                  {t('about.page.h1')}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {t('about.page.sub')}
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-[#07152B]">{t('about.page.pillarsTitle')}</h5>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FFD500] text-[#07152B] flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <span>{t('about.page.p2Title')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FFD500] text-[#07152B] flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <span>{t('about.page.fleetTitle')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FFD500] text-[#07152B] flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <span>{t('about.page.p3Title')}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {type === 'services' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                <Plane className="w-6 h-6 text-[#00255c] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-[#07152B]">Schiphol & Airport Transfers</h5>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('services.page.ratesSub')}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                <Briefcase className="w-6 h-6 text-[#00255c] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-[#07152B]">{t('about.page.car2Title')}</h5>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('about.page.car2Desc')}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                <Users className="w-6 h-6 text-[#00255c] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-[#07152B]">{t('about.page.car3Title')}</h5>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('about.page.car3Desc')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {type === 'faq' && (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-xl">
                <h5 className="font-bold text-[#07152B] text-xs">
                  {t('about.page.p3Title')}
                </h5>
                <p className="text-xs text-gray-600 mt-1">
                  {t('about.page.p3Text')}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <h5 className="font-bold text-[#07152B] text-xs">{t('about.page.p1Title')}</h5>
                <p className="text-xs text-gray-600 mt-1">
                  {t('about.page.p1Text')}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <h5 className="font-bold text-[#07152B] text-xs">{t('services.page.payment')}</h5>
                <p className="text-xs text-gray-600 mt-1">
                  {t('services.page.paymentSub')}
                </p>
              </div>
            </div>
          )}

          <div className="pt-3">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#00255c] hover:bg-[#001331] text-white font-bold rounded-xl transition cursor-pointer"
            >
              {t('reviews.page.closeForm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
