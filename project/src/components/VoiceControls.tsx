import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceControlsProps {
  onSpeechInput: (text: string) => void;
  onAudioToggle: (enabled: boolean) => void;
  isAudioEnabled: boolean;
  isProcessing?: boolean;
  className?: string;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  onSpeechInput,
  onAudioToggle,
  isAudioEnabled,
  isProcessing = false,
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);
  
  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onSpeechInput(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onSpeechInput]);
  
  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        // Check microphone permission
        if (hasPermission === null) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          setHasPermission(true);
        }
        
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error accessing microphone', error);
        setHasPermission(false);
        alert('Unable to access microphone. Please check your permissions.');
      }
    }
  };
  
  const toggleAudio = () => {
    onAudioToggle(!isAudioEnabled);
  };
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={toggleAudio}
        className={`p-2 rounded-full transition-colors ${
          isAudioEnabled 
            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
        }`}
        aria-label={isAudioEnabled ? 'Disable audio' : 'Enable audio'}
        title={isAudioEnabled ? 'Disable audio' : 'Enable audio'}
      >
        {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
      
      <button
        onClick={toggleListening}
        disabled={isProcessing}
        className={`p-2 rounded-full transition-colors ${
          isListening
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
        title={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? <Mic size={18} className="animate-pulse" /> : <MicOff size={18} />}
      </button>
    </div>
  );
};

export default VoiceControls; 