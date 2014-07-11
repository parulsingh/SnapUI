using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnapUI.Common.Models
{
    public class Job : IEquatable<Job>
    //public class Job
    {
        public int Jobid { get; set; }
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