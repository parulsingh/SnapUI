﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnapUI.Common.Models
{
    public class Job : IEquatable<Job>
    {
        public int Jobid { get; set; }
        public Dictionary<int, ACheckin> Dict { get; set; }
        public int Checkid { get; set; }
        public string Dev { get; set; }
        public string Queue { get; set; }
        public DateTime Submitdate { get; set; }
        public string SubmitdateString { get; set; }
        public List<object> Status { get; set; }
        public string StatusString { get; set; }
        public string Priority { get; set; }
        public object Placeorstatus { get; set; }
        public Boolean RunBVTfailure { get; set; }
        public List<string> PreBugId { get; set; }
        //public int PostBugId { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; }
        public int Attempts { get; set; }
        public bool IsCompleted { get; set; }

        public bool Equals(Job other)
        {
            if (other == null) return false;
            else return this.Jobid.Equals(other.Jobid);
        }

        public override int GetHashCode()
        {
            return this.Jobid.GetHashCode();
        }
    }
}