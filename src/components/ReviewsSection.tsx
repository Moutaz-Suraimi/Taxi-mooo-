import React from 'react';
import { Star, CheckCircle2, Quote, ArrowRight } from 'lucide-react';
import { allReviews } from '../data/reviewsData';

interface ReviewsSectionProps {
  onNavigateToReviews?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onNavigateToReviews }) => {
  // Exactly 3 featured reviews on the homepage
  const homeReviews = allReviews.slice(0, 3);

  return (
    <section id="reviews-section" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 my-14 sm:my-20 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
        {/* Left: Badge & Main Title */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-[#EBF2FC] text-[#0B2559] text-xs font-extrabold uppercase tracking-wider">
              Klantbeoordelingen
            </span>
            <span className="h-1 w-10 bg-[#FFB800] rounded-full"></span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#07152B] leading-[1.15]">
            Wat onze reizigers vertellen
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Lees recente ervaringen van reizigers die kozen voor het comfort en de stiptheid van Taxi mooo.
          </p>
        </div>

        {/* Right: Overall score summary card */}
        <div className="flex items-center gap-4 bg-white px-5 py-3.5 rounded-2xl border border-blue-100/80 shadow-[0_4px_20px_rgba(0,34,84,0.04)]">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
              ))}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Gebaseerd op <span className="font-bold text-[#07152B]">1.250+ ritten</span>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-200"></div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#07152B]">4.9</span>
            <span className="text-xs text-gray-400 font-bold ml-1">/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Exactly 3 Featured Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeReviews.map((review) => (
          <div
            key={review.id}
            className="group bg-white rounded-2xl p-6 sm:p-7 border border-blue-100/70 shadow-[0_8px_30px_rgba(0,34,84,0.04)] hover:shadow-[0_16px_45px_rgba(0,34,84,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Card Header: Rating & Quote Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0B2559] flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                  <Quote className="w-4 h-4" />
                </div>
              </div>

              {/* Review Text */}
              <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-6 font-normal">
                "{review.text}"
              </p>
            </div>

            {/* Reviewer Details & Service Tag */}
            <div className="pt-4 border-t border-blue-50">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${review.avatarColor} text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0`}
                  >
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#07152B] tracking-tight flex items-center gap-1.5">
                      <span>{review.name}</span>
                      {review.verified && (
                        <span title="Geverifieerde reiziger">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 shrink-0" />
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-400 font-medium">
                      {review.location} • {review.date}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-md bg-[#EBF2FC] text-[#0B2559] text-[11px] font-bold shrink-0">
                  {review.service}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Button to Dedicated Reviews Page */}
      {onNavigateToReviews && (
        <div className="mt-8 text-center">
          <button
            onClick={onNavigateToReviews}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0B2559] hover:bg-[#001331] text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Bekijk alle beoordelingen & ervaringen</span>
            <ArrowRight className="w-4 h-4 text-[#FFB800]" />
          </button>
        </div>
      )}

      {/* Trust Badges Bar */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 via-white to-blue-50/70 border border-blue-100/60 flex flex-wrap items-center justify-around gap-6 text-center">
        <div className="space-y-1">
          <div className="text-2xl font-black text-[#07152B]">98%</div>
          <div className="text-xs text-gray-500 font-medium">Beveelt Taxi mooo aan</div>
        </div>
        <div className="h-8 w-px bg-blue-100 hidden sm:block"></div>
        <div className="space-y-1">
          <div className="text-2xl font-black text-[#0B2559]">100%</div>
          <div className="text-xs text-gray-500 font-medium">Vaste prijzen garantie</div>
        </div>
        <div className="h-8 w-px bg-blue-100 hidden sm:block"></div>
        <div className="space-y-1">
          <div className="text-2xl font-black text-[#07152B]">24/7</div>
          <div className="text-xs text-gray-500 font-medium">Klantenservice & Centrale</div>
        </div>
        <div className="h-8 w-px bg-blue-100 hidden sm:block"></div>
        <div className="space-y-1">
          <div className="text-2xl font-black text-[#0B2559]">TX-Keur</div>
          <div className="text-xs text-gray-500 font-medium">Gecertificeerde chauffeurs</div>
        </div>
      </div>
    </section>
  );
};
