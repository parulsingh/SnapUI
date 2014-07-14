using System.Collections.Generic;
using System.Web.Http;
using SnapUI.Common.Models;
using SnapUI.Services;
using SnapUI.Services.Contracts;
using System;
using System.Web;


    namespace System.Windows.Forms
    {
        public class AllOrgsController : ApiController
        {
            public AllOrgsController() { }

            public string[] GetAllOrgs(string alias)
            {
                
                string[] lines = System.IO.File.ReadAllLines(HttpContext.Current.Server.MapPath("\\DirectReports.txt"));
                int i = Array.IndexOf(lines, alias);
                string[] directReports = null;
                if (i != -1)
                {
                    directReports = lines[i + 1].Split();
                }
                return directReports;
            }

        }
    }
