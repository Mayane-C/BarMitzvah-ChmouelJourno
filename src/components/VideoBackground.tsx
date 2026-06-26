'use client';

import { useEffect, useRef } from 'react';
import { content } from '@/lib/content';

interface FramesConfig {
  base: string;
  count: number;
  pad: number;
  ext: string;
}

/**
 * Fond d'écran animé PAR LE SCROLL — séquence d'images (pas de vidéo).
 * - Au départ : 1ʳᵉ image, figée.
 * - Au scroll : on affiche l'image correspondant à la progression du scroll.
 * - FLUIDITÉ : deux images superposées + fondu enchaîné sur la fraction de
 *   position → pas de « saut » entre images (même avec peu d'images).
 * Aucune lecture, aucun « play » → fonctionne à l'identique desktop ET iPhone.
 */
export function VideoBackground({
  frames = content.video.frames,
  rotation = content.video.rotation,
  veil = false,
}: {
  frames?: FramesConfig;
  rotation?: number;
  veil?: boolean;
}) {
  const imgARef = useRef<HTMLImageElement>(null);
  const imgBRef = useRef<HTMLImageElement>(null);
  const targetIdx = useRef(0);
  const curIdx = useRef(0);
  const rafRef = useRef(0);

  const F = frames;
  const frameSrc = (i: number) =>
    `${F.base}${String(i).padStart(F.pad, '0')}${F.ext}`; // i : 1 → count
  const deg = rotation ?? 0;
  const portrait = Math.abs(deg % 180) === 90;

  useEffect(() => {
    // Précharge toutes les frames (mises en cache → bascule instantanée).
    const preloaded: HTMLImageElement[] = [];
    for (let i = 1; i <= F.count; i++) {
      const im = new Image();
      im.src = frameSrc(i);
      preloaded.push(im);
    }

    const computeTarget = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      targetIdx.current = progress * (F.count - 1); // 0 → count-1
    };

    let lastA = -1;
    let lastB = -1;
    const tick = () => {
      // lissage vers la position cible
      curIdx.current += (targetIdx.current - curIdx.current) * 0.16;
      const c = Math.min(Math.max(curIdx.current, 0), F.count - 1);
      const i0 = Math.floor(c);
      const i1 = Math.min(i0 + 1, F.count - 1);
      const frac = c - i0;

      const a = imgARef.current;
      const b = imgBRef.current;
      if (a && lastA !== i0) {
        a.setAttribute('src', frameSrc(i0 + 1));
        lastA = i0;
      }
      if (b && lastB !== i1) {
        b.setAttribute('src', frameSrc(i1 + 1));
        lastB = i1;
      }
      // image A dessous (pleine), image B au-dessus en fondu → transition douce
      if (b) b.style.opacity = String(frac);

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', computeTarget, { passive: true });
    window.addEventListener('resize', computeTarget);
    computeTarget();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', computeTarget);
      window.removeEventListener('resize', computeTarget);
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [F.base, F.count]);

  const imgStyle: React.CSSProperties = {
    width: portrait ? '100vh' : '100vw',
    height: portrait ? '100vw' : '100vh',
    maxWidth: 'none',
    maxHeight: 'none',
    transform: `translate(-50%, -50%) rotate(${deg}deg)`,
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-sand" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgARef}
        src={frameSrc(1)}
        alt=""
        className="absolute left-1/2 top-1/2 object-cover"
        style={imgStyle}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgBRef}
        src={frameSrc(1)}
        alt=""
        className="absolute left-1/2 top-1/2 object-cover"
        style={{ ...imgStyle, opacity: 0 }}
      />
      {/* Voile crème — lisibilité du texte (lien / uniquement) */}
      {veil && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(251,246,236,0.62), rgba(244,236,221,0.74))',
          }}
        />
      )}
    </div>
  );
}
