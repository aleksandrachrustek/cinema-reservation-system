function loadScreenings() {
    showLoader();
    fetch("/api/screenings")
        .then(r => r.json())
        .then(data => {
            hideLoader();
            const grid = document.getElementById("screeningsGrid");
            grid.innerHTML = "";

            data.forEach(s => {
                const card = document.createElement("div");
                card.className = "screening-card";

                const date = new Date(s.startTime);

                card.innerHTML = `
                    <div class="screening-title">${s.movie.title}</div>
                    <div class="screening-time">
                        🗓 ${date.toLocaleDateString()} &nbsp; ⏰ ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div class="screening-hall">
                        📍 ${s.hall.name}
                    </div>
                    <div class="screening-action">
                        Wybierz miejsca →
                    </div>
                 `;

                card.onclick = () => {
                    localStorage.setItem("screeningId", s.id);
                    localStorage.setItem("screeningDetails", JSON.stringify(s));
                    navigate("seats");
                };


                grid.appendChild(card);
            });

        });
}
