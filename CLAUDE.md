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

This is a Raycast extension for speech-to-text transcription using OpenAI's Whisper models and text formatting via OpenRouter. The extension provides instant voice recording with automatic transcription and smart text formatting.

### Core Architecture

**Main Components:**
- `src/dictate.tsx` - Primary command that handles the recording → transcription → formatting workflow
- `src/recording-history.tsx` - History management command for viewing/managing past recordings
- `src/hooks/useAudioRecorder.ts` - Audio recording hook using SoX system dependency

**Key Utilities:**
- `src/utils/audio.ts` - Audio file management, SoX integration, and audio validation
- `src/utils/openai.ts` - OpenAI API integration for transcription (Whisper & GPT-4o)
- `src/utils/formatters.ts` - Text formatting with OpenRouter for different output modes
- `src/utils/prompts.ts` - Custom prompt loading and extraction utilities
- `src/utils/clipboard.ts` - Clipboard operations and text pasting automation
- `src/utils/errors.ts` - Centralized error handling for API and system errors

### Data Flow

1. **Recording Phase**: User opens dictate command → auto-starts SoX recording → shows live duration
2. **Transcription Phase**: User stops recording → validates audio file → sends to OpenAI API (Whisper or GPT-4o)
3. **Formatting Phase** (optional): Raw transcription → OpenRouter formatting based on selected mode → final output
4. **Output Phase**: Auto-paste to active field (original mode) or show formatted result for user action

### Format Modes System

The extension supports multiple output formats through a unified system:
- **Original**: Raw transcription, auto-pastes immediately
- **Email**: Professional email formatting with greetings/closings
- **Slack**: Casual message formatting for team communication
- **Report**: Structured task/project reporting format
- **Task**: Structured task list format with actionable items
- **Translate**: Translation to English or English text improvement

Each mode has:
- Default prompts in `src/utils/formatters.ts`
- User-customizable prompts via Raycast preferences (file-based)
- Unified processing through `formatTextWithOpenRouter()` function

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
- `@raycast/utils` - Raycast utility functions
- `openai` - Official OpenAI SDK for transcription
- `title-case` - Text formatting utilities
- `sox` (system) - Audio recording (must be installed separately)

### Testing Setup

Uses Jest with TypeScript support:
- Configuration: `jest.config.js` (ts-jest preset)
- Test files: `**/*.test.ts` or `**/*.spec.ts` patterns
- Coverage: Excludes type definitions and constants files
- Roots: Tests can be in `src/` or dedicated `tests/` directory

### Development Notes

- Extension auto-starts recording when opened for immediate use
- Supports both Whisper-1 and GPT-4o Transcribe models for transcription
- OpenRouter integration for text formatting with multiple model options (default: google/gemini-2.5-flash)
- Temperature setting affects both transcription and formatting creativity
- Multiple language support with auto-detection (10+ languages)
- Custom prompt files supported for both transcription context and formatting
- Two API keys required: OpenAI (transcription) and OpenRouter (formatting)
- SoX must be installed via Homebrew/MacPorts for audio recording
- Use context7 MCP to load Raycast API documentation when developing extensions

### Custom Prompt System

The extension supports custom prompt files for enhanced functionality:
- **Transcription Context**: Improves accuracy for specific names, terms, abbreviations
- **Formatting Prompts**: Custom prompts for Email, Slack, Report, Task, and Translation modes
- **File Format**: Uses `## Prompt` section with optional code blocks for structured content
- **Prompt Loading**: Handled by `src/utils/prompts.ts` with fallback to defaults

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
