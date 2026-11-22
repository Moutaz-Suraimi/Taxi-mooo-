import React, { useState, useEffect, useCallback } from 'react';
import {
  User, Mail, Shield, CreditCard, Star, Car, Wallet, Clock,
  CheckCircle2, LogOut, ChevronRight, MapPin,
  Headphones, Bell, ChevronDown, ArrowRight,
  Home, Menu, X, Phone, Lock, Key, Smartphone, Laptop,
  Eye, EyeOff, AlertTriangle, MessageSquare, Send, Globe,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { DutchAddressAutocomplete } from '../components/DutchAddressAutocomplete';
import { calculateRealisticDutchDistance } from '../utils/dutchDistanceService';
import { supabaseDataService, mapSupabaseOrderToBookingOrder } from '../services/supabaseDataService';
import { adminBookingService } from '../services/adminBookingService';
import { useLanguage } from '../context/LanguageContext';
import {
  getValidClientUser,
  setClientSession,
  clearClientSession,
  initClientActivityTracker,
} from '../services/sessionSecurity';

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

export interface ClientNotification {
  id: string;
  type: 'inquiry_reply' | 'pricing_update' | 'order_update' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  linkSection?: DashSection;
  badge?: string;
}

type DashSection =
  | 'dashboard'
  | 'ritten'
  | 'accountgegevens'
  | 'beveiliging'
  | 'betaalmethoden'
  | 'klantenservice'
  | 'reservering';

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

// ══════════════════════════════════════════════════════════
//  SECTION VIEWS
// ══════════════════════════════════════════════════════════

function SectionPlaceholder({ title, description, icon }: { title: string; description: string; icon: React.ReactElement<{ className?: string }> }) {
  const { language } = useLanguage();
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
        {language === 'en' ? 'Coming Soon' : 'Binnenkort beschikbaar'}
      </div>
    </div>
  );
}

// ─── ACCOUNT INFO SECTION ───────────────────────────────
function AccountGegevensSection({ user, onSave }: { user: AuthUser; onSave: (u: Partial<AuthUser>) => void }) {
  const { t, language } = useLanguage();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, phone });
    supabaseDataService.updateClientProfile(user.email, { name, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-black text-[#001331] mb-1">{t('client.accountDetails')}</h2>
        <p className="text-sm text-gray-500">{language === 'en' ? 'View and update your personal information.' : 'Bekijk en wijzig je persoonlijke gegevens.'}</p>
      </div>

      {saved && (
        <div className="p-3.5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2 text-sm text-green-700 font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {t('client.saved')}
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
            👑 {t('client.premiumCustomer')}
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">{language === 'en' ? 'Full Name' : 'Volledige naam'}</label>
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
          <label className="block text-xs font-bold text-gray-700 mb-1.5">{language === 'en' ? 'Email Address' : 'E-mailadres'}</label>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl opacity-70">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full bg-transparent text-sm text-gray-500 focus:outline-none cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 ml-1">{language === 'en' ? 'Email address cannot be changed.' : 'E-mailadres kan niet worden gewijzigd.'}</p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">{language === 'en' ? 'Phone Number' : 'Telefoonnummer'}</label>
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
          {t('client.saveChanges')}
        </button>
      </form>
    </div>
  );
}

// ─── INLOGGEN & BEVEILIGING SECTION ─────────────────────
function BeveiligingSection({ user }: { user: AuthUser }) {
  const { t, language } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [twoFactorToast, setTwoFactorToast] = useState('');

  // Active Sessions
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: language === 'en' ? 'This device (Current browser)' : 'Dit apparaat (Huidige browser)',
      detail: 'Chrome browser • Windows 11',
      location: 'Haarlem, Nederland',
      time: language === 'en' ? 'Active now' : 'Nu actief',
      isCurrent: true,
      isMobile: false,
    },
    {
      id: 'sess-2',
      device: language === 'en' ? 'Mobile phone' : 'Mobiele telefoon',
      detail: 'Safari Mobile • Apple iPhone',
      location: 'Amsterdam, Nederland',
      time: language === 'en' ? 'Yesterday at 18:42' : 'Gisteren om 18:42',
      isCurrent: false,
      isMobile: true,
    },
  ]);
  const [sessionsToast, setSessionsToast] = useState('');

  // Sync settings and sessions from Supabase on mount
  useEffect(() => {
    if (!user?.email) return;

    // 1. Load security settings from Supabase
    supabaseDataService.getSecuritySettings(user.email).then((settings) => {
      if (settings) {
        setTwoFactorEnabled(Boolean(settings.two_factor_enabled));
      }
    });

    // 2. Load active sessions from Supabase
    supabaseDataService.getUserSessions(user.email).then((remoteSessions) => {
      if (remoteSessions && remoteSessions.length > 0) {
        setSessions(
          remoteSessions.map((s: any) => ({
            id: s.id,
            device: s.device_name,
            detail: `${s.browser} • ${s.location || 'Nederland'}`,
            location: s.location || 'Nederland',
            time: s.is_current ? (language === 'en' ? 'Active now' : 'Nu actief') : new Date(s.last_active).toLocaleDateString(language === 'en' ? 'en-GB' : 'nl-NL'),
            isCurrent: Boolean(s.is_current),
            isMobile: s.device_name.toLowerCase().includes('phone') || s.device_name.toLowerCase().includes('mobiel'),
          }))
        );
      } else {
        // Automatically register the current active session in Supabase
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const deviceName = isMobile ? (language === 'en' ? 'Mobile device' : 'Mobiel apparaat') : (language === 'en' ? 'This device (Current browser)' : 'Dit apparaat (Huidige browser)');
        const browser = navigator.userAgent.includes('Chrome')
          ? 'Chrome browser'
          : navigator.userAgent.includes('Safari')
          ? 'Safari'
          : 'Web Browser';
        supabaseDataService.registerSession(user.email, {
          device_name: deviceName,
          browser,
          location: 'Haarlem, Nederland',
          is_current: true,
        });
      }
    });
  }, [user?.email, language]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!currentPassword) {
      setPasswordError(language === 'en' ? 'Please enter your current password.' : 'Vul je huidige wachtwoord in.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(language === 'en' ? 'New password must be at least 6 characters.' : 'Het nieuwe wachtwoord moet minimaal 6 tekens bevatten.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(language === 'en' ? 'New passwords do not match.' : 'De nieuwe wachtwoorden komen niet overeen.');
      return;
    }

    setIsSubmittingPassword(true);
    try {
      if (user?.email) {
        await supabaseDataService.updatePassword(user.email, newPassword);
      }
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3500);
    } catch {
      setPasswordError(language === 'en' ? 'An error occurred while updating the password.' : 'Er is een fout opgetreden bij het bijwerken van het wachtwoord.');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleToggle2FA = async () => {
    const next = !twoFactorEnabled;
    setTwoFactorEnabled(next);
    if (user?.email) {
      await supabaseDataService.updateSecuritySettings(user.email, {
        two_factor_enabled: next,
      });
    }
    setTwoFactorToast(
      next
        ? (language === 'en' ? 'Two-Factor Authentication (2FA) is now enabled.' : 'Twee-staps verificatie (2FA) is succesvol ingeschakeld.')
        : (language === 'en' ? 'Two-Factor Authentication (2FA) is disabled.' : 'Twee-staps verificatie (2FA) is uitgeschakeld.')
    );
    setTimeout(() => setTwoFactorToast(''), 3000);
  };

  const handleTerminateOtherSessions = async () => {
    if (user?.email) {
      await supabaseDataService.terminateOtherSessions(user.email);
    }
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setSessionsToast(language === 'en' ? 'Logged out from all other devices successfully.' : 'Je bent succesvol uitgelogd op alle andere apparaten.');
    setTimeout(() => setSessionsToast(''), 3500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-[#001331] mb-1">{t('client.loginSecurity')}</h2>
        <p className="text-sm text-gray-500">
          {language === 'en' ? 'Manage your password, two-factor authentication and active sessions.' : 'Beheer je wachtwoord, twee-staps verificatie en actieve apparaten voor een veilig account.'}
        </p>
      </div>

      {/* Security Health Score Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#001331] to-[#00255c] text-white flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FFB800]/20 text-[#FFB800] flex items-center justify-center shrink-0 border border-[#FFB800]/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base">{t('client.securityScore')}</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {language === 'en' ? 'Excellent (95%)' : 'Uitstekend (95%)'}
              </span>
            </div>
            <p className="text-xs text-white/70 mt-0.5">
              {language === 'en' ? 'Your information is encrypted with 256-bit SSL security.' : 'Je gegevens zijn versleuteld en beveiligd met 256-bit SSL-encryptie.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── CARD 1: WACHTWOORD WIJZIGEN ── */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#00255c] flex items-center justify-center">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#001331]">{t('client.changePassword')}</h3>
            <p className="text-xs text-gray-400">{language === 'en' ? 'Choose a strong password of at least 6 characters.' : 'Kies een sterk wachtwoord van minimaal 6 tekens.'}</p>
          </div>
        </div>

        {passwordSuccess && (
          <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-xs sm:text-sm text-green-700 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
            <span>{language === 'en' ? 'Password updated successfully!' : 'Wachtwoord succesvol bijgewerkt!'}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs sm:text-sm text-red-700 font-semibold animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">{t('client.currentPassword')}</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#00255c] focus-within:bg-white transition">
              <Lock className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={language === 'en' ? 'Enter current password' : 'Voer je huidige wachtwoord in'}
                className="w-full bg-transparent text-xs sm:text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('client.newPassword')}</label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#00255c] focus-within:bg-white transition">
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={language === 'en' ? 'Min. 6 characters' : 'Minimaal 6 tekens'}
                  className="w-full bg-transparent text-xs sm:text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('client.confirmNewPassword')}</label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#00255c] focus-within:bg-white transition">
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={language === 'en' ? 'Repeat new password' : 'Herhaal nieuw wachtwoord'}
                  className="w-full bg-transparent text-xs sm:text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmittingPassword}
            className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#001331] shadow hover:shadow-md transition cursor-pointer disabled:opacity-50"
            style={{ background: YELLOW }}
          >
            {isSubmittingPassword ? (language === 'en' ? 'Updating...' : 'Bezig met bijwerken...') : t('client.updatePasswordBtn')}
          </button>
        </form>
      </div>

      {/* ── CARD 2: TWEE-STAPS VERIFICATIE (2FA) ── */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#001331]">{t('client.twoFactor')}</h3>
              <p className="text-xs text-gray-400">
                {language === 'en' ? 'Verify your identity using a security code when logging in from new devices.' : 'Verifieer je identiteit via een beveiligingscode bij inloggen vanaf een nieuw apparaat.'}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={handleToggle2FA}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
              twoFactorEnabled ? 'bg-[#001331]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[#FFB800] transition-transform duration-200 shadow-xs ${
                twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {twoFactorToast && (
          <div className="text-xs text-emerald-600 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            {twoFactorToast}
          </div>
        )}

        <div className="text-xs text-gray-500 pt-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>{language === 'en' ? 'Verification codes will be sent to:' : 'Verificatiecodes worden verzonden naar:'} <strong className="text-gray-800">{user.email}</strong></span>
        </div>
      </div>

      {/* ── CARD 3: ACTIEVE APPARATEN & SESSIES ── */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#001331]">{t('client.activeSessions')}</h3>
              <p className="text-xs text-gray-400">{language === 'en' ? 'Overview of devices currently logged in to your account.' : 'Overzicht van apparaten waarop je momenteel bent ingelogd.'}</p>
            </div>
          </div>

          {sessions.length > 1 && (
            <button
              onClick={handleTerminateOtherSessions}
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              {t('client.terminateAllSessions')}
            </button>
          )}
        </div>

        {sessionsToast && (
          <div className="text-xs text-emerald-600 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            {sessionsToast}
          </div>
        )}

        <div className="divide-y divide-gray-100">
          {sessions.map((s) => (
            <div key={s.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                  {s.isMobile ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-[#001331] flex items-center gap-2">
                    <span>{s.device}</span>
                    {s.isCurrent && (
                      <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded">
                        {language === 'en' ? 'Current' : 'Huidig'}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-400 text-[11px]">{s.detail} • {s.location}</div>
                </div>
              </div>
              <span className="text-gray-500 font-medium shrink-0">{s.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── KLANTENSERVICE SECTION ─────────────────────────────
function KlantenserviceSection({
  user,
}: {
  onContact?: () => void;
  user: AuthUser;
}) {
  const { t, language } = useLanguage();
  const [subject, setSubject] = useState(language === 'en' ? 'General question' : 'Algemene vraag');
  const [customSubject, setCustomSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  const quickSubjects = language === 'en' ? [
    'General question',
    'Ride modification',
    'Price quote',
    'Payment & Invoice',
    'Other',
  ] : [
    'Algemene vraag',
    'Ritwijziging',
    'Prijsopgave / Offerte',
    'Betaling & Factuur',
    'Overig',
  ];

  const loadUserInquiries = useCallback(async () => {
    if (!user?.email) return;
    setLoadingInquiries(true);
    try {
      const data = await supabaseDataService.getUserInquiries(user.email);
      setInquiries(data);
    } catch {
      // ignore
    } finally {
      setLoadingInquiries(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadUserInquiries();
  }, [loadUserInquiries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setSubmitError(language === 'en' ? 'Please enter a message.' : 'Vul a.u.b. een bericht in.');
      return;
    }
    setSubmitError('');
    setIsSubmitting(true);

    const isOther = subject === 'Overig' || subject === 'Other';
    const finalSubject = isOther && customSubject.trim() ? customSubject.trim() : subject;

    try {
      await supabaseDataService.submitInquiry({
        name: user.name,
        email: user.email,
        phone: user.phone,
        subject: finalSubject,
        message: message.trim(),
      });
      setSubmitSuccess(true);
      setMessage('');
      setCustomSubject('');
      await loadUserInquiries();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      setSubmitError(err.message || (language === 'en' ? 'An error occurred while sending.' : 'Er is een fout opgetreden bij het verzenden.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-black text-[#001331] mb-1">{t('client.customerService')} & {language === 'en' ? 'Dispatch' : 'Centrale'}</h2>
        <p className="text-sm text-gray-500">{language === 'en' ? 'Available 24/7 for support, ride changes and questions.' : '24/7 bereikbaar voor ondersteuning, ritwijzigingen en vragen.'}</p>
      </div>

      {/* Direct Contact Cards */}
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
            <div className="text-xs text-gray-400 font-semibold uppercase">{t('client.callCentral')}</div>
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
            <div className="text-xs text-gray-400 font-semibold uppercase">{t('client.whatsappChat')}</div>
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
            <div className="text-xs text-gray-400 font-semibold uppercase">{t('client.emailSupport')}</div>
            <div className="text-base font-black text-[#07152B]">info@taximooo.nl</div>
          </div>
        </a>
      </div>

      {/* ── Direct Message to Central dispatch form ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#00255c]" />
              <h3 className="font-extrabold text-[#001331] text-base sm:text-lg">
                Stuur direct een bericht naar de centrale
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Je bericht komt direct binnen op het beheersysteem van de centrale met jouw accountgegevens.
            </p>
          </div>
        </div>

        {/* User identification chip */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-bold text-[#001331]">Verzonden als:</span>
            <span className="font-extrabold text-[#00255c]">{user.name}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{user.email}</span>
            {user.phone && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{user.phone}</span>
              </>
            )}
          </div>
          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-bold text-[10px]">
            ✓ Geverifieerd account
          </span>
        </div>

        {submitSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-sm text-green-800 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="font-bold">Bericht succesvol verzonden naar de centrale!</p>
              <p className="text-xs text-green-700 mt-0.5">
                De centrale heeft je bericht ontvangen. Zodra er wordt gereageerd, ontvang je direct een melding in je dashboard.
              </p>
            </div>
          </div>
        )}

        {submitError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700 font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Subject selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Kies een onderwerp
            </label>
            <div className="flex flex-wrap gap-2">
              {quickSubjects.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    subject === sub
                      ? 'bg-[#001331] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {subject === 'Overig' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Specifiek onderwerp
              </label>
              <input
                type="text"
                required
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Bijv. Vraag over verloren voorwerp..."
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#00255c] focus:ring-2 focus:ring-[#00255c]/10"
              />
            </div>
          )}

          {/* Message area */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Jouw bericht of vraag
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Schrijf hier je vraag, ritwijziging of opmerking voor de centrale..."
              className="w-full p-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#00255c] focus:ring-2 focus:ring-[#00255c]/10 resize-none"
            />
          </div>

          {/* Submit button */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-gray-400">
              Antwoord verschijnt direct hieronder en bij je meldingen.
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-[#001331] shadow hover:shadow-md transition cursor-pointer shrink-0 disabled:opacity-50"
              style={{ background: YELLOW }}
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Verzenden...' : 'Verstuur bericht naar centrale'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── My Sent Messages & Replies List ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-[#00255c]" />
            <h4 className="font-extrabold text-[#001331] text-base">
              Mijn berichten & antwoorden van de centrale
            </h4>
          </div>
          <button
            type="button"
            onClick={loadUserInquiries}
            className="text-xs font-bold text-[#00255c] hover:underline cursor-pointer"
          >
            Vernieuwen
          </button>
        </div>

        {loadingInquiries ? (
          <div className="py-8 text-center text-gray-400 text-sm">
            <div className="w-5 h-5 border-2 border-[#001331]/20 border-t-[#001331] rounded-full animate-spin mx-auto mb-2" />
            Berichten laden...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">
            Je hebt nog geen berichten naar de centrale gestuurd.
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-sm text-[#001331]">{inq.subject}</span>
                  <div className="flex items-center gap-2">
                    {inq.admin_reply ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-600" /> Beantwoord
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> In behandeling
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(inq.created_at).toLocaleDateString('nl-NL')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
                  {inq.message}
                </p>

                {/* If replied by admin */}
                {inq.admin_reply && (
                  <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-green-900">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Antwoord van Taxi mooo Centrale:
                      </span>
                      {inq.replied_at && (
                        <span className="text-[10px] text-green-700 font-normal">
                          {new Date(inq.replied_at).toLocaleString('nl-NL')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-green-950 font-medium leading-relaxed bg-white/70 p-2.5 rounded-lg border border-green-100">
                      {inq.admin_reply}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RIDES & STATUS HELPERS ──────────────────────────────
export interface RecentRide {
  id: string;
  rawStatus: string;
  from: string;
  to: string;
  date: string;
  time: string;
  status: string;
  price: string;
  driverName?: string;
  vehicleType?: string;
}

function getStatusBadge(rawStatus: string, label: string) {
  const s = (rawStatus || '').toLowerCase();
  switch (s) {
    case 'nieuw':
    case 'bevestigd':
      return (
        <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 font-bold rounded-full text-[11px] flex items-center gap-1 shrink-0">
          <Clock className="w-3 h-3 text-amber-600" />
          <span>{label || 'Nieuw'}</span>
        </span>
      );
    case 'toegewezen':
      return (
        <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 font-bold rounded-full text-[11px] flex items-center gap-1 shrink-0">
          <Car className="w-3 h-3 text-blue-600" />
          <span>{label || 'Toegewezen'}</span>
        </span>
      );
    case 'onderweg':
      return (
        <span className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 font-bold rounded-full text-[11px] flex items-center gap-1 shrink-0 animate-pulse">
          <MapPin className="w-3 h-3 text-purple-600" />
          <span>{label || 'Onderweg'}</span>
        </span>
      );
    case 'voltooid':
      return (
        <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 font-bold rounded-full text-[11px] flex items-center gap-1 shrink-0">
          <CheckCircle2 className="w-3 h-3 text-green-600" />
          <span>{label || 'Voltooid'}</span>
        </span>
      );
    case 'geannuleerd':
      return (
        <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 font-bold rounded-full text-[11px] flex items-center gap-1 shrink-0">
          <X className="w-3 h-3 text-red-600" />
          <span>{label || 'Geannuleerd'}</span>
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-200 font-bold rounded-full text-[11px] flex items-center gap-1 shrink-0">
          <span>{label}</span>
        </span>
      );
  }
}

// ─── FULL RITTEN SECTION (Mijn ritten met alle filters) ────
function RittenSection({
  rides,
  ridesLoading,
  onRefresh,
}: {
  rides: RecentRide[];
  ridesLoading: boolean;
  onRefresh: () => void;
}) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'nieuw' | 'toegewezen' | 'onderweg' | 'voltooid' | 'geannuleerd'>('all');

  const filterTabs = [
    { id: 'all', label: 'Alle', count: rides.length },
    { id: 'nieuw', label: 'Nieuw', count: rides.filter(r => r.rawStatus === 'nieuw' || r.rawStatus === 'bevestigd').length },
    { id: 'toegewezen', label: 'Toegewezen', count: rides.filter(r => r.rawStatus === 'toegewezen').length },
    { id: 'onderweg', label: 'Onderweg', count: rides.filter(r => r.rawStatus === 'onderweg').length },
    { id: 'voltooid', label: 'Voltooid', count: rides.filter(r => r.rawStatus === 'voltooid').length },
    { id: 'geannuleerd', label: 'Geannuleerd', count: rides.filter(r => r.rawStatus === 'geannuleerd').length },
  ];

  const filteredRides = rides.filter((r) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'nieuw') return r.rawStatus === 'nieuw' || r.rawStatus === 'bevestigd';
    return r.rawStatus === statusFilter;
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#001331] mb-1">Mijn ritten</h2>
          <p className="text-sm text-gray-500">
            Bekijk je geboekte ritten en volg realtime de actuele status van de centrale.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="self-start sm:self-auto px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#001331] hover:bg-gray-50 transition cursor-pointer shadow-sm"
        >
          Vernieuwen
        </button>
      </div>

      {/* Status Filter Tabs (Alle, Nieuw, Toegewezen, Onderweg, Voltooid, Geannuleerd) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {filterTabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#001331] text-[#FFB800] shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive ? 'bg-[#FFB800] text-[#001331] font-black' : 'bg-gray-100 text-gray-500 font-semibold'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Rides List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-gray-100">
        {ridesLoading ? (
          <div className="py-14 text-center text-sm text-gray-400">
            <div className="w-6 h-6 border-2 border-[#001331]/20 border-t-[#001331] rounded-full animate-spin mx-auto mb-2" />
            Ritten laden...
          </div>
        ) : filteredRides.length === 0 ? (
          <div className="py-14 text-center text-sm text-gray-400 px-4">
            <Car className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p className="font-bold text-gray-700">Geen ritten gevonden in deze categorie</p>
            <p className="text-xs text-gray-400 mt-1">
              Er zijn momenteel geen ritten met de status "{filterTabs.find(t => t.id === statusFilter)?.label}".
            </p>
          </div>
        ) : (
          filteredRides.map((ride, idx) => (
            <div key={idx} className="p-5 hover:bg-gray-50/70 transition space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {ride.id}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">📅 {ride.date}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">🕒 {ride.time} uur</span>
                </div>
                {getStatusBadge(ride.rawStatus, ride.status)}
              </div>

              {/* Route */}
              <div className="space-y-1.5 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-[#07152B]">
                  <MapPin className="w-4 h-4 text-[#001331] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-medium">Ophaallocatie</span>
                    <span>{ride.from}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-[#07152B] pt-1.5 border-t border-gray-200/60">
                  <MapPin className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-medium">Bestemming</span>
                    <span>{ride.to}</span>
                  </div>
                </div>
              </div>

              {/* Driver & Price Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                <div>
                  {ride.driverName ? (
                    <span className="font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 inline-flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-700" />
                      Chauffeur: {ride.driverName}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">
                      {ride.rawStatus === 'voltooid' ? 'Rit voltooid' : 'Chauffeur wordt ingepland door centrale'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 font-black text-sm text-[#001331]">
                  <span>Tarief:</span>
                  <span className="text-[#00255c] text-base">{ride.price}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── RESERVERING SECTION ─────────────────────────────────
function ReserveringSection({ user, onRideCreated }: { user: AuthUser; onRideCreated?: () => void }) {
  const { t, language } = useLanguage();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!from.trim() || !to.trim() || !date || !time) {
      setError('Vul a.u.b. alle verplichte velden in.');
      return;
    }
    setLoading(true);
    try {
      const passNum = Math.min(7, Math.max(1, Number(passengers) || 1));
      const isBus = passNum > 4;
      const dist = calculateRealisticDutchDistance(from.trim(), to.trim());
      const rate = isBus ? 3.04 : 2.39;
      const fare = Number((dist.km * rate).toFixed(2));

      await supabaseDataService.createOrder({
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || '',
        customerNotes: notes.trim() || undefined,
        pickupAddress: from.trim(),
        destinationAddress: to.trim(),
        pickupDate: date,
        pickupTime: time,
        passengers: passNum,
        estimatedKm: dist.km,
        vehicleType: isBus ? 'groot' : 'klein',
        hasLuggage: false,
        kmRate: rate,
        totalFare: fare,
        paymentMethod: 'cash',
      });
      setSubmitted(true);
      onRideCreated?.();
    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[380px] text-center px-6 space-y-5">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, #001331 0%, #00255c 100%)' }}
        >
          <CheckCircle2 className="w-10 h-10 text-[#FFB800]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#001331]">{t('client.rideSent')}</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
            {t('client.rideSentSub')}
          </p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setFrom(''); setTo(''); setDate(''); setTime(''); setNotes(''); setPassengers('1'); }}
          className="px-6 py-3 rounded-xl font-extrabold text-sm text-[#001331] shadow hover:opacity-90 transition cursor-pointer"
          style={{ background: '#FFB800' }}
        >
          {t('client.requestRide')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #001331 0%, #00255c 100%)' }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FFB800, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-[#FFB800] flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-[#001331]" />
          </div>
          <div>
            <h2 className="text-lg font-black">{t('client.whereTo')}</h2>
            <p className="text-xs text-white/70 mt-0.5">{t('client.whereToSub')}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Ophaaladres with Google Maps / NL Autocomplete */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            <span className="text-red-500">*</span> {t('client.pickupLocation')}
          </label>
          <DutchAddressAutocomplete
            value={from}
            onChange={setFrom}
            placeholder="Bijv. Schiphol Airport, Amsterdam"
            theme="light"
            iconColor="#001331"
            required
          />
        </div>

        {/* Bestemming with Google Maps / NL Autocomplete */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            <span className="text-red-500">*</span> {t('client.destination')}
          </label>
          <DutchAddressAutocomplete
            value={to}
            onChange={setTo}
            placeholder="Bijv. Rotterdam Centraal"
            theme="light"
            iconColor="#FFB800"
            required
          />
        </div>

        {/* Datum & Tijd */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              <span className="text-red-500">*</span> {t('client.date')}
            </label>
            <input
              type="date"
              required
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-3 bg-[#F4F7FB] border border-[#E2E8F0] rounded-xl text-sm text-[#07152B] focus:outline-none focus:border-[#00255c] focus:ring-2 focus:ring-[#00255c]/10 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              <span className="text-red-500">*</span> {t('client.time')}
            </label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3.5 py-3 bg-[#F4F7FB] border border-[#E2E8F0] rounded-xl text-sm text-[#07152B] focus:outline-none focus:border-[#00255c] focus:ring-2 focus:ring-[#00255c]/10 transition"
            />
          </div>
        </div>

        {/* Passagiers */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">{t('client.passengers')}</label>
          <div className="grid grid-cols-7 gap-1.5 mb-2.5">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPassengers(String(num))}
                className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  passengers === String(num)
                    ? 'bg-[#00255c] text-[#FFD500] shadow-sm ring-2 ring-[#00255c]/20'
                    : 'bg-[#F4F7FB] text-gray-700 hover:bg-[#E2E8F0] border border-[#E2E8F0]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Dynamic Vehicle Preview Card */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 p-3 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
            <div className="relative w-full sm:w-28 h-20 rounded-xl overflow-hidden shrink-0 bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center p-1.5 shadow-xs">
              <img
                src={Number(passengers) <= 4 ? '/chauffeur-mercedes-web.jpg' : '/grote-auto.png'}
                alt="Voertuig"
                className={`w-full h-full ${
                  Number(passengers) <= 4
                    ? 'object-cover object-center rounded-lg shadow-xs'
                    : 'object-contain drop-shadow-sm p-0.5'
                }`}
              />
              <span className="absolute bottom-1 left-1 px-1.5 py-0.2 bg-[#001331]/90 text-[#FFD500] text-[9px] font-black rounded">
                {Number(passengers) <= 4 ? '1–4' : '1–7'}
              </span>
              <span className="absolute top-1 right-1 px-1.5 py-0.2 bg-[#FFB800] text-[#001331] text-[9px] font-black rounded">
                {Number(passengers) <= 4 ? '€2.39/km' : '€3.04/km'}
              </span>
            </div>
            <div className="text-xs text-start flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#001331] block">
                  {Number(passengers) <= 4
                    ? (language === 'ar' ? 'سيدان فاخرة (Mercedes-Benz E-Class)' : language === 'es' ? 'Sedán de Lujo (Mercedes Clase E)' : language === 'en' ? 'Luxury Sedan (Mercedes E-Class)' : 'Luxe Sedan (Mercedes-Benz E-Klasse)')
                    : (language === 'ar' ? 'باص وفان عائلي (Mercedes-Benz V-Class)' : language === 'es' ? 'Minibús Espacioso (Mercedes Clase V)' : language === 'en' ? 'Spacious Minibus (Mercedes V-Class)' : 'Ruime Taxibus (Mercedes-Benz V-Klasse)')}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#00255c] border border-blue-200 shrink-0">
                  {Number(passengers) <= 4 ? '1–4 pers.' : '1–7 pers.'}
                </span>
              </div>
              <p className="text-gray-500 text-[11px] mt-1 leading-relaxed">
                {Number(passengers) <= 4
                  ? (language === 'ar' ? 'مناسبة لعدد حتى 4 ركاب مع 3 حقائب سفر كبيرة ومقاعد جلدية فاخرة.' : language === 'es' ? 'Apto para hasta 4 pasajeros con 3 maletas y asientos de cuero.' : language === 'en' ? 'Suitable for up to 4 passengers with 3 suitcases and leather seats.' : 'Geschikt voor max. 4 personen met 3 koffers en luxe lederen stoelen.')
                  : (language === 'ar' ? 'مساحة عائلية واسعة حتى 7 ركاب مع 7 حقائب وأبواب كهربائية.' : language === 'es' ? 'Espacio amplio para hasta 7 pasajeros con 7 maletas y puertas automáticas.' : language === 'en' ? 'Spacious for up to 7 passengers with 7 bags and automatic doors.' : 'Ruim groepsvervoer voor max. 7 personen met 7 koffers en schuifdeuren.')}
              </p>
            </div>
          </div>
        </div>

        {/* Opmerkingen */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">{t('client.notes')}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Bijv. rolstoel nodig, bagage meenemen, vluchtnummer..."
            className="w-full px-3.5 py-3 bg-[#F4F7FB] border border-[#E2E8F0] rounded-xl text-sm text-[#07152B] focus:outline-none focus:border-[#00255c] focus:ring-2 focus:ring-[#00255c]/10 transition resize-none"
          />
        </div>

        {/* Live Distance and Price Calculation Preview */}
        {from.trim() && to.trim() && (() => {
          const liveDist = calculateRealisticDutchDistance(from.trim(), to.trim());
          const isBus = Number(passengers) > 4;
          const liveRate = isBus ? 3.04 : 2.39;
          const liveFare = (liveDist.km * liveRate).toFixed(2);
          return (
            <div className="p-3.5 bg-gradient-to-r from-[#001331] to-[#00255c] text-white rounded-xl flex items-center justify-between border border-[#FFB800]/40 shadow-sm animate-in fade-in duration-200">
              <div className="space-y-0.5 text-xs text-start">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#FFB800] text-sm">🛣️ {liveDist.km} km</span>
                  <span className="text-blue-200">· ⏱️ ~{liveDist.durationMinutes} min</span>
                </div>
                <div className="text-[11px] text-blue-200">
                  {isBus ? '€3.04 / km (Taxibus)' : '€2.39 / km (Sedan)'}
                </div>
              </div>
              <div className="text-end">
                <span className="text-[10px] text-gray-300 block uppercase tracking-wider">
                  {language === 'ar' ? 'السعر الثابت' : language === 'es' ? 'Precio fijo' : language === 'en' ? 'Fixed Fare' : 'Vaste Ritprijs'}
                </span>
                <span className="text-lg font-black text-[#FFB800]">€ {liveFare}</span>
              </div>
            </div>
          );
        })()}

        {/* Klant info (readonly) */}
        <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 space-y-1">
          <p className="font-bold text-[#001331]">Uw gegevens worden automatisch meegestuurd:</p>
          <p>👤 {user.name} · 📧 {user.email}{user.phone ? ` · 📞 ${user.phone}` : ''}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-xl font-extrabold text-sm text-[#001331] shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #FFB800 0%, #e6a500 100%)' }}
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-[#001331]/30 border-t-[#001331] rounded-full animate-spin" /> {t('common.sending')}</>
          ) : (
            <><Send className="w-4 h-4" /> {t('client.requestRide')}</>
          )}
        </button>
      </form>
    </div>
  );
}

// ─── MAIN DASHBOARD ─────────────────────────────────────
function MainDashboard({ user, onNavigate, onContact, recentRides, ridesLoading, unreadNotifications, onRideCreated }: {
  user: AuthUser;
  onNavigate: (s: DashSection) => void;
  onContact?: () => void;
  recentRides: RecentRide[];
  ridesLoading: boolean;
  unreadNotifications?: ClientNotification[];
  onRideCreated?: () => void;
}) {
  const { t, language } = useLanguage();
  const [mainStatusFilter, setMainStatusFilter] = useState<'all' | 'nieuw' | 'toegewezen' | 'onderweg' | 'voltooid' | 'geannuleerd'>('all');

  const menuCards: {
    id: DashSection;
    icon: React.ReactNode;
    title: string;
    sub: string;
    span?: boolean;
  }[] = [
    { id: 'reservering',     icon: <MapPin className="w-5 h-5" />,      title: t('client.whereTo'),          sub: t('client.whereToSub'), span: true },
    { id: 'ritten',          icon: <Car className="w-5 h-5" />,        title: t('client.myRides'),          sub: t('client.viewAllRides') },
    { id: 'accountgegevens', icon: <User className="w-5 h-5" />,       title: t('client.accountDetails'),   sub: t('client.accountDetails') },
    { id: 'beveiliging',     icon: <Shield className="w-5 h-5" />,     title: t('client.loginSecurity'),    sub: t('client.loginSecurity') },
    { id: 'betaalmethoden',  icon: <CreditCard className="w-5 h-5" />, title: t('client.paymentMethods'),   sub: t('client.paymentMethods') },
    { id: 'klantenservice',  icon: <Headphones className="w-5 h-5" />, title: t('client.customerService'),   sub: t('client.customerService'), span: true },
  ];

  // Quick booking state
  const [quickFrom, setQuickFrom] = useState('');
  const [quickTo, setQuickTo] = useState('');
  const [quickDate, setQuickDate] = useState('');
  const [quickTime, setQuickTime] = useState('');
  const [quickPassengers, setQuickPassengers] = useState(1);
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState(false);
  const [quickError, setQuickError] = useState('');

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickError('');
    if (!quickFrom.trim() || !quickTo.trim()) {
      setQuickError('Vul a.u.b. ophaallocatie en bestemming in.');
      return;
    }
    setQuickLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const nowTime = new Date().toTimeString().slice(0, 5);
      const dist = calculateRealisticDutchDistance(quickFrom.trim(), quickTo.trim());
      const isBus = quickPassengers > 4;
      const rate = isBus ? 3.04 : 2.39;
      const fare = Number((dist.km * rate).toFixed(2));

      await supabaseDataService.createOrder({
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || '',
        pickupAddress: quickFrom.trim(),
        destinationAddress: quickTo.trim(),
        pickupDate: quickDate || today,
        pickupTime: quickTime || nowTime,
        passengers: quickPassengers,
        estimatedKm: dist.km,
        vehicleType: isBus ? 'groot' : 'klein',
        hasLuggage: false,
        kmRate: rate,
        totalFare: fare,
        paymentMethod: 'cash',
      });
      setQuickSuccess(true);
      setQuickFrom('');
      setQuickTo('');
      setQuickDate('');
      setQuickTime('');
      onRideCreated?.();
      setTimeout(() => setQuickSuccess(false), 6000);
    } catch (err: any) {
      setQuickError(err.message || 'Kon rit niet aanvragen. Probeer opnieuw.');
    } finally {
      setQuickLoading(false);
    }
  };

  const filteredRecentRides = recentRides.filter((r) => {
    if (mainStatusFilter === 'all') return true;
    if (mainStatusFilter === 'nieuw') return r.rawStatus === 'nieuw' || r.rawStatus === 'bevestigd';
    return r.rawStatus === mainStatusFilter;
  });
  return (
    <div className="space-y-6">

      {/* ── Unread Notification Alert Banner ── */}
      {unreadNotifications && unreadNotifications.length > 0 && (
        <div
          onClick={() => {
            const first = unreadNotifications[0];
            if (first.linkSection) onNavigate(first.linkSection);
          }}
          className="p-4 rounded-2xl bg-[#001331] border border-[#FFB800] shadow-md flex items-center justify-between gap-3 cursor-pointer hover:bg-[#00255c] transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFB800] text-[#001331] flex items-center justify-center font-bold shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#FFB800] text-[#001331]">
                  Nieuwe melding ({unreadNotifications.length})
                </span>
                <span className="text-[11px] text-white/60">Klik om direct te bekijken</span>
              </div>
              <p className="text-sm font-bold text-white mt-1">
                {unreadNotifications[0].title}
              </p>
              <p className="text-xs text-white/80 line-clamp-1">
                {unreadNotifications[0].message}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#FFB800] group-hover:translate-x-1 transition-transform shrink-0" />
        </div>
      )}

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
          { icon: <Car className="w-5 h-5" />,    value: recentRides.length,         label: 'Mijn ritten',   iconBg: '#EBF2FC', iconColor: NAVY2,     valColor: NAVY },
          { icon: <Star className="w-5 h-5" />,   value: recentRides.length > 0 ? '5.0 ★' : '–', label: 'Beoordeling', iconBg: '#FFF8E7', iconColor: '#E6A500', valColor: NAVY },
          { icon: <Wallet className="w-5 h-5" />, value: `€ ${(user.balance || 0).toFixed(2)}`, label: 'Saldo tegoed', iconBg: '#ECFDF5', iconColor: '#16A34A', valColor: '#16A34A' },
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

      {/* ── "Waar wil je heen?" Quick Action & Booking Card ── */}
      <div className="bg-gradient-to-br from-[#001331] via-[#001d4a] to-[#00255c] rounded-3xl p-5 sm:p-6 text-white border border-[#FFB800]/30 shadow-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFB800] text-[#001331] flex items-center justify-center font-black shadow-lg shadow-[#FFB800]/30 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black text-[#FFB800] uppercase tracking-wider block">
                Direct rit aanvragen
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Waar wil je heen?
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('reservering')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#FFB800] text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
          >
            <span>Uitgebreid formulier</span>
            <ArrowRight className="w-4 h-4 text-[#FFB800]" />
          </button>
        </div>

        {/* Success Alert */}
        {quickSuccess && (
          <div className="mb-4 p-3.5 bg-emerald-500/20 border border-emerald-400/50 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm text-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Ritaanvraag succesvol verzonden! De centrale heeft uw rit ontvangen en neemt spoedig contact op.</span>
          </div>
        )}

        {/* Error Alert */}
        {quickError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-2xl flex items-center gap-2 text-xs text-red-200">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{quickError}</span>
          </div>
        )}

        {/* Quick Booking Form */}
        <form onSubmit={handleQuickSubmit} className="space-y-3 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <DutchAddressAutocomplete
              value={quickFrom}
              onChange={setQuickFrom}
              placeholder="Ophaallocatie (bijv. Amsterdam Centraal)"
              theme="dark"
              iconColor="#FFB800"
              required
            />

            <DutchAddressAutocomplete
              value={quickTo}
              onChange={setQuickTo}
              placeholder="Bestemming (bijv. Schiphol Airport)"
              theme="dark"
              iconColor="#34D399"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            <div>
              <input
                type="date"
                value={quickDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setQuickDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFB800] transition"
              />
            </div>
            <div>
              <input
                type="time"
                value={quickTime}
                onChange={(e) => setQuickTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFB800] transition"
              />
            </div>
            <div>
              <select
                value={quickPassengers}
                onChange={(e) => setQuickPassengers(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#001331] border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFB800] transition cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <option key={num} value={num} className="bg-[#001331] text-white">
                    {num} {num === 1
                      ? (language === 'ar' ? 'راكب' : language === 'es' ? 'pasajero' : language === 'en' ? 'passenger' : 'passagier')
                      : (language === 'ar' ? 'ركاب' : language === 'es' ? 'pasajeros' : language === 'en' ? 'passengers' : 'passagiers')} {num <= 4 ? '(Sedan)' : '(Taxibus)'}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={quickLoading}
              className="py-2.5 px-4 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] text-[#001331] font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {quickLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#001331]/30 border-t-[#001331] rounded-full animate-spin" />
                  <span>Versturen...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Rit aanvragen</span>
                </>
              )}
            </button>
          </div>

          {/* Live Preview of Calculated Distance and Price */}
          {quickFrom.trim() && quickTo.trim() && (() => {
            const previewDist = calculateRealisticDutchDistance(quickFrom.trim(), quickTo.trim());
            const isBus = quickPassengers > 4;
            const previewRate = isBus ? 3.04 : 2.39;
            const previewFare = (previewDist.km * previewRate).toFixed(2);
            return (
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-white/10 rounded-xl text-xs text-white border border-[#FFB800]/40 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <span className="text-[#FFB800] font-extrabold text-sm">🛣️ {previewDist.km} km</span>
                  <span className="text-white/40">•</span>
                  <span className="text-blue-100">⏱️ ~{previewDist.durationMinutes} min</span>
                  <span className="text-white/60">({isBus ? '€3.04/km' : '€2.39/km'})</span>
                </div>
                <div className="text-end">
                  <span className="font-black text-[#FFB800] text-base">€ {previewFare}</span>
                </div>
              </div>
            );
          })()}
        </form>
      </div>

      {/* ── Menu Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {menuCards.map(({ id, icon, title, sub, span }) => (
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
          <button
            type="button"
            onClick={() => onNavigate('ritten')}
            className="text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer transition"
            style={{ color: NAVY2 }}
          >
            Bekijk alle ritten ({recentRides.length}) <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Status Filter Tabs (Alle, Nieuw, Toegewezen, Onderweg, Voltooid, Geannuleerd) */}
        <div className="p-2.5 bg-gray-50/70 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'Alle' },
            { id: 'nieuw', label: 'Nieuw' },
            { id: 'toegewezen', label: 'Toegewezen' },
            { id: 'onderweg', label: 'Onderweg' },
            { id: 'voltooid', label: 'Voltooid' },
            { id: 'geannuleerd', label: 'Geannuleerd' },
          ].map((tab) => {
            const isActive = mainStatusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMainStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#001331] text-[#FFB800] shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Rides list */}
        <div className="divide-y divide-gray-50">
          {ridesLoading ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              <div className="w-6 h-6 border-2 border-[#001331]/20 border-t-[#001331] rounded-full animate-spin mx-auto mb-2" />
              Ritten laden...
            </div>
          ) : filteredRecentRides.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              <Car className="w-10 h-10 mx-auto mb-3 text-gray-200" />
              <p className="font-semibold text-gray-500">Geen ritten gevonden</p>
              <p className="text-xs mt-1">Geen ritten in deze statuscategorie.</p>
            </div>
          ) : (
            filteredRecentRides.map((ride, i) => (
              <div key={i} className="px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50/60 transition">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#07152B] flex-wrap">
                    <MapPin className="w-3.5 h-3.5 text-[#001331] shrink-0" />
                    <span>{ride.from}</span>
                    <span className="text-gray-400 text-xs">──</span>
                    <MapPin className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
                    <span>{ride.to}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 flex-wrap">
                    <span className="font-mono text-[10px] font-bold text-gray-400">{ride.id}</span>
                    <span>📅 {ride.date}</span>
                    <span>🕒 {ride.time}</span>
                    {ride.driverName && (
                      <span className="text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Chauffeur: {ride.driverName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {getStatusBadge(ride.rawStatus, ride.status)}
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
  const { language, setLanguage, t } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(() => getValidClientUser());
  const [sessionExpired, setSessionExpired] = useState(false);

  const [activeSection, setActiveSection] = useState<DashSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentRides, setRecentRides] = useState<RecentRide[]>([]);
  const [ridesLoading, setRidesLoading] = useState(false);

  const navItems: { id: DashSection; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard',      label: t('client.dashboard'),        icon: <Home className="w-4 h-4" /> },
    { id: 'reservering',    label: t('client.whereTo'),          icon: <MapPin className="w-4 h-4" /> },
    { id: 'ritten',         label: t('client.myRides'),          icon: <Car className="w-4 h-4" /> },
    { id: 'accountgegevens',label: t('client.accountDetails'),   icon: <User className="w-4 h-4" /> },
    { id: 'beveiliging',   label: t('client.loginSecurity'),    icon: <Shield className="w-4 h-4" /> },
    { id: 'betaalmethoden', label: t('client.paymentMethods'),   icon: <CreditCard className="w-4 h-4" /> },
    { id: 'klantenservice',label: t('client.customerService'),   icon: <Headphones className="w-4 h-4" /> },
  ];

  // ─── NOTIFICATIONS STATE ──────────────────────────────────
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('taximooo_read_notifications');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const loadNotifications = useCallback(async (userEmail: string) => {
    const list: ClientNotification[] = [];

    // 1. Inquiries replies for this user
    try {
      const userInquiries = await supabaseDataService.getUserInquiries(userEmail);
      userInquiries.forEach((inq) => {
        if (inq.admin_reply) {
          list.push({
            id: `reply-${inq.id}`,
            type: 'inquiry_reply',
            title: `Antwoord op: ${inq.subject}`,
            message: `De centrale heeft gereageerd: "${inq.admin_reply}"`,
            time: inq.replied_at || inq.created_at,
            isRead: readNotificationIds.includes(`reply-${inq.id}`),
            linkSection: 'klantenservice',
            badge: 'Centrale',
          });
        }
      });
    } catch (err) {
      console.warn('Could not load user inquiries for notifications:', err);
    }

    // 2. Pricing updates (kilometer rates)
    try {
      const pricing = await supabaseDataService.getPricingSettings();
      if (pricing) {
        const klein = Number(pricing.klein_km_rate) || 2.39;
        const groot = Number(pricing.groot_km_rate) || 3.04;
        const pricingId = `pricing-${pricing.updated_at || 'current'}-${klein}-${groot}`;
        list.push({
          id: pricingId,
          type: 'pricing_update',
          title: 'Kilometertarieven bijgewerkt 🚕',
          message: `Nieuwe kilometertarieven actief: Sedan €${klein.toFixed(2)}/km | Busje €${groot.toFixed(2)}/km.`,
          time: pricing.updated_at || new Date().toISOString(),
          isRead: readNotificationIds.includes(pricingId),
          linkSection: 'dashboard',
          badge: 'Tarieven',
        });
      }
    } catch (err) {
      console.warn('Could not load pricing settings for notifications:', err);
    }

    // 3. Order status updates from administration
    try {
      let ordersList: any[] = [];
      if (supabaseDataService.isLive()) {
        ordersList = await supabaseDataService.getOrdersByEmail(userEmail);
      }
      const localOrders = adminBookingService.getOrders().filter(
        (o) => o.customerEmail?.toLowerCase() === userEmail.toLowerCase()
      );
      localOrders.forEach((loc) => {
        if (!ordersList.some((r) => r.order_number === loc.id || r.id === loc.id)) {
          ordersList.push({
            id: loc.id,
            order_number: loc.id,
            status: loc.status,
            pickup_address: loc.pickup,
            destination_address: loc.destination,
            updated_at: new Date().toISOString(),
          });
        }
      });

      ordersList.forEach((ord) => {
        const raw = (ord.status || '').toLowerCase();
        const num = ord.order_number || ord.id;
        if (raw && raw !== 'nieuw') {
          let title = '';
          let message = '';
          let badge = '';

          if (raw === 'toegewezen') {
            title = `Rit ${num} Toegewezen 🚗`;
            message = `De centrale heeft je rit toegewezen aan een chauffeur.`;
            badge = 'Toegewezen';
          } else if (raw === 'onderweg') {
            title = `Taxi Onderweg 🚖`;
            message = `Je taxi is nu onderweg naar ${ord.pickup_address || 'je ophaallocatie'}!`;
            badge = 'Onderweg';
          } else if (raw === 'voltooid') {
            title = `Rit ${num} Voltooid ✅`;
            message = `Je rit naar ${ord.destination_address || 'je bestemming'} is voltooid. Bedankt voor het reizen!`;
            badge = 'Voltooid';
          } else if (raw === 'geannuleerd') {
            title = `Rit ${num} Geannuleerd ❌`;
            message = `Rit ${num} is geannuleerd door de centrale.`;
            badge = 'Geannuleerd';
          }

          if (title) {
            const notifId = `order-${num}-${raw}`;
            list.push({
              id: notifId,
              type: 'order_update',
              title,
              message,
              time: ord.updated_at || ord.created_at || new Date().toISOString(),
              isRead: readNotificationIds.includes(notifId),
              linkSection: 'ritten',
              badge,
            });
          }
        }
      });
    } catch (err) {
      console.warn('Could not load orders for notifications:', err);
    }

    list.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setNotifications(list);
  }, [readNotificationIds]);

  // Load rides from Supabase and LocalStorage based on customer email
  const loadRides = useCallback(async (email: string) => {
    setRidesLoading(true);
    try {
      let allOrders: any[] = [];
      if (supabaseDataService.isLive()) {
        try {
          allOrders = await supabaseDataService.getOrdersByEmail(email);
        } catch (e) {
          console.warn('Error fetching remote orders for client:', e);
        }
      }

      // Merge local storage orders if any
      const localOrders = adminBookingService.getOrders().filter(
        (o) => o.customerEmail?.toLowerCase() === email.toLowerCase()
      );
      localOrders.forEach((loc) => {
        const exists = allOrders.some(
          (r) => r.order_number === loc.id || r.id === loc.id
        );
        if (!exists) {
          allOrders.push({
            id: loc.id,
            order_number: loc.id,
            pickup_address: loc.pickup,
            destination_address: loc.destination,
            pickup_date: loc.pickupDate,
            pickup_time: loc.pickupTime,
            status: loc.status,
            total_fare: loc.totalFare,
            vehicle_type: loc.vehicleType,
            assigned_driver: loc.assignedDriver,
          });
        }
      });

      const statusMap: Record<string, string> = {
        nieuw: 'Nieuw',
        bevestigd: 'Bevestigd',
        toegewezen: 'Toegewezen',
        onderweg: 'Onderweg',
        voltooid: 'Voltooid',
        geannuleerd: 'Geannuleerd',
      };

      const mapped: RecentRide[] = allOrders.map((o: any) => {
        const bo = o.pickup ? o : mapSupabaseOrderToBookingOrder(o);
        const d = new Date(bo.pickupDate || o.pickup_date);
        const dateStr = !isNaN(d.getTime())
          ? `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
          : (bo.pickupDate || o.pickup_date || '');
        const rawStatus = (bo.status || o.status || 'nieuw').toLowerCase();

        return {
          id: bo.id || o.order_number || o.id,
          rawStatus,
          from: bo.pickup || o.pickup_address,
          to: bo.destination || o.destination_address,
          date: dateStr,
          time: bo.pickupTime || o.pickup_time,
          status: statusMap[rawStatus] || rawStatus,
          price: `€ ${Number(bo.totalFare || o.total_fare || 0).toFixed(2)}`,
          driverName: bo.assignedDriver?.name || o.assigned_driver?.full_name || undefined,
          vehicleType: bo.vehicleType || o.vehicle_type,
        };
      });

      setRecentRides(mapped);
    } catch (err) {
      console.error('Error loading rides:', err);
    } finally {
      setRidesLoading(false);
    }
  }, []);

  // Real-time polling & focus listener
  useEffect(() => {
    if (user?.email) {
      loadRides(user.email);
      loadNotifications(user.email);

      const timer = setInterval(() => {
        loadRides(user.email);
        loadNotifications(user.email);
      }, 6000);

      const handleFocus = () => {
        loadRides(user.email);
        loadNotifications(user.email);
      };
      window.addEventListener('focus', handleFocus);

      return () => {
        clearInterval(timer);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [user?.email, loadRides, loadNotifications]);

  const markAllNotificationsAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    const updated = Array.from(new Set([...readNotificationIds, ...allIds]));
    setReadNotificationIds(updated);
    localStorage.setItem('taximooo_read_notifications', JSON.stringify(updated));
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif: ClientNotification) => {
    if (!readNotificationIds.includes(notif.id)) {
      const updated = [...readNotificationIds, notif.id];
      setReadNotificationIds(updated);
      localStorage.setItem('taximooo_read_notifications', JSON.stringify(updated));
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
    }
    setShowNotifications(false);
    if (notif.linkSection) {
      handleNavClick(notif.linkSection);
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const unreadCount = unreadNotifications.length;

  // Sync user to localStorage via session security
  useEffect(() => {
    if (user) setClientSession(user);
    else clearClientSession();
  }, [user]);

  // Load rides when user is set
  useEffect(() => {
    if (user?.email) loadRides(user.email);
  }, [user?.email, loadRides]);

  // Session activity tracker — expires after inactivity
  useEffect(() => {
    if (!user) return;
    const cleanup = initClientActivityTracker(() => {
      setUser(null);
      clearClientSession();
      setSessionExpired(true);
    });
    return cleanup;
  }, [user?.email]);

  // If not logged in, open account modal and exit dashboard
  useEffect(() => {
    if (!user && !sessionExpired) {
      onOpenAccount();
      onExit();
    }
  }, []);

  // Session expired screen
  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-[#000E24] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#00255c]/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#001331] rounded-2xl mx-auto">
            <Lock className="w-8 h-8 text-[#FFB800]" />
          </div>
          <div className="inline-block">
            <Logo size="md" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#001331]">{t('client.sessionExpired')}</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {t('client.sessionExpiredSub')}
            </p>
          </div>
          <button
            onClick={() => { setSessionExpired(false); onOpenAccount(); onExit(); }}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#001331] via-[#001d4a] to-[#00255c] text-white font-extrabold text-sm shadow-lg hover:opacity-90 transition-all cursor-pointer"
          >
            {t('client.relogin')}
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    setUser(null);
    clearClientSession();
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
        return (
          <MainDashboard
            user={user}
            onNavigate={handleNavClick}
            onContact={onNavigateToContact}
            recentRides={recentRides}
            ridesLoading={ridesLoading}
            unreadNotifications={unreadNotifications}
            onRideCreated={() => {
              if (user?.email) loadRides(user.email);
            }}
          />
        );
      case 'ritten':
        return (
          <RittenSection
            rides={recentRides}
            ridesLoading={ridesLoading}
            onRefresh={() => {
              if (user?.email) loadRides(user.email);
            }}
          />
        );
      case 'reservering':
        return (
          <ReserveringSection
            user={user}
            onRideCreated={() => {
              if (user?.email) loadRides(user.email);
            }}
          />
        );
      case 'accountgegevens':
        return <AccountGegevensSection user={user} onSave={handleUpdateUser} />;
      case 'beveiliging':
        return <BeveiligingSection user={user} />;
      case 'betaalmethoden':
        return <SectionPlaceholder title="Betaalmethoden" description="Voeg iDEAL, creditcard of andere betaalmethoden toe en beheer ze." icon={<CreditCard />} />;
      case 'klantenservice':
        return <KlantenserviceSection onContact={onNavigateToContact} user={user} />;
      default:
        return (
          <MainDashboard
            user={user}
            onNavigate={handleNavClick}
            onContact={onNavigateToContact}
            recentRides={recentRides}
            ridesLoading={ridesLoading}
            unreadNotifications={unreadNotifications}
            onRideCreated={() => {
              if (user?.email) loadRides(user.email);
            }}
          />
        );
    }
  };

  const activeLabel = navItems.find((n) => n.id === activeSection)?.label ?? t('client.dashboard');

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

          {/* Right: Language + Bell + User chip */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer border border-white/15"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>
                  {language === 'nl' ? '🇳🇱 NL' : language === 'en' ? '🇬🇧 EN' : language === 'ar' ? '🇸🇦 AR' : '🇪🇸 ES'}
                </span>
              </button>
              {langDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-36 bg-[#001331] border border-white/15 rounded-2xl shadow-2xl py-1 z-50 text-xs font-bold backdrop-blur-xl">
                    <button
                      type="button"
                      onClick={() => { setLanguage('nl'); setLangDropdownOpen(false); }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between cursor-pointer ${language === 'nl' ? 'bg-[#FFB800] text-[#001331]' : 'text-white hover:bg-white/10'}`}
                    >
                      <span>🇳🇱 Nederlands</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between cursor-pointer ${language === 'en' ? 'bg-[#FFB800] text-[#001331]' : 'text-white hover:bg-white/10'}`}
                    >
                      <span>🇬🇧 English</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLanguage('ar'); setLangDropdownOpen(false); }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between cursor-pointer ${language === 'ar' ? 'bg-[#FFB800] text-[#001331]' : 'text-white hover:bg-white/10'}`}
                    >
                      <span>🇸🇦 العربية</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLanguage('es'); setLangDropdownOpen(false); }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between cursor-pointer ${language === 'es' ? 'bg-[#FFB800] text-[#001331]' : 'text-white hover:bg-white/10'}`}
                    >
                      <span>🇪🇸 Español</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Notification bell & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications((prev) => !prev)}
                className="relative w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/15 cursor-pointer"
                title="Meldingen & Berichten"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FFB800] text-[#001331] text-[10px] font-black flex items-center justify-center border-2 border-[#001331] shadow">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover Dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left">
                    <div className="p-4 bg-[#001331] text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#FFB800]" />
                        <h4 className="font-extrabold text-sm">Meldingen</h4>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FFB800] text-[#001331] text-[10px] font-black">
                            {unreadCount} nieuw
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-white/70 hover:text-white hover:underline cursor-pointer"
                        >
                          Alles gelezen
                        </button>
                      )}
                    </div>

                    <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-xs">
                          <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                          Geen nieuwe meldingen beschikbaar.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3.5 hover:bg-gray-50 transition cursor-pointer flex gap-3 ${
                              !notif.isRead ? 'bg-[#FFFDF5]' : ''
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                notif.type === 'inquiry_reply'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {notif.type === 'inquiry_reply' ? (
                                <MessageSquare className="w-4 h-4" />
                              ) : (
                                <Car className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs text-[#07152B] truncate">
                                  {notif.title}
                                </span>
                                {!notif.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-[#FFB800] shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2 leading-relaxed">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-gray-400 mt-1 block">
                                {new Date(notif.time).toLocaleDateString('nl-NL', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

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
              {navItems.map(({ id, label, icon }) => {
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
                {t('admin.logout')}
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
                {navItems.map(({ id, label, icon }) => {
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
                  {t('admin.logout')}
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
