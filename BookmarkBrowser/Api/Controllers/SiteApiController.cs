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
using System.Collections.Specialized;

namespace BookmarkBrowser.Api.Controllers
{
    public class SiteApiController : ApiController
    {
        #region Public methods

        // POST api/login
        [HttpPost]
        [Route("api/login")]
        public ResultViewModel Login(BookmarkBrowser.Api.Models.Credentials creds)
        {
            if (creds == null)
            {
                throw new HttpResponseException(Request.CreateResponse(
                    HttpStatusCode.BadRequest,
                    "Missing required parameters"));
            }

            FxSyncNet.SyncClient syncClient = new FxSyncNet.SyncClient();
            FxSyncNet.Models.LoginResponse response;

            try
            {
                response = syncClient.Login(creds.Username, creds.Password);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(
                    HttpStatusCode.BadRequest,
                    Utility.GetExceptionMessage(ex)));
            }

            return new ResultViewModel() { Content = JsonConvert.SerializeObject(response) };
        }

        // POST api/verify
        [HttpPost]
        [Route("api/verify")]
        public ResultViewModel Verify(LoginVerification verification)
        {
            if (verification == null)
            {
                throw new HttpResponseException(Request.CreateResponse(
                    HttpStatusCode.BadRequest,
                    "Missing required parameters"));
            }

            Uri link = new Uri(verification.VerificationLink);
            NameValueCollection linkQueryParams = HttpUtility.ParseQueryString(link.Query);

            if (linkQueryParams["code"] == null)
            {
                throw new HttpResponseException(Request.CreateResponse(
                    HttpStatusCode.BadRequest, 
                    "Invalid verification link"));
            }

            FxSyncNet.SyncClient syncClient = new FxSyncNet.SyncClient();

            try
            {
                syncClient.VerifyLogin(verification.UID, linkQueryParams["code"]);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateResponse(
                    HttpStatusCode.BadRequest, 
                    Utility.GetExceptionMessage(ex)));
            }

            return new ResultViewModel();
        }

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

            if (parms["keyFetchToken"] == null || parms["sessionToken"] == null)
            {
                throw new HttpResponseException(Request.CreateResponse(
                    HttpStatusCode.BadRequest,
                    "You must supply the proper Sync tokens"));
            }

            FxSyncNet.SyncClient syncClient = new FxSyncNet.SyncClient();

            switch (collection.ToLower())
            {
                case "bookmark":
                    try
                    {
                        syncClient.OpenSyncAccount(parms["userName"], 
                                                   parms["password"], 
                                                   parms["keyFetchToken"], 
                                                   parms["sessionToken"]);

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
                Utility.WriteEvent(ex.Message, DateTime.Now, ex.ToString(), "SiteApiController", "GetBackup");

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
                Utility.WriteEvent(ex.Message, DateTime.Now, ex.ToString(), "SiteApiController", "AddBackup");

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
            string filePath = Utility.EnsureBackslash(HttpContext.Current.Request.MapPath("~")) + "users.dat";
            string line;
            string storedPassword;
            int mark;
            bool valid = false;

            try
            {
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
            }
            catch (Exception ex)
            {
                Utility.WriteEvent(ex.Message, DateTime.Now, ex.ToString(), "SiteApiController", "ValidUser");
            }

            return valid;
        }

        #endregion
    }
}