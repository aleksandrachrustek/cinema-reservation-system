using CinemaReservationSystem.Models;

namespace CinemaReservationSystem.Data
{
    public static class SeedData
    {
        public static void Initialize(AppDbContext context)
        {
            if (context.Movies.Any())
                return; // dane już istnieją

            // FILM
            var movie = new Movie
            {
                Title = "Matrix",
                DurationMinutes = 136
            };

            context.Movies.Add(movie);
            context.SaveChanges();

            // SALA
            var hall = new Hall
            {
                Name = "Sala 1",
                Seats = new List<Seat>()
            };

            // MIEJSCA (5x5)
            for (int row = 1; row <= 5; row++)
            {
                for (int number = 1; number <= 5; number++)
                {
                    hall.Seats.Add(new Seat
                    {
                        Row = row,
                        Number = number
                    });
                }
            }

            context.Halls.Add(hall);
            context.SaveChanges();

            // SEANS
            var screening = new Screening
            {
                MovieId = movie.Id,
                HallId = hall.Id,
                StartTime = DateTime.Now.AddDays(1)
            };

            context.Screenings.Add(screening);
            context.SaveChanges();
        }
    }
}
