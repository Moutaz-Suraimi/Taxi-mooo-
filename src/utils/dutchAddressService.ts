import { saveAddressCoordinates } from './dutchDistanceService';

export interface DutchPlace {
  title: string;
  subtitle: string;
  fullAddress: string;
  category: 'airport' | 'station' | 'attraction' | 'city' | 'street';
  lat?: number;
  lon?: number;
}

export const DUTCH_POPULAR_PLACES: DutchPlace[] = [
  // Airports
  {
    title: 'Schiphol Airport (AMS)',
    subtitle: 'Vertrekpassage 1, 1118 AP Schiphol',
    fullAddress: 'Schiphol Airport (AMS), Vertrekpassage 1, 1118 AP Schiphol',
    category: 'airport',
  },
  {
    title: 'Rotterdam The Hague Airport (RTM)',
    subtitle: 'Rotterdam Airportplein 60, 3045 AP Rotterdam',
    fullAddress: 'Rotterdam The Hague Airport (RTM), Rotterdam Airportplein 60, 3045 AP Rotterdam',
    category: 'airport',
  },
  {
    title: 'Eindhoven Airport (EIN)',
    subtitle: 'Luchthavenweg 25, 5657 EA Eindhoven',
    fullAddress: 'Eindhoven Airport (EIN), Luchthavenweg 25, 5657 EA Eindhoven',
    category: 'airport',
  },
  {
    title: 'Brussels Airport (BRU)',
    subtitle: 'Leopoldlaan, 1930 Zaventem, België',
    fullAddress: 'Brussels Airport (BRU), Leopoldlaan, 1930 Zaventem',
    category: 'airport',
  },
  {
    title: 'Düsseldorf Airport (DUS)',
    subtitle: 'Flughafenstraße 105, 40474 Düsseldorf, Duitsland',
    fullAddress: 'Düsseldorf Airport (DUS), Flughafenstraße 105, 40474 Düsseldorf',
    category: 'airport',
  },

  // Central Train Stations
  {
    title: 'Amsterdam Centraal Station',
    subtitle: 'Stationsplein 1, 1012 AB Amsterdam',
    fullAddress: 'Amsterdam Centraal Station, Stationsplein 1, 1012 AB Amsterdam',
    category: 'station',
  },
  {
    title: 'Utrecht Centraal Station',
    subtitle: 'Stationshal 12, 3511 CE Utrecht',
    fullAddress: 'Utrecht Centraal Station, Stationshal 12, 3511 CE Utrecht',
    category: 'station',
  },
  {
    title: 'Rotterdam Centraal Station',
    subtitle: 'Stationsplein 1, 3013 AJ Rotterdam',
    fullAddress: 'Rotterdam Centraal Station, Stationsplein 1, 3013 AJ Rotterdam',
    category: 'station',
  },
  {
    title: 'Den Haag Centraal Station',
    subtitle: 'Koningin Julianaplein 10, 2595 AA Den Haag',
    fullAddress: 'Den Haag Centraal Station, Koningin Julianaplein 10, 2595 AA Den Haag',
    category: 'station',
  },
  {
    title: 'Eindhoven Centraal Station',
    subtitle: 'Stationsplein 22, 5611 AC Eindhoven',
    fullAddress: 'Eindhoven Centraal Station, Stationsplein 22, 5611 AC Eindhoven',
    category: 'station',
  },
  {
    title: 'Schiphol Airport Treinstation',
    subtitle: 'Aankomstpassage 1, 1118 AX Schiphol',
    fullAddress: 'Schiphol Airport Treinstation, Aankomstpassage 1, 1118 AX Schiphol',
    category: 'station',
  },

  // Popular Hotspots & Event Venues
  {
    title: 'Damrak (Centrum Amsterdam)',
    subtitle: 'Damrak 1, 1012 LG Amsterdam',
    fullAddress: 'Damrak 1, 1012 LG Amsterdam, Nederland',
    category: 'attraction',
  },
  {
    title: 'Keizersgracht (Grachtengordel)',
    subtitle: 'Keizersgracht 421, 1016 EK Amsterdam',
    fullAddress: 'Keizersgracht 421, 1016 EK Amsterdam, Nederland',
    category: 'street',
  },
  {
    title: 'Museumplein & Rijksmuseum',
    subtitle: 'Museumstraat 1, 1071 XX Amsterdam',
    fullAddress: 'Museumstraat 1, 1071 XX Amsterdam (Museumplein)',
    category: 'attraction',
  },
  {
    title: 'Johan Cruijff ArenA',
    subtitle: 'ArenA Boulevard 1, 1101 AX Amsterdam',
    fullAddress: 'Johan Cruijff ArenA, ArenA Boulevard 1, 1101 AX Amsterdam',
    category: 'attraction',
  },
  {
    title: 'Ziggo Dome Amsterdam',
    subtitle: 'De Passage 100, 1101 AX Amsterdam',
    fullAddress: 'Ziggo Dome, De Passage 100, 1101 AX Amsterdam',
    category: 'attraction',
  },
  {
    title: 'RAI Amsterdam Convention Centre',
    subtitle: 'Europaplein 24, 1078 GZ Amsterdam',
    fullAddress: 'RAI Amsterdam, Europaplein 24, 1078 GZ Amsterdam',
    category: 'attraction',
  },
  {
    title: 'Jaarbeurs Utrecht',
    subtitle: 'Jaarbeursplein, 3521 AL Utrecht',
    fullAddress: 'Jaarbeurs Utrecht, Jaarbeursplein, 3521 AL Utrecht',
    category: 'attraction',
  },
  {
    title: 'Rotterdam Ahoy',
    subtitle: 'Ahoyweg 10, 3084 HN Rotterdam',
    fullAddress: 'Rotterdam Ahoy, Ahoyweg 10, 3084 HN Rotterdam',
    category: 'attraction',
  },
  {
    title: 'Keukenhof Lisse',
    subtitle: 'Stationsweg 166a, 2161 AM Lisse',
    fullAddress: 'Keukenhof, Stationsweg 166a, 2161 AM Lisse',
    category: 'attraction',
  },
  {
    title: 'Zaanse Schans (Molens)',
    subtitle: 'Schansend 7, 1509 AW Zaandam',
    fullAddress: 'Zaanse Schans, Schansend 7, 1509 AW Zaandam',
    category: 'attraction',
  },

  // Major Dutch Cities & Postcode Areas
  {
    title: 'Amsterdam Centrum',
    subtitle: '1012 Amsterdam, Noord-Holland',
    fullAddress: 'Centrum, 1012 Amsterdam, Nederland',
    category: 'city',
  },
  {
    title: 'Amsterdam Zuidas',
    subtitle: 'Gustav Mahlerlaan, 1082 MK Amsterdam',
    fullAddress: 'Gustav Mahlerlaan, 1082 MK Amsterdam (Zuidas)',
    category: 'city',
  },
  {
    title: 'Utrecht Centrum',
    subtitle: 'Vredenburg 1, 3511 BA Utrecht',
    fullAddress: 'Vredenburg 1, 3511 BA Utrecht, Nederland',
    category: 'city',
  },
  {
    title: 'Rotterdam Centrum / Coolsingel',
    subtitle: 'Coolsingel 40, 3011 AD Rotterdam',
    fullAddress: 'Coolsingel 40, 3011 AD Rotterdam, Nederland',
    category: 'city',
  },
  {
    title: 'Den Haag Binnenhof & Centrum',
    subtitle: 'Binnenhof 1, 2513 AA Den Haag',
    fullAddress: 'Binnenhof 1, 2513 AA Den Haag, Nederland',
    category: 'city',
  },
  {
    title: 'Eindhoven Strijp-S',
    subtitle: 'Torenallee 20, 5617 BC Eindhoven',
    fullAddress: 'Torenallee 20, 5617 BC Eindhoven, Nederland',
    category: 'city',
  },
  {
    title: 'Haarlem Grote Markt',
    subtitle: 'Grote Markt 2, 2011 RD Haarlem',
    fullAddress: 'Grote Markt 2, 2011 RD Haarlem, Nederland',
    category: 'city',
  },
  {
    title: 'Amstelveen Stadshart',
    subtitle: 'Stadsplein 100, 1181 ZM Amstelveen',
    fullAddress: 'Stadsplein 100, 1181 ZM Amstelveen, Nederland',
    category: 'city',
  },
  {
    title: 'Almere Centrum',
    subtitle: 'Stationsstraat 1, 1315 KS Almere',
    fullAddress: 'Stationsstraat 1, 1315 KS Almere, Nederland',
    category: 'city',
  },
  {
    title: 'Breda Centrum',
    subtitle: 'Grote Markt 38, 4811 XS Breda',
    fullAddress: 'Grote Markt 38, 4811 XS Breda, Nederland',
    category: 'city',
  },
  {
    title: 'Groningen Grote Markt',
    subtitle: 'Grote Markt 1, 9712 HN Groningen',
    fullAddress: 'Grote Markt 1, 9712 HN Groningen, Nederland',
    category: 'city',
  },
  {
    title: 'Leiden Rapenburg',
    subtitle: 'Rapenburg 70, 2311 EZ Leiden',
    fullAddress: 'Rapenburg 70, 2311 EZ Leiden, Nederland',
    category: 'city',
  },
  {
    title: 'Arnhem Korenmarkt',
    subtitle: 'Korenmarkt 1, 6811 GV Arnhem',
    fullAddress: 'Korenmarkt 1, 6811 GV Arnhem, Nederland',
    category: 'city',
  },
  {
    title: 'Nijmegen Waalkade',
    subtitle: 'Waalkade 100, 6511 XR Nijmegen',
    fullAddress: 'Waalkade 100, 6511 XR Nijmegen, Nederland',
    category: 'city',
  },
  {
    title: 'Maastricht Vrijthof',
    subtitle: 'Vrijthof 1, 6211 LE Maastricht',
    fullAddress: 'Vrijthof 1, 6211 LE Maastricht, Nederland',
    category: 'city',
  },
  {
    title: 'Tilburg Heuvelring',
    subtitle: 'Heuvelring 1, 5038 CJ Tilburg',
    fullAddress: 'Heuvelring 1, 5038 CJ Tilburg, Nederland',
    category: 'city',
  },
];

const QUERY_ALIASES: Record<string, string> = {
  'مطار امستردام': 'schiphol',
  'مطار سخيبول': 'schiphol',
  'مطار شيفول': 'schiphol',
  'مطار شيبول': 'schiphol',
  'امستردام': 'amsterdam',
  'مطار ايندهوفن': 'eindhoven airport',
  'ايندهوفن': 'eindhoven',
  'مطار روتردام': 'rotterdam airport',
  'روتردام': 'rotterdam',
  'اوتريخت': 'utrecht',
  'لاهاي': 'den haag',
  'مطار بروكسل': 'brussels airport',
  'بروكسل': 'brussels',
  'مطار دوسلدورف': 'dusseldorf airport',
  'هارلم': 'haarlem',
  'بريدا': 'breda',
  'تيلبورخ': 'tilburg',
  'غرونينغن': 'groningen',
  'ماستريخت': 'maastricht',
  'ليدن': 'leiden',
  'دلفت': 'delft',
  'aeropuerto de amsterdam': 'schiphol',
  'aeropuerto de eindhoven': 'eindhoven airport',
  'aeropuerto de rotterdam': 'rotterdam airport',
  'la haya': 'den haag',
  'roterdam': 'rotterdam',
};

function normalizeQuery(q: string): string {
  let str = q.toLowerCase().trim();
  str = str.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return str;
}

/**
 * Searches offline Dutch places instantly with multilingual query support.
 */
export function searchOfflineDutchPlaces(query: string): DutchPlace[] {
  const cleanQ = normalizeQuery(query);
  if (!cleanQ) return DUTCH_POPULAR_PLACES.slice(0, 8);

  // Check if query matches a known alias
  let aliasTarget = '';
  for (const [alias, target] of Object.entries(QUERY_ALIASES)) {
    if (cleanQ.includes(alias)) {
      aliasTarget = target;
      break;
    }
  }

  const searchTerms = [cleanQ];
  if (aliasTarget) searchTerms.push(aliasTarget);

  const matched = DUTCH_POPULAR_PLACES.filter((p) => {
    const t = p.title.toLowerCase();
    const s = p.subtitle.toLowerCase();
    const f = p.fullAddress.toLowerCase();
    return searchTerms.some((term) => t.includes(term) || s.includes(term) || f.includes(term));
  });

  return matched;
}

/**
 * Queries live Netherlands address suggestions via OpenStreetMap Nominatim Netherlands
 * Restricted strictly to countrycodes=nl
 */
export async function fetchLiveDutchAddressSuggestions(query: string): Promise<DutchPlace[]> {
  const cleanQ = query.trim();
  if (cleanQ.length < 2) {
    return searchOfflineDutchPlaces(cleanQ);
  }

  // First get offline matches
  const offlineMatches = searchOfflineDutchPlaces(cleanQ);

  // Check if query matches a known alias for Nominatim
  const normQ = normalizeQuery(cleanQ);
  let searchWord = cleanQ;
  for (const [alias, target] of Object.entries(QUERY_ALIASES)) {
    if (normQ.includes(alias)) {
      searchWord = target;
      break;
    }
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      searchWord
    )}&format=json&addressdetails=1&countrycodes=nl&limit=6`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'nl-NL,nl;q=0.9',
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error('Network response not ok');
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const liveResults: DutchPlace[] = data.map((item: any) => {
        const addr = item.address || {};
        const road = addr.road || addr.pedestrian || addr.street || item.name || '';
        const houseNum = addr.house_number ? ` ${addr.house_number}` : '';
        const city =
          addr.city || addr.town || addr.municipality || addr.village || addr.suburb || 'Nederland';
        const postcode = addr.postcode ? `${addr.postcode} ` : '';

        const title = `${road}${houseNum}`.trim() || item.display_name.split(',')[0];
        const subtitle = `${postcode}${city}, Nederland`.trim();
        const fullAddress = `${title}, ${subtitle}`;
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);

        if (!isNaN(lat) && !isNaN(lon)) {
          saveAddressCoordinates(fullAddress, lat, lon);
          saveAddressCoordinates(title, lat, lon);
        }

        return {
          title,
          subtitle,
          fullAddress,
          category: 'street' as const,
          lat: !isNaN(lat) ? lat : undefined,
          lon: !isNaN(lon) ? lon : undefined,
        };
      });

      // Merge avoiding duplicates
      const seen = new Set<string>();
      const combined: DutchPlace[] = [];

      for (const item of [...offlineMatches, ...liveResults]) {
        const key = item.fullAddress.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          combined.push(item);
        }
      }

      return combined.slice(0, 8);
    }
  } catch (err) {
    // If offline or network issue, fallback to rich offline matches
  }

  return offlineMatches;
}

/**
 * Performs reverse geocoding on GPS coordinates in the Netherlands
 */
export async function reverseGeocodeDutchGPS(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept-Language': 'nl-NL,nl;q=0.9' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const a = data.address;
        const road = a.road || a.pedestrian || a.suburb || '';
        const houseNumber = a.house_number ? ` ${a.house_number}` : '';
        const postcode = a.postcode ? ` ${a.postcode}` : '';
        const city = a.city || a.town || a.village || a.municipality || '';

        const streetLine = `${road}${houseNumber}`.trim();
        const cityLine = `${postcode} ${city}`.trim();

        if (streetLine && cityLine) {
          const formatted = `${streetLine}, ${cityLine}, Nederland`;
          saveAddressCoordinates(formatted, lat, lon);
          return formatted;
        } else if (cityLine) {
          const formatted = `${cityLine}, Nederland`;
          saveAddressCoordinates(formatted, lat, lon);
          return formatted;
        }
      }
    }
  } catch (e) {
    // Fallback if fetch fails
  }

  return `Huidige GPS Locatie (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E, Nederland)`;
}
