import React from 'react';
import './ScriptOverlay.css';

interface ScriptOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: string;
  scriptLines: Array<{
    characterName: string;
    text: string;
  }>;
}

export const ScriptOverlay: React.FC<ScriptOverlayProps> = ({
  isOpen,
  onClose,
  scenario,
  scriptLines
}) => {
  if (!isOpen) return null;

  return (
    <div className="script-overlay" onClick={onClose}>
      <div className="script-overlay-content" onClick={(e) => e.stopPropagation()}>
        <div className="script-overlay-header">
          <span />
          <button className="close-overlay-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="script-overlay-body">
          <div className="script-scenario">
            <p className="scenario-value">{scenario}</p>
          </div>
          
          <div className="script-dialogue">
            {scriptLines.map((line, index) => (
              <div key={index} className="dialogue-line">
                <span className="character-name">{line.characterName}</span>
                <span className="dialogue-text">{line.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
