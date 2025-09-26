# Dictation AI

A powerful Raycast extension that converts speech to text and formats the output using OpenAI's advanced language models. Perfect for quick dictation, note-taking, and professional communication with intelligent text formatting.

> **Note**: This project is a fork of [Advanced Speech to Text](https://www.raycast.com/inakitajes/advanced-speech-to-text) by Iñaki Tajes. Special thanks to Iñaki for creating the original extension that served as the foundation for this enhanced version.

📖 **[Русская версия / Russian version](README_RUS.md)**

## Features

- **Instant Recording**: Auto-starts recording when opened for immediate use
- **High-Quality Transcription**: Uses OpenAI's Whisper-1 and GPT-4o Transcribe models
- **Smart Text Formatting**: Format transcriptions using OpenAI's language models (GPT-4o, GPT-4o-mini)
- **Multiple Output Formats**: Original, Email, Slack, Report, Task List, and Translation modes
- **Flexible Paste Behavior**: Four modes - paste only, copy & paste, copy only, or show with action buttons
- **Recording History**: View and manage past recordings with transcriptions
- **Custom Prompts**: Use custom prompt files for transcription context and formatting
- **Keyboard Shortcuts**: Comprehensive hotkeys for efficient workflow
- **Multi-Language Support**: Supports 11 languages with auto-detection
- **OpenAI-Compatible APIs**: Configurable base URL for alternative providers

## Installation

1. Install the extension from the [Raycast Store](https://www.raycast.com/extensions)
2. Install SoX (Sound eXchange) for audio recording:
   ```bash
   # Using Homebrew
   brew install sox

   # Using MacPorts
   sudo port install sox
   ```
3. Configure your OpenAI API key in Raycast preferences

## Setup

### Required API Key

**OpenAI API Key**: For both speech transcription and text formatting
- Get your key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Single API key handles all operations (transcription and formatting)

### System Requirements

- **SoX**: Required for audio recording
- **macOS**: Raycast extension platform
- **Microphone**: For audio input

## Usage

### Basic Dictation

1. Open Raycast and type "Dictate"
2. Recording starts automatically
3. Speak your message
4. Press Enter to stop and transcribe
5. Text behavior depends on paste preference setting

### Format Modes

While recording, you can choose different output formats using keyboard shortcuts:

- **Original** (Enter): Raw transcription with configurable paste behavior
- **Email** (Cmd+E): Professional email format with greetings and structure
- **Slack** (Cmd+S): Clean, casual message formatting
- **Report** (Cmd+R): Structured task/project reporting format
- **Task** (Cmd+T): Structured task list with checkboxes and action items
- **Translation** (Cmd+L): Translate to English or improve English text

### Paste Behavior Options

Configure how text is handled after transcription:

- **Paste only**: Direct paste to active field (no clipboard copy)
- **Copy and paste**: Copy to clipboard then paste to active field
- **Copy only**: Copy to clipboard without automatic pasting
- **Show with action buttons**: Display result with manual action selection

### Keyboard Shortcuts

**During Recording:**
- `Enter` - Stop and transcribe with original format
- `Cmd+E` - Stop and format as Email
- `Cmd+S` - Stop and format for Slack
- `Cmd+T` - Stop and format as Task List
- `Cmd+R` - Stop and format as Report
- `Cmd+L` - Stop and translate to English
- `Cmd+.` - Cancel recording

**In Results View:**
- `Enter` - Paste to selected field (primary action)
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
- `Cmd+N` - New recording

### Recording History

- Access via "Recording History" command
- View past recordings with metadata (duration, size, word count)
- Re-transcribe audio files with current settings
- Copy transcriptions to clipboard
- Automatic file cleanup after 24 hours

## Configuration

### Transcription Settings

- **Model**: Text field for any OpenAI transcription model (default: whisper-1)
  - Examples: whisper-1, gpt-4o-transcribe
- **Language**: Auto-detect or specify language (English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Russian)
- **Temperature**: Control transcription creativity (0, 0.2, 0.5, 0.8, 1.0)
- **Context File**: Custom prompt file to improve accuracy for specific terms

### Formatting Settings

- **Formatting Model**: Text field for any OpenAI language model (default: gpt-4o)
  - Examples: gpt-4o, gpt-4o-mini, gpt-3.5-turbo
- **Base URL**: OpenAI-compatible API endpoint (default: https://api.openai.com/v1)
- **Custom Prompts**: Override default formatting prompts with custom files

### Paste Behavior

- **Paste Behavior**: Choose how text is handled after processing
  - Paste only, Copy and paste, Copy only, Show with action buttons

### Custom Prompts

You can provide custom prompt files for better transcription accuracy and formatting:

#### Transcription Context File
Improves speech recognition for specific names, terms, or abbreviations:

```
## Prompt
Context for speech recognition:
- Company: Acme Corporation
- Names: John Smith, Sarah Johnson
- Technical terms: Kubernetes, PostgreSQL
- Abbreviations: API, CI/CD, SLA
```

#### Custom Formatting Prompts
Override default formatting with custom prompts:

```
## Prompt
Transform the following text into a casual team update email.
Keep it friendly and conversational, focusing on progress and next steps.
```

## Technical Architecture

### Core Components

- **Dictate Command** (`src/dictate.tsx`): Main recording and transcription workflow with state management
- **Recording History** (`src/recording-history.tsx`): History management interface
- **Audio Recorder Hook** (`src/hooks/useAudioRecorder.ts`): SoX integration for recording

### Audio System

- Uses SoX (Sound eXchange) for cross-platform recording
- Records in WAV format (16kHz, mono, 16-bit) optimized for Whisper
- Automatic SoX detection across common installation paths: `/usr/local/bin/sox`, `/opt/homebrew/bin/sox`, `/usr/bin/sox`
- Audio validation (1KB minimum, 25MB maximum) and temporary file management

### API Integration

- **OpenAI**: Single provider for both transcription and text formatting
- Configurable base URL supports OpenAI-compatible APIs
- Robust error handling for API rate limits, authentication, and quota issues
- Temperature setting affects both transcription and formatting

### File Management

- Temporary audio files stored in `~/Library/Application Support/com.raycast.macos/extensions/dictation-ai/temp`
- Automatic cleanup of files older than 24 hours
- No persistent data storage beyond temporary audio files
- File validation and size limit enforcement

### Clipboard Operations

Advanced clipboard management with multiple paste behaviors:
- Direct paste with fallback to copy
- Smart routing based on user preferences
- HUD notifications for user feedback
- Error handling with graceful degradation

## Development

### Commands

```bash
npm run dev          # Start Raycast development mode
npm run build        # Build the extension
npm run lint         # Run ESLint
npm run fix-lint     # Fix ESLint issues automatically
npm run test         # Run Jest tests
npm run test:watch   # Run Jest tests in watch mode
npm run test:coverage # Run Jest tests with coverage report
npm run publish      # Publish to Raycast Store
```

### Project Structure

```
src/
├── dictate.tsx              # Main dictation command
├── recording-history.tsx    # History management
├── hooks/
│   └── useAudioRecorder.ts  # Audio recording logic
├── utils/
│   ├── audio.ts            # SoX integration & file management
│   ├── openai.ts           # OpenAI API integration
│   ├── formatters.ts       # Text formatting with OpenAI models
│   ├── clipboard.ts        # Clipboard operations with paste behaviors
│   ├── errors.ts           # Centralized error handling
│   ├── prompts.ts          # Custom prompt loading utilities
│   └── time.ts             # Time/size formatting utilities
├── types.ts                # TypeScript definitions
└── constants.ts            # Configuration constants
```

## Troubleshooting

### Common Issues

**SoX not installed**
```bash
# Install via Homebrew
brew install sox
```

**Recording not working**
- Check microphone permissions in System Preferences
- Ensure SoX is installed and accessible in PATH
- Try different microphone input sources
- Verify audio input levels

**API Errors**
- Verify OpenAI API key has sufficient credits
- Check API key permissions for audio and chat endpoints
- Ensure internet connection is stable
- Try different base URL if using alternative provider

**File Size Limits**
- Maximum audio file size: 25MB (OpenAI limit)
- Minimum audio size: 1KB for validation
- Files are automatically validated before transcription
- Long recordings may hit size limits

**Paste/Clipboard Issues**
- Check app permissions for clipboard access
- Try different paste behavior settings
- Verify target application accepts clipboard input
- Use "Show with action buttons" mode for manual control

### Error Messages

- `Sox is not installed`: Install SoX using Homebrew or MacPorts
- `Audio file exceeds 25MB limit`: Recording too long, try shorter sessions
- `OpenAI API key is required`: Configure API key in preferences
- `Transcription failed`: Check API key, credits, and internet connection
- `Audio file is too short`: Ensure minimum 1KB file size
- `Paste Error`: Target application may not accept clipboard input

## Privacy & Security

- Audio files are temporarily stored locally and automatically deleted after 24 hours
- No persistent storage of voice recordings
- API keys are stored securely in Raycast preferences
- All API calls use HTTPS encryption
- No telemetry or usage tracking
- Local processing with external API calls only for transcription/formatting

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation as needed
6. Submit a pull request

## Support

- [Report Issues](https://github.com/smetdenis/raycast-dictation-ai/issues)
- [Raycast Community](https://raycast.com/community)
- [OpenAI Documentation](https://platform.openai.com/docs)

## Changelog

### Recent Updates

- **Unified OpenAI Integration**: Removed OpenRouter dependency, now uses only OpenAI for all operations
- **Flexible Model Configuration**: Text fields for custom model selection
- **Enhanced Paste Behavior**: Four distinct modes including "show with actions"
- **Comprehensive Keyboard Shortcuts**: Full hotkey support for efficient workflow
- **OpenAI-Compatible APIs**: Configurable base URL for alternative providers
- **Improved Error Handling**: Better error messages and recovery options