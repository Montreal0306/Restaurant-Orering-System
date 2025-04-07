import React, { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { MenuItem } from '../types/menu';

interface ModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem) => void;
}

const Modal: React.FC<ModalProps> = ({ item, isOpen, onClose, onAddToCart }) => {
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  
  if (!isOpen) return null;

  const handleAddToCart = () => {
    onAddToCart(item);
    onClose();
  };

  const toggleIngredients = () => {
    setIngredientsOpen(!ingredientsOpen);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 z-10"
        >
          <X className="w-8 h-8" />
        </button>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-[300px] sm:h-[400px] object-cover"
            />
          </div>
          
          <div className="p-6 sm:p-8 md:w-1/2">
            <h2 className="text-3xl font-bold mb-3">{item.name}</h2>
            <p className="text-2xl font-semibold text-blue-600 mb-4">
              ${item.price.toFixed(2)}
            </p>
            
            <div className="max-h-[160px] overflow-y-auto scrollbar-hide mb-6">
              <p className="text-gray-600 text-lg pr-2">{item.description}</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <button
                  onClick={toggleIngredients}
                  className="w-full py-3 text-center font-semibold text-xl border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Ingredients
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  ingredientsOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                }`}>
                  <ul className="list-disc list-inside text-gray-600 text-lg pl-2">
                    {item.ingredients.map((ingredient, index) => (
                      <li key={index} className="mb-1">{ingredient}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {item.dietary.vegetarian && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 text-base rounded-full">
                    Vegetarian
                  </span>
                )}
                {item.dietary.vegan && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 text-base rounded-full">
                    Vegan
                  </span>
                )}
                {item.dietary.glutenFree && (
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-800 text-base rounded-full">
                    Gluten Free
                  </span>
                )}
                {item.dietary.spicy && (
                  <span className="px-4 py-2 bg-red-100 text-red-800 text-base rounded-full">
                    Spicy
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl text-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center space-x-3"
              >
                <ShoppingCart className="w-6 h-6" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;