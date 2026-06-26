export interface RSVPFormData {
  prenom: string;
  nom: string;
  soireeAdultes: number;
  soireeEnfants: number;
  chabbatAdultes: number;
  chabbatEnfants: number;
  /** true = ne pourra pas être présent (0 adulte + 0 enfant) */
  soireeAbsent: boolean;
  chabbatAbsent: boolean;
  message?: string;
  /** 'soiree' (lien /) ou 'chabbat' (lien /chabbat) */
  version: 'soiree' | 'chabbat';
}

// URL du script Apps Script (RSVP → Google Sheet).
const DEFAULT_GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxA9xB8B0JCXkIKdKpkEX5x7hZh5df45Q_ijvt-q70hQIBNG1b2YR1HECa7VyZUcwCK/exec';

const GOOGLE_SCRIPT_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || DEFAULT_GOOGLE_SCRIPT_URL;

// Code partagé avec le script (garde-fou anti-spam léger). Doit être IDENTIQUE
// à la valeur SECRET dans google-apps-script.gs.
const SECRET = 'akoun-rapha-2026-mer';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Envoie la réponse RSVP au script Apps Script et CONFIRME l'enregistrement.
 * - Corps en text/plain (JSON) → « simple request », pas de preflight CORS,
 *   et la réponse est LISIBLE (on sait si ça a réussi).
 * - Réessaie automatiquement (jusqu'à 3 fois) en cas de coupure réseau.
 */
export async function submitRSVP(
  data: RSVPFormData
): Promise<{ success: boolean; error?: string }> {
  if (!GOOGLE_SCRIPT_URL) {
    return { success: false, error: 'Configuration manquante.' };
  }

  const payload = {
    token: SECRET,
    date: new Date().toLocaleString('fr-FR'),
    prenom: data.prenom,
    nom: data.nom,
    version: data.version,
    soireeAdultes: data.soireeAdultes,
    soireeEnfants: data.soireeEnfants,
    chabbatAdultes: data.chabbatAdultes,
    chabbatEnfants: data.chabbatEnfants,
    soireeAbsent: data.soireeAbsent,
    chabbatAbsent: data.chabbatAbsent,
    message: data.message || '',
  };

  let lastError = 'Une erreur est survenue. Veuillez réessayer.';

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        // text/plain → requête « simple » (pas de preflight) ET réponse lisible
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        signal: controller.signal,
        redirect: 'follow',
      });
      clearTimeout(timeoutId);

      const json = await res.json().catch(() => null);
      if (json && json.result === 'success') {
        return { success: true };
      }
      lastError =
        (json && json.error === 'unauthorized')
          ? 'Accès refusé par le serveur.'
          : 'Réponse inattendue du serveur.';
    } catch (error) {
      lastError =
        error instanceof Error && error.name === 'AbortError'
          ? 'Délai dépassé.'
          : 'Problème de connexion.';
    }

    // petite pause croissante avant de réessayer (sauf après la dernière tentative)
    if (attempt < 3) await sleep(700 * attempt);
  }

  return { success: false, error: lastError + ' Veuillez réessayer.' };
}
