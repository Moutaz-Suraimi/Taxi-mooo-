import React, { useState, useEffect, useCallback } from 'react';
import {
  User, Mail, Shield, CreditCard, Star, Car, Wallet, Clock,
  CheckCircle2, LogOut, ChevronRight, MapPin,
  Headphones, Bell, ChevronDown, ArrowRight,
  Home, Menu, X, Phone,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { supabaseDataService, mapSupabaseOrderToBookingOrder } from '../services/supabaseDataService';

// ─── Brand tokens ──────────────────────────────────────
const NAVY   = '#001331';
const NAVY2  = '#00255c';
const YELLOW = '#FFB800';

interface AuthUser {
  name: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
  balance: number;
  ridesCount: number;
  rating: number;
}

type DashSection =
  | 'dashboard'
  | 'accountgegevens'
  | 'beveiliging'
  | 'betaalmethoden'
  | 'favorieten'
  | 'klantenservice';

interface ClientDashboardProps {
  onExit: () => void;
  onOpenAccount: () => void;
  onNavigateToContact?: () => void;
}

// ─── Helpers ────────────────────────────────────────────
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'TM';
}

// ─── Sidebar nav items ──────────────────────────────────
const NAV_ITEMS: { id: DashSection; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',      label: 'Dashboard',           icon: <Home className="w-4 h-4" /> },
  { id: 'accountgegevens',label: 'Accountgegevens',    icon: <User className="w-4 h-4" /> },
  { id: 'beveiliging',   label: 'Inloggen & beveiliging', icon: <Shield className="w-4 h-4" /> },
  { id: 'betaalmethoden', label: 'Betaalmethoden',     icon: <CreditCard className="w-4 h-4" /> },
  { id: 'favorieten',    label: 'Favoriete locaties',  icon: <Star className="w-4 h-4" /> },
  { id: 'klantenservice',label: 'Klantenservice',       icon: <Headphones className="w-4 h-4" /> },
];

// ─── GRID MENU CARDS (main dashboard) ───────────────────
const MENU_CARDS: {
  id: DashSection;
  icon: React.ReactNode;
  title: string;
  sub: string;
  span?: boolean;
}[] = [
  { id: 'accountgegevens', icon: <User className="w-5 h-5" />,       title: 'Accountgegevens',        sub: 'Bekijk en wijzig je gegevens' },
  { id: 'beveiliging',     icon: <Shield className="w-5 h-5" />,     title: 'Inloggen & beveiliging', sub: 'Beveilig je account' },
  { id: 'betaalmethoden',  icon: <CreditCard className="w-5 h-5" />, title: 'Betaalmethoden',          sub: 'Beheer je betaalmethoden' },
  { id: 'favorieten',      icon: <Star className="w-5 h-5" />,       title: 'Favoriete locaties',      sub: 'Sla je favoriete adressen op' },
  { id: 'klantenservice',  icon: <Headphones className="w-5 h-5" />, title: 'Klantenservice',          sub: 'Hulp nodig? Neem contact met ons op', span: true },
];

// ─── Mock recent rides ─── REMOVED (now uses live Supabase data) ───

// ══════════════════════════════════════════════════════════
//  SECTION VIEWS
// ══════════════════════════════════════════════════════════

function SectionPlaceholder({ title, description, icon }: { title: string; description: string; icon: React.ReactElement<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] text-center px-6">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-md"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`, color: YELLOW }}
      >
        {React.cloneElement(icon, { className: 'w-9 h-9' })}
      </div>
      <h2 className="text-2xl font-black text-[#001331] mb-2">{title}</h2>
      <p className="text-sm text-gray-500 max-w-xs">{description}</p>
      <div
        className="mt-6 px-6 py-3 rounded-2xl text-sm font-bold text-[#001331] shadow"
        style={{ background: YELLOW }}
      >
        Binnenkort beschikbaar
      </div>
    </div>
  );
}

// ─── ACCOUNT INFO SECTION ───────────────────────────────
function AccountGegevensSection({ user, onSave }: { user: AuthUser; onSave: (u: Partial<AuthUser>) => void }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-black text-[#001331] mb-1">Accountgegevens</h2>
        <p className="text-sm text-gray-500">Bekijk en wijzig je persoonlijke gegevens.</p>
      </div>

      {saved && (
        <div className="p-3.5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2 text-sm text-green-700 font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> Gegevens opgeslagen!
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl border-4 border-white shadow-lg"
          style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`, color: YELLOW }}
        >
          {getInitials(user.name)}
        </div>
        <div>
          <p className="font-bold text-[#001331]">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold mt-1"
            style={{ background: YELLOW, color: NAVY }}
          >
            👑 Premium klant
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Volledige naam</label>
          <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-2xl focus-within:border-[#00255c] focus-within:ring-4 focus-within:ring-[#00255c]/10 transition">
            <User className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent text-sm text-[#07152B] focus:outline-none"
            />
          </div>
        </div>

        {/* Email (readonly) */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">E-mailadres</label>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl opacity-70">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full bg-transparent text-sm text-gray-500 focus:outline-none cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 ml-1">E-mailadres kan niet worden gewijzigd.</p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Telefoonnummer</label>
          <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-2xl focus-within:border-[#00255c] focus-within:ring-4 focus-within:ring-[#00255c]/10 transition">
            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-transparent text-sm text-[#07152B] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-2xl text-sm font-bold text-[#001331] shadow hover:shadow-md transition"
          style={{ background: YELLOW }}
        >
          Wijzigingen opslaan
        </button>
      </form>
    </div>
  );
}

// ─── KLANTENSERVICE SECTION ─────────────────────────────
function KlantenserviceSection({ onContact }: { onContact?: () => void }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-black text-[#001331] mb-1">Klantenservice & Centrale</h2>
        <p className="text-sm text-gray-500">24/7 bereikbaar voor ondersteuning, ritwijzigingen en vragen.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Phone */}
        <a
          href="tel:+31641212427"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-[#FFB800] hover:shadow-md transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#FFF8E7', color: '#E6A500' }}>
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase">Bellen (24/7)</div>
            <div className="text-base font-black text-[#07152B] group-hover:text-[#00255c] transition">+31 6 41212427</div>
          </div>
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/31641212427"
          target="_blank"
          rel="noreferrer"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-green-400 hover:shadow-md transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase">WhatsApp Chat</div>
            <div className="text-base font-black text-[#07152B] group-hover:text-green-600 transition">+31 6 41212427</div>
          </div>
        </a>

        {/* Email */}
        <a
          href="mailto:info@taximooo.nl"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex items-center gap-4 group sm:col-span-2"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#00255c] flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase">E-mail support</div>
            <div className="text-base font-black text-[#07152B]">info@taximooo.nl</div>
          </div>
        </a>
      </div>

      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-[#001331] text-base">Direct een bericht of offerte sturen?</h4>
          <p className="text-xs text-gray-500 mt-0.5">Ga direct naar de officiële contact- en centrale-pagina van Taxi mooo.</p>
        </div>
        {onContact && (
          <button
            onClick={onContact}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-[#001331] shadow hover:shadow-md transition cursor-pointer shrink-0"
            style={{ background: YELLOW }}
          >
            <span>Neem contact op</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ─────────────────────────────────────
interface RecentRide {
  from: string;
  to: string;
  date: string;
  time: string;
  status: string;
  price: string;
}

function MainDashboard({ user, onNavigate, onContact, recentRides, ridesLoading }: {
  user: AuthUser;
  onNavigate: (s: DashSection) => void;
  onContact?: () => void;
  recentRides: RecentRide[];
  ridesLoading: boolean;
}) {
  return (
    <div className="space-y-6">

      {/* ── Profile Hero Banner ── */}
      <div
        className="relative overflow-hidden text-white flex items-center select-none"
        style={{
          background: '#0d0d0d',
          minHeight: '128px',
          borderRadius: '20px',
        }}
      >
        {/* ── Dark metallic gradient base ── */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(100deg, #111 0%, #1c1c1c 45%, #0e0e0e 100%)' }} />

        {/* ── Left yellow outer arc (like the image circle behind avatar) ── */}
        <div className="absolute pointer-events-none"
          style={{
            left: '-10px', top: '50%', transform: 'translateY(-50%)',
            width: '160px', height: '160px',
            borderRadius: '50%',
            border: `6px solid ${YELLOW}`,
            opacity: 0.9,
          }}
        />

        {/* ── Diagonal yellow slashes — center-left area ── */}
        {/* Slash 1 */}
        <div className="absolute pointer-events-none"
          style={{
            left: '28%', top: 0, width: '6px', height: '100%',
            background: YELLOW,
            transform: 'skewX(-18deg)',
            opacity: 0.9,
          }}
        />
        {/* Slash 2 */}
        <div className="absolute pointer-events-none"
          style={{
            left: 'calc(28% + 18px)', top: 0, width: '3px', height: '100%',
            background: YELLOW,
            transform: 'skewX(-18deg)',
            opacity: 0.6,
          }}
        />

        {/* ── Checkered flag area ── */}
        <div className="absolute pointer-events-none"
          style={{
            left: '32%', top: '50%', transform: 'translateY(-50%)',
            width: '100px', height: '72px',
            backgroundImage: `
              linear-gradient(45deg, #333 25%, transparent 25%),
              linear-gradient(-45deg, #333 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #333 75%),
              linear-gradient(-45deg, transparent 75%, #333 75%)
            `,
            backgroundSize: '18px 18px',
            backgroundPosition: '0 0, 0 9px, 9px -9px, -9px 0px',
            opacity: 0.55,
            borderRadius: '4px',
          }}
        />

        {/* ── Right side golden diagonal accents ── */}
        <div className="absolute pointer-events-none"
          style={{
            right: '12%', top: 0, width: '8px', height: '100%',
            background: YELLOW,
            transform: 'skewX(-15deg)',
            opacity: 0.85,
          }}
        />
        <div className="absolute pointer-events-none"
          style={{
            right: 'calc(12% + 18px)', top: 0, width: '3px', height: '100%',
            background: YELLOW,
            transform: 'skewX(-15deg)',
            opacity: 0.45,
          }}
        />

        {/* ── CONTENT ── */}
        <div className="relative z-10 flex items-center gap-0 w-full p-2 sm:p-3">

          {/* Avatar */}
          <div className="relative shrink-0 mx-4 sm:mx-5">
            {/* Outer yellow ring */}
            <div style={{
              width: '76px', height: '76px', borderRadius: '50%',
              background: `conic-gradient(${YELLOW} 0deg 300deg, transparent 300deg 360deg)`,
              padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: '70px', height: '70px', borderRadius: '50%',
                background: '#181818',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: YELLOW, fontWeight: 900, fontSize: '22px',
              }}>
                {getInitials(user.name)}
              </div>
            </div>
            {/* Green online dot */}
            <span className="absolute"
              style={{
                bottom: '4px', right: '4px',
                width: '16px', height: '16px',
                borderRadius: '50%',
                background: '#16a34a',
                border: '2.5px solid #0d0d0d',
                display: 'block',
              }}
            />
          </div>

          {/* Vertical divider */}
          <div style={{ width: '1px', alignSelf: 'stretch', background: 'rgba(255,255,255,0.15)', margin: '16px 0' }} />

          {/* Text block */}
          <div className="min-w-0 px-4 sm:px-5 py-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '4px' }}>
              {user.name}
            </h2>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: '10px' }}>
              <Mail className="w-3 h-3 shrink-0" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </span>
            </p>
            {/* Premium badge — matches image exactly */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: YELLOW,
              color: '#000',
              fontWeight: 900,
              fontSize: '13px',
              padding: '6px 18px',
              borderRadius: '999px',
              boxShadow: '0 2px 10px rgba(255,184,0,0.4)',
              letterSpacing: '0.01em',
            }}>
              <span style={{ fontSize: '15px' }}>👑</span>
              Premium klant
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Car className="w-5 h-5" />,    value: user.ridesCount,            label: 'Mijn ritten',   iconBg: '#EBF2FC', iconColor: NAVY2,     valColor: NAVY },
          { icon: <Star className="w-5 h-5" />,   value: user.rating,                label: 'Beoordeling',   iconBg: '#FFF8E7', iconColor: '#E6A500', valColor: NAVY },
          { icon: <Wallet className="w-5 h-5" />, value: `€ ${user.balance.toFixed(2)}`, label: 'Saldo tegoed', iconBg: '#ECFDF5', iconColor: '#16A34A', valColor: '#16A34A' },
        ].map(({ icon, value, label, iconBg, iconColor, valColor }) => (
          <div
            key={label}
            className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center gap-1"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: iconBg, color: iconColor }}>
              {icon}
            </div>
            <span className="text-lg sm:text-xl font-black" style={{ color: valColor }}>{value}</span>
            <span className="text-[11px] text-gray-500 font-medium leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Menu Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MENU_CARDS.map(({ id, icon, title, sub, span }) => (
          <div
            key={id}
            onClick={() => {
              if (id === 'klantenservice' && onContact) {
                onContact();
              } else {
                onNavigate(id);
              }
            }}
            className={`p-4 bg-white rounded-2xl border border-slate-200 hover:border-[#FFB800]/60 hover:shadow-md flex items-center justify-between cursor-pointer group transition ${
              span ? 'sm:col-span-2' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:bg-[#FFB800]/15 shrink-0"
                style={{ background: '#EBF2FC', color: NAVY2 }}
              >
                {icon}
              </div>
              <div>
                <h5 className="font-bold text-sm text-[#07152B]">{title}</h5>
                <p className="text-[11px] text-gray-500">{sub}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#FFB800] transition-colors shrink-0" />
          </div>
        ))}
      </div>

      {/* ── Recent Rides ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: NAVY2 }} />
            <h5 className="font-bold text-sm text-[#07152B]">Recente ritten</h5>
          </div>
          <button className="text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer transition" style={{ color: NAVY2 }}>
            Bekijk alle ritten <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Rides list */}
        <div className="divide-y divide-gray-50">
          {ridesLoading ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              <div className="w-6 h-6 border-2 border-[#001331]/20 border-t-[#001331] rounded-full animate-spin mx-auto mb-2" />
              Ritten laden...
            </div>
          ) : recentRides.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              <Car className="w-10 h-10 mx-auto mb-3 text-gray-200" />
              <p className="font-semibold text-gray-500">Geen ritten gevonden</p>
              <p className="text-xs mt-1">Je hebt nog geen ritten geboekt via je account.</p>
            </div>
          ) : (
            recentRides.map((ride, i) => (
              <div key={i} className="px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#07152B] flex-wrap">
                    <MapPin className="w-3.5 h-3.5 text-[#001331] shrink-0" />
                    <span>{ride.from}</span>
                    <span className="text-gray-400 text-xs">──</span>
                    <MapPin className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
                    <span>{ride.to}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500">
                    <span>📅 {ride.date}</span>
                    <span>🕒 {ride.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 font-bold rounded-full text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {ride.status}
                  </span>
                  <span className="font-extrabold text-[#07152B]">{ride.price}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════
export const ClientDashboard: React.FC<ClientDashboardProps> = ({ onExit, onOpenAccount, onNavigateToContact }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const s = localStorage.getItem('taximooo_user');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const [activeSection, setActiveSection] = useState<DashSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentRides, setRecentRides] = useState<{ from: string; to: string; date: string; time: string; status: string; price: string }[]>([]);
  const [ridesLoading, setRidesLoading] = useState(false);

  // Load rides from Supabase based on customer email
  const loadRides = useCallback(async (email: string) => {
    if (!supabaseDataService.isLive()) return;
    setRidesLoading(true);
    try {
      const orders = await supabaseDataService.getOrdersByEmail(email);
      const mapped = (orders || []).map((o: any) => {
        const bo = mapSupabaseOrderToBookingOrder(o);
        const d = new Date(bo.pickupDate);
        const dateStr = `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
        const statusMap: Record<string, string> = {
          nieuw: 'Nieuw', bevestigd: 'Bevestigd', toegewezen: 'Toegewezen',
          onderweg: 'Onderweg', voltooid: 'Voltooid', geannuleerd: 'Geannuleerd',
        };
        return {
          from: bo.pickup,
          to: bo.destination,
          date: dateStr,
          time: bo.pickupTime,
          status: statusMap[bo.status] || bo.status,
          price: `€ ${bo.totalFare.toFixed(2)}`,
        };
      });
      setRecentRides(mapped);
    } catch (err) {
      console.error('Error loading rides:', err);
    } finally {
      setRidesLoading(false);
    }
  }, []);

  // Sync user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('taximooo_user', JSON.stringify(user));
    else localStorage.removeItem('taximooo_user');
  }, [user]);

  // Load rides when user is set
  useEffect(() => {
    if (user?.email) loadRides(user.email);
  }, [user?.email, loadRides]);

  // If not logged in, open account modal and exit dashboard
  useEffect(() => {
    if (!user) {
      onOpenAccount();
      onExit();
    }
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('taximooo_user');
    onExit();
  };

  const handleUpdateUser = (updates: Partial<AuthUser>) => {
    setUser((prev) => prev ? { ...prev, ...updates } : prev);
  };

  const handleNavClick = (id: DashSection) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  // ── Render active section ──
  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <MainDashboard user={user} onNavigate={handleNavClick} onContact={onNavigateToContact} recentRides={recentRides} ridesLoading={ridesLoading} />;
      case 'accountgegevens':
        return <AccountGegevensSection user={user} onSave={handleUpdateUser} />;
      case 'beveiliging':
        return <SectionPlaceholder title="Inloggen & beveiliging" description="Beheer je wachtwoord, twee-staps verificatie en inloggeschiedenis." icon={<Shield />} />;
      case 'betaalmethoden':
        return <SectionPlaceholder title="Betaalmethoden" description="Voeg iDEAL, creditcard of andere betaalmethoden toe en beheer ze." icon={<CreditCard />} />;
      case 'favorieten':
        return <SectionPlaceholder title="Favoriete locaties" description="Sla je thuis, werkadres en vliegveld op voor sneller boeken." icon={<Star />} />;
      case 'klantenservice':
        return <KlantenserviceSection onContact={onNavigateToContact} />;
      default:
        return <MainDashboard user={user} onNavigate={handleNavClick} onContact={onNavigateToContact} recentRides={recentRides} ridesLoading={ridesLoading} />;
    }
  };

  const activeLabel = NAV_ITEMS.find((n) => n.id === activeSection)?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB]">

      {/* ══ TOP HEADER BAR ══ */}
      <header
        className="sticky top-0 z-40 w-full border-b border-white/10 shadow-lg shadow-black/25"
        style={{ background: `${NAVY}F5`, backdropFilter: 'blur(14px)' }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between gap-4">
          {/* Logo + back */}
          <div
            className="cursor-pointer shrink-0"
            onClick={onExit}
          >
            <Logo size="lg" />
          </div>

          {/* Title (desktop) */}
          <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-white/70">
            <span
              className="cursor-pointer hover:text-[#FFB800] transition"
              onClick={onExit}
            >
              Home
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span className="text-white font-bold">Mijn account</span>
            {activeSection !== 'dashboard' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                <span className="text-[#FFB800] font-bold">{activeLabel}</span>
              </>
            )}
          </div>

          {/* Right: Bell + User chip */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification bell */}
            <button className="relative w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/15 cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-[#001331]" />
            </button>

            {/* User chip */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 cursor-pointer hover:bg-white/20 transition">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs"
                style={{ background: 'rgba(255,184,0,0.2)', color: YELLOW }}
              >
                {getInitials(user.name)}
              </div>
              <span className="hidden sm:block text-sm font-bold text-white">{user.name.split(' ')[0]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/60" />
            </div>

            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition"
              aria-label="Menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ══ BODY: SIDEBAR + CONTENT ══ */}
      <div className="flex flex-1 max-w-[1440px] mx-auto w-full">

        {/* ── SIDEBAR ── */}
        {/* Desktop sidebar */}
        <aside
          className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 sticky top-[72px] self-start h-[calc(100vh-72px)] overflow-y-auto"
        >
          <div
            className="flex-1 flex flex-col py-6 px-4 relative"
            style={{ background: `linear-gradient(180deg, ${NAVY} 0%, #001a40 60%, #00142e 100%)` }}
          >
            {/* Nav links */}
            <nav className="flex-1 space-y-1">
              {NAV_ITEMS.map(({ id, label, icon }) => {
                const isActive = activeSection === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleNavClick(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer text-left ${
                      isActive
                        ? 'text-[#001331] shadow-md'
                        : 'text-white/80 hover:text-white hover:bg-white/8'
                    }`}
                    style={isActive ? { background: YELLOW } : {}}
                  >
                    <span className={isActive ? 'text-[#001331]' : 'text-white/60'}>{icon}</span>
                    {label}
                  </button>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="pt-4 border-t border-white/10 mt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/8 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-white/50" />
                Uitloggen
              </button>
            </div>

            {/* Brand tagline badge */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="px-3.5 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#FFB800] tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />
                  Taxi mooo
                </div>
                <p className="text-[11px] text-white/60 mt-1 font-medium leading-relaxed">
                  Altijd veilig, snel en comfortabel
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-30 flex" onClick={() => setSidebarOpen(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <aside
              className="relative w-72 max-w-[85vw] flex flex-col py-6 px-4 overflow-y-auto"
              style={{ background: `linear-gradient(180deg, ${NAVY} 0%, #001a40 100%)` }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* User info */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg border-2 border-white/20"
                  style={{ background: 'rgba(255,184,0,0.2)', color: YELLOW }}
                >
                  {getInitials(user.name)}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{user.name}</p>
                  <p className="text-xs text-white/60">{user.email}</p>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 space-y-1">
                {NAV_ITEMS.map(({ id, label, icon }) => {
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleNavClick(id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer text-left ${
                        isActive ? 'text-[#001331] shadow-md' : 'text-white/80 hover:text-white hover:bg-white/8'
                      }`}
                      style={isActive ? { background: YELLOW } : {}}
                    >
                      <span className={isActive ? 'text-[#001331]' : 'text-white/60'}>{icon}</span>
                      {label}
                    </button>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="pt-4 border-t border-white/10 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/8 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-white/50" />
                  Uitloggen
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Mobile breadcrumb */}
          <div className="lg:hidden mb-4 flex items-center gap-2 text-xs text-gray-500">
            <button onClick={onExit} className="hover:text-[#001331] font-semibold transition">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span
              className="cursor-pointer hover:text-[#001331] font-semibold"
              onClick={() => setActiveSection('dashboard')}
            >
              Mijn account
            </span>
            {activeSection !== 'dashboard' && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#001331] font-bold">{activeLabel}</span>
              </>
            )}
          </div>

          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
