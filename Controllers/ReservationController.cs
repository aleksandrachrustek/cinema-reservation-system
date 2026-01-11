using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CinemaReservationSystem.Data;
using CinemaReservationSystem.Models;

namespace CinemaReservationSystem.Controllers
{
    // Kontroler rezerwacji
    [ApiController]
    [Route("api/reservations")]
    public class ReservationController : ControllerBase
    {
        // Kontekst bazy danych
        private readonly AppDbContext _context;

        // Wstrzyknięcie kontekstu
        public ReservationController(AppDbContext context)
        {
            _context = context;
        }

        // Pobranie zajętych miejsc dla seansu
        [HttpGet("occupied/{screeningId}")]
        public IActionResult GetOccupiedSeats(int screeningId)
        {
            var occupiedSeats = _context.ReservationSeats
                .Include(rs => rs.Seat)
                .Include(rs => rs.Reservation)
                .Where(rs =>
                    rs.Reservation.ScreeningId == screeningId &&
                    rs.Reservation.Status == "ACTIVE")
                .Select(rs => new
                {
                    rs.Seat.Row,
                    rs.Seat.Number
                })
                .ToList();

            return Ok(occupiedSeats);
        }

        // Tworzenie nowej rezerwacji
        [HttpPost("create")]
        public IActionResult CreateReservation([FromBody] CreateReservationDto dto)
        {
            // Sprawdzenie czy wybrano miejsca
            if (dto.SeatIds == null || dto.SeatIds.Count == 0)
                return BadRequest("Brak miejsc");

            // Zamiana 0 na null (gość)
            if (dto.UserId == 0)
            {
                dto.UserId = null;
            }

            // Walidacja danych gościa
            if (dto.UserId == null)
            {
                if (string.IsNullOrWhiteSpace(dto.GuestName) ||
                    string.IsNullOrWhiteSpace(dto.GuestEmail))
                {
                    return BadRequest("Dane gościa są wymagane");
                }
            }

            // Sprawdzenie czy miejsca są już zajęte
            var takenSeats = _context.ReservationSeats
                .Include(rs => rs.Seat)
                .Include(rs => rs.Reservation)
                .Any(rs =>
                    rs.Reservation.ScreeningId == dto.ScreeningId &&
                    rs.Reservation.Status == "ACTIVE" &&
                    dto.SeatIds.Any(id => id == rs.SeatId));

            if (takenSeats)
                return BadRequest("Jedno z miejsc jest już zajęte");

            // Utworzenie rezerwacji
            var reservation = new Reservation
            {
                ScreeningId = dto.ScreeningId,
                UserId = dto.UserId,
                GuestName = dto.UserId == null ? dto.GuestName : null,
                GuestEmail = dto.UserId == null ? dto.GuestEmail : null,
                ReservationCode = Guid.NewGuid().ToString("N")[..8].ToUpper(),
                Status = "ACTIVE"
            };

            _context.Reservations.Add(reservation);
            _context.SaveChanges();

            // Przypisanie miejsc do rezerwacji
            foreach (var seatId in dto.SeatIds)
            {
                _context.ReservationSeats.Add(new ReservationSeat
                {
                    ReservationId = reservation.Id,
                    SeatId = seatId
                });
            }

            _context.SaveChanges();

            return Ok(new
            {
                reservation.Id,
                reservation.CreatedAt,
                reservation.ReservationCode
            });
        }

        // Anulowanie rezerwacji
        [HttpDelete("{reservationId}")]
        public IActionResult CancelReservation(int reservationId)
        {
            var reservation = _context.Reservations
                .FirstOrDefault(r => r.Id == reservationId);

            if (reservation == null)
                return NotFound();

            // Usunięcie przypisanych miejsc
            _context.ReservationSeats.RemoveRange(
                _context.ReservationSeats.Where(rs => rs.ReservationId == reservation.Id)
            );

            reservation.Status = "CANCELLED";
            _context.SaveChanges();

            return Ok("Reservation cancelled");
        }

        // Rezerwacje zalogowanego użytkownika
        [HttpGet("user/{userId}")]
        public IActionResult GetUserReservations(int userId)
        {
            var reservations = _context.Reservations
                .Include(r => r.Screening)
                    .ThenInclude(s => s.Movie)
                .Include(r => r.ReservationSeats)
                .Where(r => r.UserId == userId)
                .Select(r => new
                {
                    r.Id,
                    Movie = r.Screening.Movie.Title,
                    Time = r.Screening.StartTime,
                    Seats = r.ReservationSeats.Count,
                    r.Status
                })
                .ToList();

            return Ok(reservations);
        }

        // Rezerwacje gościa po emailu
        [HttpGet("guest")]
        public IActionResult GetGuestReservations([FromQuery] string email)
        {
            // Walidacja emaila
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Email jest wymagany");

            var reservations = _context.Reservations
                .Include(r => r.Screening)
                    .ThenInclude(s => s.Movie)
                .Include(r => r.ReservationSeats)
                .Where(r => r.GuestEmail == email)
                .Select(r => new
                {
                    r.Id,
                    Movie = r.Screening.Movie.Title,
                    Time = r.Screening.StartTime,
                    Seats = r.ReservationSeats.Count,
                    r.Status
                })
                .ToList();

            return Ok(reservations);
        }
    }
}
