declare module 'elevenlabs-node' {
  export interface Voice {
    voice_id: string;
    name: string;
    category?: string;
    description?: string;
    preview_url?: string;
  }

  export interface VoiceSettings {
    stability: number;
    similarity_boost: number;
  }

  export interface TextToSpeechOptions {
    text: string;
    model_id?: string;
    voice_settings?: VoiceSettings;
  }

  export class ElevenLabs {
    constructor(apiKey: string);
    getVoices(): Promise<Voice[]>;
    textToSpeech(voiceId: string, options: TextToSpeechOptions): Promise<ArrayBuffer>;
  }
} 