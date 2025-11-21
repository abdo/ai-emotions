import React from 'react';
import './MissingKeys.css';

interface MissingKeysProps {
  missingKeys: string[];
}

export const MissingKeys: React.FC<MissingKeysProps> = ({ missingKeys }) => {
  return (
    <div className="missing-keys-container">
      <div className="missing-keys-card">
        <h1>⚠️ Configuration Missing</h1>
        <p>
          The application cannot start because some required API keys are missing.
        </p>
        
        <div className="missing-list">
          <p>Missing Keys:</p>
          <ul>
            {missingKeys.map((key) => (
              <li key={key}><code>{key}</code></li>
            ))}
          </ul>
        </div>

        <div className="instructions">
          <h2>How to fix this:</h2>
          <ol>
            <li>Create a file named <code>src/keys.ignore.ts</code></li>
            <li>Copy the template below and fill in your keys:</li>
          </ol>
          
          <pre>
{`// src/keys.ignore.ts

export const groqApiKey = "gsk_...";
export const openAiTTSApiKey = "sk-proj-...";
export const posthogApiKey = "phc_...";`}
          </pre>
          
          <p className="note">
            Note: <code>src/keys.ignore.ts</code> is git-ignored to keep your keys secure.
          </p>
        </div>
        
        <button onClick={() => window.location.reload()} className="reload-btn">
          I've added the keys, reload!
        </button>
      </div>
    </div>
  );
};
