'use client';

import { useEffect, useRef, useState } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { content } from '@/lib/content';

// Verrou global : il ne peut JAMAIS y avoir deux pistes qui jouent en même
// temps (anti-double-instance React, anti-son résiduel de cache iOS…).
let activeAudio: HTMLAudioElement | null = null;
function stopActiveAudio() {
  if (activeAudio) {
    try {
      activeAudio.pause();
    } catch {
      /* ignore */
    }
    activeAudio = null;
  }
}

export function MusicButton({
  src = content.musique.src,
  loopEnd,
}: {
  src?: string;
  /** Si défini (secondes) : la musique reboucle à ce temps (jamais au-delà). */
  loopEnd?: number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    // Coupe toute lecture précédente avant d'en créer une nouvelle.
    stopActiveAudio();
    const audio = new Audio(src);
    audio.loop = !loopEnd; // boucle gérée manuellement (avec pause) si loopEnd
    audio.volume = 0.22;
    audio.addEventListener('error', () => setAvailable(false));
    audioRef.current = audio;

    // À 2:45 : pause de 1 s, puis rebouclage au début.
    let looping = false;
    const onTimeUpdate = () => {
      if (loopEnd && !looping && audio.currentTime >= loopEnd) {
        looping = true;
        audio.pause();
        setTimeout(() => {
          looping = false;
          // ne reprend que si la piste est toujours active (pas coupée/quittée)
          if (audioRef.current === audio && activeAudio === audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
          }
        }, 1000);
      }
    };
    if (loopEnd) audio.addEventListener('timeupdate', onTimeUpdate);

    // Lancement déclenché par le bouton « Découvrir » du hero.
    // (dispatch synchrone → on reste dans le geste utilisateur → play autorisé)
    const onPlayRequest = () => {
      stopActiveAudio(); // au cas où une autre piste tournerait encore
      activeAudio = audio;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setAvailable(false));
    };
    window.addEventListener('ltd:play-music', onPlayRequest);

    // Pause si on quitte / masque la page (évite le cumul via bfcache iOS).
    const onHide = () => {
      try {
        audio.pause();
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('pagehide', onHide);

    return () => {
      window.removeEventListener('ltd:play-music', onPlayRequest);
      window.removeEventListener('pagehide', onHide);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.pause();
      if (activeAudio === audio) activeAudio = null;
      audioRef.current = null;
    };
  }, [src, loopEnd]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      if (activeAudio === audio) activeAudio = null;
      setPlaying(false);
    } else {
      try {
        stopActiveAudio();
        activeAudio = audio;
        await audio.play();
        setPlaying(true);
      } catch {
        setAvailable(false);
      }
    }
  };

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? 'Couper la musique' : 'Activer la musique'}
      className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-sky-deep text-cream shadow-lg shadow-ink/20 flex items-center justify-center hover:bg-sky-deep/90 transition-colors"
    >
      {playing ? <Music size={20} className="animate-pulse" /> : <VolumeX size={20} />}
    </button>
  );
}
