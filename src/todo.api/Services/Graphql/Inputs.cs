using HotChocolate;

namespace todo.api.Services.Graphql;

// ─── Todo inputs ─────────────────────────────────────────────────────────────

public record CreateTodoInput(
    Guid UserId,
    Guid CategoryId,
    string Text,
    DateOnly? DueDate,
    decimal? Price,
    string? Priority,
    int? Quantity,
    string? Store,
    string? Assignee,
    string? Team,
    string? Notes,
    int? MoodRating,
    string? Tags,
    string? ContactId,
    string? ContactName);

/// <summary>
/// All fields except Id are optional. Pass only the fields you want to change.
/// Nullable fields (DueDate, Price, Priority) can be explicitly set to null to clear them.
/// Use Optional&lt;T&gt; semantics: a field absent from the request leaves the DB value untouched.
/// </summary>
public record UpdateTodoInput(
    Guid Id,
    Optional<bool> Completed,
    Optional<string> Text,
    Optional<DateOnly?> DueDate,
    Optional<decimal?> Price,
    Optional<string?> Priority,
    Optional<int?> Quantity,
    Optional<string?> Store,
    Optional<string?> Assignee,
    Optional<string?> Team,
    Optional<string?> Notes,
    Optional<int?> MoodRating,
    Optional<string?> Tags,
    Optional<string?> ContactId,
    Optional<string?> ContactName);

// ─── Subtask inputs ───────────────────────────────────────────────────────────

public record AddSubtaskInput(
    Guid TodoId,
    string Text);

// ─── User sync ────────────────────────────────────────────────────────────────

/// <summary>Creates or updates a user record to match the authenticated Supabase user.</summary>
public record SyncUserInput(
    Guid Id,
    string Email,
    string? DisplayName);

// ─── Budget entry inputs ──────────────────────────────────────────────────────

public record CreateBudgetEntryInput(
    Guid UserId,
    string Type,
    string Category,
    decimal Amount,
    string Description,
    DateOnly Date);

// ─── Streak entry inputs ─────────────────────────────────────────────────────

public record CreateStreakEntryInput(
    Guid UserId,
    string Title,
    string? Rules);

public record CheckInStreakEntryInput(
    Guid Id);

// ─── User Category inputs ─────────────────────────────────────────────────────

public record SetUserCategoriesInput(
    Guid UserId,
    List<Guid> CategoryIds);
