import React, { useState } from 'react';
import { X, Plus, Minus, Coffee, Utensils, RefreshCw, Droplet, Package, 
  IceCream, UtensilsCrossed, Glasses, Bookmark, Sandwich, Receipt } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface ServiceRequest {
  itemId: string;
  quantity: number;
}

interface ServerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ServerRequestModal: React.FC<ServerRequestModalProps> = ({ isOpen, onClose }) => {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

  const serviceItems: ServiceItem[] = [
    { id: 'water', name: 'Water', icon: <Droplet className="w-5 h-5" /> },
    { id: 'cutlery', name: 'Cutlery', icon: <Utensils className="w-5 h-5" /> },
    { id: 'refill', name: 'Refill', icon: <RefreshCw className="w-5 h-5" /> },
    { id: 'face', name: 'Face Towel', icon: <Sandwich className="w-5 h-5" /> },
    { id: 'togo', name: 'To-Go Box', icon: <Package className="w-5 h-5" /> },
    { id: 'ice', name: 'Ice', icon: <IceCream className="w-5 h-5" /> },
    { id: 'chopsticks', name: 'Chopsticks', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { id: 'fork', name: 'Fork', icon: <Utensils className="w-5 h-5" /> },
    { id: 'spoon', name: 'Spoon', icon: <Coffee className="w-5 h-5" /> },
    { id: 'knife', name: 'Knife', icon: <Utensils className="w-5 h-5 transform rotate-90" /> },
    { id: 'napkins', name: 'Napkins', icon: <Bookmark className="w-5 h-5" /> },
    { id: 'check', name: 'Check', icon: <Receipt className="w-5 h-5" /> },
  ];

  const getItemById = (itemId: string): ServiceItem | undefined => {
    return serviceItems.find(item => item.id === itemId);
  };

  const getQuantity = (itemId: string): number => {
    const request = serviceRequests.find(req => req.itemId === itemId);
    return request ? request.quantity : 0;
  };

  const isItemSelected = (itemId: string): boolean => {
    return serviceRequests.some(req => req.itemId === itemId);
  };

  const addItem = (itemId: string) => {
    const existingRequest = serviceRequests.find(req => req.itemId === itemId);
    
    if (existingRequest) {
      // If already in list, remove it completely (toggle behavior)
      setServiceRequests(serviceRequests.filter(req => req.itemId !== itemId));
    } else {
      // If not in list, add with quantity 1
      setServiceRequests([...serviceRequests, { itemId, quantity: 1 }]);
    }
  };

  const incrementQuantity = (itemId: string) => {
    const existingRequest = serviceRequests.find(req => req.itemId === itemId);
    
    if (existingRequest) {
      setServiceRequests(
        serviceRequests.map(req => 
          req.itemId === itemId ? { ...req, quantity: req.quantity + 1 } : req
        )
      );
    }
  };

  const decrementQuantity = (itemId: string) => {
    const existingRequest = serviceRequests.find(req => req.itemId === itemId);
    
    if (existingRequest && existingRequest.quantity > 1) {
      setServiceRequests(
        serviceRequests.map(req => 
          req.itemId === itemId ? { ...req, quantity: req.quantity - 1 } : req
        )
      );
    } else if (existingRequest && existingRequest.quantity === 1) {
      setServiceRequests(serviceRequests.filter(req => req.itemId !== itemId));
    }
  };

  const resetQuantity = (itemId: string) => {
    setServiceRequests(serviceRequests.filter(req => req.itemId !== itemId));
  };

  const submitRequest = () => {
    if (serviceRequests.length === 0) {
      return;
    }
    
    // In a real app, this would send the request to the server
    console.log('Service requests:', serviceRequests);
    
    // Show success message, reset and close
    alert('Your request has been sent to the server');
    setServiceRequests([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">Service Requests</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content area with grid and sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Grid of service items */}
          <div className="flex-1 p-4 overflow-y-auto hide-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {serviceItems.map((item) => {
                const selected = isItemSelected(item.id);
                
                return (
                  <button 
                    key={item.id}
                    onClick={() => addItem(item.id)}
                    className={`border rounded-lg p-3 flex flex-col items-center justify-center h-20 relative
                      transition-colors duration-150 
                      ${selected 
                        ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'border-gray-200 hover:bg-gray-50 active:bg-gray-100'}`}
                  >
                    <div className="mb-2">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-center">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Sidebar with selected items */}
          <div className="w-64 border-l bg-gray-50 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-medium text-gray-700">Selected Items</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
              {serviceRequests.length === 0 ? (
                <p className="text-gray-500 text-sm">No items selected</p>
              ) : (
                <ul className="space-y-3">
                  {serviceRequests.map((request) => {
                    const item = getItemById(request.itemId);
                    if (!item) return null;
                    
                    return (
                      <li key={request.itemId} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-2 text-gray-800">
                            {item.icon}
                          </div>
                          <span className="text-sm text-gray-800">
                            {item.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <button
                            onClick={() => decrementQuantity(request.itemId)}
                            className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 text-gray-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          
                          <span className="mx-2 min-w-[16px] text-center text-sm">
                            {request.quantity}
                          </span>
                          
                          <button
                            onClick={() => incrementQuantity(request.itemId)}
                            className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 text-gray-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          
                          <button
                            onClick={() => resetQuantity(request.itemId)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            
            {/* Request Service Button */}
            <div className="p-4 border-t">
              <button
                onClick={submitRequest}
                disabled={serviceRequests.length === 0}
                className={`w-full py-3 rounded-lg font-medium text-white
                  ${serviceRequests.length > 0 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-300 cursor-not-allowed'}`}
              >
                Request Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerRequestModal; 