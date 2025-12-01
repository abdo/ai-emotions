// ============================================================================
// talk-bun.ts - Self-Contained Bun WebSocket Server for Deepgram Voice Agent
// ============================================================================
// TypeScript version for Railway deployment using Bun's native WebSocket support

// Bun type declarations (for TypeScript editing - Bun runtime provides these globally)
declare const Bun: any;


const PORT = process.env.PORT || 3001;
const DEEPGRAM_KEY = process.env.DEEPGRAM_KEY;

// ============================================================================
// DEEPGRAM CONFIGURATION
// ============================================================================

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
      prompt: "You are a helpful assistant."
    },
    greeting: "Hello! How may I help you?"
  }
};

// ============================================================================
// BUN WEBSOCKET SERVER
// ============================================================================

Bun.serve({
  port: PORT as number,

  fetch(req: Request, server: any): Response | undefined {
    const url = new URL(req.url);

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'deepgram-voice-server-bun' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // WebSocket upgrade for /talk endpoint
    if (url.pathname === '/talk') {
      const success = server.upgrade(req);
      if (success) {
        return undefined; // Return undefined when upgrade succeeds
      }
      return new Response('WebSocket upgrade failed', { status: 400 });
    }

    return new Response('Not found', { status: 404 });
  },

  websocket: {
    open(ws: any) {
      console.log('[Client] Connected');

      if (!DEEPGRAM_KEY) {
        console.error('[Error] DEEPGRAM_KEY not found in environment');
        ws.send(JSON.stringify({ type: 'Error', error: 'Server configuration error' }));
        ws.close();
        return;
      }

      // Connect to Deepgram
      const deepgramWs = new WebSocket('wss://agent.deepgram.com/v1/agent/converse', {
        headers: {
          'Authorization': `Token ${DEEPGRAM_KEY}`
        }
      });

      // Store Deepgram WebSocket reference on client WebSocket
      (ws as any).deepgramWs = deepgramWs;

      deepgramWs.onopen = () => {
        console.log('[Deepgram] Connected');
        deepgramWs.send(JSON.stringify(DEEPGRAM_CONFIG));
        console.log('[Deepgram] Configuration sent');
      };

      deepgramWs.onmessage = (event: MessageEvent) => {
        const data = event.data;

        // Handle different data types from Deepgram
        if (typeof data === 'string') {
          // Text message - parse and log type
          try {
            const parsed = JSON.parse(data);
            console.log('[Deepgram →] Message type:', parsed.type);
          } catch (e) {
            // Not JSON, just pass through
          }
          ws.send(data);
        } else if (data instanceof ArrayBuffer || data instanceof Blob) {
          // Binary audio data - pass through
          ws.send(data);
        } else {
          // Unknown type - try to send as-is
          ws.send(data);
        }
      };

      deepgramWs.onclose = () => {
        console.log('[Deepgram] Disconnected');
      };

      deepgramWs.onerror = (error: any) => {
        console.error('[Deepgram] Error:', error);
        ws.send(JSON.stringify({ type: 'Error', error: 'Deepgram connection failed' }));
      };
    },

    message(ws: any, message: string | Buffer) {
      // Forward client messages to Deepgram
      const deepgramWs = (ws as any).deepgramWs;
      if (deepgramWs && deepgramWs.readyState === WebSocket.OPEN) {
        deepgramWs.send(message);
      }
    },

    close(ws: any) {
      console.log('[Client] Disconnected');
      const deepgramWs = (ws as any).deepgramWs;
      if (deepgramWs && deepgramWs.readyState === WebSocket.OPEN) {
        deepgramWs.close();
      }
    },

    error(ws: any, error: Error) {
      console.error('[Client] Error:', error.message);
    }
  }
});

console.log(`🚀 Bun WebSocket server running on http://localhost:${PORT}`);
console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/talk`);

// Make this file a proper ES module to avoid global scope conflicts
export { };
