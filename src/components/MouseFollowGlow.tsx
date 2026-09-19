import { useEffect, useState } from 'react';

export function MouseFollowGlow() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReduced(media.matches);

    const onMediaChange = () => setIsReduced(media.matches);
    media.addEventListener('change', onMediaChange);

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      media.removeEventListener('change', onMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (isReduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-60"
      style={{
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(59, 130, 246, 0.07), rgba(147, 51, 234, 0.04), transparent 70%)`,
      }}
    />
  );
}
