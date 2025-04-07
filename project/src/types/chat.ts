export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface DietaryPreferences {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  spicy: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  dietaryPreferences: DietaryPreferences;
  isTyping: boolean;
}