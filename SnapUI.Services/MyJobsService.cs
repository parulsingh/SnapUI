using System;
using System.Collections;
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
using System.Diagnostics;

namespace SnapUI.Services
{
    public class MyJobsService : IMyJobsService
    {
        private readonly string _connectionString;
        private readonly List<string> _queueList;

        // Initializes an instance of the service before Web API Controller calls GetMyJobs
        public MyJobsService(List<string> queueList)
        {
            _connectionString = ConfigurationManager.ConnectionStrings["DbConnection"].ConnectionString;
            _queueList = queueList;
        }

        public static class Globals
        {
            // This dict is to keep checkinID details updated with its multiple job details
            // (i.e. we group details from each resubmit into their common changelist)
            public static Dictionary<int, ACheckin> CheckinDict = new Dictionary<int, ACheckin>();
        }

        // This method is called by Web API Controller
        public IEnumerable<Job> GetMyJobs()
        {
            var jobs = new List<Job>();

            // Defining the parameters going into the stored procedure "NewSnapUIProc"
            List<object> parameters = new List<object>() { "@StartDt", "@EndDt",
                "@QueueFilterOne", "@QueueFilterTwo", "@QueueFilterThree", "@QueueFilterFour", 
                "@QueueFilterFive", "@QueueFilterSix", "@QueueFilterSeven" };
            List<object> parameterValues = new List<object>() { DateTime.Now.AddDays(-7), DateTime.Now };
            foreach (var q in _queueList)
                parameterValues.Add(q);

            jobs.AddRange(GetJobsFromDB("NewSnapUIProc", parameters, parameterValues));
            IEnumerable<Job> uniqueJobsOrdered = jobs.Distinct().OrderByDescending(Job => Job.Submitdate);
            return uniqueJobsOrdered;
        }

        // This method is called by GetMyJobs (above)
        // It calls Reader (below) to read the data returned from SQL,
        // and for each job calls UpdateCheckin (below),
        // and finally calls UpdateAllJobs (below).
        public IEnumerable<Job> GetJobsFromDB(string procname, List<object> parameters, List<object> parameterValues)
        {
            List<Job> allJobs = new List<Job>() { };

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlDataReader reader = Reader(conn, procname, parameters, parameterValues);
                //conn.Open();                                            
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        int checkid = reader.GetInt32(0);
                        int jobid = reader.GetInt32(1);
                        string dev = reader.GetString(2);
                        string queue = reader.GetString(3);
                        int duration = reader.GetInt32(10);
                        string priority = reader.GetString(7);
                        DateTime submitdate = reader.GetDateTime(4);
                        string submitdateString = submitdate.ToShortDateString() + "  " + submitdate.ToShortTimeString();
                        string description = reader.GetString(8);
                        string[] split = description.Split();

                        // see below
                        Boolean runBVTfailure = false;

                        List<string> preBugId = new List<string>();
                        // If bugID exists in job description
                        if (Array.IndexOf(split, "BUG:") != -1)
                        {
                            int i = Array.IndexOf(split, "BUG:") + 1;
                            int n;
                            while (i < split.Length && int.TryParse(split[i], out n))
                            {
                                preBugId.Add(split[i]);
                                i++;
                            }
                        }

                        string status = reader.GetString(5);
                        string statusDetail = null;
                        string statusString = null;

                        // statusDetail is ABORTED TASK for Aborted jobs, and CURRENT TASK for jobs In Progress
                        if (status == "Aborted" || status == "In Progress")
                        {
                            if (reader.GetValue(9) != DBNull.Value)
                            {
                                statusDetail = (string)reader.GetValue(9);
                            }
                            else
                            {
                                statusDetail = "No current task";
                            }
                            statusString = status + ": " + statusDetail;

                            if (status == "Aborted" && statusDetail == "RunBVTs")
                            {
                                runBVTfailure = true;
                            }
                        }

                        // statusDetail is PLACE IN QUEUE for Pending jobs
                        else if (status == "Pending")
                        {
                            statusDetail = reader.GetInt32(6).ToString();
                            statusString = status + ": " + statusDetail + MakePositionSuffix(Int32.Parse(statusDetail)) + " in queue";
                        }

                        // No statusDetail for Completed jobs
                        else
                        {
                            statusString = status;
                        }

                        var statusList = new List<object>() { status, statusDetail };

                        // Populate an instance of Job class
                        Job newJob = new Job
                        {
                            Checkid = checkid,
                            Jobid = jobid,
                            Dev = dev,
                            Queue = queue,
                            Submitdate = submitdate,
                            SubmitdateString = submitdateString,
                            Description = description,
                            PreBugId = preBugId,
                            Status = statusList,
                            RunBVTfailure = runBVTfailure,
                            StatusString = statusString,
                            Priority = priority,
                            Duration = duration
                        };

                        allJobs.Add(newJob);

                        // Update checkin dictionary with the new job details                        
                        UpdateCheckin(newJob.Checkid, (string)newJob.Status[0], newJob.Duration);
                    }
                }

                // Update all the jobs with the latest info from CheckinDict                
                UpdateAllJobs(allJobs);
                return allJobs;
            }
        }

        // Update CheckinDict with the latest job details
        public void UpdateCheckin(int checkinId, string jobStatus, int jobDuration)
        {
            bool isCheckinCompleted;

            if (jobStatus == "Completed")
                isCheckinCompleted = true;
            else
                isCheckinCompleted = false;

            // This passes if checkinId is not in dictionary, i.e. if this job is the FIRST submit of the changelist
            try
            {
                Globals.CheckinDict.Add(checkinId, new ACheckin
                {
                    SubmitCount = 1,
                    IsCompleted = isCheckinCompleted,
                    Duration = jobDuration
                });
            }
            // We get here if checkinId has had previous jobs submitted (which aborted, leading to this resubmit)
            catch
            {
                ACheckin existingCheckin = Globals.CheckinDict[checkinId];

                Globals.CheckinDict[checkinId] = new ACheckin
                {
                    SubmitCount = existingCheckin.SubmitCount + 1,
                    IsCompleted = isCheckinCompleted,
                    Duration = existingCheckin.Duration + jobDuration
                };
            }
        }

        // Update every job with the details across their common checkinIDs (aka changelist)
        public void UpdateAllJobs(List<Job> allJobs)
        {
            foreach (var job in allJobs)
            {
                job.Attempts = Globals.CheckinDict[job.Checkid].SubmitCount;
                job.IsCompleted = Globals.CheckinDict[job.Checkid].IsCompleted;
                job.Dict = Globals.CheckinDict;
            }
        }


        // This method is called by CallNewSnapUIProc (above) to set up the SQL connection and reader
        public SqlDataReader Reader(SqlConnection conn, string procname, List<object> parameters, List<object> parameterValues)
        {
            var command = new SqlCommand
            {
                Connection = conn,
                CommandText = procname,
                CommandType = CommandType.StoredProcedure
            };

            // Add parameters to SqlCommand
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
            return reader;
        }

        // This appends suffixes to place in queue for Pending jobs (e.g. 1 becomes 1st, 2 becomes 2nd)
        public string MakePositionSuffix(int position)
        {
            int mod100 = position % 100;
            if (11 <= mod100 && mod100 <= 19)
                return "th";
            else
            {
                int unitplace = position % 10;
                switch (unitplace)
                {
                    case 1:
                        return "st";
                    case 2:
                        return "nd";
                    case 3:
                        return "rd";
                    case 0:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                        return "th";
                    default:
                        return null;
                }
            }
        }
    }
}