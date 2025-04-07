import React from 'react';
import useMenuStore from '../store/menuStore';
import { Category, Subcategory } from '../types/menu';

const CategoryFilter: React.FC = () => {
  const { 
    categories, 
    selectedCategory, 
    selectedSubcategory,
    setSelectedCategory, 
    setSelectedSubcategory 
  } = useMenuStore();

  // Get subcategories for the currently selected category
  const activeSubcategories = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory)?.subcategories || []
    : [];

  return (
    <div className="sticky top-16 z-30 pt-3 pb-4 bg-gray-50">
      {/* Main categories */}
      <div className="flex overflow-x-auto gap-3 mb-4 pb-2 hide-scrollbar">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
          }}
          className={`px-6 py-3 rounded-xl text-lg font-semibold transition-colors flex-shrink-0 ${
            !selectedCategory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((category: Category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setSelectedSubcategory(null);
            }}
            className={`px-6 py-3 rounded-xl text-lg font-semibold transition-colors flex-shrink-0 ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
            }`}
          >
            {category.displayName}
          </button>
        ))}
      </div>
      
      {/* Subcategories - only show if a category is selected */}
      {selectedCategory && activeSubcategories.length > 0 && (
        <div className="flex overflow-x-auto gap-2 hide-scrollbar pb-2">
          <button
            onClick={() => setSelectedSubcategory(null)}
            className={`px-4 py-2 rounded-lg text-md font-medium transition-colors flex-shrink-0 ${
              !selectedSubcategory
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All {categories.find(cat => cat.id === selectedCategory)?.displayName}
          </button>
          
          {activeSubcategories.map((subcategory: Subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => setSelectedSubcategory(subcategory.id)}
              className={`px-4 py-2 rounded-lg text-md font-medium transition-colors flex-shrink-0 ${
                selectedSubcategory === subcategory.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {subcategory.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;