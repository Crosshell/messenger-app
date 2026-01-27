import React from 'react';

type ButtonVariant = 'primary' | 'outline';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

export const Button = ({
  children,
  className,
  variant = 'primary',
  ...props
}: Props) => {
  const baseStyles = `relative w-full py-3 px-4 overflow-hidden
    font-bold tracking-wide rounded-full
    transition-all duration-300 ease-out
    active:scale-95 active:translate-y-0
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`;

  const variants = {
    primary: `
      bg-linear-to-r from-[#4facfe] to-[#6019e3] 
      text-white 
      shadow-lg shadow-blue-500/30 
      hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/50 hover:brightness-110 hover:ring-4 hover:ring-blue-400/20 
      active:shadow-md
    `,
    outline: `
      bg-transparent 
      border-2 border-[#6019e3] 
      text-[#6019e3] 
      hover:bg-[#6019e3]/10 hover:scale-105
    `,
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]} 
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};
