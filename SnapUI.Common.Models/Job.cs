using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnapUI.Common.Models
{
    public class Job
    {
        public int Jobid { get; set; }
        public int Checkid { get; set; }
        public string Dev { get; set; }
        public string Queue { get; set; }
        public string Status { get; set; }

        public string Priority { get; set; }
        public object Submitdate { get; set; }
        public object currentUser { get; set; }

    }
}