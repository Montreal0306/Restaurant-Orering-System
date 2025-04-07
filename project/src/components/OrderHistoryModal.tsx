import React, { useState, useEffect } from 'react';
import { X, Clock, ShoppingBag, CreditCard } from 'lucide-react';
import useMenuStore from '../store/menuStore';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose }) => {
  const { orderHistory } = useMenuStore();
  const [paymentRequested, setPaymentRequested] = useState(false);

  // Reset payment state when orderHistory changes (which happens during reset)
  useEffect(() => {
    if (orderHistory.orders.length === 0) {
      setPaymentRequested(false);
    }
  }, [orderHistory]);

  if (!isOpen) return null;

  // Format time only
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Consolidate all items from all orders
  const consolidatedItems = orderHistory.orders.reduce((acc, order) => {
    order.items.forEach(item => {
      const existingItem = acc.find(i => i.menuItem.id === item.menuItem.id);
      
      if (existingItem) {
        // Update existing item
        existingItem.quantity += item.quantity;
        existingItem.price += item.price;
        existingItem.times.push(formatTime(order.timestamp));
      } else {
        // Add new item with times array
        acc.push({
          ...item,
          times: [formatTime(order.timestamp)]
        });
      }
    });
    return acc;
  }, [] as Array<any>);

  // Calculate grand total
  const grandTotal = consolidatedItems.reduce((total, item) => total + item.price, 0);

  const handlePayRequest = () => {
    // In a real app, this would send a payment request to the server
    console.log('Payment requested for total: $' + grandTotal.toFixed(2));
    alert('Your payment request has been sent to the server');
    setPaymentRequested(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <div className="flex items-center">
            <Clock className="w-7 h-7 mr-3 text-blue-600" />
            <h2 className="text-2xl font-bold">Order History</h2>
          </div>
          <div className="flex items-center">
            {consolidatedItems.length > 0 && (
              <button 
                onClick={handlePayRequest}
                disabled={paymentRequested}
                className={`mr-4 flex items-center px-4 py-2 rounded-lg ${
                  paymentRequested 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {paymentRequested ? 'Payment Requested' : 'Pay'}
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
        </div>
        
        {/* Order Content */}
        <div className="flex-1 overflow-y-auto p-5 hide-scrollbar">
          {consolidatedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingBag className="w-16 h-16 mb-3 opacity-50" />
              <p className="text-xl">No order history yet</p>
            </div>
          ) : (
            <table className="w-full text-base">
              <thead className="border-b">
                <tr className="text-left text-gray-500">
                  <th className="pb-3 font-semibold">Item</th>
                  <th className="pb-3 text-center font-semibold">Qty</th>
                  <th className="pb-3 text-right font-semibold">Price</th>
                  <th className="pb-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {consolidatedItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4">
                      <div className="font-medium text-lg">{item.menuItem.name}</div>
                      <div className="text-sm text-gray-500">{item.times.join(', ')}</div>
                    </td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right">${item.menuItem.price.toFixed(2)}</td>
                    <td className="py-4 text-right">${item.price.toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="py-5 text-right font-bold text-lg">Order Total:</td>
                  <td className="py-5 text-right font-bold text-lg">${grandTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryModal; 