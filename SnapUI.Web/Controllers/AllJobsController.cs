using System.Collections.Generic;
using System.Web.Http;
using SnapUI.Common.Models;
using SnapUI.Services;
using SnapUI.Services.Contracts;
using System;
using System.Collections;
using System.Diagnostics;
using System.Configuration;

using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Xml;
using System.Xml.XPath;

namespace SnapUI.Web.Controllers
{
    [Authorize]
    public class AllJobsController : ApiController
    {
        private readonly IMyJobsService _allJobsService;
        public string alias;
        public List<string> _queueList;
        public AllJobsController()
        {
            if (User.Identity.IsAuthenticated)
            {
                string user = User.Identity.Name;
                String[] domainAlias = user.Split('\\');
                alias = domainAlias[1];
            }
            else
            {
                alias = "unknown";
            }

            _allJobsService = new MyJobsService("null");
            string queueListString = ConfigurationManager.AppSettings["Queues"];
            //Debug.WriteLine(queueListString);
            _queueList = queueListString.Split(new char[] { ',' }).ToList();
        }

        public object[] GetAllJobs()
        {
            
            IEnumerable<Job> jobs = _allJobsService.GetMyJobs(_queueList);
            return new object[] { jobs, _queueList };

        }
    }
}