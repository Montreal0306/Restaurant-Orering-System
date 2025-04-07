import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import useMenuStore from '../store/menuStore';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isTabletMode?: boolean;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ 
  isOpen, 
  onClose,
  onConfirm,
  isTabletMode = false 
}) => {
  const { cart } = useMenuStore();

  if (!isOpen) return null;

  return (
    <div className={`${isTabletMode ? 'absolute' : 'fixed'} inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center">
            <ShoppingBag className="w-6 h-6 mr-2 text-blue-600" />
            <h2 className="text-xl font-bold">Confirm Your Order</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
          <p className="text-xl mb-4 font-bold text-red-600">Have you checked the product and quantity of your order?</p>
          
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.menuItem.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.menuItem.name}</h3>
                  <div className="flex justify-between mt-1">
                    <p className="text-gray-600 text-sm">
                      ${item.menuItem.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.menuItem.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Total */}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-4 border-t flex justify-end space-x-4">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal; 