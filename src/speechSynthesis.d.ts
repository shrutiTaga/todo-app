// speechSynthesis.d.ts

interface Window {
    speechSynthesis: SpeechSynthesis;
  }
  
  interface SpeechSynthesisUtteranceEventMap {
    "end": Event;
  }
  
  interface SpeechSynthesisUtterance {
    onend: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null;
  }
  