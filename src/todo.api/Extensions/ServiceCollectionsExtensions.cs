using Microsoft.EntityFrameworkCore;
using todo.api.Infrastructure;

namespace todo.api.Extensions;

public static class ServiceCollectionsExtensions
{
    public static void AddApplicationService(this IServiceCollection services, WebApplicationBuilder builder)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

        services.AddAuthorization();
        services.AddOpenApi();
    }
}
