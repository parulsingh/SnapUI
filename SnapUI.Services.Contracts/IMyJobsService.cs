using System.Collections.Generic;
using SnapUI.Common.Models;
using System.Data.SqlClient;

namespace SnapUI.Services.Contracts
{
    public interface IMyJobsService
    {
        IEnumerable<Job> GetMyJobs();
        IEnumerable<Job> GetJobsFromDB(string procname, List<object> parameters, List<object> parameterValues);
        void UpdateCheckin(int checkinId, string jobStatus, int jobDuration);
        void UpdateAllJobs(List<Job> allJobs);
        SqlDataReader Reader(SqlConnection conn, string procname, List<object> parameters, List<object> parameterValues);
        string MakePositionSuffix(int position);
    }
}