using System.ComponentModel.DataAnnotations.Schema;

namespace Todo.Api.Models.Database;

[Table("BudgetEntry")]
public class BudgetEntry
{
    [Column("Id")]
    public Guid Id { get; set; }
    [Column("UserId")]
    public Guid UserId { get; set; }
    [Column("Type")]
    public string Type { get; set; } = string.Empty;
    [Column("Category")]
    public string Category { get; set; } = string.Empty;
    [Column("Amount")]
    public decimal Amount { get; set; }
    [Column("Description")]
    public string Description { get; set; } = string.Empty;
    [Column("Date")]
    public DateOnly Date { get; set; }
    [Column("CreatedAt")]
    public DateTimeOffset CreatedAt { get; set; }

    public User User { get; set; } = null!;
}
