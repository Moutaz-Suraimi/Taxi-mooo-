import React from 'react';
import logoImg from '../assets/logo.jpg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const heightClass =
    size === 'sm'
      ? 'h-9 sm:h-10'
      : size === 'md'
      ? 'h-12 sm:h-14'
      : size === 'lg'
      ? 'h-16 sm:h-20'
      : 'h-20 sm:h-24';

  return (
    <div className={`flex items-center select-none cursor-pointer group ${className}`}>
      <img
        src={logoImg}
        alt="Taxi Moo"
        className={`${heightClass} w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md rounded-xl`}
      />
    </div>
  );
};
