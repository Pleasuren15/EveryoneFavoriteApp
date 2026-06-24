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
}
