using Microsoft.AspNetCore.Mvc;
using CinemaReservationSystem.Data;

namespace CinemaReservationSystem.Controllers
{
    [ApiController]
    [Route("api/movies")]
    public class MovieController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MovieController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetMovies()
        {
            var movies = _context.Movies.ToList();
            return Ok(movies);
        }
    }
}
