// Compte à rebours jusqu'à la date de l'événement.

function initCountdown(targetDate, container) {
    if (!container) return;

    const target = new Date(targetDate).getTime();

    function update() {
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            container.innerHTML = "C'est aujourd'hui !";
            clearInterval(interval);
            return;
        }

        const jours = Math.floor(diff / (1000 * 60 * 60 * 24));
        const heures = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const secondes = Math.floor((diff / 1000) % 60);

        container.innerHTML = `
            <span>${jours}j</span>
            <span>${heures}h</span>
            <span>${minutes}m</span>
            <span>${secondes}s</span>
        `;
    }

    update();
    const interval = setInterval(update, 1000);
}
