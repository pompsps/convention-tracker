import { useRef } from "react";

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 60, // minimum px of horizontal movement
}: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}) {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onTouchStart: (e: React.TouchEvent) => {
      // don't treat typing, selects, or marked areas as swipes
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [data-no-swipe]")) {
        start.current = null;
        return;
      }
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
    },

    onTouchEnd: (e: React.TouchEvent) => {
      if (!start.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      start.current = null;

      // too short, or mostly vertical (the user was scrolling)
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.5) return;

      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    },
  };
}
