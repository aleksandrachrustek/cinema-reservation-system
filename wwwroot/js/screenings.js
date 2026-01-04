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

                card.innerHTML = `
                    <div class="screening-title">${s.movie.title}</div>
                    <div class="screening-time">
                        🕒 ${new Date(s.startTime).toLocaleString()}
                    </div>
                    <div class="screening-hall">
                        📍 ${s.hall.name}
                    </div>
                `;

                card.onclick = () => {
                    localStorage.setItem("screeningId", s.id);

                    localStorage.setItem("screeningDetails", JSON.stringify({
                        movie: s.movie.title,
                        startTime: s.startTime,
                        hall: s.hall.name
                    }));

                    navigate("seats");
                };



                grid.appendChild(card);
            });
        });
}
