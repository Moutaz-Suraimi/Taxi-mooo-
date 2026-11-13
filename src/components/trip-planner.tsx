import { useState } from 'react';
import { TaxiBookingForm, type BookingData } from './TaxiBookingForm';
import { FareCalculationModal } from './FareCalculationModal';

export function TripPlanner() {
  const [isFareModalOpen, setIsFareModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const handleCalculateFare = (data: BookingData) => {
    setBookingData(data);
    setIsFareModalOpen(true);
  };

  return (
    <section id="plan-je-rit" className="relative z-20 py-8 lg:py-14 scroll-mt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#FFB800] bg-[#FFB800]/10 rounded-full border border-[#FFB800]/20 mb-3">
            Direct online reserveren
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Bereken je ritprijs in <span className="text-[#FFB800]">30 seconden</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Vul je ophaaladres en bestemming in voor een vaste, transparante ritprijs zonder verborgen kosten.
          </p>
        </div>

        <TaxiBookingForm onCalculateFare={handleCalculateFare} />

        <FareCalculationModal
          isOpen={isFareModalOpen}
          onClose={() => setIsFareModalOpen(false)}
          bookingData={bookingData}
        />
      </div>
    </section>
  );
}
