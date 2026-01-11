// Ładuje rezerwacje zalogowanego użytkownika
function loadAccount() {

    // Pobranie użytkownika z localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // Jeśli brak użytkownika – zakończ
    if (!user) return;

    // Pobranie rezerwacji użytkownika
    fetch(`/api/reservations/user/${user.id}`)
        .then(r => r.json())
        .then(data => {

            // Kontener na rezerwacje
            const container = document.getElementById("accountReservations");
            container.innerHTML = "";

            // Brak rezerwacji
            if (data.length === 0) {
                container.innerHTML = "<p>Brak rezerwacji</p>";
                return;
            }

            // Wyświetlenie rezerwacji
            data.forEach(r => {
                const card = document.createElement("div");
                card.className = "card";

                // Klasa statusu (active / cancelled)
                const statusClass = r.status.toLowerCase();

                card.innerHTML = `
                    <strong>${r.movie}</strong><br>
                    ⏰ ${new Date(r.time).toLocaleString()}<br>
                    💺 Liczba miejsc: ${r.seats}<br>
                    <span class="status ${statusClass}">${r.status}</span>
                    ${r.status === "ACTIVE"
                        ? `<button style="margin-top:12px" onclick="cancelReservation(${r.id})">Anuluj</button>`
                        : ""
                    }
                `;

                // Dodanie karty do listy
                container.appendChild(card);
            });
        });
}

// Anuluje rezerwację
function cancelReservation(id) {

    // Żądanie usunięcia rezerwacji
    fetch(`/api/reservations/${id}`, { method: "DELETE" })
        .then(() => {
            alert("Rezerwacja anulowana");
            loadAccount(); // Odśwież listę
        });
}
