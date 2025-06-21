# VoiceOS - Voice-Controlled Computer Assistant

VoiceOS is an advanced voice-controlled computer assistant that leverages Kyutai's Delayed Streams Modeling (DSM) for real-time speech recognition and natural computer control.

## Features

### 🎤 Advanced Voice Recognition
- **Kyutai DSM Integration**: Uses state-of-the-art speech-to-text models
- **Real-time Processing**: 0.5-second latency for immediate response
- **Semantic VAD**: Intelligent voice activity detection
- **Multi-language Support**: English and French recognition
- **Word-level Timestamps**: Precise timing for each spoken word

### 🖥️ Computer Control
- **File Operations**: Create, move, delete, and search files
- **Application Management**: Launch, switch, and close applications
- **System Commands**: Volume control, screenshots, screen locking
- **Window Management**: Minimize, maximize, and close windows
- **Cross-platform Support**: Windows, macOS, and Linux

### 🛡️ Safety & Security
- **Confirmation System**: Asks for confirmation on destructive actions
- **Command Validation**: Ensures safe execution of system commands
- **Error Handling**: Graceful failure recovery and user feedback
- **Privacy First**: All processing can be done locally

### 🎨 Modern Interface
- **Real-time Visualization**: Audio waveform and processing indicators
- **Command History**: Track and review executed commands
- **System Monitoring**: Real-time system status and performance
- **Customizable Settings**: Personalize voice recognition and behavior

## Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+ (for Kyutai STT integration)
- Platform-specific dependencies:
  - **Windows**: PowerShell 5.0+
  - **macOS**: Xcode Command Line Tools
  - **Linux**: wmctrl, xdotool, amixer

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/voiceos.git
   cd voiceos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Kyutai STT (Python)**
   ```bash
   pip install moshi>=0.2.6
   # or with uv
   uv add moshi
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the backend server**
   ```bash
   npm run server
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Voice Commands

### File Operations
- "Open calculator"
- "Take a screenshot" 
- "Create new folder"
- "Search for documents"
- "Open [application name]"

### System Control
- "Show desktop"
- "Lock screen"
- "Set volume to [number]"
- "Close current window"
- "Minimize window"
- "Maximize window"

### Custom Commands
VoiceOS supports natural language variations:
- "Open calc" → Opens calculator
- "Take screenshot" → Takes a screenshot
- "Adjust volume to fifty percent" → Sets volume to 50%

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Voice Input   │───▶│  Kyutai DSM     │───▶│ Command Parser  │
│   (Microphone)  │    │  (STT + VAD)    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Voice Response  │◀───│  TTS Engine     │◀───│ Action Engine   │
│   (Speakers)    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                              ┌─────────────────┐    │
                              │ Computer APIs   │◀───┘
                              │ (OS Integration)│
                              └─────────────────┘
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, WebSocket
- **Speech Processing**: Kyutai DSM, Moshi Python package
- **Computer Control**: Platform-specific APIs and command-line tools
- **Build Tool**: Vite
- **Deployment**: Netlify (frontend), Node.js server (backend)

## Development

### Project Structure
```
voiceos/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── contexts/          # React contexts
│   └── main.tsx           # Entry point
├── server/                # Node.js backend
│   ├── index.js           # Server entry point
│   ├── voice-processor.js # STT integration
│   └── command-executor.js# Command execution
├── scripts/               # Python STT scripts
└── configs/               # Kyutai model configs
```

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests  
npm run test:server

# Integration tests
npm run test:integration
```

### Building for Production
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## Kyutai STT Integration

VoiceOS integrates with Kyutai's speech-to-text models:

- **kyutai/stt-1b-en_fr**: 1B parameter model with 0.5s delay
- **kyutai/stt-2.6b-en**: 2.6B parameter English-only model with 2.5s delay

### Model Features
- Streaming inference for real-time transcription
- Batch processing for efficiency (400 streams on H100)
- Word-level timestamps
- Semantic Voice Activity Detection
- Multi-language support (English/French)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Kyutai Labs** for the Delayed Streams Modeling and STT models
- **Moshi** for the Python STT integration package
- **React** and **Node.js** communities for excellent tooling

## Roadmap

- [ ] **Phase 1**: Core speech pipeline and basic commands ✅
- [ ] **Phase 2**: Advanced computer control and screen awareness
- [ ] **Phase 3**: Natural language processing and context understanding  
- [ ] **Phase 4**: Workflow automation and learning capabilities
- [ ] **Phase 5**: Mobile companion app and cloud sync

---

**VoiceOS** - Control your computer naturally with voice commands powered by cutting-edge AI.