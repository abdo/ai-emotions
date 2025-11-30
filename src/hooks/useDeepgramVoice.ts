import { useState, useCallback, useRef, useEffect } from 'react';

interface DeepgramMessage {
  type: string;
  [key: string]: unknown;
}

interface ConversationTextMessage {
  type: 'ConversationText';
  role: string;
  content: string;
  [key: string]: unknown;
}

// Type guard to safely check if a message is a ConversationTextMessage
function isConversationTextMessage(message: DeepgramMessage): message is ConversationTextMessage {
  return (
    message.type === 'ConversationText' &&
    typeof (message as any).role === 'string' &&
    typeof (message as any).content === 'string'
  );
}

const DEEPGRAM_CONFIG = {
  type: "Settings",
  audio: {
    input: {
      encoding: "linear16",
      sample_rate: 48000
    },
    output: {
      encoding: "linear16",
      sample_rate: 24000,
      container: "none"
    }
  },
  agent: {
    language: "en",
    speak: {
      provider: {
        type: "eleven_labs",
        model_id: "eleven_multilingual_v2",
        voice_id: "cgSgspJ2msm6clMCkdW9"
      }
    },
    listen: {
      provider: {
        type: "deepgram",
        version: "v1",
        model: "nova-3"
      }
    },
    think: {
      provider: {
        type: "groq",
        model: "openai/gpt-oss-20b"
      },
      prompt: `You are a friendly English teacher having a REAL conversation with your student.

## CRITICAL RULE:

**ALWAYS respond to what they said FIRST, like a normal person would. THEN teach.**

If they ask you a question → Answer it naturally
If they tell you something → Respond to it genuinely  
If they share a story → React and engage with it

**ONLY AFTER** responding naturally should you add a brief correction or teaching point.

## BAD EXAMPLE (Too robotic):

User: "How is you today?"
❌ AI: "Hey! I think you meant 'How ARE you today?' - the verb goes before the subject."

## GOOD EXAMPLE (Natural conversation):

User: "How is you today?"
✅ AI: "I'm doing great, thanks for asking! Just finished my morning coffee. How about you - how's your day going so far? 

Oh, quick note: it's 'how ARE you' not 'how IS you' - 'you' always pairs with 'are' in English."

---

## YOUR PROCESS (Every Response):

1. **Read what they said** - What are they asking/telling/sharing?
2. **Respond naturally** - Answer their question or react to their statement (2-4 sentences)
3. **Continue the conversation** - Ask a follow-up question or share something relevant
4. **Then teach** - Add ONE brief correction/tip naturally (1-2 sentences)

## CORRECTION STYLE:

Vary how you correct - don't be formulaic:

- "By the way..."
- "Oh, just so you know..."
- "Quick thing..."
- "One small note..."
- "I noticed you said... it's actually..."
- Sometimes just model correct usage naturally in your response

## REMEMBER:

You're a PERSON who happens to be teaching, not a teaching robot.  
Have a real conversation. Teach while chatting.`
    },
    greeting: "Hello! How may I help you?"
  }
};

export function useDeepgramVoice(onAudioData: (base64Audio: string) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const keepAliveIntervalRef = useRef<number | null>(null);

  const connect = useCallback(() => {
    const apiKey = import.meta.env.VITE_DEEPGRAM_KEY;
    if (!apiKey) {
      setError('Deepgram API key is missing');
      return;
    }

    try {
      // Use WebSocket subprotocol for authentication (browser-compatible)
      const ws = new WebSocket(
        'wss://agent.deepgram.com/v1/agent/converse',
        ['token', apiKey]
      );
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');

        // Send configuration (no authorization field needed - already in URL)
        ws.send(JSON.stringify(DEEPGRAM_CONFIG));
        console.log('📤 Configuration sent');
      };

      ws.onmessage = (event) => {
        // Handle binary messages (audio data)
        if (event.data instanceof Blob) {
          event.data.arrayBuffer().then((buffer) => {
            const base64Audio = btoa(
              String.fromCharCode(...new Uint8Array(buffer))
            );
            console.log('� Received audio data');
            onAudioData(base64Audio);
          });
          return;
        }

        // Handle text messages (JSON)
        try {
          const message: DeepgramMessage = JSON.parse(event.data);
          console.log('📥 Received:', message.type);

          switch (message.type) {
            case 'SettingsApplied':
              console.log('⚙️ Settings applied');
              setIsConnected(true);
              setError(null);

              // Start keep-alive after settings are applied
              keepAliveIntervalRef.current = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({ type: 'KeepAlive' }));
                  console.log('💓 KeepAlive sent');
                }
              }, 5000);
              break;

            case 'Welcome':
              console.log('👋 Welcome received');
              break;

            case 'ConversationText': {
              if (isConversationTextMessage(message)) {
                if (message.role === 'user') {
                  setUserTranscript(message.content);
                } else if (message.role === 'assistant') {
                  setAgentResponse(message.content);
                }
              }
              break;
            }

            case 'UserStartedSpeaking':
              console.log('🎤 User started speaking');
              setUserTranscript('');
              break;

            case 'AgentStartedSpeaking':
              console.log('🔊 Agent started speaking');
              break;

            case 'Error':
              console.error('❌ Deepgram error:', message);
              setError(JSON.stringify(message));
              break;

            default:
              console.log('ℹ️ Other message:', message.type, message);
          }
        } catch (err) {
          console.error('Failed to parse message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('❌ WebSocket error:', event);
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setIsConnected(false);
        if (keepAliveIntervalRef.current) {
          clearInterval(keepAliveIntervalRef.current);
        }
      };

    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  }, [onAudioData]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
    setIsConnected(false);
    setUserTranscript('');
    setAgentResponse('');
  }, []);

  const sendAudio = useCallback((audioData: ArrayBuffer) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Send audio as binary (not JSON!)
      wsRef.current.send(audioData);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    sendAudio,
    isConnected,
    userTranscript,
    agentResponse,
    error
  };
}
