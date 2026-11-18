export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus = 'nieuw' | 'bevestigd' | 'toegewezen' | 'onderweg' | 'voltooid' | 'geannuleerd';
export type PaymentMethod = 'cash' | 'ideal' | 'pin' | 'creditcard' | 'factuur';
export type PaymentStatus = 'betaald' | 'bij_chauffeur' | 'openstaand';
export type DriverStatus = 'beschikbaar' | 'bezig' | 'offline';
export type VehicleType = 'klein' | 'groot';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          role: 'client' | 'admin' | 'dispatcher';
          wallet_balance: number;
          rides_count: number;
          rating: number;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          role?: 'client' | 'admin' | 'dispatcher';
          wallet_balance?: number;
          rides_count?: number;
          rating?: number;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          role?: 'client' | 'admin' | 'dispatcher';
          wallet_balance?: number;
          rides_count?: number;
          rating?: number;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      drivers: {
        Row: {
          id: string;
          driver_code: string | null;
          full_name: string;
          phone: string;
          vehicle_model: string;
          vehicle_plate: string;
          vehicle_type: VehicleType;
          status: DriverStatus;
          rating: number;
          total_trips: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          driver_code?: string | null;
          full_name: string;
          phone: string;
          vehicle_model: string;
          vehicle_plate: string;
          vehicle_type?: VehicleType;
          status?: DriverStatus;
          rating?: number;
          total_trips?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          driver_code?: string | null;
          full_name?: string;
          phone?: string;
          vehicle_model?: string;
          vehicle_plate?: string;
          vehicle_type?: VehicleType;
          status?: DriverStatus;
          rating?: number;
          total_trips?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      booking_orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          assigned_driver_id: string | null;
          status: OrderStatus;
          pickup_address: string;
          destination_address: string;
          estimated_km: number;
          estimated_duration_mins: number | null;
          pickup_date: string;
          pickup_time: string;
          is_return_trip: boolean;
          return_date: string | null;
          return_time: string | null;
          flight_number: string | null;
          vehicle_type: VehicleType;
          passengers: number;
          has_luggage: boolean;
          km_rate: number;
          total_fare: number;
          customer_name: string;
          customer_phone: string;
          customer_email: string;
          customer_notes: string | null;
          payment_method: PaymentMethod;
          payment_status: PaymentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          assigned_driver_id?: string | null;
          status?: OrderStatus;
          pickup_address: string;
          destination_address: string;
          estimated_km: number;
          estimated_duration_mins?: number | null;
          pickup_date: string;
          pickup_time: string;
          is_return_trip?: boolean;
          return_date?: string | null;
          return_time?: string | null;
          flight_number?: string | null;
          vehicle_type?: VehicleType;
          passengers?: number;
          has_luggage?: boolean;
          km_rate: number;
          total_fare: number;
          customer_name: string;
          customer_phone: string;
          customer_email: string;
          customer_notes?: string | null;
          payment_method?: PaymentMethod;
          payment_status?: PaymentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          assigned_driver_id?: string | null;
          status?: OrderStatus;
          pickup_address?: string;
          destination_address?: string;
          estimated_km?: number;
          estimated_duration_mins?: number | null;
          pickup_date?: string;
          pickup_time?: string;
          is_return_trip?: boolean;
          return_date?: string | null;
          return_time?: string | null;
          flight_number?: string | null;
          vehicle_type?: VehicleType;
          passengers?: number;
          has_luggage?: boolean;
          km_rate?: number;
          total_fare?: number;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string;
          customer_notes?: string | null;
          payment_method?: PaymentMethod;
          payment_status?: PaymentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_stops: {
        Row: {
          id: string;
          order_id: string;
          stop_order: number;
          address: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          stop_order?: number;
          address: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          stop_order?: number;
          address?: string;
        };
        Relationships: [];
      };
      saved_places: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          address: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          address: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          address?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      pricing_settings: {
        Row: {
          id: string;
          klein_km_rate: number;
          groot_km_rate: number;
          minimum_fare: number;
          night_surcharge_pct: number;
          return_discount_pct: number;
          stop_fee: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          klein_km_rate?: number;
          groot_km_rate?: number;
          minimum_fare?: number;
          night_surcharge_pct?: number;
          return_discount_pct?: number;
          stop_fee?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          klein_km_rate?: number;
          groot_km_rate?: number;
          minimum_fare?: number;
          night_surcharge_pct?: number;
          return_discount_pct?: number;
          stop_fee?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_inquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          is_read: boolean;
          admin_reply: string | null;
          replied_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject: string;
          message: string;
          is_read?: boolean;
          admin_reply?: string | null;
          replied_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string;
          message?: string;
          is_read?: boolean;
          admin_reply?: string | null;
          replied_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_security_settings: {
        Row: {
          id: string;
          user_email: string;
          two_factor_enabled: boolean;
          email_alerts: boolean;
          sms_alerts: boolean;
          last_password_change: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_email: string;
          two_factor_enabled?: boolean;
          email_alerts?: boolean;
          sms_alerts?: boolean;
          last_password_change?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_email?: string;
          two_factor_enabled?: boolean;
          email_alerts?: boolean;
          sms_alerts?: boolean;
          last_password_change?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_sessions: {
        Row: {
          id: string;
          user_email: string;
          device_name: string;
          browser: string;
          ip_address: string | null;
          location: string;
          is_current: boolean;
          last_active: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_email: string;
          device_name: string;
          browser: string;
          ip_address?: string | null;
          location?: string;
          is_current?: boolean;
          last_active?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_email?: string;
          device_name?: string;
          browser?: string;
          ip_address?: string | null;
          location?: string;
          is_current?: boolean;
          last_active?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      client_accounts: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          password_hash: string;
          role: string;
          wallet_balance: number;
          rides_count: number;
          rating: number;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone: string;
          password_hash: string;
          role?: string;
          wallet_balance?: number;
          rides_count?: number;
          rating?: number;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          password_hash?: string;
          role?: string;
          wallet_balance?: number;
          rides_count?: number;
          rating?: number;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_accounts: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          password_hash: string;
          role: string;
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name?: string;
          email: string;
          password_hash: string;
          role?: string;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          password_hash?: string;
          role?: string;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
