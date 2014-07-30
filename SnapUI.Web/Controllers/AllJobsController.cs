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
using System.Runtime.Caching;
using System.IO;

namespace SnapUI.Web.Controllers
{
    [Authorize]
    public class AllJobsController : ApiController
    {
        private readonly IMyJobsService _allJobsService;
        public string alias;
        public List<string> _queueList;
        public List<string> _managerList;
        public List<Manager> _managers = new List<Manager>();
        public AllJobsController()
        {
            // Getting login info using Windows Authentication
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

            // Creating queue list, which is defined in Web.Config
            string queueListString = ConfigurationManager.AppSettings["Queues"];
            _queueList = queueListString.Split(new char[] { ',' }).ToList();

            // Creating manager list for, which is defined in Web.Config
            _managerList = ConfigurationManager.AppSettings["Managers"].Split(new char[] { ',' }).ToList();
            for (int i = 0; i < _managerList.Count; i++)
            {
                _managers.Add(new Manager(_managerList[i], ConfigurationManager.AppSettings[_managerList[i]].Split(new char[] { ',' }).ToList()));
            }

            // Creating an instance of the service (which calls the proc)
            _allJobsService = new MyJobsService(_queueList);
        }

        public object[] GetAllJobs()
        {
            ObjectCache cache = MemoryCache.Default;
            var jobs = cache.Get("Jobs") as IEnumerable<Job>;

            if (jobs != null)
            {
                return new object[] { jobs, _queueList };
            }
            else
            {
                jobs = _allJobsService.GetMyJobs();
                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(1) };
                cache.Add("Jobs", jobs, policy);
                return new object[] { jobs, _queueList };
            }
        }
    }
}