using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Norskball.Migrations
{
    /// <inheritdoc />
    public partial class AddRefereeToMatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "RefereeId",
                table: "Matches",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Referees",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    PhotoUrl = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Referees", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Matches_RefereeId",
                table: "Matches",
                column: "RefereeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Referees_RefereeId",
                table: "Matches",
                column: "RefereeId",
                principalTable: "Referees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Referees_RefereeId",
                table: "Matches");

            migrationBuilder.DropTable(
                name: "Referees");

            migrationBuilder.DropIndex(
                name: "IX_Matches_RefereeId",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "RefereeId",
                table: "Matches");
        }
    }
}
