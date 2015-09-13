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
                name: "MainApiTest",
                routeTemplate: "api/test",
                defaults: new { controller = "SiteAPI" }
            );

            config.Routes.MapHttpRoute(
                name: "MainApi",
                routeTemplate: "api/{collection}",
                defaults: new { controller = "SiteAPI" }
            );

            config.Routes.MapHttpRoute(
                name: "MainApiCreate",
                routeTemplate: "api/{collection}/create",
                defaults: new { controller = "SiteAPI" }
            );
        }
    }
}
