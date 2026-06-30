'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Flèches « scrollez » fixes sur les côtés gauche et droit du viewport.
 * Ne défilent jamais avec la page. Apparaissent dès que le bas du
 * faire-part atteint le bas du viewport (signal qu'il y a la suite à
 * découvrir), restent affichées pendant toute la zone photos puis
 * disparaissent.
 */
function Arrow() {
  return (
    <motion.svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
      className="drop-shadow-[0_1px_3px_rgba(246,241,230,0.85)]"
    >
      <path d="M6 9 L 12 15 L 18 9" />
      <path d="M6 4 L 12 10 L 18 4" opacity="0.55" />
    </motion.svg>
  );
}

export function ScrollHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const annonce = document.getElementById('annonce');
      const p1b = document.getElementById('chmouel-photo-1b');
      if (!annonce) return;
      const sy = window.scrollY;
      const vH = window.innerHeight;
      // Apparition : le bas du faire-part est passé sous le bas du
      // viewport (l'invité a bien vu le bloc en entier).
      const showAt = sy > annonce.offsetTop + annonce.offsetHeight - vH;
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
      className="fixed inset-0 pointer-events-none z-30 text-sun"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6 }}
      aria-hidden={!visible}
    >
      <div className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2">
        <Arrow />
      </div>
      <div className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2">
        <Arrow />
      </div>
    </motion.div>
  );
}
