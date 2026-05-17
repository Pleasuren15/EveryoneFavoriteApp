using Microsoft.EntityFrameworkCore;
using Todo.Api.Models.Database;

namespace todo.api.Infrastructure;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Todo.Api.Models.Database.Todo> Todos => Set<Todo.Api.Models.Database.Todo>();
    public DbSet<Subtask> Subtasks => Set<Subtask>();
    public DbSet<BudgetEntry> BudgetEntries => Set<BudgetEntry>();
}
