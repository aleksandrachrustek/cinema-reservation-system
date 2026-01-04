using System;
using System.Collections.Generic;

namespace CinemaReservationSystem.Models
{
    public class Reservation
    {
        public int Id { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int UserId { get; set; }
        public User User { get; set; }

        public int ScreeningId { get; set; }
        public Screening Screening { get; set; }

        public List<ReservationSeat> ReservationSeats { get; set; }
    }
}
