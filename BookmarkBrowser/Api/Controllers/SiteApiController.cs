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
        #region Public methods

        // GET api/{collection}
        [HttpGet]
        [Route("api/{collection}")]
        public ResultViewModel GetData(string collection)
        {
            ResultViewModel result = new ResultViewModel();
            Directory mainDir;
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
                        mainDir = Utility.BuildBookmarks(bookmarks);
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
        [Route("api/{collection}/backup")]
        public ResultViewModel GetBackup()
        {
            ResultViewModel result = new ResultViewModel();
            var parms = Request.RequestUri.ParseQueryString();
            string filePath;

            if (parms["username"] == null || parms["password"] == null)
            {
                throw new HttpResponseException(Request.CreateResponse(
                    HttpStatusCode.BadRequest, 
                    "You must supply Sync credentials"));
            }

            if (!ValidUser(parms["username"], parms["password"]))
            {
                // A 400 is returned rather than a 401 to simplify the processing of this type of error. 
                // Otherwise the browser will show a login prompt, which isn't what we want in this case
                throw new HttpResponseException(Request.CreateResponse(
                    HttpStatusCode.BadRequest, 
                    "You must supply valid Sync credentials"));
            }

            try
            {
                filePath = Utility.EnsureBackslash(HttpContext.Current.Request.MapPath("~")) + "Backup\\Bookmarks_" + parms["username"] + ".json";

                if (System.IO.File.Exists(filePath))
                {
                    result.Content = System.IO.File.ReadAllText(filePath, Encoding.UTF8);
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
        public ResultViewModel AddBackup(string collection, [FromBody]JToken data)
        {
            ResultViewModel result = new ResultViewModel();
            string filePath;
            string dirPath;

                var parms = Request.RequestUri.ParseQueryString();

                if (parms["username"] == null || parms["password"] == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(
                        HttpStatusCode.BadRequest, 
                        "You must supply Sync credentials"));
                }

                if (!ValidUser(parms["username"], parms["password"]))
                {
                    throw new HttpResponseException(Request.CreateResponse(
                        HttpStatusCode.BadRequest, 
                        "You must supply valid Sync credentials"));
                }

                if (data == null)
                {
                    throw new HttpResponseException(Request.CreateResponse(
                        HttpStatusCode.BadRequest, 
                        "No data provided to back up"));
                }

            try
            {
                filePath = Utility.EnsureBackslash(HttpContext.Current.Request.MapPath("~")) + "Backup\\Bookmarks_" + parms["username"] + ".json";
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

        #endregion

        #region Private methods

        private bool ValidUser(string userName, string password)
        {
            string filePath = Utility.EnsureBackslash(HttpContext.Current.Request.MapPath("~")) + "users.txt";
            string line;
            string storedPassword;
            int mark;
            bool valid = false;

            using (System.IO.StreamReader userFile = new System.IO.StreamReader(filePath))
            {
                while (!userFile.EndOfStream)
                {
                    line = userFile.ReadLine();

                    if (line.StartsWith(userName))
                    {
                        mark = line.IndexOf('\t');
                        storedPassword = line.Substring(mark, line.Length - mark).Trim();
                        valid = password.Equals(storedPassword, StringComparison.InvariantCulture);

                        break;
                    }
                }
            }

            return valid;
        }

        #endregion
    }
}