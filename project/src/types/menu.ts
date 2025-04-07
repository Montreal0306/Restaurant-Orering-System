export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  imageUrl: string;
  ingredients: string[];
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    spicy: boolean;
  };
}

export interface Subcategory {
  id: string;
  name: string;
  displayName: string;
  parentCategoryId: string;
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
  subcategories: Subcategory[];
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface OrderHistory {
  orders: Order[];
}