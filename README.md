# AI Show 🎭

**AI Show** is a cinematic web application that brings your stories to life through AI-generated theatrical performances.

Enter a situation, choose your mode, and watch as a cast of AI characters with unique personalities and voices re-enact the scene or debate its implications in real-time.

## ✨ Features

- **Two Distinct Modes**:
  - **Story Mode**: A dramatic, "show, don't tell" re-enactment of your situation.
  - **Conversation Mode**: A deep, dynamic discussion between friends about your situation.
- **AI-Powered Casting**: Generates 3-6 distinct characters with unique roles (e.g., "The Provocateur", "The Empathetic") using **Groq AI** (`llama-3.3-70b`).
- **Realistic Voices**: Assigns gender-appropriate, expressive voices using **OpenAI TTS** (`gpt-4o-mini-tts`).
- **Cinematic Visuals**: Features a 3D "ChromaGrid" spotlight system that highlights speakers in real-time.
- **Dynamic Direction**: The AI acts as a director, choosing the most dramatic moment to portray.

## 🛠️ Tech Stack

- **Core**: React 18, TypeScript, Vite
- **AI**: Groq API, OpenAI TTS API
- **Analytics**: PostHog
- **Animation**: GSAP (GreenSock), OGL (WebGL)
- **Routing**: React Router v6
- **Styling**: Vanilla CSS (Component-scoped)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- API Keys for **Groq** and **OpenAI**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/ai-emotions.git
    cd ai-emotions
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Keys**
    > [!IMPORTANT]
    > This project relies on a `src/keys.ignore.ts` file to manage API keys securely. This file is git-ignored to prevent accidental leaks.

    Create a file named `src/keys.ignore.ts` and add the following exports:

    ```typescript
    // src/keys.ignore.ts
    
    // Groq API Key (for story generation)
    // Get it here: https://console.groq.com/keys
    export const groqApiKey = "gsk_...";

    // OpenAI API Key (for voice synthesis)
    // Get it here: https://platform.openai.com/api-keys
    export const openAiTTSApiKey = "sk-proj-...";
    ```

    **Note:** If this file is missing or keys are empty, the app will show an error screen.

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open your browser**
    Navigate to `http://localhost:5173` to start the show!

## 🎮 How to Use

1.  **Enter a Situation**: Type something that happened to you (e.g., "I found out my coworker earns more than me").
2.  **Optional Name**: Add your name for personalized references.
3.  **Select Mode**:
    - Toggle the cookie switch to **Story** for a dramatic scene.
    - Toggle to **Conversation** for a group discussion.
4.  **Start the Show**: Click the button and wait for the magic.
5.  **Watch & Listen**: The characters will appear and start speaking. Use the volume control or pause as needed.

## 📂 Project Structure

- `src/pages`: Main route components (`LandingPage`, `TheatrePage`)
- `src/components`: Reusable UI (`ChromaGrid`, `ModeSwitch`)
- `src/hooks`: AI logic (`usePerspectives`, `usePersonaVoices`)
- `src/constants`: Prompts and character definitions

## ❓ Troubleshooting

### "Configuration Missing" Screen?
Ensure you have created `src/keys.ignore.ts` with valid API keys. See the **Installation** section.

## 📄 License

[Your License Here]
