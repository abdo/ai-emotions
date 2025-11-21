# AI Show 🎭

**AI Show** is a cinematic web application that brings your stories to life through AI-generated theatrical performances.

Enter a situation, choose your mode, and watch as a cast of AI characters with unique personalities and voices re-enact the scene or debate its implications in real-time.

---

## ✨ Features

- **Two Distinct Modes**:
  - **Story Mode**: A dramatic, "show, don't tell" re-enactment of your situation
  - **Conversation Mode**: A deep, dynamic discussion between friends about your situation
- **AI-Powered Casting**: Generates 3-6 distinct characters with unique roles using **Groq AI** (`llama-3.3-70b-versatile`)
- **Realistic Voices**: Assigns gender-appropriate, expressive voices using **OpenAI TTS** (`gpt-4o-mini-tts`)
- **Cinematic Visuals**: Features a 3D "ChromaGrid" spotlight system that highlights speakers in real-time
- **Dynamic Direction**: The AI acts as a director, choosing the most dramatic moment to portray

---

## 🛠️ Tech Stack

### Frontend
- **Core**: React 19, TypeScript, Vite
- **Animation**: GSAP (GreenSock), OGL (WebGL)
- **Routing**: React Router v7
- **Styling**: Vanilla CSS (Component-scoped)
- **Analytics**: PostHog

### Backend
- **Runtime**: Firebase Cloud Functions (Node.js 24)
- **AI Services**: Groq API (story generation), OpenAI TTS API (voice synthesis)
- **Framework**: TypeScript with Express-style handlers

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v24+ (required for backend functions)
- **Firebase CLI**: Install with `npm install -g firebase-tools`
- **API Keys**:
  - [Groq API Key](https://console.groq.com/keys) (for story generation)
  - [OpenAI API Key](https://platform.openai.com/api-keys) (for voice synthesis)
  - [PostHog API Key](https://posthog.com/) (optional, for analytics)

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-emotions.git
cd ai-emotions
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend/functions
npm install
cd ../..
```

---

## 🔑 Configure API Keys

> [!IMPORTANT]
> This project requires API keys in **two separate locations**: one for the frontend and one for the backend. Both files are git-ignored to prevent accidental leaks.

### Frontend Keys: `src/keys.ignore.ts`

Create a file at `src/keys.ignore.ts` with the following content:

```typescript
// src/keys.ignore.ts

// PostHog API Key (for analytics - optional)
// Get it here: https://posthog.com/
const posthogApiKey = "phc_...";

// Unsplash API Key (optional, for image placeholders)
const unsplashApiKey = "...";

export { posthogApiKey, unsplashApiKey };
```

**Note**: PostHog and Unsplash keys are optional. Leave them as empty strings if not using analytics or custom images.

---

### Backend Keys: `backend/functions/src/keys.ignore.ts`

Create a file at `backend/functions/src/keys.ignore.ts` with the following content:

```typescript
// backend/functions/src/keys.ignore.ts

// Groq API Key (for story generation)
// Get it here: https://console.groq.com/keys
export const groqApiKey = "gsk_...";

// OpenAI API Key (for voice synthesis)
// Get it here: https://platform.openai.com/api-keys
export const openAiTTSApiKey = "sk-proj-...";
```

> [!WARNING]
> The app will fail if these backend keys are missing or invalid. Make sure to add real API keys before running the backend.

---

## 🏃 Running the Application

### Option 1: Run Frontend & Backend Separately (Recommended for Development)

#### Terminal 1: Start the Backend (Firebase Emulator)
```bash
cd backend/functions
npm run serve
```

This will:
- Compile TypeScript to JavaScript
- Start Firebase Functions emulator on `http://localhost:5000`
- The API endpoint will be available at: `http://localhost:5000/ai-show-afb45/us-central1/getShow`

#### Terminal 2: Start the Frontend
```bash
npm run dev
```

This will start the Vite dev server on `http://localhost:5173`

---

### Option 2: Run Frontend Only (Using Deployed Backend)

If you have already deployed the backend to Firebase, you can run just the frontend:

```bash
npm run dev
```

Make sure to update `src/services/api.ts` with your deployed Firebase function URL.

---

## 🎮 How to Use

1. **Enter a Situation**: Type something that happened to you (e.g., "I found out my coworker earns more than me")
2. **Optional Name**: Add your name for personalized character references
3. **Select Mode**:
   - Toggle the switch to **Story** for a dramatic re-enactment
   - Toggle to **Conversation** for a group discussion
4. **Start the Show**: Click the button and wait for AI to generate the content
5. **Watch & Listen**: Characters will appear and speak. Use the volume control or pause button as needed

---

## 📂 Project Structure

```
ai-emotions/
├── src/                          # Frontend source code
│   ├── pages/                    # Route components (LandingPage, TheatrePage)
│   ├── components/               # Reusable UI (ChromaGrid, ModeSwitch, etc.)
│   ├── hooks/                    # Custom React hooks (useShow)
│   ├── services/                 # API client (api.ts)
│   ├── constants/                # Frontend constants
│   └── keys.ignore.ts           # Frontend API keys (git-ignored)
│
├── backend/
│   └── functions/
│       ├── src/
│       │   ├── index.ts         # Firebase function entry point
│       │   ├── services/        # Story & voice generation services
│       │   ├── controllers/     # Request handlers
│       │   ├── constants/       # Prompts and character data
│       │   ├── types/           # TypeScript type definitions
│       │   └── keys.ignore.ts   # Backend API keys (git-ignored)
│       └── package.json
│
├── package.json                 # Frontend dependencies
└── README.md                    # This file
```

---

## 🔧 Available Scripts

### Frontend Commands
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

### Backend Commands (run from `backend/functions/`)
```bash
npm run serve        # Build TypeScript and start Firebase emulator
npm run build        # Compile TypeScript only
npm run build:watch  # Compile TypeScript in watch mode
npm run deploy       # Deploy functions to Firebase (requires Firebase project setup)
npm run logs         # View deployed function logs
```

---

## ❓ Troubleshooting

### Backend Won't Start
- **Issue**: "Cannot find module '../keys.ignore'"
- **Solution**: Make sure you created `backend/functions/src/keys.ignore.ts` with valid `groqApiKey` and `openAiTTSApiKey`

### Frontend Can't Connect to Backend
- **Issue**: API requests fail with network errors
- **Solution**: 
  1. Verify the backend is running on `http://localhost:5000`
  2. Check the API URL in `src/services/api.ts` matches your Firebase emulator URL
  3. Ensure CORS is properly configured in the backend

### Missing Dependencies
- **Issue**: Module not found errors
- **Solution**: Run `npm install` in both the root directory AND `backend/functions/`

### TypeScript Compilation Errors
- **Issue**: Backend won't build due to TypeScript errors
- **Solution**: 
  1. Make sure you're using Node.js v24+ (check with `node -v`)
  2. Run `npm install` in `backend/functions/` to ensure all types are installed
  3. Check that all required files exist in `backend/functions/src/constants/`

---

## 🚀 Deployment

### Deploy Backend to Firebase

1. **Login to Firebase**:
   ```bash
   firebase login
   ```

2. **Initialize Firebase** (if not already done):
   ```bash
   firebase init
   ```

3. **Deploy Functions**:
   ```bash
   cd backend
   firebase deploy --only functions
   ```

4. **Update Frontend API URL**: After deployment, update `src/services/api.ts` with your deployed function URL

### Deploy Frontend

The frontend can be deployed to any static hosting service (Vercel, Netlify, Firebase Hosting, etc.).

**Example with Firebase Hosting**:
```bash
npm run build
firebase deploy --only hosting
```

---

## 📄 License

MIT License - feel free to use this project for your own purposes!

---

## 🙏 Acknowledgments

- **Groq** for lightning-fast LLM inference
- **OpenAI** for natural-sounding text-to-speech
- **Firebase** for serverless backend infrastructure
