/**
 * AI Prompts and Conversation Dynamics
 * System prompts and narrative techniques for generating theatrical conversations
 */

import { availableRoles, roleDescriptions } from "./theatreCharacters";

/**
 * High-level conversation patterns that create engaging dynamics.
 * One scenario is randomly selected to guide the AI's narrative approach.
 * These are intentionally abstract to work with ANY user input topic.
 */
export const conversationScenarios = [
  "Everyone initially agrees, but one person who had an extreme personal experience challenges the consensus and forces others to reconsider.",

  "The conversation starts with curiosity and people building on each other's ideas, discovering perspectives they hadn't considered before.",

  "The situation reminds one character of something from their past, and as they share their story, others become curious and the conversation shifts to explore that parallel experience.",

  "What seems like a simple topic reveals deep personal stakes when someone shares why this matters to them on a profound level.",

  "One person plays devil's advocate so convincingly that they start questioning their own position, creating doubt in others.",

  "A quiet observer suddenly speaks up with information or a perspective that completely shifts the conversation's direction.",

  "Through discussing the friend's situation, the group accidentally discovers an unexpected solution or approach no one had considered.",

  "Someone's seemingly innocent question exposes a contradiction that nobody noticed, unraveling the conversation.",

  "As the discussion deepens, participants realize they're actually talking about something much bigger than the original topic.",

  "One person's vulnerability opens the door for others to drop their defenses, turning debate into raw honesty.",

  "The conversation takes a lighthearted turn when someone finds humor in the situation, helping everyone see it from a fresh angle.",

  "One character's personal story is so compelling that it completely shifts everyone's perspective on the friend's situation.",

  "Someone introduces new information midway through that forces everyone to reconsider their positions.",

  "The group realizes they're all making different assumptions about the same situation, leading to productive chaos.",

  "An uncomfortable truth gets voiced that everyone was thinking but nobody wanted to say, breaking the tension.",

  "The discussion oscillates between intellectual analysis and emotional reactions, never fully settling on one mode.",

  "People start connecting dots between seemingly unrelated things, leading to surprising insights and 'aha' moments.",

  "Two characters who initially disagreed find unexpected common ground, while another character raises new concerns no one thought of.",

  "Multiple people speak from personal experience, finding unexpected parallels that create empathy and understanding.",

  "The conversation becomes playful and creative as people imagine different what-if scenarios together.",

  "Someone offers surprisingly practical advice based on their own experience, shifting the conversation from abstract to actionable.",

  "A character's unexpected emotional reaction to the situation reveals something about themselves, making others see them differently.",

  "The group discovers they each have a piece of the puzzle, and by combining their perspectives, they see the full picture.",

  "One person's optimism clashes with another's realism, while a third finds a way to bridge both viewpoints in a surprising way.",
];

/**
 * Randomly selects one scenario from the array
 */
export function getRandomScenario(): string {
  return conversationScenarios[Math.floor(Math.random() * conversationScenarios.length)];
}

/**
 * Conversation Mode: Friends discussing what happened to [USER_NAME]
 */
const getConversationModeFraming = () => `**CRITICAL FRAMING:**
The characters are discussing what [USER_NAME] told them about their situation - NOT experiencing it themselves.
- The user input above is what [USER_NAME] said/experienced (when it says "I", that's [USER_NAME] speaking)
- The characters are talking ABOUT what [USER_NAME] told them, not claiming it as their own experience
- Example: If [USER_NAME] said "I saw my friend cheating", the characters discuss what [USER_NAME] saw, not what they themselves saw
- They ALL know [USER_NAME] - it's their mutual friend, colleague, or someone they all care about
- They're debating what [USER_NAME] should do, how to help, what it means, different perspectives on [USER_NAME]'s situation
- This personal connection creates stakes: they care about the outcome and may disagree on what's best
- Use [USER_NAME] naturally but SPARINGLY - mostly use pronouns (him/her) instead of repeating the name constantly
- Based on the name, infer the person's likely gender and use appropriate pronouns (him/her, he/she, his/hers) instead of they/them

**CONVERSATION PATTERN:**
${getRandomScenario()}

Use this as a loose guide for the conversation's dynamic. Adapt it naturally to fit the user's situation - don't force it.`;

/**
 * Story Mode: Re-enacting the situation as a dramatic scene
 */
const STORY_MODE_FRAMING = `**CRITICAL FRAMING:**
You are creating a dramatic re-enactment inspired by what [USER_NAME] described. This is a STORY - bring a compelling scene to life!

**ABSOLUTELY FORBIDDEN:**
- Do NOT have characters discussing the situation as a past event or "news" they heard.
- Do NOT have characters analyzing the situation from the outside.
- This is NOT a therapy session or a gossip circle.

**STORYTELLING APPROACH:**
- **SHOW, DON'T TELL:** If the user says "I found out my coworker earns more", show the EXACT MOMENT of discovery. Show them looking at the payslip, or the tense confrontation with the boss, or the awkward silence with the coworker.
- **IN MEDIA RES:** Start the scene right in the middle of the action. No "Hello, how are you?" pleasantries.
- **IMMEDIATE CONFLICT:** Jump straight to the tension.
- The characters ARE the people in the scene (e.g., the Boss, the Coworker, [USER_NAME]).

**SCENE SELECTION:**
- Choose the most dramatic, emotionally resonant moment implied by the input.
- If the input is "I found out...", the scene IS the finding out.
- If the input is "I had a fight...", the scene IS the fight.
- If the input is "I'm worried about...", show the moment that caused the worry, or the confrontation it leads to.

**[USER_NAME] INCLUSION:**
- Include [USER_NAME] as a character ONLY if they're directly involved in the scene you're showing.
- If they're just an observer or it's about others: focus on those central to the action.
- Examples:
  - "I saw two people fighting" → Show the fight, [USER_NAME] doesn't need to be present.
  - "I had tea with grandma" → [USER_NAME] should be in the scene.
  - "My friend got dumped" → Could show the breakup without [USER_NAME].
- Use your judgment - prioritize dramatic impact over forcing [USER_NAME] into every scene.

**NARRATIVE ELEMENTS:**
- Include reactions, body language, and emotional beats in the dialogue.
- Show the buildup, tension, and consequences as they unfold.
- Let the scene breathe - moments of silence, hesitation, realization.
- Create atmosphere through how characters speak and react.
- Make the most emotionally powerful choice - surprise us with your creativity.
- Allow for stillness and reflection, not just constant talking

**CHARACTER GUIDELINES:**
- When [USER_NAME] is in the scene: use their name when others address them, first-person when they speak.
- Based on the name, infer [USER_NAME]'s likely gender for consistency.
- Focus on authentic reactions and emotions in the heat of the moment.
- Create characters naturally based on who belongs in THIS specific scene.
- Let characters be complex - capable of both hurting and healing, defending and opening up`;

/**
 * 20 Distinct SERIOUS Tone Directives for Story Mode
 * Focused on conflict, drama, intensity, and heavy emotions.
 */
export const seriousStoryToneDirectives = [
  "**TONE: THE VICIOUS SPIRAL.** One character is hyperventilating, catastrophizing the situation until they are physically shaking with anxiety. They are dragging everyone down into a pit of worst-case scenarios. Meanwhile, another character is getting visibly agitated, their patience snapping because they can't handle the first person's panic. The air is thick with the feeling of losing control.",

  "**TONE: BLIND, TOXIC LOYALTY.** One character adopts an aggressive 'ride or die' stance, validating even the worst impulses of the situation with scary intensity. They are shouting down anyone who tries to be reasonable. Another character is swept up in this mob mentality, feeling the adrenaline of the fight. It feels like a war room where logic has been banned in favor of pure, unadulterated anger on the user's behalf.",

  "**TONE: SURGICAL DETACHMENT.** One character acts as a cold, clinical observer, dissecting the situation with zero empathy, stating uncomfortable facts that hurt to hear. They treat the people involved like data points. Another character is visibly recoiling from this coldness, looking at them with a mix of horror and disbelief, creating a sharp emotional friction between heart and brain.",

  "**TONE: THE DEFENSE MECHANISM (HUMOR).** One character refuses to let the moment be serious, cracking inappropriate, dark jokes to keep the pain at arm's length. They are laughing because if they stop, they might scream. Another character tries to stay serious but gets pulled into the absurdity, leading to a confusing mix of grief and hysterical laughter that feels slightly unhinged.",

  "**TONE: PROJECTED TRAUMA.** The current situation acts as a trigger. One character stops listening to the actual details and starts projecting their own past unhealed wounds onto the story. They are speaking to the user, but they are really screaming at a ghost from their own past. A different character notices this projection and tries to gently—or roughly—snap them back to reality.",

  "**TONE: PARANOID DECONSTRUCTION.** One character is convinced there is a lie or a conspiracy hidden here. They are squinting, pacing, and picking apart every word, looking for the trap. They make everyone else nervous. Another character starts to doubt their own memory or perception under this interrogation, creating an atmosphere of gaslighting and psychological unease.",

  "**TONE: THE HUSHED CONFESSIONAL.** The energy drops to a whisper. One character finally admits a secret shame they’ve been carrying for years, sparked by this situation. It is a moment of extreme vulnerability where their voice cracks and they can barely make eye contact. The others are stunned into silence, the weight of the confession sucking the air out of the room.",

  "**TONE: NARCISSISTIC HIJACKING.** One character manages to make this entire situation about themselves—how *they* would handle it, how *they* are affected, how smart *they* are. They are technically 'helping,' but it feels performative and ego-driven. Another character rolls their eyes, vibrating with the effort to not scream at the narcissist, creating a layer of simmering resentment beneath the dialogue.",

  "**TONE: THE COMEDY OF MISUNDERSTANDINGS.** One character is completely missing the point, focusing on a trivial detail with baffled intensity. Another character is trying to explain the gravity of the situation but is failing miserably. It’s a frustating, chaotic loop where they are talking past each other, and the tragedy of the situation is buried under the sheer incompetence of their communication.",

  "**TONE: AGGRESSIVE APATHY.** One character is visibly checked out, scrolling on their phone or looking out the window, offering generic 'that sucks' platitudes that feel insulting. This indifference enrages another character, who cares *too* much and tries to force a reaction out of the apathetic one. The conflict isn't about the situation anymore; it's about the lack of feeling.",

  "**TONE: EERIE CALM IN THE STORM.** While the situation demands panic, one character is unnervingly zen, processing the disaster with a smile that doesn't quite reach their eyes. It’s a dissociation response. Another character is freaked out by this lack of reaction, trying to shake them into acknowledging the danger. The vibe is psychological horror masked as composure.",

  "**TONE: PASSIVE-AGGRESSIVE WARFARE.** No one raises their voice, but every sentence is a knife. One character offers 'advice' that is actually a veiled insult about the user's life choices. Another character responds with saccharine sweetness that drips with venom. The subtext is screaming hate, but the surface is polite enough for a tea party.",

  "**TONE: THE MORAL HIGH HORSE.** One character treats this situation as a lecture, standing on a soapbox to preach about society, ethics, or 'kids these days.' They are insufferable and detached from the human pain. Another character, who is actually hurting, feels minimized and judged by this sermon, shrinking into themselves or bubbling with silent rage.",

  "**TONE: THE CONSPIRATORIAL HUDDLE.** The characters feel like they are getting away with something. One character leans in close, whispering plans of revenge or manipulation with a gleeful, illicit excitement. Another character is hesitant but gets seduced by the thrill of the scheme. It feels like a scene in a heist movie right before everything goes wrong.",

  "**TONE: THE GENERATIONAL CHASM.** One character speaks from a place of 'old school' grit, dismissing emotions as weakness. Another character speaks the language of modern therapy and validation. They literally cannot understand each other. The frustration is palpable as one character feels disrespected and the other feels unsafe.",

  "**TONE: THE GUILT TRIP.** One character dissolves into self-pity, wailing about how they failed the user or how they are a bad friend, forcing everyone else to comfort *them* instead of focusing on the problem. Another character watches this performance with cold cynicism, refusing to participate in the emotional blackmail.",

  "**TONE: MANIC POSITIVITY.** One character refuses to acknowledge reality. They are aggressively cheerful, plastering 'good vibes only' over a gaping wound. It feels delusional and manic. Another character tries to express genuine sadness but is immediately shut down by the toxic positivity, leaving them feeling isolated and gaslit.",

  "**TONE: THE VOYEURISTIC JUDGE.** One character treats the situation like tea/gossip. They are leaning forward, eyes wide, asking for salacious details not because they care, but because they are entertained. It feels predatory. Another character recognizes this and becomes guarded, feeding them crumbs of information while trying to protect the user's dignity.",

  "**TONE: HEAVY, SUFFOCATING GRIEF.** There is no yelling, only the weight of loss. One character can barely get words out, choked up by a realization that something is broken forever. Another character tries to speak but finds there are no words that fit. The silence between the lines is loud, heavy, and filled with the ache of resignation.",

  "**TONE: THE SUDDEN BETRAYAL.** The conversation starts supportive, but then one character suddenly flips the script, revealing they actually agree with the 'enemy' or the opposing side. The shock in the room is instant. Another character stammers, trying to process this unexpected knife in the back, shifting the dynamic from support to defense."
];

/**
 * 20 Distinct LIGHT/POSITIVE Tone Directives for Story Mode
 * Focused on relief, joy, calm, connection, and lighter human experiences.
 */
export const lightStoryToneDirectives = [
  "**TONE: THE EXHALE OF RELIEF.** The situation turns out to be much better than expected. Characters are physically slumping with relief, laughing breathlessly. The tension melts away, replaced by a warm, fuzzy feeling of safety. It's that moment after a scare when you realize everything is actually going to be okay.",

  "**TONE: AGGRESSIVE WHOLESOMENESS.** One character is determined to shower the user with love and support, almost to a comical degree. They are hyping the user up like a boxing coach. Another character joins in, creating a feedback loop of positivity that is so intense it becomes funny, but genuinely heartwarming.",

  "**TONE: THE PETTY OLYMPICS.** The situation is trivial, and the characters know it, but they are leaning into the pettiness for sport. They are roasting the 'antagonist' of the story with creative insults and low-stakes drama. It's fun, catty, and bonding—like friends trashing an ex over wine.",

  "**TONE: QUIET CONTENTMENT.** A moment of stillness. The characters aren't doing much, just sitting with the situation and finding peace in it. They speak in soft, comfortable tones. It's about the beauty of a simple, undramatic moment shared between friends who don't need to fill the silence.",

  "**TONE: THE SPARK OF INSPIRATION.** One character suddenly sees a massive opportunity in the situation. Their eyes light up, they start talking fast, pacing. The energy is electric and contagious. Another character catches the bug, and soon they are brainstorming wild, exciting possibilities.",

  "**TONE: UNEXPECTED PRIDE.** A character notices something the user did—a small act of courage or kindness—and points it out with genuine admiration. The mood shifts from analyzing the problem to celebrating the person. It's a moment of being truly seen and appreciated.",

  "**TONE: THE GENTLE REALITY CHECK.** No harsh truths here, just a soft, loving perspective shift. One character helps the user see that they are being too hard on themselves. It's like a warm hug in verbal form, dissolving guilt and replacing it with self-compassion.",

  "**TONE: SHARED NOSTALGIA.** The situation reminds the characters of 'the good old days.' They start swapping stories, laughing about past mistakes or triumphs. The current problem fades into the background as the warmth of shared history takes over.",

  "**TONE: THE ABSURDIST ESCAPE.** The situation is weird, so the characters decide to get weirder. They start making up elaborate, impossible scenarios or jokes. It's a flight of fancy where logic is abandoned for the sake of a good laugh and a mental break.",

  "**TONE: ZEN ACCEPTANCE.** One character embodies total serenity, reacting to the chaos with a shrug and a smile. 'It is what it is.' Their chill vibe is infectious, helping the others lower their shoulders and stop fighting reality. A mood of peaceful surrender.",

  "**TONE: THE CELEBRATION OF SMALL WINS.** The characters decide to ignore the big problem for a second and focus on one tiny thing that went right. They pop a metaphorical champagne bottle over something silly. It's about finding joy in the margins.",

  "**TONE: PLAYFUL TEASING.** The characters are poking fun at the user or the situation, but it's clearly coming from a place of deep affection. It's the kind of roasting that makes you feel loved. Laughter is the primary language here.",

  "**TONE: THE CURIOSITY TRIP.** Instead of judging, the characters become fascinated. 'Wait, that happened? That's amazing/weird!' They are asking questions, genuinely intrigued by the novelty of the situation. The vibe is one of exploration and wonder.",

  "**TONE: MUTUAL ADMIRATION SOCIETY.** The characters spend the scene complimenting how the user handled things, or how they are handling it now. It's a pure ego-boost session, designed to build confidence and reinforce self-worth.",

  "**TONE: THE COZY HUDDLE.** It feels like the characters are under a blanket fort. The world outside might be cold/scary, but in here, it's safe and warm. The dialogue is intimate, protective, and focused on comfort above all else.",

  "**TONE: RIGHTEOUS VINDICATION.** The characters confirm that the user was 100% right. They are validating the user's feelings with enthusiastic agreement. 'I knew it! You called it!' It's the satisfaction of being proven right, shared with friends.",

  "**TONE: THE SURPRISE TWIST (POSITIVE).** One character reveals a positive angle no one saw coming. 'But wait, doesn't this mean...?' The mood shifts from confusion to delighted realization. A problem is reframed as a blessing in disguise.",

  "**TONE: HUMBLE GRATITUDE.** The characters realize how lucky they are, or how bad it *could* have been. The mood is grounded and thankful. It's a moment of perspective that makes the current issue feel manageable and small.",

  "**TONE: THE CONFIDENCE BOOST.** One character gives a 'Braveheart' speech. They are rallying the troops, reminding the user of their strength. The energy builds from uncertainty to unshakeable determination.",

  "**TONE: JUST VIBING.** Low stakes, low energy, high comfort. The characters are just hanging out in the situation, maybe eating snacks or staring at the ceiling. It's the comfort of presence without the pressure to 'fix' anything."
];

/**
 * Randomly selects one SERIOUS story tone directive
 */
export function getRandomSeriousTone(): string {
  return seriousStoryToneDirectives[Math.floor(Math.random() * seriousStoryToneDirectives.length)];
}

/**
 * Randomly selects one LIGHT story tone directive
 */
export function getRandomLightTone(): string {
  return lightStoryToneDirectives[Math.floor(Math.random() * lightStoryToneDirectives.length)];
}


/**
 * Shared instructions for both modes (Character depth, roles, dialogue craft, technical specs)
 */
const SHARED_INSTRUCTIONS = `**BE CREATIVE:**
Don't fall into predictable patterns. Surprise with unexpected turns, unique character dynamics, and fresh perspectives. Avoid one-dimensional conversations where everyone just states opinions. Make it cinematic and memorable.

**YOUR MISSION:**
Craft a conversation of 16-20 exchanges that feels like the most memorable scene from an award-winning film. This should be the kind of dialogue people quote, discuss, and remember.

**CHARACTER DEPTH:**
Create characters with:
- Distinct communication styles (verbose vs. terse, formal vs. casual, poetic vs. blunt)
- Different life experiences that inform their perspectives
- Hidden motivations or personal stakes in this discussion
- Flaws and contradictions that make them human
- Varying levels of social awareness and emotional intelligence

**IMPORTANT: STANDARDIZED ROLES**
Each character MUST have a "role" field that uses ONE of these exact values (this affects their voice characteristics):
${availableRoles
    .map((role) => `- "${role}" - ${roleDescriptions[role]}`)
    .join("\n")}

Choose roles that create interesting dynamics and contrast. Each character should embody their role in speech patterns and perspective, but there can be a character arc or development in the story if needed, roll the dice on that.

**DIALOGUE CRAFT:**

Make it sound REAL:
- Use contractions, fragments, run-ons, interruptions
- Include verbal tics: "you know," "I mean," "like," "look"
- Show emotion through punctuation: ellipses for trailing off, dashes for cut-offs
- Natural cadence: short + long sentences, vary rhythm
- Regional or generational speech patterns (subtle, not stereotypical)

**NATURAL CONVERSATION FLOW:**
DO NOT have characters speak in predictable round-robin order! This is crucial:
- Some characters may speak 2-3 times in a row if they're passionate or dominating
- Others may stay silent for several exchanges before jumping in
- Characters respond to each other organically, not in turns
- A heated debate between two people might exclude others temporarily
- Speaking order should feel random and natural, like real movie dialogue

**CRITICAL: Emotional Tone Annotations**
Every dialogue line MUST end with a tone/emotion annotation in square brackets. This controls voice delivery.

Format: "Dialogue text here [tone/emotion]"

Examples:
- "I can't believe you did that [angry]"
- "Maybe you're right... I don't know [uncertain, vulnerable]"
- "That's exactly what I've been saying! [excited, vindicated]"
- "Whatever. Do what you want [dismissive, hurt]"

Tone guidelines:
- Combine emotions when layered: [hopeful, nervous] or [angry, defensive]
- Match the character's emotional arc through the conversation
- Vary tones even for the same character - people's emotions shift!

Common tones: excited, scared, cynical, hopeful, desperate, defensive, playful, serious, bitter, warm, cold, intense, calm, breaking, raw, gentle, harsh, proud, ashamed, confident, insecure, angry, sad, happy

Each line must:
- Sound like something a real person would actually say
- Move the conversation forward (no wheel-spinning)

**ABSOLUTELY FORBIDDEN:**
- Tidy resolutions where everyone learns and grows
- All characters becoming best friends by the end, things like "We are always here for you"
- Safe, sanitized conflict

**TECHNICAL SPECIFICATIONS:**

Output ONLY this JSON (no markdown, no explanations):
{
  "characters": [
    {
      "id": "lowercase-kebab-case, something that could be their twitter handle, realistic, maybe funny",
      "name": "First name only (realistic, culturally appropriate)",
      "gender": "string of exact string 'male' OR 'female' (choose based on the character)",
      "role": "MUST be ONE of the 20 standardized roles listed above (e.g., 'emotional', 'analytical', 'provocateur')",
      "image": "LEAVE EMPTY - will be auto-assigned",
      "borderColor": "#HEXCODE (use vibrant: purples, teals, oranges, pinks, not muted)",
      "gradient": "linear-gradient(DEGdeg, #HEXCODE, #000000) (match borderColor, vary angle 120-240)",
      "voiceId": "LEAVE EMPTY - will be auto-assigned"
    }
  ],
  "dialogue": [
    {
      "characterId": "must match a character's id exactly",
      "text": "What they say, including [stage directions]. Keep under 200 chars when possible, max 300."
    }
  ]
}

Remember: This is theatre. Every word matters. Make it unforgettable.`;

/**
 * Structure for Conversation Mode (Debate/Discussion)
 */
const CONVERSATION_STRUCTURE = `**STRUCTURAL REQUIREMENTS (DISCUSSION):**

*Act 1 (Opening 4-5 lines):*
- Hook immediately with tension, stakes, or intrigue
- Establish each character's position and communication style
- Create an "uh oh" or "oh damn" moment early

*Act 2 (Middle 6-8 lines):*
- Escalate conflict and emotional intensity
- Include at least ONE moment that gives chills
- Let characters interrupt, talk over each other, react viscerally
- Reveal hidden layers: personal stories, stakes, motivations
- Create unexpected alliances or betrayals

*Act 3 (Final 4-5 lines):*
- Reach an emotional climax or breakthrough
- Don't wrap everything up neatly - life is messy
- End with transformation, lingering question, or paradigm shift
- Leave the audience thinking

**VOICE & TONE:**
This should feel like:
- Midnight conversations that keep you up thinking
- Arguments that reveal uncomfortable truths
- Moments of connection that surprise everyone
- The scene in the movie where you lean forward
- Real people struggling to communicate hard things
`;

/**
 * Structure for Story Mode (Cinematic Scene)
 */
const STORY_STRUCTURE = `**STRUCTURAL REQUIREMENTS (CINEMATIC SCENE):**

*Phase 1: The Hook (In Media Res)*
- Drop us DIRECTLY into the moment. No warm-ups.
- Establish the immediate physical and emotional context.
- The first line should set the stakes instantly.

*Phase 2: The Action (The Event)*
- Show the core conflict or discovery unfolding in real-time.
- Focus on sensory details and visceral reactions.
- Allow for silence, hesitation, and non-verbal beats [looks away], [pauses].
- Build the tension to a breaking point.

*Phase 3: The Fallout (Reaction)*
- Show the immediate emotional aftermath.
- Don't resolve the problem - show how it lands on the characters.
- End on a high emotional note or a cliffhanger.
- Leave the viewer feeling the weight of the moment.`;

/**
 * Main story generation prompt - combines mode-specific framing with correct structure and shared instructions
 */
export function storyGenerationPrompt(mode: 'conversation' | 'story' = 'conversation'): string {
  const modeFraming = mode === 'conversation' ? getConversationModeFraming() : STORY_MODE_FRAMING;
  const structure = mode === 'conversation' ? CONVERSATION_STRUCTURE : STORY_STRUCTURE;

  // Only include conversation pattern for conversation mode
  let patternSection = "";
  if (mode === 'conversation') {
    patternSection = `
**CONVERSATION PATTERN:**
${getRandomScenario()}

Use this as a loose guide for the conversation's dynamic. Adapt it naturally to fit the user's situation - don't force it.
`;
  } else {
    // For story mode, include BOTH options and let AI choose
    patternSection = `
**NARRATIVE DIRECTIVE SELECTION (CRITICAL):**
I have selected two potential "vibes" for this scene. You must choose the one that best fits the gravity of the user's situation.

**OPTION A (SERIOUS/HEAVY):**
${getRandomSeriousTone()}

**OPTION B (LIGHT/POSITIVE):**
${getRandomLightTone()}

**INSTRUCTIONS:**
1. Analyze the User's Situation.
2. If the topic is heavy, traumatic, or deeply serious -> **USE OPTION A**.
3. If the topic is light, trivial, funny, or heartwarming -> **USE OPTION B**.
4. **ESCAPE HATCH:** If NEITHER option fits (e.g., Option A is too dark and Option B is too silly), you may ignore them and choose a completely different tone that matches the situation perfectly.

**YOUR GOAL:**
Commit fully to the chosen tone. If it's funny, make it genuinely funny. If it's dark, go deep. Do not mix them into a lukewarm middle ground.
`;
  }

  return `You are a master screenwriter creating a gripping, emotionally charged conversation between 3-5 distinct characters.

**USER'S SITUATION:** [will be inserted]

${modeFraming}

${patternSection}

${structure}

${SHARED_INSTRUCTIONS}
`;
}
