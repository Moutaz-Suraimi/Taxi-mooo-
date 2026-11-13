import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, ShieldCheck, ArrowUp } from 'lucide-react';
import type { PageType } from './Header';

interface FooterProps {
  onNavigate: (page: PageType) => void;
  onOpenContactModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenContactModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#000E24] text-white pt-16 pb-12 border-t border-blue-950/60">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-blue-900/40">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div onClick={() => onNavigate('home')} className="cursor-pointer inline-block">
              <Logo size="lg" />
            </div>
            <p className="text-xs sm:text-sm text-blue-200/80 leading-relaxed">
              Taxi mooo is dé betrouwbare, luxe en punctuele taxidienst in Nederland. 24/7
              beschikbaar voor stadsritten, zakelijk vervoer en luchthaventransfers in representatieve
              Mercedes-Benz wagens.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFB800]/15 text-[#FFB800] text-xs font-bold border border-[#FFB800]/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>TX-Keurmerk Erkend</span>
              </span>
            </div>
          </div>

          {/* Col 2: Snelle Links naar Pagina's */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm tracking-wider uppercase text-[#FFB800]">
              Pagina's & Info
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-blue-200/80">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#FFB800] transition cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Home / Boek een taxi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#FFB800] transition cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Over Taxi mooo</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#FFB800] transition cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Onze Diensten & Vloot</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-[#FFB800] transition cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Klantbeoordelingen (Reviews)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-[#FFB800] transition cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Veelgestelde vragen (FAQ)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#FFB800] transition cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Contact & Dispatch Centrale</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Populaire Luchthaventransfers */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm tracking-wider uppercase text-[#FFB800]">
              Luchthaventransfers
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-blue-200/80">
              <li className="flex justify-between items-center py-0.5">
                <span>Amsterdam ⟶ Schiphol</span>
                <span className="text-[#FFB800] font-bold">vanaf €38</span>
              </li>
              <li className="flex justify-between items-center py-0.5">
                <span>Utrecht ⟶ Schiphol</span>
                <span className="text-[#FFB800] font-bold">vanaf €65</span>
              </li>
              <li className="flex justify-between items-center py-0.5">
                <span>Rotterdam ⟶ The Hague Airport</span>
                <span className="text-[#FFB800] font-bold">vanaf €45</span>
              </li>
              <li className="flex justify-between items-center py-0.5">
                <span>Amsterdam ⟶ Eindhoven Airport</span>
                <span className="text-[#FFB800] font-bold">vanaf €140</span>
              </li>
              <li className="flex justify-between items-center py-0.5">
                <span>Amsterdam ⟶ Brussel Airport</span>
                <span className="text-[#FFB800] font-bold">vanaf €220</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct Contact & Centrale */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm tracking-wider uppercase text-[#FFB800]">
              Centrale & Contact
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-blue-200/80">
              <li>
                <a
                  href="tel:+31641212427"
                  className="flex items-center gap-2.5 hover:text-[#FFB800] transition"
                >
                  <Phone className="w-4 h-4 text-[#FFB800] shrink-0" />
                  <span className="font-semibold text-white">+31 6 41212427 (24/7)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/31641212427"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 hover:text-green-400 transition"
                >
                  <span className="w-4 h-4 rounded-full bg-green-500 text-[#001331] flex items-center justify-center text-[10px] font-bold">
                    W
                  </span>
                  <span>WhatsApp: +31 6 41212427</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@taximooo.nl"
                  className="flex items-center gap-2.5 hover:text-[#FFB800] transition"
                >
                  <Mail className="w-4 h-4 text-[#FFB800] shrink-0" />
                  <span>info@taximooo.nl</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                <span>Corelia de Langestraat 208, 2037 NR Haarlem</span>
              </li>
              {onOpenContactModal && (
                <li>
                  <button
                    onClick={onOpenContactModal}
                    className="text-xs text-[#FFB800] hover:underline cursor-pointer"
                  >
                    Direct contactformulier openen
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal & Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300/60">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} Taxi mooo B.V. Alle rechten voorbehouden.</span>
            <span>•</span>
            <span>KvK: 84920192</span>
            <span>•</span>
            <span className="text-[#FFB800] font-semibold">Taxi mooo</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-white transition cursor-pointer"
            >
              Contact
            </button>
            <button
              onClick={() => onNavigate('faq')}
              className="hover:text-white transition cursor-pointer"
            >
              FAQ
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-[#FFB800] transition cursor-pointer font-semibold text-blue-200/80 flex items-center gap-1"
              title="Centrale Dispatch & Beheersysteem"
            >
              <span>Beheer</span>
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#00173d] hover:bg-[#002254] text-blue-200 hover:text-white transition cursor-pointer border border-blue-900/40"
              title="Terug naar boven"
            >
              <span>Naar boven</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
