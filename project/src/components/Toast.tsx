import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
  type?: 'success' | 'remove';
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onHide, type = 'success' }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 2300);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div 
        className={`${bgColor} text-white
          px-4 py-3 xs:px-5 xs:py-3.5 sm:px-6 sm:py-4 md:px-7 md:py-5
          rounded-lg xs:rounded-xl
          shadow-xl 
          flex items-center space-x-2 xs:space-x-3 
          animate-fade-in
          w-auto
          min-w-[200px] xs:min-w-[250px] sm:min-w-[300px]
          max-w-[85vw] xs:max-w-[80vw] sm:max-w-[70vw] md:max-w-[60vw] lg:max-w-[500px]
          scale-90 xs:scale-95 sm:scale-100 md:scale-105 lg:scale-110
          mx-auto transition-all duration-200`}
      >
        <Icon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0" />
        <p className="text-sm xs:text-base sm:text-lg md:text-xl font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Toast