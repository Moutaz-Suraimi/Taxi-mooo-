import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  Check,
  Phone,
  User as UserIcon,
  Mail,
  Car,
  Users,
  Calculator,
  Compass,
  Calendar,
  Luggage,
  Repeat,
} from 'lucide-react';
import type { BookingData } from './TaxiBookingForm';
import { adminBookingService } from '../services/adminBookingService';
import { useLanguage } from '../context/LanguageContext';
import { calculateRealisticDutchDistance } from '../utils/dutchDistanceService';

interface FareCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingData | null;
}

export const FareCalculationModal: React.FC<FareCalculationModalProps> = ({
  isOpen,
  onClose,
  bookingData,
}) => {
  const { t, language } = useLanguage();

  const [customerName, setCustomerName] = useState(() => {
    try {
      const u = localStorage.getItem('taximooo_user');
      return u ? JSON.parse(u).name || '' : '';
    } catch {
      return '';
    }
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    try {
      const u = localStorage.getItem('taximooo_user');
      return u ? JSON.parse(u).phone || '' : '';
    } catch {
      return '';
    }
  });
  const [customerEmail, setCustomerEmail] = useState(() => {
    try {
      const u = localStorage.getItem('taximooo_user');
      return u ? JSON.parse(u).email || '' : '';
    } catch {
      return '';
    }
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'ideal' | 'pin' | 'creditcard'>('cash');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRefId, setBookingRefId] = useState('');

  if (!isOpen || !bookingData) return null;

  // The vehicle is strictly the one selected during booking - NO selection inside the modal
  // Sedan: 1-4 passengers | Van/Bus: 5-7 passengers
  const selectedVehicle: 'klein' | 'groot' =
    bookingData.vehicleType || (bookingData.passengers > 4 ? 'groot' : 'klein');

  // Exact high-precision Dutch road distance and duration
  const distanceResult = calculateRealisticDutchDistance(
    bookingData.pickup,
    bookingData.destination,
    bookingData.stops.length
  );
  const estimatedKm = distanceResult.km;
  const estimatedMins = distanceResult.durationMinutes;

  const returnMultiplier = bookingData.isReturnTrip ? 2 : 1;

  // Exact rates:
  // Kleine auto (Sedan 1-4 pers.): Afstand * 2.39 euro
  // Grote auto (Taxibus 1-7 pers.): Afstand * 3.04 euro
  const kleineKmRate = 2.39;
  const groteKmRate = 3.04;

  const currentRate = selectedVehicle === 'klein' ? kleineKmRate : groteKmRate;
  const currentPrice = Number((estimatedKm * currentRate * returnMultiplier).toFixed(2));

  const formattedPickupDate =
    bookingData.pickupDateType === 'vandaag'
      ? new Date().toISOString().split('T')[0]
      : bookingData.pickupDateType === 'morgen'
      ? new Date(Date.now() + 86400000).toISOString().split('T')[0]
      : bookingData.customDate || new Date().toISOString().split('T')[0];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `#MOOO-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRefId(generatedId);

    // Save order into Admin Dispatch System
    adminBookingService.saveOrder({
      id: generatedId,
      createdAt: new Date().toISOString(),
      status: 'nieuw',
      pickup: bookingData.pickup,
      destination: bookingData.destination,
      stops: bookingData.stops,
      estimatedKm,
      estimatedDurationMins: estimatedMins,
      pickupDate: formattedPickupDate,
      pickupTime: bookingData.pickupTime || '12:00',
      isReturnTrip: Boolean(bookingData.isReturnTrip),
      returnDate: bookingData.isReturnTrip ? bookingData.returnDate : undefined,
      returnTime: bookingData.isReturnTrip ? bookingData.returnTime : undefined,
      vehicleType: selectedVehicle,
      passengers: bookingData.passengers,
      hasLuggage: Boolean(bookingData.hasLuggage),
      kmRate: currentRate,
      totalFare: currentPrice,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      paymentMethod,
      paymentStatus: paymentMethod === 'ideal' ? 'betaald' : 'bij_chauffeur',
    });

    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-[28px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#001331] to-[#00255c] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFD500] text-[#07152B] flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-lg">{t('fare.title')}</h3>
              <p className="text-xs text-blue-200">{t('fare.fixedPriceGuaranteed')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isBooked ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>
              <h4 className="text-2xl font-black text-[#07152B]">{t('fare.bookingSuccess')}</h4>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                {t('fare.thankYou')} <strong className="text-[#00255c]">{customerName}</strong>! {t('fare.confirmationSent')} <strong className="text-[#00255c]">{bookingRefId}</strong> {t('fare.sentTo')} <strong>{customerEmail}</strong>.
              </p>

              <div className="p-4 bg-[#EBF2FC] rounded-2xl border border-slate-200 text-left max-w-md mx-auto text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('fare.from')}</span>
                  <span className="font-bold text-[#07152B] truncate max-w-[240px]">{bookingData.pickup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('fare.to')}</span>
                  <span className="font-bold text-[#07152B] truncate max-w-[240px]">{bookingData.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('fare.calculatedDistance')}:</span>
                  <span className="font-bold text-[#07152B]">{estimatedKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('fare.vehicle')}</span>
                  <span className="font-bold text-[#00255c]">
                    {selectedVehicle === 'klein' ? t('fare.smallCar') : t('fare.largeCar')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('fare.kmRate')}</span>
                  <span className="font-bold text-[#07152B]">€{currentRate.toFixed(2)} / km</span>
                </div>
                <div className="flex justify-between text-base pt-2 border-t border-slate-200 font-extrabold text-[#07152B]">
                  <span>{t('fare.totalFare')}</span>
                  <span className="text-[#24B65A]">€{currentPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-[#00255c] text-white font-bold hover:bg-[#001331] transition cursor-pointer"
                >
                  {t('fare.closeWindow')}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Trip Details Summary Card (Read-Only: shows only what was booked in the booking form) */}
              <div className="p-4 sm:p-5 bg-[#EBF2FC] rounded-2xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00255c] text-[#FFD500] flex items-center justify-center font-bold text-sm">
                      TAXI
                    </div>
                    <div>
                      <div className="text-xs uppercase font-bold tracking-wider text-[#0B2559]">
                        {t('fare.bookedSummary')}
                      </div>
                      <div className="text-sm font-extrabold text-[#07152B]">
                        {estimatedKm} km • ca. {estimatedMins} {t('fare.minutes')}
                      </div>
                    </div>
                  </div>
                  {bookingData.isReturnTrip && (
                    <span className="px-3 py-1 bg-[#FFD500] text-[#07152B] text-xs font-bold rounded-full">
                      {t('fare.includesReturn')}
                    </span>
                  )}
                </div>

                {/* ── Vehicle Photo Card (Sedan vs Minibus) ── */}
                <div className="flex flex-col sm:flex-row items-center gap-3.5 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="relative w-full sm:w-36 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white flex items-center justify-center">
                    <img
                      src={selectedVehicle === 'klein' ? '/chauffeur-mercedes-web.jpg' : '/grote-auto.png'}
                      alt={selectedVehicle === 'klein' ? 'Mercedes Sedan' : 'Grote auto'}
                      className={`w-full h-full ${selectedVehicle === 'klein' ? 'object-cover' : 'object-contain p-1'}`}
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#001331]/90 text-[#FFD500] text-[10px] font-black shadow">
                      {selectedVehicle === 'klein' ? '1–4 pers.' : '1–7 pers.'}
                    </span>
                  </div>
                  <div className="flex-1 w-full text-start">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-[#00255c] uppercase tracking-wider">
                        {selectedVehicle === 'klein' ? t('booking.smallCar') : t('booking.largeCar')}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {language === 'ar' ? 'السيارة المختارة' : language === 'es' ? 'Vehículo seleccionado' : language === 'en' ? 'Selected vehicle' : 'Gekozen voertuig'}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#07152B] mt-0.5">
                      {selectedVehicle === 'klein' ? 'Mercedes-Benz E-Class Sedan' : 'Mercedes-Benz V-Class Taxibus'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {selectedVehicle === 'klein'
                        ? (language === 'ar'
                            ? 'سيدان فاخرة ومريحة تستوعب حتى 4 ركاب مع حقائب السفر.'
                            : language === 'es'
                            ? 'Sedán confortable de lujo para hasta 4 pasajeros con equipaje.'
                            : language === 'en'
                            ? 'Comfortable luxury sedan for up to 4 passengers with luggage.'
                            : 'Comfortabele sedan voor max. 4 passagiers met bagage.')
                        : (language === 'ar'
                            ? 'باص وفان عائلي واسع ومريح يستوعب حتى 7 ركاب مع مساحة أمتعة رحبة.'
                            : language === 'es'
                            ? 'Minibús espacioso para hasta 7 pasajeros con amplia capacidad de equipaje.'
                            : language === 'en'
                            ? 'Spacious passenger van for up to 7 passengers with generous luggage capacity.'
                            : 'Ruime taxibus voor max. 7 passagiers met royale bagageruimte.')}
                    </p>
                  </div>
                </div>

                {/* Route addresses */}
                <div className="space-y-2 text-sm bg-white p-3.5 rounded-xl border border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
                    <span className="text-gray-500 text-xs font-semibold">{t('fare.from')}</span>
                    <span className="font-semibold text-[#07152B] truncate">{bookingData.pickup}</span>
                  </div>
                  {bookingData.stops.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 pl-1">
                      <div className="w-2 h-2 rounded-full bg-[#FFB800] shrink-0" />
                      <span className="text-gray-500 text-xs font-semibold">{t('fare.stop')} {i + 1}:</span>
                      <span className="font-medium text-[#07152B] truncate">{s}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                    <span className="text-gray-500 text-xs font-semibold">{t('fare.to')}</span>
                    <span className="font-semibold text-[#07152B] truncate">{bookingData.destination}</span>
                  </div>
                </div>

                {/* Booked options grid: Vehicle, Passengers, Luggage, Date/Time */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  {/* Vehicle chosen during booking */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex flex-col gap-1">
                    <span className="text-gray-500 text-[11px] font-medium flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-[#00255c]" />
                      {t('fare.vehicle')}
                    </span>
                    <span className="font-bold text-[#07152B] truncate">
                      {selectedVehicle === 'klein' ? t('fare.smallCar') : t('fare.largeCar')}
                    </span>
                  </div>

                  {/* Passengers */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex flex-col gap-1">
                    <span className="text-gray-500 text-[11px] font-medium flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#00255c]" />
                      {t('fare.passengers')}
                    </span>
                    <span className="font-bold text-[#07152B]">
                      {bookingData.passengers} {bookingData.passengers > 1 ? t('fare.passengersUnit') : t('fare.passengerUnit')}
                    </span>
                  </div>

                  {/* Luggage */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex flex-col gap-1">
                    <span className="text-gray-500 text-[11px] font-medium flex items-center gap-1">
                      <Luggage className="w-3.5 h-3.5 text-[#00255c]" />
                      {t('fare.luggage')}
                    </span>
                    <span className="font-bold text-[#07152B]">
                      {bookingData.hasLuggage ? t('booking.yes') : t('booking.no')}
                    </span>
                  </div>

                  {/* Pickup date & time */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex flex-col gap-1">
                    <span className="text-gray-500 text-[11px] font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#00255c]" />
                      {t('fare.pickupDate')}
                    </span>
                    <span className="font-bold text-[#07152B] truncate">
                      {formattedPickupDate} {bookingData.pickupTime}
                    </span>
                  </div>
                </div>

                {/* Return Trip Details if selected */}
                {bookingData.isReturnTrip && (
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                      <Repeat className="w-3.5 h-3.5 text-[#00255c]" />
                      {t('fare.returnTrip')}
                    </span>
                    <span className="font-bold text-[#00255c]">
                      {bookingData.returnDate} • {bookingData.returnTime}
                    </span>
                  </div>
                )}

                {/* Google Maps Route Link */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                      bookingData.pickup
                    )}&destination=${encodeURIComponent(bookingData.destination)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00255c] hover:text-[#001331] hover:underline cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#00255c]" />
                    <span>{t('fare.viewMaps')}</span>
                  </a>
                  <span className="text-[11px] text-gray-400">{t('fare.netherlands')}</span>
                </div>
              </div>

              {/* Price Banner (Read-only fixed price summary) */}
              <div className="p-4.5 bg-gradient-to-r from-[#001331] to-[#00255c] rounded-2xl text-white shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      {selectedVehicle === 'klein' ? (
                        <Car className="w-6 h-6 text-[#FFD500]" />
                      ) : (
                        <Users className="w-6 h-6 text-[#FFD500]" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-sm block text-white">
                        {selectedVehicle === 'klein' ? t('fare.smallCar') : t('fare.largeCar')}
                      </span>
                      <span className="text-xs text-blue-200 flex items-center gap-1.5 mt-0.5">
                        <Calculator className="w-3.5 h-3.5 text-[#FFD500]" />
                        <span>
                          {estimatedKm} km × €{currentRate.toFixed(2)}
                          {bookingData.isReturnTrip ? ` × 2 (${t('fare.return')})` : ''}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider block font-bold text-blue-200">
                      {t('fare.totalFare')}
                    </span>
                    <span className="text-3xl font-black text-[#FFD500]">
                      €{currentPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Contact & Booking Details Form */}
              <form onSubmit={handleConfirmBooking} className="space-y-4 pt-1">
                <h4 className="text-sm font-bold text-[#07152B]">{t('fare.contactDetails')}</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t('fare.name')}
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                      <UserIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <input
                        type="text"
                        required
                        placeholder={t('fare.namePlaceholder')}
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-transparent text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t('fare.phone')}
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <input
                        type="tel"
                        required
                        placeholder={t('fare.phonePlaceholder')}
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-transparent text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t('fare.email')}
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type="email"
                      required
                      placeholder={t('fare.emailPlaceholder')}
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-800">
                      {t('fare.paymentMethod')}
                    </label>
                    <span className="text-[11px] font-semibold text-gray-500">
                      {t('fare.fixedGuarantee')}
                    </span>
                  </div>

                  {/* Payment Methods Section with Taxi Mooo Identity */}
                  <div className="bg-[#0b0f19] rounded-2xl p-3.5 border border-zinc-800 space-y-2.5">
                    {/* 1. CASH (Only Available & Selectable) */}
                    <div
                      onClick={() => setPaymentMethod('cash')}
                      role="button"
                      tabIndex={0}
                      className="relative w-full p-3.5 rounded-xl bg-black border-2 border-[#FFC400] text-white shadow-lg shadow-[#FFC400]/10 flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FFC400]/15 border border-[#FFC400]/30 flex items-center justify-center text-[#FFC400] shrink-0">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{t('fare.cash')}</span>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFC400] text-black">
                              {t('fare.available')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 mt-0.5">
                            {t('fare.cashDesc')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        <div className="w-6 h-6 rounded-full bg-[#FFC400] text-black flex items-center justify-center font-bold shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                    </div>

                    {/* 2. DISABLED PAYMENT METHODS (Coming Soon) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5">
                      {/* iDEAL */}
                      <div
                        aria-disabled="true"
                        className="relative overflow-hidden rounded-xl bg-zinc-900/90 border border-zinc-800/80 p-3 flex flex-col items-center justify-center text-center gap-1.5 opacity-65 cursor-not-allowed select-none"
                      >
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[0.5px] pointer-events-none" />
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <CreditCard className="w-4 h-4 text-zinc-400" />
                          <span className="text-xs font-semibold text-zinc-200">iDEAL</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800/95 text-[#FFC400] border border-zinc-700/70 mt-0.5">
                            {t('fare.comingSoon')}
                          </span>
                        </div>
                      </div>

                      {/* Online PIN in Taxi */}
                      <div
                        aria-disabled="true"
                        className="relative overflow-hidden rounded-xl bg-zinc-900/90 border border-zinc-800/80 p-3 flex flex-col items-center justify-center text-center gap-1.5 opacity-65 cursor-not-allowed select-none"
                      >
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[0.5px] pointer-events-none" />
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <Smartphone className="w-4 h-4 text-zinc-400" />
                          <span className="text-xs font-semibold text-zinc-200">Online PIN</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800/95 text-[#FFC400] border border-zinc-700/70 mt-0.5">
                            {t('fare.comingSoon')}
                          </span>
                        </div>
                      </div>

                      {/* Credit Card */}
                      <div
                        aria-disabled="true"
                        className="relative overflow-hidden rounded-xl bg-zinc-900/90 border border-zinc-800/80 p-3 flex flex-col items-center justify-center text-center gap-1.5 opacity-65 cursor-not-allowed select-none"
                      >
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[0.5px] pointer-events-none" />
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <CreditCard className="w-4 h-4 text-zinc-400" />
                          <span className="text-xs font-semibold text-zinc-200">Credit Card</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800/95 text-[#FFC400] border border-zinc-700/70 mt-0.5">
                            {t('fare.comingSoon')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Submit & Confirmation */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#24B65A] to-[#1fa251] hover:from-[#1fa251] hover:to-[#1a8e45] text-white text-base font-bold shadow-lg shadow-green-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t('fare.confirmButton')} €{currentPrice.toFixed(2)}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-center text-[11px] text-gray-400 mt-2">
                    {t('fare.cancellationPolicy')}
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
