using Microsoft.AspNetCore.Mvc;
using CinemaReservationSystem.Data;
using CinemaReservationSystem.Models;
using System.Security.Cryptography;
using System.Text;

namespace CinemaReservationSystem.Controllers
{
    // Kontroler autoryzacji
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        // Kontekst bazy danych
        private readonly AppDbContext _context;

        // Wstrzyknięcie kontekstu
        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // Rejestracja użytkownika
        [HttpPost("register")]
        public IActionResult Register([FromBody] LoginDto dto)
        {
            // Sprawdzenie czy email już istnieje
            if (_context.Users.Any(u => u.Email == dto.Email))
                return BadRequest("User already exists");

            // Utworzenie nowego użytkownika
            var user = new User
            {
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                Role = "USER"
            };

            // Zapis do bazy
            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("User registered");
        }

        // Logowanie użytkownika
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            // Pobranie użytkownika po emailu
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);

            // Brak użytkownika
            if (user == null)
                return Unauthorized();

            // Sprawdzenie hasła
            if (user.PasswordHash != HashPassword(dto.Password))
                return Unauthorized();

            // Zwrócenie danych użytkownika
            return Ok(new { user.Id, user.Email, user.Role });
        }

        // Haszowanie hasła SHA256
        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
