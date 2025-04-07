import React, { useState } from 'react';
import useMenuStore from '../store/menuStore';
import { MenuItem } from '../types/menu';
import CategoryFilter from './CategoryFilter';
import Modal from './Modal';

interface MenuGridProps {
  cartIsOpen?: boolean;
}

const MenuGrid: React.FC<MenuGridProps> = ({ cartIsOpen = false }) => {
  const { filteredMenu, addToCart } = useMenuStore();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
  };

  return (
    <div>
      <CategoryFilter />
      <div className={`grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 grid-flow-row mt-4
        ${cartIsOpen ? 'lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1' : ''}`}>
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 active:scale-95 touch-manipulation"
          >
            <div className="relative pb-[65%]">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 truncate">
                {item.name}
              </h3>
              <p className="text-blue-600 text-base sm:text-lg font-bold">
                ${item.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {selectedItem && (
        <Modal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default MenuGrid;