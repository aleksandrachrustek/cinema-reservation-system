using Microsoft.AspNetCore.Mvc;
using CinemaReservationSystem.Data;

namespace CinemaReservationSystem.Controllers
{
    // Kontroler filmów
    [ApiController]
    [Route("api/movies")]
    public class MovieController : ControllerBase
    {
        // Kontekst bazy danych
        private readonly AppDbContext _context;

        // Wstrzyknięcie kontekstu
        public MovieController(AppDbContext context)
        {
            _context = context;
        }

        // Pobranie listy filmów
        [HttpGet]
        public IActionResult GetMovies()
        {
            var movies = _context.Movies.ToList();
            return Ok(movies);
        }
    }
}
