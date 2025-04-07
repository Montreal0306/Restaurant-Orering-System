import React from 'react';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import useMenuStore from '../store/menuStore';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart } = useMenuStore();

  return (
    <div id="cart" className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <ShoppingCart className="w-6 h-6 mr-2" />
        <h2 className="text-xl font-semibold">Your Order</h2>
      </div>
      
      {cart.items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.menuItem.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.menuItem.name}</h3>
                  <p className="text-gray-600">
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.menuItem.id)}
                    className="p-1 rounded-full hover:bg-gray-100 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;