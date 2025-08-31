import { readFile } from "fs/promises";
import { ErrorTypes } from "../types";

/**
 * Extract prompt content from structured format
 * Supports ## Prompt section with code blocks allowing any characters after ```
 */
export function extractPromptFromContent(content: string): string {
  // Find ## Prompt section with ``` 
  const promptHeaderPattern = /##\s+Prompt\s*\n?\s*```.*?\n/i;
  const headerMatch = content.match(promptHeaderPattern);
  
  if (!headerMatch) {
    return content.trim();
  }
  
  // Get everything after the header
  const afterHeader = content.slice(headerMatch.index! + headerMatch[0].length);
  
  // Look for closing ``` that's at the beginning of a line, end of line, or end of string
  const closingBacktickMatch = afterHeader.match(/(^```$|```$)/m);
  
  if (closingBacktickMatch) {
    // Extract content before closing backticks and everything after
    const beforeClosing = afterHeader.slice(0, closingBacktickMatch.index).trim();
    const afterClosing = afterHeader.slice(closingBacktickMatch.index! + closingBacktickMatch[0].length);
    
    if (afterClosing.trim()) {
      // If there's content after closing backticks, check if it ends with ``` and remove it
      let finalContent = beforeClosing + afterClosing;
      if (finalContent.endsWith('\n```')) {
        finalContent = finalContent.slice(0, -4);
      }
      return finalContent;
    }
    
    return beforeClosing;
  }
  
  // No closing backticks found, return everything after header trimmed
  return afterHeader.trim();
}

/**
 * Load and parse prompt from file
 * Returns null if file is not specified or empty
 * Throws error if file cannot be read
 */
export async function loadPromptFromFile(
  filePath?: string,
): Promise<string | null> {
  if (!filePath || filePath.trim() === "") {
    return null;
  }

  try {
    const content = await readFile(filePath, "utf-8");
    return extractPromptFromContent(content);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      console.error(`Prompt file not found: ${filePath}`);
      throw new Error(ErrorTypes.PROMPT_FILE_NOT_FOUND);
    }
    console.error(`Failed to read prompt file: ${filePath}`, error);
    throw new Error(ErrorTypes.PROMPT_FILE_READ_ERROR);
  }
}

/**
 * Load transcription context from file
 * Returns undefined if no file specified (for optional transcription context)
 */
export async function loadTranscriptionContext(
  filePath?: string,
): Promise<string | undefined> {
  if (!filePath || filePath.trim() === "") {
    return undefined;
  }

  try {
    const content = await readFile(filePath, "utf-8");
    const extractedContext = extractPromptFromContent(content);
    return extractedContext || undefined;
  } catch (error) {
    console.warn(
      `Failed to read transcription context file: ${filePath}`,
      error,
    );
    return undefined;
  }
}
