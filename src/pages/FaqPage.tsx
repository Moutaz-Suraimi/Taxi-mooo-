import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Search,
  HelpCircle,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface FaqPageProps {
  onNavigateHome: () => void;
  onOpenContact: () => void;
  onNavigateToBooking: () => void;
}

interface FaqItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export const FaqPage: React.FC<FaqPageProps> = ({
  onNavigateHome,
  onOpenContact,
  onNavigateToBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Alle');
  const [openId, setOpenId] = useState<number | null>(1);

  const categories = [
    'Alle',
    'Reserveren & Rit',
    'Tarieven & Betalingen',
    'Schiphol & Vluchten',
    'Annuleren & Wijzigen',
    'Wagenpark & Bagage',
    'Zakelijk',
  ];

  const faqs: FaqItem[] = [
    {
      id: 1,
      category: 'Reserveren & Rit',
      question: 'Hoe reserveer ik een taxi bij Taxi mooo?',
      answer:
        'Je reserveert heel eenvoudig online via onze website. Vul je ophaaladres, bestemming, datum en tijdstip in. Vervolgens kies je het gewenste type voertuig (sedan, VIP of taxibus) en zie je direct de gegarandeerde vaste prijs. Na het invullen van je contactgegevens ontvang je direct een bevestiging per sms en e-mail.',
    },
    {
      id: 2,
      category: 'Reserveren & Rit',
      question: 'Hoe ver van tevoren moet ik reserveren?',
      answer:
        'Je kunt zowel ruim van tevoren (weken of maanden vooruit) als last-minute boeken. Voor luchthavenvervoer en taxibussen adviseren we om minimaal 2 tot 4 uur van tevoren te reserveren. Heb je met spoed een taxi nodig? Bel dan direct onze centrale op 020 894 3456.',
    },
    {
      id: 3,
      category: 'Tarieven & Betalingen',
      question: 'Hoe wordt de ritprijs berekend en is deze echt vast?',
      answer:
        'Ja! Onze prijzen zijn 100% vast en gegarandeerd. Het tarief wordt berekend op basis van de exacte afstand, geschatte rijtijd en voertuigtype. Zodra je boekt staat de prijs vast. Ook als je onderweg in de file staat of de chauffeur moet omrijden wegens wegwerkzaamheden, betaal je geen cent extra.',
    },
    {
      id: 4,
      category: 'Tarieven & Betalingen',
      question: 'Welke betaalmethoden worden geaccepteerd?',
      answer:
        'Je hebt volledige flexibiliteit: je kunt vooraf direct online betalen via iDEAL of creditcard (Mastercard, Visa, American Express). Ook kun je kiezen voor achteraf betalen in de taxi met PIN, creditcard of contant bij de chauffeur. Zakelijke klanten kunnen tevens op factuur rijden.',
    },
    {
      id: 5,
      category: 'Schiphol & Vluchten',
      question: 'Wat gebeurt er als mijn vlucht naar Schiphol vertraging heeft?',
      answer:
        'Geen zorgen! Tijdens het reserveren vul je je vluchtnummer in. Ons geautomatiseerde dispatch-systeem monitort je vlucht live. Land je een uur later of juist een half uur eerder? De chauffeur past de aankomsttijd automatisch aan. Vanaf het moment dat het vliegtuig landt heb je 45 minuten gratis wachttijd.',
    },
    {
      id: 6,
      category: 'Schiphol & Vluchten',
      question: 'Waar ontmoet ik de chauffeur op Schiphol Airport?',
      answer:
        'Op Schiphol ontmoet je de chauffeur standaard bij het centrale Meeting Point in Schiphol Plaza (de grote rood-witte kubus) of bij de desbetreffende vertrekhal op de bovenverdieping. Zodra je toestel is geland ontvang je een sms of WhatsApp van je chauffeur met het kenteken van de Mercedes en zijn exacte locatie.',
    },
    {
      id: 7,
      category: 'Annuleren & Wijzigen',
      question: 'Kan ik mijn rit kosteloos annuleren of wijzigen?',
      answer:
        'Ja, annuleren of het tijdstip wijzigen is volledig kosteloos tot 2 uur voor de geplande ophaaltijd. Heb je al online betaald? Dan storten we het volledige bedrag direct terug via dezelfde betaalmethode. Annuleren kan via de link in je bevestigingsmail of telefonisch.',
    },
    {
      id: 8,
      category: 'Annuleren & Wijzigen',
      question: 'Wat als mijn ophaaladres of tussenstop wijzigt?',
      answer:
        'Wil je onderweg een vriend oppikken of wijzigt je bestemming? Geef dit zo snel mogelijk door aan onze centrale via WhatsApp of telefoon. Indien de afstand significant wijzigt, berekent de centrale het aangepaste vaste tarief vooraf aan je door.',
    },
    {
      id: 9,
      category: 'Wagenpark & Bagage',
      question: 'Hoeveel bagage mag ik meenemen?',
      answer:
        'In een standaard Mercedes-Benz E-Klasse sedan passen maximaal 3 grote koffers en 2 stuks handbagage. Reis je met meer koffers, ski-uitrusting, golftassen of meer dan 4 personen? Kies dan voor onze Mercedes-Benz V-Klasse taxibus (tot 8 personen en 8 grote koffers).',
    },
    {
      id: 10,
      category: 'Wagenpark & Bagage',
      question: 'Zijn er kinderzitjes of maxicosi beschikbaar?',
      answer:
        'Ja, veiligheid voor de allerkleinsten staat voorop. Bij het online boeken kun je aangeven of je een Maxi-Cosi, kinderzitje of stoelverhoger nodig hebt. Wij zorgen ervoor dat het juiste goedgekeurde zitje klaarstaat in de auto.',
    },
    {
      id: 11,
      category: 'Wagenpark & Bagage',
      question: 'Mag mijn huisdier mee in de taxi?',
      answer:
        'Kleine huisdieren in een geschikte reistas of bench zijn van harte welkom. Hulphonden en blindengeleidehonden mogen altijd gratis mee. Geef het meenemen van een huisdier wel even aan bij de opmerkingen tijdens het reserveren.',
    },
    {
      id: 12,
      category: 'Zakelijk',
      question: 'Kunnen bedrijven op rekening rijden met maandfactuur?',
      answer:
        'Absoluut! Voor bedrijven, advocatenkantoren, hotels en zorginstellingen bieden wij zakelijke accounts met een overzichtelijke maandelijkse verzamelfactuur met specificatie per kostenplaats of medewerker. Neem contact op voor het instellen van een zakelijk account.',
    },
    {
      id: 13,
      category: 'Zakelijk',
      question: 'Zijn jullie chauffeurs discreet en representatief?',
      answer:
        'Ja, al onze chauffeurs zijn gekleed in representatief kostuum, beheersen zowel het Nederlands als het Engels vloeiend en hebben een geheimhoudingsverklaring ondertekend. Ze zijn gewend om directieleden, diplomaten en VIP gasten te begeleiden in alle rust.',
    },
    {
      id: 14,
      category: 'Reserveren & Rit',
      question: 'Wat is het TX-Keurmerk en wat betekent dit voor mij?',
      answer:
        'Het TX-Keurmerk is het officiële landelijke kwaliteitskeurmerk voor taxivervoer in Nederland. Het garandeert dat onze chauffeurs een Verklaring Omtrent het Gedrag (VOG) hebben, periodiek getoetst worden op rijvaardigheid en EHBO, en dat onze wagens aan de strengste APK- en veiligheidseisen voldoen.',
    },
    {
      id: 15,
      category: 'Reserveren & Rit',
      question: 'Rijden jullie ook buiten Amsterdam en de Randstad?',
      answer:
        'Jazeker! Hoewel ons hoofdkantoor in Amsterdam is gevestigd, verzorgen wij ritten door heel Nederland (o.a. Utrecht, Rotterdam, Den Haag, Eindhoven, Arnhem, Groningen) en zelfs naar buurlanden zoals België (Brussel, Antwerpen) en Duitsland (Düsseldorf).',
    },
    {
      id: 16,
      category: 'Tarieven & Betalingen',
      question: 'Ontvang ik een officiële factuur met btw-specificatie?',
      answer:
        'Ja, direct na afronding van de rit ontvang je automatisch een officiële digitale btw-factuur (met 9% laag tarief) op het opgegeven e-mailadres. Deze is direct geschikt voor jouw administratie of declaratie bij je werkgever.',
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === 'Alle' || faq.category === activeCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [faqs, activeCategory, searchQuery]);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full">
      {/* Top Banner / Hero */}
      <section className="relative bg-gradient-to-r from-[#001331] via-[#001a3f] to-[#00255c] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1240px] mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-200/80 mb-6">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#FFB800] transition cursor-pointer flex items-center gap-1"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#FFB800] font-bold">Veelgestelde vragen</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#FFB800] text-xs font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FAQ & Klantenservice</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Veelgestelde vragen over Taxi mooo
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
              Heb je een vraag over het online boeken van een taxi, onze vaste Schiphol tarieven,
              annuleringen of bagage? Hieronder vind je directe en duidelijke antwoorden.
            </p>

            {/* Search Input Box */}
            <div className="pt-4 max-w-xl">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Zoek een vraag (bijv. Schiphol, annuleren, betalen, koffers)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-[#07152B] placeholder-gray-400 text-sm font-medium shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FFD500]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    Wissen
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-12">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#00255c] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-[#EBF2FC] hover:text-[#00255c] border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
          <span>
            {filteredFaqs.length} {filteredFaqs.length === 1 ? 'vraag gevonden' : 'vragen gevonden'}
            {activeCategory !== 'Alle' && ` in "${activeCategory}"`}
            {searchQuery && ` voor "${searchQuery}"`}
          </span>
          {(activeCategory !== 'Alle' || searchQuery) && (
            <button
              onClick={() => {
                setActiveCategory('Alle');
                setSearchQuery('');
              }}
              className="text-[#00255c] font-bold hover:underline cursor-pointer"
            >
              Filters resetten
            </button>
          )}
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#00255c]/40 bg-white shadow-md'
                    : 'border-gray-200 bg-white hover:border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full py-5 px-6 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#EBF2FC] text-[#00255c] text-[11px] font-bold shrink-0 mt-0.5 sm:mt-0">
                      {faq.category}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-[#07152B]">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#00255c] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#00255c]' : 'text-gray-400'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-gray-600 leading-relaxed border-t border-slate-100">
                    <p className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-200/50">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 space-y-3">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
              <div className="text-lg font-bold text-gray-700">Geen vragen gevonden</div>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                We konden geen vragen vinden die overeenkomen met je zoekopdracht. Probeer een andere
                zoekterm of neem direct contact op met onze centrale.
              </p>
            </div>
          )}
        </div>

        {/* Contact Helpbox */}
        <section className="bg-gradient-to-br from-[#EBF2FC] to-[#DFEBF9] rounded-3xl p-8 sm:p-10 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#00255c]">
              Staat je vraag er niet tussen?
            </span>
            <h3 className="text-2xl font-black text-[#07152B]">
              Onze centrale helpt je graag persoonlijk verder
            </h3>
            <p className="text-sm text-gray-600 max-w-xl">
              We zijn 24 uur per dag, 7 dagen per week telefonisch en via WhatsApp bereikbaar om al je
              vragen over ritten, tarieven of speciale wensen te beantwoorden.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={onNavigateToBooking}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FFD500] hover:bg-yellow-400 text-[#07152B] font-bold text-sm shadow-md transition cursor-pointer"
            >
              <span>Rit berekenen</span>
            </button>

            <button
              onClick={onOpenContact}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#00255c] hover:bg-[#001331] text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#FFD500]" />
              <span>Contact opnemen</span>
            </button>

            <a
              href="https://wa.me/31641212427"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
