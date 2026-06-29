'use client';

import { useEffect, useRef, useState } from 'react';
import { content } from '@/lib/content';

/**
 * Fond d'écran orchestré sur tout le scroll de la page.
 *
 * Phases — déterminées par les ID DOM des sections :
 *   ┌─────────────────────┬────────────────────────────────────────────┐
 *   │ Section              │ Fond                                       │
 *   ├─────────────────────┼────────────────────────────────────────────┤
 *   │ #invitation (hero)   │ Vidéo début, frame 1 figée                 │
 *   │ #annonce             │ Vidéo début, dernière frame (240)          │
 *   │ #chmouel-photo-1a    │ Photo Chmouel 1                            │
 *   │ #chmouel-photo-2     │ Photo Chmouel 2                            │
 *   │ #chmouel-photo-1b    │ Photo Chmouel 1                            │
 *   │ #new-york → footer   │ Vidéo fin, frame liée au scroll (1 → 240)  │
 *   └─────────────────────┴────────────────────────────────────────────┘
 *
 * Événement custom :
 *   `ltd:play-intro` — déclenche l'animation auto des frames 1 → 240 de
 *   la vidéo début (cinematic intro) avant de débloquer le scroll.
 *
 * Deux couches d'images superposées + opacité = crossfade fluide entre
 * phases ET entre frames consécutives de la même vidéo.
 */

type PhaseKind = 'debut-frozen' | 'debut-end' | 'debut-intro';

interface PhaseBoundaries {
  heroEnd: number;
  annonceEnd: number;
  photo1aEnd: number;
  photo2End: number;
  photo1bEnd: number;
  rsvpStart: number;
  finEnd: number;
}

const DEBUT = content.videos.debut;
const FIN = content.videos.fin;
const PHOTO_1 = content.photos.chmouel1;
const PHOTO_2 = content.photos.chmouel2;

interface FramesCfg {
  base: string;
  count: number;
  pad: number;
  ext: string;
}

const frameSrc = (cfg: FramesCfg, i: number) =>
  `${cfg.base}${String(i).padStart(cfg.pad, '0')}${cfg.ext}`;

export function BackgroundSequence() {
  const layerARef = useRef<HTMLImageElement>(null);
  const layerBRef = useRef<HTMLImageElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<PhaseKind>('debut-frozen');
  const introFrameRef = useRef(1); // index courant de l'intro auto
  const finFrameRef = useRef(1);   // index courant de la fin (scroll-tied)
  const boundariesRef = useRef<PhaseBoundaries | null>(null);

  const [layerASrc, setLayerASrc] = useState<string>(frameSrc(DEBUT, 1));
  const [layerBSrc, setLayerBSrc] = useState<string>(frameSrc(DEBUT, 1));
  const [layerBOpacity, setLayerBOpacity] = useState(0);

  // ===== Préchargement complet des frames + photos =====
  useEffect(() => {
    const preload = (src: string) => {
      const im = new Image();
      im.src = src;
    };
    for (let i = 1; i <= DEBUT.count; i++) preload(frameSrc(DEBUT, i));
    for (let i = 1; i <= FIN.count; i++) preload(frameSrc(FIN, i));
    preload(PHOTO_1);
    preload(PHOTO_2);
  }, []);

  // ===== Recalcul des bornes de phases au mount + resize =====
  useEffect(() => {
    const recompute = () => {
      const hero = document.getElementById('invitation');
      const annonce = document.getElementById('annonce');
      const p1a = document.getElementById('chmouel-photo-1a');
      const p2 = document.getElementById('chmouel-photo-2');
      const p1b = document.getElementById('chmouel-photo-1b');
      const rsvp = document.getElementById('rsvp');
      const main = document.querySelector('main');
      if (!hero || !annonce || !p1a || !p2 || !p1b || !rsvp || !main) return;

      boundariesRef.current = {
        heroEnd: hero.offsetTop + hero.offsetHeight,
        annonceEnd: annonce.offsetTop + annonce.offsetHeight,
        photo1aEnd: p1a.offsetTop + p1a.offsetHeight,
        photo2End: p2.offsetTop + p2.offsetHeight,
        photo1bEnd: p1b.offsetTop + p1b.offsetHeight,
        rsvpStart: rsvp.offsetTop,
        finEnd: main.offsetTop + main.offsetHeight,
      };
    };
    recompute();
    window.addEventListener('resize', recompute);
    // Recompute après quelques ms (layout asynchrone)
    const t1 = setTimeout(recompute, 200);
    const t2 = setTimeout(recompute, 800);
    return () => {
      window.removeEventListener('resize', recompute);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // ===== Animation auto de l'intro (frames 1 → 240) + fade-out de
  // l'overlay hero pour révéler le fond. =====
  useEffect(() => {
    const INTRO_DURATION_MS = 4000;
    const onPlayIntro = () => {
      phaseRef.current = 'debut-intro';
      const overlay = heroOverlayRef.current;
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / INTRO_DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const idx = Math.max(1, Math.round(1 + eased * (DEBUT.count - 1)));
        introFrameRef.current = idx;
        // Overlay : 1 → 0 sur la même courbe
        if (overlay) overlay.style.opacity = String(1 - eased);
        if (p < 1) {
          requestAnimationFrame(animate);
        } else {
          phaseRef.current = 'debut-end';
          if (overlay) overlay.style.display = 'none';
        }
      };
      requestAnimationFrame(animate);
    };
    window.addEventListener('ltd:play-intro', onPlayIntro);
    return () => window.removeEventListener('ltd:play-intro', onPlayIntro);
  }, []);

  // ===== Boucle de rendu — sélection de la phase + crossfade =====
  useEffect(() => {
    let lastA = '';
    let lastB = '';
    let targetSrcCurrent = layerASrc;
    let targetSrcPrev = layerASrc;
    let crossfade = 0; // 0 = montre A seul ; 1 = montre B par-dessus

    const computePhaseSources = (): { current: string; veil: number } => {
      const b = boundariesRef.current;
      const y = window.scrollY + window.innerHeight * 0.5; // point de référence : milieu du viewport
      const introPhase = phaseRef.current;

      // Voile global : 0 partout (l'overlay du hero gère son propre voile à
      // part). On laisse la photo / la frame s'exprimer sans filtre crème.
      const NO_VEIL = 0;

      // ----- Intro auto en cours -----
      if (introPhase === 'debut-intro') {
        return { current: frameSrc(DEBUT, introFrameRef.current), veil: NO_VEIL };
      }

      if (!b) {
        return { current: frameSrc(DEBUT, 1), veil: NO_VEIL };
      }

      // ----- Hero : frame 1 figée, ou dernière frame si intro déjà jouée -----
      if (y < b.heroEnd) {
        const idx = introPhase === 'debut-frozen' ? 1 : DEBUT.count;
        return { current: frameSrc(DEBUT, idx), veil: NO_VEIL };
      }
      // ----- Annonce : dernière frame début (hall) -----
      if (y < b.annonceEnd) {
        return { current: frameSrc(DEBUT, DEBUT.count), veil: NO_VEIL };
      }
      // ----- Mini viewports photo (cycle 1 → 2 → 1, puis disparaît) -----
      if (y < b.photo1aEnd) return { current: PHOTO_1, veil: NO_VEIL };
      if (y < b.photo2End) return { current: PHOTO_2, veil: NO_VEIL };
      if (y < b.photo1bEnd) return { current: PHOTO_1, veil: NO_VEIL };

      // ----- Événements → RSVP → footer : vidéo fin scroll-tied
      //       (les photos disparaissent dès la fin de photo-1b) -----
      const total = Math.max(1, b.finEnd - b.photo1bEnd);
      const progress = Math.min(1, Math.max(0, (y - b.photo1bEnd) / total));
      const targetIdx = Math.max(1, Math.round(1 + progress * (FIN.count - 1)));
      finFrameRef.current += (targetIdx - finFrameRef.current) * 0.2;
      return { current: frameSrc(FIN, Math.round(finFrameRef.current)), veil: NO_VEIL };
    };

    let currentVeil = 0.4;
    let raf = 0;
    const tick = () => {
      const sources = computePhaseSources();
      const newTarget = sources.current;
      // Lissage de l'opacité du voile entre phases (sinon flash)
      currentVeil += (sources.veil - currentVeil) * 0.08;
      if (veilRef.current) {
        veilRef.current.style.opacity = String(currentVeil);
      }

      // Si la source change → on prépare un crossfade
      if (newTarget !== targetSrcCurrent) {
        targetSrcPrev = targetSrcCurrent;
        targetSrcCurrent = newTarget;
        crossfade = 0; // on va animer de 0 → 1
      }
      if (crossfade < 1) {
        crossfade = Math.min(1, crossfade + 0.06); // ~17 frames pour finir = ~300ms
      }

      // Layer A = source précédente (ou identique si pas de transition en cours)
      const aSrc = crossfade < 1 ? targetSrcPrev : targetSrcCurrent;
      // Layer B = nouvelle source
      const bSrc = targetSrcCurrent;
      const bOpacity = crossfade;

      // Sépia + désaturation appliqués uniquement sur le hero figé
      // (avant le clic Découvrir). Dès que l'intro démarre ou se termine,
      // on revient à des images nettes.
      const filterFor = (src: string) =>
        src.includes('/frames/debut/') && phaseRef.current === 'debut-frozen'
          ? 'sepia(0.4) saturate(0.7) brightness(1.05)'
          : 'none';

      if (aSrc !== lastA) {
        layerARef.current?.setAttribute('src', aSrc);
        if (layerARef.current) layerARef.current.style.filter = filterFor(aSrc);
        lastA = aSrc;
      }
      if (bSrc !== lastB) {
        layerBRef.current?.setAttribute('src', bSrc);
        if (layerBRef.current) layerBRef.current.style.filter = filterFor(bSrc);
        lastB = bSrc;
      }
      if (layerBRef.current) layerBRef.current.style.opacity = String(bOpacity);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const imgStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    objectPosition: 'center',
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-sand" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={layerARef}
        src={layerASrc}
        alt=""
        className="absolute inset-0"
        style={imgStyle}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={layerBRef}
        src={layerBSrc}
        alt=""
        className="absolute inset-0"
        style={{ ...imgStyle, opacity: layerBOpacity }}
      />
      {/* Voile crème dynamique — actuellement à 0 partout (les overlays
          spécifiques sont gérés à part). Conservé pour usage futur. */}
      <div
        ref={veilRef}
        className="absolute inset-0 pointer-events-none bg-sand"
        style={{ opacity: 0 }}
      />
      {/* Overlay du hero — actif avant le clic « Découvrir ». Voile crème
          dense + soupçon de vignette sombre dans les angles pour faire
          ressortir au maximum le vert royal des écritures et l'or de la
          couronne. Fondu à 0 pendant l'intro. */}
      <div
        ref={heroOverlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 1,
          background:
            'radial-gradient(ellipse at center, rgba(246,241,230,0.86) 0%, rgba(246,241,230,0.90) 55%, rgba(40,32,18,0.55) 100%)',
          transition: 'opacity 0.15s linear',
        }}
      />
    </div>
  );
}
