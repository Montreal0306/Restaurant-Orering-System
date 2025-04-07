import React, { useState, useEffect, useRef } from 'react';
import MenuGrid from './components/MenuGrid';
import Toast from './components/Toast';
import useMenuStore from './store/menuStore';
import FloatingChatBubble from './components/FloatingChatBubble';
import BottomNav from './components/BottomNav';
import CartModal from './components/CartModal';
import { RotateCcw, Code, Tablet, Maximize } from 'lucide-react';
import useChatStore from './store/chatStore';

// Header component props interface
interface HeaderProps {
  isTabletMode: boolean;
  toggleTabletMode: () => void;
}

// Simple Header component with reset button
const Header: React.FC<HeaderProps> = ({ isTabletMode, toggleTabletMode }) => {
  const resetStore = useMenuStore(state => state.resetStore);
  const clearChat = useChatStore(state => state.clearChat);
  
  const handleReset = () => {
    resetStore();
    clearChat();
    alert('System has been reset for new customers');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center bg-blue-600 text-white p-2 rounded-lg mr-3">
              <Code className="w-5 h-5" />
              <span className="text-xs font-medium ml-1">Valsoft Software</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Valsoft Restaurant</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleTabletMode}
              className={`flex items-center px-3 py-2 text-sm font-medium text-white ${isTabletMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} rounded transition-colors`}
              title={isTabletMode ? "Exit tablet mode" : "Enter tablet mode"}
            >
              {isTabletMode ? (
                <>
                  <Maximize className="w-4 h-4 mr-1" />
                  full screen
                </>
              ) : (
                <>
                  <Tablet className="w-4 h-4 mr-1" />
                  tablet
                </>
              )}
            </button>
            <button 
              onClick={handleReset}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              title="Reset application for new customers"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              demo_reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

function App() {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'remove'>('success');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTabletMode, setIsTabletMode] = useState(false);
  const tabletFrameRef = useRef<HTMLDivElement>(null);
  
  const { cart, menu } = useMenuStore();
  const prevCartItemsRef = useRef<Array<{id: string, name: string}>>([]);
  const prevCartLength = useRef(cart.items.length);

  const toggleTabletMode = () => {
    setIsTabletMode(!isTabletMode);
  };

  // Apply scaling to the tablet frame based on viewport size
  useEffect(() => {
    if (!isTabletMode || !tabletFrameRef.current) return;

    const updateTabletScale = () => {
      const tabletFrame = tabletFrameRef.current;
      if (!tabletFrame) return;

      // Target dimensions
      const targetWidth = 1280;
      const targetHeight = 800;
      
      // Available space (accounting for some padding)
      const availableWidth = window.innerWidth * 0.95;
      const availableHeight = window.innerHeight * 0.95;
      
      // Calculate scale factors
      const widthScale = availableWidth / targetWidth;
      const heightScale = availableHeight / targetHeight;
      
      // Use the smaller scale factor to ensure it fits both dimensions
      const scaleFactor = Math.min(widthScale, heightScale, 1); // Cap at 1 to avoid enlargement
      
      // Apply the scale through CSS variable
      tabletFrame.style.setProperty('--scale-factor', scaleFactor.toString());
    };

    // Initial scaling
    updateTabletScale();
    
    // Update on resize
    window.addEventListener('resize', updateTabletScale);
    
    return () => {
      window.removeEventListener('resize', updateTabletScale);
    };
  }, [isTabletMode]);

  // Show toast notification when cart updates
  useEffect(() => {
    const currentLength = cart.items.length;
    
    if (currentLength > prevCartLength.current) {
      // Item was added - it will be the last item in the cart
      const lastItem = cart.items[currentLength - 1];
      setToastMessage(`"${lastItem.menuItem.name}" added to cart`);
      setToastType('success');
      setToastVisible(true);
    } else if (currentLength < prevCartLength.current && prevCartLength.current > 0 && currentLength !== 0) {
      // Item was removed - find which item by comparing with previous cart items
      const currentIds = new Set(cart.items.map(item => item.menuItem.id));
      const removedItem = prevCartItemsRef.current.find(item => !currentIds.has(item.id));
      
      // Only show removal notification if it wasn't a complete cart clear
      // When placing an order, cart goes from having items to being completely empty
      if (removedItem && !(currentLength === 0 && prevCartLength.current > 1)) {
        setToastMessage(`"${removedItem.name}" removed from cart`);
        setToastType('remove');
        setToastVisible(true);
      }
    }
    
    // Update the reference of cart items for next comparison
    prevCartItemsRef.current = cart.items.map(item => ({ 
      id: item.menuItem.id, 
      name: item.menuItem.name 
    }));
    prevCartLength.current = currentLength;
  }, [cart.items.length]);

  const appContent = (
    <div className="bg-gray-50 min-h-screen pb-16">
      <Header isTabletMode={isTabletMode} toggleTabletMode={toggleTabletMode} />
      
      <main className="container mx-auto px-4 py-8">
        <div className={`transition-all duration-300 ${isCartOpen ? 'lg:pr-[25%] md:pr-[40%] sm:pr-[50%] pr-[80%]' : ''}`}>
          <MenuGrid cartIsOpen={isCartOpen} />
        </div>
      </main>

      <FloatingChatBubble />
      <BottomNav onCartToggle={setIsCartOpen} cartIsOpen={isCartOpen} />
      
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
      
      <Toast 
        isVisible={toastVisible} 
        message={toastMessage} 
        type={toastType} 
        onHide={() => setToastVisible(false)}
      />
    </div>
  );

  if (isTabletMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 p-4 overflow-hidden">
        <div className="tablet-device relative max-w-full max-h-full overflow-auto">
          {/* Tablet Frame with responsive scaling */}
          <div 
            ref={tabletFrameRef}
            className="tablet-frame bg-black rounded-[40px] p-3 shadow-2xl mx-auto transform origin-center"
            style={{ 
              width: '1280px', 
              height: '800px',
              maxWidth: '95vw',
              maxHeight: '95vh',
              transform: 'scale(var(--scale-factor, 1))',
              transformOrigin: 'center'
            }}
          >
            {/* Tablet Camera/Speaker */}
            <div className="flex justify-center mb-1">
              <div className="w-20 h-1 bg-gray-800 rounded-full"></div>
            </div>
            
            {/* Tablet Screen */}
            <div 
              className="tablet-screen bg-white rounded-3xl relative overflow-hidden"
              style={{ height: 'calc(800px - 30px)', width: '100%' }}
            >
              {/* Content Container with Bottom Padding for Nav */}
              <div className="h-full overflow-y-auto overflow-x-hidden pb-16 hide-scrollbar">
                <div className="bg-gray-50 min-h-full">
                  <Header isTabletMode={isTabletMode} toggleTabletMode={toggleTabletMode} />
                  
                  <main className="container mx-auto px-4 py-8">
                    <div className={`transition-all duration-300 ${isCartOpen ? 'lg:pr-[25%] md:pr-[40%] sm:pr-[50%] pr-[80%]' : ''}`}>
                      <MenuGrid cartIsOpen={isCartOpen} />
                    </div>
                  </main>
                
                  <CartModal 
                    isOpen={isCartOpen} 
                    onClose={() => setIsCartOpen(false)} 
                    isTabletMode={true}
                  />
                  
                  <Toast 
                    isVisible={toastVisible} 
                    message={toastMessage} 
                    type={toastType} 
                    onHide={() => setToastVisible(false)}
                  />
                </div>
              </div>
              
              {/* Fixed Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 z-40">
                <BottomNav 
                  onCartToggle={setIsCartOpen} 
                  cartIsOpen={isCartOpen} 
                  isTabletMode={true}
                />
              </div>
              
              {/* Floating Chat in Tablet Mode */}
              <div className="absolute bottom-16 right-4 z-50">
                <FloatingChatBubble isTabletMode={true} />
              </div>
            </div>
            
            {/* Tablet Home Button */}
            <div className="flex justify-center mt-2">
              <div className="w-10 h-10 rounded-full border-2 border-gray-700 flex items-center justify-center">
                <div className="w-6 h-6 rounded-sm border-2 border-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return appContent;
}

export default App;