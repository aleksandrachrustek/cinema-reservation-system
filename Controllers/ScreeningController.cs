using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CinemaReservationSystem.Data;

namespace CinemaReservationSystem.Controllers
{
    [ApiController]
    [Route("api/screenings")]
    public class ScreeningController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ScreeningController(AppDbContext context)
        {
            _context = context;
        }

        // LISTA SEANSÓW
        [HttpGet]
        public IActionResult GetScreenings()
        {
            var screenings = _context.Screenings
                .Include(s => s.Movie)
                .Include(s => s.Hall)
                .ToList();

            return Ok(screenings);
        }

        //  MIEJSCA DLA KONKRETNEGO SEANSU
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

    }
}
