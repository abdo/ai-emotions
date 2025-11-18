import { useCallback, useRef, useState } from "react";
import { openAiTTSApiKey } from "../keys.ignore";
import type { Character, DialogueLine } from "./usePerspectives";
import { cleanTextForSpeech } from "../lib/textCleaner";

type VoiceStatus = "idle" | "generating" | "ready" | "error";

type DialogueAudio = {
  dialogueIndex: number;
  characterId: string;
  status: VoiceStatus;
  audioSrc?: string;
  error?: string;
};

type AudioMap = Record<number, DialogueAudio>;

// Standardized character roles with specific voice configurations
type VoiceConfig = {
  voice: string;
  speed: number;
  model: "tts-1" | "tts-1-hd";
};

type CharacterRole =
  | "empathetic"
  | "analytical"
  | "provocateur"
  | "emotional"
  | "calm"
  | "assertive"
  | "skeptical"
  | "optimistic"
  | "cynical"
  | "nurturing"
  | "intense"
  | "playful"
  | "serious"
  | "wise"
  | "rebellious"
  | "mediator"
  | "challenger"
  | "supporter"
  | "observer"
  | "wildcard";

// Voice configurations for each standardized role
const roleVoiceConfigs: Record<CharacterRole, VoiceConfig> = {
  empathetic: { voice: "nova", speed: 1.0, model: "tts-1" }, // Warm, slower
  analytical: { voice: "echo", speed: 1.1, model: "tts-1" }, // Clear, measured
  provocateur: { voice: "onyx", speed: 1.2, model: "tts-1" }, // Bold, faster
  emotional: { voice: "shimmer", speed: 0.95, model: "tts-1-hd" }, // Expressive, slower
  calm: { voice: "alloy", speed: 0.95, model: "tts-1" }, // Soothing, slow
  assertive: { voice: "echo", speed: 1.15, model: "tts-1" }, // Confident, slightly fast
  skeptical: { voice: "onyx", speed: 1.05, model: "tts-1" }, // Questioning tone
  optimistic: { voice: "shimmer", speed: 1.15, model: "tts-1" }, // Upbeat
  cynical: { voice: "fable", speed: 1.0, model: "tts-1" }, // Dry, measured
  nurturing: { voice: "nova", speed: 0.95, model: "tts-1-hd" }, // Gentle, slow
  intense: { voice: "onyx", speed: 1.25, model: "tts-1-hd" }, // Powerful, fast
  playful: { voice: "shimmer", speed: 1.2, model: "tts-1" }, // Light, quick
  serious: { voice: "echo", speed: 1.0, model: "tts-1" }, // Grave, deliberate
  wise: { voice: "fable", speed: 0.95, model: "tts-1-hd" }, // Measured, thoughtful
  rebellious: { voice: "onyx", speed: 1.2, model: "tts-1" }, // Defiant, quick
  mediator: { voice: "alloy", speed: 1.05, model: "tts-1" }, // Balanced, neutral
  challenger: { voice: "echo", speed: 1.15, model: "tts-1" }, // Direct, firm
  supporter: { voice: "nova", speed: 1.05, model: "tts-1" }, // Encouraging
  observer: { voice: "alloy", speed: 1.0, model: "tts-1" }, // Detached, slow
  wildcard: { voice: "fable", speed: 1.1, model: "tts-1" }, // Unpredictable
};

// Extract standardized role from character's role text
const extractRole = (roleText: string): CharacterRole => {
  const normalized = roleText.toLowerCase();

  // Match keywords to standardized roles
  if (
    normalized.includes("empathetic") ||
    normalized.includes("empathy") ||
    normalized.includes("bridge")
  )
    return "empathetic";
  if (
    normalized.includes("analytical") ||
    normalized.includes("analyzer") ||
    normalized.includes("rational")
  )
    return "analytical";
  if (
    normalized.includes("provocateur") ||
    normalized.includes("challenge") ||
    normalized.includes("provocative")
  )
    return "provocateur";
  if (
    normalized.includes("emotional") ||
    normalized.includes("raw") ||
    normalized.includes("passionate")
  )
    return "emotional";
  if (normalized.includes("calm") || normalized.includes("peaceful"))
    return "calm";
  if (
    normalized.includes("assertive") ||
    normalized.includes("confident") ||
    normalized.includes("bold")
  )
    return "assertive";
  if (
    normalized.includes("skeptical") ||
    normalized.includes("doubtful") ||
    normalized.includes("questioning")
  )
    return "skeptical";
  if (
    normalized.includes("optimistic") ||
    normalized.includes("hopeful") ||
    normalized.includes("positive")
  )
    return "optimistic";
  if (
    normalized.includes("cynical") ||
    normalized.includes("pessimistic") ||
    normalized.includes("jaded")
  )
    return "cynical";
  if (
    normalized.includes("nurturing") ||
    normalized.includes("caring") ||
    normalized.includes("supportive")
  )
    return "nurturing";
  if (
    normalized.includes("intense") ||
    normalized.includes("fierce") ||
    normalized.includes("powerful")
  )
    return "intense";
  if (
    normalized.includes("playful") ||
    normalized.includes("lighthearted") ||
    normalized.includes("fun")
  )
    return "playful";
  if (
    normalized.includes("serious") ||
    normalized.includes("grave") ||
    normalized.includes("solemn")
  )
    return "serious";
  if (normalized.includes("wise") || normalized.includes("sage")) return "wise";
  if (
    normalized.includes("rebellious") ||
    normalized.includes("rebel") ||
    normalized.includes("defiant")
  )
    return "rebellious";
  if (
    normalized.includes("mediator") ||
    normalized.includes("peacemaker") ||
    normalized.includes("neutral")
  )
    return "mediator";
  if (
    normalized.includes("challenger") ||
    normalized.includes("confrontational")
  )
    return "challenger";
  if (normalized.includes("supporter") || normalized.includes("cheerleader"))
    return "supporter";
  if (
    normalized.includes("observer") ||
    normalized.includes("watcher") ||
    normalized.includes("detached")
  )
    return "observer";
  if (
    normalized.includes("wildcard") ||
    normalized.includes("wild card") ||
    normalized.includes("unpredictable")
  )
    return "wildcard";

  // Default fallback
  return "mediator";
};

export function usePersonaVoices() {
  const [audioMap, setAudioMap] = useState<AudioMap>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState<number>(-1);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);

  const unlockAudio = useCallback(() => {
    unlockedRef.current = true;
  }, []);

  const generateAllVoices = useCallback(
    async (dialogue: DialogueLine[], characters: Character[]) => {
      if (!dialogue.length || !characters.length) return;

      setIsGenerating(true);
      setAudioMap({});

      // Build a character map for quick lookup
      const charMap = new Map(characters.map((c) => [c.id, c]));

      await Promise.all(
        dialogue.map(async (line, index) => {
          const character = charMap.get(line.characterId);
          if (!character) {
            console.warn(`Character ${line.characterId} not found`);
            return;
          }

          try {
            // Clean the text before sending to TTS
            const cleanedText = cleanTextForSpeech(line.text);

            // Get role-based voice configuration
            const characterRole = extractRole(character.role);
            const voiceConfig = roleVoiceConfigs[characterRole];

            console.log(
              `[Voice ${index}] ${character.name} (${characterRole}): voice=${voiceConfig.voice}, speed=${voiceConfig.speed}, model=${voiceConfig.model}`
            );

            const response = await fetch(
              "https://api.openai.com/v1/audio/speech",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${openAiTTSApiKey}`,
                },
                body: JSON.stringify({
                  model: voiceConfig.model,
                  voice: voiceConfig.voice,
                  input: cleanedText,
                  speed: voiceConfig.speed,
                }),
              }
            );

            if (!response.ok) {
              const errorText = await response.text();
              console.error(
                `[Voice ${index}] OpenAI API Error ${response.status}:`,
                errorText
              );
              throw new Error(`OpenAI TTS ${response.status}: ${errorText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const audioSrc = arrayBufferToDataUri(arrayBuffer);

            setAudioMap((prev) => ({
              ...prev,
              [index]: {
                dialogueIndex: index,
                characterId: line.characterId,
                status: "ready",
                audioSrc,
              },
            }));
          } catch (error) {
            console.error(`Voice generation error for line ${index}`, error);
            setAudioMap((prev) => ({
              ...prev,
              [index]: {
                dialogueIndex: index,
                characterId: line.characterId,
                status: "error",
                error:
                  error instanceof Error
                    ? error.message
                    : "Failed to generate voice",
              },
            }));
          }
        })
      );

      setIsGenerating(false);
    },
    []
  );

  const playDialogue = useCallback(
    (index: number, onFinished?: () => void) => {
      if (!unlockedRef.current) return;
      const audio = audioMap[index];
      if (!audio || audio.status !== "ready" || !audio.audioSrc) {
        // If audio not ready, skip to next
        onFinished?.();
        return;
      }

      try {
        currentAudioRef.current?.pause();
        const audioElement = new Audio(audio.audioSrc);
        currentAudioRef.current = audioElement;
        setCurrentDialogueIndex(index);

        audioElement.onended = () => {
          setCurrentDialogueIndex(-1);
          onFinished?.();
        };

        audioElement.play().catch((err) => {
          console.error("Audio playback error", err);
          setCurrentDialogueIndex(-1);
          onFinished?.();
        });
      } catch (error) {
        console.error("Unable to play voice", error);
        setCurrentDialogueIndex(-1);
        onFinished?.();
      }
    },
    [audioMap]
  );

  const playAllDialogue = useCallback(
    (totalLines: number) => {
      let currentIndex = 0;

      const playNext = () => {
        if (currentIndex >= totalLines) {
          setCurrentDialogueIndex(-1);
          return;
        }
        playDialogue(currentIndex, () => {
          currentIndex++;
          // Small delay between lines
          setTimeout(playNext, 500);
        });
      };

      playNext();
    },
    [playDialogue]
  );

  const stopAudio = useCallback(() => {
    currentAudioRef.current?.pause();
    setCurrentDialogueIndex(-1);
  }, []);

  return {
    audioMap,
    isGenerating,
    currentDialogueIndex,
    generateAllVoices,
    playDialogue,
    playAllDialogue,
    stopAudio,
    unlockAudio,
  };
}

const arrayBufferToDataUri = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const base64 = window.btoa(binary);
  return `data:audio/mp3;base64,${base64}`;
};
