using System.ComponentModel.DataAnnotations.Schema;

namespace Todo.Library.Models.Database;

[Table("Subtask")]
public class Subtask
{
    [Column("Id")]
    public Guid Id { get; set; }
    [Column("TodoId")]
    public Guid TodoId { get; set; }
    [Column("Text")]
    public string Text { get; set; } = string.Empty;
    [Column("Completed")]
    public bool Completed { get; set; }
    [Column("SortOrder")]
    public int SortOrder { get; set; }

    public Todo Todo { get; set; } = null!;
}
