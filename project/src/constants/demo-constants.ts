export const DEMO_MESSAGES = {
  WELCOME_MESSAGE: `🤖 Chatbot Demo Notice

Hi! I'm the Valsoft Restaurant AI Chatbot (Demo Preview).

⚠️ This is a preview version. The chatbot is not yet implemented.

When Fully Implemented, I Will Help With:
• Browsing our menu and prices
• Finding dishes that match your dietary needs
• Providing dish recommendations
• Answering questions about ingredients
• Helping with order customization

Current State:
• Demo preview only
• Responses not yet implemented
• Static interface demonstration

Coming Soon:
• Full GPT-4 powered conversations
• Smart menu recommendations
• Dietary preference handling
• Order customization assistance
• Real-time response generation

For now, you can browse our menu manually while we prepare the full AI experience! 🍽️

---
Demo Preview - Chatbot implementation coming soon`,

  FEATURE_EXPLANATIONS: {
    PLANNED_FEATURES: {
      MENU_BROWSE: "Browse and search through our complete menu",
      DIETARY_HELP: "Find dishes matching your dietary preferences",
      RECOMMENDATIONS: "Get personalized dish suggestions",
      ORDER_HELP: "Assistance with order customization",
      INGREDIENT_INFO: "Detailed information about ingredients and allergens"
    },
    CURRENT_STATE: {
      DEMO_ONLY: "This is a preview of the interface only",
      NO_RESPONSES: "Chatbot responses are not yet implemented",
      MANUAL_BROWSE: "Please browse the menu manually for now"
    }
  },

  ERROR_MESSAGES: {
    NOT_IMPLEMENTED: "The chatbot is not yet implemented. This is a preview version.",
    STATIC_DEMO: "This is currently a static demo. Chatbot coming soon!",
    MANUAL_BROWSE: "Please browse our menu manually while we complete the chatbot implementation.",
    GENERAL_ERROR: "The chatbot is in preview mode and cannot process requests yet."
  }
};

export const DEMO_CONFIG = {
  FEATURES: {
    CHATBOT_IMPLEMENTED: false,
    SHOW_PREVIEW: true,
    MENU_BROWSE: true,
    RESPONSES_ACTIVE: false
  },
  UI: {
    SHOW_DEMO_NOTICE: true,
    SHOW_PREVIEW_STATE: true,
    SHOW_COMING_SOON: true
  },
  VERSION: {
    NUMBER: '0.1.0',
    PHASE: 'preview',
    LAST_UPDATED: '2024-03'
  }
};

export const DEMO_STATES = {
  CURRENT: 'PREVIEW_ONLY',
  IMPLEMENTATION_STATUS: 'NOT_IMPLEMENTED',
  RESPONSE_TYPE: 'STATIC_MESSAGE'
};

export const PREVIEW_RESPONSES = {
  DEFAULT: "This is a preview version. The chatbot is not yet implemented.",
  MENU_QUERY: "The chatbot will be able to help with menu information soon.",
  GENERAL: "Thanks for trying our demo! The chatbot is coming soon.",
  FALLBACK: "This is a preview only. Please browse our menu manually for now."
}; 