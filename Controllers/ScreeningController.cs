using CinemaReservationSystem.Data;
using CinemaReservationSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CinemaReservationSystem.Controllers
{
    // Kontroler seansów
    [ApiController]
    [Route("api/screenings")]
    public class ScreeningController : ControllerBase
    {
        // Kontekst bazy danych
        private readonly AppDbContext _context;

        // Wstrzyknięcie kontekstu
        public ScreeningController(AppDbContext context)
        {
            _context = context;
        }

        // Pobranie listy seansów
        [HttpGet]
        public IActionResult GetScreenings()
        {
            var screenings = _context.Screenings
                .Include(s => s.Movie)
                .Include(s => s.Hall)
                .ToList();

            return Ok(screenings);
        }

        // Pobranie miejsc dla konkretnego seansu
        [HttpGet("{id}/seats")]
        public IActionResult GetSeatsForScreening(int id)
        {
            var seats = _context.Screenings
                .Where(s => s.Id == id)
                .SelectMany(s => s.Hall.Seats)
                .Select(seat => new Models.SeatDto
                {
                    Id = seat.Id,
                    Row = seat.Row,
                    Number = seat.Number
                })
                .ToList();

            return Ok(seats);
        }

        // Dodanie nowego seansu
        [HttpPost]
        public IActionResult CreateScreening(int movieId, int hallId, DateTime startTime)
        {
            var screening = new Screening
            {
                MovieId = movieId,
                HallId = hallId,
                StartTime = startTime
            };

            _context.Screenings.Add(screening);
            _context.SaveChanges();

            return Ok("Screening created");
        }
    }
}
