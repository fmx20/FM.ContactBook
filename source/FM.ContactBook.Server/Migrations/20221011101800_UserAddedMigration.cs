using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FM.ContactBook.Server.Migrations
{
    public partial class UserAddedMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Street",
                table: "Contact",
                newName: "Address_Street");

            migrationBuilder.RenameColumn(
                name: "PostCode",
                table: "Contact",
                newName: "Address_PostCode");

            migrationBuilder.RenameColumn(
                name: "HouseNumber",
                table: "Contact",
                newName: "Address_HouseNumber");

            migrationBuilder.RenameColumn(
                name: "District",
                table: "Contact",
                newName: "Address_District");

            migrationBuilder.RenameColumn(
                name: "Country",
                table: "Contact",
                newName: "Address_Country");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "Contact",
                newName: "Address_City");

            migrationBuilder.AlterColumn<long>(
                name: "ContactId",
                table: "Contact",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", nullable: true),
                    Password = table.Column<string>(type: "TEXT", nullable: true),
                    Forename = table.Column<string>(type: "TEXT", nullable: false),
                    Surname = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.UserId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.RenameColumn(
                name: "Address_Street",
                table: "Contact",
                newName: "Street");

            migrationBuilder.RenameColumn(
                name: "Address_PostCode",
                table: "Contact",
                newName: "PostCode");

            migrationBuilder.RenameColumn(
                name: "Address_HouseNumber",
                table: "Contact",
                newName: "HouseNumber");

            migrationBuilder.RenameColumn(
                name: "Address_District",
                table: "Contact",
                newName: "District");

            migrationBuilder.RenameColumn(
                name: "Address_Country",
                table: "Contact",
                newName: "Country");

            migrationBuilder.RenameColumn(
                name: "Address_City",
                table: "Contact",
                newName: "City");

            migrationBuilder.AlterColumn<long>(
                name: "ContactId",
                table: "Contact",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);
        }
    }
}
