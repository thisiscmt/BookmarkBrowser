using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Mvc;
using System.Web.Http;
using System.Web.Routing;

namespace BookmarkBrowser
{
    public class Global : System.Web.HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            //BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        void Application_End(object sender, EventArgs e)
        {
        }

        void Application_Error(object sender, EventArgs e)
        {
            string url;

            try
            {
                var ex = Server.GetLastError();
                HttpContext.Current.Session["CurrentException"] = ex;

                if (ex is HttpRequestValidationException)
                {
                    url = "~/Errors/Error.aspx?Type=1";
                }
                else
                {
                    url = "~/Errors/Error.aspx";
                }

                Response.Redirect(url, false);
            }
            catch
            {
            }
        }

        void Session_Start(object sender, EventArgs e)
        {
        }

        void Session_End(object sender, EventArgs e)
        {
        }
    }
}
