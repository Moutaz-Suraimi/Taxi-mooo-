import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  Plus,
  Trash2,
  Luggage,
  Users,
  Calendar,
  Repeat,
  Calculator,
  ArrowRight,
  Clock,
  AlertCircle,
  Car,
  CheckCircle2,
  LocateFixed,
  Loader2,
  Plane,
  Train,
  Building,
  Compass,
  X,
} from 'lucide-react';
import {
  DUTCH_POPULAR_PLACES,
  searchOfflineDutchPlaces,
  fetchLiveDutchAddressSuggestions,
  reverseGeocodeDutchGPS,
  type DutchPlace,
} from '../utils/dutchAddressService';
import { saveAddressCoordinates } from '../utils/dutchDistanceService';
import { useLanguage } from '../context/LanguageContext';

export interface BookingData {
  pickup: string;
  destination: string;
  stops: string[];
  vehicleType: 'klein' | 'groot';
  hasLuggage: boolean;
  passengers: number;
  pickupDateType: 'vandaag' | 'morgen' | 'custom';
  customDate: string;
  pickupTime: string;
  isReturnTrip: boolean;
  returnDate: string;
  returnTime: string;
}

interface TaxiBookingFormProps {
  onCalculateFare: (data: BookingData) => void;
}

export const TaxiBookingForm: React.FC<TaxiBookingFormProps> = ({ onCalculateFare }) => {
  const { t, language } = useLanguage();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [stops, setStops] = useState<string[]>([]);
  const [vehicleType, setVehicleType] = useState<'klein' | 'groot'>('klein');
  const [hasLuggage, setHasLuggage] = useState(true);
  const [passengers, setPassengers] = useState(1);
  const [pickupDateType, setPickupDateType] = useState<'vandaag' | 'morgen' | 'custom'>('vandaag');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [pickupTime, setPickupTime] = useState('14:30');
  const [isReturnTrip, setIsReturnTrip] = useState(false);
  const [returnDate, setReturnDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [returnTime, setReturnTime] = useState('18:00');
  const [errorMessage, setErrorMessage] = useState('');

  // Dropdown Autocomplete & GPS States
  const [activeField, setActiveField] = useState<'pickup' | 'destination' | number | null>(null);
  const [pickupSuggestions, setPickupSuggestions] = useState<DutchPlace[]>(DUTCH_POPULAR_PLACES.slice(0, 8));
  const [destSuggestions, setDestSuggestions] = useState<DutchPlace[]>(DUTCH_POPULAR_PLACES.slice(0, 8));
  const [isSearchingDest, setIsSearchingDest] = useState(false);
  const [isSearchingPickup, setIsSearchingPickup] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [showGpsModal, setShowGpsModal] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveField(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Debounced live address suggestions for Pickup
  useEffect(() => {
    if (activeField !== 'pickup') return;

    if (!pickup.trim()) {
      setPickupSuggestions(DUTCH_POPULAR_PLACES.slice(0, 8));
      return;
    }

    // Instant offline match first
    setPickupSuggestions(searchOfflineDutchPlaces(pickup));

    // Live geocoding query
    setIsSearchingPickup(true);
    const timer = setTimeout(async () => {
      const results = await fetchLiveDutchAddressSuggestions(pickup);
      setPickupSuggestions(results);
      setIsSearchingPickup(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [pickup, activeField]);

  // Debounced live address suggestions for Destination
  useEffect(() => {
    if (activeField !== 'destination') return;

    if (!destination.trim()) {
      setDestSuggestions(DUTCH_POPULAR_PLACES.slice(0, 8));
      return;
    }

    // Instant offline match first
    setDestSuggestions(searchOfflineDutchPlaces(destination));

    // Live geocoding query
    setIsSearchingDest(true);
    const timer = setTimeout(async () => {
      const results = await fetchLiveDutchAddressSuggestions(destination);
      setDestSuggestions(results);
      setIsSearchingDest(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [destination, activeField]);

  // GPS Current Location Handler
  const handleRequestGPS = () => {
    if (!navigator.geolocation) {
      setErrorMessage(t('booking.searchingGps'));
      return;
    }

    setIsLocatingGPS(true);
    setGpsStatusText(t('booking.searchingGps'));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setGpsStatusText(t('booking.fetchingAddress'));
        const { latitude, longitude } = pos.coords;
        const address = await reverseGeocodeDutchGPS(latitude, longitude);

        setPickup(address);
        setIsLocatingGPS(false);
        setGpsStatusText(null);
        setActiveField(null);
        setErrorMessage('');
      },
      (err) => {
        setIsLocatingGPS(false);
        setGpsStatusText(null);
        if (err.code === err.PERMISSION_DENIED) {
          setShowGpsModal(true);
        } else {
          setErrorMessage(t('booking.searchingGps'));
        }
      },
      { enableHighAccuracy: true, timeout: 9000 }
    );
  };

  const handleSelectVehicle = (type: 'klein' | 'groot') => {
    setVehicleType(type);
    const max = type === 'klein' ? 4 : 7;
    if (passengers > max) {
      setPassengers(max);
    }
  };

  const handleIncreasePassengers = () => {
    if (vehicleType === 'klein') {
      if (passengers < 4) {
        setPassengers(passengers + 1);
      } else {
        // Auto upgrade to Grote auto when increasing above 4 passengers
        setVehicleType('groot');
        setPassengers(5);
      }
    } else {
      if (passengers < 7) {
        setPassengers(passengers + 1);
      }
    }
  };

  const handleDecreasePassengers = () => {
    if (passengers > 1) {
      setPassengers(passengers - 1);
    }
  };

  const handleAddStop = () => {
    if (stops.length < 3) {
      setStops([...stops, '']);
    }
  };

  const handleUpdateStop = (index: number, val: string) => {
    const newStops = [...stops];
    newStops[index] = val;
    setStops(newStops);
  };

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim()) {
      setErrorMessage(t('booking.validationPickup'));
      return;
    }
    if (!destination.trim()) {
      setErrorMessage(t('booking.validationDest'));
      return;
    }
    setErrorMessage('');

    onCalculateFare({
      pickup,
      destination,
      stops: stops.filter((s) => s.trim() !== ''),
      vehicleType,
      hasLuggage,
      passengers,
      pickupDateType,
      customDate,
      pickupTime,
      isReturnTrip,
      returnDate,
      returnTime,
    });
  };

  const renderCategoryIcon = (category: DutchPlace['category']) => {
    switch (category) {
      case 'airport':
        return <Plane className="w-4 h-4 text-[#0B2559] shrink-0" />;
      case 'station':
        return <Train className="w-4 h-4 text-[#0B2559] shrink-0" />;
      case 'attraction':
        return <Building className="w-4 h-4 text-amber-600 shrink-0" />;
      default:
        return <MapPin className="w-4 h-4 text-[#FFB800] shrink-0" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative z-20 w-full max-w-[1240px] mx-auto px-4 sm:px-6 mt-6 sm:mt-10 md:mt-12"
    >
      <div className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,19,49,0.10)] border border-slate-200 p-5 sm:p-7 md:p-9 transition-all duration-300">
        {/* Card Heading */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EBF2FC] flex items-center justify-center text-[#00255c]">
              <MapPin className="w-5 h-5 fill-[#00255c] text-[#00255c]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#07152B] tracking-tight">
              {t('booking.whereTo')}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#00255c] bg-[#EBF2FC] px-3.5 py-1.5 rounded-full border border-slate-200">
            <Compass className="w-3.5 h-3.5 text-[#00255c]" />
            <span>Google Maps {t('booking.netherlands')} 🇳🇱</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pickup and Destination Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 1: Van (Pickup) with GPS button */}
            <div className="relative">
              <div className="flex items-center gap-3 px-4 py-3.5 bg-[#FAF8FE] border border-[#D4E2F4] rounded-2xl focus-within:border-[#00255c] focus-within:ring-2 focus-within:ring-[#00255c]/15 transition-all">
                <Navigation className="w-5 h-5 text-[#00255c] rotate-45 shrink-0" />
                <div className="flex items-center gap-2.5 w-full">
                  <span className="text-sm font-bold text-[#00255c] uppercase tracking-wider shrink-0">
                    {t('booking.from')}
                  </span>
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => {
                      setPickup(e.target.value);
                      setErrorMessage('');
                    }}
                    onFocus={() => setActiveField('pickup')}
                    placeholder={t('booking.fromPlaceholder')}
                    className="w-full bg-transparent text-sm sm:text-base font-medium text-[#07152B] placeholder:text-gray-400 focus:outline-none"
                  />

                  {/* GPS Locator Button */}
                  <button
                    type="button"
                    onClick={handleRequestGPS}
                    disabled={isLocatingGPS}
                    className="p-1.5 rounded-xl bg-blue-100/70 hover:bg-[#00255c] text-[#00255c] hover:text-[#FFD500] transition-colors shrink-0 cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title={t('booking.useGps')}
                  >
                    {isLocatingGPS ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#00255c]" />
                    ) : (
                      <LocateFixed className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline text-[11px]">{t('booking.gps')}</span>
                  </button>
                </div>
              </div>

              {/* GPS Live feedback indicator */}
              {isLocatingGPS && (
                <div className="absolute top-full left-0 mt-1 text-xs text-[#00255c] font-bold flex items-center gap-1.5 z-40 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{gpsStatusText || t('booking.searchingGps')}</span>
                </div>
              )}

              {/* Suggestions Dropdown for Pickup */}
              {activeField === 'pickup' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 max-h-72 overflow-y-auto animate-in fade-in duration-150">
                  {/* GPS Action item in Dropdown */}
                  <div
                    onClick={handleRequestGPS}
                    className="p-2.5 mb-1 bg-[#EBF2FC] hover:bg-[#DFEBF9] rounded-xl flex items-center justify-between text-xs font-bold text-[#00255c] cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2">
                      <LocateFixed className="w-4 h-4 text-[#00255c]" />
                      <span>{t('booking.useMyLocation')}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {t('booking.direct')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 px-3 py-1.5 uppercase">
                    <span>{t('booking.suggestionsNl')}</span>
                    {isSearchingPickup && <Loader2 className="w-3 h-3 animate-spin text-[#00255c]" />}
                  </div>

                  {pickupSuggestions.map((place, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        if (typeof place.lat === 'number' && typeof place.lon === 'number') {
                          saveAddressCoordinates(place.fullAddress, place.lat, place.lon);
                          saveAddressCoordinates(place.title, place.lat, place.lon);
                        }
                        setPickup(place.fullAddress);
                        setActiveField(null);
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-[#FAF8FE] rounded-xl transition flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-gray-50 group-hover:bg-blue-100 transition mt-0.5">
                        {renderCategoryIcon(place.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-[#07152B] truncate group-hover:text-[#00255c] transition-colors">
                          {place.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{place.subtitle}</div>
                      </div>
                    </button>
                  ))}

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between px-2">
                    <span className="text-[10px] text-gray-400">Google Maps / NL Adressen</span>
                    <button
                      type="button"
                      onClick={() => setActiveField(null)}
                      className="text-xs text-[#0B2559] font-bold hover:underline cursor-pointer"
                    >
                      {t('booking.close')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Field 2: Naar (Destination) with Dutch Google Maps Autocomplete */}
            <div className="relative">
              <div className="flex items-center gap-3 px-4 py-3.5 bg-[#FAF8FE] border border-[#D4E2F4] rounded-2xl focus-within:border-[#00255c] focus-within:ring-2 focus-within:ring-[#00255c]/15 transition-all">
                <MapPin className="w-5 h-5 text-[#00255c] fill-[#00255c] shrink-0" />
                <div className="flex items-center gap-2.5 w-full">
                  <span className="text-sm font-bold text-[#00255c] uppercase tracking-wider shrink-0">
                    {t('booking.to')}
                  </span>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setErrorMessage('');
                    }}
                    onFocus={() => setActiveField('destination')}
                    placeholder={t('booking.toPlaceholder')}
                    className="w-full bg-transparent text-sm sm:text-base font-medium text-[#07152B] placeholder:text-gray-400 focus:outline-none"
                  />

                  {destination && (
                    <button
                      type="button"
                      onClick={() => setDestination('')}
                      className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Suggestions dropdown for Destination */}
              {activeField === 'destination' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 max-h-72 overflow-y-auto animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 px-3 py-1.5 uppercase">
                    <span>{t('booking.popularDestinations')}</span>
                    {isSearchingDest && <Loader2 className="w-3 h-3 animate-spin text-[#00255c]" />}
                  </div>

                  {destSuggestions.map((place, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        if (typeof place.lat === 'number' && typeof place.lon === 'number') {
                          saveAddressCoordinates(place.fullAddress, place.lat, place.lon);
                          saveAddressCoordinates(place.title, place.lat, place.lon);
                        }
                        setDestination(place.fullAddress);
                        setActiveField(null);
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-[#FAF8FE] rounded-xl transition flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="p-1.5 rounded-lg bg-gray-50 group-hover:bg-blue-100 transition mt-0.5">
                        {renderCategoryIcon(place.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-[#07152B] truncate group-hover:text-[#00255c] transition-colors">
                          {place.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{place.subtitle}</div>
                      </div>
                    </button>
                  ))}

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between px-2">
                    <span className="text-[10px] text-gray-400">Google Maps / Nederland</span>
                    <button
                      type="button"
                      onClick={() => setActiveField(null)}
                      className="text-xs text-[#0B2559] font-bold hover:underline cursor-pointer"
                    >
                      {t('booking.close')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Intermediate Stops */}
          {stops.map((stop, index) => (
            <div key={index} className="flex items-center gap-3 animate-in fade-in duration-200">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] border border-[#D4E2F4] rounded-2xl">
                <MapPin className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span className="text-xs font-bold text-[#0B2559] uppercase">
                  {t('booking.stop')} {index + 1}
                </span>
                <input
                  type="text"
                  value={stop}
                  onChange={(e) => handleUpdateStop(index, e.target.value)}
                  placeholder={`${t('booking.stopPlaceholder')} ${index + 1}`}
                  className="w-full bg-transparent text-sm font-medium text-[#07152B] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveStop(index)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                title={t('booking.removeStop')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add Stop Button */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleAddStop}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00255c] hover:text-[#001331] transition-colors cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-full bg-[#EBF2FC] group-hover:bg-[#D4E2F4] flex items-center justify-center transition">
                <Plus className="w-3.5 h-3.5 text-[#00255c]" />
              </div>
              <span>{t('booking.addStop')}</span>
            </button>
          </div>

          {/* VEHICLE SELECTION ROW (Kleine auto vs Grote auto) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-[#07152B] flex items-center gap-2">
                <Car className="w-4 h-4 text-[#00255c]" />
                <span>{t('booking.chooseVehicle')}</span>
              </label>
              <span className="text-xs text-gray-500">
                {t('booking.chooseVehicleSub')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Kleine auto (Sedan 1-4 pers.) */}
              <div
                onClick={() => handleSelectVehicle('klein')}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                  vehicleType === 'klein'
                    ? 'border-[#00255c] bg-[#EBF2FC] shadow-md ring-2 ring-[#00255c]/10'
                    : 'border-gray-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 shadow-sm">
                    <img
                      src="/chauffeur-mercedes-web.jpg"
                      alt="Sedan"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.2 bg-[#001331]/90 text-[#FFD500] text-[9px] font-bold rounded">
                      1–4
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-[#07152B] truncate">{t('booking.smallCar')}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[#00255c] text-[11px] font-bold">
                        {t('booking.smallCarCapacity')}
                      </span>
                      <span className="text-[11px] text-gray-500 truncate">{t('booking.mercedesSedan')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center pl-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      vehicleType === 'klein'
                        ? 'border-[#00255c] bg-[#00255c] text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {vehicleType === 'klein' && <CheckCircle2 className="w-4 h-4 text-[#FFD500]" />}
                  </div>
                </div>
              </div>

              {/* Option 2: Grote auto (Taxibus 1-7 pers.) */}
              <div
                onClick={() => handleSelectVehicle('groot')}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                  vehicleType === 'groot'
                    ? 'border-[#00255c] bg-[#EBF2FC] shadow-md ring-2 ring-[#00255c]/10'
                    : 'border-gray-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white shadow-sm flex items-center justify-center">
                    <img
                      src="/grote-auto.png"
                      alt="Grote auto"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-0.5"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.2 bg-[#001331]/90 text-[#FFD500] text-[9px] font-bold rounded">
                      1–7
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-[#07152B] truncate">{t('booking.largeCar')}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[#00255c] text-[11px] font-bold">
                        {t('booking.largeCarCapacity')}
                      </span>
                      <span className="text-[11px] text-gray-500 truncate">{t('booking.mercedesVan')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center pl-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      vehicleType === 'groot'
                        ? 'border-[#00255c] bg-[#00255c] text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {vehicleType === 'groot' && <CheckCircle2 className="w-4 h-4 text-[#FFD500]" />}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Live Selected Vehicle Preview Card ── */}
            <div className="mt-3 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#001331] via-[#001e47] to-[#00255c] text-white flex flex-col sm:flex-row items-center gap-4 border border-[#FFB800]/30 shadow-lg animate-in fade-in duration-200">
              <div className="relative w-full sm:w-36 h-24 rounded-xl overflow-hidden shrink-0 border border-white/20 bg-white/10 flex items-center justify-center">
                <img
                  src={vehicleType === 'klein' ? '/chauffeur-mercedes-web.jpg' : '/grote-auto.png'}
                  alt={vehicleType === 'klein' ? 'Mercedes E-Class Sedan' : 'Grote auto Mercedes V-Class'}
                  className={`w-full h-full ${vehicleType === 'klein' ? 'object-cover' : 'object-contain p-1'}`}
                />
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#FFB800] text-[#001331] text-[10px] font-black rounded-md shadow">
                  {vehicleType === 'klein'
                    ? (language === 'ar' ? '1–4 ركاب' : language === 'es' ? '1–4 Pasajeros' : language === 'en' ? '1–4 Passengers' : '1–4 Passagiers')
                    : (language === 'ar' ? '1–7 ركاب' : language === 'es' ? '1–7 Pasajeros' : language === 'en' ? '1–7 Passengers' : '1–7 Passagiers')}
                </span>
              </div>
              <div className="flex-1 w-full text-start">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#FFB800] uppercase tracking-wider">
                    {vehicleType === 'klein'
                      ? (language === 'ar' ? 'السيارة المختارة: سيدان فاخرة' : language === 'es' ? 'Elegido: Sedán de Lujo' : language === 'en' ? 'Selected: Luxury Sedan' : 'Gekozen: Luxe Sedan')
                      : (language === 'ar' ? 'السيارة المختارة: باص وفان عائلي' : language === 'es' ? 'Elegido: Minibús Espacioso' : language === 'en' ? 'Selected: Spacious Van' : 'Gekozen: Ruime Taxibus')}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/90">
                    {vehicleType === 'klein' ? '€2.39 / km' : '€3.04 / km'}
                  </span>
                </div>
                <h4 className="text-base font-black text-white mt-0.5">
                  {vehicleType === 'klein' ? 'Mercedes-Benz E-Class Sedan' : 'Mercedes-Benz V-Class Taxibus'}
                </h4>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  {vehicleType === 'klein'
                    ? (language === 'ar'
                        ? 'مثالية لعدد 1 حتى 4 ركاب مع الحقائب. مقاعد جلدية مريحة، تكييف متكامل وأعلى درجات الراحة.'
                        : language === 'es'
                        ? 'Ideal para 1 a 4 personas con equipaje. Tapicería de cuero, aire acondicionado y gran confort.'
                        : language === 'en'
                        ? 'Ideal for 1 to 4 persons with luggage. Leather seats, air conditioning and top comfort.'
                        : 'Uitermate geschikt voor 1 tot 4 personen met koffers. Luxe lederen bekleding, airconditioning en uiterst comfortabel.')
                    : (language === 'ar'
                        ? 'نقل جماعي وعائلي واسع حتى 7 أشخاص مع مساحة شحن رحبة لجميع الحقائب والأمتعة.'
                        : language === 'es'
                        ? 'Transporte espacioso de grupos hasta 7 personas con amplio espacio para maletas.'
                        : language === 'en'
                        ? 'Spacious group transport for up to 7 persons with generous luggage space.'
                        : 'Ruim en comfortabel groepsvervoer tot 7 personen met royale bagageruimte voor alle koffers en tassen.')}
                </p>
              </div>
            </div>
          </div>

          {/* Horizontal Divider */}
          <div className="border-t border-[#F0E6FF] pt-5" />

          {/* Booking Options (4 columns: Luggage, Passengers, Date/Time, Return) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {/* Column 1 – Luggage */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-[#07152B]">
                <Luggage className="w-4 h-4 text-[#00255c]" />
                <span>{t('booking.travelWithLuggage')}</span>
              </div>
              <div className="flex items-center gap-5 mt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="luggage"
                    checked={hasLuggage === true}
                    onChange={() => setHasLuggage(true)}
                    className="w-4 h-4 accent-[#00255c] cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-[#07152B]">{t('booking.yes')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="luggage"
                    checked={hasLuggage === false}
                    onChange={() => setHasLuggage(false)}
                    className="w-4 h-4 accent-[#00255c] cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-[#07152B]">{t('booking.no')}</span>
                </label>
              </div>
            </div>

            {/* Column 2 – Passengers */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-sm font-bold text-[#07152B]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0B2559]" />
                  <span>{t('booking.passengersCount')}</span>
                </div>
                <span className="text-[11px] font-bold text-[#00255c] bg-[#EBF2FC] px-2 py-0.5 rounded-md border border-[#D4E2F4]">
                  {vehicleType === 'klein' ? t('booking.max3') : t('booking.max5')}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1">
                {/* Stepper (- / +) */}
                <div className="flex items-center border border-[#D4E2F4] rounded-xl bg-[#FAF8FE] p-1">
                  <button
                    type="button"
                    onClick={handleDecreasePassengers}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#00255c] hover:bg-white hover:shadow-xs transition font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={passengers <= 1}
                    aria-label="Reiziger verminderen"
                  >
                    –
                  </button>
                  <span className="w-8 text-center font-black text-base text-[#07152B]">
                    {passengers}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncreasePassengers}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#00255c] hover:bg-white hover:shadow-xs transition font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={passengers >= 7}
                    aria-label="Reiziger toevoegen"
                  >
                    +
                  </button>
                </div>

                {/* Quick Passenger Selector Pills (1 to 7) */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                    const isSelected = passengers === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setPassengers(num);
                          if (num > 4 && vehicleType === 'klein') {
                            setVehicleType('groot');
                          }
                        }}
                        className={`w-7 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#00255c] text-[#FFD500] shadow-sm ring-2 ring-[#00255c]/20'
                            : 'bg-[#FAF8FE] text-gray-700 hover:bg-[#EBF2FC] hover:text-[#00255c] border border-[#D4E2F4]'
                        }`}
                        title={`${num} ${num === 1 ? 'passagier' : 'passagiers'}${num > 4 ? ' (Grote auto)' : ''}`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Column 3 – Pickup Date */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-[#07152B]">
                <Calendar className="w-4 h-4 text-[#00255c]" />
                <span>{t('booking.pickupMoment')}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="relative flex-1">
                  <select
                    value={pickupDateType}
                    onChange={(e) => setPickupDateType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm font-semibold text-[#07152B] bg-[#FAF8FE] border border-[#D4E2F4] rounded-xl focus:outline-none focus:border-[#00255c] cursor-pointer"
                  >
                    <option value="vandaag">📅 {t('booking.today')}</option>
                    <option value="morgen">📅 {t('booking.tomorrow')}</option>
                    <option value="custom">📅 {t('booking.chooseDate')}</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-2 bg-[#FAF8FE] border border-[#D4E2F4] rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-[#00255c]" />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="text-xs font-semibold text-[#07152B] bg-transparent focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {pickupDateType === 'custom' && (
                <input
                  type="date"
                  value={customDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="mt-1 px-3 py-1.5 text-xs font-semibold text-[#07152B] bg-[#FAF8FE] border border-[#D4E2F4] rounded-lg focus:outline-none"
                />
              )}
            </div>

            {/* Column 4 – Return Trip */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-sm font-bold text-[#07152B]">
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-[#00255c]" />
                  <span>{t('booking.returnTrip')}</span>
                </div>
                {/* Modern Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setIsReturnTrip(!isReturnTrip)}
                  className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors cursor-pointer ${
                    isReturnTrip ? 'bg-[#00255c]' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={isReturnTrip}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isReturnTrip ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Conditional Return Trip Details */}
              {isReturnTrip ? (
                <div className="flex items-center gap-2 mt-1 animate-in fade-in duration-200">
                  <input
                    type="date"
                    value={returnDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="flex-1 px-2 py-1.5 text-xs font-semibold text-[#07152B] bg-[#FAF8FE] border border-[#D4E2F4] rounded-lg focus:outline-none"
                  />
                  <input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="px-2 py-1.5 text-xs font-semibold text-[#07152B] bg-[#FAF8FE] border border-[#D4E2F4] rounded-lg focus:outline-none"
                  />
                </div>
              ) : (
                <span className="text-xs text-gray-400 mt-1">{t('booking.noReturn')}</span>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Main Booking Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-2xl bg-gradient-to-r from-[#24B65A] to-[#1fa251] hover:from-[#1fa251] hover:to-[#1a8e45] text-white text-base sm:text-lg font-bold shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/35 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
            >
              <Calculator className="w-5 h-5" />
              <span>{t('booking.calcFare')}</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </form>
      </div>

      {/* GPS Permission Modal (When browser / device blocks GPS) */}
      {showGpsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <LocateFixed className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#07152B]">{t('booking.gpsPermissionTitle')}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t('booking.gpsPermissionDesc')}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowGpsModal(false);
                  handleRequestGPS();
                }}
                className="flex-1 py-3 rounded-xl bg-[#00255c] text-white font-bold text-xs sm:text-sm hover:bg-[#001331] transition cursor-pointer"
              >
                Opnieuw proberen
              </button>
              <button
                type="button"
                onClick={() => setShowGpsModal(false)}
                className="py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition cursor-pointer"
              >
                {t('booking.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
