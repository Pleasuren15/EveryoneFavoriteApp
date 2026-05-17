using Serilog;
using todo.api.Extensions;
using todo.api.Services.Graphql;

namespace todo.api;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddApplicationService(builder);
        builder.AddGraphQL()
            .AddQueryType<Query>()
            .AddSorting();

        builder.Host.UseSerilog((ctx, cfg) => cfg.ReadFrom.Configuration(ctx.Configuration));
        var app = builder.Build();
        app.MapGraphQL();

        await app.UseSeedDataAsync();
        app.Map("/", () => Results.Redirect("/graphql"));

        await app.RunWithGraphQLCommandsAsync(args);
    }
}