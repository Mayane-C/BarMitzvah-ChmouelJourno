'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Indicateur « Faites défiler » fixe au bas du viewport. N'est PAS dans
 * le flux du document — il ne scroll pas avec la page. Apparaît quand
 * le bas du faire-part atteint ~75 % de la hauteur du viewport (= le
 * même moment où la photo 1 entre en fond), reste affiché tant qu'on
 * est dans la zone photos, puis disparaît.
 */
export function ScrollHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const annonce = document.getElementById('annonce');
      const p1b = document.getElementById('chmouel-photo-1b');
      if (!annonce) return;

      // Apparition : bas du faire-part à 75 % du viewport → annonce
      // bottom in viewport = 0.75 * vH.
      const sy = window.scrollY;
      const vH = window.innerHeight;
      const annonceBottomInView = annonce.offsetTop + annonce.offsetHeight - sy;
      const showAt = annonceBottomInView <= vH * 0.75;

      // Disparition : on est passé après la dernière photo.
      const hideAt = p1b ? sy > p1b.offsetTop + p1b.offsetHeight - vH * 0.5 : false;

      setVisible(showAt && !hideAt);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-sun z-30 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6 }}
      aria-hidden={!visible}
    >
      <span className="font-display italic text-ink-soft/85 text-sm md:text-base tracking-wide drop-shadow-[0_1px_2px_rgba(246,241,230,0.9)]">
        Faites défiler
      </span>
      <motion.svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M6 9 L 12 15 L 18 9" />
      </motion.svg>
    </motion.div>
  );
}
