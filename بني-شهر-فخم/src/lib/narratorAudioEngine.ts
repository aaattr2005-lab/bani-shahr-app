// Advanced Natural Arabic Audio Narration Engine for Bani Shahr Heritage Stories
// Supports Microsoft Azure Neural Arabic Voice (ar-SA-HamedNeural & ar-SA-ZariyahNeural) server-side synthesis
// with automatic intelligent fallback to an enhanced phrase-by-phrase sequential client speech synthesizer with natural breathing pauses.

export type NarratorGender = "male" | "female";
export type NarratorSpeed = 0.85 | 0.92 | 1.0;

export interface NarrationOptions {
  gender?: NarratorGender;
  speed?: NarratorSpeed;
  onStart?: () => void;
  onSentenceChange?: (currentSentence: string, index: number, total: number) => void;
  onEnd?: () => void;
  onError?: (err?: any) => void;
  onEngineResolved?: (engineName: string) => void;
}

class NarratorAudioEngine {
  private currentAudio: HTMLAudioElement | null = null;
  private isCurrentlyPlaying: boolean = false;
  private isCurrentlyPaused: boolean = false;
  private currentUtteranceIndex: number = 0;
  private currentSentences: string[] = [];
  private currentOptions: NarrationOptions | null = null;
  private timeoutHandle: any = null;
  private abortController: AbortController | null = null;
  private activeEngine: "azure_neural" | "natural_browser" | "idle" = "idle";

  // Pre-fetch Arabic voices on browser
  private arabicVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        this.arabicVoices = voices.filter(v => v.lang.toLowerCase().startsWith("ar"));
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  public getActiveEngine(): string {
    if (this.activeEngine === "azure_neural") return "صوت استوديو طبيعي فائق النقاء (Microsoft Azure Neural TTS)";
    if (this.activeEngine === "natural_browser") return "صوت سردي متوازن مع وقفات تنفسية طبيعية";
    return "جاهز للاستماع";
  }

  public isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }

  public isPaused(): boolean {
    return this.isCurrentlyPaused;
  }

  public async speak(text: string, options: NarrationOptions = {}): Promise<void> {
    this.stop();

    if (!text || text.trim() === "") return;

    this.isCurrentlyPlaying = true;
    this.isCurrentlyPaused = false;
    this.currentOptions = options;
    const gender: NarratorGender = options.gender || "male";
    const speed: NarratorSpeed = options.speed || 0.92;

    options.onStart?.();

    // Clean and normalize text
    const cleanText = text
      .replace(/[*#_~`]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Attempt 1: Try High-Quality Server-Side TTS (Microsoft Azure Neural Voices)
    try {
      this.abortController = new AbortController();
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanText,
          voiceType: gender,
          speakingRate: speed,
        }),
        signal: this.abortController.signal,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioContent) {
          this.activeEngine = "azure_neural";
          options.onEngineResolved?.("Microsoft Azure Neural TTS");
          await this.playBase64Audio(data.audioContent, options);
          return;
        }
      }
    } catch (e: any) {
      if (e.name === "AbortError") return;
      console.warn("Azure TTS API error, falling back to natural browser synthesis:", e);
    }

    // Attempt 2: Enhanced Natural Arabic Browser Synthesizer with Breath Pauses
    this.activeEngine = "natural_browser";
    options.onEngineResolved?.("صوت متوازن مع وقفات سردية");
    this.playNaturalBrowserSpeech(cleanText, gender, speed, options);
  }

  private async playBase64Audio(base64Data: string, options: NarrationOptions): Promise<void> {
    try {
      const audioSrc = `data:audio/mp3;base64,${base64Data}`;
      this.currentAudio = new Audio(audioSrc);
      
      this.currentAudio.onended = () => {
        this.isCurrentlyPlaying = false;
        this.isCurrentlyPaused = false;
        this.activeEngine = "idle";
        options.onEnd?.();
      };

      this.currentAudio.onerror = () => {
        this.isCurrentlyPlaying = false;
        this.isCurrentlyPaused = false;
        options.onError?.();
      };

      await this.currentAudio.play();
    } catch (err) {
      console.warn("Failed to play audio element:", err);
      // Fallback to browser synthesis
      this.playNaturalBrowserSpeech(
        this.currentSentences.join(" "),
        options.gender || "male",
        options.speed || 0.92,
        options
      );
    }
  }

  private playNaturalBrowserSpeech(
    fullText: string,
    gender: NarratorGender,
    speed: number,
    options: NarrationOptions
  ): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.isCurrentlyPlaying = false;
      options.onError?.("المتصفح لا يدعم ميزة تحويل النص إلى صوت.");
      return;
    }

    window.speechSynthesis.cancel();

    // Segment into expressive conversational phrases & sentences
    // Splitting by full stops, question marks, exclamation marks, or linebreaks
    const rawSentences = fullText
      .split(/([.!؟؛\n]+)/)
      .reduce<string[]>((acc, cur, idx, arr) => {
        if (idx % 2 === 0 && cur.trim()) {
          const punct = arr[idx + 1] || "";
          acc.push((cur + " " + punct).trim());
        }
        return acc;
      }, []);

    this.currentSentences = rawSentences.length > 0 ? rawSentences : [fullText];
    this.currentUtteranceIndex = 0;

    // Pick best Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arVoices = voices.filter(v => v.lang.toLowerCase().startsWith("ar"));
    
    let selectedVoice: SpeechSynthesisVoice | null = null;

    if (arVoices.length > 0) {
      if (gender === "female") {
        // Look for known female Arabic voice names
        selectedVoice = arVoices.find(v => 
          /female|salma|zariyah|zeina|hoda|laila|siri|maged/i.test(v.name)
        ) || arVoices[0];
      } else {
        // Look for known male / authoritative Arabic voices
        selectedVoice = arVoices.find(v => 
          /male|naayf|shakir|hamed|tariq|maged|youssef/i.test(v.name)
        ) || arVoices[0];
      }
    }

    this.speakSentenceQueue(gender, speed, selectedVoice, options);
  }

  private speakSentenceQueue(
    gender: NarratorGender,
    speed: number,
    voice: SpeechSynthesisVoice | null,
    options: NarrationOptions
  ): void {
    if (!this.isCurrentlyPlaying || this.isCurrentlyPaused) return;

    if (this.currentUtteranceIndex >= this.currentSentences.length) {
      this.isCurrentlyPlaying = false;
      this.isCurrentlyPaused = false;
      this.activeEngine = "idle";
      options.onEnd?.();
      return;
    }

    const currentChunk = this.currentSentences[this.currentUtteranceIndex];
    options.onSentenceChange?.(currentChunk, this.currentUtteranceIndex, this.currentSentences.length);

    const utterance = new SpeechSynthesisUtterance(currentChunk);
    utterance.lang = "ar-SA";
    if (voice) utterance.voice = voice;

    // Calibrate speed and pitch for genuine calm Arabic storytelling
    utterance.rate = speed;
    utterance.pitch = gender === "female" ? 1.05 : 0.93; // slightly deeper for male narrator

    utterance.onend = () => {
      if (!this.isCurrentlyPlaying || this.isCurrentlyPaused) return;

      this.currentUtteranceIndex++;
      
      // Add natural storytelling breathing pause (650ms between full sentences, 350ms between clauses)
      const isShortClause = currentChunk.includes("،") && !/[.!?؟]/.test(currentChunk);
      const pauseDuration = isShortClause ? 350 : 650;

      this.timeoutHandle = setTimeout(() => {
        this.speakSentenceQueue(gender, speed, voice, options);
      }, pauseDuration);
    };

    utterance.onerror = (e) => {
      console.warn("Speech utterance error:", e);
      if (!this.isCurrentlyPlaying) return;
      this.currentUtteranceIndex++;
      this.speakSentenceQueue(gender, speed, voice, options);
    };

    window.speechSynthesis.speak(utterance);
  }

  public pause(): void {
    if (!this.isCurrentlyPlaying || this.isCurrentlyPaused) return;
    this.isCurrentlyPaused = true;

    if (this.currentAudio) {
      this.currentAudio.pause();
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume(): void {
    if (!this.isCurrentlyPlaying || !this.isCurrentlyPaused) return;
    this.isCurrentlyPaused = false;

    if (this.currentAudio) {
      this.currentAudio.play();
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
    }
  }

  public stop(): void {
    this.isCurrentlyPlaying = false;
    this.isCurrentlyPaused = false;
    this.activeEngine = "idle";

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const narratorEngine = new NarratorAudioEngine();
