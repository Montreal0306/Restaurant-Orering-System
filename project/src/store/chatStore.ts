import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { ChatMessage, ChatState, DietaryPreferences } from '../types/chat';

interface ChatStore extends ChatState {
  addMessage: (content: string, type: 'user' | 'ai') => void;
  setTyping: (isTyping: boolean) => void;
  updateDietaryPreferences: (preferences: Partial<DietaryPreferences>) => void;
  clearChat: () => void;
}

const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isTyping: false,
  dietaryPreferences: {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    spicy: false,
  },
  addMessage: (content: string, type: 'user' | 'ai') =>
    set((state: ChatStore) => ({
      messages: [
        ...state.messages,
        {
          id: nanoid(),
          content,
          type,
          timestamp: new Date(),
        },
      ],
    })),
  setTyping: (isTyping: boolean) => set({ isTyping }),
  updateDietaryPreferences: (preferences: Partial<DietaryPreferences>) =>
    set((state: ChatStore) => ({
      dietaryPreferences: {
        ...state.dietaryPreferences,
        ...preferences,
      },
    })),
  clearChat: () =>
    set({
      messages: [],
      dietaryPreferences: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        spicy: false,
      },
    }),
}));

export default useChatStore;