import { FormEvent, useEffect, useMemo, useState } from "react"
import ChromaGrid from "./components/ChromaGrid"
import "./App.css"
import { usePerspectives } from "./hooks/usePerspectives"
import type { Character } from "./hooks/usePerspectives"
import { usePersonaVoices } from "./hooks/usePersonaVoices"

const suggestionExamples = [
  "Should I confront my friend who keeps canceling plans?",
  "I found out my coworker earns more than me for the same role.",
  "My parents don't support my career change to art.",
]

function App() {
  const [input, setInput] = useState("")
  const [userTopic, setUserTopic] = useState("")
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const { story, fetchStory, isLoading, error } = usePerspectives()
  
  const {
    generateAllVoices,
    playAllDialogue,
    stopAudio,
    unlockAudio,
    isGenerating,
    currentDialogueIndex,
  } = usePersonaVoices()

  const handleSubmit = async (value?: string) => {
    const topic = (value ?? input).trim()
    if (!topic) return
    unlockAudio()
    setUserTopic(topic)
    await fetchStory(topic)
    setHasSubmitted(true)
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleSubmit()
  }

  useEffect(() => {
    if (!story || !story.characters.length || !story.dialogue.length) return
    generateAllVoices(story.dialogue, story.characters)
  }, [generateAllVoices, story])

  // Convert characters to grid items format
  const gridItems = useMemo(() => {
    if (!story) return []
    return story.characters.map((char) => ({
      id: char.id,
      image: char.image,
      title: char.name,
      subtitle: char.role,
      handle: `@${char.id}`,
      borderColor: char.borderColor,
      gradient: char.gradient,
      url: "",
    }))
  }, [story])

  const [conversationStarted, setConversationStarted] = useState(false)

  const startConversation = () => {
    if (!story || story.dialogue.length === 0 || conversationStarted) return
    setConversationStarted(true)
    playAllDialogue(story.dialogue.length)
  }

  const allVoicesReady = useMemo(() => {
    if (!story || isGenerating) return false
    return story.dialogue.length > 0
  }, [story, isGenerating])

  // Get the character currently speaking
  const speakingCharacterId = useMemo(() => {
    if (currentDialogueIndex === -1 || !story) return null
    return story.dialogue[currentDialogueIndex]?.characterId || null
  }, [currentDialogueIndex, story])

  return (
    <div className="app">
      {!hasSubmitted && (
        <div className="input-stage">
          <div className="input-container">
            <h1 className="main-title">What's on your mind?</h1>
            <p className="subtitle">
              Share a situation, dilemma, or moment. We'll create a conversation
              exploring it from different angles.
            </p>

            <form className="input-form" onSubmit={onSubmit}>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Describe what you're thinking about..."
                rows={5}
                className="main-input"
                autoFocus
              />

              <button
                type="submit"
                className="submit-btn"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? "Crafting story..." : "Create story →"}
              </button>
            </form>

            <div className="examples">
              <span className="examples-label">or explore:</span>
              <div className="examples-list">
                {suggestionExamples.map((example) => (
                  <button
                    type="button"
                    key={example}
                    className="example-btn"
                    onClick={() => handleSubmit(example)}
                    disabled={isLoading}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {hasSubmitted && (
        <div className="results-stage">
          <div className="results-header">
            <p className="scenario-text">"{userTopic}"</p>
            <div className="status-line">
              {isLoading && <span className="status">Writing the scene...</span>}
              {!isLoading && isGenerating && (
                <span className="status">Preparing voices...</span>
              )}
              {!isLoading && allVoicesReady && (
                <span className="status-ready">
                  Ready to play
                </span>
              )}
            </div>
            {error && <p className="error-text">{error}</p>}
          </div>

          {allVoicesReady && gridItems.length > 0 && (
            <>
              {!conversationStarted && (
                <button className="play-story-btn" onClick={startConversation}>
                  ▶ Play the conversation
                </button>
              )}

              <div className="grid-wrapper">
                <ChromaGrid
                  items={gridItems}
                  radius={340}
                  columns={Math.min(3, gridItems.length)}
                  rows={Math.ceil(gridItems.length / 3)}
                  selectedPersonaId={speakingCharacterId}
                />
              </div>

              {conversationStarted && (
                <div className="dialogue-display">
                  {story?.dialogue.map((line, index) => {
                    const character = story.characters.find(
                      (c) => c.id === line.characterId
                    )
                    const isActive = index === currentDialogueIndex
                    const hasPlayed = index < currentDialogueIndex

                    return (
                      <div
                        key={index}
                        className={`dialogue-line ${isActive ? "active" : ""} ${
                          hasPlayed ? "played" : ""
                        }`}
                      >
                        <span className="character-name">
                          {character?.name}:
                        </span>{" "}
                        <span className="dialogue-text">{line.text}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          <button
            className="new-scenario-btn"
            onClick={() => {
              stopAudio()
              setConversationStarted(false)
              setHasSubmitted(false)
              setInput("")
              setUserTopic("")
            }}
          >
            Create another story
          </button>
        </div>
      )}
    </div>
  )
}

export default App
