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
  // Handle Escape key to close overlay
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="script-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="script-title"
    >
      <div className="script-overlay-content" onClick={(e) => e.stopPropagation()}>
        <div className="script-overlay-header">
          <h2 id="script-title" className="sr-only">Script</h2>
          <span />
          <button 
            className="close-overlay-btn" 
            onClick={onClose}
            aria-label="Close script overlay"
          >
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
