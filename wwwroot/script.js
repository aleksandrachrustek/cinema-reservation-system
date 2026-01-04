let selectedSeatIds = [];
let seatsMap = {};
let currentScreeningId = null;

fetch("/api/screenings")
    .then(r => r.json())
    .then(data => {
        const select = document.getElementById("screenings");
        data.forEach(s => {
            const option = document.createElement("option");
            option.value = s.id;
            option.text = s.movie.title + " | " + s.startTime;
            select.appendChild(option);
        });
        select.onchange = loadSeats;
        loadSeats();
    });

function loadSeats() {
    selectedSeatIds = [];
    seatsMap = {};
    currentScreeningId = document.getElementById("screenings").value;

    Promise.all([
        fetch(`/api/screenings/${currentScreeningId}/seats`).then(r => r.json()),
        fetch(`/api/reservations/occupied/${currentScreeningId}`).then(r => r.json())
    ]).then(([seats, occupied]) => {
        const seatsDiv = document.getElementById("seats");
        seatsDiv.innerHTML = "";

        seats.forEach(seat => {
            seatsMap[`${seat.row}-${seat.number}`] = seat.id;
        });

        for (let row = 1; row <= 5; row++) {
            for (let num = 1; num <= 5; num++) {
                const div = document.createElement("div");
                div.className = "seat";
                div.innerText = `${row}-${num}`;

                const isOccupied = occupied.some(o => o.row === row && o.number === num);

                if (isOccupied) {
                    div.classList.add("occupied");
                } else {
                    div.onclick = () => toggleSeat(div, row, num);
                }

                seatsDiv.appendChild(div);
            }
            seatsDiv.appendChild(document.createElement("br"));
        }
    });
}

function toggleSeat(div, row, num) {
    const key = `${row}-${num}`;
    const seatId = seatsMap[key];

    if (selectedSeatIds.includes(seatId)) {
        selectedSeatIds = selectedSeatIds.filter(id => id !== seatId);
        div.classList.remove("selected");
    } else {
        selectedSeatIds.push(seatId);
        div.classList.add("selected");
    }
}

function reserve() {
    if (selectedSeatIds.length === 0) {
        alert("Wybierz miejsca");
        return;
    }

    fetch(`/api/reservations/create?userId=1&screeningId=${currentScreeningId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedSeatIds)
    })
        .then(r => {
            if (!r.ok) throw new Error();
            return r.text();
        })
        .then(() => {
            alert("Rezerwacja udana!");
            loadSeats();
        })
        .catch(() => alert("Błąd rezerwacji"));
}
