﻿using System.Collections.Generic;
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
            _queueList = queueListString.Split(new char[] { ',' }).ToList();
            _managerList = ConfigurationManager.AppSettings["Managers"].Split(new char[] { ',' }).ToList();
            for (int i = 0; i < _managerList.Count; i++)
            {
                _managers.Add(new Manager(_managerList[i], ConfigurationManager.AppSettings[_managerList[i]].Split(new char[] { ',' }).ToList()));

            }
        }

        public object[] GetAllJobs()
        {
            ObjectCache cache = MemoryCache.Default;
            var jobs = cache.Get("Jobs") as IEnumerable<Job>;

            if (jobs != null)
            {
                Debug.WriteLine("there was cache");
                return new object[] { jobs, _queueList };
            }
            else
            {
                Debug.WriteLine("there was no cache");
                jobs = _allJobsService.GetMyJobs(_queueList);
                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(1) };
                cache.Add("Jobs", jobs, policy);
                return new object[] { jobs, _queueList };
            }
            //IEnumerable<Job> jobs = _allJobsService.GetMyJobs(_queueList);
            //return new object[] { jobs, _queueList, _managers, _managerList };
        }
    }
}