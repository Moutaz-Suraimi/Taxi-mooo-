import { useState, useEffect } from 'react';
import { Header, type PageType } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TaxiBookingForm, type BookingData } from './components/TaxiBookingForm';
import { FeaturesSection } from './components/FeaturesSection';
import { TrustCardsSection } from './components/TrustCardsSection';
import { NationwideTaxiSection } from './components/NationwideTaxiSection';
import { ServicesSection } from './components/ServicesSection';
import { AboutPreviewSection } from './components/AboutPreviewSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FaqPreviewSection } from './components/FaqPreviewSection';
import { ContactPreviewSection } from './components/ContactPreviewSection';
import { PromotionalBanner } from './components/PromotionalBanner';
import { Footer } from './components/Footer';
import { FareCalculationModal } from './components/FareCalculationModal';
import { AccountModal } from './components/AccountModal';
import { ContactModal } from './components/ContactModal';
import { InformationModal } from './components/InformationModal';

// Dedicated Pages
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ClientDashboard } from './pages/ClientDashboard';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    if (window.location.hash === '#admin') return 'admin';
    if (window.location.hash === '#dashboard') return 'dashboard';
    return 'home';
  });
  const [isFareModalOpen, setIsFareModalOpen] = useState(false);
  const [currentBookingData, setCurrentBookingData] = useState<BookingData | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'about' | 'services' | 'faq' | null>(null);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCalculateFare = (data: BookingData) => {
    setCurrentBookingData(data);
    setIsFareModalOpen(true);
  };

  const handleNavigateToBookingForm = () => {
    navigateTo('home');
    setTimeout(() => {
      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  // Listen to hash change for #admin and #dashboard routes
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setCurrentPage('admin');
      } else if (window.location.hash === '#dashboard') {
        setCurrentPage('dashboard');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Full-screen Admin Dashboard view
  if (currentPage === 'admin') {
    return (
      <AdminDashboard
        onExit={() => {
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
          navigateTo('home');
        }}
      />
    );
  }

  // ── Client dashboard (full-screen, no header/footer) ──
  if (currentPage === 'dashboard') {
    return (
      <ClientDashboard
        onExit={() => {
          if (window.location.hash === '#dashboard') {
            window.location.hash = '';
          }
          navigateTo('home');
        }}
        onOpenAccount={() => setIsAccountModalOpen(true)}
        onNavigateToContact={() => navigateTo('contact')}
      />
    );
  }

  const isHome = currentPage === 'home';

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#FFB800] selection:text-[#001331]">

      {/* ══════════════════════════════════════════
          HERO ZONE — dark navy, full-bleed photo
      ══════════════════════════════════════════ */}
      <div className={`relative ${isHome ? '' : 'bg-gradient-to-r from-[#001331] via-[#001a40] to-[#00255c]'}`}>

        {/* Header always floats on top of whatever background */}
        <Header
          currentPage={currentPage}
          onNavigate={navigateTo}
          onOpenAccount={() => {
            // If already logged in, go straight to dashboard
            try {
              const s = localStorage.getItem('taximooo_user');
              if (s && JSON.parse(s)?.isLoggedIn) {
                navigateTo('dashboard');
                return;
              }
            } catch {}
            setIsAccountModalOpen(true);
          }}
        />

        {/* Hero only on home page – the photo + overlays are inside HeroSection */}
        {isHome && <HeroSection />}
      </div>

      {/* ══════════════════════════════════════════
          CONTENT AREA — light grey / white
      ══════════════════════════════════════════ */}
      <main className="flex-1 bg-[#F4F7FB]">

        {isHome && (
          <>
            {/* ① Booking form – negative margin pulls it up over the hero's bottom fade */}
            <div
              id="booking-form"
              className="relative z-10 -mt-6 sm:-mt-10"
            >
              <TaxiBookingForm onCalculateFare={handleCalculateFare} />
            </div>

            {/* ② 4 Feature icon strip */}
            <FeaturesSection />

            {/* ③ 3 Trust cards */}
            <TrustCardsSection />

            {/* ④ Nationwide section with chauffeur photo */}
            <NationwideTaxiSection
              onNavigateToBooking={handleNavigateToBookingForm}
              onNavigateToServices={() => navigateTo('services')}
            />

            {/* ⑤ Services cards with photos */}
            <ServicesSection
              onNavigateToServices={() => navigateTo('services')}
              onSelectService={() => navigateTo('services')}
            />

            {/* ⑥ About preview (dark gradient card) */}
            <AboutPreviewSection onNavigateToAbout={() => navigateTo('about')} />

            {/* ⑦ Reviews */}
            <ReviewsSection onNavigateToReviews={() => navigateTo('reviews')} />

            {/* ⑧ FAQ accordion */}
            <FaqPreviewSection
              onNavigateToFaq={() => navigateTo('faq')}
              onOpenContact={() => navigateTo('contact')}
            />

            {/* ⑨ Contact teaser */}
            <ContactPreviewSection
              onNavigateToContact={() => navigateTo('contact')}
              onOpenContactModal={() => navigateTo('contact')}
            />

            {/* ⑩ Promotional banner */}
            <PromotionalBanner onOpenContact={() => navigateTo('contact')} />
          </>
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigateHome={() => navigateTo('home')}
            onNavigateToBooking={handleNavigateToBookingForm}
            onOpenContact={() => navigateTo('contact')}
          />
        )}
        {currentPage === 'services' && (
          <ServicesPage
            onNavigateHome={() => navigateTo('home')}
            onNavigateToBooking={handleNavigateToBookingForm}
            onOpenContact={() => navigateTo('contact')}
          />
        )}
        {currentPage === 'reviews' && (
          <ReviewsPage
            onNavigateHome={() => navigateTo('home')}
            onNavigateToBooking={handleNavigateToBookingForm}
          />
        )}
        {currentPage === 'faq' && (
          <FaqPage
            onNavigateHome={() => navigateTo('home')}
            onOpenContact={() => navigateTo('contact')}
            onNavigateToBooking={handleNavigateToBookingForm}
          />
        )}
        {currentPage === 'contact' && (
          <ContactPage
            onNavigateHome={() => navigateTo('home')}
            onNavigateToBooking={handleNavigateToBookingForm}
          />
        )}
      </main>

      {/* ══════════════════════════════════════════
          FOOTER — deep navy
      ══════════════════════════════════════════ */}
      <Footer
        onNavigate={navigateTo}
        onOpenContactModal={() => navigateTo('contact')}
      />

      {/* ══════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════ */}
      <FareCalculationModal
        isOpen={isFareModalOpen}
        onClose={() => setIsFareModalOpen(false)}
        bookingData={currentBookingData}
      />
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onLoginSuccess={() => { setIsAccountModalOpen(false); navigateTo('dashboard'); }}
      />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
      <InformationModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />
    </div>
  );
}

export default App;
