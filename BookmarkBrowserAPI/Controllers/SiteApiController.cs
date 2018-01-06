using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Text;
using System.Web;
using System.IO;
using Newtonsoft.Json.Linq;
using BookmarkBrowser.API.Models;
using BookmarkBrowser.API.Entities;

namespace BookmarkBrowser.API.Controllers
{
    public class SiteApiController : ApiController
    {
        private string _dataPath = "data\\";

        #region Public methods

        // POST api/bookmark
        [HttpPost]
        [Route("api/bookmark")]
        public ResultViewModel SetBookmarkData([FromBody]JToken data)
        {
            string filePath = Utility.EnsureBackslash(HttpContext.Current.Request.MapPath("~")) + _dataPath + "bookmarks.dat";
            Credentials creds = GetAutenticationCredentials();

            if (creds != null)
            {
                try
                {
                    if (!ValidUser(creds.Username, creds.Password))
                    {
                        throw new HttpResponseException(Request.CreateResponse(
                            HttpStatusCode.Unauthorized,
                            "Authentication failed"));
                    }

                    File.WriteAllText(filePath, data.ToString(), Encoding.UTF8);
                    return new ResultViewModel();
                }
                catch (Exception ex)
                {
                    throw new HttpResponseException(Request.CreateResponse(
                        HttpStatusCode.InternalServerError,
                        ex.Message));
                }
            }
            else
            {
                throw new HttpResponseException(Request.CreateResponse(
                    HttpStatusCode.BadRequest,
                    "Missing authentication information"));
            }
        }

        // GET api/bookmark
        [HttpGet]
        [Route("api/bookmark")]
        public ResultViewModel GetBookmarkData()
        {
            Credentials creds = GetAutenticationCredentials();
            string filePath = Utility.EnsureBackslash(HttpContext.Current.Request.MapPath("~")) + _dataPath + "bookmarks.dat";
            string bookmarkData;

            if (creds != null)
            {
                try
                {
                    if (!ValidUser(creds.Username, creds.Password))
                    {
                        throw new HttpResponseException(Request.CreateResponse(
                            HttpStatusCode.Unauthorized,
                            "Authentication failed"));
                    }

                    bookmarkData = File.ReadAllText(filePath, Encoding.UTF8);
                    return new ResultViewModel(bookmarkData);
                }
                catch (Exception ex)
                {
                    throw new HttpResponseException(Request.CreateResponse(
                        HttpStatusCode.InternalServerError,
                        ex.Message));
                }
            }
            else
            {
                throw new HttpResponseException(Request.CreateResponse(
                    HttpStatusCode.BadRequest,
                    "Missing authentication information"));
            }
        }
        #endregion

        #region Private methods

        private Credentials GetAutenticationCredentials()
        {
            Encoding encoding;
            Credentials creds = null;
            string decodedCreds;
            int index;

            if (Request.Headers.Authorization != null && Request.Headers.Authorization.ToString().StartsWith("Basic"))
            {
                try
                {
                    encoding = Encoding.GetEncoding("iso-8859-1");
                    decodedCreds = encoding.GetString(Convert.FromBase64String(Request.Headers.Authorization.Parameter));
                    index = decodedCreds.IndexOf(':');

                    creds = new Credentials();
                    creds.Username = decodedCreds.Substring(0, index);
                    creds.Password = decodedCreds.Substring(index + 1);
                }
                catch (Exception ex)
                {
                    Utility.WriteEvent(ex.Message, DateTime.Now, ex.ToString(), "SiteApiController", "GetAutenticationCredentials");
                }
            }

            return creds;
        }

        private bool ValidUser(string userName, string password)
        {
            string filePath = Utility.EnsureBackslash(HttpContext.Current.Request.MapPath("~")) + _dataPath + "users.dat";
            string line;
            string storedPassword;
            int mark;
            bool valid = false;

            try
            {
                using (StreamReader userFile = new StreamReader(filePath))
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