import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import ChatInterface from './ChatInterface';
import useChatStore from '../store/chatStore';

interface FloatingChatBubbleProps {
  isTabletMode?: boolean;
}

const FloatingChatBubble: React.FC<FloatingChatBubbleProps> = ({ isTabletMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const { messages } = useChatStore();
  
  // Check for unread messages
  useEffect(() => {
    // If there are AI messages and chat is closed, mark as unread
    const hasAiMessages = messages.some(msg => msg.type === 'ai');
    if (hasAiMessages && !isOpen) {
      setHasUnread(true);
    }
  }, [messages, isOpen]);

  // Reset unread indicator when chat is opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${isTabletMode ? '' : 'fixed bottom-20 right-4 sm:bottom-20 sm:right-6'} z-50`}>
      {/* Chat Interface Popup - Full screen on mobile, popup on tablet/desktop */}
      <div 
        className={`
          ${isTabletMode ? 'absolute' : 'fixed md:absolute'}
          md:bottom-16 md:right-0 md:mb-2 
          ${isTabletMode ? 'inset-auto bottom-16 right-0' : 'inset-0 md:inset-auto'}
          md:w-[400px] lg:w-[450px] 
          bg-white md:rounded-lg shadow-xl overflow-hidden 
          transition-all duration-300 transform origin-bottom-right
          ${isOpen 
            ? 'opacity-100 scale-100 translate-y-0 z-50' 
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none -z-10'
          }`}
      >
        <ChatInterface 
          onClose={() => setIsOpen(false)} 
          isMobileView={window.innerWidth < 768}
          isTabletMode={isTabletMode}
        />
      </div>

      {/* Chat Bubble Button */}
      <button
        onClick={toggleChat}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition-all 
          ${isOpen ? 'bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={22} className="sm:w-6 sm:h-6" /> : <MessageSquare size={22} className="sm:w-6 sm:h-6" />}
        
        {/* Unread indicator */}
        {hasUnread && !isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Greeting Message - Shows when closed and no conversation started yet */}
      {!isOpen && messages.length === 0 && (
        <div className="absolute bottom-full right-0 mb-1 bg-white p-3 rounded-lg shadow-lg text-sm max-w-[200px] animate-fade-in">
          <div className="relative">
            <div className="absolute -bottom-2 right-3 w-3 h-3 bg-white transform rotate-45"></div>
            <p>Hi there! Need help ordering?</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatBubble; 