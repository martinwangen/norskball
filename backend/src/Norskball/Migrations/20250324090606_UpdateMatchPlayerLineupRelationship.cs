using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Norskball.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMatchPlayerLineupRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LineupPlayers");

            migrationBuilder.AddColumn<string>(
                name: "LineupId",
                table: "MatchPlayers",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_MatchPlayers_LineupId",
                table: "MatchPlayers",
                column: "LineupId");

            migrationBuilder.AddForeignKey(
                name: "FK_MatchPlayers_Lineups_LineupId",
                table: "MatchPlayers",
                column: "LineupId",
                principalTable: "Lineups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MatchPlayers_Lineups_LineupId",
                table: "MatchPlayers");

            migrationBuilder.DropIndex(
                name: "IX_MatchPlayers_LineupId",
                table: "MatchPlayers");

            migrationBuilder.DropColumn(
                name: "LineupId",
                table: "MatchPlayers");

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
        }
    }
}
