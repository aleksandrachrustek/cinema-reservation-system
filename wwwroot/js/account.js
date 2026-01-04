function loadAccount() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        navigate("login");
        return;
    }

    fetch(`/api/reservations/user/${user.id}`)
        .then(r => r.json())
        .then(data => {
            const div = document.getElementById("reservations");
            div.innerHTML = "";

            if (data.length === 0) {
                div.innerHTML = "<p>Brak rezerwacji</p>";
                return;
            }

            data.forEach(r => {
                const el = document.createElement("div");
                el.className = "card";
                el.innerHTML = `
                    <strong>${r.movie}</strong><br>
                    🕒 ${new Date(r.time).toLocaleString()}<br>
                    💺 Miejsca: ${r.seats}<br>
                    <span class="status ${r.status.toLowerCase()}">${r.status}</span><br>
                    ${r.status === "ACTIVE"
                        ? `<button onclick="cancelReservation(${r.id})">Anuluj</button>`
                        : ""}
`;
                div.appendChild(el);
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
