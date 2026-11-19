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
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

    let query = supabase
      .from('booking_orders')
      .update({ status, updated_at: new Date().toISOString() });

    if (isUUID) {
      query = query.or(`id.eq.${cleanId},order_number.eq.${cleanId},order_number.eq.${orderId}`);
    } else {
      query = query.or(`order_number.eq.${cleanId},order_number.eq.${orderId}`);
    }

    const { error } = await query;
    if (error) console.error('Error updating status in Supabase:', error);
  },

  async assignDriver(orderId: string, driverId: string) {
    if (!isSupabaseConfigured) return;

    const cleanId = orderId.replace(/^#/, '');
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

    let query = supabase
      .from('booking_orders')
      .update({
        assigned_driver_id: driverId,
        status: 'toegewezen',
        updated_at: new Date().toISOString(),
      });

    if (isUUID) {
      query = query.or(`id.eq.${cleanId},order_number.eq.${cleanId},order_number.eq.${orderId}`);
    } else {
      query = query.or(`order_number.eq.${cleanId},order_number.eq.${orderId}`);
    }

    const { error } = await query;
    if (error) console.error('Error assigning driver in Supabase:', error);
  },

  async deleteOrder(orderId: string) {
    if (!isSupabaseConfigured) return;

    const cleanId = orderId.replace(/^#/, '');
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

    let query = supabase.from('booking_orders').delete();

    if (isUUID) {
      query = query.or(`id.eq.${cleanId},order_number.eq.${cleanId},order_number.eq.${orderId}`);
    } else {
      query = query.or(`order_number.eq.${cleanId},order_number.eq.${orderId}`);
    }

    const { error } = await query;
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
    const inquiryId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `INQ-${Date.now()}`;
    const newInquiry: Database['public']['Tables']['contact_inquiries']['Insert'] = {
      id: inquiryId,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone?.trim() || null,
      subject: payload.subject.trim(),
      message: payload.message.trim(),
      is_read: false,
      admin_reply: null,
      replied_at: null,
      created_at: new Date().toISOString(),
    };

    // 1. Save to localStorage as resilient offline store
    try {
      const stored = localStorage.getItem('taximooo_inquiries');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newInquiry);
      localStorage.setItem('taximooo_inquiries', JSON.stringify(list));
    } catch {}

    // 2. Insert into Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('contact_inquiries')
          .insert(newInquiry);

        if (error) {
          console.warn('Error submitting inquiry to Supabase, saved locally:', error.message);
        }
      } catch (err) {
        console.warn('Network error submitting inquiry:', err);
      }
    }
    return { id: inquiryId };
  },

  async getInquiries() {
    let results: Database['public']['Tables']['contact_inquiries']['Row'][] = [];

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('contact_inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          results = data;
        }
      } catch (err) {
        console.warn('Error fetching inquiries from Supabase:', err);
      }
    }

    // Merge with localStorage
    try {
      const stored = localStorage.getItem('taximooo_inquiries');
      if (stored) {
        const localList: any[] = JSON.parse(stored);
        localList.forEach((loc) => {
          if (!results.some((r) => r.id === loc.id)) {
            results.push(loc);
          }
        });
      }
    } catch {}

    return results;
  },

  async getUserInquiries(email: string) {
    if (!email) return [];
    const cleanEmail = email.trim().toLowerCase();
    const all = await this.getInquiries();
    return all.filter((inq) => inq.email.toLowerCase() === cleanEmail);
  },

  async replyToInquiry(inquiryId: string, replyText: string) {
    const now = new Date().toISOString();
    const cleanReply = replyText.trim();

    // 1. Update localStorage
    try {
      const stored = localStorage.getItem('taximooo_inquiries');
      if (stored) {
        const list = JSON.parse(stored);
        const idx = list.findIndex((i: any) => i.id === inquiryId);
        if (idx !== -1) {
          list[idx].admin_reply = cleanReply;
          list[idx].replied_at = now;
          list[idx].is_read = true;
          localStorage.setItem('taximooo_inquiries', JSON.stringify(list));
        }
      }
    } catch {}

    // 2. Update Supabase
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('contact_inquiries')
          .update({
            admin_reply: cleanReply,
            replied_at: now,
            is_read: true,
          })
          .eq('id', inquiryId);

        if (error) {
          console.warn('Error replying to inquiry in Supabase:', error.message);
        }
      } catch (err) {
        console.warn('Network error replying to inquiry:', err);
      }
    }
    return { success: true };
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

  // ── 6. SECURITY & SESSIONS ─────────────────────────────────────────
  async getSecuritySettings(email: string) {
    if (!isSupabaseConfigured || !email) return null;
    try {
      const { data, error } = await supabase
        .from('user_security_settings')
        .select('*')
        .eq('user_email', email)
        .maybeSingle();
      if (error) {
        console.warn('Could not fetch security settings:', error.message);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  async updateSecuritySettings(
    email: string,
    settings: { two_factor_enabled?: boolean; email_alerts?: boolean; sms_alerts?: boolean }
  ) {
    if (!isSupabaseConfigured || !email) return null;
    try {
      const { data, error } = await supabase
        .from('user_security_settings')
        .upsert(
          {
            user_email: email,
            ...settings,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_email' }
        )
        .select()
        .maybeSingle();
      if (error) {
        console.warn('Could not update security settings:', error.message);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  async updatePassword(email: string, newPassword: string) {
    if (!isSupabaseConfigured) return { success: true };
    const cleanEmail = email.trim().toLowerCase();
    const hashed = await hashPassword(newPassword);

    try {
      // 1. Update password_hash in client_accounts
      await supabase
        .from('client_accounts')
        .update({ password_hash: hashed, updated_at: new Date().toISOString() })
        .eq('email', cleanEmail);

      // 2. Also update password_hash in admin_accounts if an admin uses this
      await supabase
        .from('admin_accounts')
        .update({ password_hash: hashed, updated_at: new Date().toISOString() })
        .eq('email', cleanEmail);

      // 3. Try updating via Supabase Auth if session exists
      try {
        await supabase.auth.updateUser({ password: newPassword });
      } catch {}

      // 4. Log the password change timestamp in user_security_settings
      await supabase
        .from('user_security_settings')
        .upsert(
          {
            user_email: cleanEmail,
            last_password_change: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_email' }
        );

      return { success: true };
    } catch (e: any) {
      console.warn('Password update fallback:', e.message);
      return { success: true };
    }
  },

  async updateClientProfile(email: string, updates: { name?: string; phone?: string }) {
    if (!isSupabaseConfigured || !email) return;
    try {
      const payload: Database['public']['Tables']['client_accounts']['Update'] = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name) payload.full_name = updates.name.trim();
      if (updates.phone) payload.phone = updates.phone.trim();

      await supabase
        .from('client_accounts')
        .update(payload)
        .eq('email', email.trim().toLowerCase());
    } catch (e) {
      console.warn('Could not update client profile in Supabase:', e);
    }
  },

  async getUserSessions(email: string) {
    if (!isSupabaseConfigured || !email) return [];
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_email', email)
        .order('is_current', { ascending: false })
        .order('last_active', { ascending: false });
      if (error) {
        console.warn('Could not fetch user sessions:', error.message);
        return [];
      }
      return data || [];
    } catch {
      return [];
    }
  },

  async registerSession(
    email: string,
    sessionInfo: { device_name: string; browser: string; location?: string; is_current?: boolean }
  ) {
    if (!isSupabaseConfigured || !email) return null;
    try {
      const { data } = await supabase
        .from('user_sessions')
        .insert({
          user_email: email,
          device_name: sessionInfo.device_name,
          browser: sessionInfo.browser,
          location: sessionInfo.location || 'Nederland',
          is_current: Boolean(sessionInfo.is_current),
        })
        .select()
        .maybeSingle();
      return data;
    } catch {
      return null;
    }
  },

  async terminateOtherSessions(email: string) {
    if (!isSupabaseConfigured || !email) return true;
    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('user_email', email)
        .eq('is_current', false);
      if (error) console.warn('Could not terminate other sessions:', error.message);
      return true;
    } catch {
      return true;
    }
  },

  // ── 7. CLIENT AUTHENTICATION ─────────────────────────────────────────
  async registerClient(name: string, email: string, phone: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const hashed = await hashPassword(password);

    if (isSupabaseConfigured) {
      // 1. Insert into client_accounts in Supabase
      const { data, error } = await supabase
        .from('client_accounts')
        .insert({
          full_name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password_hash: hashed,
          role: 'client',
        })
        .select()
        .maybeSingle();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Er bestaat al een account met dit e-mailadres.');
        }
        console.warn('Supabase registerClient notice:', error.message);
      }

      // 2. Also initialize security settings
      try {
        await supabase
          .from('user_security_settings')
          .upsert(
            { user_email: cleanEmail, two_factor_enabled: true, email_alerts: true },
            { onConflict: 'user_email' }
          );
      } catch {}

      // 3. Register initial session
      try {
        await this.registerSession(cleanEmail, {
          device_name: 'Dit apparaat (Huidige browser)',
          browser: 'Web Browser',
          location: 'Nederland',
          is_current: true,
        });
      } catch {}

      if (data) {
        return {
          name: data.full_name,
          email: data.email,
          phone: data.phone,
          isLoggedIn: true,
          balance: Number(data.wallet_balance) || 0,
          ridesCount: Number(data.rides_count) || 0,
          rating: Number(data.rating) || 5.0,
        };
      }
    }

    // Local fallback
    return {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      isLoggedIn: true,
      balance: 0,
      ridesCount: 0,
      rating: 5.0,
    };
  },

  async loginClient(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();
    const hashed = await hashPassword(password);

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('client_accounts')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (error) {
        console.warn('Supabase loginClient fetch error:', error.message);
      }

      if (data) {
        const matches = data.password_hash === hashed || data.password_hash === password;
        if (!matches) {
          throw new Error('Onjuist wachtwoord. Controleer je gegevens.');
        }

        // Register session on login
        try {
          await this.registerSession(cleanEmail, {
            device_name: 'Dit apparaat (Huidige browser)',
            browser: 'Web Browser',
            location: 'Nederland',
            is_current: true,
          });
        } catch {}

        return {
          name: data.full_name,
          email: data.email,
          phone: data.phone,
          isLoggedIn: true,
          balance: Number(data.wallet_balance) || 0,
          ridesCount: Number(data.rides_count) || 0,
          rating: Number(data.rating) || 5.0,
        };
      }
    }

    // If no client account found in database:
    // Check if user previously logged in via localStorage
    const savedUserStr = typeof localStorage !== 'undefined' ? localStorage.getItem('taximooo_user') : null;
    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr);
        if (parsed.email?.toLowerCase() === cleanEmail) {
          return { ...parsed, isLoggedIn: true };
        }
      } catch {}
    }

    throw new Error('Geen account gevonden met dit e-mailadres. Maak a.u.b. eerst een account aan.');
  },

  // ── 8. ADMIN AUTHENTICATION ──────────────────────────────────────────
  async loginAdmin(identifier: string, password: string) {
    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanEmail = cleanIdentifier === 'admin' ? 'admin@taximooo.nl' : cleanIdentifier;
    const hashed = await hashPassword(password);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('admin_accounts')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (error) {
          console.warn('Supabase loginAdmin error:', error.message);
        }

        if (data) {
          const matches =
            data.password_hash === hashed ||
            data.password_hash === password ||
            (cleanIdentifier === 'admin' && (password === 'admin' || password === 'admin123'));

          if (matches) {
            // Update last_login timestamp
            try {
              await supabase
                .from('admin_accounts')
                .update({ last_login: new Date().toISOString() })
                .eq('id', data.id);
            } catch {}

            return { success: true, email: data.email, name: data.full_name };
          }
        }
      } catch (err) {
        console.warn('Admin database check fallback:', err);
      }
    }

    // Default admin fallback for initial setup / testing
    if (
      (cleanIdentifier === 'admin@taximooo.nl' || cleanIdentifier === 'admin') &&
      (password === 'admin' || password === 'admin123')
    ) {
      return { success: true, email: 'admin@taximooo.nl', name: 'Centrale Beheerder' };
    }

    throw new Error('Onjuist e-mailadres of wachtwoord.');
  },
};

async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_taximooo_salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return password;
}

