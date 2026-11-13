import React, { useState, useEffect, useMemo } from 'react';
import {
  Car,
  Mail,
  MapPin,
  AlertCircle,
  X,
  Search,
  Download,
  RefreshCw,
  LogOut,
  DollarSign,
  TrendingUp,
  Settings,
  MessageSquare,
  ExternalLink,
  Lock,
  UserCheck,
  Share2,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import {
  adminBookingService,
  type BookingOrder,
  type OrderStatus,
  type Driver,
  type PricingSettings,
  type ContactInquiry,
} from '../services/adminBookingService';

interface AdminDashboardProps {
  onExit: () => void;
}

type AdminTab = 'overview' | 'orders' | 'drivers' | 'pricing' | 'inquiries';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  // ─── AUTHENTICATION STATE ───────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('taximooo_admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('admin@taximooo.nl');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // ─── DASHBOARD STATE ────────────────────────────────────
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [orders, setOrders] = useState<BookingOrder[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [settings, setSettings] = useState<PricingSettings>(adminBookingService.getSettings());
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  // ─── ORDERS FILTER & SEARCH ─────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<BookingOrder | null>(null);

  // ─── TOAST NOTIFICATION ─────────────────────────────────
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reload data
  const loadData = () => {
    setOrders(adminBookingService.getOrders());
    setDrivers(adminBookingService.getDrivers());
    setSettings(adminBookingService.getSettings());
    setInquiries(adminBookingService.getInquiries());
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // ─── AUTH HANDLERS ──────────────────────────────────────
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Default admin credentials
    if (
      (loginEmail.trim() === 'admin@taximooo.nl' || loginEmail.trim() === 'admin') &&
      loginPassword.trim() === 'admin'
    ) {
      localStorage.setItem('taximooo_admin_auth', 'true');
      setIsAuthenticated(true);
      showToast('Welkom in het Taxi mooo Beheersysteem!');
    } else {
      setAuthError('Onjuist e-mailadres of wachtwoord. Gebruik: admin / admin');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('taximooo_admin_auth');
    setIsAuthenticated(false);
  };

  const handleFillDemoCredentials = () => {
    setLoginEmail('admin@taximooo.nl');
    setLoginPassword('admin');
  };

  // ─── ORDER ACTIONS ──────────────────────────────────────
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    adminBookingService.updateOrderStatus(orderId, newStatus);
    loadData();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    showToast(`Status van rit ${orderId} bijgewerkt naar ${newStatus.toUpperCase()}`);
  };

  const handleAssignDriver = (orderId: string, driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;
    adminBookingService.assignDriver(orderId, driver);
    loadData();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        assignedDriver: driver,
        status: 'toegewezen',
      });
    }
    showToast(`Rit ${orderId} succesvol toegewezen aan ${driver.name}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Weet je zeker dat je rit ${orderId} wilt verwijderen?`)) {
      adminBookingService.deleteOrder(orderId);
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
      loadData();
      showToast(`Rit ${orderId} verwijderd.`);
    }
  };

  const handleExportCSV = () => {
    adminBookingService.exportOrdersToCSV(filteredOrders);
    showToast('Orders succesvol geëxporteerd naar CSV.');
  };

  // WhatsApp Driver Dispatch generator
  const getWhatsAppDispatchUrl = (order: BookingOrder) => {
    const phone = order.assignedDriver ? order.assignedDriver.phone.replace(/[^0-9]/g, '') : order.customerPhone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `🚕 *TAXI MOOO DISPATCH OPDRACHT*\n\n` +
      `*Rit:* ${order.id}\n` +
      `*Datum:* ${order.pickupDate} om ${order.pickupTime} uur\n` +
      `*Klant:* ${order.customerName} (${order.customerPhone})\n` +
      `*Vertrek:* ${order.pickup}\n` +
      `*Bestemming:* ${order.destination}\n` +
      (order.stops.length ? `*Tussenstop(s):* ${order.stops.join(' • ')}\n` : '') +
      `*Afstand:* ${order.estimatedKm} km (ca. ${order.estimatedDurationMins} min)\n` +
      `*Auto:* ${order.vehicleType === 'klein' ? 'Kleine auto (sedan)' : 'Grote taxibus'}\n` +
      `*Totaaltarief:* €${order.totalFare.toFixed(2)} (${order.paymentMethod.toUpperCase()})\n\n` +
      `Beantwoord met "AKKOORD" om te bevestigen.`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  // ─── FILTERED ORDERS ────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery) ||
        order.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.destination.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // ─── KPI CALCULATIONS ───────────────────────────────────
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'geannuleerd')
      .reduce((sum, o) => sum + o.totalFare, 0);
  }, [orders]);

  const totalKm = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'geannuleerd')
      .reduce((sum, o) => sum + o.estimatedKm, 0);
  }, [orders]);

  const newOrdersCount = orders.filter((o) => o.status === 'nieuw').length;

  // ════════════════════════════════════════════════════════
  // 1. ADMIN LOGIN VIEW (IF NOT AUTHENTICATED)
  // ════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#000E24] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-[#FFB800] selection:text-[#001331]">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00255c]/40 rounded-full blur-[140px] pointer-events-none" />

        {/* Back to site button */}
        <button
          onClick={onExit}
          className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-[#FFB800] text-sm font-semibold transition cursor-pointer"
        >
          <span>← Terug naar website</span>
        </button>

        <div className="relative w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 space-y-6 z-10">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="inline-block">
              <Logo size="lg" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#001331]">Centrale & Beheersysteem</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Log in met je dispatcher account om ritten en chauffeurs te beheren
              </p>
            </div>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">E-mailadres / Gebruikersnaam</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-[#F4F7FB] border border-[#E2E8F0] rounded-xl focus-within:border-[#00255c] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00255c]/10 transition">
                <Mail className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@taximooo.nl"
                  className="w-full bg-transparent text-sm text-[#07152B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Wachtwoord</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-[#F4F7FB] border border-[#E2E8F0] rounded-xl focus-within:border-[#00255c] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00255c]/10 transition">
                <Lock className="w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-[#07152B] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#001331] via-[#001d4a] to-[#00255c] hover:from-[#000e24] hover:to-[#001d4a] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#001331]/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Inloggen op dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#FFB800]" />
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="pt-2 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="inline-flex items-center gap-1.5 text-xs text-[#00255c] hover:text-[#FFB800] font-bold transition cursor-pointer"
            >
              <span>Gebruik demo-inloggegevens (admin / admin)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════
  // 2. MAIN ADMIN DASHBOARD INTERFACE
  // ════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col font-sans selection:bg-[#FFB800] selection:text-[#001331]">

      {/* ── Toast Alert ── */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#001331] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#FFB800]/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFB800] animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-[#000E24] text-white border-b border-white/10 shadow-lg px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Brand & portal title */}
        <div className="flex items-center gap-4">
          <div onClick={onExit} className="cursor-pointer shrink-0">
            <Logo size="md" />
          </div>
          <div className="hidden sm:block h-7 w-[1px] bg-white/15" />
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-black uppercase tracking-wider text-[#FFB800]">
              Dispatch & Management
            </span>
            <span className="text-[11px] text-blue-200/80">
              Centrale Haarlem • 24/7 Live
            </span>
          </div>
        </div>

        {/* Right: Actions & User */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer border border-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FFB800]" />
            <span className="hidden sm:inline">Klantensite bekijken</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold transition cursor-pointer border border-red-500/30"
            title="Uitloggen"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Uitloggen</span>
          </button>
        </div>
      </header>

      {/* ── Main Body with Sidebar & Content ── */}
      <div className="flex-1 flex flex-col lg:flex-row">

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-64 bg-[#001331] text-white border-r border-white/10 p-4 lg:p-6 shrink-0 flex lg:flex-col justify-between">
          <div className="w-full space-y-6">
            {/* Navigation Tabs */}
            <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0">
              {[
                { id: 'orders' as AdminTab, label: 'Ritorders', icon: <Car className="w-4 h-4" />, badge: newOrdersCount },
                { id: 'overview' as AdminTab, label: 'Overzicht & KPI', icon: <TrendingUp className="w-4 h-4" /> },
                { id: 'drivers' as AdminTab, label: 'Chauffeurs & Vloot', icon: <UserCheck className="w-4 h-4" /> },
                { id: 'inquiries' as AdminTab, label: 'Berichten', icon: <MessageSquare className="w-4 h-4" />, badge: inquiries.filter(i => !i.isRead).length },
                { id: 'pricing' as AdminTab, label: 'Tarieven & Beheer', icon: <Settings className="w-4 h-4" /> },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#FFB800] text-[#001331] shadow-md shadow-[#FFB800]/25 font-black'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </div>
                    {Boolean(tab.badge && tab.badge > 0) && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-[#001331] text-white' : 'bg-[#FFB800] text-[#001331]'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick stats mini card in sidebar */}
          <div className="hidden lg:block pt-6 border-t border-white/10 text-xs text-blue-200/70 space-y-2">
            <div className="flex justify-between">
              <span>Totaal orders:</span>
              <span className="font-bold text-white">{orders.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Totale omzet:</span>
              <span className="font-bold text-[#FFB800]">€ {totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Chauffeurs actief:</span>
              <span className="font-bold text-green-400">{drivers.filter(d => d.status !== 'offline').length} / {drivers.length}</span>
            </div>
          </div>
        </aside>

        {/* ── Main View Content Area ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">

          {/* ══════════════════════════════════════════
              VIEW 1: RITORDERS (DISPATCH & ORDERS TABLE)
          ══════════════════════════════════════════ */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Header Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#001331]">Ritorders & Dispatch</h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Beheer binnenkomende reserveringen, wijs chauffeurs toe en volg de ritstatus
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={loadData}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-gray-700 shadow-sm transition cursor-pointer"
                    title="Vernieuwen"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Vernieuwen</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#001331] hover:bg-[#00255c] text-white text-xs font-bold shadow-md transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>Exporteer CSV</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Row */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search box */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Zoek op klant, telefoon, ritnummer #MOOO of straat..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F6F8FB] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#00255c]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  {[
                    { id: 'all', label: 'Alle' },
                    { id: 'nieuw', label: 'Nieuw' },
                    { id: 'toegewezen', label: 'Toegewezen' },
                    { id: 'onderweg', label: 'Onderweg' },
                    { id: 'voltooid', label: 'Voltooid' },
                    { id: 'geannuleerd', label: 'Geannuleerd' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStatusFilter(s.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                        statusFilter === s.id
                          ? 'bg-[#001331] text-[#FFB800]'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#001331] text-white text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Rit / Datum</th>
                        <th className="py-3 px-4">Klant</th>
                        <th className="py-3 px-4">Van ⟶ Naar</th>
                        <th className="py-3 px-4">Type / Afstand</th>
                        <th className="py-3 px-4">Tarief</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Chauffeur</th>
                        <th className="py-3 px-4 text-right">Acties</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-gray-400">
                            Geen ritten gevonden die aan deze filters voldoen.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => {
                          const statusBg =
                            order.status === 'nieuw'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : order.status === 'toegewezen'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : order.status === 'onderweg'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : order.status === 'voltooid'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-red-100 text-red-800 border-red-200';

                          return (
                            <tr
                              key={order.id}
                              className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                              onClick={() => setSelectedOrder(order)}
                            >
                              {/* Order & Date */}
                              <td className="py-3.5 px-4">
                                <span className="font-extrabold text-[#001331] block">{order.id}</span>
                                <span className="text-[11px] text-gray-500">
                                  {order.pickupDate} • {order.pickupTime}
                                </span>
                              </td>

                              {/* Customer */}
                              <td className="py-3.5 px-4">
                                <span className="font-bold text-gray-900 block">{order.customerName}</span>
                                <span className="text-[11px] text-gray-500">{order.customerPhone}</span>
                              </td>

                              {/* Route */}
                              <td className="py-3.5 px-4 max-w-[260px]">
                                <div className="truncate font-semibold text-gray-900" title={order.pickup}>
                                  🟢 {order.pickup}
                                </div>
                                <div className="truncate text-gray-600" title={order.destination}>
                                  🔴 {order.destination}
                                </div>
                                {order.stops.length > 0 && (
                                  <span className="text-[10px] text-[#00255c] font-bold">
                                    +{order.stops.length} tussenstop(s)
                                  </span>
                                )}
                              </td>

                              {/* Vehicle / Distance */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span className="font-semibold text-gray-800 block">
                                  {order.vehicleType === 'klein' ? 'Kleine auto' : 'Grote bus'}
                                </span>
                                <span className="text-[11px] text-gray-500">
                                  {order.estimatedKm} km ({order.estimatedDurationMins} min)
                                </span>
                              </td>

                              {/* Fare */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span className="font-black text-[#001331] text-base block">
                                  € {order.totalFare.toFixed(2)}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-gray-500">
                                  {order.paymentMethod} • {order.paymentStatus}
                                </span>
                              </td>

                              {/* Status Badge */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold border ${statusBg}`}>
                                  {order.status.toUpperCase()}
                                </span>
                              </td>

                              {/* Assigned Driver */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                {order.assignedDriver ? (
                                  <div>
                                    <span className="font-bold text-gray-900 block">
                                      {order.assignedDriver.name}
                                    </span>
                                    <span className="text-[11px] text-gray-500">
                                      {order.assignedDriver.plate}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                                    Niet toegewezen
                                  </span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                                    title="Bekijk details & wijs chauffeur toe"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <a
                                    href={getWhatsAppDispatchUrl(order)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                                    title="Stuur opdracht via WhatsApp"
                                  >
                                    <Share2 className="w-4 h-4" />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              VIEW 2: OVERZICHT & KPI CARDS
          ══════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#001331]">Operationeel Overzicht</h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Prestaties, omzetcijfers en actuele statistieken van Taxi mooo
                </p>
              </div>

              {/* 4 Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Totale Omzet</span>
                    <h3 className="text-2xl font-black text-[#001331] mt-1">€ {totalRevenue.toFixed(2)}</h3>
                    <span className="text-[11px] text-green-600 font-bold">Actieve boekingen</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#EBF2FC] text-[#00255c] flex items-center justify-center font-bold">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Aantal Ritten</span>
                    <h3 className="text-2xl font-black text-[#001331] mt-1">{orders.length}</h3>
                    <span className="text-[11px] text-blue-600 font-bold">{newOrdersCount} nieuw in behandeling</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#FFB800] flex items-center justify-center font-bold">
                    <Car className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Chauffeurs</span>
                    <h3 className="text-2xl font-black text-[#001331] mt-1">{drivers.length}</h3>
                    <span className="text-[11px] text-green-600 font-bold">{drivers.filter(d => d.status === 'beschikbaar').length} nu beschikbaar</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
                    <UserCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Afgelegde Afstand</span>
                    <h3 className="text-2xl font-black text-[#001331] mt-1">{totalKm.toFixed(1)} km</h3>
                    <span className="text-[11px] text-gray-500">Heel Nederland</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <MapPin className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Popular Routes & Recent Dispatch Box */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-extrabold text-[#001331] text-base">Top Bestemmingen</h4>
                  <div className="space-y-3">
                    {[
                      { route: 'Amsterdam ⟶ Schiphol Airport', share: '42%', count: '28 ritten' },
                      { route: 'Haarlem ⟶ Schiphol Airport', share: '24%', count: '16 ritten' },
                      { route: 'Utrecht ⟶ Schiphol Airport', share: '18%', count: '12 ritten' },
                      { route: 'Amsterdam ⟶ Rotterdam The Hague', share: '16%', count: '9 ritten' },
                    ].map((r) => (
                      <div key={r.route} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs sm:text-sm">
                        <span className="font-bold text-gray-900">{r.route}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">{r.count}</span>
                          <span className="font-black text-[#00255c] bg-blue-100 px-2 py-0.5 rounded-full text-xs">{r.share}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-extrabold text-[#001331] text-base">Dispatch Centrale Info</h4>
                  <div className="space-y-3 text-xs sm:text-sm text-gray-700">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Hoofdvestiging:</span>
                      <span className="font-bold text-gray-900">Corelia de Langestraat 208, 2037 NR Haarlem</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Telefooncentrale:</span>
                      <span className="font-bold text-gray-900">+31 6 41212427 (24/7)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">TX-Keurmerk status:</span>
                      <span className="font-bold text-green-600">Actief & Erkend</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Gemiddelde wachttijd:</span>
                      <span className="font-bold text-gray-900">&lt; 15 minuten in Noord-Holland</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              VIEW 3: CHAUFFEURS & VLOOT
          ══════════════════════════════════════════ */}
          {activeTab === 'drivers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#001331]">Chauffeurs & Wagenpark</h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Overzicht van actieve beroepschauffeurs en geregistreerde Mercedes-Benz wagens
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drivers.map((drv) => {
                  const statusColor =
                    drv.status === 'beschikbaar'
                      ? 'bg-green-100 text-green-800'
                      : drv.status === 'bezig'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-600';

                  return (
                    <div key={drv.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-[#001331] text-[#FFB800] flex items-center justify-center font-black text-sm">
                            {drv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <h4 className="font-black text-sm text-[#001331]">{drv.name}</h4>
                            <span className="text-[11px] text-gray-500">{drv.phone}</span>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusColor}`}>
                          {drv.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Voertuig:</span>
                          <span className="font-bold text-gray-900">{drv.vehicle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kenteken:</span>
                          <span className="font-mono font-bold text-gray-900 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                            {drv.plate}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Beoordeling:</span>
                          <span className="font-bold text-amber-600">★ {drv.rating}</span>
                        </div>
                      </div>

                      {/* Direct WhatsApp Call Chauffeur */}
                      <a
                        href={`https://wa.me/${drv.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 font-bold text-xs flex items-center justify-center gap-2 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat via WhatsApp</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              VIEW 4: TARIEVEN & INSTELLINGEN
          ══════════════════════════════════════════ */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-2xl font-black text-[#001331]">Tarieven & Website Instellingen</h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Pas kilometertarieven, toeslagen en bedrijfsgegevens direct aan
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="font-black text-lg text-[#001331]">Vaste Kilometertarieven (€ / km)</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Kleine auto (Sedan, tot 3-4 personen)
                    </label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                      <span className="font-bold text-gray-500">€</span>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.kleinKmRate}
                        onChange={(e) => setSettings({ ...settings, kleinKmRate: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-transparent font-bold text-sm text-[#001331] focus:outline-none"
                      />
                      <span className="text-xs text-gray-400">/ km</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Grote auto (Taxibus, tot 8 personen)
                    </label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                      <span className="font-bold text-gray-500">€</span>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.grootKmRate}
                        onChange={(e) => setSettings({ ...settings, grootKmRate: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-transparent font-bold text-sm text-[#001331] focus:outline-none"
                      />
                      <span className="text-xs text-gray-400">/ km</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Minimum ritprijs
                    </label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                      <span className="font-bold text-gray-500">€</span>
                      <input
                        type="number"
                        step="1.00"
                        value={settings.minimumFare}
                        onChange={(e) => setSettings({ ...settings, minimumFare: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-transparent font-bold text-sm text-[#001331] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Toeslag per tussenstop
                    </label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                      <span className="font-bold text-gray-500">€</span>
                      <input
                        type="number"
                        step="0.50"
                        value={settings.stopFee}
                        onChange={(e) => setSettings({ ...settings, stopFee: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-transparent font-bold text-sm text-[#001331] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Wijzigingen zijn direct van toepassing op toekomstige ritberekeningen.
                  </span>
                  <button
                    onClick={() => {
                      adminBookingService.saveSettings(settings);
                      showToast('Tarieven succesvol opgeslagen!');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#001331] hover:bg-[#00255c] text-white font-extrabold text-xs shadow-md transition cursor-pointer"
                  >
                    Tarieven opslaan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              VIEW 5: BERICHTEN (INQUIRIES)
          ══════════════════════════════════════════ */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#001331]">Klantberichten & Vragen</h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Binnengekomen contactberichten en offertes via het contactformulier
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-5 hover:bg-gray-50 transition space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-sm text-[#001331]">{inq.name}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs font-bold text-blue-900">{inq.phone}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{inq.email}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(inq.date).toLocaleDateString('nl-NL')}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-gray-900">{inq.subject}</h5>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">
                      {inq.message}
                    </p>
                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-bold text-xs flex items-center gap-1.5 hover:bg-green-100"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Beantwoord via WhatsApp</span>
                      </a>
                      <a
                        href={`mailto:${inq.email}`}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs flex items-center gap-1.5 hover:bg-gray-200"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Beantwoord via E-mail</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ════════════════════════════════════════════════════════
          ORDER DETAIL & DISPATCH MODAL
      ════════════════════════════════════════════════════════ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-200">

            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#000E24] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#FFB800] animate-pulse" />
                <div>
                  <h3 className="font-black text-lg">Ritdetails: {selectedOrder.id}</h3>
                  <p className="text-xs text-blue-200">
                    Aangemaakt op {new Date(selectedOrder.createdAt).toLocaleString('nl-NL')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">

              {/* Status Selector Row */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Huidige Status
                  </span>
                  <span className="font-black text-base text-[#001331] uppercase">
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['nieuw', 'bevestigd', 'toegewezen', 'onderweg', 'voltooid', 'geannuleerd'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer capitalize ${
                        selectedOrder.status === st
                          ? 'bg-[#001331] text-[#FFB800] shadow'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Driver Assignment Box */}
              <div className="p-4 bg-[#EBF2FC] rounded-2xl border border-blue-200 space-y-3">
                <span className="text-xs font-bold text-[#00255c] uppercase tracking-wider block">
                  Chauffeur Toewijzen
                </span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <select
                    value={selectedOrder.assignedDriver?.id || ''}
                    onChange={(e) => handleAssignDriver(selectedOrder.id, e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-white border border-blue-300 rounded-xl text-xs sm:text-sm font-bold text-[#001331] focus:outline-none"
                  >
                    <option value="">-- Selecteer een chauffeur --</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} • {d.vehicle} ({d.plate}) - {d.status.toUpperCase()}
                      </option>
                    ))}
                  </select>

                  <a
                    href={getWhatsAppDispatchUrl(selectedOrder)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Verstuur via WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Trip Route Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Traject & Planning
                  </span>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-gray-400 text-[11px] block">Ophaaladres:</span>
                      <span className="font-bold text-gray-900">{selectedOrder.pickup}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Bestemming:</span>
                      <span className="font-bold text-gray-900">{selectedOrder.destination}</span>
                    </div>
                    {selectedOrder.stops.length > 0 && (
                      <div>
                        <span className="text-gray-400 text-[11px] block">Tussenstops:</span>
                        <span className="font-bold text-[#00255c]">{selectedOrder.stops.join(' ⟶ ')}</span>
                      </div>
                    )}
                    <div className="pt-2 flex justify-between text-xs border-t border-gray-200">
                      <span>Datum & Tijd:</span>
                      <span className="font-bold text-gray-900">
                        {selectedOrder.pickupDate} om {selectedOrder.pickupTime} uur
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Klant & Betaling
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Klantnaam:</span>
                      <span className="font-bold text-gray-900">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Telefoon:</span>
                      <a href={`tel:${selectedOrder.customerPhone}`} className="font-bold text-blue-700 hover:underline">
                        {selectedOrder.customerPhone}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">E-mail:</span>
                      <span className="font-bold text-gray-900 truncate max-w-[180px]">{selectedOrder.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Betaalmethode:</span>
                      <span className="font-bold text-gray-900 uppercase">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="font-bold text-gray-700">Totaalprijs:</span>
                      <span className="font-black text-[#001331] text-base">€ {selectedOrder.totalFare.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Notes if any */}
              {selectedOrder.customerNotes && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <strong>Opmerking klant:</strong> {selectedOrder.customerNotes}
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Rit verwijderen
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-[#001331] hover:bg-[#00255c] text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Sluiten
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
