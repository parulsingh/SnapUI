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
    public class MyJobsController : ApiController
    {
        private readonly IMyJobsService _myJobsService;
        public string alias;
        public List<string> _queueList;
        public MyJobsController()
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

            // Creating an instance of the service (which calls the proc)
            _myJobsService = new MyJobsService(_queueList);
        }

        public object[] GetAllJobs()
        {
            ObjectCache cache = MemoryCache.Default;
            var jobs = cache.Get("Jobs") as IEnumerable<Job>;
            IEnumerable<Job> filteredJobs = new List<Job>() { };

            if (jobs != null)
            {
                filteredJobs = jobs.Where(Job => Job.Dev == alias);
                foreach (var item in filteredJobs)
                    Debug.Write(item.Dev);
                return new object[] { filteredJobs, _queueList };
            }
            else
            {
                jobs = _myJobsService.GetMyJobs();
                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(1) };
                cache.Add("Jobs", jobs, policy);

                filteredJobs = jobs.Where(Job => Job.Dev == alias);
                foreach (var item in filteredJobs)
                    Debug.Write(item.Dev);
                return new object[] { filteredJobs, _queueList };
            }
        }        
    }
}