import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight, MessageCircle } from 'lucide-react';

interface FaqPreviewSectionProps {
  onNavigateToFaq: () => void;
  onOpenContact?: () => void;
}

export const FaqPreviewSection: React.FC<FaqPreviewSectionProps> = ({
  onNavigateToFaq,
  onOpenContact,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const previewFaqs = [
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
                Veelgestelde Vragen
              </span>
              <span className="h-1 w-8 bg-[#FFB800] rounded-full"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#07152B] leading-tight">
              Alles wat je vooraf wilt weten
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Heb je een vraag over het boeken, tarieven of onze Schiphol transfers? Hieronder vind je
              de meest gestelde vragen.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onNavigateToFaq}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0B2559] hover:bg-[#001331] text-white font-bold text-sm transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Bekijk alle 18 vragen</span>
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
            <span>Staat jouw vraag er niet tussen? Neem direct contact op met onze centrale.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToFaq}
              className="text-sm font-bold text-[#0B2559] hover:text-[#001331] underline underline-offset-4 cursor-pointer"
            >
              Ga naar de FAQ pagina
            </button>
            {onOpenContact && (
              <button
                onClick={onOpenContact}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-50 text-green-700 hover:bg-green-100 font-bold text-xs border border-green-200 transition cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Stel een vraag</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
