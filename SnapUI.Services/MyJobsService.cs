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

        public IEnumerable<Job> GetMyJobs()
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

            List<object> historyParameters = new List<object>() { "@StartDt", "@EndDt", "@QueueName", "@DevName" };
            List<object> historyParameterValues = new List<object>() { "2014/6/28", DateTime.Now, DBNull.Value, myAlias };
            var allJobs = CallProc("NewSnapUIProc", historyParameters, historyParameterValues);

            IEnumerable<Job> uniqueAllJobsOrdered = allJobs.Distinct().OrderByDescending(Job => Job.Submitdate);
            return uniqueAllJobsOrdered;
        }

        public IEnumerable<Job> CallProc(string procname, List<object> parameters, List<object> parameterValues)
        {
            var allJobs = new List<Job>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
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

                if (procname == "Snp.UI_GetCheckinDetails")
                {
                    //XmlReader xmlReader = command.ExecuteXmlReader();      

                    //while (xmlReader.Read())
                    XmlReaderSettings settings = new XmlReaderSettings();
                    settings.IgnoreWhitespace = true;
                    using (XmlReader xmlReader = command.ExecuteXmlReader())
                    {
                        string teststring = "teststrg";
                        string teststring2 = "teststrng 2";

                        xmlReader.ReadToFollowing("JOB");
                        XmlReader inner = xmlReader.ReadSubtree();
                        inner.ReadToDescendant("JobPk");
                        if (inner.ReadInnerXml() == "110342")
                        {
                            teststring2 = "inside 110342";
                            inner.ReadToFollowing("JOB_EVENT");
                            //while (true)
                            //{
                            inner.ReadToDescendant("EventDesc");
                            string eventDesc = inner.ReadInnerXml();
                            //inner.ReadToFollowing("State");
                            string state = inner.ReadInnerXml();

                            //inner.ReadToFollowing("EventDesc");
                            //eventDesc = inner.ReadInnerXml();
                            //inner.ReadToFollowing("State");
                            //state = inner.ReadInnerXml();

                            //if (state == "Aborted")
                            //{
                            teststring2 = state;
                            //break;
                            //}
                            //else
                            //    continue;
                            //}
                            //do
                            //{
                            //inner.ReadToFollowing("State");
                            //teststring2 = inner.GetAttribute("State");
                            //teststring2 = inner.ReadInnerXml();
                            //} while (inner.ReadToNextSibling("JOB_EVENT"));

                            //while (true)
                            //{
                            //    if (loop != 3)
                            //    {
                            //        inner.ReadToNextSibling("JOB_EVENT");
                            //        teststring2 = inner.GetAttribute("Build");
                            //    }
                            //    else break;
                            //    loop++;
                            //}
                            //inner = xmlReader.ReadSubtree();
                            //inner.ReadToDescendant("EventDesc");
                            //teststring = inner.ReadInnerXml();
                        }
                        inner.Close();

                        Job newJob = new Job
                        {
                            Checkid = 123,
                            Jobid = 123,
                            Dev = teststring,
                            Priority = teststring2
                        };
                        allJobs.Add(newJob);
                    }
                }

                else
                {
                    SqlDataReader reader = command.ExecuteReader();

                    int pendingPlace = 1;
                    while (reader.Read())
                    {

                        if (procname == "NewSnapUIProc")
                        {
                            int checkid = reader.GetInt32(0);
                            int jobid = reader.GetInt32(1);
                            string dev = reader.GetString(2);
                            string queue = reader.GetString(3);
                            DateTime submitdate = reader.GetDateTime(4);
                            string status = reader.GetString(5);
                            object placeorstatus = reader.GetValue(7);
                            Job newJob = new Job
                            {
                                Checkid = checkid,
                                Jobid = jobid,
                                Dev = dev,
                                Queue = queue,
                                Status = status,
                                Submitdate = submitdate,
                                Placeorstatus = placeorstatus
                            };
                            allJobs.Add(newJob);
                        }
                        if (procname == "Snp.GetPendingQueue")
                        {
                            int jobid = reader.GetInt32(0);
                            int checkid = Int32.Parse(reader.GetString(1));
                            string dev = reader.GetString(2);
                            string queue = reader.GetString(3);
                            string priority = reader.GetString(4);
                            string status = reader.GetString(5);
                            DateTime submitdate = Convert.ToDateTime(reader.GetString(6));
                            Job newJob = new Job
                            {
                                Checkid = checkid,
                                Jobid = jobid,
                                Dev = dev,
                                Queue = queue,
                                Priority = priority,
                                Status = status,
                                Submitdate = submitdate,
                                Placeorstatus = null
                            };
                            if (newJob.Status == "Pending")
                                newJob.Placeorstatus = pendingPlace++;

                            allJobs.Add(newJob);
                        }

                        else if (procname == "Snp.GetCheckinHist")
                        {
                            int checkid = Int32.Parse(reader.GetString(0));
                            int jobid = reader.GetInt32(1);
                            string dev = reader.GetString(2);
                            string queue = reader.GetString(3);
                            string priority = reader.GetString(4);
                            string status = reader.GetString(5);
                            DateTime submitdate = Convert.ToDateTime(reader.GetString(6));
                            Job newJob = new Job
                            {
                                Checkid = checkid,
                                Jobid = jobid,
                                Dev = dev,
                                Queue = queue,
                                Priority = priority,
                                Status = status,
                                Submitdate = submitdate,
                                Placeorstatus = null
                            };

                            allJobs.Add(newJob);
                        }
                    }
                }
            }
            return allJobs;
        }
    }
}


