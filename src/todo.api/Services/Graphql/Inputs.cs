using HotChocolate;

namespace todo.api.Services.Graphql;

// ─── Todo inputs ─────────────────────────────────────────────────────────────

public record CreateTodoInput(
    Guid UserId,
    Guid CategoryId,
    string Text,
    DateOnly? DueDate,
    decimal? Price,
    string? Priority);

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
    Optional<string?> Priority);

// ─── Subtask inputs ───────────────────────────────────────────────────────────

public record AddSubtaskInput(
    Guid TodoId,
    string Text);

// ─── Budget entry inputs ──────────────────────────────────────────────────────

public record CreateBudgetEntryInput(
    Guid UserId,
    string Type,
    string Category,
    decimal Amount,
    string Description,
    DateOnly Date);
