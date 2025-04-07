import React, { useState } from 'react';
import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import useMenuStore from '../store/menuStore';
import OrderConfirmationModal from './OrderConfirmationModal';
import OrderSuccessModal from './OrderSuccessModal';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTabletMode?: boolean;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, isTabletMode = false }) => {
  const { cart, updateQuantity, removeFromCart, placeOrder } = useMenuStore();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  
  const handleOrderClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmOrder = () => {
    setIsConfirmationOpen(false);
    setIsSuccessOpen(true);
    placeOrder();
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    onClose();
  };

  return (
    <>
      <div 
        className={`${isTabletMode ? 'absolute' : 'fixed'} top-0 right-0 bottom-16 w-[80%] sm:w-[50%] md:w-[40%] lg:w-[25%] bg-white shadow-xl z-40 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col border-l border-gray-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 sticky top-0 bg-white z-10">
          <div className="flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2 text-blue-600" />
            <h2 className="text-xl font-bold">Your Order</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <ShoppingCart className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-lg">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.menuItem.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex-1 pr-2">
                    <h3 className="font-medium">{item.menuItem.name}</h3>
                    <p className="text-gray-600">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      className="p-1.5 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.menuItem.id)}
                      className="p-1.5 rounded-full hover:bg-gray-100 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer with total and Order button */}
        {cart.items.length > 0 && (
          <div className="p-4 border-t bg-white sticky bottom-0">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleOrderClick}
              className="w-full py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Order
            </button>
          </div>
        )}
      </div>

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal 
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmOrder}
        isTabletMode={isTabletMode}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        isOpen={isSuccessOpen}
        onClose={handleSuccessClose}
        isTabletMode={isTabletMode}
      />
    </>
  );
};

export default CartModal; 