using System.ComponentModel.DataAnnotations.Schema;

namespace Todo.Api.Models.Database;

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
    
    // Shopping-specific fields
    [Column("Quantity")]
    public int? Quantity { get; set; }
    [Column("Store")]
    public string? Store { get; set; }
    
    // Work-specific fields
    [Column("Assignee")]
    public string? Assignee { get; set; }
    [Column("Team")]
    public string? Team { get; set; }
    
    // Personal-specific fields
    [Column("Notes")]
    public string? Notes { get; set; }
    [Column("MoodRating")]
    public int? MoodRating { get; set; }
    
    // Others-specific fields
    [Column("Tags")]
    public string? Tags { get; set; }

    // Birthday-specific fields
    [Column("ContactId")]
    public string? ContactId { get; set; }
    [Column("ContactName")]
    public string? ContactName { get; set; }

    public User User { get; set; } = null!;
    public Category Category { get; set; } = null!;
    public ICollection<Subtask> Subtasks { get; set; } = [];
}
