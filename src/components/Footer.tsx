import { content } from '@/lib/content';

export function Footer() {
  return (
    <footer className="py-14 px-6 text-center bg-sand-deep">
      <p className="font-display text-2xl text-sky-deep">
        {content.enfant.prenom} {content.enfant.nom}
      </p>
      <div className="flex items-center justify-center gap-3 my-4">
        <div className="w-10 h-px bg-sky/60" />
        <span className="text-sun text-xs">☀︎</span>
        <div className="w-10 h-px bg-sky/60" />
      </div>

      <a
        href="https://latouchedesigner.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Site de La Touche Designer (nouvel onglet)"
        className="group inline-flex flex-col items-center gap-2 mt-2 cursor-pointer"
      >
        <img
          src={content.visuels.logoLTD}
          alt="La Touche Designer"
          className="w-11 h-auto opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
        />
        <span className="inline-flex items-center gap-1 text-sky-deep/80 group-hover:text-sky-deep text-[11px] tracking-[0.12em] uppercase underline underline-offset-4 decoration-sky-deep/40 group-hover:decoration-sky-deep transition-colors">
          Créé par La Touche Designer
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <path d="M7 17 L17 7" />
            <path d="M8 7 H17 V16" />
          </svg>
        </span>
      </a>
      <p className="mt-2 text-ink-soft/55 text-[9px] uppercase tracking-[0.06em]">
        © 2026 La Touche Designer · Tous droits réservés
      </p>
    </footer>
  );
}
