using todo.api.Extensions;

namespace todo.api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddApplicationService(builder);

        var app = builder.Build();

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.Run();
    }
}
