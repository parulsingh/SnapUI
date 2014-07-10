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
    public class MyJobsService : IMyJobsService
    {
        private readonly string _connectionString;
        object myAlias;

        public MyJobsService(string alias)
        {
            if (alias == "null")
                myAlias = DBNull.Value;
            else
                myAlias = alias;
            _connectionString = ConfigurationManager.ConnectionStrings["DbConnection"].ConnectionString;
        }

        public IEnumerable<Job> GetMyJobs(List<string> queuePrefList)
        {
            //List<string> allQueuesList = new List<string>() {
            //    "CAS", "CMPreCacheWorkflow", "CMPreCacheWorkflow_test",
            //    "InfraSandbox01", "InfraSandbox02", "intune_ctip1", "intune_ctip1_test",
            //    "intune_dev_infra", "intune_dev_office", "intune_dev_office_test", 
            //    "intune_dev_test", "intune_dev_wcs", "intune_dev_wcs_test",
            //    "intune_rel", "intune_rel_prod", "intune_rel_prod_live", "intune_rel_prod_live_test",
            //    "intune_rel_prod_test", "intune_rel_test", "intune_tools_vnext", "IntuneTools",              
            //    "JupiterSnapILDC1", "JupiterSnapMobileTest", "JupiterSnapMobileTest2",
            //    "JupiterSnapVM3", "JupiterSnapVM5", "JupiterSnapVM7",
            //    "Sandbox3", "Sandbox4", "Sandbox5",
            //    "SCCM_Office", "SccmMain", "SccmTest", "SCCM-WEH2-CVP",
            //    //"TestSSDBulidMachine_intune_rel_prod"
            //};

            //var allJobs = new List<Job>();

            //var jobs_getCheckinHist = CallProc(
            //    "Snp.GetCheckinHist",
            //    new List<object>() { "@DevNm", "@Number", "@QueueId" },
            //    new List<object>() { myAlias, "20", DBNull.Value }
            //    );
            //allJobs.AddRange(jobs_getCheckinHist);

            //foreach (var queue in allQueuesList)
            //{
            //    var jobs_getPendingQueue = CallProc(
            //        "Snp.GetPendingQueue",
            //        new List<object>() { "@ProjectNm" },
            //        new List<object>() { queue }
            //        );
            //    if (myAlias == DBNull.Value)
            //        allJobs.AddRange(jobs_getPendingQueue);
            //    else
            //        allJobs.AddRange(jobs_getPendingQueue.Where(Job => Job.Dev == (string)myAlias));
            //}

            //var tempJobs = CallProc(
            //    "Snp.UI_GetCheckinDetails",
            //    new List<object>() { "@CheckinId" },
            //    new List<object>() { 86215 }
            //);
            //allJobs.AddRange(tempJobs);

            //object queue = DBNull.Value;

            //if (myAlias != DBNull.Value)
            //{
            //    IUserPrefService _userPrefService = new UserPrefService((string)myAlias);
                
            //    var temp = new List<string>(){ "intune_dev_office", "JupiterSnapVM5" };

            //    _userPrefService.UpdateUserPref(temp);

            //    var queuePrefList = _userPrefService.GetUserPref();                 
            //    queue = queuePrefList.First();
            //}                

            var allJobs = new List<Job>();
            foreach (var queue in queuePrefList)
            {
                List<object> historyParameters = new List<object>() { "@StartDt", "@EndDt", "@QueueName", "@DevName" };
                List<object> historyParameterValues = new List<object>() { DateTime.Now.AddDays(-7), DateTime.Now, queue, myAlias };
                var allJobsFromQueue = CallNewSnapUIProc("NewSnapUIProc", historyParameters, historyParameterValues);
                allJobs.AddRange(allJobsFromQueue);
            }

            IEnumerable<Job> uniqueAllJobsOrdered = allJobs.Distinct().OrderByDescending(Job => Job.Submitdate);
            return uniqueAllJobsOrdered;
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

        public IEnumerable<string> CallUserPrefProc(string procname, List<object> parameters, List<object> parameterValues)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                var queuePrefList = new List<string>();

                SqlDataReader reader = MakeReader(conn, procname, parameters, parameterValues);
                //conn.Open();
                while (reader.Read())
                {
                    string queuePrefString = reader.GetString(2);
                    queuePrefList.Add(queuePrefString);
                };                
                return queuePrefList;
            }
        }

        public IEnumerable<Job> CallNewSnapUIProc(string procname, List<object> parameters, List<object> parameterValues)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                var allJobs = new List<Job>();
                
                SqlDataReader reader = MakeReader(conn, procname, parameters, parameterValues);                
                //conn.Open();                                            
                while (reader.Read())
                {                   
                    int checkid = reader.GetInt32(0);
                    int jobid = reader.GetInt32(1);
                    string dev = reader.GetString(2);
                    string queue = reader.GetString(3);
                    DateTime submitdate = reader.GetDateTime(4);
                    string status = reader.GetString(5);
                    string task = null;
                    if (status == "Aborted")
                    {
                        task = reader.GetString(8);
                    }
                    string priority = reader.GetString(6);
                    Job newJob = new Job
                    {
                        Checkid = checkid,
                        Jobid = jobid,
                        Dev = dev,
                        Queue = queue,
                        Submitdate = submitdate,
                        Status = new List<string>() { status, task },
                        Priority = priority
                    };
                    allJobs.Add(newJob);                    
                }
                return allJobs;             
            }                                
        }
    }
}


//int pendingPlace = 1;
//if (procname == "Snp.GetPendingQueue")
//{
//    int jobid = reader.GetInt32(0);
//    int checkid = Int32.Parse(reader.GetString(1));
//    string dev = reader.GetString(2);
//    string queue = reader.GetString(3);
//    string priority = reader.GetString(4);
//    string status = reader.GetString(5);
//    DateTime submitdate = Convert.ToDateTime(reader.GetString(6));
//    Job newJob = new Job
//    {
//        Checkid = checkid,
//        Jobid = jobid,
//        Dev = dev,
//        Queue = queue,
//        Priority = priority,
//        Status = status,
//        Submitdate = submitdate,
//        Placeorstatus = null
//    };
//    if (newJob.Status == "Pending")
//        newJob.Placeorstatus = pendingPlace++;
//    allJobs.Add(newJob);
//}

//else if (procname == "Snp.GetCheckinHist")
//{
//    int checkid = Int32.Parse(reader.GetString(0));
//    int jobid = reader.GetInt32(1);
//    string dev = reader.GetString(2);
//    string queue = reader.GetString(3);
//    string priority = reader.GetString(4);
//    string status = reader.GetString(5);
//    DateTime submitdate = Convert.ToDateTime(reader.GetString(6));
//    Job newJob = new Job
//    {
//        Checkid = checkid,
//        Jobid = jobid,
//        Dev = dev,
//        Queue = queue,
//        Priority = priority,
//        Status = status,
//        Submitdate = submitdate,
//        Placeorstatus = null
//    };
//    allJobs.Add(newJob);
//}