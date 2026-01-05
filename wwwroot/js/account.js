ffunction loadAccount() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    fetch(`/api/reservations/user/${user.id}`)
        .then(r => r.json())
        .then(data => {
            const container = document.getElementById("accountReservations");
            container.innerHTML = "";

            if (data.length === 0) {
                container.innerHTML = "<p>Brak rezerwacji</p>";
                return;
            }

            data.forEach(r => {
                const card = document.createElement("div");
                card.className = "card";

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

                container.appendChild(card);
            });
        });
}


function cancelReservation(id) {
    fetch(`/api/reservations/${id}`, { method: "DELETE" })
        .then(() => {
            alert("Rezerwacja anulowana");
            loadAccount();
        });
}
