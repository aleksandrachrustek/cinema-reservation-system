using Microsoft.AspNetCore.Mvc;
using CinemaReservationSystem.Data;
using CinemaReservationSystem.Models;
using System.Security.Cryptography;
using System.Text;

namespace CinemaReservationSystem.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] LoginDto dto)
        {
            if (_context.Users.Any(u => u.Email == dto.Email))
                return BadRequest("User already exists");

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                Role = "USER"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("User registered");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);

            if (user == null)
                return Unauthorized();

            if (user.PasswordHash != HashPassword(dto.Password))
                return Unauthorized();

            return Ok(new { user.Id, user.Email, user.Role });
        }

        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
