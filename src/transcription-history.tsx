import { useState, useEffect } from "react";
import {
  List,
  Action,
  ActionPanel,
  showToast,
  Toast,
  Clipboard,
  Icon,
  Color,
  Alert,
  confirmAlert,
} from "@raycast/api";
import {
  getTranscriptionHistory,
  removeTranscriptionFromHistory,
  clearTranscriptionHistory,
  TranscriptionHistoryItem,
} from "./utils/history";

export default function TranscriptionHistory() {
  const [historyItems, setHistoryItems] = useState<TranscriptionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const items = await getTranscriptionHistory();
      setHistoryItems(items);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to load transcription history",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async (item: TranscriptionHistoryItem) => {
    try {
      await Clipboard.copy(item.originalText);
      await showToast({
        style: Toast.Style.Success,
        title: "Copied to clipboard",
        message: "Transcription text copied",
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to copy",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleDeleteItem = async (item: TranscriptionHistoryItem) => {
    const confirmed = await confirmAlert({
      title: "Delete Transcription",
      message: "Are you sure you want to delete this transcription from history?",
      primaryAction: {
        title: "Delete",
        style: Alert.ActionStyle.Destructive,
      },
    });

    if (confirmed) {
      try {
        await removeTranscriptionFromHistory(item.id);
        await loadHistory();
        await showToast({
          style: Toast.Style.Success,
          title: "Deleted",
          message: "Transcription removed from history",
        });
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to delete",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  };

  const handleClearHistory = async () => {
    const confirmed = await confirmAlert({
      title: "Clear All History",
      message: "Are you sure you want to clear all transcription history? This action cannot be undone.",
      primaryAction: {
        title: "Clear All",
        style: Alert.ActionStyle.Destructive,
      },
    });

    if (confirmed) {
      try {
        await clearTranscriptionHistory();
        await loadHistory();
        await showToast({
          style: Toast.Style.Success,
          title: "History cleared",
          message: "All transcription history has been cleared",
        });
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to clear history",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  };

  const getSubtitle = (item: TranscriptionHistoryItem): string => {
    const date = new Date(item.timestamp).toLocaleDateString();
    const time = new Date(item.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${date} • ${time} • ${item.wordCount} words`;
  };

  const getPreview = (text: string): string => {
    const maxLength = 100;
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search transcriptions..."
      isShowingDetail
    >
      {historyItems.length === 0 ? (
        <List.EmptyView
          icon={Icon.Text}
          title="No transcription history"
          description="Start dictating to see your transcription history"
        />
      ) : (
        historyItems.map((item) => (
          <List.Item
            key={item.id}
            icon={{ source: Icon.Text, tintColor: Color.Blue }}
            title={getPreview(item.originalText)}
            subtitle={getSubtitle(item)}
            actions={
              <ActionPanel>
                <Action
                  title="Copy to Clipboard"
                  onAction={() => handleCopyToClipboard(item)}
                  icon={Icon.Clipboard}
                  shortcut={{ modifiers: ["cmd"], key: "c" }}
                />

                <Action
                  title="Delete from History"
                  onAction={() => handleDeleteItem(item)}
                  icon={Icon.Trash}
                  style={Action.Style.Destructive}
                  shortcut={{ modifiers: ["cmd"], key: "delete" }}
                />

                <ActionPanel.Section>
                  <Action
                    title="Clear All History"
                    onAction={handleClearHistory}
                    icon={Icon.ExclamationMark}
                    style={Action.Style.Destructive}
                    shortcut={{ modifiers: ["cmd", "shift"], key: "delete" }}
                  />

                  <Action
                    title="Refresh History"
                    onAction={loadHistory}
                    icon={Icon.ArrowClockwise}
                    shortcut={{ modifiers: ["cmd"], key: "r" }}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
            detail={
              <List.Item.Detail
                markdown={`## Transcription\n\n${item.originalText}`}
                metadata={
                  <List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.Label
                      title="Date"
                      text={new Date(item.timestamp).toLocaleDateString()}
                    />
                    <List.Item.Detail.Metadata.Label
                      title="Time"
                      text={new Date(item.timestamp).toLocaleTimeString()}
                    />
                    <List.Item.Detail.Metadata.Label
                      title="Word Count"
                      text={item.wordCount.toString()}
                    />
                    <List.Item.Detail.Metadata.Label
                      title="Character Count"
                      text={item.originalText.length.toString()}
                    />
                  </List.Item.Detail.Metadata>
                }
              />
            }
          />
        ))
      )}
    </List>
  );
}