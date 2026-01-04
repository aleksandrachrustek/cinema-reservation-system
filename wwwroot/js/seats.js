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

            const rows = [...new Set(seats.map(s => s.row))];

            rows.forEach(rowNumber => {
                const rowDiv = document.createElement("div");
                rowDiv.className = "row";

                const rowLetter =
                    typeof rowNumber === "number"
                        ? String.fromCharCode(64 + rowNumber)
                        : rowNumber;

                seats
                    .filter(s => s.row === rowNumber)
                    .forEach(seat => {
                        const div = document.createElement("div");
                        div.className = "seat available";

                        const isOccupied = occupied.some(
                            o => o.row === seat.row && o.number === seat.number
                        );

                        if (isOccupied) {
                            div.className = "seat occupied";
                        } else {
                            div.onclick = () =>
                                toggleSeat(div, {
                                    id: seat.id,
                                    label: `${seat.number}${rowLetter}`
                                });
                        }

                        rowDiv.appendChild(div);
                    });

                container.appendChild(rowDiv);
            });

            updateReserveButton();
        });
}

/* =======================
   WYBIERANIE MIEJSC
======================= */
function toggleSeat(div, seat) {
    const exists = selectedSeatIds.find(s => s.id === seat.id);

    if (exists) {
        selectedSeatIds = selectedSeatIds.filter(s => s.id !== seat.id);
        div.className = "seat available";
    } else {
        selectedSeatIds.push(seat);
        div.className = "seat selected";
    }

    document.getElementById("seatCounter").innerText =
        `Wybrane miejsca: ${selectedSeatIds.map(s => s.label).join(", ")}`;

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

    if (user && user.id > 0) {
        dto.userId = user.id;
    } else {
        const name = document.getElementById("guestName").value;
        const email = document.getElementById("guestEmail").value;

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
        .then(async r => {
            if (!r.ok) {
                const msg = await r.text();
                throw new Error(msg);
            }
            return r.json();
        })
        .then(data => {
            const screening = JSON.parse(localStorage.getItem("screeningDetails"));

            localStorage.setItem("lastReservation", JSON.stringify({
                code: data.reservationCode,
                movie: screening?.movie || "Seans kinowy",
                date: screening?.startTime
                    ? new Date(screening.startTime).toLocaleDateString()
                    : "",
                time: screening?.startTime
                    ? new Date(screening.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                    : "",
                hall: screening?.hall.replace(/^Sala\s*/i, "") || "",
                seats: selectedSeatIds.map(s => s.label)
            }));


            selectedSeatIds = [];
            closeReservationModal();
            toast("🎉 Rezerwacja potwierdzona");
            navigate("success");
        })
        .catch(err => {
            console.error(err);
            toast("Błąd rezerwacji");
        });
}
