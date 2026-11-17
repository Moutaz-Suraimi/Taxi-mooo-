import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, Clock, MessageSquare, Send, Check } from 'lucide-react';
import { supabaseDataService } from '../services/supabaseDataService';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    supabaseDataService.submitInquiry({
      name,
      email,
      phone: '+31 6 41212427',
      subject: 'Vraag via Snelle Contact Modal',
      message,
    }).catch(() => {/* silent fallback */});
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-[28px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#001331] to-[#00255c] text-white">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#FFD500]" />
            <h3 className="font-bold text-lg">Contact & Centrale</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-xl font-bold text-[#07152B]">Bericht Verzonden!</h4>
              <p className="text-sm text-gray-600">
                Onze 24/7 centrale neemt binnen enkele minuten contact met je op.
              </p>
            </div>
          ) : (
            <>
              {/* Quick Contact Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:+31641212427"
                  className="flex flex-col items-center justify-center p-3.5 bg-[#EBF2FC] hover:bg-[#D4E2F4] rounded-2xl border border-slate-200 text-[#00255c] transition text-center"
                >
                  <Phone className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">Bel Centrale</span>
                  <span className="text-[11px] text-gray-500">+31 6 41212427</span>
                </a>

                <a
                  href="https://wa.me/31641212427"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center p-3.5 bg-green-50 hover:bg-green-100 rounded-2xl border border-green-200 text-green-700 transition text-center"
                >
                  <MessageSquare className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">WhatsApp Direct</span>
                  <span className="text-[11px] text-gray-500">Binnen 2 min antwoord</span>
                </a>
              </div>

              {/* Direct Info */}
              <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00255c]" />
                  <span>24 uur per dag, 7 dagen per week operationeel</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#00255c]" />
                  <span>info@taximooo.nl • dispatch@taximooo.nl</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00255c]" />
                  <span>Corelia de Langestraat 208, 2037 NR Haarlem</span>
                </div>
              </div>

              {/* Contact Message Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Naam</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Uw naam"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00255c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">E-mail of Telefoon</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="bijv. email@example.com of 0612345678"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00255c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vraag of opmerking</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Waar kunnen we je mee helpen?"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00255c]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00255c] hover:bg-[#001331] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Bericht versturen</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

