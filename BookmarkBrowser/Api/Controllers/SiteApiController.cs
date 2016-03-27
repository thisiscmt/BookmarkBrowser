using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using BookmarkBrowser.Api.Models;
using BookmarkBrowser.Entities;
using FxSyncNet;

namespace BookmarkBrowser.Api.Controllers
{
    public class SiteApiController : ApiController
    {
        // GET api/test
        [HttpGet]
        public ResultViewModel ApiTest()
        {
            ResultViewModel result = new ResultViewModel();
            result.Content = "Welcome to the bookmark browser API";

            return result;
        }

        // GET api/{collection}
        [HttpGet]
        public ResultViewModel GetData(string collection)
        {
            ResultViewModel result = new ResultViewModel();
            var parms = Request.RequestUri.ParseQueryString();
            int count;

            if (parms["username"] == null || parms["password"] == null)
            {
                throw new HttpResponseException(Request.CreateResponse(
                    HttpStatusCode.BadRequest, 
                    "You must supply Sync credentials"));
            }

            FxSyncNet.SyncClient syncClient = new FxSyncNet.SyncClient();

            switch (collection.ToLower())
            {
                case "bookmark":
                    try
                    {
                        syncClient.SignIn(parms["username"], parms["password"]);

                        IEnumerable<FxSyncNet.Models.Bookmark> bookmarks = syncClient.GetBookmarks();
                        Directory mainDir = Utility.BuildBookmarks(bookmarks);
                        count = bookmarks.Where(x => x.Type == FxSyncNet.Models.BookmarkType.Bookmark).Count();
                        mainDir.Tag = count.ToString();
                        result.Content = JsonConvert.SerializeObject(mainDir);
                    }
                    catch (ServiceNotAvailableException ex)
                    {
                        throw new HttpResponseException(Request.CreateResponse(
                            HttpStatusCode.GatewayTimeout, 
                            Utility.GetExceptionMessage(ex)));
                    }
                    catch (InvalidOperationException ex)
                    {
                        throw new HttpResponseException(Request.CreateResponse(
                            HttpStatusCode.BadRequest, 
                            Utility.GetExceptionMessage(ex)));
                    }
                    catch (AuthenticationException ex)
                    {
                        throw new HttpResponseException(Request.CreateResponse(
                            HttpStatusCode.BadRequest, 
                            Utility.GetExceptionMessage(ex)));
                    }
                    catch (Exception ex)
                    {
                        throw new HttpResponseException(Request.CreateResponse(
                            HttpStatusCode.BadRequest, 
                            Utility.GetExceptionMessage(ex)));
                    }

                    break;
                default:
                    throw new HttpResponseException(Request.CreateResponse(
                        HttpStatusCode.BadRequest, 
                        "Unsupported collection type"));
            }
            
            return result;
        }

        // POST api/{collection}/create
        [HttpPost]
        public ResultViewModel AddData(string collection, [FromBody]string value)
        {
            ResultViewModel result = new ResultViewModel();
            result.Content = "Under development";
            
            return result;
        }    
    }
}
