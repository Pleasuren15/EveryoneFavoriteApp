using System.ComponentModel.DataAnnotations.Schema;

namespace Todo.Api.Models.Database;

[Table("StreakEntry")]
public class StreakEntry
{
    [Column("Id")]
    public Guid Id { get; set; }
    [Column("UserId")]
    public Guid UserId { get; set; }
    [Column("Title")]
    public string Title { get; set; } = string.Empty;
    [Column("Rules")]
    public string? Rules { get; set; }
    [Column("CurrentStreak")]
    public int CurrentStreak { get; set; } = 1;
    [Column("LongestStreak")]
    public int LongestStreak { get; set; } = 1;
    [Column("StartDate")]
    public DateOnly StartDate { get; set; }
    [Column("LastCheckIn")]
    public DateOnly? LastCheckIn { get; set; }
    [Column("IsActive")]
    public bool IsActive { get; set; } = true;
    [Column("CreatedAt")]
    public DateTimeOffset CreatedAt { get; set; }

    public User User { get; set; } = null!;
}
