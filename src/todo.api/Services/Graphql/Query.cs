using GreenDonut.Data;
using Microsoft.EntityFrameworkCore;
using todo.api.Infrastructure;
using todo.api.Models.Dtos;
using Todo.Api.Models.Database;

namespace todo.api.Services.Graphql
{
    public class Query
    {
        /// <summary>Retrieves all todos for a specific user.</summary>
        public async Task<List<Todo.Api.Models.Database.Todo>> GetTodos(
            AppDbContext dbContext,
            Guid userId,
            QueryContext<Todo.Api.Models.Database.Todo> queryContext,
            CancellationToken cancellationToken)
        {
            var todos = await dbContext.Todos
                .AsNoTracking()
                .Where(t => t.UserId == userId)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);

            return todos;
        }

        /// <summary>Retrieves a single category by ID with its todos filtered to only include the specified user's todos.</summary>
        public async Task<Category?> GetCategoryByIdWithTodosForUser(
            AppDbContext dbContext,
            Guid categoryId,
            Guid userId,
            CancellationToken cancellationToken)
        {
            var category = await dbContext.Categories
                .AsNoTracking()
                .Include(c => c.Todos.Where(t => t.UserId == userId))
                .FirstOrDefaultAsync(c => c.Id == categoryId, cancellationToken)
                .ConfigureAwait(false);

            return category;
        }

        /// <summary>Retrieves todo counts (total and completed) per category for the specified user.</summary>
        public async Task<List<CategoryStats>> GetCategoryStatsForUser(
            AppDbContext dbContext,
            Guid userId,
            CancellationToken cancellationToken)
        {
            var stats = await dbContext.Categories
                .AsNoTracking()
                .Where(c => c.Todos.Any(t => t.UserId == userId))
                .Select(c => new CategoryStats
                {
                    CategoryId = c.Id,
                    CategoryName = c.Name,
                    TotalTodos = c.Todos.Count(t => t.UserId == userId),
                    CompletedTodos = c.Todos.Count(t => t.UserId == userId && t.Completed)
                })
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);

            return stats;
        }

        /// <summary>Retrieves categories with todo completion progress (counts and sort order) for the specified user.</summary>
        public async Task<List<CategoryProgress>> GetCategoriesWithProgressForUser(
            AppDbContext dbContext,
            Guid userId,
            CancellationToken cancellationToken)
        {
            var progress = await dbContext.Categories
                .AsNoTracking()
                .Where(c => c.Todos.Any(t => t.UserId == userId))
                .Select(c => new CategoryProgress
                {
                    CategoryId = c.Id,
                    CategoryName = c.Name,
                    SortOrder = c.SortOrder,
                    TotalTodos = c.Todos.Count(t => t.UserId == userId),
                    CompletedTodos = c.Todos.Count(t => t.UserId == userId && t.Completed)
                })
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);

            return progress;
        }
    }
}
