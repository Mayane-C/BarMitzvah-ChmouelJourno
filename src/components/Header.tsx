'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { content } from '@/lib/content';

interface NavLink {
  href: string;
  label: string;
}

export function Header({
  includeChabbat,
  onReveal,
}: {
  includeChabbat: boolean;
  onReveal?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // (le param `includeChabbat` n'est plus utilisé pour Chmouel mais reste dans
  // la signature pour compatibilité avec l'appelant)
  void includeChabbat;
  const links: NavLink[] = [
    { href: '#invitation', label: 'Invitation' },
    { href: '#new-york', label: 'New York' },
    { href: '#paris', label: 'France' },
    { href: '#rsvp', label: 'Répondre' },
  ];

  // Navigation par ancre : déverrouille le scroll (au cas où on n'a pas encore
  // cliqué « Découvrir ») puis défile en douceur vers la section.
  const handleNav = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    document.body.style.overflow = '';
    onReveal?.();
    const el = document.querySelector(href) as HTMLElement | null;
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-sand/90 backdrop-blur-md shadow-sm shadow-ink/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-5 py-4">
        <a
          href="#invitation"
          onClick={(e) => handleNav(e, '#invitation')}
          className={`font-display text-xl md:text-2xl tracking-wide transition-colors duration-500 ${
            scrolled ? 'text-sky-deep' : 'text-cream'
          }`}
        >
          {content.enfant.prenom} {content.enfant.nom}
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => handleNav(e, l.href)}
                className={`text-sm uppercase tracking-[0.18em] transition-colors duration-500 ${
                  scrolled
                    ? 'text-ink-soft hover:text-sky-deep'
                    : 'text-cream/90 hover:text-cream'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger mobile */}
        <button
          type="button"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`md:hidden p-2 -mr-2 transition-colors duration-500 ${
            scrolled || open ? 'text-sky-deep' : 'text-cream'
          }`}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Overlay menu mobile (ancres) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 top-[64px] bg-sand/97 backdrop-blur-md"
          >
            <motion.ul
              className="flex flex-col items-center justify-center gap-8 h-full -mt-16"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
              }}
            >
              {links.map((l) => (
                <motion.li
                  key={l.href}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <a
                    href={l.href}
                    onClick={(e) => handleNav(e, l.href)}
                    className="font-display text-3xl text-sky-deep hover:text-sun transition-colors"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
