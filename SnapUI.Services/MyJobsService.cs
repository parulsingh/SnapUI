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

namespace SnapUI.Services
{
    public class MyJobsService : IMyJobsService
    {
        private readonly string _connectionString;
        string myAlias;

        public MyJobsService(string alias)
        {
            myAlias = alias;
            _connectionString = ConfigurationManager.ConnectionStrings["DbConnection"].ConnectionString;
        }

        public IEnumerable<Job> getMyJobs()
        {
            List<string> allQueuesList = new List<string>() { "cas", "cmprecacheworkflow", "cmprecacheworkflow_test",
                "infrasandbox01", "infrasandbox02", "intune_ctip1", "intune_ctip1_test",
                "intune_dev_infra", "intune_dev_office", "intune_dev_office_test", 
                "intune_dev_test", "intune_dev_wcs", "intune_dev_wcs_test",
                "intune_rel", "intune_rel_prod", "intune_rel_prod_live", "intune_rel_prod_live_test",
                "intune_rel_prod_test", "intune_rel_test", "intune_tools_vnext", "intunetools",              
                "jupitersnapildc1", "jupitersnapmobiletest", "jupitersnapmobiletest2", "jupitersnapvm3",
                "jupitersnapvm5", "jupitersnapvm7", "sandbox3", "sandbox4", "sandbox5",
                "sccm_office", "sccmmain", "sccmtest", "sccm-weh2-cvp",
                "testssdbulidmachine_intune_rel_prod" };

            var allJobs = new List<Job>();
            List<object> getCheckinHistParameters = new List<object>() { "@DevNm", "@Number", "@QueueId" };
            List<object> getCheckinHistParameterValues = new List<object>() { myAlias, "50", DBNull.Value };

            //foreach (string queue in allQueuesList)
            //{
            //getCheckinHistParameterValues[2] = queue;
            var allJobsPerQueue = CallProc("Snp.GetCheckinHist", getCheckinHistParameters, getCheckinHistParameterValues);
            allJobs.AddRange(allJobsPerQueue);
            //}

            return allJobs.OrderByDescending(job => job.Submitdate);

            //List<string> historyParameters = new List<string>() { "@StartDt", "@EndDt", "@QueueName" };
            //List<string> historyParameterValues = new List<string>() { "6/19/2014", DateTime.Now.ToString(), "intune_dev_office" };
            //var alljobs1 = CallProc("uspGetJobHistoryByQueue", historyParameters, historyParameterValues);
            //return alljobs1.OrderBy(job => job.Submitdate);

            //List<string> pendingParameters = new List<string>() { "@ProjectNm" };
            //List<string> pendingParameterValues = new List<string>() { "intune_dev_office" };
            //var alljobs2 = CallProc("Snp.GetPendingQueue", pendingParameters, pendingParameterValues);

            //return alljobs1.Union(alljobs2).OrderBy(job => job.Checkid);
            //return alljobs;
        }

        public List<Job> CallProc(string procname, List<object> parameters, List<object> parameterValues)
        {
            var alljobs = new List<Job>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                var command = new SqlCommand
                {
                    Connection = conn,
                    CommandText = procname,
                    CommandType = CommandType.StoredProcedure
                };

                // count # of parameters, and set each parameter in "List<string> parameters" to a value in "List<string> parametersvalues"
                IEnumerable<int> parameterCount = Enumerable.Range(0, parameters.Count());
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

                while (reader.Read())
                {
                    //int jobid = reader.GetInt32(0);
                    //string dev = reader.GetString(2);
                    //string queue = reader.GetString(3);
                    //if (procname == "uspGetJobHistoryByQueue")
                    //{
                    //    int checkid = reader.GetInt32(1);
                    //    DateTime submitdate = reader.GetDateTime(6);
                    //    string status = reader.GetString(9);
                    //    alljobs.Add(new Job { Jobid = jobid, Checkid = checkid, Dev = dev, Queue = queue, Submitdate = submitdate, Status = status });
                    //}
                    //else if (procname == "Snp.GetPendingQueue")
                    //{
                    //    int checkid = Int32.Parse(reader.GetString(1));
                    //    DateTime submitdate = Convert.ToDateTime(reader.GetString(6));
                    //    string status = reader.GetString(5);
                    //    alljobs.Add(new Job { Jobid = jobid, Checkid = checkid, Dev = dev, Queue = queue, Submitdate = submitdate, Status = status });
                    //}
                    if (procname == "Snp.GetCheckinHist")
                    {
                        int checkid = Int32.Parse(reader.GetString(0));
                        int jobid = reader.GetInt32(1);
                        string dev = reader.GetString(2);
                        string queue = reader.GetString(3);
                        string priority = reader.GetString(4);
                        string status = reader.GetString(5);
                        DateTime submitdate = Convert.ToDateTime(reader.GetString(6));
                        alljobs.Add(new Job { Checkid = checkid, Jobid = jobid, Dev = dev, Queue = queue, Priority = priority, Status = status, Submitdate = submitdate, currentUser = myAlias });
                    }
                }
            }
            return alljobs;
        }
    }
}


