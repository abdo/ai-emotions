import "./ModeSwitch.css";

interface ModeSwitchProps {
  isConversationMode: boolean;
  onToggle: (isConversationMode: boolean) => void;
}

export function ModeSwitch({ isConversationMode, onToggle }: ModeSwitchProps) {
  return (
    <div className="mode-switch-wrapper">
      <div className="cookie-switch">
        <label htmlFor="mode-toggle">
          <div className="cookie-background" />
          <input
            type="checkbox"
            className="cookie-toggle-switch"
            id="mode-toggle"
            checked={!isConversationMode}
            onChange={(e) => onToggle(!e.target.checked)}
          />
          <div className="cookie">
            <span className="cookie-part-1" />
            <span className="cookie-part-2" />
            <span className="cookie-part-3" />
            <span className="cookie-part-4" />
            <span className="chocolate-chips-1a" />
            <span className="chocolate-chips-1b" />
            <span className="chocolate-chips-1c" />
            <span className="chocolate-chips-1d" />
            <span className="chocolate-chips-2a" />
            <span className="chocolate-chips-2b" />
            <span className="chocolate-chips-2c" />
            <span className="chocolate-chips-2d" />
            <span className="chocolate-chips-2e" />
            <span className="chocolate-chips-3a" />
            <span className="chocolate-chips-3b" />
            <span className="chocolate-chips-3c" />
            <span className="chocolate-chips-4a" />
            <span className="chocolate-chips-4b" />
            <span className="chocolate-chips-4c" />
          </div>
        </label>
      </div>
      <span className="mode-label-text">
        {!isConversationMode ? 'Story' : 'Conversation'}
      </span>
    </div>
  );
}
