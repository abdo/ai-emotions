import { openAiTTSApiKey } from "../keys.ignore";
import { AppError } from "../utils/AppError";
import { extractToneAndCleanText } from "../utils/textCleaner";
import { StoryData } from "../types";

export class VoiceService {
  static async generateVoices(story: StoryData): Promise<Record<number, string>> {
    if (!openAiTTSApiKey) {
      throw new AppError(500, "MISSING_API_KEY", "OpenAI API Key is missing");
    }

    const audioMap: Record<number, string> = {};
    const characterMap = new Map(story.characters.map((c) => [c.id, c]));

    // Process all lines in parallel
    const promises = story.dialogue.map(async (line, index) => {
      const character = characterMap.get(line.characterId);
      if (!character || !character.voiceId) {
        console.warn(`Character not found or missing voiceId for line ${index}`);
        return;
      }

      const { cleanedText } = extractToneAndCleanText(line.text);
      
      try {
        const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiTTSApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini-tts",
            voice: character.voiceId,
            input: cleanedText,
          }),
        });

        if (!response.ok) {
          throw new AppError(502, "VOICE_GENERATION_ERROR", `Voice generation failed: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Audio = buffer.toString("base64");
        
        audioMap[index] = base64Audio;
      } catch (error) {
        console.error(`Failed to generate voice for line ${index}:`, error);
        // We continue even if one voice fails, but we could also throw here if strictness is required
        // For now, let's just log it to avoid failing the whole show for one line
      }
    });

    await Promise.all(promises);
    return audioMap;
  }
}
