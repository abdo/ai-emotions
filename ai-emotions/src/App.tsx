import { useEffect, useState } from 'react';
import './App.css';

type TreeElement = {
  id: number;
  type: 'text' | 'knot' | 'crack';
  content?: string;
  baseOffset: number;
};

function App() {
  const [rotation, setRotation] = useState(0);

  // Generate tree elements (markings, knots, cracks)
  const treeElements: TreeElement[] = [
    { id: 1, type: 'text', content: '🌿', baseOffset: 0 },
    { id: 2, type: 'knot', baseOffset: 120 },
    { id: 3, type: 'text', content: '✨', baseOffset: 60 },
    { id: 4, type: 'crack', baseOffset: 180 },
    { id: 5, type: 'text', content: '🍃', baseOffset: 240 },
    { id: 6, type: 'knot', baseOffset: 300 },
    { id: 7, type: 'text', content: '⭐', baseOffset: 90 },
    { id: 8, type: 'text', content: '🌱', baseOffset: 150 },
    { id: 9, type: 'crack', baseOffset: 210 },
    { id: 10, type: 'text', content: '💫', baseOffset: 270 },
    { id: 11, type: 'knot', baseOffset: 330 },
    { id: 12, type: 'text', content: '🌟', baseOffset: 30 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollPosition / maxScroll;
      
      // Rotate tree based on scroll (360 degrees per full scroll)
      const newRotation = scrollPercentage * 360 * 3; // Multiple rotations
      setRotation(newRotation);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate bark texture lines
  const barkLines = Array.from({ length: 20 }, (_, i) => (
    <div
      key={`bark-${i}`}
      className="bark-line"
      style={{
        top: `${i * 5 + 2}%`,
        transform: `rotate(${(i % 3) * 2 - 2}deg)`,
      }}
    />
  ));

  return (
    <div className="app">
      <div className="tree-crown" />
      
      <div className="tree-container">
        <div className="tree">
          <div className="tree-trunk">
            <div className="tree-texture">
              {barkLines}
              
              {/* Tree rings with elements that rotate */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((ringIndex) => (
                <div
                  key={`ring-${ringIndex}`}
                  className="tree-ring"
                  style={{
                    top: `${ringIndex * 10}%`,
                    transform: `rotateY(${rotation + ringIndex * 36}deg)`,
                  }}
                >
                  {treeElements
                    .filter((_, idx) => idx % 10 === ringIndex)
                    .map((element) => (
                      <div
                        key={element.id}
                        style={{
                          transform: `translateZ(${Math.sin((rotation + element.baseOffset) * Math.PI / 180) * 30}px)`,
                          opacity: 0.5 + Math.sin((rotation + element.baseOffset) * Math.PI / 180) * 0.5,
                        }}
                      >
                        {element.type === 'text' && (
                          <span className="tree-marking">{element.content}</span>
                        )}
                        {element.type === 'knot' && <div className="tree-knot" />}
                        {element.type === 'crack' && <div className="tree-crack" />}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tree-roots" />

      <div className="info-panel">
        <h1>AI Emotions</h1>
        <p>Scroll to explore the tree of emotions</p>
        <p style={{ fontSize: '0.9em', marginTop: '10px', color: 'rgba(139, 90, 60, 0.8)' }}>
          Rotation: {Math.round(rotation)}°
        </p>
      </div>

      <div className="scroll-indicator">
        ↓ Scroll to rotate the tree ↓
      </div>
    </div>
  );
}

export default App;
