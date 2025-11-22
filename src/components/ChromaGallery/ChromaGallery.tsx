import React, { useEffect, useState } from 'react';
import './ChromaGallery.css';

interface ChromaItem {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
  handle: string;
  borderColor: string;
  gradient: string;
  url: string;
  location?: string;
  opinion?: string;
  voiceId?: string;
}

interface ChromaGalleryProps {
  items: ChromaItem[];
  speakingCharacterId?: string | null;
  onCardClick?: (item: ChromaItem) => void;
}

export const ChromaGallery: React.FC<ChromaGalleryProps> = ({
  items,
  speakingCharacterId,
  onCardClick
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Sync active index with speaking character
  useEffect(() => {
    if (speakingCharacterId) {
      const index = items.findIndex(item => item.id === speakingCharacterId);
      if (index !== -1) {
        setActiveIndex(index);
      }
    }
  }, [speakingCharacterId, items]);

  const handleCardClick = (index: number, item: ChromaItem) => {
    setActiveIndex(index);
    if (onCardClick) {
      onCardClick(item);
    }
  };

  // Calculate styles for each card based on its position relative to active index
  const getCardStyle = (index: number) => {
    const offset = index - activeIndex;
    const absOffset = Math.abs(offset);
    
    // Basic visibility check - only render close cards to improve performance/clutter
    // But for "circular" feel with few items, we might want to wrap?
    // For now, let's do a linear "Cover Flow" style as requested.
    
    const isActive = offset === 0;
    
    // Config
    const scaleStep = 0.15;
    const rotateAngle = 25;
    const zIndexBase = 100;
    
    let style: React.CSSProperties = {
      zIndex: zIndexBase - absOffset,
      opacity: absOffset > 2 ? 0 : 1, // Hide cards far away
      pointerEvents: absOffset > 2 ? 'none' : 'auto',
    };

    if (isActive) {
      style.transform = `translate(-50%, 0) scale(1) translateZ(100px) rotateY(0deg)`;
    } else if (offset < 0) {
      // Left side
      const xPos = -50 - (absOffset * 40); // Move left by 40% for each step
      const scale = 1 - (absOffset * scaleStep);
      const rotate = rotateAngle;
      
      style.transform = `translate(${xPos}%, 0) scale(${Math.max(0, scale)}) translateZ(-${absOffset * 50}px) rotateY(${rotate}deg)`;
      style.left = '50%'; // Base
    } else {
      // Right side
      const xPos = -50 + (absOffset * 40);
      const scale = 1 - (absOffset * scaleStep);
      const rotate = -rotateAngle; // Tilt right
      
      style.transform = `translate(${xPos}%, 0) scale(${Math.max(0, scale)}) translateZ(-${absOffset * 50}px) rotateY(${rotate}deg)`;
      style.left = '50%';
    }

    return style;
  };

  // For "Circular" wrapping logic (optional):
  // If we want index -1 to be the last item, we need modulo arithmetic.
  // But the user prompt implies a linear flow where "middle character" changes.
  // "the character no the middle character's right... might have another one to its right"
  // This implies a linear list that shifts.
  
  // However, to make it truly "circular" (infinite), we'd need to virtually duplicate items or use modulo.
  // Given "all depending on the number of characters we have", and "once a character moves it becomes the middle",
  // let's stick to the linear list for now, but clamp the view? 
  // Or better: Just render them all and let the transform logic handle the "pile".
  
  return (
    <div className="chroma-gallery">
      <div className="chroma-gallery-track">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={item.id || index}
              className={`chroma-gallery-card ${isActive ? 'active' : ''}`}
              style={{
                ...getCardStyle(index),
                '--card-border': item.borderColor || 'transparent',
                '--card-gradient': item.gradient,
              } as React.CSSProperties}
              onClick={() => handleCardClick(index, item)}
            >
              <div className="chroma-img-wrapper">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="chroma-info">
                <h3 className="name">{item.title}</h3>
                <span className="handle">{item.handle}</span>
                <p className="role">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChromaGallery;
