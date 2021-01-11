using System.Web.Http;
using Newtonsoft.Json;

namespace BookmarkBrowser.API
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.EnableCors();
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "MainAPI",
                routeTemplate: "api/bookmark",
                defaults: new { controller = "SiteApi" }
            );

            config.Formatters.JsonFormatter.SerializerSettings = new JsonSerializerSettings {
                NullValueHandling = NullValueHandling.Ignore
            };
        }
    }
}
