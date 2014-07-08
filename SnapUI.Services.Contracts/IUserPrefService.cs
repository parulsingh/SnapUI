using System.Collections.Generic;
using SnapUI.Common.Models;
using System.Data.SqlClient;

namespace SnapUI.Services.Contracts
{
    public interface IUserPrefService
    {
        void UpdateUserPref(List<string> queuePrefList);
        List<string> GetUserPref();
        SqlDataReader MakeReader(SqlConnection conn, string procname, List<object> parameters, List<object> parameterValues);
        string CallUserPrefProc(string procname, List<object> parameters, List<object> parameterValues);
    }
}