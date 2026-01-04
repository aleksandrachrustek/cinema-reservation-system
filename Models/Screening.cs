using System;

namespace CinemaReservationSystem.Models
{
    public class Screening
    {
        public int Id { get; set; }

        public DateTime StartTime { get; set; }

        public int MovieId { get; set; }
        public Movie Movie { get; set; }

        public int HallId { get; set; }
        public Hall Hall { get; set; }
    }
}
