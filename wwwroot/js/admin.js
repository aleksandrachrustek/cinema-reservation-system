function loadAdmin() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "ADMIN") {
        navigate("home");
        return;
    }

    loadAdminScreenings();
}

function loadAdminScreenings() {
    fetch("/api/screenings")
        .then(r => r.json())
        .then(data => {
            const div = document.getElementById("adminScreenings");
            div.innerHTML = "";

            data.forEach(s => {
                div.innerHTML += `
                    <p>
                        ${s.movie.title} |
                        ${new Date(s.startTime).toLocaleString()} |
                        ${s.hall.name}
                    </p>
                `;
            });
        });
}

function addScreening() {
    const movieId = movieId.value;
    const hallId = hallId.value;
    const startTime = startTime.value;

    fetch(`/api/screenings?movieId=${movieId}&hallId=${hallId}&startTime=${startTime}`, {
        method: "POST"
    })
        .then(() => {
            toast("Seans dodany");
            loadAdminScreenings();
        });
}
