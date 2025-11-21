import axios from "axios";
import { AppError } from "../utils/AppError";
import { groqApiKey } from "../keys.ignore";
import { storyGenerationPrompt } from "../constants/prompts";
import { pravatarImgIdsForMales, pravatarImgIdsForFemales } from "../constants/avatarConstants";
import { maleVoices, femaleVoices } from "../constants/theatreCharacters";
import { StoryData, Character } from "../types";

export class StoryService {
  private static getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static assignAvatarsAndColors(characters: Character[]): Character[] {
    const usedImages = new Set<string>();

    return characters.map((char) => {
      // Assign Image
      let imageId;
      const pool = char.gender === "male" ? pravatarImgIdsForMales : pravatarImgIdsForFemales;
      
      // Try to find an unused image
      const availableImages = pool.filter(id => !usedImages.has(id.toString()));
      if (availableImages.length > 0) {
        imageId = this.getRandomItem(availableImages);
      } else {
        imageId = this.getRandomItem(pool); // Fallback to reusing if we run out
      }
      usedImages.add(imageId.toString());
      
      const image = `https://i.pravatar.cc/150?u=${imageId}`;

      // Assign Voice
      const voicePool = char.gender === "male" ? maleVoices : femaleVoices;
      const voiceId = this.getRandomItem(voicePool);

      // Assign Colors (if not provided by LLM)
      let borderColor = char.borderColor;
      let gradient = char.gradient;

      if (!borderColor) {
        // Generate a random vibrant color
        const hue = Math.floor(Math.random() * 360);
        borderColor = `hsl(${hue}, 70%, 50%)`;
        gradient = `linear-gradient(135deg, ${borderColor}, #000000)`;
      }

      return {
        ...char,
        image,
        voiceId,
        borderColor,
        gradient,
      };
    });
  }

  static async generateStory(
    userInput: string,
    userName?: string,
    mode: "conversation" | "story" = "conversation"
  ): Promise<StoryData> {
    if (!groqApiKey) {
      throw new AppError(500, "MISSING_API_KEY", "Groq API Key is missing");
    }

    const prompt = storyGenerationPrompt(mode).replace(
      "[will be inserted]",
      userInput
    ).replace(/\[USER_NAME\]/g, userName || "the user");

    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          messages: [
            {
              role: "system",
              content: prompt,
            },
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 4000,
          response_format: { type: "json_object" },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new AppError(502, "INVALID_LLM_RESPONSE", "No content received from story generation service");
      }

      const storyData = JSON.parse(content) as StoryData;
      
      // Enrich characters with avatars, voices, and colors
      storyData.characters = this.assignAvatarsAndColors(storyData.characters);

      return storyData;
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      console.error("Error generating story:", error);
      throw new AppError(502, "STORY_GENERATION_ERROR", "Failed to generate story content", error);
    }
  }
}
