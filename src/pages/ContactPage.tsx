import React, { useState } from 'react';
import {
  ChevronRight,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  Building,
} from 'lucide-react';
import { adminBookingService } from '../services/adminBookingService';

interface ContactPageProps {
  onNavigateHome: () => void;
  onNavigateToBooking: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigateHome,
  onNavigateToBooking,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Algemene vraag');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    adminBookingService.saveInquiry({
      name,
      email,
      phone,
      subject,
      message,
    });
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('Algemene vraag');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="w-full">
      {/* Top Banner / Hero */}
      <section className="relative bg-gradient-to-br from-[#001331] via-[#001a3f] to-[#00255c] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1240px] mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-200/80 mb-6">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#FFB800] transition cursor-pointer flex items-center gap-1"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#FFB800] font-bold">Contact</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#FFB800] text-xs font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Contact & Klantenservice</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              We staan 24/7 voor je klaar
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
              Heb je een vraag over een geplande rit, wil je direct een taxi bestellen, of zoek je een
              zakelijke partner voor directievervoer? Neem direct contact op met onze 24-uurs dispatch centrale.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-16">
        {/* 4 Quick Contact Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Phone Call */}
          <a
            href="tel:+31641212427"
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#FFB800] transition flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EBF2FC] text-[#001331] group-hover:bg-[#FFB800] group-hover:text-[#001331] flex items-center justify-center transition-all mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-gray-500 mb-1">
                24/7 Centrale
              </div>
              <div className="text-lg font-black text-[#07152B] group-hover:text-[#00255c] transition-colors">
                +31 6 41212427
              </div>
              <p className="text-xs text-gray-500 mt-2">Direct een dispatcher aan de lijn</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-[#00255c]">
              Bel nu direct →
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/31641212427"
            target="_blank"
            rel="noreferrer"
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-green-400 transition flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 group-hover:bg-green-500 group-hover:text-white flex items-center justify-center transition-all mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-gray-500 mb-1">
                WhatsApp Live
              </div>
              <div className="text-lg font-black text-[#07152B] group-hover:text-green-700 transition-colors">
                +31 6 41212427
              </div>
              <p className="text-xs text-gray-500 mt-2">Binnen 2 minuten reactie</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-green-700">
              Start WhatsApp chat →
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:info@taximooo.nl"
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#FFB800] transition flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EBF2FC] text-[#001331] group-hover:bg-[#FFB800] group-hover:text-[#001331] flex items-center justify-center transition-all mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-gray-500 mb-1">
                E-mail Contact
              </div>
              <div className="text-lg font-black text-[#07152B] group-hover:text-[#00255c] transition-colors truncate">
                info@taximooo.nl
              </div>
              <p className="text-xs text-gray-500 mt-2">Binnen 1 uur inhoudelijk antwoord</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-[#00255c]">
              Stuur een e-mail →
            </div>
          </a>

          {/* Address */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EBF2FC] text-[#001331] flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-gray-500 mb-1">
                Hoofdkantoor
              </div>
              <div className="text-sm font-bold text-[#07152B]">Corelia de Langestraat 208</div>
              <div className="text-xs text-gray-500">2037 NR Haarlem</div>
              <p className="text-xs text-gray-500 mt-2">Gevestigd in Haarlem, 24/7 actief in heel Nederland</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
              Nederland
            </div>
          </div>
        </div>

        {/* Contact Form & Company Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <div className="space-y-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-[#EBF2FC] text-[#00255c] text-xs font-extrabold uppercase tracking-wider">
                Stuur een bericht
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#07152B]">
                Waarmee kunnen we je helpen?
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Vul het onderstaande formulier in en ons team neemt binnen enkele minuten contact met je op.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 px-6 text-center space-y-4 bg-green-50 rounded-2xl border border-green-200">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-[#07152B]">Bedankt voor je bericht!</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  We hebben je vraag goed ontvangen. Onze centrale neemt zo spoedig mogelijk contact met je op via e-mail of telefoon.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-full bg-[#001331] text-white font-bold text-xs hover:bg-[#00255c] transition cursor-pointer"
                  >
                    Nog een bericht versturen
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#07152B] mb-1.5">
                      Volledige naam <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="bijv. Jan de Vries"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00255c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#07152B] mb-1.5">
                      Telefoonnummer <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="bijv. 06 12345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00255c]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#07152B] mb-1.5">
                      E-mailadres <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="bijv. jan@example.nl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00255c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#07152B] mb-1.5">
                      Onderwerp
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00255c] bg-white cursor-pointer"
                    >
                      <option value="Algemene vraag">Algemene vraag</option>
                      <option value="Rit reservering of wijziging">Rit reservering of wijziging</option>
                      <option value="Schiphol transfer">Schiphol transfer</option>
                      <option value="Zakelijk account & factuur">Zakelijk account & factuur</option>
                      <option value="Verloren voorwerp">Verloren voorwerp</option>
                      <option value="Klacht of compliment">Klacht of compliment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#07152B] mb-1.5">
                    Je bericht of opmerking <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Beschrijf je vraag, datum, gewenste ophaallocatie of speciale wensen..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00255c]"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#001331] hover:bg-[#00255c] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-[#FFB800]" />
                    <span>{isSubmitting ? 'Verzenden...' : 'Verstuur bericht naar centrale'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right: Company Details & Interactive Map Mockup */}
          <div className="lg:col-span-5 space-y-6">
            {/* Opening Hours & Operations Box */}
            <div className="bg-[#FAF8FE] border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#001331] text-[#FFB800] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#07152B]">Openingstijden & Dispatch</div>
                  <div className="text-xs text-green-700 font-bold">● Nu Geopend (24/7/365)</div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-gray-600 border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span>Maandag - Vrijdag:</span>
                  <span className="font-bold text-[#07152B]">24 uur per dag</span>
                </div>
                <div className="flex justify-between">
                  <span>Zaterdag - Zondag:</span>
                  <span className="font-bold text-[#07152B]">24 uur per dag</span>
                </div>
                <div className="flex justify-between">
                  <span>Feestdagen:</span>
                  <span className="font-bold text-[#07152B]">24 uur per dag</span>
                </div>
              </div>
            </div>

            {/* Legal and Registration Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#00255c]">
                <Building className="w-4 h-4" />
                <span>Bedrijfsgegevens & Registraties</span>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600 pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Handelsnaam:</span>
                  <span className="font-semibold text-[#07152B]">Taxi mooo B.V.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">KvK-nummer:</span>
                  <span className="font-mono font-semibold text-[#07152B]">84920192</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Btw-nummer:</span>
                  <span className="font-mono font-semibold text-[#07152B]">NL863492019B01</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TX-Keurmerk:</span>
                  <span className="font-semibold text-green-700">Erkend & Gecertificeerd</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vergunning:</span>
                  <span className="font-semibold text-[#07152B]">Ministerie van I&W</span>
                </div>
              </div>
            </div>

            {/* Visual Location Preview */}
            <div className="bg-gradient-to-br from-[#001331] to-[#00255c] rounded-3xl p-6 sm:p-8 text-white space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-[#FFB800]" />
                <div>
                  <h3 className="font-bold text-base">Centrale in Haarlem</h3>
                  <p className="text-xs text-blue-200">Corelia de Langestraat 208, 2037 NR Haarlem</p>
                </div>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                Vanuit onze vestiging in Haarlem coördineren we 24/7 ritten door heel Noord-Holland, Zuid-Holland, Utrecht en de rest van Nederland.
              </p>
              <button
                onClick={onNavigateToBooking}
                className="w-full py-3 rounded-xl bg-[#FFB800] hover:bg-yellow-400 text-[#001331] font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                Direct een rit berekenen & boeken
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
