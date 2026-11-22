import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Plane,
  Train,
  Compass,
  Loader2,
  LocateFixed,
  X,
  Building2,
} from 'lucide-react';
import {
  fetchLiveDutchAddressSuggestions,
  searchOfflineDutchPlaces,
  reverseGeocodeDutchGPS,
  DUTCH_POPULAR_PLACES,
  type DutchPlace,
} from '../utils/dutchAddressService';

interface DutchAddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  theme?: 'dark' | 'light';
  iconColor?: string;
  className?: string;
  showGpsButton?: boolean;
  onSelect?: (place: DutchPlace) => void;
}

export const DutchAddressAutocomplete: React.FC<DutchAddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Voer een adres, station of luchthaven in...',
  label,
  required = false,
  theme = 'light',
  iconColor,
  className = '',
  showGpsButton = true,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<DutchPlace[]>(() =>
    DUTCH_POPULAR_PLACES.slice(0, 8)
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Live lookup with debouncing
  useEffect(() => {
    const clean = value.trim();

    if (clean.length === 0) {
      setSuggestions(DUTCH_POPULAR_PLACES.slice(0, 8));
      setIsSearching(false);
      return;
    }

    // 1. Instant offline search
    const offlineMatches = searchOfflineDutchPlaces(clean);
    setSuggestions(offlineMatches);

    // 2. Debounced online Nominatim / Google Maps format search
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const liveResults = await fetchLiveDutchAddressSuggestions(clean);
        if (liveResults && liveResults.length > 0) {
          setSuggestions(liveResults);
        }
      } catch (err) {
        console.warn('Address suggestion fetch error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 240);

    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = (place: DutchPlace) => {
    onChange(place.fullAddress);
    onSelect?.(place);
    setIsOpen(false);
  };

  const handleRequestGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('GPS niet ondersteund');
      return;
    }

    setIsLocatingGPS(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const address = await reverseGeocodeDutchGPS(latitude, longitude);
          onChange(address);
          setIsOpen(false);
        } catch {
          setGpsError('Locatie bepalen mislukt');
        } finally {
          setIsLocatingGPS(false);
        }
      },
      (err) => {
        setIsLocatingGPS(false);
        setGpsError(
          err.code === err.PERMISSION_DENIED
            ? 'Geen GPS toestemming verleend'
            : 'GPS time-out'
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const renderIcon = (cat: DutchPlace['category']) => {
    switch (cat) {
      case 'airport':
        return <Plane className="w-4 h-4 text-sky-500 shrink-0" />;
      case 'station':
        return <Train className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'attraction':
        return <Compass className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'city':
        return <Building2 className="w-4 h-4 text-purple-500 shrink-0" />;
      default:
        return <MapPin className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  const isDark = theme === 'dark';

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label
          className={`block text-xs font-bold mb-1.5 ${
            isDark ? 'text-white/80' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}

      {/* Input Field Container */}
      <div
        className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl transition backdrop-blur-sm ${
          isDark
            ? 'bg-white/10 border border-white/15 focus-within:border-[#FFB800] focus-within:bg-white/15'
            : 'bg-[#F4F7FB] border border-[#E2E8F0] focus-within:border-[#00255c] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00255c]/10'
        }`}
      >
        <MapPin
          className="w-4 h-4 shrink-0"
          style={{ color: iconColor || (isDark ? '#FFB800' : '#001331') }}
        />

        <input
          ref={inputRef}
          type="text"
          required={required}
          value={value}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full bg-transparent text-sm focus:outline-none ${
            isDark
              ? 'text-white placeholder-white/50'
              : 'text-[#07152B] placeholder-gray-400'
          }`}
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className={`p-1 rounded-full hover:opacity-80 transition cursor-pointer ${
              isDark ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
            title="Wissen"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Search Spinner */}
        {isSearching && (
          <Loader2
            className={`w-3.5 h-3.5 animate-spin shrink-0 ${
              isDark ? 'text-[#FFB800]' : 'text-[#00255c]'
            }`}
          />
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl border z-50 p-2 max-h-72 overflow-y-auto animate-in fade-in duration-150 ${
            isDark
              ? 'bg-[#001d4a] border-white/20 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
              : 'bg-white border-slate-200 text-[#07152B] shadow-[0_20px_50px_rgba(0,19,49,0.18)]'
          }`}
        >
          {/* GPS Quick Action */}
          {showGpsButton && (
            <div
              onClick={handleRequestGPS}
              className={`p-2.5 mb-1 rounded-xl flex items-center justify-between text-xs font-bold cursor-pointer transition ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-[#FFB800]'
                  : 'bg-[#EBF2FC] hover:bg-[#DFEBF9] text-[#00255c]'
              }`}
            >
              <div className="flex items-center gap-2">
                {isLocatingGPS ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#FFB800]" />
                ) : (
                  <LocateFixed className="w-4 h-4" />
                )}
                <span>
                  {isLocatingGPS
                    ? 'Locatie ophalen via GPS...'
                    : 'Gebruik mijn huidige GPS-locatie'}
                </span>
              </div>
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white border-slate-200 text-[#00255c]'
                }`}
              >
                Direct
              </span>
            </div>
          )}

          {gpsError && (
            <div className="px-2 py-1 text-[11px] text-red-400 font-medium">
              {gpsError}
            </div>
          )}

          {/* Suggestions Header */}
          <div
            className={`flex items-center justify-between text-[11px] font-bold px-3 py-1.5 uppercase ${
              isDark ? 'text-white/50' : 'text-gray-400'
            }`}
          >
            <span>
              {value.trim() ? 'Google Maps / Adressen' : 'Populaire bestemmingen NL'}
            </span>
            <span className="text-[10px] font-normal lowercase opacity-80">
              {suggestions.length} opties
            </span>
          </div>

          {/* Suggestions List */}
          {suggestions.length === 0 ? (
            <div
              className={`p-3 text-center text-xs ${
                isDark ? 'text-white/60' : 'text-gray-500'
              }`}
            >
              Geen adressen gevonden voor "{value}". Typ een straatnaam of stad.
            </div>
          ) : (
            suggestions.map((place, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleSelect(place)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition flex items-start gap-3 cursor-pointer group ${
                  isDark
                    ? 'hover:bg-white/10 focus:bg-white/10'
                    : 'hover:bg-[#FAF8FE] focus:bg-[#FAF8FE]'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition mt-0.5 ${
                    isDark
                      ? 'bg-white/10 group-hover:bg-white/20'
                      : 'bg-gray-100 group-hover:bg-blue-100'
                  }`}
                >
                  {renderIcon(place.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-bold truncate transition-colors ${
                      isDark
                        ? 'text-white group-hover:text-[#FFB800]'
                        : 'text-[#07152B] group-hover:text-[#00255c]'
                    }`}
                  >
                    {place.title}
                  </div>
                  <div
                    className={`text-xs truncate ${
                      isDark ? 'text-white/60' : 'text-gray-500'
                    }`}
                  >
                    {place.subtitle}
                  </div>
                </div>
              </button>
            ))
          )}

          {/* Dropdown Footer */}
          <div
            className={`pt-2 mt-1 border-t flex items-center justify-between px-2 text-[10px] ${
              isDark
                ? 'border-white/10 text-white/50'
                : 'border-gray-100 text-gray-400'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span>Google Maps & OpenStreetMap NL 🇳🇱</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`font-bold hover:underline cursor-pointer ${
                isDark ? 'text-[#FFB800]' : 'text-[#00255c]'
              }`}
            >
              Sluiten ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

