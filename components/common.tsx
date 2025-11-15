import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg w-full max-w-md transition-all duration-300 ${className}`}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'floating';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = 'w-full px-6 font-bold text-lg transition-transform transform active:scale-95 focus:outline-none focus:ring-4';
  const variantClasses = {
    primary: 'bg-[#FF3B30] text-white shadow-md hover:shadow-lg focus:ring-red-300 rounded-xl py-3.5',
    secondary: 'bg-white text-purple-600 border-2 border-purple-200 hover:bg-purple-50 focus:ring-purple-200 rounded-full py-3',
    floating: 'bg-white/90 text-purple-600 rounded-full shadow-lg hover:shadow-xl w-16 h-16 flex items-center justify-center',
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon, ...props }) => (
  <div className="relative mb-4">
    <label className="block text-gray-600 text-sm font-semibold mb-2">{label}</label>
    <div className="relative">
      {icon && <i className={`${icon} absolute left-4 top-1/2 -translate-y-1/2 text-gray-400`}></i>}
      <input
        className={`w-full p-3 ${icon ? 'pl-12' : ''} bg-white text-black placeholder-gray-500 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-base`}
        {...props}
      />
    </div>
  </div>
);

export const Spinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
    </div>
);