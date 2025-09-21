import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
  "aria-label"?: string;
  iconSize?: number;
  iconClassName?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  isFavorite, 
  onToggle, 
  className = "p-2.5 rounded-full hover:bg-orange-100/80 self-start",
  "aria-label": ariaLabel,
  iconSize = 20,
  iconClassName = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFavorite) {
      setIsAnimating(true);
    }
    onToggle(e);
  };

  const defaultAriaLabel = isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti";

  return (
    <button 
      onClick={handleClick} 
      className={className}
      aria-label={ariaLabel || defaultAriaLabel}
    >
      <Heart 
        size={iconSize} 
        onAnimationEnd={() => setIsAnimating(false)}
        className={`transition-all duration-300 ${isFavorite ? 'text-orange-500 fill-orange-500' : 'text-slate-400'} ${isAnimating ? 'animate-heart-pulse' : ''} ${iconClassName}`} 
      />
    </button>
  );
};

export default FavoriteButton;