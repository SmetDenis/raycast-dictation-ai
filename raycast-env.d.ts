/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** OpenAI API Key - Your OpenAI API key for speech transcription */
  "openaiApiKey": string,
  /** OpenRouter API Key - Your OpenRouter API key for text formatting */
  "openrouterApiKey": string,
  /** OpenRouter Model - OpenRouter model ID for text formatting (e.g., google/gemini-2.5-flash, openai/gpt-4o-mini, anthropic/claude-3.5-sonnet) */
  "openrouterModel": string,
  /** Whisper Model - Select the transcription model */
  "model": "gpt-4o-transcribe" | "whisper-1",
  /** Language - Language for transcription (auto-detect if not specified) */
  "language": "auto" | "en" | "es" | "fr" | "de" | "it" | "pt" | "zh" | "ja" | "ko" | "ru",
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

