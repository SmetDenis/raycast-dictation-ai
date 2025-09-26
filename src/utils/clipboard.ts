import { Clipboard, showHUD, getPreferenceValues } from "@raycast/api";

export type PasteBehavior = "paste" | "copy_and_paste" | "copy" | "show";

/**
 * Copy text to clipboard and show confirmation
 */
export async function copyToClipboard(
  text: string,
  message?: string,
): Promise<void> {
  await Clipboard.copy(text);
  if (message) {
    await showHUD(message);
  }
}

/**
 * Handle text output based on user's paste behavior preference
 * Returns true if should show actions (show mode), false otherwise
 */
export async function copyAndPaste(text: string): Promise<boolean> {
  const preferences = getPreferenceValues<{
    pasteBehavior: PasteBehavior;
  }>();

  const behavior = preferences.pasteBehavior || "paste";

  if (behavior === "show") {
    return true;
  }

  if (behavior === "paste") {
    await pasteOnly(text);
  } else if (behavior === "copy") {
    await copyOnly(text);
  } else {
    await copyAndPasteAction(text);
  }

  return false;
}

/**
 * Paste text directly to active field
 */
export async function pasteOnly(text: string): Promise<void> {
  try {
    await Clipboard.paste(text);
    await showHUD("✅ Text automatically inserted");
  } catch (error) {
    await Clipboard.copy(text);
    await showHUD("📋 Text copied to clipboard (paste with Cmd+V)");
  }
}

/**
 * Copy text to clipboard and then paste
 */
export async function copyAndPasteAction(text: string): Promise<void> {
  await Clipboard.copy(text);
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    await Clipboard.paste(text);
    await showHUD("✅ Text copied and automatically inserted");
  } catch (error) {
    await showHUD("📋 Text copied to clipboard (paste with Cmd+V)");
  }
}

/**
 * Copy text to clipboard only
 */
export async function copyOnly(text: string): Promise<void> {
  await Clipboard.copy(text);
  await showHUD("📋 Text copied to clipboard");
}

/**
 * Format transcription text for better readability
 */
export function formatTranscriptionText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/([.!?])\s*([A-Z])/g, "$1 $2"); // Ensure proper spacing after sentences
}
