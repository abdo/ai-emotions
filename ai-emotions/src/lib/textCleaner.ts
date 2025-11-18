/**
 * Cleans text for TTS by removing markdown, special characters, and emojis
 */
export function cleanTextForSpeech(text: string): string {
  let cleaned = text

  // Remove markdown bold/italic (**text**, *text*, __text__, _text_)
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1')
  cleaned = cleaned.replace(/\*(.+?)\*/g, '$1')
  cleaned = cleaned.replace(/__(.+?)__/g, '$1')
  cleaned = cleaned.replace(/_(.+?)_/g, '$1')

  // Remove markdown headers (# ## ###)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '')

  // Remove stage directions in brackets [like this]
  cleaned = cleaned.replace(/\[.+?\]/g, '')

  // Remove emojis (Unicode ranges for common emoji)
  cleaned = cleaned.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu,
    ''
  )

  // Remove multiple spaces and trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim()

  return cleaned
}

