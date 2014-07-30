using System;
using System.Collections.Generic;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnapUI.Common.Models
{
    public class ACheckin
    {
        public int SubmitCount { get; set; }
        public bool IsCompleted { get; set; }
        public int Duration { get; set; }
    }
}
