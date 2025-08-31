import OpenAI from "openai";
import { getPreferenceValues } from "@raycast/api";
import { Preferences, ErrorTypes } from "../types";
import { handleOpenAIError } from "./errors";
import { loadPromptFromFile } from "./prompts";

const DEFAULT_FORMATTING_PROMPTS = {
  email: `Transform the following text into a well-structured email, maintaining the original language of the input text. 
Analyze the tone and style of the input text (casual, professional, cordial, informal, etc.) and maintain that same tone throughout. 
Add an appropriate greeting like "Hi," and closing like "Cheers," that matches the detected tone. Do not use placeholders like [name] or [signature]. 
Organize the information in clear paragraphs. Only return the email text, without subject.

Text to format:`,

  slack: `Clean up and format the following transcription maintaining the original language, tone, style and words. 
Only fix small inconsistencies, errors, and organize the text into proper paragraphs with correct punctuation. 
Do not add emojis, greetings, or closings. Do not change the conversational style or add formalities.
Simply present the cleaned transcription with proper formatting.

Text to format:`,

  report: `Transform the following text into a structured report for a task management system, maintaining the original language of the input text. 
Organize the information with:
- **Objective/Task:** [clear description of what needs to be done]
- **Details:** [specific information and steps if any]
- **Requirements:** [if applicable, what is needed to complete the task]

Maintain a clear, professional and action-oriented format.

Text to format:`,

  translate: `Translate the following text to English. Maintain the original tone, style, and meaning. 
If the text is already in English, improve grammar and clarity while preserving the original message. 
Provide only the translated/improved text without explanations or notes.

Text to translate:`,
};

async function getFormattingPrompt(
  mode: "email" | "slack" | "report" | "translate",
): Promise<string> {
  const preferences = getPreferenceValues<Preferences>();

  try {
    switch (mode) {
      case "email": {
        const emailPrompt = await loadPromptFromFile(
          preferences.customPromptEmailFile,
        );
        return emailPrompt || DEFAULT_FORMATTING_PROMPTS.email;
      }
      case "slack": {
        const slackPrompt = await loadPromptFromFile(
          preferences.customPromptSlackFile,
        );
        return slackPrompt || DEFAULT_FORMATTING_PROMPTS.slack;
      }
      case "report": {
        const reportPrompt = await loadPromptFromFile(
          preferences.customPromptReportFile,
        );
        return reportPrompt || DEFAULT_FORMATTING_PROMPTS.report;
      }
      case "translate": {
        const translatePrompt = await loadPromptFromFile(
          preferences.customPromptTranslateFile,
        );
        return translatePrompt || DEFAULT_FORMATTING_PROMPTS.translate;
      }
      default:
        return DEFAULT_FORMATTING_PROMPTS[mode];
    }
  } catch (error) {
    console.warn(
      `Failed to load custom prompt for ${mode}, using default:`,
      error,
    );
    return DEFAULT_FORMATTING_PROMPTS[mode];
  }
}

function sanitizeText(text: string): string {
  // Remove any newlines and normalize spaces
  const sanitized = text.replace(/[\r\n]+/g, " ").trim();
  // Escape any quotes that could break the prompt structure
  return sanitized.replace(/"/g, '\\"');
}

export async function formatTextWithChatGPT(
  text: string,
  mode: "email" | "slack" | "report" | "translate",
): Promise<string> {
  const preferences = getPreferenceValues<Preferences>();
  const prompt = await getFormattingPrompt(mode);
  const sanitizedText = sanitizeText(text);

  if (!preferences.openrouterApiKey) {
    throw new Error(ErrorTypes.OPENROUTER_API_KEY_MISSING);
  }

  const openrouter = new OpenAI({
    apiKey: preferences.openrouterApiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });

  try {
    const response = await openrouter.chat.completions.create({
      model: preferences.openrouterModel || "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: `${prompt}\n\n<input-text>${sanitizedText}</input-text>`,
        },
      ],
      temperature: 0,
    });

    return response.choices[0]?.message?.content?.trim() || text;
  } catch (error) {
    console.error("Error formatting text:", error);
    handleOpenAIError(error);
  }
}
