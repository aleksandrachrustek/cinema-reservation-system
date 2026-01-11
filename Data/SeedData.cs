using CinemaReservationSystem.Models;

namespace CinemaReservationSystem.Data
{
    // Dane startowe aplikacji
    public static class SeedData
    {
        // Inicjalizacja bazy danych
        public static void Initialize(AppDbContext context)
        {
            // Utworzenie konta administratora
            if (!context.Users.Any(u => u.Email == "admin@kino.pl"))
            {
                using var sha = System.Security.Cryptography.SHA256.Create();
                var passwordHash = Convert.ToBase64String(
                    sha.ComputeHash(
                        System.Text.Encoding.UTF8.GetBytes("admin123")
                    )
                );

                context.Users.Add(new User
                {
                    Email = "admin@kino.pl",
                    PasswordHash = passwordHash,
                    Role = "ADMIN"
                });

                context.SaveChanges();
            }

            // Jeśli filmy już istnieją – zakończ
            if (context.Movies.Any())
                return;

            // Lista filmów
            var movies = new List<Movie>
            {
                new Movie { Title = "Matrix", DurationMinutes = 136 },
                new Movie { Title = "Interstellar", DurationMinutes = 169 },
                new Movie { Title = "Inception", DurationMinutes = 148 },
                new Movie { Title = "Gladiator", DurationMinutes = 155 },
                new Movie { Title = "Avatar", DurationMinutes = 162 }
            };

            context.Movies.AddRange(movies);
            context.SaveChanges();

            // Tworzenie sal i miejsc
            var halls = new List<Hall>();

            for (int h = 1; h <= 2; h++)
            {
                var hall = new Hall
                {
                    Name = $"Sala {h}",
                    Seats = new List<Seat>()
                };

                for (int row = 1; row <= 6; row++)
                {
                    for (int number = 1; number <= 8; number++)
                    {
                        hall.Seats.Add(new Seat
                        {
                            Row = row,
                            Number = number
                        });
                    }
                }

                halls.Add(hall);
            }

            context.Halls.AddRange(halls);
            context.SaveChanges();

            // Data początkowa seansów
            var startDate = DateTime.Today.AddDays(1);

            // Generowanie seansów
            foreach (var movie in movies)
            {
                foreach (var hall in halls)
                {
                    for (int day = 0; day < 3; day++)
                    {
                        context.Screenings.Add(new Screening
                        {
                            MovieId = movie.Id,
                            HallId = hall.Id,
                            StartTime = startDate
                                .AddDays(day)
                                .AddHours(16 + (movie.Id % 3) * 2)
                        });
                    }
                }
            }

            context.SaveChanges();
        }
    }
}
