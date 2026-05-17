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

        var app = builder.Build();
        app.MapGraphQL();

        await app.UseSeedDataAsync();

        await app.RunWithGraphQLCommandsAsync(args);
    }
}