import { useState, useEffect, useRef, useCallback } from 'react';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
    length: number;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface UseHuddleAIProps {
    onTranscript: (text: string) => void;
    enabled?: boolean;
}

export const useHuddleAI = ({ onTranscript, enabled = false }: UseHuddleAIProps) => {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError('Speech Recognition API not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Keep listening even after pauses
        recognition.interimResults = false; // Only send final results for now
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const lastResultIndex = event.results.length - 1;
            const transcript = event.results[lastResultIndex][0].transcript;

            if (event.results[lastResultIndex].isFinal) {
                // Send final transcript
                onTranscript(transcript.trim());
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            // Don't set error state for 'no-speech' as it's common
            if (event.error !== 'no-speech') {
                setError(`Speech error: ${event.error}`);
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            // Auto-restart if it was supposed to be listening (unless stopped manually)
            // But for now, we'll let state dictate. 
            // If we want "always on", we'd check a ref here.
            // For MVP, if it stops, we accept it stops or simplistic restart logic could go here.
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                setError(null);
            } catch (e) {
                console.error("Failed to start speech recognition", e);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    // Auto-start if enabled prop is true
    useEffect(() => {
        if (enabled && !isListening) {
            startListening();
        } else if (!enabled && isListening) {
            stopListening();
        }
    }, [enabled]);

    return {
        isListening,
        toggleListening,
        error
    };
};
