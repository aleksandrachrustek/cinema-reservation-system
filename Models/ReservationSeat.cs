namespace CinemaReservationSystem.Models
{
    public class ReservationSeat
    {
        public int Id { get; set; }

        public int ReservationId { get; set; }
        public Reservation Reservation { get; set; }

        public int SeatId { get; set; }
        public Seat Seat { get; set; }
    }
}
