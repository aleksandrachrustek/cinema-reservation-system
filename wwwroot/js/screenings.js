// Ładuje listę seansów
function loadScreenings() {

    // Pokaż loader
    showLoader();

    // Pobranie seansów z API
    fetch("/api/screenings")
        .then(r => r.json())
        .then(data => {

            // Ukryj loader
            hideLoader();

            // Kontener seansów
            const grid = document.getElementById("screeningsGrid");
            grid.innerHTML = "";

            // Wyświetlenie seansów
            data.forEach(s => {
                const card = document.createElement("div");
                card.className = "screening-card";

                // Data i godzina seansu
                const date = new Date(s.startTime);

                card.innerHTML = `
                    <div class="screening-title">${s.movie.title}</div>
                    <div class="screening-time">
                        🗓 ${date.toLocaleDateString()} &nbsp;
                        ⏰ ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div class="screening-hall">
                        📍 ${s.hall.name}
                    </div>
                    <div class="screening-action">
                        Wybierz miejsca →
                    </div>
                `;

                // Przejście do wyboru miejsc
                card.onclick = () => {
                    localStorage.setItem("screeningId", s.id);
                    localStorage.setItem("screeningDetails", JSON.stringify(s));
                    navigate("seats");
                };

                // Dodanie karty do siatki
                grid.appendChild(card);
            });
        });
}
