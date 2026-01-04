using System;
using System.Collections.Generic;

namespace CinemaReservationSystem.Models
{
    public class Reservation
    {
        public int Id { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // ZALOGOWANY USER (opcjonalny)
        public int? UserId { get; set; }
        public User? User { get; set; }

        // GOŚĆ
        public string? GuestName { get; set; }
        public string? GuestEmail { get; set; }

        // SEANS
        public int ScreeningId { get; set; }
        public Screening Screening { get; set; }

        public List<ReservationSeat> ReservationSeats { get; set; }
        public string Status { get; set; } = "ACTIVE";
        public string ReservationCode { get; set; }

    }
}
