# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development and testing
npm run dev          # Start Raycast development mode
npm run build        # Build the extension
npm run lint         # Run ESLint
npm run fix-lint     # Fix ESLint issues automatically
npm run test         # Run Jest tests
npm run test:watch   # Run Jest tests in watch mode
npm run test:coverage # Run Jest tests with coverage report
npm run publish      # Publish to Raycast Store

# Testing specific files or patterns
npx jest src/utils/audio.test.ts              # Run specific test file
npx jest --testNamePattern="SoX detection"    # Run tests matching pattern
npx jest --verbose                             # Run with detailed output
```

## Architecture Overview

This is a Raycast extension for speech-to-text transcription and text formatting using OpenAI's models. The extension provides instant voice recording with automatic transcription and smart text formatting using only OpenAI APIs.

### Core Architecture

**Main Components:**
- `src/dictate.tsx` - Primary command that handles the recording → transcription → formatting workflow
- `src/recording-history.tsx` - History management command for viewing/managing past recordings
- `src/transcription-history.tsx` - History management command for viewing past transcription texts
- `src/hooks/useAudioRecorder.ts` - Audio recording hook using SoX system dependency

**Key Utilities:**
- `src/utils/audio.ts` - Audio file management, SoX integration, and audio validation
- `src/utils/openai.ts` - OpenAI API integration for transcription (Whisper models & GPT-4o Transcribe)
- `src/utils/formatters.ts` - Text formatting with OpenAI's language models for different output modes
- `src/utils/prompts.ts` - Custom prompt loading and extraction utilities
- `src/utils/clipboard.ts` - Clipboard operations and text pasting automation with multiple paste behaviors
- `src/utils/errors.ts` - Centralized error handling for API and system errors
- `src/utils/time.ts` - Time and file size formatting utilities
- `src/utils/history.ts` - Transcription history management with local storage

### Data Flow

1. **Recording Phase**: User opens dictate command → auto-starts SoX recording → shows live duration
2. **Transcription Phase**: User stops recording → validates audio file → sends to OpenAI API (Whisper or GPT-4o Transcribe)
3. **History Storage**: Original transcription is automatically saved to local storage (configurable limit)
4. **Formatting Phase** (optional): Raw transcription → OpenAI language model formatting based on selected mode → final output
5. **Output Phase**: Configurable behavior via paste preferences (paste only, copy and paste, copy only, or show with actions)

### Format Modes System

The extension supports multiple output formats through a unified system:
- **Original**: Raw transcription with configurable paste behavior
- **Email**: Professional email formatting with greetings/closings
- **Slack**: Casual message formatting for team communication
- **Report**: Structured task/project reporting format
- **Task**: Structured task list format with actionable items and checkboxes
- **Translate**: Translation to English or English text improvement

Each mode has:
- Default prompts in `src/utils/formatters.ts`
- User-customizable prompts via Raycast preferences (file-based)
- Unified processing through `formatTextWithChatGPT()` function using OpenAI's language models

### Audio System

Uses SoX (Sound eXchange) as external dependency for cross-platform audio recording:
- Automatic SoX detection across common installation paths: `/usr/local/bin/sox`, `/opt/homebrew/bin/sox`, `/usr/bin/sox`, `sox`
- WAV format recording (16kHz, mono, 16-bit) optimized for Whisper
- Audio validation (size limits: 1KB minimum, 25MB maximum, format verification)
- Temporary file management with automatic cleanup after 24 hours

### Paste Behavior System

Configurable text output behavior via `pasteBehavior` preference:
- **paste**: Paste text directly to active field (no clipboard copy)
- **copy_and_paste**: Copy to clipboard and then paste to active field
- **copy**: Copy to clipboard only (no automatic pasting)
- **show**: Show result with action buttons for manual selection

Clipboard functions in `src/utils/clipboard.ts`:
- `pasteOnly()` - Direct paste to active field with fallback to copy if paste fails
- `copyAndPasteAction()` - Copy to clipboard then paste to active field
- `copyOnly()` - Copy to clipboard with HUD notification
- `copyToClipboard()` - Basic clipboard copy with optional message
- `copyAndPaste()` - Smart handler that routes based on paste behavior preference and returns boolean indicating if UI should show actions

### File Storage

- Audio files: `${environment.supportPath}/temp` (auto-cleanup after 24 hours)
- Transcription history: Raycast LocalStorage (persistent, configurable limit)
- Configuration: Raycast preferences system

### Error Handling

Centralized error management through `src/utils/errors.ts`:
- OpenAI API errors (rate limits, authentication, quota exceeded)
- Audio system errors (SoX missing, recording failures)
- File system errors (permissions, disk space, file validation)
- Custom error classes: `OpenAIError`, `APIKeyError`, `QuotaError`
- User-friendly error messages with actionable guidance

### Key Dependencies

- `@raycast/api` - Raycast extension framework
- `@raycast/utils` - Raycast utility functions (showFailureToast)
- `openai` - Official OpenAI SDK for transcription and text formatting
- `title-case` - Text formatting utilities
- `sox` (system) - Audio recording (must be installed separately)

### Raycast Extension Configuration

**Preferences (package.json):**
- `openaiApiKey` (password, required) - OpenAI API key for all operations
- `model` (textfield) - Transcription model (default: whisper-1, supports: whisper-1, gpt-4o-transcribe)
- `formattingModel` (textfield) - Text formatting model (default: gpt-4o, supports: gpt-4o, gpt-4o-mini, gpt-3.5-turbo)
- `baseURL` (textfield) - OpenAI-compatible API base URL (default: https://api.openai.com/v1)
- `language` (dropdown) - Transcription language with auto-detection support (11 languages)
- `pasteBehavior` (dropdown) - Text output behavior (paste, copy_and_paste, copy, show)
- `temperature` (dropdown) - Sampling temperature (0, 0.2, 0.5, 0.8, 1.0)
- `transcriptionHistoryLimit` (dropdown) - History limit (0=disabled, 5-100 messages, -1=unlimited, default: 10)
- `promptFile` (file) - Custom transcription context file
- Custom prompt files for each format mode (email, slack, report, task, translate)

**Commands:**
- `dictate` - Main recording and transcription command with auto-start
- `recording-history` - View and manage recording history with transcription capability
- `transcription-history` - View history of the last transcribed messages (original text only)

### Keyboard Shortcuts

**During Recording:**
- `Enter` - Stop recording and transcribe with original format
- `Cmd+E` - Stop and format as Email
- `Cmd+S` - Stop and format for Slack
- `Cmd+T` - Stop and format as Task List
- `Cmd+R` - Stop and format as Report
- `Cmd+L` - Stop and translate to English
- `Cmd+.` - Cancel recording

**In Results View:**
- `Cmd+C` - Copy to clipboard
- `Cmd+V` - Copy and paste
- `Cmd+Shift+V` - Paste only
- `Cmd+Shift+C` - Copy only
- `Cmd+E` - Format as Email
- `Cmd+S` - Format for Slack
- `Cmd+T` - Format as Task List
- `Cmd+R` - Format as Report
- `Cmd+L` - Translate to English
- `Cmd+O` - Use original transcription

**In Recording History:**
- `Cmd+C` - Copy transcription
- `Cmd+R` - Re-transcribe file
- `Cmd+Shift+R` - Refresh file list

**In Transcription History:**
- `Cmd+C` - Copy transcription to clipboard
- `Cmd+Delete` - Delete transcription from history
- `Cmd+Shift+Delete` - Clear all history
- `Cmd+R` - Refresh history list

### Testing Setup

Uses Jest with TypeScript support:
- Configuration: `jest.config.js` (ts-jest preset)
- Test files: `**/*.test.ts` or `**/*.spec.ts` patterns in `src/` and `tests/` directories
- Coverage: Excludes type definitions (`*.d.ts`), `types.ts`, and `constants.ts`
- Transform: TypeScript files processed by ts-jest
- Environment: Node.js test environment

### Types and Interfaces

**Core Types (`src/types.ts`):**
- `TranscriptionFile` - Audio file metadata with transcription status
- `ErrorTypes` - Enumeration of all possible error conditions
- `AudioValidationResult` - Audio file validation response
- `FormatMode` - Available text formatting modes ("email" | "slack" | "report" | "task" | "translate" | "original")
- `TranscriptionState` - Recording/processing state machine ("idle" | "recording" | "transcribing" | "completed" | "formatting" | "error")
- `Preferences` - User preference interface matching package.json
- `DetailedTranscriptionResult` - Extended transcription response with metadata

**History Types (`src/utils/history.ts`):**
- `TranscriptionHistoryItem` - Single transcription history entry with text, timestamp, and metadata

**Paste Behavior Type:**
- `PasteBehavior` - "paste" | "copy_and_paste" | "copy" | "show"

### Development Notes

- Extension auto-starts recording when opened for immediate use
- Single API provider: OpenAI for both transcription and text formatting
- Configurable base URL supports OpenAI-compatible APIs
- Temperature setting affects both transcription and formatting creativity
- Multiple language support with auto-detection (11 languages including Russian, Chinese, Japanese)
- Custom prompt files supported for both transcription context and formatting modes
- Only one API key required: OpenAI (for all operations)
- SoX must be installed via Homebrew/MacPorts for audio recording
- ALWAYS! Use context7 MCP tool to access "Raycast API" documentation when developing extensions
- Audio files are automatically cleaned up after 24 hours
- Recording format optimized for Whisper: 16kHz, mono, 16-bit WAV
- Maximum audio file size: 25MB (OpenAI limit)
- Minimum audio file size: 1KB for validation

### Custom Prompt System

The extension supports custom prompt files for enhanced functionality:
- **Transcription Context**: Improves accuracy for specific names, terms, abbreviations (promptFile preference)
- **Formatting Prompts**: Custom prompts for Email, Slack, Report, Task, and Translation modes
- **File Format**: Uses `## Prompt` section with optional code blocks for structured content
- **Prompt Loading**: Handled by `src/utils/prompts.ts` with `extractPromptFromContent()` and fallback to defaults
- **Error Handling**: Graceful fallback to default prompts if custom files fail to load

## Documentation Synchronization Rules

When making changes to the codebase that affect functionality, features, or configuration:

1. **Always update both README files**: Update both `README.md` (English) and `README_RUS.md` (Russian) to reflect code changes
2. **Keep documentation accurate**: Ensure all examples, API references, configuration options, and feature descriptions match the actual code
3. **Sync immediately**: Update documentation in the same session as code changes, not as a separate task
4. **Maintain consistency**: Keep both language versions synchronized - if you update one, update the other
5. **Check for impacts**: When modifying:
   - API interfaces or function signatures
   - Configuration options or preferences
   - Available commands or features
   - Error messages or types
   - File structures or dependencies
   - Installation or setup requirements

Examples of changes that require README updates:
- Adding/removing preferences in package.json
- Changing default values or options
- Adding new commands or features
- Modifying error handling or types
- Changing API integrations
- Updating dependencies or requirements

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
