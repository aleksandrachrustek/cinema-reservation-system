using System.ComponentModel.DataAnnotations;

namespace CinemaReservationSystem.Models
{
    public class Movie
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public int DurationMinutes { get; set; }
    }
}
