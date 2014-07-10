using System.Collections.Generic;
using System.Web.Http;
using SnapUI.Common.Models;
using SnapUI.Services;
using SnapUI.Services.Contracts;
using System;

namespace SnapUI.Web.Controllers
{
    [Authorize]
    public class UserPrefController : ApiController
    {
        private readonly IUserPrefService _preferencesService;
        public string alias;
        public UserPrefController()
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

            _preferencesService = new UserPrefService(alias);

        }
    }
}
