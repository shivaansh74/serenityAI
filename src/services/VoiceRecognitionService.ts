class VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private silenceTimeout: NodeJS.Timeout | null = null;
  private finalResult: string = '';

  constructor() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.configureRecognition();
    }
  }

  private configureRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
  }

  private resetSilenceTimeout(onResult: (text: string, isFinal: boolean) => void) {
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
    }

    // Stop after 1.5 seconds of silence
    this.silenceTimeout = setTimeout(() => {
      if (this.isListening && this.finalResult) {
        onResult(this.finalResult, true);
        this.stopListening();
      }
    }, 1500);
  }

  public startListening(onResult: (text: string, isFinal: boolean) => void, onError: (error: string) => void) {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.finalResult = '';

    this.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      
      if (result.isFinal) {
        this.finalResult += (this.finalResult ? ' ' : '') + transcript;
        onResult(this.finalResult, true);
      } else {
        onResult(transcript, false);
      }
      
      this.resetSilenceTimeout(onResult);
    };

    this.recognition.onerror = (event) => {
      onError(event.error);
      this.stopListening();
    };

    this.recognition.onend = () => {
      // If we're still supposed to be listening, restart
      if (this.isListening) {
        try {
          this.recognition?.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
        }
      }
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      onError('Failed to start voice recognition');
      this.isListening = false;
    }
  }

  public stopListening() {
    if (!this.recognition) return;

    this.isListening = false;
    
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }
    
    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }

    this.recognition.onresult = null;
    this.recognition.onerror = null;
    this.recognition.onend = null;
    this.finalResult = '';
  }

  public isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }
}

export default new VoiceRecognitionService(); 