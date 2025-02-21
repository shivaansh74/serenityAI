# SerenityAI

An AI-powered therapeutic companion for emotional well-being and supportive conversations.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshivaansh74%2FserenityAI)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-blue.svg)](https://vitejs.dev/)

> **⚠️ Copyright Notice**  
> This is a private portfolio project by Shivaansh Dhingra. All rights reserved. The code and design of this project are protected by copyright law. This project is not open source and may not be reproduced, distributed, or used for commercial purposes without explicit permission.

## 🌟 Features

- 💬 Natural conversation with AI-powered responses
- 🎙️ Voice input/output with Web Speech API
- 🧘 Breathing exercises and mood tracking
- 🌓 Dark/Light theme with Material-UI
- ⌨️ Keyboard shortcuts for quick access
- 🔔 Desktop notifications
- 📱 Responsive design for all devices
- 🔒 Privacy-focused with local data storage
- 🌍 Multi-language support
- ⚡ Real-time response generation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Modern web browser with Web Speech API support

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shivaansh74/serenityAI.git
   cd serenityAI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` to see the app.

## 🏗️ Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

Or use Vercel CLI:
```bash
npm i -g vercel
vercel
```

### Build for Production

```bash
npm run build
```

## 🎯 Key Features Guide

### Keyboard Shortcuts
- `Enter` - Send message
- `B` - Open breathing exercise
- `M` - Open mood tracker
- `H` - View mood history
- `S` - Open settings
- `T` - Toggle theme
- `R` - View resources
- `C` - Clear chat
- `Esc` - Clear input

### Voice Features
- Click microphone icon or press `V` to start
- Supports continuous speech recognition
- Auto-punctuation and formatting

### Safety Features
- Crisis detection and response
- Emergency resource access
- Professional help recommendations
- Regular safety reminders

## 🛠️ Development

### Project Structure
```
serenity-ai/
├── src/
│   ├── components/     # React components
│   ├── services/       # API and utility services
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript definitions
│   └── styles/         # CSS and styling
├── public/            # Static assets
└── tests/            # Test files
```

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Material-UI + TailwindCSS
- **Build Tool**: Vite
- **AI**: Google Gemini
- **Voice**: Web Speech API
- **Storage**: IndexedDB + LocalStorage

### Code Style
- ESLint configuration included
- Prettier for formatting
- TypeScript strict mode enabled

## 🤝 Contributing

This is a private portfolio project and is not open for contributions. Please do not copy or distribute the code.

## 📝 Legal Notice

Copyright © 2024 Shivaansh Dhingra. All rights reserved.

This project is private and proprietary. No part of this project may be reproduced, modified, or distributed without explicit permission. This project is intended solely for demonstration purposes as part of a professional portfolio.

## 📫 Support

Having issues? Contact me:
- Email: dhingrashivaansh@gmail.com
- GitHub: [@shivaansh74](https://github.com/shivaansh74)
