using GreenDonut.Data;
using Microsoft.EntityFrameworkCore;
using Todo.Library.Data;
using todo.api.Models.Dtos;
using Todo.Library.Models.Database;

namespace todo.api.Services.Graphql
{
    public class Query
    {
        /// <summary>Retrieves all todos for a specific user.</summary>
        public async Task<List<Todo.Library.Models.Database.Todo>> GetTodos(
            AppDbContext dbContext,
            Guid userId,
            QueryContext<Todo.Library.Models.Database.Todo> queryContext,
            CancellationToken cancellationToken)
        {
            var todos = await dbContext.Todos
                .AsNoTracking()
                .Include(t => t.Category)
                .Include(t => t.Subtasks)
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
        /// <summary>Retrieves all streak entries for a specific user, ordered by creation date descending.</summary>
        public async Task<List<StreakEntry>> GetStreakEntries(
            AppDbContext dbContext,
            Guid userId,
            CancellationToken cancellationToken)
        {
            return await dbContext.StreakEntries
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);
        }

        /// <summary>Retrieves the list of category IDs the user has selected to see.</summary>
        public async Task<List<Guid>> GetUserCategories(
            AppDbContext dbContext,
            Guid userId,
            CancellationToken cancellationToken)
        {
            return await dbContext.UserCategories
                .AsNoTracking()
                .Where(uc => uc.UserId == userId)
                .Select(uc => uc.CategoryId)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);
        }

        /// <summary>Retrieves all categories available in the system.</summary>
        public async Task<List<Category>> GetCategories(
            AppDbContext dbContext,
            CancellationToken cancellationToken)
        {
            return await dbContext.Categories
                .AsNoTracking()
                .OrderBy(c => c.SortOrder)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);
        }

        /// <summary>Retrieves all budget entries for a specific user, ordered by date descending.</summary>
        public async Task<List<BudgetEntry>> GetBudgetEntries(
            AppDbContext dbContext,
            Guid userId,
            CancellationToken cancellationToken)
        {
            return await dbContext.BudgetEntries
                .AsNoTracking()
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.Date)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);
        }
    }
}
