import React from 'react';
import { X, Plane, Users, Briefcase } from 'lucide-react';

interface InfoModalProps {
  type: 'about' | 'services' | 'faq' | null;
  onClose: () => void;
}

export const InformationModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-[28px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#001331] to-[#00255c] text-white">
          <h3 className="font-bold text-lg">
            {type === 'about' && 'Over Taxi mooo'}
            {type === 'services' && 'Onze Diensten & Vervoer'}
            {type === 'faq' && 'Veelgestelde Vragen (FAQ)'}
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
                  Het Premium Taxibedrijf van Nederland
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Taxi mooo staat voor betrouwbaarheid, luxe en stiptheid. Gevestigd in Amsterdam en
                  actief in heel Nederland, bieden wij representatief vervoer in moderne
                  Mercedes-Benz voertuigen.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-[#07152B]">Onze Kernwaarden</h5>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FFD500] text-[#07152B] flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <span>100% Gecertificeerde chauffeurs met TX-Keurmerk</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FFD500] text-[#07152B] flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <span>Altijd schone, recente Mercedes-Benz wagenpark</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FFD500] text-[#07152B] flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <span>Vaste en transparante ritprijzen vooraf</span>
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
                    Stressvrij van en naar alle Nederlandse en Belgische luchthavens. Vaste lage
                    tarieven inclusief vluchtmonitoring.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                <Briefcase className="w-6 h-6 text-[#00255c] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-[#07152B]">Zakelijk Vervoer & VIP</h5>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Discreet directievervoer in representatieve Mercedes S-Klasse met wifi, water en
                    stille cabine. Rijden op factuur mogelijk.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                <Users className="w-6 h-6 text-[#00255c] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-[#07152B]">Groepsvervoer & Taxibus</h5>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Comfortabele Mercedes V-Klasse bussen tot 8 passagiers en ruime kofferbak voor
                    evenementen, tours of gezinnen.
                  </p>
                </div>
              </div>
            </div>
          )}

          {type === 'faq' && (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-xl">
                <h5 className="font-bold text-[#07152B] text-xs">
                  Hoe wordt de ritprijs berekend?
                </h5>
                <p className="text-xs text-gray-600 mt-1">
                  Je ritprijs wordt vooraf berekend op basis van de exacte afstand en rijtijd. Dit
                  is een vaste gegarandeerde prijs die nooit hoger uitvalt.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <h5 className="font-bold text-[#07152B] text-xs">Kan ik kosteloos annuleren?</h5>
                <p className="text-xs text-gray-600 mt-1">
                  Ja, je kunt tot 2 uur voor de afgesproken ophaaltijd kosteloos wijzigen of
                  annuleren via 'Mijn account' of telefonisch.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <h5 className="font-bold text-[#07152B] text-xs">Hoe kan ik betalen?</h5>
                <p className="text-xs text-gray-600 mt-1">
                  Je kunt online betalen via iDEAL of creditcard, of gemakkelijk achteraf in de taxi
                  met PIN of contant geld.
                </p>
              </div>
            </div>
          )}

          <div className="pt-3">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#00255c] hover:bg-[#001331] text-white font-bold rounded-xl transition cursor-pointer"
            >
              Sluiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
