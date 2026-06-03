using Microsoft.EntityFrameworkCore;
using Resend;
using Todo.Library.Models.Database;

namespace todo.messaging.api.Services;

public class MessagingService(
    IResend resend,
    DbContext dbContext,
    ILogger<MessagingService> logger) : IMessagingService
{
    private readonly IResend _resend = resend;
    private readonly DbContext _context = dbContext;
    private readonly ILogger<MessagingService> _logger = logger;

    public async Task<ResendResponse> SendExpiringTasks(Guid userId)
    {
        try
        {
            _logger.LogInformation("Sending expiring tasks for user {UserId}", userId);

            var today = DateOnly.FromDateTime(DateTime.Today);
            var todos = await _context.Set<Todo.Library.Models.Database.Todo>()
                .AsNoTracking()
                .Where(t => t.UserId == userId && t.DueDate == today)
                .ToListAsync();

            var message = CreateEmailToSend(todos);
            var results = await _resend.EmailSendAsync(message);
            return results;

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending expiring tasks for user {UserId}", userId);
            throw new Exception(ex.Message);
        }
        finally
        {
            _logger.LogInformation("Finished sending expiring tasks for user {UserId}", userId);
        }
    }

    private static EmailMessage CreateEmailToSend(IList<Todo.Library.Models.Database.Todo> todos)
    {
        var message = new EmailMessage();
        message.From = "Acme <onboarding@resend.dev>";
        message.To.Add("pleasuren15@gmail.com");
        message.Subject = "Today Expiring Todos";
        message.HtmlBody = @"
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: white; padding: 20px; border-radius: 0 0 8px 8px; }
        .todo-item { background-color: #f0f0f0; padding: 12px; margin: 10px 0; border-left: 4px solid #4CAF50; border-radius: 4px; }
        .button { display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>Your Todo Update</h1>
        </div>
        <div class=""content"">
            <p>Hello,</p>
            <p>Here's your latest todo list:</p>
            <div class=""todo-item"">
                <strong>✓ Task 1</strong> - Completed
            </div>
            <div class=""todo-item"">
                <strong>○ Task 2</strong> - In Progress
            </div>
            <a href=""https://yourapp.com"" class=""button"">View All Todos</a>
            <div class=""footer"">
                <p>© 2025 Everyone's Favorite App. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>";

        return message;
    }
}