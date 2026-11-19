import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FaqPreviewSectionProps {
  onNavigateToFaq: () => void;
  onOpenContact?: () => void;
}

export const FaqPreviewSection: React.FC<FaqPreviewSectionProps> = ({
  onNavigateToFaq,
  onOpenContact,
}) => {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const previewFaqs = language === 'en' ? [
    {
      question: 'How is my taxi fare calculated in advance?',
      answer:
        'At Taxi mooo, your fare is calculated in advance based on your pickup address, destination, and vehicle type. This is a guaranteed fixed price including VAT, tolls, and luggage. You never pay extra during traffic delays or diversions.',
    },
    {
      question: 'Can I change or cancel my booking for free?',
      answer:
        'Yes, cancelling or changing the pickup time is completely free of charge up to 2 hours before the scheduled pickup time via phone, WhatsApp, or directly in your account dashboard.',
    },
    {
      question: 'How does pickup at Schiphol Airport work?',
      answer:
        'Our dispatch center tracks your flight number in real time. Once you land, you get 45 minutes of free waiting time to pass customs and retrieve your luggage. Your driver will meet you at the agreed meeting point.',
    },
    {
      question: 'Which payment methods are accepted?',
      answer:
        'You can pay in cash to the driver, or soon online via iDEAL, debit card (PIN), or credit card. Business invoicing is also available for corporate accounts.',
    },
  ] : [
    {
      question: 'Hoe wordt mijn ritprijs vooraf berekend?',
      answer:
        'Bij Taxi mooo berekenen we je ritprijs exact vooraf op basis van vertrekadres, bestemming en voertuigtype. Dit is een gegarandeerde vaste ritprijs inclusief btw, tol en bagage. Je betaalt nooit een cent meer bij verkeersdrukte of omleidingen.',
    },
    {
      question: 'Kan ik mijn reservering kosteloos wijzigen of annuleren?',
      answer:
        'Ja, annuleren of tijdstip wijzigen is volledig kosteloos tot 2 uur voor de afgesproken ophaaltijd. Dit kan eenvoudig telefonisch, via WhatsApp of direct in je account dashboard.',
    },
    {
      question: 'Hoe verloopt het ophalen op Schiphol Airport?',
      answer:
        'Onze centrale monitort je vluchtnummer live. Zodra je landt heb je 45 minuten gratis wachttijd om door de douane en bagageband te komen. Je chauffeur wacht op je bij het afgesproken Meeting Point of vertrekhal en neemt vooraf contact met je op.',
    },
    {
      question: 'Welke betaalmethoden worden ondersteund?',
      answer:
        'Je kunt vooraf online veilig betalen met iDEAL of creditcard, of achteraf gemakkelijk in de taxi afrekenen via PIN, creditcard of contant. Voor zakelijke klanten bieden we ook rijden op factuur aan.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 my-14 sm:my-20">
      <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-[0_8px_30px_rgba(0,19,49,0.05)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-[#EBF2FC] text-[#0B2559] text-xs font-extrabold uppercase tracking-wider">
                {t('faq.badge')}
              </span>
              <span className="h-1 w-8 bg-[#FFB800] rounded-full"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#07152B] leading-tight">
              {t('faq.title')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {t('faq.sub')}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onNavigateToFaq}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0B2559] hover:bg-[#001331] text-white font-bold text-sm transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>{t('faq.viewAll')}</span>
              <ArrowRight className="w-4 h-4 text-[#FFB800]" />
            </button>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {previewFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#0B2559]/30 bg-[#EBF2FC]/30 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-blue-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-[#0B2559] text-white'
                          : 'bg-blue-100 text-[#0B2559]'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#07152B]">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#0B2559] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#0B2559]' : 'text-gray-400'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-blue-100/50">
                    <p className="pl-10">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <HelpCircle className="w-5 h-5 text-[#0B2559] shrink-0" />
            <span>{t('faq.contactPrompt')}</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenContact && (
              <button
                onClick={onOpenContact}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-50 text-green-700 hover:bg-green-100 font-bold text-xs border border-green-200 transition cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{t('faq.contactBtn')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
