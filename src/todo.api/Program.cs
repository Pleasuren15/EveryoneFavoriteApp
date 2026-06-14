using Serilog;
using todo.api.Extensions;
using todo.api.Services.Graphql;

namespace todo.api;

public class Program
{
    public static async Task Main(string[] args)
    {
        try { DotNetEnv.Env.TraversePath().Load(); } catch { }

        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        builder.Services.AddApplicationService(builder);
        builder.AddGraphQL()
            .AddQueryType<Query>()
            .AddMutationType<Mutation>()
            .AddSorting();

        builder.Host.UseSerilog((ctx, cfg) => cfg.ReadFrom.Configuration(ctx.Configuration));
        var app = builder.Build();

        app.UseCors();
        app.MapGraphQL();

        await app.UseSeedDataAsync();
        app.Map("/", () => Results.Redirect("/graphql"));

        await app.RunWithGraphQLCommandsAsync(args);
    }
}