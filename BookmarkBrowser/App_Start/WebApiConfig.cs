using BookmarkBrowser.Api.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace BookmarkBrowser
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "MainApi",
                routeTemplate: "api/{collection}",
                defaults: new { controller = "SiteAPI" }
            );

            config.Routes.MapHttpRoute(
                name: "MainApiBackup",
                routeTemplate: "api/{collection}/backup",
                defaults: new { controller = "SiteAPI" }
            );

            config.Filters.Add(new BackupManagementAuthorizeAttribute());
        }
    }
}
