// Wyszukiwanie rezerwacji gościa po emailu
function searchGuestReservations() {

    // Email z formularza
    const email = document.getElementById("guestEmailSearch").value.trim();

    // Walidacja emaila
    if (!email) {
        toast("Podaj email");
        return;
    }

    // Pobranie rezerwacji gościa
    fetch(`/api/reservations/guest?email=${encodeURIComponent(email)}`)
        .then(r => {
            if (!r.ok) throw new Error();
            return r.json();
        })
        .then(data => {

            // Kontener wyników
            const container = document.getElementById("guestReservations");
            container.innerHTML = "";

            // Brak rezerwacji
            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = "<p>Brak rezerwacji</p>";
                return;
            }

            // Wyświetlenie rezerwacji
            data.forEach(r => {
                const card = document.createElement("div");
                card.className = "card";

                card.innerHTML = `
                    <strong>${r.movie}</strong><br>
                    ⏰ ${new Date(r.time).toLocaleString()}<br>
                    💺 Miejsca: ${r.seats}
                `;

                container.appendChild(card);
            });
        })
        .catch(() => toast("Nie udało się pobrać rezerwacji"));
}
