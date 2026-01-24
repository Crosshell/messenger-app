import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, className, ...props }: Props) => {
  return (
    <button
      className={`
        relative w-full py-3 px-4 overflow-hidden
        bg-linear-to-r from-[#4facfe] to-[#6019e3] 
        text-white font-bold tracking-wide rounded-full 
        shadow-lg shadow-blue-500/30 
        transition-all duration-300 ease-out
        hover:scale-105
        hover:-translate-y-1
        hover:shadow-2xl
        hover:shadow-blue-500/50
        hover:brightness-110
        hover:ring-4 hover:ring-blue-400/20
        active:scale-95
        active:translate-y-0
        active:shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};
