// Envoi du formulaire RSVP vers un Google Apps Script Web App.
// Le script reçoit les données et les écrit dans une feuille Google Sheet.

function initRsvpForm(form, endpoint) {
    if (!form || !endpoint) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());

        try {
            await fetch(endpoint, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(data),
            });
            form.reset();
            // TODO: afficher message de confirmation
        } catch (err) {
            // TODO: afficher message d'erreur
        }
    });
}
