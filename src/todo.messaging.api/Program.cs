using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Resend;
using Scalar.AspNetCore;
using todo.messaging.api.Extensions;
using todo.messaging.api.Services;
using Todo.Library.Data;
using Todo.Library.Models.Database;

namespace todo.messaging.api;

public class Program
{
    public static async Task Main(string[] args)
    {
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

        builder.Services.AddAuthorization();
        builder.Services.AddOpenApi();
        builder.Services.AddDatabaseServices(builder);
        builder.Services.AddControllers();
        builder.Services.AddOptions();
        builder.Services.AddHttpClient<ResendClient>();
        builder.Services.Configure<ResendClientOptions>(o =>
        {
            o.ApiToken = "re_QEaU2eku_Gguu3Q6bGSCBEQcYMRKs44p8";
        });
        builder.Services.AddTransient<IResend, ResendClient>();
        builder.Services.AddTransient<IMessagingService>(options =>
        {
            var resend = options.GetRequiredService<IResend>();
            var dbContext = options.GetRequiredService<AppDbContext>();
            var logger = options.GetRequiredService<ILogger<MessagingService>>();
            return new MessagingService(resend, dbContext, logger);
        });

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.MapScalarApiReference(options =>
            {
                options.OpenApiRoutePattern = "/openapi/{documentName}.json";
            });
        }

        app.MapPost("/send-expiring-tasks/{userId}", async (IMessagingService messagingService, [FromRoute] Guid userId) =>
        {
            var result = await messagingService.SendExpiringTasks(userId);
            return Results.Ok(result);
        })
        .WithDisplayName("Send Expiring Tasks")
        .WithDescription("Sends an email to the user with their expiring tasks.");

        app.UseCors();
        app.UseHttpsRedirection();
        app.UseAuthorization();

        app.MapControllers();

        await app.EnsureDatabaseMigratedAsync();

        await app.RunAsync();
    }
}
