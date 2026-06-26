export const speakJapanese = (text: string) => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech before starting a new one
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.75; // Slower rate so beginners can hear clearly
    utterance.pitch = 1.0;
    
    // Choose a Japanese voice if available
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(voice => voice.lang === 'ja-JP' || voice.lang.startsWith('ja'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Speech Synthesis is not supported in this browser.");
  }
};

// Warm up voices (speechSynthesis.getVoices() is populated asynchronously in some browsers)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}
