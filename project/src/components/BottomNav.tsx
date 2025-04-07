import React, { useState } from 'react';
import { Bell, Clock, ShoppingCart } from 'lucide-react';
import useMenuStore from '../store/menuStore';
import ServerRequestModal from './ServerRequestModal';
import OrderHistoryModal from './OrderHistoryModal';

interface BottomNavProps {
  cartIsOpen: boolean;
  onCartToggle: (isOpen: boolean) => void;
  isTabletMode?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ cartIsOpen, onCartToggle, isTabletMode = false }) => {
  const { cart, orderHistory } = useMenuStore();
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  // Calculate the total number of items in order history
  const totalOrderedItems = orderHistory.orders.reduce((total, order) => {
    return total + order.items.reduce((subtotal, item) => subtotal + item.quantity, 0);
  }, 0);

  const handleServerClick = () => {
    setIsServerModalOpen(true);
  };

  const handleHistoryClick = () => {
    setIsOrderHistoryOpen(true);
  };

  const handleCartClick = () => {
    onCartToggle(!cartIsOpen);
  };

  return (
    <>
      <div className={`${isTabletMode ? '' : 'fixed bottom-0 left-0 right-0'} bg-white shadow-lg border-t flex justify-around p-3 z-40`}>
        <button
          onClick={handleServerClick}
          className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Bell className="w-6 h-6" />
          <span className="text-xs mt-1">Call Server</span>
        </button>
        <button 
          onClick={handleHistoryClick}
          className={`flex flex-col items-center transition-colors relative
            ${isOrderHistoryOpen ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
        >
          <Clock className="w-6 h-6" />
          {totalOrderedItems > 0 && (
            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalOrderedItems}
            </div>
          )}
          <span className="text-xs mt-1">Order History</span>
        </button>
        <button
          onClick={handleCartClick}
          className={`flex flex-col items-center transition-colors relative
            ${cartIsOpen ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
        >
          <ShoppingCart className="w-6 h-6" />
          {cart.items.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.items.reduce((total, item) => total + item.quantity, 0)}
            </div>
          )}
          <span className="text-xs mt-1">Cart</span>
        </button>
      </div>

      <ServerRequestModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
      />

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
      />
    </>
  );
};

export default BottomNav; 