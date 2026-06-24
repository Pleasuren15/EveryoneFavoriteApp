using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Todo.Library.Models.Database;

namespace Todo.Library.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Categories.AnyAsync() || await db.Users.AnyAsync())
            return;

        var categories = new List<Category>
        {
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000001"), Name = "Todo", Label = "Todo", SortOrder = 1 },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000002"), Name = "Shopping", Label = "Shopping", SortOrder = 2 },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000003"), Name = "Personal", Label = "Personal", SortOrder = 3 },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000004"), Name = "Work", Label = "Work", SortOrder = 4 },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000005"), Name = "Others", Label = "Others", SortOrder = 5 },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000006"), Name = "Birthday", Label = "Birthday", SortOrder = 6 },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000007"), Name = "Streak", Label = "Streak", SortOrder = 7 },
        };

        var user = new User
        {
            Id = Guid.Parse("00000000-0000-0000-0000-00000000000a"),
            Email = "demo@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            DisplayName = "Demo User",
            CreatedAt = new DateTimeOffset(2026, 5, 1, 0, 0, 0, TimeSpan.Zero),
        };

        var todos = new List<Models.Database.Todo>
        {
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000101"), UserId = user.Id, CategoryId = categories[3].Id,
                Text = "Review project proposal", Completed = false, CreatedAt = new DateTimeOffset(2026, 5, 6, 0, 0, 0, TimeSpan.Zero),
                DueDate = new DateOnly(2026, 5, 10), Priority = "high",
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000102"), UserId = user.Id, CategoryId = categories[1].Id,
                Text = "Buy groceries for the week", Completed = true, CreatedAt = new DateTimeOffset(2026, 5, 6, 0, 0, 0, TimeSpan.Zero),
                Price = 85m, Priority = "medium",
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000103"), UserId = user.Id, CategoryId = categories[2].Id,
                Text = "Morning exercise routine", Completed = false, CreatedAt = new DateTimeOffset(2026, 5, 6, 0, 0, 0, TimeSpan.Zero),
                DueDate = new DateOnly(2026, 5, 7), Priority = "medium",
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000104"), UserId = user.Id, CategoryId = categories[3].Id,
                Text = "Prepare team presentation", Completed = false, CreatedAt = new DateTimeOffset(2026, 5, 6, 0, 0, 0, TimeSpan.Zero),
                DueDate = new DateOnly(2026, 5, 12), Priority = "high",
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000105"), UserId = user.Id, CategoryId = categories[2].Id,
                Text = "Read a chapter of a book", Completed = false, CreatedAt = new DateTimeOffset(2026, 5, 6, 0, 0, 0, TimeSpan.Zero),
                DueDate = new DateOnly(2026, 5, 10), Priority = "low",
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000106"), UserId = user.Id, CategoryId = categories[4].Id,
                Text = "Plan weekend trip", Completed = false, CreatedAt = new DateTimeOffset(2026, 5, 6, 0, 0, 0, TimeSpan.Zero),
                DueDate = new DateOnly(2026, 5, 8), Priority = "medium",
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000107"), UserId = user.Id, CategoryId = categories[0].Id,
                Text = "Organize desk workspace", Completed = false, CreatedAt = new DateTimeOffset(2026, 5, 6, 0, 0, 0, TimeSpan.Zero),
                DueDate = new DateOnly(2026, 5, 7), Priority = "low",
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000108"), UserId = user.Id, CategoryId = categories[4].Id,
                Text = "Call plumber about leak", Completed = false, CreatedAt = new DateTimeOffset(2026, 5, 6, 0, 0, 0, TimeSpan.Zero),
                Priority = "high",
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000109"), UserId = user.Id, CategoryId = categories[1].Id,
                Text = "Pick up dry cleaning", Completed = true, CreatedAt = new DateTimeOffset(2026, 5, 6, 0, 0, 0, TimeSpan.Zero),
                Price = 15m, Priority = "low",
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-00000000010a"), UserId = user.Id, CategoryId = categories[2].Id,
                Text = "Write daily journal entry", Completed = false, CreatedAt = new DateTimeOffset(2026, 5, 6, 0, 0, 0, TimeSpan.Zero),
                Priority = "low",
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-00000000010b"), UserId = user.Id, CategoryId = categories[3].Id,
                Text = "Fix login page bug", Completed = false, CreatedAt = new DateTimeOffset(2026, 5, 6, 0, 0, 0, TimeSpan.Zero),
                DueDate = new DateOnly(2026, 5, 9), Priority = "high",
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-00000000010c"), UserId = user.Id, CategoryId = categories[0].Id,
                Text = "Clean out email inbox", Completed = false, CreatedAt = new DateTimeOffset(2026, 5, 6, 0, 0, 0, TimeSpan.Zero),
                Priority = "medium",
            },
        };

        var subtasks = new List<Subtask>
        {
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000201"), TodoId = todos[0].Id, Text = "Read through draft", Completed = true, SortOrder = 0 },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000202"), TodoId = todos[0].Id, Text = "Add feedback notes", Completed = false, SortOrder = 1 },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000203"), TodoId = todos[0].Id, Text = "Send to manager", Completed = false, SortOrder = 2 },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000204"), TodoId = todos[3].Id, Text = "Create slides", Completed = false, SortOrder = 0 },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000205"), TodoId = todos[3].Id, Text = "Gather metrics", Completed = false, SortOrder = 1 },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000206"), TodoId = todos[10].Id, Text = "Reproduce the bug", Completed = true, SortOrder = 0 },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000207"), TodoId = todos[10].Id, Text = "Fix the issue", Completed = false, SortOrder = 1 },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000208"), TodoId = todos[10].Id, Text = "Write tests", Completed = false, SortOrder = 2 },
        };

        var budgetEntries = new List<BudgetEntry>
        {
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000301"), UserId = user.Id, Type = "income", Category = "Income", Amount = 5000m, Description = "Monthly salary", Date = new DateOnly(2026, 5, 1), CreatedAt = new DateTimeOffset(2026, 5, 1, 0, 0, 0, TimeSpan.Zero) },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000302"), UserId = user.Id, Type = "expense", Category = "Food", Amount = 800m, Description = "Groceries", Date = new DateOnly(2026, 5, 3), CreatedAt = new DateTimeOffset(2026, 5, 3, 0, 0, 0, TimeSpan.Zero) },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000303"), UserId = user.Id, Type = "expense", Category = "Bills", Amount = 1200m, Description = "Rent", Date = new DateOnly(2026, 5, 1), CreatedAt = new DateTimeOffset(2026, 5, 1, 0, 0, 0, TimeSpan.Zero) },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000304"), UserId = user.Id, Type = "expense", Category = "Transport", Amount = 400m, Description = "Fuel", Date = new DateOnly(2026, 5, 5), CreatedAt = new DateTimeOffset(2026, 5, 5, 0, 0, 0, TimeSpan.Zero) },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000305"), UserId = user.Id, Type = "expense", Category = "Entertainment", Amount = 300m, Description = "Streaming & games", Date = new DateOnly(2026, 5, 6), CreatedAt = new DateTimeOffset(2026, 5, 6, 0, 0, 0, TimeSpan.Zero) },
            new() { Id = Guid.Parse("00000000-0000-0000-0000-000000000306"), UserId = user.Id, Type = "expense", Category = "Shopping", Amount = 600m, Description = "New clothes", Date = new DateOnly(2026, 5, 4), CreatedAt = new DateTimeOffset(2026, 5, 4, 0, 0, 0, TimeSpan.Zero) },
        };

        var streakEntries = new List<StreakEntry>
        {
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000401"), UserId = user.Id,
                Title = "of running", Rules = "Run at least 2km every day", CurrentStreak = 15, LongestStreak = 42,
                StartDate = new DateOnly(2026, 6, 1), LastCheckIn = new DateOnly(2026, 6, 21),
                IsActive = true, CreatedAt = new DateTimeOffset(2026, 6, 1, 0, 0, 0, TimeSpan.Zero),
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000402"), UserId = user.Id,
                Title = "of meditation", Rules = "Meditate for 10 minutes", CurrentStreak = 7, LongestStreak = 30,
                StartDate = new DateOnly(2026, 6, 10), LastCheckIn = new DateOnly(2026, 6, 21),
                IsActive = true, CreatedAt = new DateTimeOffset(2026, 6, 10, 0, 0, 0, TimeSpan.Zero),
            },
            new()
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000403"), UserId = user.Id,
                Title = "of no sugar", Rules = "No added sugar in meals or drinks", CurrentStreak = 0, LongestStreak = 14,
                StartDate = new DateOnly(2026, 6, 5), LastCheckIn = new DateOnly(2026, 6, 19),
                IsActive = false, CreatedAt = new DateTimeOffset(2026, 6, 5, 0, 0, 0, TimeSpan.Zero),
            },
        };

        var userCategories = categories.Select(c => new UserCategory
        {
            UserId = user.Id,
            CategoryId = c.Id,
        }).ToList();

        db.Categories.AddRange(categories);
        db.Users.Add(user);
        db.Set<Todo.Library.Models.Database.Todo>().AddRange(todos);
        db.Subtasks.AddRange(subtasks);
        db.BudgetEntries.AddRange(budgetEntries);
        db.StreakEntries.AddRange(streakEntries);
        db.UserCategories.AddRange(userCategories);

        await db.SaveChangesAsync();
    }
}
