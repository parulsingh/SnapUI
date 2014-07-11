using System.Collections.Generic;
using SnapUI.Common.Models;
using System.Data.SqlClient;

namespace SnapUI.Services.Contracts
{
    public interface IMyJobsService
    {
        IEnumerable<Job> GetMyJobs(List<string> queuePrefList);
        SqlDataReader MakeReader(SqlConnection conn, string procname, List<object> parameters, List<object> parameterValues);
        IEnumerable<Job> CallNewSnapUIProc(string procname, List<object> parameters, List<object> parameterValues);
        string MakePositionSuffix(int position);
    }
}