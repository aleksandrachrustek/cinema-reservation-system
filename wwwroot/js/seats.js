// Lista wybranych miejsc
let selectedSeatIds = [];

// Ładuje mapę miejsc dla seansu
function loadSeats() {

    // Pobranie ID seansu
    const screeningId = localStorage.getItem("screeningId");

    // Brak seansu
    if (!screeningId) {
        toast("Brak seansu");
        return;
    }

    // Reset wybranych miejsc
    selectedSeatIds = [];

    // Pobranie miejsc i zajętych rezerwacji
    Promise.all([
        fetch(`/api/screenings/${screeningId}/seats`).then(r => r.json()),
        fetch(`/api/reservations/occupied/${screeningId}`).then(r => r.json())
    ])
        .then(([seats, occupied]) => {

            // Kontener miejsc
            const container = document.getElementById("seatsContainer");
            container.innerHTML = "";

            // Unikalne rzędy
            const rows = [...new Set(seats.map(s => s.row))];

            // Budowanie rzędów
            rows.forEach(rowNumber => {
                const rowDiv = document.createElement("div");
                rowDiv.className = "row";

                // Litera rzędu
                const rowLetter =
                    typeof rowNumber === "number"
                        ? String.fromCharCode(64 + rowNumber)
                        : rowNumber;

                // Budowanie miejsc w rzędzie
                seats
                    .filter(s => s.row === rowNumber)
                    .forEach(seat => {
                        const seatDiv = document.createElement("div");

                        // Sprawdzenie czy miejsce jest zajęte
                        const isOccupied = occupied.some(
                            o => o.row === seat.row && o.number === seat.number
                        );

                        if (isOccupied) {
                            seatDiv.className = "seat occupied";
                        } else {
                            seatDiv.className = "seat available";

                            // Etykieta miejsca
                            seatDiv.dataset.label = `${seat.number}${rowLetter}`;

                            // Obsługa wyboru miejsca
                            seatDiv.onclick = () =>
                                toggleSeat(seatDiv, {
                                    id: seat.id,
                                    label: seatDiv.dataset.label
                                });
                        }

                        rowDiv.appendChild(seatDiv);
                    });

                container.appendChild(rowDiv);
            });

            // Reset licznika miejsc
            document.getElementById("seatCounter").innerText = "Nie wybrano miejsc";
            updateReserveButton();
        })
        .catch(() => toast("Nie udało się załadować miejsc"));
}

// Dodaje lub usuwa miejsce z wyboru
function toggleSeat(seatDiv, seat) {

    // Sprawdzenie czy miejsce jest już wybrane
    const exists = selectedSeatIds.find(s => s.id === seat.id);

    if (exists) {
        selectedSeatIds = selectedSeatIds.filter(s => s.id !== seat.id);
        seatDiv.className = "seat available";
    } else {
        selectedSeatIds.push(seat);
        seatDiv.className = "seat selected";
    }

    // Aktualizacja informacji o wybranych miejscach
    document.getElementById("seatCounter").innerText =
        selectedSeatIds.length === 0
            ? "Nie wybrano miejsc"
            : `Wybrane miejsca: ${selectedSeatIds.map(s => s.label).join(", ")}`;

    updateReserveButton();
}

// Aktualizacja stanu przycisku rezerwacji
function updateReserveButton() {
    const btn = document.getElementById("reserveBtn");
    if (!btn) return;

    btn.disabled = selectedSeatIds.length === 0;
    btn.style.opacity = btn.disabled ? 0.6 : 1;
}

// Otwarcie modala rezerwacji
function openReservationModal() {

    // Brak wybranych miejsc
    if (selectedSeatIds.length === 0) {
        toast("Najpierw wybierz miejsca");
        return;
    }

    const modal = document.getElementById("reservationModal");
    const summary = document.getElementById("reservationSummary");
    const guestForm = document.getElementById("guestForm");
    const user = JSON.parse(localStorage.getItem("user"));

    // Podsumowanie miejsc
    summary.innerHTML = `
        <p><strong>Wybrane miejsca:</strong>
        ${selectedSeatIds.map(s => s.label).join(", ")}</p>
    `;

    // Formularz gościa tylko dla niezalogowanych
    guestForm.style.display = user ? "none" : "block";

    modal.classList.remove("hidden");
}

// Zamknięcie modala
function closeReservationModal() {
    document.getElementById("reservationModal").classList.add("hidden");
}

// Potwierdzenie rezerwacji
function confirmReservation() {

    // Pobranie seansu
    const screeningId = localStorage.getItem("screeningId");
    if (!screeningId) {
        toast("Brak seansu");
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    // Dane rezerwacji
    const dto = {
        screeningId: Number(screeningId),
        seatIds: selectedSeatIds.map(s => s.id)
    };

    // Rezerwacja użytkownika
    if (user && user.id > 0) {
        dto.userId = user.id;
    }
    // Rezerwacja gościa
    else {
        const name = document.getElementById("guestName").value.trim();
        const email = document.getElementById("guestEmail").value.trim();

        if (!name || !email) {
            toast("Podaj imię i email");
            return;
        }

        dto.guestName = name;
        dto.guestEmail = email;
    }

    // Wysłanie rezerwacji
    fetch("/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
    })
        .then(r => {
            if (!r.ok) throw new Error();
            return r.json();
        })
        .then(data => {

            // Dane do ekranu sukcesu
            const screening = JSON.parse(localStorage.getItem("screeningDetails"));

            localStorage.setItem("lastReservation", JSON.stringify({
                code: data.reservationCode,
                movie: screening?.movie?.title || screening?.movie || "Seans kinowy",
                date: screening?.startTime
                    ? new Date(screening.startTime).toLocaleDateString()
                    : "",
                time: screening?.startTime
                    ? new Date(screening.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                    : "",
                hall: screening?.hall?.name || screening?.hall || "",
                seats: selectedSeatIds.map(s => s.label)
            }));

            // Reset i przejście dalej
            selectedSeatIds = [];
            closeReservationModal();
            toast("🎉 Rezerwacja potwierdzona");
            navigate("success");
        })
        .catch(() => {
            toast("Błąd rezerwacji");
        });
}
