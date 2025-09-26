import { Clipboard, showHUD, getPreferenceValues } from "@raycast/api";

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
 */
export async function copyAndPaste(text: string): Promise<void> {
  const preferences = getPreferenceValues<{
    pasteBehavior: "paste" | "copy_and_paste" | "copy";
  }>();

  const behavior = preferences.pasteBehavior || "paste";

  if (behavior === "paste") {
    try {
      await Clipboard.paste(text);
      await showHUD("✅ Text automatically inserted");
    } catch (error) {
      await Clipboard.copy(text);
      await showHUD("📋 Text copied to clipboard (paste with Cmd+V)");
    }
  } else if (behavior === "copy") {
    await Clipboard.copy(text);
    await showHUD("📋 Text copied to clipboard");
  } else {
    await Clipboard.copy(text);
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      await Clipboard.paste(text);
      await showHUD("✅ Text copied and automatically inserted");
    } catch (error) {
      await showHUD("📋 Text copied to clipboard (paste with Cmd+V)");
    }
  }
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
