import React, { useState, useEffect } from 'react';
import {
  X, User, Mail, Lock, Phone, ArrowRight, Shield, CreditCard, Star,
  Car, Wallet, Clock, CheckCircle2, Share2, LogOut, Eye, EyeOff,
  AlertCircle, Check, ChevronRight, UserPlus, LogIn,
} from 'lucide-react';

// ─── Brand tokens (Main website palette) ──────────────────
const NAVY   = '#001331';
const NAVY2  = '#00255c';
const YELLOW = '#FFB800';
const YELLOW_DIM = 'rgba(255,184,0,0.12)';
const BRAND_BUTTON_GRADIENT = 'linear-gradient(135deg, #001331 0%, #001d4a 50%, #00255c 100%)';
// ─────────────────────────────────────────────────────────

interface AuthUser {
  name: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
  balance: number;
  ridesCount: number;
  rating: number;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const s = localStorage.getItem('taximooo_user');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem('taximooo_user', JSON.stringify(user));
    else localStorage.removeItem('taximooo_user');
  }, [user]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const switchMode = (m: 'login' | 'register') => {
    setAuthMode(m);
    setError('');
    setSuccessMessage('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Vul a.u.b. alle velden in.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser = {
        name: loginEmail.split('@')[0].replace('.', ' '),
        email: loginEmail,
        phone: '+31 6 41212427',
        isLoggedIn: true,
        balance: 45.2,
        ridesCount: 12,
        rating: 4.8,
      };
      setUser(newUser);
      localStorage.setItem('taximooo_user', JSON.stringify(newUser));
      setSuccessMessage('Succesvol ingelogd!');
      setTimeout(() => { onClose(); onLoginSuccess?.(); }, 700);
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setError('Vul a.u.b. alle verplichte velden in.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Het wachtwoord moet minimaal 6 tekens bevatten.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Wachtwoorden komen niet overeen.');
      return;
    }
    if (!agreeTerms) {
      setError('Je dient akkoord te gaan met de algemene voorwaarden.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser = {
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        isLoggedIn: true,
        balance: 10.0,
        ridesCount: 0,
        rating: 5.0,
      };
      setUser(newUser);
      localStorage.setItem('taximooo_user', JSON.stringify(newUser));
      setSuccessMessage('Account succesvol aangemaakt! Welkom bij Taxi mooo.');
      setTimeout(() => { onClose(); onLoginSuccess?.(); }, 900);
    }, 800);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setIsLoading(false);
      const newUser = {
        name: 'Moutaz Wael',
        email: 'moutaz.wael@gmail.com',
        phone: '+31 6 41212427',
        isLoggedIn: true,
        balance: 45.2,
        ridesCount: 12,
        rating: 4.9,
      };
      setUser(newUser);
      localStorage.setItem('taximooo_user', JSON.stringify(newUser));
      setSuccessMessage('Succesvol ingelogd via Google!');
      setTimeout(() => { onClose(); onLoginSuccess?.(); }, 700);
    }, 700);
  };

  const handleLogout = () => {
    setUser(null);
    setAuthMode('login');
    setSuccessMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md overflow-y-auto">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-[620px] bg-[#F4F7FB] rounded-[32px] sm:rounded-[38px] shadow-[0_25px_70px_rgba(0,19,49,0.35)] overflow-hidden my-auto max-h-[94vh] flex flex-col border border-white/80 z-10">

        {/* ═══════════════ LOGGED-IN DASHBOARD ═══════════════ */}
        {user ? (
          <>
            {/* Header banner */}
            <div
              className="relative text-white p-6 sm:p-8 overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)` }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm border border-white/20"
                aria-label="Sluiten"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Decorative glow */}
              <div
                className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${YELLOW}, transparent 70%)`,
                  transform: 'translate(30%, -30%)',
                }}
              />

              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white/30"
                      style={{ background: YELLOW_DIM, color: YELLOW }}
                    >
                      {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'TM'}
                    </div>
                    <span
                      className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white text-xs font-bold shadow flex items-center justify-center"
                      style={{ color: NAVY2 }}
                    >
                      ✎
                    </span>
                  </div>
                  {/* Meta */}
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-xl font-black text-white">{user.name}</h3>
                    <p className="text-xs text-white/70">{user.email}</p>
                    <p className="text-xs text-white/60">{user.phone}</p>
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold mt-1"
                      style={{ background: YELLOW, color: NAVY }}
                    >
                      👑 Premium klant
                    </span>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer border border-white/15"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Uitloggen</span>
                </button>
              </div>
            </div>

            {/* Dashboard body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 bg-[#F4F7FB]">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Car className="w-4 h-4" />, value: user.ridesCount, label: 'Mijn ritten', iconBg: '#EBF2FC', iconColor: NAVY2 },
                  { icon: <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />, value: user.rating, label: 'Beoordeling', iconBg: '#FFF8E7', iconColor: YELLOW },
                  { icon: <Wallet className="w-4 h-4" />, value: `€ ${user.balance.toFixed(2)}`, label: 'Saldo', iconBg: '#ECFDF5', iconColor: '#16A34A' },
                ].map(({ icon, value, label, iconBg, iconColor }) => (
                  <div key={label} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1.5" style={{ background: iconBg, color: iconColor }}>
                      {icon}
                    </div>
                    <span className="text-lg font-black" style={{ color: label === 'Saldo' ? '#16A34A' : NAVY }}>
                      {value}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium mt-0.5">{label}</span>
                  </div>
                ))}
              </div>

              {/* Menu grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <User className="w-4 h-4" />, title: 'Accountgegevens', sub: 'Bekijk en wijzig je gegevens' },
                  { icon: <Shield className="w-4 h-4" />, title: 'Inloggen & beveiliging', sub: 'Beveilig je account' },
                  { icon: <CreditCard className="w-4 h-4" />, title: 'Betaalmethoden', sub: 'Beheer je iDEAL & kaarten' },
                  { icon: <Star className="w-4 h-4" />, title: 'Favoriete locaties', sub: 'Thuis, werk & vliegveld' },
                ].map(({ icon, title, sub }) => (
                  <div
                    key={title}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-[#FFB800]/50 hover:shadow-md flex items-center justify-between transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors group-hover:bg-[#FFB800]/10"
                        style={{ background: '#EBF2FC', color: NAVY2 }}
                      >
                        {icon}
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-[#07152B]">{title}</h5>
                        <p className="text-[10px] text-gray-500">{sub}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm group-hover:text-[#FFB800] transition-colors">›</span>
                  </div>
                ))}
              </div>

              {/* Referral banner */}
              <div
                className="relative overflow-hidden rounded-2xl p-4 flex items-center justify-between gap-4"
                style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)` }}
              >
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 80% 50%, ${YELLOW}, transparent 60%)` }}
                />
                <div className="relative flex items-center gap-3">
                  <span className="text-3xl">🎁</span>
                  <div>
                    <h4 className="font-black text-sm text-white leading-tight">
                      Verdien <span style={{ color: YELLOW }}>€ 30</span> tegoed
                    </h4>
                    <p className="text-xs text-white/70 font-medium">Nodig 6 vrienden uit en ontvang € 30!</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Jouw Taxi mooo deellink is gekopieerd!')}
                  className="relative shrink-0 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  style={{ background: YELLOW, color: NAVY }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Uitnodigen</span>
                </button>
              </div>

              {/* Recent ride */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: NAVY2 }} />
                    <h5 className="font-bold text-sm text-[#07152B]">Recente ritten</h5>
                  </div>
                  <span className="text-xs font-bold cursor-pointer hover:underline" style={{ color: NAVY2 }}>
                    Bekijk alle ritten →
                  </span>
                </div>
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-[#07152B]">
                      <span>Amsterdam Centraal</span>
                      <span className="text-gray-400">⟶</span>
                      <span>Schiphol Airport</span>
                    </div>
                    <div className="text-gray-500">📅 08-11-2026 • 🕒 14:30</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 font-bold rounded-full text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Voltooid
                    </span>
                    <span className="font-extrabold text-[#07152B] text-base">€ 38.50</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ═══════════════ AUTH VIEW — BRANDED EXECUTIVE NAVY & GOLD ═══════════════ */
          <div className="relative overflow-y-auto max-h-[94vh]">

            {/* Background Decorative Atmosphere & Car Banner */}
            <div className="absolute top-0 right-0 w-full h-80 overflow-hidden pointer-events-none select-none z-0">
              {/* Mercedes Taxi & Windmill Atmosphere Image */}
              <div className="absolute top-1 sm:top-2 right-0 w-[58%] sm:w-[52%] h-[210px] sm:h-[240px] overflow-hidden">
                <img
                  src="/login-car-windmill.png"
                  alt="Taxi mooo Mercedes taxi"
                  className="w-full h-full object-contain object-right-bottom drop-shadow-md"
                />
                {/* Soft Fade Left & Bottom */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#F4F7FB] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F4F7FB] via-transparent to-transparent" />
              </div>
            </div>

            {/* Inner Content Container */}
            <div className="relative z-10 px-5 sm:px-8 pt-6 pb-8 space-y-5 sm:space-y-6">

              {/* ── Top Bar: TAXI MOOO | MIJN ACCOUNT & Close button ── */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-[#001331]">
                    TAXI <span className="text-[#FFB800]">MOOO</span>
                  </span>
                  <span className="text-gray-300 font-light text-lg">|</span>
                  <span className="text-[11px] sm:text-xs font-bold text-gray-600 tracking-[0.16em] uppercase">
                    Mijn Account
                  </span>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/85 hover:bg-white text-gray-700 hover:text-black flex items-center justify-center transition shadow-sm border border-gray-200/80 cursor-pointer"
                  aria-label="Sluiten"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── Welcome Heading ── */}
              <div className="pt-2 sm:pt-4 max-w-[340px] sm:max-w-[380px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#001331] text-[#FFB800] border border-[#FFB800]/25 flex items-center justify-center shadow-md shadow-[#001331]/20 shrink-0">
                    <User className="w-6 h-6 text-[#FFB800]" />
                  </div>
                  <h2 className="text-3xl sm:text-[38px] font-black text-[#07152B] tracking-tight leading-none">
                    {authMode === 'login' ? (
                      <>
                        Welkom <span className="text-[#00255c]">terug</span>
                      </>
                    ) : (
                      <>
                        Account <span className="text-[#00255c]">aanmaken</span>
                      </>
                    )}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed pl-0.5">
                  {authMode === 'login'
                    ? 'Log in om je ritten, facturen en saldo te beheren'
                    : 'Registreer eenvoudig en ontvang direct €10 welkomsttegoed'}
                </p>
              </div>

              {/* ── Pill Tab Switcher: Inloggen / Registreren ── */}
              <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-slate-200/80 shadow-sm flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-[#001331] text-[#FFB800] shadow-md shadow-[#001331]/20'
                      : 'bg-transparent text-slate-600 hover:text-[#001331] hover:bg-white/60'
                  }`}
                >
                  <LogIn className={`w-4 h-4 ${authMode === 'login' ? 'text-[#FFB800]' : 'text-slate-500'}`} />
                  <span>Inloggen</span>
                </button>

                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-[#001331] text-[#FFB800] shadow-md shadow-[#001331]/20'
                      : 'bg-transparent text-slate-600 hover:text-[#001331] hover:bg-white/60'
                  }`}
                >
                  <UserPlus className={`w-4 h-4 ${authMode === 'register' ? 'text-[#FFB800]' : 'text-slate-500'}`} />
                  <span>Registreren</span>
                </button>
              </div>

              {/* ── Main White Form Card ── */}
              <div className="bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,19,49,0.08),0_4px_16px_rgba(0,0,0,0.03)] border border-slate-200/80 space-y-5">

                {/* Error feedback */}
                {error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Success feedback */}
                {successMessage && (
                  <div className="p-3.5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm text-green-700">
                    <Check className="w-4 h-4 shrink-0 stroke-[3]" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Inloggen met Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-3.5 sm:py-4 px-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all flex items-center justify-between text-sm sm:text-base font-extrabold text-[#07152B] shadow-sm hover:shadow cursor-pointer disabled:opacity-50 group"
                >
                  <div className="flex items-center gap-3 mx-auto sm:mx-0">
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{authMode === 'login' ? 'Inloggen met Google' : 'Aanmelden met Google'}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition hidden sm:block" />
                </button>

                {/* Divider: OF VIA E-MAIL */}
                <div className="relative flex items-center justify-center py-1">
                  <div className="w-full border-t border-slate-200" />
                  <span className="absolute bg-[#EBF2FC] text-[#00255c] border border-[#D4E2F4] px-4 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
                    OF VIA E-MAIL
                  </span>
                </div>

                {/* ── LOGIN FORM ── */}
                {authMode === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
                    {/* E-mailadres */}
                    <div>
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                        <Mail className="w-4 h-4 text-[#00255c]" />
                        <span>E-mailadres</span>
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3.5 bg-[#F6F7FB] border border-[#E2E8F0] rounded-2xl focus-within:border-[#00255c] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#00255c]/10 transition shadow-inner">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="bijv. moutaz@example.com"
                          className="w-full bg-transparent text-sm text-[#07152B] placeholder-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Wachtwoord */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
                          <Lock className="w-4 h-4 text-[#00255c]" />
                          <span>Wachtwoord</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => alert('Er is een wachtwoord-herstelink verstuurd naar je e-mail!')}
                          className="text-xs sm:text-sm font-bold text-[#00255c] hover:text-[#FFB800] hover:underline cursor-pointer transition-colors"
                        >
                          Wachtwoord vergeten?
                        </button>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-3.5 bg-[#F6F7FB] border border-[#E2E8F0] rounded-2xl focus-within:border-[#00255c] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#00255c]/10 transition shadow-inner">
                        <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-transparent text-sm text-[#07152B] placeholder-slate-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                          aria-label={showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 px-6 rounded-2xl text-white font-black text-sm sm:text-base shadow-lg shadow-[#001331]/25 hover:shadow-xl hover:shadow-[#001331]/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99] mt-2 group"
                      style={{ background: BRAND_BUTTON_GRADIENT }}
                    >
                      {isLoading ? (
                        'Bezig met inloggen...'
                      ) : (
                        <>
                          <span>Inloggen op mijn account</span>
                          <ArrowRight className="w-5 h-5 text-[#FFB800] group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>

                    {/* Footer link to register */}
                    <div className="pt-2 text-center text-xs sm:text-sm text-gray-500">
                      Nog geen account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('register')}
                        className="font-extrabold text-[#00255c] hover:text-[#FFB800] hover:underline cursor-pointer transition-colors"
                      >
                        Registreer hier gratis
                      </button>
                    </div>
                  </form>
                ) : (
                  /* ── REGISTER FORM ── */
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5 pt-1">
                    {/* Naam */}
                    <div>
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                        <User className="w-4 h-4 text-[#00255c]" />
                        <span>Volledige naam</span>
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-[#F6F7FB] border border-[#E2E8F0] rounded-2xl focus-within:border-[#00255c] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#00255c]/10 transition shadow-inner">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="bijv. Moutaz Wael"
                          className="w-full bg-transparent text-sm text-[#07152B] placeholder-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Email + Telefoon in 2 cols */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                          <Mail className="w-3.5 h-3.5 text-[#00255c]" />
                          <span>E-mailadres</span>
                        </label>
                        <div className="flex items-center gap-2.5 px-3.5 py-3 bg-[#F6F7FB] border border-[#E2E8F0] rounded-2xl focus-within:border-[#00255c] focus-within:bg-white transition shadow-inner">
                          <input
                            type="email"
                            required
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="naam@email.nl"
                            className="w-full bg-transparent text-xs sm:text-sm text-[#07152B] placeholder-slate-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                          <Phone className="w-3.5 h-3.5 text-[#00255c]" />
                          <span>Telefoonnummer</span>
                        </label>
                        <div className="flex items-center gap-2.5 px-3.5 py-3 bg-[#F6F7FB] border border-[#E2E8F0] rounded-2xl focus-within:border-[#00255c] focus-within:bg-white transition shadow-inner">
                          <input
                            type="tel"
                            required
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="+31 6 41212427"
                            className="w-full bg-transparent text-xs sm:text-sm text-[#07152B] placeholder-slate-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Wachtwoorden */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Wachtwoord</label>
                        <div className="flex items-center gap-2.5 px-3.5 py-3 bg-[#F6F7FB] border border-[#E2E8F0] rounded-2xl focus-within:border-[#00255c] focus-within:bg-white transition shadow-inner">
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Min. 6 tekens"
                            className="w-full bg-transparent text-xs sm:text-sm text-[#07152B] placeholder-slate-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Bevestig wachtwoord</label>
                        <div className="flex items-center gap-2.5 px-3.5 py-3 bg-[#F6F7FB] border border-[#E2E8F0] rounded-2xl focus-within:border-[#00255c] focus-within:bg-white transition shadow-inner">
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            placeholder="Herhaal wachtwoord"
                            className="w-full bg-transparent text-xs sm:text-sm text-[#07152B] placeholder-slate-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="text-[#00255c] hover:text-[#FFB800] font-bold hover:underline cursor-pointer transition-colors"
                      >
                        {showRegPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
                      </button>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer select-none pt-1">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 rounded mt-0.5 accent-[#001331]"
                      />
                      <span>
                        Ik ga akkoord met de{' '}
                        <span className="font-bold underline text-[#00255c] hover:text-[#FFB800] transition-colors">
                          Algemene Voorwaarden
                        </span>{' '}
                        en het{' '}
                        <span className="font-bold underline text-[#00255c] hover:text-[#FFB800] transition-colors">
                          Privacybeleid
                        </span>{' '}
                        van Taxi mooo.
                      </span>
                    </label>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 px-6 rounded-2xl text-white font-black text-sm sm:text-base shadow-lg shadow-[#001331]/25 hover:shadow-xl hover:shadow-[#001331]/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99] mt-2 group"
                      style={{ background: BRAND_BUTTON_GRADIENT }}
                    >
                      {isLoading ? (
                        'Account aanmaken...'
                      ) : (
                        <>
                          <span>Account aanmaken & Inloggen</span>
                          <ArrowRight className="w-5 h-5 text-[#FFB800] group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>

                    {/* Footer link to login */}
                    <div className="pt-2 text-center text-xs sm:text-sm text-gray-500">
                      Al een account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="font-extrabold text-[#00255c] hover:text-[#FFB800] hover:underline cursor-pointer transition-colors"
                      >
                        Log hier direct in
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};