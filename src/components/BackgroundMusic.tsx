'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export interface BackgroundMusicHandle {
  play: () => void;
}

/**
 * Musique d'ambiance en boucle. La lecture est déclenchée par le parent
 * via `ref.play()` appelé directement dans le handler du clic Découvrir
 * (garantit que le play() est vu comme user-gesture immédiat par Safari).
 * Un petit bouton pastille en bas à droite permet de couper à tout
 * moment.
 */
export const BackgroundMusic = forwardRef<BackgroundMusicHandle>(function BackgroundMusic(_, ref) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.32;
    el.loop = true;
  }, []);

  useImperativeHandle(ref, () => ({
    play: () => {
      const el = audioRef.current;
      if (!el) return;
      // Skip la 1ʳᵉ seconde de silence/introduction : on entre direct
      // sur la mélodie.
      try { el.currentTime = 1.8; } catch {}
      el.play()
        .then(() => setStarted(true))
        .catch(() => {
          // Fallback : autoplay refusé, on retente au prochain geste.
          const retry = () => {
            try { el.currentTime = 1.8; } catch {}
            el.play().then(() => setStarted(true)).catch(() => {});
          };
          window.addEventListener('pointerdown', retry, { once: true });
          window.addEventListener('touchstart', retry, { once: true });
        });
    },
  }));

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    const next = !muted;
    el.muted = next;
    setMuted(next);
    if (!started) {
      el.play().then(() => setStarted(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/ambience.mp3" preload="auto" playsInline />
      <button
        type="button"
        aria-label={muted ? 'Activer la musique' : 'Couper la musique'}
        onClick={toggle}
        className="fixed bottom-4 right-4 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-sky-deep/85 border border-sun/70 text-sun shadow-[0_4px_14px_rgba(28,77,44,0.4)] backdrop-blur-sm hover:brightness-110 transition"
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </>
  );
});
