using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CinemaReservationSystem.Data;
using CinemaReservationSystem.Models;

namespace CinemaReservationSystem.Controllers
{
    [ApiController]
    [Route("api/reservations")]
    public class ReservationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReservationController(AppDbContext context)
        {
            _context = context;
        }

        //  ZAJĘTE MIEJSCA DLA SEANSU
        [HttpGet("occupied/{screeningId}")]
        public IActionResult GetOccupiedSeats(int screeningId)
        {
            var occupiedSeats = _context.ReservationSeats
                .Include(rs => rs.Seat)
                .Include(rs => rs.Reservation)
                .Where(rs => rs.Reservation.ScreeningId == screeningId)
                .Select(rs => new
                {
                    rs.Seat.Row,
                    rs.Seat.Number
                })
                .ToList();

            return Ok(occupiedSeats);
        }

        //  TWORZENIE REZERWACJI
        [HttpPost("create")]
        public IActionResult CreateReservation(
            int userId,
            int screeningId,
            [FromBody] List<int> seatIds)
        {
            // sprawdzamy czy miejsca są wolne
            var occupiedSeatIds = _context.ReservationSeats
                .Where(rs => rs.Reservation.ScreeningId == screeningId)
                .Select(rs => rs.SeatId)
                .ToList();

            if (seatIds.Any(id => occupiedSeatIds.Contains(id)))
                return BadRequest("One or more seats are already occupied");

            var reservation = new Reservation
            {
                UserId = userId,
                ScreeningId = screeningId
            };

            _context.Reservations.Add(reservation);
            _context.SaveChanges();

            foreach (var seatId in seatIds)
            {
                _context.ReservationSeats.Add(new ReservationSeat
                {
                    ReservationId = reservation.Id,
                    SeatId = seatId
                });
            }

            _context.SaveChanges();

            return Ok("Reservation created");
        }

        //  ANULOWANIE REZERWACJI
        [HttpDelete("{reservationId}")]
        public IActionResult CancelReservation(int reservationId)
        {
            var reservation = _context.Reservations
                .Include(r => r.ReservationSeats)
                .FirstOrDefault(r => r.Id == reservationId);

            if (reservation == null)
                return NotFound();

            _context.ReservationSeats.RemoveRange(reservation.ReservationSeats);
            _context.Reservations.Remove(reservation);
            _context.SaveChanges();

            return Ok("Reservation cancelled");
        }
    }
}
