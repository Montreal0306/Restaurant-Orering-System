/**
 * Environment configuration
 * In a production environment, these values should be loaded from environment variables
 * For development purposes, we're storing them here
 * 
 * ELEVENLABS_API_KEY: 'sk_b60e36c3322361356e8c6869ca7ee09f4e5a4ac530cf8738',
 * OPENAI_API_KEY: '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',
 * ELEVENLABS_VOICE_ID: '21m00Tcm4TlvDq8ikWAM', // Default voice ID
 */

export const env = {
  // ElevenLabs API Key - replace with your actual key in production
  ELEVENLABS_API_KEY: process.env.REACT_APP_ELEVENLABS_API_KEY || 'YOUR_ELEVENLABS_API_KEY',
  
  // ElevenLabs Voice ID - replace with your preferred voice ID
  ELEVENLABS_VOICE_ID: process.env.REACT_APP_ELEVENLABS_VOICE_ID || 'eleven_multilingual_v2',
  
  // OpenAI API Key - replace with your actual key in production
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY',
  
  // OpenAI Model ID - replace with your preferred model
  OPENAI_MODEL: process.env.REACT_APP_OPENAI_MODEL || 'gpt-4o',
  
  // Development mode flag
  isDevelopment: process.env.NODE_ENV === 'development'
};