import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className, error, ...props }, ref) => {
    const borderColor = error
      ? 'border-red-500 focus:ring-red-500 text-red-600'
      : 'border-gray-200 focus:ring-purple-500 text-gray-700';

    const iconColor = error ? 'text-red-400' : 'text-gray-400';

    return (
      <div className="group w-full">
        <div className="relative transition-all duration-200">
          {icon && (
            <div
              className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 transition-colors duration-200 ${iconColor}`}
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-xl border bg-white py-3 pr-4 pl-10 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none ${borderColor} ${className} `}
            {...props}
          />
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${error ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <p className="mt-1 pl-1 text-xs font-medium text-red-500">{error}</p>
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';
