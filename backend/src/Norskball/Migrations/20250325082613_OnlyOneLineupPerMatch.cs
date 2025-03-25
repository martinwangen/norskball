using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Norskball.Migrations
{
    /// <inheritdoc />
    public partial class OnlyOneLineupPerMatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lineups_Matches_MatchId",
                table: "Lineups");

            migrationBuilder.DropForeignKey(
                name: "FK_MatchPlayers_Matches_MatchId",
                table: "MatchPlayers");

            migrationBuilder.DropIndex(
                name: "IX_Lineups_MatchId",
                table: "Lineups");

            migrationBuilder.DropColumn(
                name: "TeamType",
                table: "MatchPlayers");

            migrationBuilder.DropColumn(
                name: "MatchId",
                table: "Lineups");

            migrationBuilder.RenameColumn(
                name: "MatchId",
                table: "MatchPlayers",
                newName: "TeamId");

            migrationBuilder.RenameIndex(
                name: "IX_MatchPlayers_MatchId",
                table: "MatchPlayers",
                newName: "IX_MatchPlayers_TeamId");

            migrationBuilder.AlterColumn<int>(
                name: "Position",
                table: "Players",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "AwayTeamLineupId",
                table: "Matches",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HomeTeamLineupId",
                table: "Matches",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Matches_AwayTeamLineupId",
                table: "Matches",
                column: "AwayTeamLineupId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_HomeTeamLineupId",
                table: "Matches",
                column: "HomeTeamLineupId");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Lineups_AwayTeamLineupId",
                table: "Matches",
                column: "AwayTeamLineupId",
                principalTable: "Lineups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Lineups_HomeTeamLineupId",
                table: "Matches",
                column: "HomeTeamLineupId",
                principalTable: "Lineups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MatchPlayers_Teams_TeamId",
                table: "MatchPlayers",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Lineups_AwayTeamLineupId",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Lineups_HomeTeamLineupId",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_MatchPlayers_Teams_TeamId",
                table: "MatchPlayers");

            migrationBuilder.DropIndex(
                name: "IX_Matches_AwayTeamLineupId",
                table: "Matches");

            migrationBuilder.DropIndex(
                name: "IX_Matches_HomeTeamLineupId",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "AwayTeamLineupId",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "HomeTeamLineupId",
                table: "Matches");

            migrationBuilder.RenameColumn(
                name: "TeamId",
                table: "MatchPlayers",
                newName: "MatchId");

            migrationBuilder.RenameIndex(
                name: "IX_MatchPlayers_TeamId",
                table: "MatchPlayers",
                newName: "IX_MatchPlayers_MatchId");

            migrationBuilder.AlterColumn<string>(
                name: "Position",
                table: "Players",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "TeamType",
                table: "MatchPlayers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "MatchId",
                table: "Lineups",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Lineups_MatchId",
                table: "Lineups",
                column: "MatchId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lineups_Matches_MatchId",
                table: "Lineups",
                column: "MatchId",
                principalTable: "Matches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MatchPlayers_Matches_MatchId",
                table: "MatchPlayers",
                column: "MatchId",
                principalTable: "Matches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
