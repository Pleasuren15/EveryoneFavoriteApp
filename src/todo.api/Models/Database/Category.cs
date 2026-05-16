using System.ComponentModel.DataAnnotations.Schema;

namespace Todo.Api.Models.Database;

[Table("Category")]
public class Category
{
    [Column("Id")]
    public Guid Id { get; set; }
    [Column("Name")]
    public string Name { get; set; } = string.Empty;
    [Column("Label")]
    public string Label { get; set; } = string.Empty;
    [Column("SortOrder")]
    public int SortOrder { get; set; }

    public ICollection<Todo> Todos { get; set; } = new List<Todo>();
}
