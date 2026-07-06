'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * Musique d'ambiance en boucle. Lecture déclenchée par l'événement
 * `ltd:play-intro` (clic « Découvrir ») pour respecter la politique
 * autoplay des navigateurs (geste utilisateur requis). Un petit bouton
 * fixe en bas à droite permet de couper le son à tout moment.
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.32;
    el.loop = true;

    const start = () => {
      el.play()
        .then(() => setStarted(true))
        .catch(() => {
          // Autoplay refusé : on retentera au prochain geste utilisateur.
          const retry = () => {
            el.play().then(() => setStarted(true)).catch(() => {});
            window.removeEventListener('pointerdown', retry);
          };
          window.addEventListener('pointerdown', retry, { once: true });
        });
    };

    window.addEventListener('ltd:play-intro', start);
    return () => window.removeEventListener('ltd:play-intro', start);
  }, []);

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
}
