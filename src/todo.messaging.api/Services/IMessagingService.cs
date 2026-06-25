using Resend;
using Todo.Library.Models.Database;

namespace todo.messaging.api.Services;

public interface IMessagingService
{
    /// <summary>
    /// Sends a message to the user with the expiring tasks.
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<ResendResponse> SendExpiringTasks(Guid userId);
}
