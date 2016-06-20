using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Text;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using FxSyncNet;
using BookmarkBrowser.Api.Models;
using BookmarkBrowser.Entities;
using BookmarkBrowser.Api.Attributes;

namespace BookmarkBrowser.Api.Controllers
{
    public class SiteApiController : ApiController
    {
        // GET api/test
        //[HttpGet]
        //public ResultViewModel ApiTest()
        //{
        //    ResultViewModel result = new ResultViewModel();
        //    result.Content = "Welcome to the bookmark browser API";

        //    return result;
        //}

        // GET api/{collection}
        [HttpGet]
        [Route("api/{collection}")]
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

        // POST api/{collection}
        //[HttpPost]
        //public ResultViewModel AddData(string collection, [FromBody]string data)
        //{
        //    ResultViewModel result = new ResultViewModel();
        //    result.Content = "Under development";
            
        //    return result;
        //}

        // GET api/{collection}/backup
        [HttpGet]
        [BackupManagementAuthorize]
        [Route("api/{collection}/backup")]
        public ResultViewModel GetBackup()
        {
            ResultViewModel result = new ResultViewModel();
            var parms = Request.RequestUri.ParseQueryString();
            string dirPath = HttpContext.Current.Request.MapPath("/") + "Backup";
            List<System.IO.FileInfo> files;
            System.IO.DirectoryInfo dir;

            try
            {
                if (parms["username"] == null || parms["password"] == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(
                        HttpStatusCode.BadRequest, 
                        "You must supply Sync credentials"));
                }

                if (System.IO.Directory.Exists(dirPath))
                {
                    dir = new System.IO.DirectoryInfo(dirPath);
                    files = dir.EnumerateFiles("Bookmarks_" + parms["username"] + ".json", System.IO.SearchOption.TopDirectoryOnly).ToList();

                    if (files != null && files.Count > 0)
                    {
                        result.Content = System.IO.File.ReadAllText(files.First().FullName, Encoding.UTF8);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(
                    HttpStatusCode.InternalServerError, 
                    ex.Message));
            }

            return result;
        }

        // POST api/{collection}/backup
        [HttpPost]
        [Route("api/{collection}/backup")]
        [BackupManagementAuthorize]
        public ResultViewModel AddBackup(string collection, [FromBody]JToken data)
        {
            ResultViewModel result = new ResultViewModel();
            string filePath;
            string dirPath;

            try
            {
                var parms = Request.RequestUri.ParseQueryString();

                if (parms["username"] == null || parms["password"] == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(
                        HttpStatusCode.BadRequest, 
                        "You must supply Sync credentials"));
                }
                
                if (data == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(
                        HttpStatusCode.BadRequest, 
                        "No data provided to back up"));
                }

                filePath = HttpContext.Current.Request.MapPath("/") + "Backup\\Bookmarks_" + parms["username"] + ".json";
                dirPath = System.IO.Path.GetDirectoryName(filePath);

                if (!System.IO.Directory.Exists(dirPath))
                {
                    System.IO.Directory.CreateDirectory(dirPath);
                }

                System.IO.File.WriteAllText(filePath, data.ToString(), Encoding.UTF8);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(
                    HttpStatusCode.InternalServerError, 
                    ex.Message));
            }

            return null;
        }
    }
}
