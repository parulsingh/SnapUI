using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnapUI.Common.Models
{
    public class Manager
    {
        public string Name;
        public List<string> Reports;
        public Manager (string name, List<string> reports)
        {
            Name = name;
            Reports = reports;
        }
    }
}
