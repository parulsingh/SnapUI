using System.Collections.Generic;
using SnapUI.Common.Models;
using System.Data.SqlClient;

namespace SnapUI.Services.Contracts
{
    public interface IGetQueueService
    {
        List<string> GetQueues();
    }
}