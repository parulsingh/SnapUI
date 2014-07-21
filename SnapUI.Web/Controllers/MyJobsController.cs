
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
    public class MyJobsController : ApiController
    {
        private readonly IMyJobsService _myJobsService;
        //private readonly IUserPrefService _userPrefService;
        public string alias;
        public List<string> _queueList;
        public MyJobsController()
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


            //_userPrefService = new UserPrefService(alias);
            _myJobsService = new MyJobsService(alias);
            string queueListString = ConfigurationManager.AppSettings["Queues"];
            Debug.WriteLine(queueListString);
            _queueList = queueListString.Split(new char[] { ',' }).ToList();
        }

        public object[] GetAllJobs()
        {
            IEnumerable<Job> jobs = _myJobsService.GetMyJobs(_queueList);
            return new object[] { jobs, _queueList };
        }
    }
}