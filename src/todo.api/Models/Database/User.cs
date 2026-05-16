using System.ComponentModel.DataAnnotations.Schema;

namespace Todo.Api.Models.Database;

[Table("User")]
public class User
{
    [Column("Id")]
    public Guid Id { get; set; }
    [Column("Email")]
    public string Email { get; set; } = string.Empty;
    [Column("PasswordHash")]
    public string PasswordHash { get; set; } = string.Empty;
    [Column("DisplayName")]
    public string DisplayName { get; set; } = string.Empty;
    [Column("CreatedAt")]
    public DateTimeOffset CreatedAt { get; set; }

    public ICollection<Todo> Todos { get; set; } = new List<Todo>();
    public ICollection<BudgetEntry> BudgetEntries { get; set; } = new List<BudgetEntry>();
}
