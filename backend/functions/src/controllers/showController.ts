import { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { StoryService } from "../services/storyService";
import { VoiceService } from "../services/voiceService";
import { ShowRequest, ShowResponse } from "../types";

import { AppError } from "../utils/AppError";

export class ShowController {
  static async getShow(req: Request, res: Response) {
    // Enable CORS
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const { userInput, userName, mode } = req.body as ShowRequest;

      if (!userInput) {
        throw new AppError(400, "INVALID_INPUT", "Missing userInput");
      }

      logger.info("Generating show", { userInput, userName, mode });

      // 1. Generate Story
      const story = await StoryService.generateStory(userInput, userName, mode);
      logger.info("Story generated", { characterCount: story.characters.length });

      // 2. Generate Voices
      const audioMap = await VoiceService.generateVoices(story);
      logger.info("Voices generated", { audioCount: Object.keys(audioMap).length });

      // 3. Return Response
      const response: ShowResponse = {
        story,
        audioMap,
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Error generating show", error);

      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: {
            code: error.errorCode,
            message: error.message,
            details: error.details,
          },
        });
      } else {
        res.status(500).json({
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
          },
        });
      }
    }
  }
}
