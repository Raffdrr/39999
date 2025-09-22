import { useState } from 'react';

interface SwipeInput {
  onSwipedLeft: () => void;
  onSwipedRight: () => void;
}

const useSwipe = (input: SwipeInput) => {
  // Use objects to store both x and y coordinates
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  
  const minSwipeDistance = 50; 

  const onTouchStart = (e: React.TouchEvent) => {
    // Reset touchEnd and set touchStart coordinates for the new touch
    setTouchEnd({ x: 0, y: 0 });
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    // Update touchEnd coordinates as the finger moves
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchEnd = () => {
    // If touchStart or touchEnd haven't been set properly (e.g., a simple tap), exit
    if (touchStart.x === 0 || touchEnd.x === 0) return;
    
    const dx = touchStart.x - touchEnd.x;
    const dy = touchStart.y - touchEnd.y;

    // IMPORTANT: Check if the swipe is primarily horizontal before triggering actions.
    // This prevents conflicts with vertical scrolling or pull-to-dismiss gestures.
    if (Math.abs(dx) > Math.abs(dy)) {
      const isLeftSwipe = dx > minSwipeDistance;
      const isRightSwipe = dx < -minSwipeDistance;

      if (isLeftSwipe) {
        input.onSwipedLeft();
      }
      if (isRightSwipe) {
        input.onSwipedRight();
      }
    }
    
    // Reset state for the next swipe action
    setTouchStart({ x: 0, y: 0 });
    setTouchEnd({ x: 0, y: 0 });
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

export default useSwipe;
