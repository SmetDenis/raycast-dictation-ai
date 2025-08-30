import OpenAI from "openai";
import { createReadStream } from "fs";
import { readFile } from "fs/promises";
import { getPreferenceValues } from "@raycast/api";
import { ErrorTypes, Preferences, DetailedTranscriptionResult } from "../types";
import { handleOpenAIError } from "./errors";

export async function transcribeAudioDetailed(
  filePath: string,
): Promise<DetailedTranscriptionResult> {
  const preferences = getPreferenceValues<Preferences>();

  if (!preferences.openaiApiKey) {
    throw new Error(ErrorTypes.API_KEY_MISSING);
  }

  const openai = new OpenAI({
    apiKey: preferences.openaiApiKey,
  });

  let audioFile: ReturnType<typeof createReadStream> | undefined;

  try {
    audioFile = createReadStream(filePath);

    const transcription = await createTranscription(
      openai,
      audioFile,
      preferences,
    );

    // Since we always use text format, response will be a string
    if (typeof transcription === "string") {
      return {
        text: transcription.trim(),
        format: "text",
      };
    }

    throw new Error("Unexpected response format from OpenAI");
  } catch (error) {
    console.error("OpenAI transcription error:", error);
    handleOpenAIError(error);
    throw error;
  } finally {
    if (audioFile) {
      audioFile.destroy();
    }
  }
}

export async function transcribeAudio(filePath: string): Promise<string> {
  const result = await transcribeAudioDetailed(filePath);
  return result.text;
}

async function loadTranscriptionContext(filePath?: string): Promise<string | undefined> {
  if (!filePath || filePath.trim() === "") {
    return undefined;
  }

  try {
    const content = await readFile(filePath, "utf-8");
    return content.trim() || undefined;
  } catch (error) {
    console.warn(`Failed to read transcription context file: ${filePath}`, error);
    return undefined;
  }
}

async function createTranscription(
  openai: OpenAI,
  audioFile: ReturnType<typeof createReadStream>,
  preferences: Preferences,
) {
  const rawTemperature = preferences.temperature ?? 0;
  const temperature = Math.max(0, Math.min(1, rawTemperature));
  const transcriptionContext = await loadTranscriptionContext(preferences.promptFile);

  return openai.audio.transcriptions.create({
    file: audioFile,
    model: preferences.model || "whisper-1",
    language:
      preferences.language === "auto" ? undefined : preferences.language,
    prompt: transcriptionContext,
    response_format: "text",
    temperature: temperature,
  });
}
