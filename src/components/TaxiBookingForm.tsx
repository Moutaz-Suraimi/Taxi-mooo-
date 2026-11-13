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
  const [pickup, setPickup] = useState('Amsterdam Centraal Station');
  const [destination, setDestination] = useState('Schiphol Airport (AMS)');
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
      setErrorMessage('Je browser ondersteunt geen GPS locatiebepaling. Voer je adres a.u.b. handmatig in.');
      return;
    }

    setIsLocatingGPS(true);
    setGpsStatusText('GPS-signaal zoeken in Nederland...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setGpsStatusText('Adres ophalen via GPS...');
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
          setErrorMessage('Kon geen GPS-locatie bepalen. Controleer of locatietoegang op je apparaat aan staat.');
        }
      },
      { enableHighAccuracy: true, timeout: 9000 }
    );
  };

  const handleSelectVehicle = (type: 'klein' | 'groot') => {
    setVehicleType(type);
    if (type === 'klein' && passengers > 3) {
      setPassengers(3);
    }
  };

  const handleIncreasePassengers = () => {
    if (vehicleType === 'klein') {
      if (passengers < 3) {
        setPassengers(passengers + 1);
      } else {
        setVehicleType('groot');
        setPassengers(4);
      }
    } else {
      if (passengers < 5) {
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
      setErrorMessage('Vul a.u.b. een vertreklocatie (van) in.');
      return;
    }
    if (!destination.trim()) {
      setErrorMessage('Vul a.u.b. een bestemming (naar) in.');
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
              Waar wil je heen?
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#00255c] bg-[#EBF2FC] px-3.5 py-1.5 rounded-full border border-slate-200">
            <Compass className="w-3.5 h-3.5 text-[#00255c]" />
            <span>Google Maps Nederland 🇳🇱</span>
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
                    van
                  </span>
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => {
                      setPickup(e.target.value);
                      setErrorMessage('');
                    }}
                    onFocus={() => setActiveField('pickup')}
                    placeholder="Straatnaam, postcode of stad in Nederland"
                    className="w-full bg-transparent text-sm sm:text-base font-medium text-[#07152B] placeholder:text-gray-400 focus:outline-none"
                  />

                  {/* GPS Locator Button */}
                  <button
                    type="button"
                    onClick={handleRequestGPS}
                    disabled={isLocatingGPS}
                    className="p-1.5 rounded-xl bg-blue-100/70 hover:bg-[#00255c] text-[#00255c] hover:text-[#FFD500] transition-colors shrink-0 cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="Mijn huidige locatie gebruiken (GPS)"
                  >
                    {isLocatingGPS ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#00255c]" />
                    ) : (
                      <LocateFixed className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline text-[11px]">GPS</span>
                  </button>
                </div>
              </div>

              {/* GPS Live feedback indicator */}
              {isLocatingGPS && (
                <div className="absolute top-full left-0 mt-1 text-xs text-[#00255c] font-bold flex items-center gap-1.5 z-40 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{gpsStatusText || 'GPS-signaal bepalen...'}</span>
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
                      <span>Gebruik mijn huidige locatie (GPS activeren)</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      Direct
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 px-3 py-1.5 uppercase">
                    <span>Suggesties in Nederland</span>
                    {isSearchingPickup && <Loader2 className="w-3 h-3 animate-spin text-[#00255c]" />}
                  </div>

                  {pickupSuggestions.map((place, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
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
                      Sluiten
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
                    naar
                  </span>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setErrorMessage('');
                    }}
                    onFocus={() => setActiveField('destination')}
                    placeholder="Bestemming, luchthaven, station of straat in NL"
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
                    <span>Populaire bestemmingen & adressen in NL</span>
                    {isSearchingDest && <Loader2 className="w-3 h-3 animate-spin text-[#00255c]" />}
                  </div>

                  {destSuggestions.map((place, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
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
                      Sluiten
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
                  stop {index + 1}
                </span>
                <input
                  type="text"
                  value={stop}
                  onChange={(e) => handleUpdateStop(index, e.target.value)}
                  placeholder={`Tussenstop adres in Nederland ${index + 1}`}
                  className="w-full bg-transparent text-sm font-medium text-[#07152B] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveStop(index)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                title="Tussenstop verwijderen"
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
              <span>+ Tussenstop toevoegen</span>
            </button>
          </div>

          {/* VEHICLE SELECTION ROW (Kleine auto vs Grote auto) - No prices shown here */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-[#07152B] flex items-center gap-2">
                <Car className="w-4 h-4 text-[#00255c]" />
                <span>Kies type auto:</span>
              </label>
              <span className="text-xs text-gray-500">
                Kies het gewenste formaat voor je reis
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Kleine auto */}
              <div
                onClick={() => handleSelectVehicle('klein')}
                className={`p-4 sm:p-4.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  vehicleType === 'klein'
                    ? 'border-[#00255c] bg-[#EBF2FC] shadow-sm ring-2 ring-[#00255c]/10'
                    : 'border-gray-200 hover:border-slate-200 bg-[#FAF8FE]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                      vehicleType === 'klein'
                        ? 'bg-[#00255c] text-[#FFD500]'
                        : 'bg-blue-100 text-[#00255c]'
                    }`}
                  >
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-[#07152B]">Kleine auto</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-[#00255c] text-xs font-bold">
                        3 personen
                      </span>
                      <span className="text-xs text-gray-500">Mercedes Sedan</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
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

              {/* Option 2: Grote auto */}
              <div
                onClick={() => handleSelectVehicle('groot')}
                className={`p-4 sm:p-4.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  vehicleType === 'groot'
                    ? 'border-[#00255c] bg-[#EBF2FC] shadow-sm ring-2 ring-[#00255c]/10'
                    : 'border-gray-200 hover:border-slate-200 bg-[#FAF8FE]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                      vehicleType === 'groot'
                        ? 'bg-[#00255c] text-[#FFD500]'
                        : 'bg-blue-100 text-[#00255c]'
                    }`}
                  >
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-[#07152B]">Grote auto</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-[#00255c] text-xs font-bold">
                        5 personen
                      </span>
                      <span className="text-xs text-gray-500">Mercedes Station / Bus</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
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
          </div>

          {/* Horizontal Divider */}
          <div className="border-t border-[#F0E6FF] pt-5" />

          {/* Booking Options (4 columns: Luggage, Passengers, Date/Time, Return) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {/* Column 1 – Luggage */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-[#07152B]">
                <Luggage className="w-4 h-4 text-[#00255c]" />
                <span>Reis je met bagage?</span>
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
                  <span className="text-sm font-semibold text-[#07152B]">Ja</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="luggage"
                    checked={hasLuggage === false}
                    onChange={() => setHasLuggage(false)}
                    className="w-4 h-4 accent-[#00255c] cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-[#07152B]">Nee</span>
                </label>
              </div>
            </div>

            {/* Column 2 – Passengers */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-sm font-bold text-[#07152B]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0B2559]" />
                  <span>Aantal reizigers</span>
                </div>
                <span className="text-[11px] font-semibold text-[#0B2559]">
                  {vehicleType === 'klein' ? 'Max 3 pers.' : 'Max 5 pers.'}
                </span>
              </div>
              <div className="flex items-center border border-[#D4E2F4] rounded-xl bg-[#FAF8FE] w-fit p-1 mt-1">
                <button
                  type="button"
                  onClick={handleDecreasePassengers}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#00255c] hover:bg-white hover:shadow-xs transition font-bold cursor-pointer disabled:opacity-40"
                  disabled={passengers <= 1}
                >
                  –
                </button>
                <span className="w-10 text-center font-bold text-base text-[#07152B]">
                  {passengers}
                </span>
                <button
                  type="button"
                  onClick={handleIncreasePassengers}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#00255c] hover:bg-white hover:shadow-xs transition font-bold cursor-pointer disabled:opacity-40"
                  disabled={vehicleType === 'groot' && passengers >= 5}
                >
                  +
                </button>
              </div>
            </div>

            {/* Column 3 – Pickup Date */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-[#07152B]">
                <Calendar className="w-4 h-4 text-[#00255c]" />
                <span>Ophaalmoment</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="relative flex-1">
                  <select
                    value={pickupDateType}
                    onChange={(e) => setPickupDateType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm font-semibold text-[#07152B] bg-[#FAF8FE] border border-[#D4E2F4] rounded-xl focus:outline-none focus:border-[#00255c] cursor-pointer"
                  >
                    <option value="vandaag">📅 Vandaag</option>
                    <option value="morgen">📅 Morgen</option>
                    <option value="custom">📅 Datum kiezen</option>
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
                  <span>Retour</span>
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
                <span className="text-xs text-gray-400 mt-1">Geen retourrit geselecteerd</span>
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
              <span>Bereken mijn ritprijs</span>
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
              <h3 className="text-xl font-black text-[#07152B]">GPS Locatietoegang Vereist</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Om je huidige ophaaladres in Nederland automatisch in te stellen, heeft je browser toestemming nodig om je GPS-locatie te lezen.
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-left space-y-1.5 text-gray-600">
              <div className="font-bold text-[#07152B]">Hoe schakel je GPS in?</div>
              <div>1. Klik op het slot-icoontje 🔒 of toestemmingsicoon links in je browser-adresbalk.</div>
              <div>2. Zet <strong>'Locatie'</strong> op <strong>'Toestaan'</strong>.</div>
              <div>3. Klik hieronder op 'Opnieuw proberen'.</div>
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
                Handmatig adres invoeren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
