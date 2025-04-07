import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
  isTabletMode?: boolean;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  autoCloseDelay = 2000,
  isTabletMode = false
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseDelay]);

  if (!isOpen) return null;

  return (
    <div className={`${isTabletMode ? 'absolute' : 'fixed'} inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h2 className="text-2xl font-bold mb-2">Order Completed</h2>
        <p className="text-gray-600 mb-4">Your order has been placed successfully!</p>
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessModal; 