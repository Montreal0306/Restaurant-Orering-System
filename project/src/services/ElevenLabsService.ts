/**
 * ElevenLabs API Integration Service
 * Handles text-to-speech conversion using ElevenLabs API
 */

class ElevenLabsService {
  private apiKey: string | null = null;
  private voiceId: string | null = null;
  private baseUrl = 'https://api.elevenlabs.io/v1';
  
  /**
   * Initialize the service with API key and voice ID
   */
  initialize(voiceId: string, apiKey?: string): void {
    // Get from environment variables or passed parameter
    this.apiKey = apiKey || process.env.REACT_APP_ELEVENLABS_API_KEY || null;
    this.voiceId = voiceId;
    
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not provided. Text-to-speech functionality will be limited.');
    }
  }
  
  /**
   * Convert text to speech using ElevenLabs API
   */
  async textToSpeech(text: string): Promise<ArrayBuffer> {
    if (!this.apiKey || !this.voiceId) {
      throw new Error('ElevenLabs service not properly initialized');
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${this.voiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ElevenLabs API error: ${errorData.detail || response.statusText}`);
      }
      
      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error in text-to-speech conversion:', error);
      throw error;
    }
  }
  
  /**
   * Send a message to the AI and get a response
   * This is a placeholder - in a real implementation, you would integrate with OpenAI here
   */
  async sendMessage(message: string): Promise<{ text: string }> {
    // This is a mock implementation
    // In a real app, you would call OpenAI API here
    console.log('User message:', message);
    
    // Simulate API response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      text: `I received your message: "${message}". This is a placeholder response since this is just a demonstration of the voice interface.`
    };
  }
}

// Create a singleton instance
export const elevenLabsService = new ElevenLabsService();

export default ElevenLabsService; 