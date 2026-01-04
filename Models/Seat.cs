namespace CinemaReservationSystem.Models
{
    public class Seat
    {
        public int Id { get; set; }

        public int Row { get; set; }
        public int Number { get; set; }

        public int HallId { get; set; }
        public Hall Hall { get; set; }
    }
}
