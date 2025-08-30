# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development and testing
npm run dev          # Start Raycast development mode
npm run build        # Build the extension
npm run lint         # Run ESLint
npm run fix-lint     # Fix ESLint issues automatically
npm run publish      # Publish to Raycast Store
```

## Architecture Overview

This is a Raycast extension for speech-to-text transcription using OpenAI's Whisper and GPT models. The extension provides instant voice recording with automatic transcription and smart text formatting.

### Core Architecture

**Main Components:**
- `src/dictate.tsx` - Primary command that handles the recording → transcription → formatting workflow
- `src/recording-history.tsx` - History management command for viewing/managing past recordings
- `src/hooks/useAudioRecorder.ts` - Audio recording hook using SoX system dependency

**Key Utilities:**
- `src/utils/audio.ts` - Audio file management, SoX integration, and audio validation
- `src/utils/openai.ts` - OpenAI API integration for transcription
- `src/utils/formatters.ts` - Text formatting with ChatGPT for different output modes (email, slack, report, translate)
- `src/utils/clipboard.ts` - Clipboard operations and text pasting automation

### Data Flow

1. **Recording Phase**: User opens dictate command → auto-starts SoX recording → shows live duration
2. **Transcription Phase**: User stops recording → validates audio file → sends to OpenAI Whisper API
3. **Formatting Phase** (optional): Raw transcription → ChatGPT formatting based on selected mode → final output
4. **Output Phase**: Auto-paste to active field (original mode) or show formatted result for user action

### Format Modes System

The extension supports multiple output formats through a unified system:
- **Original**: Raw transcription, auto-pastes immediately
- **Email**: Professional email formatting with greetings/closings
- **Slack**: Casual message formatting for team communication  
- **Report**: Structured task/project reporting format
- **Translate**: Translation to English or English text improvement

Each mode has:
- Default prompts in `src/utils/formatters.ts`
- User-customizable prompts via Raycast preferences
- Unified processing through `formatTextWithChatGPT()` function

### Audio System

Uses SoX (Sound eXchange) as external dependency for cross-platform audio recording:
- Automatic SoX detection across common installation paths
- WAV format recording (16kHz, mono, 16-bit) optimized for Whisper
- Audio validation (size limits, format verification)
- Temporary file management with automatic cleanup

### File Storage

- Audio files: `${environment.supportPath}/temp` (auto-cleanup)
- Configuration: Raycast preferences system
- No persistent data storage beyond temporary audio files

### Error Handling

Centralized error management through `src/utils/errors.ts`:
- OpenAI API errors (rate limits, authentication, etc.)
- Audio system errors (SoX missing, recording failures)
- File system errors (permissions, disk space)
- User-friendly error messages with actionable guidance

### Key Dependencies

- `@raycast/api` - Raycast extension framework
- `openai` - Official OpenAI SDK for transcription and formatting
- `sox` (system) - Audio recording (must be installed separately)
- `title-case` - Text formatting utilities

### Development Notes

- Extension auto-starts recording when opened for immediate use
- Temperature setting affects both transcription and formatting creativity
- Multiple language support with auto-detection
- Requires OpenAI API key configuration
- SoX must be installed via Homebrew/MacPorts for audio recording