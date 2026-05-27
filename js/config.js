// Données centralisées de l'événement.
// Modifier ce fichier pour mettre à jour le contenu du site.

const CONFIG = {
    enfant: {
        prenom: "Chmouel",
        nom: "Journo",
        surnom: "Chmoulik",
    },

    famille: {
        parents: "M. et Mme Journo Chalom",
        grandsParents: [
            "M. et Mme Journo Tsion",
            "Mme Smadja Myriam",
        ],
    },

    // Date principale utilisée par le compte à rebours
    // = soirée de la Bar Mitsva, 30 août 2026 à 19h00 (heure de Paris)
    dateEvenement: "2026-08-30T19:00:00+02:00",

    // Lieux référencés par les événements (clé = id)
    lieux: {
        "770": {
            nom: "770 — Synagogue du Rabbi",
            adresse: "770 Eastern Parkway, Brooklyn, NY 11213, USA",
            ville: "New York",
            waze: "https://waze.com/ul?q=770%20Eastern%20Parkway%2C%20Brooklyn%2C%20NY%2011213",
            maps: "https://www.google.com/maps/search/?api=1&query=770+Eastern+Parkway+Brooklyn+NY+11213",
        },
        "ohel": {
            nom: "Ohel — Tombe du Rabbi",
            adresse: "226-20 Francis Lewis Blvd, Cambria Heights, NY 11411, USA",
            ville: "New York",
            waze: "https://waze.com/ul?q=226-20%20Francis%20Lewis%20Blvd%2C%20Cambria%20Heights%2C%20NY%2011411",
            maps: "https://www.google.com/maps/search/?api=1&query=226-20+Francis+Lewis+Blvd+Cambria+Heights+NY+11411",
        },
        "neuilly-plaisance": {
            nom: "Synagogue de Neuilly-Plaisance",
            adresse: "", // TODO : adresse exacte à compléter
            ville: "Neuilly-Plaisance",
            waze: "",
            maps: "",
        },
        "paris-petit": {
            nom: "", // TODO : nom de la salle à compléter
            adresse: "49 rue Petit, 75019 Paris, France",
            ville: "Paris",
            waze: "https://waze.com/ul?q=49%20rue%20Petit%2C%2075019%20Paris",
            maps: "https://www.google.com/maps/search/?api=1&query=49+rue+Petit+75019+Paris",
        },
    },

    // Toutes les dates à retenir, dans l'ordre chronologique
    dates: [
        {
            id: "chabbat-ki-tetze",
            titre: "Chabbat Parachat Ki Tetzé chez le Rabbi",
            description: "Chabbat à New York, en présence du Rabbi.",
            dateDebut: "2026-08-21T18:00:00-04:00",
            dateFin:   "2026-08-22T21:00:00-04:00",
            lieuId: "770",
        },
        {
            id: "maamar-ohel",
            titre: "Maamar au Ohel + repas de Bar Mitsva",
            description: "Motsaé Chabbat : Chmoulik récitera son maamar au Ohel (tombe du Rabbi), suivi d'un repas en l'honneur de la Bar Mitsva.",
            dateDebut: "2026-08-22T21:30:00-04:00",
            lieuId: "ohel",
        },
        {
            id: "priere-770",
            titre: "Prière du matin au 770",
            description: "Prière au 770, synagogue du Rabbi.",
            dateDebut: "2026-08-23T07:00:00-04:00",
            lieuId: "770",
        },
        {
            id: "montee-torah",
            titre: "Montée à la Torah",
            description: "Montée à la Torah au bureau du Rabbi.",
            dateDebut: "2026-08-24T07:00:00-04:00",
            lieuId: "770",
        },
        {
            id: "chabbat-ki-tavo",
            titre: "Chabbat Bar Mitsva — Parachat Ki Tavo",
            description: "Chabbat de la Bar Mitsva à Neuilly-Plaisance.",
            dateDebut: "2026-08-28T19:00:00+02:00",
            dateFin:   "2026-08-29T22:00:00+02:00",
            lieuId: "neuilly-plaisance",
        },
        {
            id: "soiree",
            titre: "Soirée de la Bar Mitsva",
            description: "Soirée de la Bar Mitsva, à partir de 19h.",
            dateDebut: "2026-08-30T19:00:00+02:00",
            lieuId: "paris-petit",
            principal: true, // événement principal pour le compte à rebours
        },
    ],

    // URL du Google Apps Script Web App pour le formulaire RSVP
    // (à remplir une fois le script déployé)
    rsvpEndpoint: "",
};
