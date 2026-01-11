using CinemaReservationSystem.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Rejestracja kontrolerów
builder.Services.AddControllers();

// Konfiguracja bazy danych SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=cinema.db"));

var app = builder.Build();

// Inicjalizacja bazy danych i danych startowych
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Migracje bazy danych
    context.Database.Migrate();

    // Dane pocz¹tkowe
    SeedData.Initialize(context);
}

// Obs³uga plików statycznych
app.UseStaticFiles();

// Mapowanie kontrolerów API
app.MapControllers();

// Uruchomienie aplikacji
app.Run();
