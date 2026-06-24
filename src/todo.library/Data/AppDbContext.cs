using Microsoft.EntityFrameworkCore;
using Todo.Library.Models.Database;

namespace Todo.Library.Data;

/// <summary>
/// Shared Entity Framework Core DbContext for EveryoneFavoriteApp.
/// Used by both todo.api and todo.messaging.api to access the same PostgreSQL database.
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Todo.Library.Models.Database.Todo> Todos => Set<Todo.Library.Models.Database.Todo>();
    public DbSet<Subtask> Subtasks => Set<Subtask>();
    public DbSet<BudgetEntry> BudgetEntries => Set<BudgetEntry>();
    public DbSet<StreakEntry> StreakEntries => Set<StreakEntry>();
    public DbSet<UserCategory> UserCategories => Set<UserCategory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserCategory>(entity =>
        {
            entity.HasKey(uc => new { uc.UserId, uc.CategoryId });

            entity.HasOne(uc => uc.User)
                .WithMany(u => u.UserCategories)
                .HasForeignKey(uc => uc.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(uc => uc.Category)
                .WithMany(c => c.UserCategories)
                .HasForeignKey(uc => uc.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
