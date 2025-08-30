/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** OpenAI API Key - Your OpenAI API key */
  "openaiApiKey": string,
  /** Whisper Model - Select the transcription model */
  "model": "gpt-4o-transcribe" | "whisper-1",
  /** Language - Language for transcription (auto-detect if not specified) */
  "language": "auto" | "en" | "es" | "fr" | "de" | "it" | "pt" | "zh" | "ja" | "ko" | "ru",
  /** Custom Prompt - Optional prompt to guide transcription style, terminology, or context */
  "prompt"?: string,
  /** Temperature - Sampling temperature for more creative or conservative transcription */
  "temperature": "0" | "0.2" | "0.5" | "0.8" | "1.0",
  /** Custom Email Prompt - Custom prompt for email formatting (leave empty to use default) */
  "customPromptEmail": string,
  /** Custom Slack Prompt - Custom prompt for Slack message formatting (leave empty to use default) */
  "customPromptSlack": string,
  /** Custom Report Prompt - Custom prompt for report formatting (leave empty to use default) */
  "customPromptReport": string,
  /** Custom Translation Prompt - Custom prompt for English translation (leave empty to use default) */
  "customPromptTranslate": string
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

