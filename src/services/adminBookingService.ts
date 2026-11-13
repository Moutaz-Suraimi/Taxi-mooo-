// ─── TAXI MOOO ADMIN BOOKING & DISPATCH SERVICE ──────────────────

export type OrderStatus =
  | 'nieuw'        // New incoming booking
  | 'bevestigd'    // Confirmed by dispatch
  | 'toegewezen'   // Assigned to driver
  | 'onderweg'     // Driver en route / ride in progress
  | 'voltooid'     // Completed
  | 'geannuleerd'; // Cancelled

export type PaymentMethod = 'cash' | 'ideal' | 'pin' | 'creditcard' | 'factuur';
export type PaymentStatus = 'betaald' | 'bij_chauffeur' | 'openstaand';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  status: 'beschikbaar' | 'bezig' | 'offline';
  rating: number;
}

export interface BookingOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  pickup: string;
  destination: string;
  stops: string[];
  estimatedKm: number;
  estimatedDurationMins: number;
  pickupDate: string;
  pickupTime: string;
  isReturnTrip: boolean;
  returnDate?: string;
  returnTime?: string;
  flightNumber?: string;
  vehicleType: 'klein' | 'groot';
  passengers: number;
  hasLuggage: boolean;
  kmRate: number;
  totalFare: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerNotes?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  assignedDriver?: Driver;
}

export interface PricingSettings {
  kleinKmRate: number;      // e.g. 2.39
  grootKmRate: number;      // e.g. 3.04
  minimumFare: number;      // e.g. 25.00
  nightSurchargePct: number;// e.g. 15%
  returnDiscountPct: number;// e.g. 10%
  stopFee: number;          // e.g. 4.50
}

export interface ContactInquiry {
  id: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
}

// ─── INITIAL MOCK DRIVERS ─────────────────────────────────
export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'DRV-01',
    name: 'Jan de Vries',
    phone: '+31 6 1234 5678',
    vehicle: 'Mercedes-Benz E-Klasse (Sedan)',
    plate: 'K-921-BV',
    status: 'beschikbaar',
    rating: 4.9,
  },
  {
    id: 'DRV-02',
    name: 'Moutaz Wael',
    phone: '+31 6 4121 2427',
    vehicle: 'Mercedes-Benz S-Klasse (VIP Limousine)',
    plate: 'G-344-TX',
    status: 'bezig',
    rating: 5.0,
  },
  {
    id: 'DRV-03',
    name: 'Lars van der Meer',
    phone: '+31 6 9876 5432',
    vehicle: 'Mercedes-Benz V-Klasse (Taxibus 8p)',
    plate: 'T-819-NN',
    status: 'beschikbaar',
    rating: 4.8,
  },
  {
    id: 'DRV-04',
    name: 'Tarik El Amrani',
    phone: '+31 6 5544 3322',
    vehicle: 'Mercedes-Benz E-Klasse (Sedan)',
    plate: 'X-102-LL',
    status: 'offline',
    rating: 4.9,
  },
];

// ─── INITIAL MOCK ORDERS ──────────────────────────────────
const INITIAL_ORDERS: BookingOrder[] = [
  {
    id: '#MOOO-942103',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: 'nieuw',
    pickup: 'Corelia de Langestraat 208, Haarlem',
    destination: 'Schiphol Airport (AMS), Vertrekpassage 1',
    stops: [],
    estimatedKm: 19.8,
    estimatedDurationMins: 22,
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: '19:45',
    isReturnTrip: false,
    vehicleType: 'klein',
    passengers: 2,
    hasLuggage: true,
    kmRate: 2.39,
    totalFare: 47.32,
    customerName: 'Pieter Bakker',
    customerPhone: '+31 6 8219 4012',
    customerEmail: 'p.bakker@tele2.nl',
    customerNotes: 'Graag hulp met 2 zware koffers voor Schiphol.',
    paymentMethod: 'ideal',
    paymentStatus: 'betaald',
  },
  {
    id: '#MOOO-849201',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'toegewezen',
    pickup: 'Amsterdam Centraal Station, Stationsplein',
    destination: 'Museumplein 6, Amsterdam',
    stops: ['Damrak 40, Amsterdam'],
    estimatedKm: 8.5,
    estimatedDurationMins: 18,
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: '17:30',
    isReturnTrip: false,
    vehicleType: 'klein',
    passengers: 1,
    hasLuggage: false,
    kmRate: 2.39,
    totalFare: 29.80,
    customerName: 'Sophie van Dijk',
    customerPhone: '+31 6 4912 3019',
    customerEmail: 'sophie.vd@gmail.com',
    paymentMethod: 'pin',
    paymentStatus: 'bij_chauffeur',
    assignedDriver: INITIAL_DRIVERS[0],
  },
  {
    id: '#MOOO-761294',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: 'onderweg',
    pickup: 'Keizersgracht 421, Amsterdam',
    destination: 'Rotterdam The Hague Airport (RTM)',
    stops: [],
    estimatedKm: 68.2,
    estimatedDurationMins: 55,
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: '15:15',
    isReturnTrip: false,
    vehicleType: 'groot',
    passengers: 5,
    hasLuggage: true,
    kmRate: 3.04,
    totalFare: 207.33,
    customerName: 'Alexander Lindemann (ASML)',
    customerPhone: '+31 6 3311 9988',
    customerEmail: 'a.lindemann@asml.com',
    paymentMethod: 'factuur',
    paymentStatus: 'openstaand',
    assignedDriver: INITIAL_DRIVERS[2],
  },
  {
    id: '#MOOO-631890',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'voltooid',
    pickup: 'Utrecht Centraal (Jaarbeursplein)',
    destination: 'Schiphol Airport (AMS)',
    stops: [],
    estimatedKm: 46.2,
    estimatedDurationMins: 40,
    pickupDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0],
    pickupTime: '09:00',
    isReturnTrip: true,
    returnDate: new Date().toISOString().split('T')[0],
    returnTime: '16:00',
    vehicleType: 'klein',
    passengers: 2,
    hasLuggage: true,
    kmRate: 2.39,
    totalFare: 220.84,
    customerName: 'Emma Willems',
    customerPhone: '+31 6 7788 1122',
    customerEmail: 'emma.willems@kpnmail.nl',
    paymentMethod: 'ideal',
    paymentStatus: 'betaald',
    assignedDriver: INITIAL_DRIVERS[1],
  },
];

const INITIAL_INQUIRIES: ContactInquiry[] = [
  {
    id: 'INQ-101',
    date: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    name: 'Mark Jansen',
    email: 'm.jansen@bedrijf.nl',
    phone: '+31 6 1122 3344',
    subject: 'Offerte zakelijk directievervoer',
    message: 'Beste Taxi mooo, wij zoeken een vaste partner voor wekelijks directievervoer tussen Haarlem en Schiphol. Wat zijn de zakelijke voorwaarden?',
    isRead: false,
  },
  {
    id: 'INQ-102',
    date: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    name: 'Fatima El-Kaderi',
    email: 'fatima.k@outlook.com',
    phone: '+31 6 9988 7766',
    subject: 'Rolstoelvervoer vraag',
    message: 'Kunnen jullie een opvouwbare rolstoel meenemen in een Mercedes sedan?',
    isRead: true,
  },
];

const DEFAULT_SETTINGS: PricingSettings = {
  kleinKmRate: 2.39,
  grootKmRate: 3.04,
  minimumFare: 25.0,
  nightSurchargePct: 15,
  returnDiscountPct: 10,
  stopFee: 4.5,
};

// ─── STORAGE KEYS ─────────────────────────────────────────
const ORDERS_KEY = 'taximooo_admin_orders_v1';
const DRIVERS_KEY = 'taximooo_admin_drivers_v1';
const SETTINGS_KEY = 'taximooo_admin_settings_v1';
const INQUIRIES_KEY = 'taximooo_admin_inquiries_v1';

// ─── SERVICE IMPLEMENTATION ───────────────────────────────
export const adminBookingService = {
  // Orders
  getOrders(): BookingOrder[] {
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      if (!stored) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrder(order: BookingOrder): BookingOrder {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save order to localStorage', e);
    }
    return order;
  },

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const orders = this.getOrders().map((o) =>
      o.id === orderId ? { ...o, status } : o
    );
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  },

  assignDriver(orderId: string, driver: Driver): void {
    const orders = this.getOrders().map((o) =>
      o.id === orderId ? { ...o, assignedDriver: driver, status: 'toegewezen' as OrderStatus } : o
    );
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  },

  deleteOrder(orderId: string): void {
    const orders = this.getOrders().filter((o) => o.id !== orderId);
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  },

  // Drivers
  getDrivers(): Driver[] {
    try {
      const stored = localStorage.getItem(DRIVERS_KEY);
      if (!stored) {
        localStorage.setItem(DRIVERS_KEY, JSON.stringify(INITIAL_DRIVERS));
        return INITIAL_DRIVERS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_DRIVERS;
    }
  },

  saveDriver(driver: Driver): void {
    const drivers = this.getDrivers();
    const idx = drivers.findIndex((d) => d.id === driver.id);
    let updated: Driver[];
    if (idx >= 0) {
      updated = [...drivers];
      updated[idx] = driver;
    } else {
      updated = [driver, ...drivers];
    }
    try {
      localStorage.setItem(DRIVERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },

  updateDriverStatus(driverId: string, status: Driver['status']): void {
    const drivers = this.getDrivers().map((d) =>
      d.id === driverId ? { ...d, status } : d
    );
    try {
      localStorage.setItem(DRIVERS_KEY, JSON.stringify(drivers));
    } catch (e) {
      console.error(e);
    }
  },

  // Pricing & Settings
  getSettings(): PricingSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: PricingSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  },

  // Inquiries
  getInquiries(): ContactInquiry[] {
    try {
      const stored = localStorage.getItem(INQUIRIES_KEY);
      if (!stored) {
        localStorage.setItem(INQUIRIES_KEY, JSON.stringify(INITIAL_INQUIRIES));
        return INITIAL_INQUIRIES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_INQUIRIES;
    }
  },

  saveInquiry(inquiry: Omit<ContactInquiry, 'id' | 'date' | 'isRead'>): ContactInquiry {
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString(),
      isRead: false,
    };
    const inquiries = [newInquiry, ...this.getInquiries()];
    try {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
    } catch (e) {
      console.error(e);
    }
    return newInquiry;
  },

  markInquiryRead(id: string): void {
    const inquiries = this.getInquiries().map((inq) =>
      inq.id === id ? { ...inq, isRead: true } : inq
    );
    try {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
    } catch (e) {
      console.error(e);
    }
  },

  // CSV Export
  exportOrdersToCSV(orders: BookingOrder[]): void {
    const headers = [
      'Reserveringsnummer',
      'Datum & Tijd',
      'Klantnaam',
      'Telefoonnummer',
      'E-mailadres',
      'Van (Vertrek)',
      'Naar (Bestemming)',
      'Afstand (km)',
      'Auto Type',
      'Passagiers',
      'Tarief (€)',
      'Betaalmethode',
      'Status',
      'Chauffeur',
    ];

    const rows = orders.map((o) => [
      o.id,
      `${o.pickupDate} ${o.pickupTime}`,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.customerEmail}"`,
      `"${o.pickup}"`,
      `"${o.destination}"`,
      o.estimatedKm,
      o.vehicleType === 'klein' ? 'Kleine auto' : 'Grote auto',
      o.passengers,
      o.totalFare.toFixed(2),
      o.paymentMethod,
      o.status,
      `"${o.assignedDriver?.name || 'Niet toegewezen'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `taximooo_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
