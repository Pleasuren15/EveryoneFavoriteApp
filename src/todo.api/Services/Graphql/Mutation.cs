using HotChocolate;
using Microsoft.EntityFrameworkCore;
using Todo.Library.Data;
using Todo.Library.Models.Database;

namespace todo.api.Services.Graphql;

public class Mutation
{
    // ─── Todos ────────────────────────────────────────────────────────────────

    /// <summary>Creates a new todo item for the given user and category.</summary>
    public async Task<Todo.Library.Models.Database.Todo> CreateTodo(
        AppDbContext dbContext,
        CreateTodoInput input,
        CancellationToken cancellationToken)
    {
        var todo = new Todo.Library.Models.Database.Todo
        {
            Id = Guid.NewGuid(),
            UserId = input.UserId,
            CategoryId = input.CategoryId,
            Text = input.Text,
            Completed = false,
            CreatedAt = DateTimeOffset.UtcNow,
            DueDate = input.DueDate,
            Price = input.Price,
            Priority = input.Priority,
            Quantity = input.Quantity,
            Store = input.Store,
            Assignee = input.Assignee,
            Team = input.Team,
            Notes = input.Notes,
            MoodRating = input.MoodRating,
            Tags = input.Tags,
            ContactId = input.ContactId,
            ContactName = input.ContactName,
        };

        dbContext.Todos.Add(todo);
        await dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return todo;
    }

    /// <summary>
    /// Partially updates a todo. Only fields present in the request are applied;
    /// absent fields leave the stored value untouched. Nullable fields can be
    /// explicitly set to null to clear them.
    /// </summary>
    public async Task<Todo.Library.Models.Database.Todo?> UpdateTodo(
        AppDbContext dbContext,
        UpdateTodoInput input,
        CancellationToken cancellationToken)
    {
        var todo = await dbContext.Todos
            .FirstOrDefaultAsync(t => t.Id == input.Id, cancellationToken)
            .ConfigureAwait(false);

        if (todo is null) return null;

        if (input.Completed.HasValue) todo.Completed = input.Completed.Value;
        if (input.Text.HasValue && !string.IsNullOrWhiteSpace(input.Text.Value))
            todo.Text = input.Text.Value;
        if (input.DueDate.HasValue) todo.DueDate = input.DueDate.Value;
        if (input.Price.HasValue) todo.Price = input.Price.Value;
        if (input.Priority.HasValue) todo.Priority = input.Priority.Value;
        if (input.Quantity.HasValue) todo.Quantity = input.Quantity.Value;
        if (input.Store.HasValue) todo.Store = input.Store.Value;
        if (input.Assignee.HasValue) todo.Assignee = input.Assignee.Value;
        if (input.Team.HasValue) todo.Team = input.Team.Value;
        if (input.Notes.HasValue) todo.Notes = input.Notes.Value;
        if (input.MoodRating.HasValue) todo.MoodRating = input.MoodRating.Value;
        if (input.Tags.HasValue) todo.Tags = input.Tags.Value;
        if (input.ContactId.HasValue) todo.ContactId = input.ContactId.Value;
        if (input.ContactName.HasValue) todo.ContactName = input.ContactName.Value;

        await dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return todo;
    }

    /// <summary>Permanently deletes a todo and all its subtasks (cascade). Returns false if not found.</summary>
    public async Task<bool> DeleteTodo(
        AppDbContext dbContext,
        Guid id,
        CancellationToken cancellationToken)
    {
        var todo = await dbContext.Todos
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (todo is null) return false;

        dbContext.Todos.Remove(todo);
        await dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return true;
    }

    // ─── Subtasks ─────────────────────────────────────────────────────────────

    /// <summary>Appends a new subtask to an existing todo.</summary>
    public async Task<Subtask> AddSubtask(
        AppDbContext dbContext,
        AddSubtaskInput input,
        CancellationToken cancellationToken)
    {
        var sortOrder = await dbContext.Subtasks
            .Where(s => s.TodoId == input.TodoId)
            .CountAsync(cancellationToken)
            .ConfigureAwait(false);

        var subtask = new Subtask
        {
            Id = Guid.NewGuid(),
            TodoId = input.TodoId,
            Text = input.Text,
            Completed = false,
            SortOrder = sortOrder,
        };

        dbContext.Subtasks.Add(subtask);
        await dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return subtask;
    }

    /// <summary>Flips the completed state of a subtask. Returns null if not found.</summary>
    public async Task<Subtask?> ToggleSubtask(
        AppDbContext dbContext,
        Guid id,
        CancellationToken cancellationToken)
    {
        var subtask = await dbContext.Subtasks
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (subtask is null) return null;

        subtask.Completed = !subtask.Completed;
        await dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return subtask;
    }

    /// <summary>Permanently deletes a subtask. Returns false if not found.</summary>
    public async Task<bool> DeleteSubtask(
        AppDbContext dbContext,
        Guid id,
        CancellationToken cancellationToken)
    {
        var subtask = await dbContext.Subtasks
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (subtask is null) return false;

        dbContext.Subtasks.Remove(subtask);
        await dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return true;
    }

    // ─── User sync ───────────────────────────────────────────────────────────

    /// <summary>
    /// Upserts a user record into the local database to mirror the Supabase Auth user.
    /// Called from the frontend after sign-up or sign-in so our User table stays in sync.
    /// The Id must match the Supabase user's id (the "sub" claim in the JWT).
    /// </summary>
    public async Task<Guid> SyncUser(
        AppDbContext dbContext,
        SyncUserInput input,
        CancellationToken cancellationToken)
    {
        var existing = await dbContext.Users
            .FirstOrDefaultAsync(u => u.Id == input.Id, cancellationToken)
            .ConfigureAwait(false);

        if (existing is not null)
        {
            existing.Email = input.Email;
            if (input.DisplayName is not null)
                existing.DisplayName = input.DisplayName;
        }
        else
        {
            dbContext.Users.Add(new User
            {
                Id = input.Id,
                Email = input.Email,
                DisplayName = input.DisplayName ?? "",
                CreatedAt = DateTimeOffset.UtcNow,
            });
        }

        await dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return input.Id;
    }

    // ─── Budget entries ───────────────────────────────────────────────────────

    /// <summary>Records a new income or expense entry for the given user.</summary>
    public async Task<BudgetEntry> CreateBudgetEntry(
        AppDbContext dbContext,
        CreateBudgetEntryInput input,
        CancellationToken cancellationToken)
    {
        var entry = new BudgetEntry
        {
            Id = Guid.NewGuid(),
            UserId = input.UserId,
            Type = input.Type,
            Category = input.Category,
            Amount = input.Amount,
            Description = input.Description,
            Date = input.Date,
            CreatedAt = DateTimeOffset.UtcNow,
        };

        dbContext.BudgetEntries.Add(entry);
        await dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return entry;
    }

    /// <summary>Permanently deletes a budget entry. Returns false if not found.</summary>
    public async Task<bool> DeleteBudgetEntry(
        AppDbContext dbContext,
        Guid id,
        CancellationToken cancellationToken)
    {
        var entry = await dbContext.BudgetEntries
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            .ConfigureAwait(false);

        if (entry is null) return false;

        dbContext.BudgetEntries.Remove(entry);
        await dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return true;
    }
}
