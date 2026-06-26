'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitRSVP } from '@/lib/google-sheets';
import { content } from '@/lib/content';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const clampCount = (value: string): number | '' =>
  value === '' ? '' : Math.min(Math.max(parseInt(value, 10) || 0, 0), 20);

export function RSVP({ includeChabbat }: { includeChabbat: boolean }) {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [data, setData] = useState({
    prenom: '',
    nom: '',
    soireeAdultes: '' as number | '',
    soireeEnfants: '' as number | '',
    chabbatAdultes: '' as number | '',
    chabbatEnfants: '' as number | '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === 'number' ? clampCount(value) : value,
    }));
  };

  const n = (v: number | '') => Number(v) || 0;
  const totalAdultes = n(data.soireeAdultes) + (includeChabbat ? n(data.chabbatAdultes) : 0);
  const totalEnfants = n(data.soireeEnfants) + (includeChabbat ? n(data.chabbatEnfants) : 0);
  const total = totalAdultes + totalEnfants;

  // « Ne pourront pas venir » = 0 adulte ET 0 enfant (coché automatiquement).
  const soireeAbsent = data.soireeAdultes === 0 && data.soireeEnfants === 0;
  const chabbatAbsent = data.chabbatAdultes === 0 && data.chabbatEnfants === 0;

  // Cocher la case → met 0 / 0 ; décocher → vide les champs.
  const setSoireeAbsent = (checked: boolean) =>
    setData((prev) => ({
      ...prev,
      soireeAdultes: checked ? 0 : '',
      soireeEnfants: checked ? 0 : '',
    }));
  const setChabbatAbsent = (checked: boolean) =>
    setData((prev) => ({
      ...prev,
      chabbatAdultes: checked ? 0 : '',
      chabbatEnfants: checked ? 0 : '',
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setErrorMessage('');

    const result = await submitRSVP({
      prenom: data.prenom,
      nom: data.nom,
      soireeAdultes: n(data.soireeAdultes),
      soireeEnfants: n(data.soireeEnfants),
      chabbatAdultes: includeChabbat ? n(data.chabbatAdultes) : 0,
      chabbatEnfants: includeChabbat ? n(data.chabbatEnfants) : 0,
      soireeAbsent,
      chabbatAbsent: includeChabbat ? chabbatAbsent : false,
      message: data.message,
      version: includeChabbat ? 'chabbat' : 'soiree',
    });

    if (result.success) {
      setFormState('success');
    } else {
      setFormState('error');
      setErrorMessage(result.error || 'Une erreur est survenue.');
    }
  };

  const inputClasses =
    'w-full bg-sand/60 border-0 border-b border-sky-deep/30 rounded-none px-4 py-3 text-ink placeholder:text-ink-soft/50 outline-none transition-all focus:border-sky-deep focus:bg-sand';
  const labelClasses =
    'block text-ink-soft text-xs tracking-wider uppercase mb-2';

  if (formState === 'success') {
    return (
      <section id="rsvp" className="py-24 md:py-32 px-6">
        <motion.div
          className="max-w-lg mx-auto text-center bg-cream/85 rounded-3xl shadow-lg shadow-ink/5 p-12"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-5xl mb-6">☀︎</div>
          <h3 className="font-display text-4xl text-sky-deep mb-4">Merci !</h3>
          <p className="text-ink-soft">
            Votre réponse a bien été enregistrée. Nous avons hâte de partager ce moment
            avec vous.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-24 md:py-32 px-6">
      <div className="max-w-lg mx-auto">
        <motion.div
          className="mb-10 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-block text-center bg-cream/80 rounded-3xl px-8 py-5 shadow-sm shadow-ink/5">
            <h2 className="shine-gold font-display text-4xl md:text-5xl mb-2">Répondez-nous</h2>
            <p className="text-ink text-sm">
              Merci de confirmer votre présence pour {content.enfant.prenom}.
            </p>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-cream/85 rounded-3xl shadow-lg shadow-ink/5 p-7 md:p-9 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>
                Prénom <span className="text-sky-deep">*</span>
              </label>
              <input
                type="text"
                name="prenom"
                value={data.prenom}
                onChange={handleChange}
                required
                placeholder="Prénom"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>
                Nom <span className="text-sky-deep">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={data.nom}
                onChange={handleChange}
                required
                placeholder="Nom"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Chabbat — uniquement sur le lien /chabbat (affiché en premier) */}
          {includeChabbat && (
            <fieldset className="border border-sky-deep/30 rounded-2xl p-5">
              <legend className="px-2 font-display text-xl text-sky-deep">Chabbat Bar Mitsva — Neuilly-Plaisance</legend>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Adultes</label>
                  <input
                    type="number"
                    name="chabbatAdultes"
                    value={data.chabbatAdultes}
                    onChange={handleChange}
                    min="0"
                    max="20"
                    placeholder="0"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Enfants</label>
                  <input
                    type="number"
                    name="chabbatEnfants"
                    value={data.chabbatEnfants}
                    onChange={handleChange}
                    min="0"
                    max="20"
                    placeholder="0"
                    className={inputClasses}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 mt-4 text-sm text-ink-soft cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={chabbatAbsent}
                  onChange={(e) => setChabbatAbsent(e.target.checked)}
                  className="w-4 h-4 accent-sky-deep"
                />
                Nous ne pourrons pas être présents
              </label>
            </fieldset>
          )}

          {/* Soirée */}
          <fieldset className="border border-sky-deep/30 rounded-2xl p-5">
            <legend className="px-2 font-display text-xl text-sky-deep">La Soirée — Paris</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Adultes</label>
                <input
                  type="number"
                  name="soireeAdultes"
                  value={data.soireeAdultes}
                  onChange={handleChange}
                  min="0"
                  max="20"
                  placeholder="0"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Enfants</label>
                <input
                  type="number"
                  name="soireeEnfants"
                  value={data.soireeEnfants}
                  onChange={handleChange}
                  min="0"
                  max="20"
                  placeholder="0"
                  className={inputClasses}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 mt-4 text-sm text-ink-soft cursor-pointer select-none">
              <input
                type="checkbox"
                checked={soireeAbsent}
                onChange={(e) => setSoireeAbsent(e.target.checked)}
                className="w-4 h-4 accent-sky-deep"
              />
              Nous ne pourrons pas être présents
            </label>
          </fieldset>

          <div>
            <label className={labelClasses}>Un message pour {content.enfant.prenom}</label>
            <textarea
              name="message"
              value={data.message}
              onChange={handleChange}
              rows={3}
              placeholder="Un petit mot, une bénédiction…"
              className={`${inputClasses} resize-none`}
            />
          </div>

          {/* Récap totaux */}
          <div className="flex items-center justify-center gap-6 text-sm text-ink-soft">
            <span>
              Adultes : <strong className="text-sky-deep">{totalAdultes}</strong>
            </span>
            <span>
              Enfants : <strong className="text-sky-deep">{totalEnfants}</strong>
            </span>
            <span>
              Total : <strong className="text-sky-deep">{total}</strong>
            </span>
          </div>

          {formState === 'error' && (
            <div className="p-4 border border-sky-deep/40 rounded-xl text-sm text-ink flex items-center justify-between bg-sky/5">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => setFormState('idle')}
                className="ml-4 text-sky-deep underline text-xs uppercase tracking-wider"
              >
                Réessayer
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={formState === 'submitting'}
            className="btn-premium w-full disabled:opacity-60 py-4 rounded-full text-base tracking-normal"
          >
            {formState === 'submitting' ? 'Envoi en cours…' : 'Confirmer ma présence'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
