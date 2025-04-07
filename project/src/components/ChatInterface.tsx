import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X } from 'lucide-react';
import useChatStore from '../store/chatStore';
import { elevenLabsService } from '../services/ElevenLabsService';
import { openAIService } from '../services/OpenAIService';
import useMenuStore from '../store/menuStore';
import VoiceControls from './VoiceControls';
import restaurantKnowledgeBase from '../data/restaurant-knowledge-base.txt';

interface ChatInterfaceProps {
  onClose?: () => void;
  isMobileView?: boolean;
  isTabletMode?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onClose, 
  isMobileView = false,
  isTabletMode = false 
}) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isTyping, addMessage, setTyping, dietaryPreferences, updateDietaryPreferences } = useChatStore();
  const { menu, categories } = useMenuStore();

  // Initialize the services and setup voice
  useEffect(() => {
    // Initialize OpenAI service with restaurant context
    const categoryNames = categories.map(cat => cat.displayName);
    openAIService.initialize('YOUR_OPENAI_API_KEY', {
      restaurantName: 'Valsoft Restaurant',
      description: 'A modern restaurant offering a variety of cuisines with focus on quality ingredients.',
      categories: categoryNames,
      specialties: ['Pasta', 'Seafood', 'Seasonal Dishes'],
      dietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-Free']
    });
    
    // Initialize ElevenLabs service with knowledge base
    if (audioEnabled) {
      elevenLabsService.initialize('eleven_multilingual_v2', 'YOUR_ELEVENLABS_API_KEY', restaurantKnowledgeBase);
    }
    
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [audioEnabled, categories]);

  // Auto-scroll to the latest message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    await processUserInput(input);
  };
  
  const processUserInput = async (userInput: string) => {
    if (isProcessing) return;
    
    // Process dietary preferences from input
    checkForDietaryPreferences(userInput);

    // Add user message
    addMessage(userInput, 'user');
    setInput('');
    setIsProcessing(true);

    // Simulate AI typing
    setTyping(true);
    
    try {
      // Get AI response using OpenAI service
      const aiResponseText = await openAIService.sendMessage(userInput);
      
      // Add AI response
      addMessage(aiResponseText, 'ai');

      // Convert to speech if audio is enabled
      if (audioEnabled) {
        try {
          const audioData = await elevenLabsService.textToSpeech(aiResponseText);
          
          // Play the audio
          if (audioData) {
            const blob = new Blob([audioData], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            
            if (audio) {
              audio.pause();
              audio.src = url;
              audio.play();
            } else {
              const newAudio = new Audio(url);
              setAudio(newAudio);
              newAudio.play();
            }
          }
        } catch (error) {
          console.error('Error generating or playing speech:', error);
        }
      }
    } catch (error) {
      console.error('Error in AI processing:', error);
      addMessage("I'm sorry, I encountered an error while processing your request. Please try again.", 'ai');
    } finally {
      setTyping(false);
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = (text: string) => {
    setInput(text);
    processUserInput(text);
  };

  // Extract dietary preferences from messages
  const checkForDietaryPreferences = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for dietary preference keywords
    if (lowerMessage.includes('vegetarian')) {
      updateDietaryPreferences({ vegetarian: true });
    }
    if (lowerMessage.includes('vegan')) {
      updateDietaryPreferences({ vegan: true });
    }
    if (lowerMessage.includes('gluten free') || lowerMessage.includes('gluten-free')) {
      updateDietaryPreferences({ glutenFree: true });
    }
    if (lowerMessage.includes('spicy')) {
      const noSpicy = lowerMessage.includes('no spicy') || lowerMessage.includes('not spicy');
      updateDietaryPreferences({ spicy: !noSpicy });
    }
  };

  const processAudioResponse = async (text: string) => {
    if (!audioEnabled) return;
    
    const audioData = await elevenLabsService.textToSpeech(text);
    if (!audioData) return;
    
    // We know audioData is ArrayBuffer here since we checked for null
    const blob = new Blob([audioData as ArrayBuffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    
    const newAudio = new Audio(url);
    setAudio(newAudio);
    await newAudio.play();
  };

  return (
    <div className="flex flex-col h-full md:h-[450px] bg-white w-full">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center">
          <Bot className="w-5 h-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">AI Ordering Assistant</h2>
        </div>
        <div className="flex items-center space-x-2">
          <VoiceControls 
            onSpeechInput={handleVoiceInput}
            onAudioToggle={setAudioEnabled}
            isAudioEnabled={audioEnabled}
            isProcessing={isProcessing}
          />
          {onClose && (
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors md:hidden"
              aria-label="Close chat"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3 hide-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Bot className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-base font-medium mb-2">Hi! I'm your AI Restaurant Assistant</p>
            <div className="text-sm mb-4">
              <p className="mb-3">⚠️ This is a demo version only. Once fully implemented, I'll transform your dining experience by allowing you to browse menus effortlessly, receive instant personalized dish recommendations, find meals tailored to your dietary needs, and answer all your questions about ingredients—without needing any interaction with staff.</p>
              <p className="mb-3">I'll streamline your orders, save your valuable time, and help restaurants provide faster, more efficient service.</p>
              <p className="mb-3">For now, please explore the menu manually while we prepare the complete AI experience! 🍽️</p>
              <p className="text-xs text-gray-400">Note: The voice agent has a time limit per response, but it should work fine for most interactions.</p>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[85%] ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {message.type === 'user' ? (
                <User className="w-5 h-5 text-gray-600 mt-1" />
              ) : (
                <Bot className="w-5 h-5 text-blue-600 mt-1" />
              )}
              <div
                className={`rounded-lg p-2.5 text-sm ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <div className="bg-gray-100 rounded-lg p-2">
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about our menu..."
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={isProcessing}
          />
          <button
            type="submit"
            className={`px-3 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={isProcessing}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;