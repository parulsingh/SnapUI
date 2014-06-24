using System.Collections.Generic;
using System.Web.Http;
using SnapUI.Common.Models;
using SnapUI.Services;
using SnapUI.Services.Contracts;
using System;

namespace SnapUI.Web.Controllers
{
    [Authorize]
    public class AllJobsController : ApiController
    {
        private readonly IMyJobsService _allJobsService;

        public AllJobsController()
        {

            _allJobsService = new MyJobsService("null");

        }

        public IEnumerable<Job> GetAllJobs()
        {
            return _allJobsService.GetMyJobs();
        }
    }
}
