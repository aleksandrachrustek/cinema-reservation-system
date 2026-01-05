let selectedSeatIds = [];

/* =======================
   ŁADOWANIE MIEJSC
======================= */
function loadSeats() {
    const screeningId = localStorage.getItem("screeningId");

    if (!screeningId) {
        toast("Brak seansu");
        return;
    }

    selectedSeatIds = [];

    Promise.all([
        fetch(`/api/screenings/${screeningId}/seats`).then(r => r.json()),
        fetch(`/api/reservations/occupied/${screeningId}`).then(r => r.json())
    ])
        .then(([seats, occupied]) => {
            const container = document.getElementById("seatsContainer");
            container.innerHTML = "";

            // unikalne rzędy
            const rows = [...new Set(seats.map(s => s.row))];

            rows.forEach(rowNumber => {
                const rowDiv = document.createElement("div");
                rowDiv.className = "row";

                // litera rzędu (A, B, C...)
                const rowLetter =
                    typeof rowNumber === "number"
                        ? String.fromCharCode(64 + rowNumber)
                        : rowNumber;

                seats
                    .filter(s => s.row === rowNumber)
                    .forEach(seat => {
                        const seatDiv = document.createElement("div");

                        // sprawdzenie zajętości
                        const isOccupied = occupied.some(
                            o => o.row === seat.row && o.number === seat.number
                        );

                        if (isOccupied) {
                            seatDiv.className = "seat occupied";
                        } else {
                            seatDiv.className = "seat available";

                            // etykieta miejsca np. 9H
                            seatDiv.dataset.label = `${seat.number}${rowLetter}`;

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

            // reset licznika
            document.getElementById("seatCounter").innerText = "Nie wybrano miejsc";
            updateReserveButton();
        })
        .catch(() => toast("Nie udało się załadować miejsc"));
}


/* =======================
   WYBIERANIE MIEJSC
======================= */
function toggleSeat(seatDiv, seat) {
    const exists = selectedSeatIds.find(s => s.id === seat.id);

    if (exists) {
        selectedSeatIds = selectedSeatIds.filter(s => s.id !== seat.id);
        seatDiv.className = "seat available";
    } else {
        selectedSeatIds.push(seat);
        seatDiv.className = "seat selected";
    }

    document.getElementById("seatCounter").innerText =
        selectedSeatIds.length === 0
            ? "Nie wybrano miejsc"
            : `Wybrane miejsca: ${selectedSeatIds.map(s => s.label).join(", ")}`;

    updateReserveButton();
}


/* =======================
   PRZYCISK REZERWUJ
======================= */
function updateReserveButton() {
    const btn = document.getElementById("reserveBtn");
    if (!btn) return;

    btn.disabled = selectedSeatIds.length === 0;
    btn.style.opacity = btn.disabled ? 0.6 : 1;
}

/* =======================
   MODAL
======================= */
function openReservationModal() {
    if (selectedSeatIds.length === 0) {
        toast("Najpierw wybierz miejsca");
        return;
    }

    const modal = document.getElementById("reservationModal");
    const summary = document.getElementById("reservationSummary");
    const guestForm = document.getElementById("guestForm");
    const user = JSON.parse(localStorage.getItem("user"));

    summary.innerHTML = `
        <p><strong>Wybrane miejsca:</strong>
        ${selectedSeatIds.map(s => s.label).join(", ")}</p>
    `;

    guestForm.style.display = user ? "none" : "block";

    modal.classList.remove("hidden");
}

function closeReservationModal() {
    document.getElementById("reservationModal").classList.add("hidden");
}

/* =======================
   POTWIERDZENIE
======================= */
function confirmReservation() {
    const screeningId = localStorage.getItem("screeningId");
    if (!screeningId) {
        toast("Brak seansu");
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    const dto = {
        screeningId: Number(screeningId),
        seatIds: selectedSeatIds.map(s => s.id)
    };

    // USER
    if (user && user.id > 0) {
        dto.userId = user.id;
    }
    // GOŚĆ
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

            selectedSeatIds = [];
            closeReservationModal();
            toast("🎉 Rezerwacja potwierdzona");
            navigate("success");
        })
        .catch(() => {
            toast("Błąd rezerwacji");
        });
}



