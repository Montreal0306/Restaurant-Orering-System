/**
 * OpenAI API Integration Service
 * Handles conversations with GPT-4o or other OpenAI models
 */

interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface MenuContext {
  restaurantName: string;
  description?: string;
  categories: string[];
  specialties?: string[];
  dietaryOptions?: string[];
}

class OpenAIService {
  private apiKey: string | null = null;
  private model: string = 'gpt-4o';
  private baseUrl = 'https://api.openai.com/v1';
  private history: ConversationMessage[] = [];
  private menuContext: MenuContext | null = null;
  
  /**
   * Initialize the service with API key and restaurant context
   */
  initialize(apiKey: string, menuContext: MenuContext): void {
    this.apiKey = apiKey;
    this.menuContext = menuContext;
    
    // Add system message with restaurant context
    this.setSystemPrompt();
  }
  
  /**
   * Set the system prompt with restaurant context
   */
  private setSystemPrompt(): void {
    if (!this.menuContext) return;
    
    const { restaurantName, description, categories, specialties, dietaryOptions } = this.menuContext;
    
    let systemPrompt = `You are an AI assistant for ${restaurantName}. `;
    
    if (description) {
      systemPrompt += `${description} `;
    }
    
    systemPrompt += `You help customers understand menu items, make recommendations based on preferences, `;
    systemPrompt += `and assist with the ordering process. Be friendly, helpful, and knowledgeable about food.\n\n`;
    
    systemPrompt += `The restaurant offers the following categories: ${categories.join(', ')}.\n`;
    
    if (specialties && specialties.length > 0) {
      systemPrompt += `The restaurant specializes in: ${specialties.join(', ')}.\n`;
    }
    
    if (dietaryOptions && dietaryOptions.length > 0) {
      systemPrompt += `The restaurant accommodates dietary preferences including: ${dietaryOptions.join(', ')}.\n`;
    }
    
    systemPrompt += `\nWhen making recommendations, ask clarifying questions about preferences, `;
    systemPrompt += `dietary restrictions, and flavor preferences. Explain ingredients that might be unfamiliar `;
    systemPrompt += `and mention any potential preference issues (like coriander, spice levels, etc.).`;
    
    // Add the system message as the first message in the conversation
    this.history = [{
      role: 'system',
      content: systemPrompt
    }];
  }
  
  /**
   * Send a message to OpenAI and get a response
   */
  async sendMessage(message: string): Promise<string> {
    if (!this.apiKey) {
      console.warn('OpenAI API key not provided. Using mock responses.');
      return this.getMockResponse(message);
    }
    
    // Add user message to history
    this.history.push({
      role: 'user',
      content: message
    });
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.history,
          temperature: 0.7,
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Add assistant response to history
      this.history.push({
        role: 'assistant',
        content: aiResponse
      });
      
      return aiResponse;
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
      return this.getMockResponse(message);
    }
  }
  
  /**
   * Get a mock response for development/testing
   */
  private getMockResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Simple pattern matching for demo purposes
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion')) {
      return "Based on our menu, I'd recommend trying our Signature Pasta with truffle sauce. It's one of our most popular dishes and features handmade pasta with seasonal ingredients. Would you like to know more about it or would you prefer something else?";
    }
    
    if (lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan')) {
      return "We have several excellent plant-based options. Our Mushroom Ravioli is a customer favorite, made with locally-sourced mushrooms and dairy-free cream sauce. We also have a wonderful Roasted Vegetable Platter with seasonal vegetables and house-made hummus.";
    }
    
    if (lowerMessage.includes('spicy') || lowerMessage.includes('spice')) {
      return "Our Spicy Seafood Pasta has a moderate heat level that most people enjoy. If you're sensitive to spice, I'd recommend our Classic Marinara instead. How spicy do you typically like your food?";
    }
    
    if (lowerMessage.includes('allerg') || lowerMessage.includes('gluten')) {
      return "I'm happy to help with allergen information. Many of our dishes can be modified to accommodate allergies. Our kitchen takes cross-contamination very seriously. Could you tell me which specific allergies you have so I can recommend appropriate options?";
    }
    
    // Default response
    return "I'd be happy to help you with your order! Our menu features a variety of dishes made with fresh, local ingredients. Would you like me to recommend something based on your preferences, or do you have any questions about specific menu items?";
  }
  
  /**
   * Clear the conversation history but keep the system prompt
   */
  clearHistory(): void {
    const systemMessage = this.history.length > 0 && this.history[0].role === 'system' 
      ? this.history[0] 
      : null;
      
    this.history = systemMessage ? [systemMessage] : [];
  }
}

// Create a singleton instance
export const openAIService = new OpenAIService();

export default OpenAIService; 