using System.ComponentModel.DataAnnotations.Schema;

namespace Todo.Library.Models.Database;

[Table("Todo")]
public class Todo
{
    [Column("Id")]
    public Guid Id { get; set; }
    [Column("UserId")]
    public Guid UserId { get; set; }
    [Column("CategoryId")]
    public Guid CategoryId { get; set; }
    [Column("Text")]
    public string Text { get; set; } = string.Empty;
    [Column("Completed")]
    public bool Completed { get; set; }
    [Column("CreatedAt")]
    public DateTimeOffset CreatedAt { get; set; }
    [Column("DueDate")]
    public DateOnly? DueDate { get; set; }
    [Column("Price")]
    public decimal? Price { get; set; }
    [Column("Priority")]
    public string? Priority { get; set; }

    public User User { get; set; } = null!;
    public Category Category { get; set; } = null!;
    public ICollection<Subtask> Subtasks { get; set; } = [];
}
