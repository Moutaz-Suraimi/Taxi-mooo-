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
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#FFB800] font-bold">Over ons</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#FFB800] text-xs font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Over Taxi mooo</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Kwaliteit, luxe en gastvrijheid op iedere kilometer
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
              Taxi mooo is opgericht met één duidelijke missie: taxivervoer in Nederland naar een hoger
              niveau tillen. Zonder onduidelijke meters, zonder verrassingen achteraf, maar met
              onberispelijke service in representatieve Mercedes-Benz voertuigen.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-16 sm:space-y-24">
        {/* Section 1: Ons Verhaal & Visie */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#EBF2FC] text-[#00255c] text-xs font-extrabold uppercase tracking-wider">
                Ons Verhaal
              </span>
              <span className="h-1 w-8 bg-[#FFD500] rounded-full"></span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#07152B] tracking-tight">
              Van lokale rit tot landelijk vertrouwd taxinetwerk
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Wat begon als een gepassioneerde taxiservice in de regio Amsterdam, is uitgegroeid tot een
              hoogwaardige vervoerspartner voor particulieren, gezinnen en internationale bedrijven door
              heel Nederland.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Wij geloven dat een taxirit méér is dan alleen reizen van A naar B. Het is het begin van
              een ontspannen vakantie op Schiphol, het moment van voorbereiding voor een belangrijke
              zakelijke vergadering, of de veilige thuiskomst na een gezellige avond. Daarom selecteren wij
              onze chauffeurs streng op professionaliteit, beleefdheid en discretie.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#EBF2FC] border border-slate-200">
                <div className="font-bold text-[#00255c] text-base mb-1">Onze Belofte</div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Altijd op tijd, een vaste prijs vooraf en een brandschone wagen waarin je je direct thuis voelt.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#EBF2FC] border border-slate-200">
                <div className="font-bold text-[#00255c] text-base mb-1">Onze Chauffeurs</div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Gediplomeerd met TX-Keurmerk, representatief gekleed en meertalig (Nederlands & Engels).
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
                    100% Mercedes-Benz
                  </div>
                  <div className="text-lg font-black">Comfort, rust en premium rijbeleving</div>
                </div>
              </div>
            </div>

            {/* Float badge */}
            <div className="absolute -bottom-6 -left-4 sm:left-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFD500] text-[#07152B] flex items-center justify-center font-black">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="text-base font-black text-[#07152B]">4.9 van 5 sterren</div>
                <div className="text-xs text-gray-500">Gebaseerd op 1.200+ klantbeoordelingen</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: 4 Kernwaarden */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3.5 py-1.5 rounded-full bg-[#EBF2FC] text-[#00255c] text-xs font-extrabold uppercase tracking-wider">
              Waarom Taxi mooo
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#07152B] tracking-tight">
              Onze Vier Gouden Pijlers
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Iedere rit die we uitvoeren voldoet aan onze strenge kwaliteitseisen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#EBF2FC] text-[#00255c] flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#07152B] mb-2">99.4% Punctualiteit</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Tijd is kostbaar. Onze chauffeurs zijn altijd minstens 5 minuten voor het afgesproken
                tijdstip aanwezig op jouw ophaallocatie.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#EBF2FC] text-[#00255c] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#07152B] mb-2">TX-Keurmerk Gecertificeerd</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Wij voldoen aan de strengste landelijke kwaliteits- en veiligheidseisen van het officiële
                Nederlandse taxikeurmerk.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#EBF2FC] text-[#00255c] flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#07152B] mb-2">Vaste Prijzen Vooraf</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Geen tikkende taximeters of verrassingen bij files. Je ziet direct bij reservering wat
                de rit kost. Dat is helder en eerlijk.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-[#EBF2FC] text-[#00255c] flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#07152B] mb-2">Persoonlijke Gastvrijheid</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Onze chauffeurs openen de deur, helpen met zware koffers en zorgen voor de gewenste
                temperatuur en stilte aan boord.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Ons Wagenpark */}
        <section className="bg-gradient-to-br from-[#F8F5FE] to-[#F1EAFF] rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200">
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#00255c] text-[#FFD500] text-xs font-extrabold uppercase tracking-wider">
              Onze Vloot
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#07152B]">
              Altijd reizen in een representatieve Mercedes-Benz
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Al onze wagens zijn maximaal 3 jaar oud, niet-rokers voertuigen en uitgerust met gratis
              wifi, telefoonladers en lederen bekleding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#00255c] flex items-center justify-center font-black mb-3">
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-[#07152B]">Mercedes-Benz E-Klasse</h3>
                <p className="text-xs text-[#0B2559] font-bold mb-3">
                  Sedan • Tot 4 personen • 3 koffers
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  De perfecte allrounder voor stadsritten, zakelijke afspraken en comfortabele
                  luchthaventransfers voor individuen en stellen.
                </p>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 pt-3 border-t border-gray-100">
                <li className="flex items-center gap-2">✓ Lederen bekleding & airco</li>
                <li className="flex items-center gap-2">✓ Telefoonopladers voor iPhone & Android</li>
                <li className="flex items-center gap-2">✓ Vaste lage kilometertarieven</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#00255c] flex items-center justify-center font-black mb-3">
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-[#07152B]">Mercedes-Benz S-Klasse</h3>
                <p className="text-xs text-[#0B2559] font-bold mb-3">
                  VIP Sedan • Tot 3 personen • 2 koffers
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Ultieme luxe en sereniteit voor directieleden, diplomaten, VIP gasten en speciale
                  gelegenheden zoals bruiloften.
                </p>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 pt-3 border-t border-gray-100">
                <li className="flex items-center gap-2">✓ Extra beenruimte & massagestoelen</li>
                <li className="flex items-center gap-2">✓ Flesjes mineraalwater inbegrepen</li>
                <li className="flex items-center gap-2">✓ Privacy glas en discreet vervoer</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#00255c] flex items-center justify-center font-black mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-[#07152B]">Mercedes-Benz V-Klasse Bus</h3>
                <p className="text-xs text-[#0B2559] font-bold mb-3">
                  Taxibus • Tot 8 personen • 8 grote koffers
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Ruim groepsvervoer voor grote gezinnen, vriendengroepen, conferenties en festivalgangers
                  zonder concessies aan luxe.
                </p>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 pt-3 border-t border-gray-100">
                <li className="flex items-center gap-2">✓ Enorme bagageruimte</li>
                <li className="flex items-center gap-2">✓ Vergaderopstelling met tafel mogelijk</li>
                <li className="flex items-center gap-2">✓ Ideaal voor Schiphol transfers met gezin</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Key Facts & Numbers */}
        <section className="bg-gradient-to-r from-[#001331] to-[#00255c] rounded-3xl p-8 sm:p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-[#FFD500]">50.000+</div>
              <div className="text-xs sm:text-sm text-blue-200">Veilig uitgevoerde ritten</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-[#FFD500]">99.4%</div>
              <div className="text-xs sm:text-sm text-blue-200">Stipt op tijd garantie</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-[#FFD500]">24/7</div>
              <div className="text-xs sm:text-sm text-blue-200">Klantenservice & Dispatch</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-[#FFD500]">100%</div>
              <div className="text-xs sm:text-sm text-blue-200">TX-Keurmerk gecertificeerd</div>
            </div>
          </div>
        </section>

        {/* Section 5: Bottom CTA */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center max-w-3xl mx-auto space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black text-[#07152B]">
            Ervaar zelf het verschil met Taxi mooo
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Bereken nu binnen 30 seconden je vaste ritprijs of neem direct contact op met onze 24/7 centrale.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateToBooking}
              className="px-8 py-3.5 rounded-full bg-[#FFD500] hover:bg-yellow-400 text-[#07152B] font-bold text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              Bereken je ritprijs & reserveer
            </button>
            <button
              onClick={onOpenContact}
              className="px-8 py-3.5 rounded-full bg-[#00255c] hover:bg-[#001331] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#FFD500]" />
              <span>Contact opnemen</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
