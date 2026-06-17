using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace todo.library.Migrations
{
    public partial class AddBirthdayContactFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContactId",
                table: "Todo",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactName",
                table: "Todo",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactId",
                table: "Todo");

            migrationBuilder.DropColumn(
                name: "ContactName",
                table: "Todo");
        }
    }
}
