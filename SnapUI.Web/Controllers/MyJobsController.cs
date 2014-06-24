using System.Collections.Generic;
using System.Web.Http;
using SnapUI.Common.Models;
using SnapUI.Services;
using SnapUI.Services.Contracts;
using System;

namespace SnapUI.Web.Controllers
{
    [Authorize]
    public class MyJobsController : ApiController
    {
        private readonly IMyJobsService _myJobsService;
        public string alias;

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

            _myJobsService = new MyJobsService(alias);

        }

        public IEnumerable<Job> GetMyJobs()
        {
            return _myJobsService.GetMyJobs();
        }
    }
}
