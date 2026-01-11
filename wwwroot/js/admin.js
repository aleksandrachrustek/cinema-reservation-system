// Ładuje panel administratora
function loadAdmin() {

    // Pobranie użytkownika
    const user = JSON.parse(localStorage.getItem("user"));

    // Sprawdzenie uprawnień administratora
    if (!user || user.role !== "ADMIN") {
        navigate("home");
        return;
    }

    // Załaduj listę seansów
    loadAdminScreenings();
}

// Pobiera i wyświetla seanse
function loadAdminScreenings() {

    // Pobranie seansów z API
    fetch("/api/screenings")
        .then(r => r.json())
        .then(data => {

            // Kontener seansów
            const div = document.getElementById("adminScreenings");
            div.innerHTML = "";

            // Wyświetlenie każdego seansu
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

// Dodaje nowy seans
function addScreening() {

    // Dane z formularza
    const movieId = movieId.value;
    const hallId = hallId.value;
    const startTime = startTime.value;

    // Wysłanie żądania dodania seansu
    fetch(`/api/screenings?movieId=${movieId}&hallId=${hallId}&startTime=${startTime}`, {
        method: "POST"
    })
        .then(() => {
            toast("Seans dodany");
            loadAdminScreenings(); // Odśwież listę
        });
}
