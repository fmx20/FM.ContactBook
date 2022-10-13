using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FM.ContactBook.Server.Migrations
{
    public partial class CityAddedMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Contact",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "Contact");
        }
    }
}
