using System.Web.Http;

[assembly: WebActivator.PreApplicationStartMethod(
    typeof(Notepad.Web.App_Start.WebApiConfig), "RegisterApi")]

namespace Notepad.Web.App_Start
{
    public class WebApiConfig
    {

        public static void RegisterApi()
        {
            GlobalConfiguration.Configuration.Routes.MapHttpRoute("API Default",
                "api/{controller}/{id}",
                new { id = RouteParameter.Optional });
        }
    }
}