import React from 'react';
import { Clock } from 'lucide-react';

export const TrustCardsSection: React.FC = () => {
  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 my-10 sm:my-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Scherpe tarieven */}
        <div className="bg-white rounded-[22px] p-7 sm:p-8 border border-blue-100/70 shadow-[0_10px_35px_rgba(0,34,84,0.05)] hover:shadow-[0_15px_45px_rgba(0,34,84,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            {/* Discount / Percentage badge icon in light blue rounded square */}
            <div className="w-12 h-12 rounded-2xl bg-[#EBF2FC] flex items-center justify-center text-[#0B2559] mb-5">
              <svg
                className="w-6 h-6 text-[#0B2559]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Percentage circle */}
                <circle cx="12" cy="8" r="5" stroke="#0B2559" strokeWidth="2" />
                <line x1="10" y1="10" x2="14" y2="6" stroke="#0B2559" strokeWidth="1.5" />
                <circle cx="10" cy="7" r="0.8" fill="#0B2559" />
                <circle cx="14" cy="9" r="0.8" fill="#0B2559" />
                {/* Hand outline underneath */}
                <path
                  d="M 5 18 C 7 15 11 15 14 17 C 16 18 19 18 20 17"
                  stroke="#0B2559"
                  strokeWidth="2"
                />
                <path
                  d="M 3 20 L 7 16"
                  stroke="#0B2559"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#07152B] mb-2.5 tracking-tight">
              Scherpe tarieven
            </h3>

            <p className="text-[15px] text-gray-500 leading-relaxed font-normal">
              Tot 70% goedkoper dan de meterprijs. Vaste tarieven en geen verrassingen achteraf.
            </p>
          </div>
        </div>

        {/* Card 2: Overal in Nederland */}
        <div className="bg-white rounded-[22px] p-7 sm:p-8 border border-blue-100/70 shadow-[0_10px_35px_rgba(0,34,84,0.05)] hover:shadow-[0_15px_45px_rgba(0,34,84,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            {/* Netherlands map silhouette in light blue rounded square */}
            <div className="w-12 h-12 rounded-2xl bg-[#EBF2FC] flex items-center justify-center text-[#0B2559] mb-5">
              <svg
                className="w-6 h-6 text-[#0B2559] fill-[#0B2559]"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M 45 10 C 55 12 65 14 75 18 C 78 22 72 26 70 30 C 75 35 85 36 82 45 C 80 52 75 56 78 62 C 75 70 72 78 68 85 C 62 90 52 92 50 82 C 45 80 38 78 35 72 C 30 70 24 72 18 70 C 15 65 20 58 22 52 C 25 45 28 42 25 35 C 28 28 32 24 35 18 C 38 14 40 10 45 10 Z" />
                <circle cx="38" cy="8" r="3" />
                <circle cx="50" cy="7" r="2.5" />
                <circle cx="62" cy="9" r="2.5" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#07152B] mb-2.5 tracking-tight">
              Overal in Nederland
            </h3>

            <p className="text-[15px] text-gray-500 leading-relaxed font-normal">
              Je reist van en naar iedere locatie in Nederland en vliegvelden in Duitsland en België.
            </p>
          </div>
        </div>

        {/* Card 3: Betrouwbaar */}
        <div className="bg-white rounded-[22px] p-7 sm:p-8 border border-blue-100/70 shadow-[0_10px_35px_rgba(0,34,84,0.05)] hover:shadow-[0_15px_45px_rgba(0,34,84,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            {/* Clock icon in light blue rounded square */}
            <div className="w-12 h-12 rounded-2xl bg-[#EBF2FC] flex items-center justify-center text-[#0B2559] mb-5">
              <Clock className="w-6 h-6 text-[#0B2559] stroke-[2.2]" />
            </div>

            <h3 className="text-xl font-bold text-[#07152B] mb-2.5 tracking-tight">
              Betrouwbaar
            </h3>

            <p className="text-[15px] text-gray-500 leading-relaxed font-normal">
              Wij houden ons aan de afspraak. De chauffeur staat op het afgesproken tijdstip voor je klaar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
