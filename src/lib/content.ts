/**
 * Source unique du contenu éditable du faire-part — Bar Mitsva Chmouel Journo.
 * Tout ce qui se modifie sans toucher au code est ici.
 */

export const content = {
  enfant: {
    prenom: 'Chmouel',
    nom: 'Journo',
    surnom: 'Chmoulik',
  },

  // Cible du compte à rebours (date+heure de la soirée, fuseau Paris).
  countdownTarget: '2026-08-30T19:00:00+02:00',

  // Faire-part (texte de l'annonce)
  annonce: {
    siyata: 'בס״ד',
    // Verset des téfilines (Devarim 6:8) — affiché en arc dans l'annonce
    verset: 'וּקְשַׁרְתֶּם לְאוֹת עַל־יָדֶךָ וְהָיוּ לְטֹטָפֹת בֵּין עֵינֶיךָ',
    // Grands-parents — deux colonnes (paternels à gauche, maternels à droite)
    grandsParents: {
      gauche: ['M. et Mme Journo Tsion'],
      droite: ['Mme Smadja Myriam'],
    },
    // Parents
    famille: 'M. et Mme Journo Chalom',
    intro: 'ont la joie de vous faire part de la',
    evenement: 'Bar Mitsva',
    lien: 'de leur petit-fils et fils',
    prenom: 'Chmouel',
    prenomSecond: '', // TODO : seconds prénoms si applicable
    nom: 'Journo',
    prenomHe: '', // TODO : nom hébraïque
    pensee: '', // TODO : pensée éventuelle (laisser vide si non utilisée)
  },

  // Événements groupés par zone géographique
  // (la distinction NY / Paris se fait via les sous-titres dans Invitation)
  evenements: {
    newYork: [
      {
        id: 'chabbat-ki-tetze',
        titre: 'Chabbat Parachat Ki Tetzé',
        icon: 'candles',
        date: 'Du vendredi 21 au samedi 22 août 2026',
        heure: '',
        lieu: 'Chez le Rabbi',
        adresse: '770 Eastern Parkway, Brooklyn, NY 11213',
        wazeUrl: '',
      },
      {
        id: 'maamar-ohel',
        titre: 'Maamar au Ohel + Repas de Bar Mitsva',
        icon: 'tefilin',
        date: 'Samedi 22 août 2026',
        heure: 'Motsaé Chabbat',
        lieu: 'Ohel — Tombe du Rabbi',
        adresse: '226-20 Francis Lewis Blvd, Cambria Heights, NY 11411',
        wazeUrl: '',
      },
      {
        id: 'priere-770',
        titre: 'Prière du matin au 770',
        icon: 'tefilin',
        date: 'Dimanche 23 août 2026',
        heure: 'Matin',
        lieu: '770 — Synagogue du Rabbi',
        adresse: '770 Eastern Parkway, Brooklyn, NY 11213',
        wazeUrl: '',
      },
      {
        id: 'montee-torah',
        titre: 'Montée à la Torah',
        icon: 'tefilin',
        date: 'Lundi 24 août 2026',
        heure: 'Matin',
        lieu: 'Bureau du Rabbi',
        adresse: '770 Eastern Parkway, Brooklyn, NY 11213',
        wazeUrl: '',
      },
    ],
    paris: [
      {
        id: 'chabbat-ki-tavo',
        titre: 'Chabbat Bar Mitsva — Parachat Ki Tavo',
        icon: 'candles',
        date: 'Du vendredi 28 au samedi 29 août 2026',
        heure: '',
        lieu: 'Salle des Fauvettes',
        adresse: '23 avenue des Fauvettes, 93360 Neuilly-Plaisance',
        wazeUrl: '',
      },
      {
        id: 'soiree',
        titre: 'La Soirée',
        icon: 'party',
        date: 'Dimanche 30 août 2026',
        heure: '19h00',
        lieu: 'Les Salons Haya Mouchka',
        adresse: '49 rue Petit, 75019 Paris',
        wazeUrl: '',
        ambiance: '', // TODO : ambiance éventuelle ("Tenue de soirée" etc.)
      },
    ],
  },

  // Logos & visuels
  visuels: {
    logo: '/images/logo-chmouel.png',             // logo complet (CHMOUEL + couronne)
    logoCrown: '/images/logo-chmouel-crown.png',  // couronne seule (hero)
    logoLTD: '/images/ltd-logo.png',              // signature footer
  },

  // ===== À venir — placeholders =====

  // Musique de fond — fichier à placer dans public/music/
  musique: {
    src: '', // TODO : chemin du MP3
  },

  // Fond animé piloté par le scroll — séquence d'images (frames cartoon).
  // Placer les frames dans public/frames/ et passer count à leur nombre exact.
  // 0 = pas de fond animé pour l'instant.
  video: {
    rotation: 0,
    frames: {
      base: '/frames/f',
      count: 0,
      pad: 3,
      ext: '.jpg',
    },
  },

  // Galerie photos (carrousel) — à remplir quand les photos seront prêtes
  galerie: {
    photos: [] as ReadonlyArray<{
      src: string;
      alt: string;
      legende: string;
      focus?: string;
    }>,
  },
} as const;

export type Content = typeof content;

export type EvenementData = (typeof content.evenements.newYork)[number] & {
  ambiance?: string;
  programme?: readonly string[];
  filigrane?: string;
};
