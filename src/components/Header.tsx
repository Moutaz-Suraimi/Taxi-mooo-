import React, { useState, useEffect } from 'react';
import { User, Menu, X, Phone, Globe, ChevronDown, Check } from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';

export type PageType = 'home' | 'about' | 'services' | 'reviews' | 'faq' | 'contact' | 'admin' | 'dashboard';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Check if user is logged in
  const [user, setUser] = useState<{ name?: string; isLoggedIn?: boolean } | null>(null);

  useEffect(() => {
    const checkUser = () => {
      try {
        const s = localStorage.getItem('taximooo_user');
        if (!s) {
          setUser(null);
          return;
        }
        const u = JSON.parse(s);
        if (u?.isLoggedIn) {
          setUser(u);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const isLoggedIn = !!user?.isLoggedIn;

  const handleAccountClick = () => {
    if (isLoggedIn) {
      onNavigate('dashboard');
    } else {
      onOpenAccount();
    }
  };

  const handleReviewsClick = () => {
    if (onScrollToReviews) {
      onScrollToReviews();
      return;
    }
    onNavigate('reviews');
  };

  const navItems = [
    { label: t('nav.home'),     page: 'home'     as PageType, action: () => onNavigate('home') },
    { label: t('nav.about'),    page: 'about'    as PageType, action: () => onNavigate('about') },
    { label: t('nav.services'), page: 'services' as PageType, action: () => onNavigate('services') },
    { label: t('nav.reviews'),  page: 'reviews'  as PageType, action: handleReviewsClick },
    { label: t('nav.faq'),      page: 'faq'      as PageType, action: () => onNavigate('faq') },
    { label: t('nav.contact'),  page: 'contact'  as PageType, action: () => onNavigate('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#000E24]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/25 transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-2.5 sm:py-3 flex items-center justify-between gap-3 lg:gap-6">

        {/* ── Brand Logo ── */}
        <div
          onClick={() => onNavigate('home')}
          className="cursor-pointer shrink-0 transition-transform duration-200 hover:scale-[1.02] flex items-center"
        >
          <Logo size="lg" />
        </div>

        {/* ── Desktop Center Navigation Bar ── */}
        <nav className="hidden xl:flex items-center gap-1 bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5 shadow-inner">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FFB800] text-[#001331] shadow-md shadow-[#FFB800]/30 font-bold scale-[1.02]'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* ── Compact Navigation for Laptops (lg screens) ── */}
        <nav className="hidden lg:flex xl:hidden items-center gap-0.5 bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-full px-1.5 py-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FFB800] text-[#001331] font-bold shadow-sm'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* ── Right Action Controls ── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* ── Language Switcher Button ── */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#FFB800]/50 text-white transition-all cursor-pointer text-xs font-bold"
              aria-label="Language selection"
            >
              <Globe className="w-3.5 h-3.5 text-[#FFB800]" />
              <span className="tracking-wide">
                {language === 'nl' ? '🇳🇱 NL' : language === 'en' ? '🇬🇧 EN' : language === 'ar' ? '🇸🇦 AR' : '🇪🇸 ES'}
              </span>
              <ChevronDown className="w-3 h-3 text-white/60" />
            </button>

            {/* Language Dropdown Menu */}
            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className="absolute end-0 mt-2 w-40 bg-[#001331] border border-white/15 rounded-2xl shadow-2xl py-1.5 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    type="button"
                    onClick={() => { setLanguage('nl'); setLangDropdownOpen(false); }}
                    className={`w-full px-3.5 py-2 text-start text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      language === 'nl'
                        ? 'bg-[#FFB800] text-[#001331]'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>🇳🇱</span> Nederlands
                    </span>
                    {language === 'nl' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                    className={`w-full px-3.5 py-2 text-start text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      language === 'en'
                        ? 'bg-[#FFB800] text-[#001331]'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>🇬🇧</span> English
                    </span>
                    {language === 'en' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLanguage('ar'); setLangDropdownOpen(false); }}
                    className={`w-full px-3.5 py-2 text-start text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      language === 'ar'
                        ? 'bg-[#FFB800] text-[#001331]'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>🇸🇦</span> العربية
                    </span>
                    {language === 'ar' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLanguage('es'); setLangDropdownOpen(false); }}
                    className={`w-full px-3.5 py-2 text-start text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      language === 'es'
                        ? 'bg-[#FFB800] text-[#001331]'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>🇪🇸</span> Español
                    </span>
                    {language === 'es' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── Direct Phone Call Pill ── */}
          <a
            href="tel:+31641212427"
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.08] hover:bg-white/15 border border-white/10 hover:border-[#FFB800]/40 text-xs sm:text-sm font-semibold text-white/90 hover:text-[#FFB800] transition-all"
            title="Bel Taxi mooo direct"
          >
            <Phone className="w-3.5 h-3.5 text-[#FFB800]" />
            <span className="font-mono tracking-tight">+31 6 41212427</span>
          </a>

          {/* ── Account / Dashboard CTA Button ── */}
          <button
            type="button"
            onClick={handleAccountClick}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#FFB800] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FF9500] text-[#001331] font-extrabold text-xs sm:text-sm shadow-md shadow-[#FFB800]/25 hover:shadow-lg transition-all duration-200 cursor-pointer shrink-0"
          >
            <div className="relative">
              <User className="w-4 h-4" />
              {isLoggedIn && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 border border-[#001331]" />
              )}
            </div>
            <span className="hidden xs:inline">
              {isLoggedIn ? (user?.name ? user.name.split(' ')[0] : t('nav.account')) : t('nav.account')}
            </span>
          </button>

          {/* ── Mobile Hamburger Menu Toggle ── */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
            aria-label="Menu openen"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pb-4 animate-in slide-in-from-top-4 duration-200">
          <div className="p-4 rounded-3xl bg-[#001331]/95 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-3">

            {/* Language Switcher in Mobile Drawer */}
            <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#FFB800]" />
                {t('nav.lang')}:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLanguage('nl')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    language === 'nl'
                      ? 'bg-[#FFB800] text-[#001331]'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  NL
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    language === 'en'
                      ? 'bg-[#FFB800] text-[#001331]'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ar')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    language === 'ar'
                      ? 'bg-[#FFB800] text-[#001331]'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  عربي
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('es')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    language === 'es'
                      ? 'bg-[#FFB800] text-[#001331]'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  ES
                </button>
              </div>
            </div>

            {/* Nav list */}
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setMobileMenuOpen(false);
                    }}
                    className={`text-start px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#FFB800] text-[#001331] font-black shadow-sm'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Phone & Account buttons */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <a
                href="tel:+31641212427"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-white/90 bg-white/5 hover:bg-white/10 transition border border-white/10"
              >
                <Phone className="w-4 h-4 text-[#FFB800]" />
                <span>+31 6 41212427</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  handleAccountClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#FFB800] to-[#FFA500] text-[#001331] font-black text-sm shadow-md transition cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{isLoggedIn ? (user?.name || t('nav.account')) : t('nav.account')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
