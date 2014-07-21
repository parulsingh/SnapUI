using System.Collections.Generic;
using System.Web.Http;
using SnapUI.Common.Models;
using SnapUI.Services;
using SnapUI.Services.Contracts;
using System;
using System.Diagnostics;

namespace SnapUI.Web.Controllers
{
    [Authorize]
    public class AllJobsController : ApiController
    {
        private readonly IMyJobsService _allJobsService;
        //private readonly IUserPrefService _userPrefService;
        private readonly IGetQueueService _getQueueService;
        public string alias;

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

            //_userPrefService = new UserPrefService(alias);
            _allJobsService = new MyJobsService("null");
            _getQueueService = new GetQueueService();
        }

        public IEnumerable<Job> GetAllJobs()
        {
            List<string> queueList = new List<string>();
            queueList = _getQueueService.GetQueues();
            //foreach (string queue in queueList)
            //{
            //    Debug.WriteLine(queue);
            //}
            //List<string> userPrefList = _userPrefService.GetUserPref();
            return _allJobsService.GetMyJobs(new List<string>() { "intune_dev_office", "intune_dev_office_test", "JupiterSnapVM5", "Sandbox4", "SCCM_Office", "SccmMain", "SCCM-WEH2-CVP" });
        }
    }
}