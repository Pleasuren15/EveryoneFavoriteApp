using Microsoft.EntityFrameworkCore;
using Todo.Library.Data;

namespace todo.api.Extensions;

public static class ServiceCollectionsExtensions
{
    public static void AddApplicationService(this IServiceCollection services, WebApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString("EveryoneFavoriteApp");
        services.AddDbContextPool<AppDbContext>(
            options => options
            .UseNpgsql(connectionString, b => b.MigrationsAssembly("todo.library")));
    }

    public static async Task UseSeedDataAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.MigrateAsync();
        await DbInitializer.SeedAsync(db);
    }
}
