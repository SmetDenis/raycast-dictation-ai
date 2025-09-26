/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** OpenAI API Key - Your OpenAI API key for speech transcription */
  "openaiApiKey": string,
  /** Transcription Model - OpenAI model for speech transcription (e.g., whisper-1, gpt-4o-transcribe) */
  "model": string,
  /** Formatting Model - OpenAI model for text formatting (e.g., gpt-4o, gpt-4o-mini, gpt-3.5-turbo) */
  "formattingModel": string,
  /** Base URL - OpenAI-compatible API base URL for both transcription and formatting */
  "baseURL": string,
  /** Language - Language for transcription (auto-detect if not specified) */
  "language": "auto" | "en" | "es" | "fr" | "de" | "it" | "pt" | "zh" | "ja" | "ko" | "ru",
  /** Paste Behavior - What to do with formatted text after transcription */
  "pasteBehavior": "paste" | "copy_and_paste" | "copy" | "show",
  /** Custom Transcription Context File - File with context to improve speech recognition accuracy (names, technical terms, abbreviations) */
  "promptFile"?: string,
  /** Temperature - Sampling temperature for more creative or conservative transcription */
  "temperature": "0" | "0.2" | "0.5" | "0.8" | "1.0",
  /** Custom Email Prompt File - File containing custom email prompt (leave empty to use default) */
  "customPromptEmailFile"?: string,
  /** Custom Slack Prompt File - File containing custom Slack prompt (leave empty to use default) */
  "customPromptSlackFile"?: string,
  /** Custom Report Prompt File - File containing custom report prompt (leave empty to use default) */
  "customPromptReportFile"?: string,
  /** Custom Task Prompt File - File containing custom task prompt (leave empty to use default) */
  "customPromptTaskFile"?: string,
  /** Custom Translation Prompt File - File containing custom translation prompt (leave empty to use default) */
  "customPromptTranslateFile"?: string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `dictate` command */
  export type Dictate = ExtensionPreferences & {}
  /** Preferences accessible in the `recording-history` command */
  export type RecordingHistory = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `dictate` command */
  export type Dictate = {}
  /** Arguments passed to the `recording-history` command */
  export type RecordingHistory = {}
}

