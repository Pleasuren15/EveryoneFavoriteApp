using Microsoft.EntityFrameworkCore;
using Todo.Library.Data;

namespace todo.messaging.api.Extensions;

public static class ServiceCollectionsExtensions
{
    /// <summary>
    /// Registers the shared AppDbContext for database access.
    /// This allows todo.messaging.api to connect to the same database as todo.api.
    /// </summary>
    public static void AddDatabaseServices(this IServiceCollection services, WebApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString("EveryoneFavoriteApp");
        services.AddDbContextPool<AppDbContext>(
            options => options
            .UseNpgsql(connectionString));
    }

    /// <summary>
    /// Ensures database is up-to-date with latest migrations.
    /// </summary>
    public static async Task EnsureDatabaseMigratedAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.MigrateAsync();
    }
}
