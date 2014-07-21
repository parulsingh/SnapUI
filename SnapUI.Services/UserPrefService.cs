using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SnapUI.Common.Models;
using SnapUI.Services.Contracts;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Xml;
using System.Xml.XPath;

namespace SnapUI.Services
{
    public class UserPrefService : IUserPrefService
    {
        private readonly string _connectionString;
        object myAlias;

        public UserPrefService(string alias)
        {
            myAlias = alias;
            _connectionString = ConfigurationManager.ConnectionStrings["DbConnection"].ConnectionString;
        }

        public void UpdateUserPref(List<string> newQueuePrefList)
        {
            string newQueuePrefString = string.Join(",", newQueuePrefList);

            List<object> userPrefParameters = new List<object>() { "@DevNm", "@Queues" };
            List<object> userPrefParameterValues = new List<object>() { myAlias, newQueuePrefString };
            CallUserPrefProc("NewSnapUIGetUserPref", userPrefParameters, userPrefParameterValues);            
        }

        public List<string> GetUserPref()
        {
            List<object> userPrefParameters = new List<object>() { "@DevNm" };
            List<object> userPrefParameterValues = new List<object>() { myAlias };
            string queuePrefString = CallUserPrefProc("NewSnapUIGetUserPref", userPrefParameters, userPrefParameterValues);
            List<string> queuePrefList = queuePrefString.Split(new char[] { ',' }).ToList();
            return queuePrefList;
        }

        public SqlDataReader MakeReader(SqlConnection conn, string procname, List<object> parameters, List<object> parameterValues)
        {
            var command = new SqlCommand
            {
                Connection = conn,
                CommandText = procname,
                CommandType = CommandType.StoredProcedure
            };

            // count # of parameters
            IEnumerable<int> parameterCount = Enumerable.Range(0, parameters.Count());
            //set each parameter in List parameters to List parameterValues
            foreach (int i in parameterCount)
            {
                var newParameter = new SqlParameter
                {
                    ParameterName = parameters[i].ToString(),
                    Direction = ParameterDirection.Input,
                    Value = parameterValues[i]
                };
                command.Parameters.Add(newParameter);
            }
            conn.Open();
            SqlDataReader reader = command.ExecuteReader();
            return reader;
        }

        public string CallUserPrefProc(string procname, List<object> parameters, List<object> parameterValues)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string queuePrefString = null;

                SqlDataReader reader = MakeReader(conn, procname, parameters, parameterValues);
                //conn.Open();
                while (reader.Read())
                {
                    queuePrefString = reader.GetString(2);                    
                };
                return queuePrefString;
            }
        }
    }
}