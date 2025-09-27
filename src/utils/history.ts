import { LocalStorage, getPreferenceValues } from "@raycast/api";

export interface TranscriptionHistoryItem {
  id: string;
  originalText: string;
  timestamp: number;
  wordCount: number;
}

const TRANSCRIPTION_HISTORY_KEY = "transcription_history";

export async function saveTranscriptionToHistory(originalText: string): Promise<void> {
  try {
    const preferences = getPreferenceValues<{ transcriptionHistoryLimit: string }>();
    const historyLimit = parseInt(preferences.transcriptionHistoryLimit, 10);

    // If history is disabled (0), don't save
    if (historyLimit === 0) {
      return;
    }

    const historyJson = await LocalStorage.getItem<string>(TRANSCRIPTION_HISTORY_KEY);
    const history: TranscriptionHistoryItem[] = historyJson ? JSON.parse(historyJson) : [];

    const newItem: TranscriptionHistoryItem = {
      id: Date.now().toString(),
      originalText,
      timestamp: Date.now(),
      wordCount: originalText.split(/\s+/).filter(word => word.length > 0).length,
    };

    // Add new item to the beginning of the array
    history.unshift(newItem);

    // Trim history based on limit (-1 means unlimited)
    const trimmedHistory = historyLimit === -1 ? history : history.slice(0, historyLimit);

    await LocalStorage.setItem(TRANSCRIPTION_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Failed to save transcription to history:", error);
  }
}

export async function getTranscriptionHistory(): Promise<TranscriptionHistoryItem[]> {
  try {
    const historyJson = await LocalStorage.getItem<string>(TRANSCRIPTION_HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Failed to load transcription history:", error);
    return [];
  }
}

export async function removeTranscriptionFromHistory(id: string): Promise<void> {
  try {
    const history = await getTranscriptionHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    await LocalStorage.setItem(TRANSCRIPTION_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to remove transcription from history:", error);
  }
}

export async function clearTranscriptionHistory(): Promise<void> {
  try {
    await LocalStorage.removeItem(TRANSCRIPTION_HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear transcription history:", error);
  }
}