// Node.js WebSocket Server for Interview with Deepgram Voice Agent
import 'dotenv/config';
import WebSocket from 'ws';
import axios from 'axios';
import { URL } from 'url';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const DEEPGRAM_KEY = process.env.DEEPGRAM_KEY;

const interviewers = [
  {
    name: "Kevin McCannly",
    speakObject: {
      provider: {
        type: "eleven_labs",
        model_id: "eleven_multilingual_v2",
        voice_id: "onwK4e9ZLuTAKqWW03F9"
      }
    }
  },
  {
    name: "Michael Crickett",
    speakObject: {
      "provider": {
        "type": "deepgram",
        "model": "aura-2-odysseus-en"
      }
    },
  },
  {
    name: "Tom Bradshaw",
    speakObject: {
      "provider": {
        "type": "deepgram",
        "model": "aura-arcas-en"
      }
    },
  },
  {
    name: "Lauren Ashford",
    speakObject: {
      "provider": {
        "type": "deepgram",
        "model": "aura-2-delia-en"
      }
    },
  }
];

// Meta-prompt template for generating interviewer prompts
function getInterviewerMetaPrompt(role: string, interviewerName: string): string {
  return `You are an expert prompt engineer. Create a comprehensive prompt for an AI voice agent that will conduct a technical interview. The interview is for a ${role} position. The interviewer's name is ${interviewerName}.

Requirements for the prompt you create:

INTERVIEW STYLE: This is a technical expert interview, not an HR screening. The agent should act as a senior professional in the field where ${role}s work, someone who is evaluating the candidate's technical knowledge, problem-solving approach, and real-world experience. The tone should be professional but conversational and encouraging.

STRUCTURE: Design an appropriate interview structure with multiple phases that makes sense for evaluating a ${role}. Provide example questions for each phase you create, but explicitly tell the agent they can deviate and ask follow-up questions based on the candidate's responses. The agent should have a natural conversation, not rigidly follow a script.

VOICE-ONLY CONSTRAINTS: The agent must NEVER ask coding questions or anything requiring the user to write, read, or see code. All questions must be answerable through spoken explanation only. Focus on conceptual understanding, architectural decisions, trade-offs, past experiences, and hypothetical scenarios.

PACING: Keep the interview concise, around 20-30 minutes total. The agent should ask ONE question at a time and wait for the complete response before moving on. Never bombard the candidate with multiple questions at once. Give the candidate space to think and elaborate.

PERSONALITY: The interviewer name is ${interviewerName}. If the candidate asks personal questions like where they worked before, their background, or their experience in the field where ${role}s work, the agent should respond naturally as a human would, making up reasonable and contextually appropriate details. They should never reveal they are an AI.

FEEDBACK: At the end of the interview, the agent MUST provide honest, constructive feedback. This should include what the candidate did well, areas for improvement, and an assessment of how they performed. Be direct but respectful. The candidate should leave with a clear understanding of their performance.

CRITICAL FORMATTING RULE: The agent must speak in plain natural text only, with no special formatting whatsoever. No asterisks for bold or italics, no bullet points, no numbered lists, no dashes, no special characters. This is essential because the output goes directly to a text-to-speech system that cannot handle markdown or special formatting. Everything should be spoken naturally as if having a normal conversation.

Now generate the complete interviewer prompt following all these requirements. The prompt should begin with "You are" and be written in plain text that can be directly fed to the voice agent.`;
}

// Generate interviewer prompt using Groq API
async function generateInterviewerPrompt(role: string, interviewerName: string): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is missing');
  }

  const metaPrompt = getInterviewerMetaPrompt(role, interviewerName);

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        messages: [{ role: "user", content: metaPrompt }],
        model: "openai/gpt-oss-120b",
        temperature: 0.7,
        max_tokens: 3000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Groq API');
    }

    return content.replace(/\*/g, '').trim();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Groq] Failed to generate interviewer prompt:', errorMessage);
    throw new Error(`Failed to generate interviewer prompt: ${errorMessage}`);
  }
}

// Create Deepgram config with custom prompt
function getDeepgramConfig(prompt: string, greeting: string, speakConfig: any) {
  return {
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
      speak: speakConfig,
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
        prompt: prompt
      },
      greeting: greeting
    }
  };
}

// Export WebSocket handler for interview sessions
export function setupInterviewWebSocket(wss: WebSocket.Server): void {
  wss.on('connection', (clientWs: WebSocket, req) => {
    console.log('[Interview] Client connected');

    // Parse URL query parameters
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const role = url.searchParams.get('role');
    const requestedInterviewerName = url.searchParams.get('interviewerName');

    console.log('[Interview] Role from URL:', role);
    console.log('[Interview] Requested Interviewer:', requestedInterviewerName);

    // Validate role parameter
    if (!role) {
      console.error('[Interview] Missing required "role" parameter');
      clientWs.send(JSON.stringify({
        type: 'Error',
        error: 'Missing required parameter: role'
      }));
      clientWs.close();
      return;
    }

    let deepgramWs: WebSocket | null = null;

    // Start async initialization in background
    (async () => {
      try {
        //Validate environment
        if (!DEEPGRAM_KEY) {
          throw new Error('DEEPGRAM_KEY not found in environment');
        }

        // Select interviewer based on request or default to first
        let selectedInterviewer = interviewers[0];
        if (requestedInterviewerName) {
          const found = interviewers.find(i => i.name === requestedInterviewerName);
          if (found) {
            selectedInterviewer = found;
          } else {
            console.warn(`[Interview] Requested interviewer "${requestedInterviewerName}" not found, defaulting to ${selectedInterviewer.name}`);
          }
        }

        console.log(`[Interview] Using interviewer: ${selectedInterviewer.name}`);

        // Step 1: Generate interviewer prompt using Groq
        console.log('[Interview] Generating interviewer prompt via Groq...');
        const interviewerPrompt = await generateInterviewerPrompt(role, selectedInterviewer.name);
        console.log('[Interview] Prompt generated successfully');

        // Step 2: Create Deepgram config with generated prompt
        const DEEPGRAM_CONFIG = getDeepgramConfig(
          interviewerPrompt,
          "Hello, welcome to your interview.",
          selectedInterviewer.speakObject
        );

        // Step 3: Connect to Deepgram
        deepgramWs = new WebSocket('wss://agent.deepgram.com/v1/agent/converse', {
          headers: { 'Authorization': `Token ${DEEPGRAM_KEY}` }
        });

        deepgramWs.on('open', () => {
          console.log('[Deepgram] Connected');
          deepgramWs!.send(JSON.stringify(DEEPGRAM_CONFIG));
          console.log('[Deepgram] Configuration sent');
        });

        deepgramWs.on('message', (data: WebSocket.RawData) => {
          const isBinary = Buffer.isBuffer(data);

          if (clientWs.readyState === WebSocket.OPEN) {
            if (isBinary) {
              try {
                const text = data.toString('utf8');
                const parsed = JSON.parse(text);
                console.log('[Deepgram →] Message type:', parsed.type);
                clientWs.send(text);
              } catch (e) {
                clientWs.send(data);
              }
            } else {
              try {
                const parsed = JSON.parse(data.toString());
                console.log('[Deepgram →] Message type:', parsed.type);
              } catch (e) { }
              clientWs.send(data);
            }
          }
        });

        deepgramWs.on('close', () => {
          console.log('[Deepgram] Disconnected');
        });

        deepgramWs.on('error', (error: Error) => {
          console.error('[Deepgram] Error:', error.message);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'Error', error: 'Deepgram connection failed' }));
          }
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Interview] Error:', errorMessage);
        if (clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify({ type: 'Error', error: errorMessage }));
          clientWs.close();
        }
      }
    })();

    // Client message forwarding
    clientWs.on('message', (data: WebSocket.RawData) => {
      if (deepgramWs && deepgramWs.readyState === WebSocket.OPEN) {
        deepgramWs.send(data);
      }
    });

    clientWs.on('close', () => {
      console.log('[Interview] Client disconnected');
      if (deepgramWs && deepgramWs.readyState === WebSocket.OPEN) {
        deepgramWs.close();
      }
    });

    clientWs.on('error', (error: Error) => {
      console.error('[Interview] Client error:', error.message);
    });
  });
}
