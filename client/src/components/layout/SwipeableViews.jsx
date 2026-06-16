import React from 'react';
import { useSwipeable } from 'react-swipeable';

// Lightweight replacement for react-swipeable-views (which relies on
// ReactDOM.findDOMNode, removed in React 19). Renders children in a horizontal
// track and animates between them via CSS transform; swipe gestures are handled
// by react-swipeable. API kept compatible: { index, onChangeIndex, disabled }.
const SwipeableViews = ({ index = 0, onChangeIndex, disabled = false, children }) => {
  const slides = React.Children.toArray(children);
  const count = slides.length || 1;
  const clamp = (i) => Math.max(0, Math.min(count - 1, i));

  const handlers = useSwipeable({
    onSwipedLeft: () => { if (!disabled) onChangeIndex && onChangeIndex(clamp(index + 1)); },
    onSwipedRight: () => { if (!disabled) onChangeIndex && onChangeIndex(clamp(index - 1)); },
    trackMouse: false,
    preventScrollOnSwipe: true
  });

  return (
    <div {...handlers} style={{ overflow: 'hidden', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          width: `${count * 100}%`,
          transform: `translateX(-${index * (100 / count)}%)`,
          transition: 'transform 0.35s ease'
        }}
      >
        {slides.map((child, i) => (
          <div key={i} style={{ width: `${100 / count}%`, flexShrink: 0 }}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwipeableViews;
