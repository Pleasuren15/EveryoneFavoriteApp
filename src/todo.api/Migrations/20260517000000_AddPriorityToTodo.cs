using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace todo.api.Migrations
{
    /// <inheritdoc />
    public partial class AddPriorityToTodo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Priority",
                table: "Todo",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Todo");
        }
    }
}
