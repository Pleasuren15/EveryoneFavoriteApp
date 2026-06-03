using Resend;
using Todo.Library.Models.Database;

namespace todo.messaging.api.Services;

public interface IMessagingService
{
    Task<ResendResponse> SendExpiringTasks(Guid userId);
}
