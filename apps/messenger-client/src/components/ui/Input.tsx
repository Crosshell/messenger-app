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
      <div className="w-full group">
        <div className="relative transition-all duration-200">
          {icon && (
            <div
              className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${iconColor}`}
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full pl-10 pr-4 py-3 
              border rounded-xl bg-white
              placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:border-transparent
              transition-all duration-200
              ${borderColor}
              ${className}
            `}
            {...props}
          />
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${error ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <p className="mt-1 text-xs text-red-500 pl-1 font-medium">{error}</p>
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';
