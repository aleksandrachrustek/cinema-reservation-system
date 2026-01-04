function searchGuestReservations() {
    const email = document.getElementById("guestEmailSearch").value.trim();

    if (!email) {
        toast("Podaj email");
        return;
    }

    fetch(`/api/reservations/guest?email=${encodeURIComponent(email)}`)
        .then(r => {
            if (!r.ok) throw new Error();
            return r.json();
        })
        .then(data => {
            const container = document.getElementById("guestReservations");
            container.innerHTML = "";

            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = "<p>Brak rezerwacji</p>";
                return;
            }

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
