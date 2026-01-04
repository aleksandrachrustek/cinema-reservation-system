using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CinemaReservationSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddGuestReservationData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GuestEmail",
                table: "Reservations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuestName",
                table: "Reservations",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GuestEmail",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "GuestName",
                table: "Reservations");
        }
    }
}
