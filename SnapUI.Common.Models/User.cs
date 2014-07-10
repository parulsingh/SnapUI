using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnapUI.Common.Models
{
    public class User    
    {
        public string DevNm { get; set; }
        public int MadePreference { get; set; }
        public List<string> Queues { get; set; }

    }
}