using todo.api.Extensions;
using todo.api.Models.Graphql;

namespace todo.api;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddApplicationService(builder);
        builder.AddGraphQL()
            .AddQueryType<Query>();

        var app = builder.Build();
        app.MapGraphQL();

        await app.UseSeedDataAsync();

        await app.RunWithGraphQLCommandsAsync(args);
    }
}