import { CharacterRole } from "../constants/theatreCharacters";

export interface Character {
  id: string;
  name: string;
  gender: "male" | "female";
  role: CharacterRole;
  image?: string;
  borderColor?: string;
  gradient?: string;
  voiceId?: string;
}

export interface DialogueLine {
  characterId: string;
  text: string;
}

export interface StoryData {
  characters: Character[];
  dialogue: DialogueLine[];
}

export interface ShowRequest {
  userInput: string;
  userName?: string;
  mode?: "conversation" | "story";
}

export interface ShowResponse {
  story: StoryData;
  audioMap: Record<number, string>; // index -> base64 audio
}
