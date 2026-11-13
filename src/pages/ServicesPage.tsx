import React from 'react';
import {
  Plane,
  Briefcase,
  Landmark,
  Ticket,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Wifi,
  CreditCard,
  Luggage,
  ArrowRight,
} from 'lucide-react';

interface ServicesPageProps {
  onNavigateHome: () => void;
  onNavigateToBooking: () => void;
  onOpenContact: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigateHome,
  onNavigateToBooking,
  onOpenContact,
}) => {
  const serviceDetails = [
    {
      id: 'lokaal',
      title: 'Lokaal Taxivervoer & Stadsritten',
      tag: 'Populair',
      image: '/services/service-1.jpg',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
          />
        </svg>
      ),
      description:
        'Snel, veilig en comfortabel reizen binnen Amsterdam, de Randstad en heel Nederland. Of je nu naar je werk moet, een diner hebt of na een avond stappen veilig thuisgebracht wilt worden.',
      features: [
        'Binnen enkele minuten voorgereden of ruim vooraf reserveren',
        'Vaste prijs vooraf, geen oplopende meter bij verkeersopstoppingen',
        'Schone, niet-rokers Mercedes-Benz wagens',
        'Betalen mogelijk via iDEAL, PIN, creditcard of contant',
      ],
      idealFor: 'Particulieren, stadsritten, restaurantbezoek, dagelijkse afspraken',
    },
    {
      id: 'schiphol',
      title: 'Schiphol & Luchthavenvervoer',
      tag: 'Meest gekozen',
      image: '/services/service-2.jpg',
      icon: <Plane className="w-6 h-6 fill-current" />,
      description:
        'Start of eindig je vakantie of zakenreis ontspannen. Geen gesleep met koffers in overvolle treinen en geen torenhoge parkeerkosten op Schiphol, Rotterdam The Hague of Eindhoven Airport.',
      features: [
        'Live vluchtnummer monitoring: chauffeur past zich aan bij vertraging of eerdere landing',
        '45 minuten gratis wachttijd na landing op het vliegveld',
        'Persoonlijke ophaalservice bij het Meeting Point of vertrekhal',
        'Ruime kofferbak voor al je bagage en optionele kinderzitjes beschikbaar',
      ],
      idealFor: 'Vakantiegangers, gezinnen, zakenreizigers, expats',
    },
    {
      id: 'zakelijk',
      title: 'Zakelijk Vervoer & VIP Directie',
      tag: 'Executive',
      image: '/services/service-4.jpg',
      icon: <Briefcase className="w-6 h-6 fill-current" />,
      description:
        'Representatief directievervoer voor bestuurders, zakelijke gasten en delegaties. Onze discrete en meertalige chauffeurs zorgen voor een stijlvolle ontvangst en een rustige werkomgeving onderweg.',
      features: [
        'Luxe Mercedes S-Klasse en E-Klasse met privacy glas',
        'Rijden op factuur met overzichtelijke maandelijkse verzamelfactuur voor bedrijven',
        'Gratis snelle wifi, 220V/USB-laadpunten en flesjes mineraalwater aan boord',
        'Strikte geheimhouding en discretie gewaarborgd',
      ],
      idealFor: 'Directie, managers, congressen, internationale zakenrelaties',
    },
    {
      id: 'zorg',
      title: 'Zorgvervoer & Medische Afspraken',
      tag: 'Zorg & Aandacht',
      image: '/services/service-3.jpg',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M10 4a2 2 0 0 1 4 0v6h6a2 2 0 0 1 0 4h-6v6a2 2 0 0 1-4 0v-6H4a2 2 0 0 1 0-4h6V4z" />
        </svg>
      ),
      description:
        'Betrouwbaar en rustig vervoer naar ziekenhuizen, poliklinieken, revalidatiecentra of tandartsen. Onze chauffeurs bieden extra geduld en persoonlijke begeleiding bij het in- en uitstappen.',
      features: [
        'Hulp van de voordeur tot in de wachtruimte indien gewenst',
        'Rolstoel (inklapbaar) en rollator kunnen probleemloos in de kofferbak mee',
        'Altijd ruim op tijd aanwezig zodat je ontspannen bij je afspraak arriveert',
        'Vaste en betrouwbare chauffeurs voor periodieke afspraken',
      ],
      idealFor: 'Senioren, patiënten, revaliderenden, mantelzorgers',
    },
    {
      id: 'sightseeing',
      title: 'Sightseeing & Dagtochten',
      tag: 'Tours',
      image: '/services/service-5.jpg',
      icon: <Landmark className="w-6 h-6 fill-current" />,
      description:
        'Ontdek de mooiste plekken van Nederland op je eigen tempo met een privéchauffeur. Bezoek de tulpen in Keukenhof, de historische molens van de Zaanse Schans of de grachten van Giethoorn.',
      features: [
        'Op maat samengestelde routes en flexibele uurtarieven',
        'Chauffeur wacht geduldig op locatie terwijl jij geniet van de bezienswaardigheden',
        'Geschikt voor kleine gezelschappen tot 8 personen in een luxe VIP bus',
        'Tips van een lokale kenner over de leukste fotospots en restaurants',
      ],
      idealFor: 'Toeristen, internationale bezoekers, familie-uitjes',
    },
    {
      id: 'evenementen',
      title: 'Evenementen & Groepsvervoer',
      tag: 'Tot 8 personen',
      image: '/services/service-6.jpg',
      icon: <Ticket className="w-6 h-6 fill-current" />,
      description:
        'Gezamenlijk naar een concert in de Ziggo Dome, een voetbalwedstrijd in de Johan Cruijff ArenA, een festival of een bruiloft. Onze ruime Mercedes V-Klasse brengt je hele groep comfortabel en veilig.',
      features: [
        'Geschikt voor groepen tot 8 personen inclusief alle bagage of festivalspullen',
        'Geen gedoe met BOB zijn, parkeerfiles of het missen van de laatste nachttrein',
        'Vooraf vastgelegde ophaaltijd en ontmoetingspunt na afloop van het evenement',
        'Gezellige sfeer met Bluetooth audio verbinding voor je eigen muziek',
      ],
      idealFor: 'Vriendengroepen, bruiloftsgasten, festivalbezoekers, bedrijfsuitjes',
    },
  ];

  const airportRates = [
    { from: 'Amsterdam Centrum', to: 'Schiphol Airport', price: 'Vanaf € 38,-', time: 'ca. 20 min' },
    { from: 'Amsterdam Zuidas', to: 'Schiphol Airport', price: 'Vanaf € 35,-', time: 'ca. 15 min' },
    { from: 'Amsterdam Noord', to: 'Schiphol Airport', price: 'Vanaf € 45,-', time: 'ca. 25 min' },
    { from: 'Utrecht Centraal', to: 'Schiphol Airport', price: 'Vanaf € 65,-', time: 'ca. 35 min' },
    { from: 'Rotterdam Centrum', to: 'Rotterdam The Hague Airport', price: 'Vanaf € 45,-', time: 'ca. 20 min' },
    { from: 'Den Haag Centrum', to: 'Schiphol Airport', price: 'Vanaf € 68,-', time: 'ca. 35 min' },
    { from: 'Amsterdam', to: 'Eindhoven Airport', price: 'Vanaf € 140,-', time: 'ca. 75 min' },
    { from: 'Amsterdam', to: 'Brussel Airport (Zaventem)', price: 'Vanaf € 220,-', time: 'ca. 125 min' },
  ];

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
            <span className="text-[#FFB800] font-bold">Diensten</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#FFB800] text-xs font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ons Dienstenpakket</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Compleet en betrouwbaar vervoer voor iedere reis
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
              Van snelle stadsritten en stipte Schiphol transfers tot zakelijk VIP vervoer en
              comfortabele groepsbussen: Taxi mooo biedt maatwerkoplossingen met vaste prijzen vooraf.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-20">
        {/* Service Cards Detailed List */}
        <div className="space-y-12">
          {serviceDetails.map((service, index) => (
            <div
              key={service.id}
              className={`bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(53,16,120,0.04)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image side */}
              <div
                className={`lg:col-span-5 relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-blue-50 ${
                  index % 2 === 1 ? 'lg:order-2' : ''
                }`}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[#00255c] text-[#FFD500] text-xs font-black shadow-md">
                    {service.tag}
                  </span>
                </div>
              </div>

              {/* Text details side */}
              <div
                className={`lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between ${
                  index % 2 === 1 ? 'lg:order-1' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#EBF2FC] text-[#00255c] flex items-center justify-center shrink-0 shadow-sm">
                      {service.icon}
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#07152B] tracking-tight">
                        {service.title}
                      </h2>
                      <span className="text-xs text-[#0B2559] font-bold">
                        Geschikt voor: {service.idealFor}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-[#00255c]">
                      Wat is altijd inbegrepen?
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#FFD500] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Vaste prijs garantie vooraf</span>
                  </div>

                  <button
                    onClick={onNavigateToBooking}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00255c] hover:bg-[#001331] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    <span>Reserveer deze dienst</span>
                    <ArrowRight className="w-4 h-4 text-[#FFD500]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Airport Rates Overview Table */}
        <section className="bg-gradient-to-br from-[#001331] to-[#00255c] rounded-3xl p-6 sm:p-10 lg:p-12 text-white">
          <div className="max-w-2xl mb-8 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-white/10 text-[#FFD500] text-xs font-extrabold uppercase tracking-wider">
              Transparante Tarieven
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Vaste Schiphol & Luchthaven Tarieven
            </h2>
            <p className="text-xs sm:text-sm text-blue-200">
              Onderstaande tarieven zijn richtprijzen voor een standaard luxe sedan inclusief bagage, btw
              en vluchtmonitoring. Geen verborgen toeslagen!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {airportRates.map((route, rIdx) => (
              <div
                key={rIdx}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 flex items-center justify-between hover:bg-white/15 transition"
              >
                <div>
                  <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>{route.from}</span>
                    <span className="text-[#FFD500]">⟶</span>
                    <span>{route.to}</span>
                  </div>
                  <div className="text-xs text-blue-200 mt-0.5">{route.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-base sm:text-lg font-black text-[#FFD500]">{route.price}</div>
                  <button
                    onClick={onNavigateToBooking}
                    className="text-[11px] font-bold text-white underline underline-offset-2 hover:text-[#FFD500] cursor-pointer"
                  >
                    Boek nu
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onNavigateToBooking}
              className="px-8 py-3.5 rounded-full bg-[#FFD500] hover:bg-yellow-400 text-[#07152B] font-black text-sm shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              Bereken jouw specifieke ritprijs
            </button>
          </div>
        </section>

        {/* Standard Inclusions Grid */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-[#07152B]">
              Standaard inbegrepen bij iedere rit van Taxi mooo
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Geen verborgen toeslagen of verrassingen. Deze voordelen zijn bij ons altijd gratis.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-[#EBF2FC] border border-slate-200">
              <Wifi className="w-6 h-6 text-[#00255c] mx-auto mb-2" />
              <div className="text-xs sm:text-sm font-bold text-[#07152B]">Gratis Snelle Wifi</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Online werken onderweg</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EBF2FC] border border-slate-200">
              <Luggage className="w-6 h-6 text-[#00255c] mx-auto mb-2" />
              <div className="text-xs sm:text-sm font-bold text-[#07152B]">Bagageservice</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Hulp bij tillen & inladen</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EBF2FC] border border-slate-200">
              <Clock className="w-6 h-6 text-[#00255c] mx-auto mb-2" />
              <div className="text-xs sm:text-sm font-bold text-[#07152B]">45 min Wachttijd</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Gratis na landing Schiphol</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EBF2FC] border border-slate-200">
              <CreditCard className="w-6 h-6 text-[#00255c] mx-auto mb-2" />
              <div className="text-xs sm:text-sm font-bold text-[#07152B]">Flexibel Betalen</div>
              <div className="text-[11px] text-gray-500 mt-0.5">iDEAL, PIN, Creditcard</div>
            </div>
          </div>
        </section>

        {/* Bottom Banner */}
        <section className="text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black text-[#07152B]">
            Heb je een speciale vervoerswens of groepsreis?
          </h3>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Voor meerdaagse congressen, bruiloften of speciale logistieke ritten maken we graag een
            offerte op maat.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onOpenContact}
              className="px-6 py-3 rounded-full bg-[#00255c] hover:bg-[#001331] text-white font-bold text-sm transition cursor-pointer"
            >
              Neem direct contact op
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
