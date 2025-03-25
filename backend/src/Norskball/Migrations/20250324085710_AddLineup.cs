using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Norskball.Migrations
{
    /// <inheritdoc />
    public partial class AddLineup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "DateOfBirth",
                table: "Players",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateTable(
                name: "Lineups",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MatchId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TeamId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Formation = table.Column<int>(type: "int", nullable: false),
                    IsStarting = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lineups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lineups_Matches_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Lineups_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LineupPlayers",
                columns: table => new
                {
                    LineupId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    PlayersId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LineupPlayers", x => new { x.LineupId, x.PlayersId });
                    table.ForeignKey(
                        name: "FK_LineupPlayers_Lineups_LineupId",
                        column: x => x.LineupId,
                        principalTable: "Lineups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LineupPlayers_MatchPlayers_PlayersId",
                        column: x => x.PlayersId,
                        principalTable: "MatchPlayers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LineupPlayers_PlayersId",
                table: "LineupPlayers",
                column: "PlayersId");

            migrationBuilder.CreateIndex(
                name: "IX_Lineups_MatchId",
                table: "Lineups",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_Lineups_TeamId",
                table: "Lineups",
                column: "TeamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LineupPlayers");

            migrationBuilder.DropTable(
                name: "Lineups");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateOfBirth",
                table: "Players",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }
    }
}
