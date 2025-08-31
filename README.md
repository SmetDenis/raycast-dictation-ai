# Dictation AI

A powerful Raycast extension that converts speech to text using OpenAI's Whisper and formats the output with OpenRouter models. Perfect for quick dictation, note-taking, and professional communication.

> **Note**: This project is a fork of [Advanced Speech to Text](https://www.raycast.com/inakitajes/advanced-speech-to-text) by Iñaki Tajes. Special thanks to Iñaki for creating the original extension that served as the foundation for this enhanced version.

📖 **[Русская версия / Russian version](README_RUS.md)**

## Features

- **Instant Recording**: Auto-starts recording when opened for immediate use
- **High-Quality Transcription**: Uses OpenAI's GPT-4o Transcribe and Whisper models
- **Smart Text Formatting**: Format transcriptions for different contexts using OpenRouter models
- **Multiple Output Formats**: Original, Email, Slack, Report, and Translation modes
- **Recording History**: View and manage past recordings with transcriptions
- **Custom Prompts**: Use custom prompt files for transcription context and formatting
- **Auto-Paste**: Automatically inserts formatted text into the active field
- **Multi-Language Support**: Supports 10+ languages with auto-detection

## Installation

1. Install the extension from the [Raycast Store](https://www.raycast.com/extensions)
2. Install SoX (Sound eXchange) for audio recording:
   ```bash
   # Using Homebrew
   brew install sox
   
   # Using MacPorts
   sudo port install sox
   ```
3. Configure your API keys in Raycast preferences

## Setup

### Required API Keys

1. **OpenAI API Key**: For speech transcription
   - Get your key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Required for Whisper transcription

2. **OpenRouter API Key**: For text formatting
   - Get your key from [OpenRouter](https://openrouter.ai/keys)
   - Required for formatting modes (Email, Slack, Report, Translation)

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
5. Text is automatically pasted to the active field

### Format Modes

While recording, you can choose different output formats:

- **Original**: Raw transcription with auto-paste
- **Email**: Professional email format with greetings and structure
- **Slack**: Clean, casual message formatting
- **Report**: Structured task/project reporting format
- **Translation**: Translate to English or improve English text

### Recording History

- Access via "Recording History" command
- View past recordings with metadata
- Re-transcribe audio files
- Copy transcriptions to clipboard

## Configuration

### Transcription Settings

- **Model**: Choose between GPT-4o Transcribe (latest) or Whisper-1 (classic)
- **Language**: Auto-detect or specify language (English, Spanish, French, etc.)
- **Temperature**: Control transcription creativity (0-1)
- **Context File**: Custom prompt file to improve accuracy for specific terms

### Formatting Settings

- **OpenRouter Model**: Default is `google/gemini-2.5-flash`
- **Custom Prompts**: Override default formatting prompts with custom files

### Custom Prompts

You can provide custom prompt files for better transcription accuracy and formatting:

#### Transcription Context File
Improves speech recognition for specific names, terms, or abbreviations:

```
## Prompt
```
Context for speech recognition:
- Company: Acme Corporation
- Names: John Smith, Sarah Johnson
- Technical terms: Kubernetes, PostgreSQL
- Abbreviations: API, CI/CD, SLA
```

*Note: You can optionally specify a language after the opening backticks (e.g., `xml`, `markdown`) or omit it entirely.*

#### Custom Formatting Prompts
Override default formatting with custom prompts:

```
## Prompt
```markdown
Transform the following text into a casual team update email.
Keep it friendly and conversational, focusing on progress and next steps.
```

## Technical Architecture

### Core Components

- **Dictate Command** (`src/dictate.tsx`): Main recording and transcription workflow
- **Recording History** (`src/recording-history.tsx`): History management interface
- **Audio Recorder Hook** (`src/hooks/useAudioRecorder.ts`): SoX integration for recording

### Audio System

- Uses SoX (Sound eXchange) for cross-platform recording
- Records in WAV format (16kHz, mono, 16-bit) optimized for Whisper
- Automatic SoX detection across common installation paths
- Audio validation and temporary file management

### API Integration

- **OpenAI**: Transcription via Whisper and GPT-4o models
- **OpenRouter**: Text formatting with various LLM providers
- Robust error handling for API rate limits and authentication

### File Management

- Temporary audio files stored in `~/Library/Application Support/com.raycast.macos/extensions/dictation-ai/temp`
- Automatic cleanup of files older than 24 hours
- No persistent data storage beyond temporary audio files

## Development

### Commands

```bash
npm run dev          # Start development mode
npm run build        # Build extension
npm run lint         # Run ESLint
npm run fix-lint     # Fix linting issues
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
│   ├── formatters.ts       # Text formatting with OpenRouter
│   ├── clipboard.ts        # Clipboard operations
│   ├── errors.ts           # Error handling
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
- Ensure SoX is installed and accessible
- Try different microphone input sources

**API Errors**
- Verify OpenAI API key has sufficient credits
- Check OpenRouter API key is valid
- Ensure internet connection is stable

**File Size Limits**
- Maximum audio file size: 25MB (OpenAI limit)
- Minimum audio size: 1KB
- Files are automatically validated before transcription

### Error Messages

- `Sox is not installed`: Install SoX using Homebrew or MacPorts
- `Audio file exceeds 25MB limit`: Recording too long, try shorter sessions
- `OpenAI API key is required`: Configure API key in preferences
- `Transcription failed`: Check API key and internet connection

## Privacy & Security

- Audio files are temporarily stored locally and automatically deleted
- No persistent storage of voice recordings
- API keys are stored securely in Raycast preferences
- All API calls use HTTPS encryption

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

- [Report Issues](https://github.com/smetdenis/raycast-dictation-ai/issues)
- [Raycast Community](https://raycast.com/community)
- [OpenAI Documentation](https://platform.openai.com/docs)
- [OpenRouter Documentation](https://openrouter.ai/docs)
