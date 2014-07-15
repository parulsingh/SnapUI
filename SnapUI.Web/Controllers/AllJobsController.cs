﻿using System.Collections.Generic;
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
        private readonly IUserPrefService _userPrefService;
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
        }

        public IEnumerable<Job> GetAllJobs()
        {
            //List<string> userPrefList = _userPrefService.GetUserPref();
            return _allJobsService.GetMyJobs(new List<string>() { "intune_dev_office", "intune_dev_office_test", "JupiterSnapVM5", "Sandbox4" });
        }
    }
}