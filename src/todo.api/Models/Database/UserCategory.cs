using System.ComponentModel.DataAnnotations.Schema;

namespace Todo.Api.Models.Database;

[Table("UserCategory")]
public class UserCategory
{
    public Guid UserId { get; set; }
    public Guid CategoryId { get; set; }

    public User User { get; set; } = null!;
    public Category Category { get; set; } = null!;
}
