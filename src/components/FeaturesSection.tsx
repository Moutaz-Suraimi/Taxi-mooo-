import React from 'react';
import { ShieldCheck, Zap, ThumbsUp, Headphones } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: (
        <div className="relative">
          <ShieldCheck className="w-8 h-8 text-[#00255c] stroke-[2.2]" />
        </div>
      ),
      title: 'Veilig & Betrouwbaar',
      description: 'Jouw veiligheid staat voorop',
    },
    {
      icon: (
        <div className="relative flex items-center justify-center">
          <Headphones className="w-8 h-8 text-[#00255c] stroke-[2.2]" />
          <span className="absolute text-[9px] font-black text-[#00255c] -bottom-0.5">24</span>
        </div>
      ),
      title: '24/7 Beschikbaar',
      description: 'Altijd een taxi, dag en nacht',
    },
    {
      icon: (
        <div className="relative">
          <Zap className="w-8 h-8 text-[#00255c] fill-[#00255c]" />
        </div>
      ),
      title: 'Snel & Eenvoudig',
      description: 'Boek in enkele klikken',
    },
    {
      icon: (
        <div className="relative">
          <ThumbsUp className="w-8 h-8 text-[#00255c] fill-[#00255c]" />
        </div>
      ),
      title: 'Beste Prijs',
      description: 'Kwaliteit tegen een eerlijke prijs',
    },
  ];

  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_12px_40px_rgba(0,19,49,0.06)] border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-slate-200">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center px-4 md:px-6 group cursor-default"
            >
              {/* Circular Icon with warm Taxi yellow/navy background */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFF8E7] group-hover:bg-[#FFEDB3] group-hover:scale-105 transition-all duration-300 flex items-center justify-center mb-4 sm:mb-5 shadow-sm shadow-yellow-500/10 border border-amber-100">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-[#001331] mb-1.5 tracking-tight group-hover:text-[#0B2559] transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base font-normal text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
