using System.Collections.Generic;
using SnapUI.Common.Models;

namespace SnapUI.Services.Contracts
{
    public interface IMyJobsService
    {
        IEnumerable<Job> GetMyJobs();
    }
}