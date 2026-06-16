using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
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

        services.AddHealthChecks()
            .AddDbContextCheck<AppDbContext>(name: "database", tags: ["ready"]);
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

    /// <summary>
    /// Maps health endpoints:
    ///  - /health/live: liveness, no dependency checks (use for the Azure health probe).
    ///  - /health:      readiness, includes database connectivity, returns JSON detail.
    /// </summary>
    public static void MapHealthEndpoints(this WebApplication app)
    {
        app.MapHealthChecks("/health/live", new HealthCheckOptions
        {
            Predicate = _ => false
        });

        app.MapHealthChecks("/health", new HealthCheckOptions
        {
            Predicate = check => check.Tags.Contains("ready"),
            ResponseWriter = WriteHealthResponse
        });
    }

    private static Task WriteHealthResponse(HttpContext context, HealthReport report)
    {
        context.Response.ContentType = "application/json";
        var payload = JsonSerializer.Serialize(new
        {
            status = report.Status.ToString(),
            totalDurationMs = report.TotalDuration.TotalMilliseconds,
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                description = e.Value.Description,
                durationMs = e.Value.Duration.TotalMilliseconds,
                error = e.Value.Exception?.Message
            })
        });
        return context.Response.WriteAsync(payload);
    }
}
