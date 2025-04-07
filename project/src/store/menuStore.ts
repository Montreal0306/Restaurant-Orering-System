import { create } from 'zustand';
import type { MenuItem, Category, Cart, CartItem, Subcategory, OrderHistory, Order } from '../types/menu';

export interface MenuState {
  menu: MenuItem[];
  categories: Category[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  cart: Cart;
  previousCartLength: number;
  orderHistory: OrderHistory;
  filteredMenu: MenuItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: () => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedSubcategory: (subcategoryId: string | null) => void;
  resetStore: () => void;
}

const restaurantMenu: MenuItem[] = [
  // New Korean Special
  {
    id: 'kor1',
    name: 'Tteokbokki',
    description: 'Tteokbokki (떡볶이) is a beloved Korean street food dish made with soft and chewy rice cakes (tteok) cooked in a spicy, sweet, and savory red chili sauce. The cylindrical rice cakes are simmered with fish cakes (oden), boiled eggs, and scallions until they absorb the rich flavors of the gochujang-based sauce. Our traditional recipe has been perfected over generations, ensuring an authentic taste that balances heat with subtle sweetness. Each bite offers a satisfying chewiness complemented by the complex, umami-rich sauce. This iconic comfort food is particularly popular during cold weather, but is enjoyed year-round by Koreans of all ages. Our version comes garnished with sesame seeds, chopped green onions, and thin strips of dried seaweed to enhance both the presentation and flavor profile. The dish originates from the royal courts of the Joseon Dynasty but evolved into a beloved street food during the 1950s post-war era when rice was scarce. Today, it represents the perfect harmony of traditional Korean flavors adapted for modern palates.',
    price: 16.50,
    category: 'entrees',
    subcategory: 'asian',
    imageUrl: 'https://thekoreanvegan.com/wp-content/uploads/2024/04/Main-shot-of-spicy-vegan-tteokbokki-with-tempura-add-on-scaled.jpg',
    ingredients: ['rice cakes', 'gochujang (red chili paste)', 'fish cakes', 'green onions', 'boiled eggs', 'soy sauce', 'sugar', 'sesame seeds'],
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      spicy: true
    }
  },
  // Appetizers
  {
    id: 'app1',
    name: 'Seared Scallops',
    description: 'Fresh diver scallops, perfectly seared and served with lemon-butter sauce.',
    price: 12.00,
    category: 'appetizers',
    subcategory: 'hot',
    imageUrl: 'https://foodmymuse.com/wp-content/uploads/2024/03/ScallopMeuniere-1024x1536.jpg',
    ingredients: ['scallops', 'butter', 'lemon'],
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      spicy: false
    }
  },
  {
    id: 'app2',
    name: 'Pale Shrimp',
    description: 'Pan-seared pale gray with a spicy sauce reduction.',
    price: 8.50,
    category: 'appetizers',
    subcategory: 'hot',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    ingredients: ['shrimp', 'spices', 'sauce'],
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      spicy: true
    }
  },
  {
    id: 'app3',
    name: 'Crab Cakes',
    description: 'Lump crab meat cakes served with a spicy remoulade.',
    price: 12.00,
    category: 'appetizers',
    subcategory: 'hot',
    imageUrl: 'https://nashvillelifestyles.com/downloads/45750/download/Chesapeake%20Crab%20Cake%202.jpg?cb=45dd6aae0babf919b96fed5f02184c51&w=2581&h=',
    ingredients: ['crab meat', 'breadcrumbs', 'spices', 'remoulade'],
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      spicy: true
    }
  },
  {
    id: 'app4',
    name: 'Burrata Salad',
    description: 'Creamy burrata cheese with heirloom tomatoes and basil.',
    price: 8.50,
    category: 'appetizers',
    subcategory: 'cold',
    imageUrl: 'http://www.peeushchawla.com/wp-content/uploads/2017/05/post1.jpg',
    ingredients: ['burrata cheese', 'tomatoes', 'basil', 'olive oil'],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      spicy: false
    }
  },

  // Salads
  {
    id: 'sal1',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, anchovies, Parmesan, and house-made dressing.',
    price: 12.00,
    category: 'salads',
    subcategory: 'classic',
    imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
    ingredients: ['romaine lettuce', 'anchovies', 'parmesan', 'croutons', 'caesar dressing'],
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      spicy: false
    }
  },
  {
    id: 'sal2',
    name: 'Beet & Goat Cheese',
    description: 'Roasted beets, goat cheese, and candied pecans.',
    price: 9.50,
    category: 'salads',
    subcategory: 'specialty',
    imageUrl: 'https://www.feastingathome.com/wp-content/uploads/2013/12/beet-bruschetta-w_-goat-chese-115.jpg',
    ingredients: ['beets', 'goat cheese', 'pecans', 'mixed greens'],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      spicy: false
    }
  },
  {
    id: 'sal3',
    name: 'Caesar Salad (Side)',
    description: 'Side romaine lettuce, croutons, Parmesan.',
    price: 12.00,
    category: 'salads',
    subcategory: 'side',
    imageUrl: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80',
    ingredients: ['romaine lettuce', 'croutons', 'parmesan', 'caesar dressing'],
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      spicy: false
    }
  },
  {
    id: 'sal4',
    name: 'Italian Garden Salad',
    description: 'Fresh tomato, cucumbers and mixed greens.',
    price: 8.50,
    category: 'salads',
    subcategory: 'side',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    ingredients: ['tomatoes', 'cucumbers', 'mixed greens', 'italian dressing'],
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      spicy: false
    }
  },

  // Entrées
  {
    id: 'ent1',
    name: 'Filet Mignon (8 oz)',
    description: 'Tender filet mignon grilled to perfection, served with truffle.',
    price: 32.00,
    category: 'entrees',
    subcategory: 'beef',
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    ingredients: ['beef tenderloin', 'truffle', 'butter', 'herbs'],
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      spicy: false
    }
  },
  {
    id: 'ent2',
    name: 'Rack of Lamb',
    description: 'Herb-crusted lamb rack served with seasonal vegetables.',
    price: 29.50,
    category: 'entrees',
    subcategory: 'lamb',
    imageUrl: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=800&q=80',
    ingredients: ['lamb rack', 'herbs', 'vegetables'],
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      spicy: false
    }
  },
  {
    id: 'ent3',
    name: 'Pan-Seared Duck Breast',
    description: 'Duck breast served with wild rice and a cherry.',
    price: 32.00,
    category: 'entrees',
    subcategory: 'poultry',
    imageUrl: 'https://images.unsplash.com/photo-1580554530778-ca36943938b2?auto=format&fit=crop&w=800&q=80',
    ingredients: ['duck breast', 'wild rice', 'cherry reduction'],
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      spicy: false
    }
  },
  {
    id: 'ent4',
    name: 'Grilled Atlantic Salmon',
    description: 'Fresh salmon fillet, served with lemon butter sauce.',
    price: 28.50,
    category: 'entrees',
    subcategory: 'seafood',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    ingredients: ['salmon', 'butter', 'lemon', 'herbs'],
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      spicy: false
    }
  },

  // Pasta
  {
    id: 'pas1',
    name: 'Truffle Fettuccine',
    description: 'Homemade fettuccine pasta in rich truffle cream sauce.',
    price: 22.50,
    category: 'pasta',
    subcategory: 'cream',
    imageUrl: 'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?auto=format&fit=crop&w=800&q=80',
    ingredients: ['fettuccine', 'truffle', 'cream', 'parmesan'],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      spicy: false
    }
  },
  {
    id: 'pas2',
    name: 'Seafood Linguine',
    description: 'Linguine pasta with shrimp, scallops, and mussels in a garlic.',
    price: 25.50,
    category: 'pasta',
    subcategory: 'seafood',
    imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80',
    ingredients: ['linguine', 'shrimp', 'scallops', 'mussels', 'garlic'],
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      spicy: false
    }
  },
  {
    id: 'pas3',
    name: 'Mushroom Ravioli',
    description: 'House-made pasta filled with wild mushrooms.',
    price: 22.00,
    category: 'pasta',
    subcategory: 'filled',
    imageUrl: 'https://images.unsplash.com/photo-1587740908075-9e245070dfaa?auto=format&fit=crop&w=800&q=80',
    ingredients: ['pasta', 'mushrooms', 'parmesan', 'herbs'],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      spicy: false
    }
  },
  {
    id: 'pas4',
    name: 'Lasagna',
    description: 'Layers of pasta, meat sauce, ricotta and mozzarella.',
    price: 19.50,
    category: 'pasta',
    subcategory: 'baked',
    imageUrl: 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=800&q=80',
    ingredients: ['pasta', 'beef', 'tomato sauce', 'ricotta', 'mozzarella'],
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      spicy: false
    }
  },
  {
    id: 'pas5',
    name: 'Penne Arrabbiata',
    description: 'Warm penne pasta with a spicy tomato sauce.',
    price: 15.50,
    category: 'pasta',
    subcategory: 'tomato',
    imageUrl: 'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?auto=format&fit=crop&w=800&q=80',
    ingredients: ['penne', 'tomato sauce', 'chili', 'garlic'],
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: false,
      spicy: true
    }
  },

  // Beverages
  {
    id: 'bev1',
    name: 'Sparkling Water',
    description: 'Chilled sparkling water served with lemon.',
    price: 3.50,
    category: 'beverages',
    subcategory: 'non-alcoholic',
    imageUrl: 'https://shoptoronto.eataly.ca/cdn/shop/products/wfv07YX_e1a3cfb0-433d-4802-bd44-93d2c80a544c_1000x.jpg?v=1625672423',
    ingredients: ['sparkling water', 'lemon'],
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      spicy: false
    }
  },
  {
    id: 'bev2',
    name: 'Cappuccino',
    description: 'A perfect blend of espresso and steamed milk, topped with foam.',
    price: 5.50,
    category: 'beverages',
    subcategory: 'hot',
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
    ingredients: ['espresso', 'milk', 'foam'],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      spicy: false
    }
  },
  {
    id: 'bev3',
    name: 'Hot Tea',
    description: 'A selection of fine teas, including Earl Grey, green tea.',
    price: 4.00,
    category: 'beverages',
    subcategory: 'hot',
    imageUrl: 'https://cdn-prod.medicalnewstoday.com/content/images/articles/324/324771/close-up-of-a-cup-of-tea.jpg',
    ingredients: ['tea leaves'],
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      spicy: false
    }
  },
  {
    id: 'bev4',
    name: 'Lemonade',
    description: 'Freshly made lemonade with a hint of mint leaves.',
    price: 4.00,
    category: 'beverages',
    subcategory: 'cold',
    imageUrl: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?auto=format&fit=crop&w=800&q=80',
    ingredients: ['lemon', 'sugar', 'water', 'mint'],
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      spicy: false
    }
  },
  {
    id: 'bev5',
    name: 'Iced Tea',
    description: 'Freshly brewed iced tea, available sweetened or unsweetened.',
    price: 3.00,
    category: 'beverages',
    subcategory: 'cold',
    imageUrl: 'https://www.supergoldenbakes.com/wordpress/wp-content/uploads/2019/07/Long_island_iced_tea-1-4s.jpg',
    ingredients: ['tea', 'water', 'ice', 'optional: sugar'],
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      spicy: false
    }
  }
];

// Helper function to sort menu items by category order
const sortMenuItemsByCategory = (items: MenuItem[], categories: Category[]): MenuItem[] => {
  // Create a map of category ID to its index for sorting
  const categoryOrder = new Map<string, number>();
  categories.forEach((category, index) => {
    categoryOrder.set(category.id, index);
  });

  // Return sorted items
  return [...items].sort((a, b) => {
    const orderA = categoryOrder.get(a.category) ?? 999;
    const orderB = categoryOrder.get(b.category) ?? 999;
    return orderA - orderB;
  });
};

// Define initial state for easy reset
const initialOrderHistory: OrderHistory = {
  orders: []
};

const initialCart: Cart = {
  items: [],
  total: 0
};

const useMenuStore = create<MenuState>((set, get) => ({
  menu: restaurantMenu,
  categories: [
    { 
      id: 'appetizers', 
      name: 'appetizers', 
      displayName: 'Appetizers',
      subcategories: [
        { id: 'hot', name: 'hot', displayName: 'Hot Appetizers', parentCategoryId: 'appetizers' },
        { id: 'cold', name: 'cold', displayName: 'Cold Appetizers', parentCategoryId: 'appetizers' }
      ] 
    },
    { 
      id: 'salads', 
      name: 'salads', 
      displayName: 'Salads',
      subcategories: [
        { id: 'classic', name: 'classic', displayName: 'Classic Salads', parentCategoryId: 'salads' },
        { id: 'specialty', name: 'specialty', displayName: 'Specialty Salads', parentCategoryId: 'salads' },
        { id: 'side', name: 'side', displayName: 'Side Salads', parentCategoryId: 'salads' }
      ] 
    },
    { 
      id: 'entrees', 
      name: 'entrees', 
      displayName: 'Entrées',
      subcategories: [
        { id: 'beef', name: 'beef', displayName: 'Beef', parentCategoryId: 'entrees' },
        { id: 'lamb', name: 'lamb', displayName: 'Lamb', parentCategoryId: 'entrees' },
        { id: 'poultry', name: 'poultry', displayName: 'Poultry', parentCategoryId: 'entrees' },
        { id: 'seafood', name: 'seafood', displayName: 'Seafood', parentCategoryId: 'entrees' },
        { id: 'asian', name: 'asian', displayName: 'Asian Specialties', parentCategoryId: 'entrees' }
      ] 
    },
    { 
      id: 'pasta', 
      name: 'pasta', 
      displayName: 'Pasta',
      subcategories: [
        { id: 'cream', name: 'cream', displayName: 'Cream Sauce', parentCategoryId: 'pasta' },
        { id: 'seafood', name: 'seafood', displayName: 'Seafood Pasta', parentCategoryId: 'pasta' },
        { id: 'filled', name: 'filled', displayName: 'Filled Pasta', parentCategoryId: 'pasta' },
        { id: 'baked', name: 'baked', displayName: 'Baked Pasta', parentCategoryId: 'pasta' },
        { id: 'tomato', name: 'tomato', displayName: 'Tomato Sauce', parentCategoryId: 'pasta' }
      ] 
    },
    { 
      id: 'beverages', 
      name: 'beverages', 
      displayName: 'Beverages',
      subcategories: [
        { id: 'non-alcoholic', name: 'non-alcoholic', displayName: 'Non-Alcoholic', parentCategoryId: 'beverages' },
        { id: 'hot', name: 'hot', displayName: 'Hot Drinks', parentCategoryId: 'beverages' },
        { id: 'cold', name: 'cold', displayName: 'Cold Drinks', parentCategoryId: 'beverages' }
      ] 
    }
  ],
  selectedCategory: null,
  selectedSubcategory: null,
  cart: initialCart,
  previousCartLength: 0,
  orderHistory: initialOrderHistory,
  // Initialize filtered menu with sorted items by category
  filteredMenu: sortMenuItemsByCategory(restaurantMenu, [
    { id: 'appetizers', name: 'appetizers', displayName: 'Appetizers', subcategories: [] },
    { id: 'salads', name: 'salads', displayName: 'Salads', subcategories: [] },
    { id: 'entrees', name: 'entrees', displayName: 'Entrées', subcategories: [] },
    { id: 'pasta', name: 'pasta', displayName: 'Pasta', subcategories: [] },
    { id: 'beverages', name: 'beverages', displayName: 'Beverages', subcategories: [] }
  ]),
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.items.find(
        (cartItem) => cartItem.menuItem.id === item.id
      );

      if (existingItem) {
        return {
          cart: {
            items: state.cart.items.map((cartItem) =>
              cartItem.menuItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
            total: state.cart.total + item.price,
          },
          previousCartLength: state.cart.items.length,
        };
      }

      return {
        cart: {
          items: [...state.cart.items, { menuItem: item, quantity: 1 }],
          total: state.cart.total + item.price,
        },
        previousCartLength: state.cart.items.length,
      };
    }),
  removeFromCart: (itemId) =>
    set((state) => {
      const item = state.cart.items.find(
        (cartItem) => cartItem.menuItem.id === itemId
      );
      if (!item) return state;

      return {
        cart: {
          items: state.cart.items.filter(
            (cartItem) => cartItem.menuItem.id !== itemId
          ),
          total: state.cart.total - item.menuItem.price * item.quantity,
        },
        previousCartLength: state.cart.items.length,
      };
    }),
  updateQuantity: (itemId, quantity) =>
    set((state) => {
      const item = state.cart.items.find(
        (cartItem) => cartItem.menuItem.id === itemId
      );
      if (!item) return state;

      const oldTotal = item.menuItem.price * item.quantity;
      const newTotal = item.menuItem.price * quantity;

      if (quantity === 0) {
        return {
          cart: {
            items: state.cart.items.filter(
              (cartItem) => cartItem.menuItem.id !== itemId
            ),
            total: state.cart.total - oldTotal,
          },
          previousCartLength: state.cart.items.length,
        };
      }

      return {
        cart: {
          items: state.cart.items.map((cartItem) =>
            cartItem.menuItem.id === itemId
              ? { ...cartItem, quantity }
              : cartItem
          ),
          total: state.cart.total - oldTotal + newTotal,
        },
        previousCartLength: state.cart.items.length,
      };
    }),
  clearCart: () =>
    set({
      cart: {
        items: [],
        total: 0,
      },
      previousCartLength: 0,
    }),
  placeOrder: () =>
    set((state) => {
      const order: Order = {
        id: Date.now().toString(),
        items: state.cart.items.map((cartItem) => ({
          menuItem: cartItem.menuItem,
          quantity: cartItem.quantity,
          price: cartItem.menuItem.price * cartItem.quantity
        })),
        total: state.cart.total,
        timestamp: new Date(),
        status: 'pending'
      };

      return {
        cart: {
          items: [],
          total: 0,
        },
        previousCartLength: 0,
        orderHistory: {
          orders: [...state.orderHistory.orders, order]
        },
      };
    }),
  setSelectedCategory: (categoryId) =>
    set((state) => {
      // If we're selecting a category, filter by it
      if (categoryId) {
        const filteredByCategory = state.menu.filter((item) => item.category === categoryId);
        return {
          selectedCategory: categoryId,
          selectedSubcategory: null,
          filteredMenu: filteredByCategory
        };
      } 
      // If we're clearing the category (showing "All"), sort items by category order
      else {
        return {
          selectedCategory: null,
          selectedSubcategory: null,
          filteredMenu: sortMenuItemsByCategory(state.menu, state.categories)
        };
      }
    }),
  setSelectedSubcategory: (subcategoryId) =>
    set((state) => {
      const { selectedCategory } = state;
      
      // If we have both category and subcategory selected
      if (selectedCategory && subcategoryId) {
        return {
          selectedSubcategory: subcategoryId,
          filteredMenu: state.menu.filter(
            (item) => 
              item.category === selectedCategory && 
              item.subcategory === subcategoryId
          )
        };
      }
      
      // If we have only subcategory selected (across all categories)
      if (subcategoryId) {
        return {
          selectedSubcategory: subcategoryId,
          filteredMenu: state.menu.filter((item) => item.subcategory === subcategoryId)
        };
      }
      
      // If subcategory is cleared but category is still selected
      if (selectedCategory) {
        return {
          selectedSubcategory: null,
          filteredMenu: state.menu.filter((item) => item.category === selectedCategory)
        };
      }
      
      // If both category and subcategory are cleared
      return {
        selectedSubcategory: null,
        filteredMenu: sortMenuItemsByCategory(state.menu, state.categories)
      };
    }),
  // Add reset function to restore initial state
  resetStore: () => {
    // Reset menu store state
    set({
      cart: initialCart,
      orderHistory: initialOrderHistory,
      selectedCategory: null,
      selectedSubcategory: null,
      previousCartLength: 0,
      // Keep the menu and categories as they don't need to be reset
    });
  }
}));

export default useMenuStore;