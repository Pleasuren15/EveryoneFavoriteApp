using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Todo.Library.Data;
using Todo.Library.Models.Database;

namespace todo.messaging.api.Controllers;

/// <summary>
/// API for managing and querying todos across different categories.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TodosController(AppDbContext dbContext) : ControllerBase
{
    /// <summary>
    /// Get all shopping items for a specific user with prices.
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of shopping items with prices</returns>
    [HttpGet("shopping/{userId}")]
    public async Task<ActionResult<List<ShoppingItemDto>>> GetShoppingItems(Guid userId, CancellationToken cancellationToken)
    {
        var shoppingCategoryId = Guid.Parse("00000000-0000-0000-0000-000000000002");

        var shoppingItems = await dbContext.Todos
            .AsNoTracking()
            .Where(t => t.UserId == userId && t.CategoryId == shoppingCategoryId)
            .OrderByDescending(t => !t.Completed) // Active items first
            .ThenByDescending(t => t.CreatedAt)
            .Select(t => new ShoppingItemDto
            {
                Id = t.Id,
                Text = t.Text,
                Price = t.Price,
                Completed = t.Completed,
                DueDate = t.DueDate,
                Priority = t.Priority,
                CreatedAt = t.CreatedAt,
                Subtasks = t.Subtasks.Select(s => new SubtaskDto
                {
                    Id = s.Id,
                    Text = s.Text,
                    Completed = s.Completed,
                    SortOrder = s.SortOrder
                }).ToList()
            })
            .ToListAsync(cancellationToken);

        return Ok(shoppingItems);
    }

    /// <summary>
    /// Get shopping statistics including total price for active items.
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Shopping statistics</returns>
    [HttpGet("shopping/stats/{userId}")]
    public async Task<ActionResult<ShoppingStatsDto>> GetShoppingStats(Guid userId, CancellationToken cancellationToken)
    {
        var shoppingCategoryId = Guid.Parse("00000000-0000-0000-0000-000000000002");

        var stats = await dbContext.Todos
            .AsNoTracking()
            .Where(t => t.UserId == userId && t.CategoryId == shoppingCategoryId)
            .GroupBy(t => 1)
            .Select(g => new ShoppingStatsDto
            {
                TotalItems = g.Count(),
                CompletedItems = g.Count(t => t.Completed),
                ActiveItems = g.Count(t => !t.Completed),
                TotalPrice = g.Where(t => t.Price.HasValue).Sum(t => t.Price.Value),
                ActivePrice = g.Where(t => !t.Completed && t.Price.HasValue).Sum(t => t.Price.Value)
            })
            .FirstOrDefaultAsync(cancellationToken);

        return Ok(stats ?? new ShoppingStatsDto());
    }

    /// <summary>
    /// Get all todos for a specific user.
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of todos for the user</returns>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<TodoDto>>> GetTodosForUser(Guid userId, CancellationToken cancellationToken)
    {
        var todos = await dbContext.Todos
            .AsNoTracking()
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => !t.Completed)
            .ThenByDescending(t => t.CreatedAt)
            .Select(t => new TodoDto
            {
                Id = t.Id,
                Text = t.Text,
                Completed = t.Completed,
                Price = t.Price,
                DueDate = t.DueDate,
                Priority = t.Priority,
                CategoryId = t.CategoryId,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return Ok(todos);
    }

    /// <summary>
    /// Get todos by category.
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="categoryId">The category ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of todos in the specified category</returns>
    [HttpGet("user/{userId}/category/{categoryId}")]
    public async Task<ActionResult<List<TodoDto>>> GetTodosByCategory(Guid userId, Guid categoryId, CancellationToken cancellationToken)
    {
        var todos = await dbContext.Todos
            .AsNoTracking()
            .Where(t => t.UserId == userId && t.CategoryId == categoryId)
            .OrderByDescending(t => !t.Completed)
            .ThenByDescending(t => t.CreatedAt)
            .Select(t => new TodoDto
            {
                Id = t.Id,
                Text = t.Text,
                Completed = t.Completed,
                Price = t.Price,
                DueDate = t.DueDate,
                Priority = t.Priority,
                CategoryId = t.CategoryId,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return Ok(todos);
    }

    /// <summary>
    /// Get a specific todo by ID.
    /// </summary>
    /// <param name="id">The todo ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The todo item</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<TodoDto>> GetTodoById(Guid id, CancellationToken cancellationToken)
    {
        var todo = await dbContext.Todos
            .AsNoTracking()
            .Where(t => t.Id == id)
            .Select(t => new TodoDto
            {
                Id = t.Id,
                Text = t.Text,
                Completed = t.Completed,
                Price = t.Price,
                DueDate = t.DueDate,
                Priority = t.Priority,
                CategoryId = t.CategoryId,
                CreatedAt = t.CreatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (todo == null)
            return NotFound(new { message = "Todo not found" });

        return Ok(todo);
    }
}

/// <summary>
/// DTO for shopping items with price information.
/// </summary>
public class ShoppingItemDto
{
    /// <summary>Unique identifier</summary>
    public Guid Id { get; set; }

    /// <summary>Item name/description</summary>
    public string Text { get; set; } = string.Empty;

    /// <summary>Price of the item</summary>
    public decimal? Price { get; set; }

    /// <summary>Whether the item is completed/bought</summary>
    public bool Completed { get; set; }

    /// <summary>Due date for the item</summary>
    public DateOnly? DueDate { get; set; }

    /// <summary>Priority level (low, medium, high)</summary>
    public string? Priority { get; set; }

    /// <summary>When the item was created</summary>
    public DateTimeOffset CreatedAt { get; set; }

    /// <summary>Subtasks for this item</summary>
    public List<SubtaskDto> Subtasks { get; set; } = new();
}

/// <summary>
/// DTO for subtasks.
/// </summary>
public class SubtaskDto
{
    /// <summary>Unique identifier</summary>
    public Guid Id { get; set; }

    /// <summary>Subtask description</summary>
    public string Text { get; set; } = string.Empty;

    /// <summary>Whether the subtask is completed</summary>
    public bool Completed { get; set; }

    /// <summary>Sort order</summary>
    public int SortOrder { get; set; }
}

/// <summary>
/// DTO for shopping statistics.
/// </summary>
public class ShoppingStatsDto
{
    /// <summary>Total number of shopping items</summary>
    public int TotalItems { get; set; }

    /// <summary>Number of completed items</summary>
    public int CompletedItems { get; set; }

    /// <summary>Number of active (not completed) items</summary>
    public int ActiveItems { get; set; }

    /// <summary>Total price of all items (completed + active)</summary>
    public decimal TotalPrice { get; set; }

    /// <summary>Total price of active (not completed) items</summary>
    public decimal ActivePrice { get; set; }
}

/// <summary>
/// DTO for general todos.
/// </summary>
public class TodoDto
{
    /// <summary>Unique identifier</summary>
    public Guid Id { get; set; }

    /// <summary>Todo text/description</summary>
    public string Text { get; set; } = string.Empty;

    /// <summary>Whether the todo is completed</summary>
    public bool Completed { get; set; }

    /// <summary>Price (if applicable)</summary>
    public decimal? Price { get; set; }

    /// <summary>Due date</summary>
    public DateOnly? DueDate { get; set; }

    /// <summary>Priority level</summary>
    public string? Priority { get; set; }

    /// <summary>Category ID</summary>
    public Guid CategoryId { get; set; }

    /// <summary>Creation timestamp</summary>
    public DateTimeOffset CreatedAt { get; set; }
}
