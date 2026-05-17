using GreenDonut.Data;
using Microsoft.EntityFrameworkCore;
using todo.api.Infrastructure;
using Todo.Api.Models.Database;

namespace todo.api.Services.Graphql
{
    public class Query
    {
        public async Task<List<Category>> GetCategories(
            AppDbContext dbContext,
            QueryContext<Category> queryContext,
            CancellationToken cancellationToken)
        {
            var categories = await dbContext.Categories
                .AsNoTracking()
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);

            return categories;
        }

        public async Task<List<Todo.Api.Models.Database.Todo>> GetTodos(
            AppDbContext dbContext,
            QueryContext<Todo.Api.Models.Database.Todo> queryContext,
            CancellationToken cancellationToken)
        {
            var todos = await dbContext.Todos
                .AsNoTracking()
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);

            return todos;
        }
    }
}
