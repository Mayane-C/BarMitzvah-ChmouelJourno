// Point d'entrée : initialise les modules au chargement de la page.

document.addEventListener("DOMContentLoaded", () => {
    initCountdown(CONFIG.dateEvenement, document.getElementById("countdown-timer"));
    initRsvpForm(document.getElementById("rsvp-form"), CONFIG.rsvpEndpoint);
});
