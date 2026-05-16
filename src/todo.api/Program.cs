using todo.api.Extensions;

namespace todo.api;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddApplicationService(builder);

        var app = builder.Build();

        await app.UseSeedDataAsync();

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.Run();
    }
}
