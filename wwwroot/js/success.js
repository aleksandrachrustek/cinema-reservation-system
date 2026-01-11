// Ładuje ekran sukcesu z biletem
function loadSuccess() {

    // Pobranie danych ostatniej rezerwacji
    const data = JSON.parse(localStorage.getItem("lastReservation"));

    // Brak danych – przerwij
    if (!data) return;

    // Uzupełnienie danych biletu
    document.getElementById("ticketMovie").innerText = data.movie;
    document.getElementById("ticketDate").innerText = data.date;
    document.getElementById("ticketTime").innerText = data.time;
    document.getElementById("ticketHall").innerText = data.hall;
    document.getElementById("ticketSeats").innerText = data.seats.join(", ");
    document.getElementById("ticketCode").innerText = data.code;
}
