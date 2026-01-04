using CinemaReservationSystem.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=cinema.db"));

var app = builder.Build();

// SEED
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    context.Database.Migrate();

    SeedData.Initialize(context);
}


app.UseStaticFiles();
app.MapControllers();
app.Run();
