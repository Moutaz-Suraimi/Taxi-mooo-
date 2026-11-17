import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Database, OrderStatus, DriverStatus, PaymentMethod, PaymentStatus, VehicleType } from '../types/database.types';
import type { BookingOrder } from './adminBookingService';

export interface CreateBookingPayload {
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes?: string;
  pickupAddress: string;
  destinationAddress: string;
  stops?: string[];
  estimatedKm: number;
  estimatedDurationMins?: number;
  pickupDate: string;
  pickupTime: string;
  isReturnTrip?: boolean;
  returnDate?: string;
  returnTime?: string;
  flightNumber?: string;
  vehicleType: VehicleType;
  passengers: number;
  hasLuggage: boolean;
  kmRate: number;
  totalFare: number;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  customerId?: string;
}

export function mapSupabaseOrderToBookingOrder(row: any): BookingOrder {
  return {
    id: row.order_number || row.id,
    createdAt: row.created_at || new Date().toISOString(),
    status: (row.status || 'nieuw') as OrderStatus,
    pickup: row.pickup_address || '',
    destination: row.destination_address || '',
    stops: Array.isArray(row.stops) ? row.stops.map((s: any) => s.address || String(s)) : [],
    estimatedKm: Number(row.estimated_km) || 0,
    estimatedDurationMins: Number(row.estimated_duration_mins) || 30,
    pickupDate: row.pickup_date || '',
    pickupTime: row.pickup_time || '',
    isReturnTrip: Boolean(row.is_return_trip),
    returnDate: row.return_date || undefined,
    returnTime: row.return_time || undefined,
    flightNumber: row.flight_number || undefined,
    vehicleType: (row.vehicle_type || 'klein') as 'klein' | 'groot',
    passengers: Number(row.passengers) || 1,
    hasLuggage: Boolean(row.has_luggage),
    kmRate: Number(row.km_rate) || 2.39,
    totalFare: Number(row.total_fare) || 0,
    customerName: row.customer_name || 'Klant',
    customerPhone: row.customer_phone || '',
    customerEmail: row.customer_email || '',
    customerNotes: row.customer_notes || undefined,
    paymentMethod: (row.payment_method || 'ideal') as PaymentMethod,
    paymentStatus: (row.payment_status || 'openstaand') as PaymentStatus,
    assignedDriver: row.assigned_driver ? {
      id: row.assigned_driver.id,
      name: row.assigned_driver.full_name,
      phone: row.assigned_driver.phone,
      vehicle: row.assigned_driver.vehicle_model,
      plate: row.assigned_driver.vehicle_plate,
      status: row.assigned_driver.status,
      rating: Number(row.assigned_driver.rating) || 5.0,
    } : undefined,
  };
}

export const supabaseDataService = {
  // Check if live Supabase backend is active
  isLive: () => isSupabaseConfigured,

  // ── 1. BOOKINGS ───────────────────────────────────────────────────
  async createOrder(payload: CreateBookingPayload) {
    if (!isSupabaseConfigured) return null;

    const orderId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `TXM-${Date.now()}`;
    const orderNumber = payload.orderNumber || `TXM-${Date.now().toString().slice(-6)}`;

    const sanitize = (val?: string | null) => (val && typeof val === 'string' && val.trim() ? val.trim() : null);

    const { error } = await supabase
      .from('booking_orders')
      .insert({
        id: orderId,
        order_number: orderNumber,
        customer_id: payload.customerId || null,
        customer_name: payload.customerName,
        customer_email: payload.customerEmail,
        customer_phone: payload.customerPhone,
        customer_notes: sanitize(payload.customerNotes),
        pickup_address: payload.pickupAddress,
        destination_address: payload.destinationAddress,
        estimated_km: payload.estimatedKm,
        estimated_duration_mins: payload.estimatedDurationMins || null,
        pickup_date: payload.pickupDate,
        pickup_time: payload.pickupTime,
        is_return_trip: Boolean(payload.isReturnTrip),
        return_date: payload.isReturnTrip ? sanitize(payload.returnDate) : null,
        return_time: payload.isReturnTrip ? sanitize(payload.returnTime) : null,
        flight_number: sanitize(payload.flightNumber),
        vehicle_type: payload.vehicleType,
        passengers: payload.passengers,
        has_luggage: Boolean(payload.hasLuggage),
        km_rate: payload.kmRate,
        total_fare: payload.totalFare,
        payment_method: payload.paymentMethod,
        payment_status: payload.paymentStatus || 'openstaand',
        status: 'nieuw',
      });

    if (error) {
      console.error('Error inserting booking order:', error);
      throw error;
    }

    // Insert intermediate stops if any
    if (payload.stops && payload.stops.length > 0) {
      const stopsData = payload.stops.filter((s) => s && s.trim()).map((stop, index) => ({
        order_id: orderId,
        stop_order: index + 1,
        address: stop.trim(),
      }));
      if (stopsData.length > 0) {
        await supabase.from('order_stops').insert(stopsData);
      }
    }

    return { id: orderId, order_number: orderNumber };
  },

  async getAllOrders() {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('booking_orders')
      .select(`
        *,
        assigned_driver:drivers(*),
        stops:order_stops(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    return data;
  },

  async getCustomerOrders(customerId: string) {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('booking_orders')
      .select('*')
      .eq('customer_id', customerId)
      .order('pickup_date', { ascending: false });

    if (error) {
      console.error('Error fetching customer orders:', error);
      return [];
    }
    return data;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    if (!isSupabaseConfigured) return;

    // Remove leading # if present
    const cleanId = orderId.replace(/^#/, '');

    const { error } = await supabase
      .from('booking_orders')
      .update({ status, updated_at: new Date().toISOString() })
      .or(`id.eq.${cleanId},order_number.eq.${cleanId},order_number.eq.${orderId}`);

    if (error) console.error('Error updating status in Supabase:', error);
  },

  async assignDriver(orderId: string, driverId: string) {
    if (!isSupabaseConfigured) return;

    const cleanId = orderId.replace(/^#/, '');

    const { error } = await supabase
      .from('booking_orders')
      .update({
        assigned_driver_id: driverId,
        status: 'toegewezen',
        updated_at: new Date().toISOString(),
      })
      .or(`id.eq.${cleanId},order_number.eq.${cleanId},order_number.eq.${orderId}`);

    if (error) console.error('Error assigning driver in Supabase:', error);
  },

  async deleteOrder(orderId: string) {
    if (!isSupabaseConfigured) return;

    const cleanId = orderId.replace(/^#/, '');

    const { error } = await supabase
      .from('booking_orders')
      .delete()
      .or(`id.eq.${cleanId},order_number.eq.${cleanId},order_number.eq.${orderId}`);

    if (error) console.error('Error deleting order in Supabase:', error);
  },

  // Get orders by customer email (for client dashboard — no login required)
  async getOrdersByEmail(email: string) {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('booking_orders')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders by email:', error);
      return [];
    }
    return data;
  },

  // ── 2. DRIVERS ────────────────────────────────────────────────────
  async getDrivers() {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('driver_code', { ascending: true });

    if (error) {
      console.error('Error fetching drivers:', error);
      return [];
    }
    return data;
  },

  async updateDriverStatus(driverId: string, status: DriverStatus) {
    if (!isSupabaseConfigured) return;

    const { error } = await supabase
      .from('drivers')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', driverId);

    if (error) console.error('Error updating driver status:', error);
  },

  // ── 3. PRICING SETTINGS ───────────────────────────────────────────
  async getPricingSettings() {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from('pricing_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching pricing settings:', error);
      return null;
    }
    return data;
  },

  async updatePricingSettings(settings: Partial<Database['public']['Tables']['pricing_settings']['Update']>) {
    if (!isSupabaseConfigured) return;

    const { error } = await supabase
      .from('pricing_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // updates the row

    if (error) console.error('Error updating pricing:', error);
  },

  // ── 4. CONTACT INQUIRIES ──────────────────────────────────────────
  async submitInquiry(payload: { name: string; email: string; phone?: string; subject: string; message: string }) {
    if (!isSupabaseConfigured) return null;

    const inquiryId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `INQ-${Date.now()}`;

    const { error } = await supabase
      .from('contact_inquiries')
      .insert({
        id: inquiryId,
        name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        subject: payload.subject,
        message: payload.message,
      });

    if (error) {
      console.error('Error submitting inquiry:', error);
      throw error;
    }
    return { id: inquiryId };
  },

  async getInquiries() {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inquiries:', error);
      return [];
    }
    return data;
  },

  async markInquiryAsRead(id: string) {
    if (!isSupabaseConfigured) return;

    const { error } = await supabase
      .from('contact_inquiries')
      .update({ is_read: true })
      .eq('id', id);

    if (error) console.error('Error updating inquiry status:', error);
  },

  // ── 5. REALTIME SUBSCRIPTION ──────────────────────────────────────
  subscribeToOrders(onInsert: (order: Database['public']['Tables']['booking_orders']['Row']) => void) {
    if (!isSupabaseConfigured) return () => {};

    const channel = supabase
      .channel('public:booking_orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'booking_orders' },
        (payload) => {
          onInsert(payload.new as Database['public']['Tables']['booking_orders']['Row']);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};

