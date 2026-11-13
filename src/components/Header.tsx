import React from 'react';
import { User, Menu, X, Phone } from 'lucide-react';
import { Logo } from './Logo';

export type PageType = 'home' | 'about' | 'services' | 'reviews' | 'faq' | 'contact' | 'admin';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenAccount: () => void;
  onScrollToReviews?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenAccount,
  onScrollToReviews,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleReviewsClick = () => {
    if (onScrollToReviews) { onScrollToReviews(); return; }
    onNavigate('reviews');
  };

  const navItems = [
    { label: 'Home',               page: 'home'     as PageType, action: () => onNavigate('home') },
    { label: 'Over ons',           page: 'about'    as PageType, action: () => onNavigate('about') },
    { label: 'Diensten',           page: 'services' as PageType, action: () => onNavigate('services') },
    { label: 'Reviews',            page: 'reviews'  as PageType, action: handleReviewsClick },
    { label: 'Veelgestelde vragen',page: 'faq'      as PageType, action: () => onNavigate('faq') },
    { label: 'Contact',            page: 'contact'  as PageType, action: () => onNavigate('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#000E24]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/25 transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <div onClick={() => onNavigate('home')} className="cursor-pointer shrink-0">
          <Logo size="lg" />
        </div>

        {/* ── Desktop nav ── */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/8 backdrop-blur-md border border-white/12 rounded-full px-2 py-1.5">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FFB800] text-[#001331] shadow-md shadow-[#FFB800]/30 font-bold'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* ── Right: phone + account ── */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:+31641212427"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-[#FFB800] transition-colors"
          >
            <Phone className="w-4 h-4 text-[#FFB800]" />
            <span>+31 6 41212427</span>
          </a>

          <button
            onClick={onOpenAccount}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FFB800] hover:bg-[#FFA500] text-[#001331] font-bold text-sm shadow-md shadow-[#FFB800]/25 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Mijn account</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pb-4">
          <div className="p-4 rounded-2xl bg-[#001331]/95 border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.label}
                    onClick={() => { item.action(); setMobileMenuOpen(false); }}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#FFB800] text-[#001331] font-bold'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              <div className="pt-3 mt-1 border-t border-white/10 flex flex-col gap-2">
                <a
                  href="tel:+31641212427"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white/90 hover:bg-white/10 transition"
                >
                  <Phone className="w-4 h-4 text-[#FFB800]" />
                  +31 6 41212427
                </a>
                <button
                  onClick={() => { onOpenAccount(); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FFB800] text-[#001331] font-bold hover:bg-[#FFA500] transition"
                >
                  <User className="w-4 h-4" />
                  Mijn account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
