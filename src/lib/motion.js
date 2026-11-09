export const SPRING = { type: 'spring', stiffness: 300, damping: 22 };

// Hover micro-animations for icons: [keyframes, duration]
export const ICON_ANIMS = {
  nudge: [{ x: [0, 5, 0] }, 0.45],
  spin: [{ rotate: [0, 360] }, 0.6],
  wiggle: [{ rotate: [0, -14, 12, -8, 0] }, 0.6],
  pop: [{ scale: [1, 1.3, 1] }, 0.4],
  fly: [{ x: [0, 4, 0], y: [0, -4, 0] }, 0.5],
};
