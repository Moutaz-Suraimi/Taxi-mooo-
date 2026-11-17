// ─── TAXI MOOO ADMIN BOOKING & DISPATCH SERVICE ──────────────────
import { supabaseDataService } from './supabaseDataService';

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
  kleinKmRate: number;       // e.g. 2.39
  grootKmRate: number;       // e.g. 3.04
  minimumFare: number;       // e.g. 25.00
  nightSurchargePct: number; // e.g. 15%
  returnDiscountPct: number; // e.g. 10%
  stopFee: number;           // e.g. 4.50
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

// ─── DEFAULT PRICING (fallback only) ─────────────────────────────
const DEFAULT_SETTINGS: PricingSettings = {
  kleinKmRate: 2.39,
  grootKmRate: 3.04,
  minimumFare: 25.0,
  nightSurchargePct: 15,
  returnDiscountPct: 10,
  stopFee: 4.5,
};

// ─── STORAGE KEYS ─────────────────────────────────────────────────
const ORDERS_KEY    = 'taximooo_admin_orders_v2';
const SETTINGS_KEY  = 'taximooo_admin_settings_v1';

// Cleanup any old legacy mock keys from localStorage
try {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('taximooo_admin_orders_v1');
    localStorage.removeItem('taximooo_admin_drivers_v1');
    localStorage.removeItem('taximooo_admin_inquiries_v1');
  }
} catch {}

// ─── SERVICE IMPLEMENTATION ───────────────────────────────────────
export const adminBookingService = {

  // ── Orders (localStorage cache only — Supabase is source of truth) ──

  getOrders(): BookingOrder[] {
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveOrder(order: BookingOrder): BookingOrder {
    // Save to localStorage immediately for instant UI
    const orders = this.getOrders();
    const updated = [order, ...orders.filter(o => o.id !== order.id)];
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save order to localStorage', e);
    }

    // Sync to Supabase in background (primary persistence)
    if (supabaseDataService.isLive()) {
      supabaseDataService.createOrder({
        orderNumber: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerNotes: order.customerNotes,
        pickupAddress: order.pickup,
        destinationAddress: order.destination,
        stops: order.stops,
        estimatedKm: order.estimatedKm,
        estimatedDurationMins: order.estimatedDurationMins,
        pickupDate: order.pickupDate,
        pickupTime: order.pickupTime,
        isReturnTrip: order.isReturnTrip,
        returnDate: order.returnDate,
        returnTime: order.returnTime,
        flightNumber: order.flightNumber,
        vehicleType: order.vehicleType,
        passengers: order.passengers,
        hasLuggage: order.hasLuggage,
        kmRate: order.kmRate,
        totalFare: order.totalFare,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
      })
        .then((res) => {
          console.log('✅ Order successfully saved to Supabase:', res);
        })
        .catch((err) => {
          console.error('❌ Supabase createOrder error:', err);
        });
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

  // ── Pricing & Settings ────────────────────────────────────────────

  getSettings(): PricingSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
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

  // ── CSV Export ────────────────────────────────────────────────────

  exportOrdersToCSV(orders: BookingOrder[]): void {
    const headers = [
      'Reserveringsnummer', 'Datum & Tijd', 'Klantnaam', 'Telefoonnummer',
      'E-mailadres', 'Van (Vertrek)', 'Naar (Bestemming)', 'Afstand (km)',
      'Auto Type', 'Passagiers', 'Tarief (€)', 'Betaalmethode', 'Status', 'Chauffeur',
    ];
    const rows = orders.map((o) => [
      o.id,
      `${o.pickupDate} ${o.pickupTime}`,
      `"${o.customerName}"`, `"${o.customerPhone}"`, `"${o.customerEmail}"`,
      `"${o.pickup}"`, `"${o.destination}"`,
      o.estimatedKm,
      o.vehicleType === 'klein' ? 'Kleine auto' : 'Grote auto',
      o.passengers, o.totalFare.toFixed(2), o.paymentMethod, o.status,
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
