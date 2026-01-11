using System.Collections.Generic;

namespace CinemaReservationSystem.Models
{
    public class CreateReservationDto
    {
        public int ScreeningId { get; set; }
        public List<int> SeatIds { get; set; }

        public int? UserId { get; set; }

        public string? GuestName { get; set; }
        public string? GuestEmail { get; set; }
    }
}
