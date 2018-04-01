using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Text;
using System.Web;
using System.IO;
using System.Web.Http.Cors;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BookmarkBrowser.API.Models;
using BookmarkBrowser.API.Entities;
using BookmarkBrowser.Entities;
using System.Collections.Generic;

namespace BookmarkBrowser.API.Controllers
{
    public class SiteApiController : ApiController
    {
        private string _dataPath = "App_Data\\";

        #region Public methods
        // POST api/bookmark
        [EnableCors(origins: "http://bmb.cmtybur.com,http://bookmarkbrowser.cmtybur.com,https://bookmarkbrowser.cmtybur.com,http://localhost:4001", headers: "*", methods: "*")]
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
        [EnableCors(origins: "http://bmb.cmtybur.com,http://bookmarkbrowser.cmtybur.com,https://bookmarkbrowser.cmtybur.com,http://localhost:4001", headers: "*", methods: "*")]
        [HttpGet]
        [Route("api/bookmark")]
        public ResultViewModel GetBookmarkData()
        {
            Bookmark rootBookmark;
            Bookmark swap;
            Credentials creds = GetAutenticationCredentials();
            ResultViewModel result;
            JObject storedBookmarkData;
            string filePath = Utility.EnsureBackslash(HttpContext.Current.Request.MapPath("~")) + _dataPath + "bookmarks.dat";
            string bookmarkData;
            int bookmarkCount = 0;

            if (creds != null)
            {
                if (!ValidUser(creds.Username, creds.Password))
                {
                    throw new HttpResponseException(Request.CreateResponse(
                        HttpStatusCode.Unauthorized,
                        "Authentication failed"));
                }

                try
                {
                    bookmarkData = File.ReadAllText(filePath, Encoding.UTF8);
                    storedBookmarkData = JObject.Parse(bookmarkData);
                    rootBookmark = JsonConvert.DeserializeObject<Bookmark>(storedBookmarkData.Property("bookmarkData").Value.ToString());
                    rootBookmark.Path = "Root";

                    // Remove any top-level directories that have no children (e.g. 'Mobile Bookmarks' and 'Other Bookmarks')
                    for (int i = rootBookmark.Children.Count - 1; i >= 0; i--)
                    {
                        if (rootBookmark.Children.ElementAt(i).Children == null)
                        {
                            rootBookmark.Children.RemoveAt(i);
                        }
                    }

                    // Put the bookmark toolbar element first since that is what will logically be the first set of bookmarks
                    swap = rootBookmark.Children[0];
                    rootBookmark.Children[0] = rootBookmark.Children[1];
                    rootBookmark.Children[1] = swap;

                    // We set certain metadata on each directory to make navigation easier on the client, plus we get 
                    // a count of actual bookmarks
                    SetMetadata(ref rootBookmark, ref bookmarkCount);

                    result = new ResultViewModel(JsonConvert.SerializeObject(new {
                        bookmarkData = rootBookmark,
                        count = bookmarkCount,
                        uploadTimestamp = storedBookmarkData.Property("uploadTimestamp").Value.ToString()
                    }));

                    return result;
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
        private void SetMetadata(ref Bookmark bookmark, ref int bookmarkCount)
        {
            Bookmark newItem;

            if (bookmark.Children != null)
            {
                foreach (Bookmark item in bookmark.Children)
                {
                    if (item.Type == "text/x-moz-place-container")
                    {
                        item.Path = bookmark.Path + "\\" + item.Title;
                        item.Type = "Directory";
                        newItem = item;
                        SetMetadata(ref newItem, ref bookmarkCount);
                    }
                    else if (item.Type == "text/x-moz-place")
                    {
                        item.Type = "Bookmark";
                        bookmarkCount++;
                    }
                    else if (item.Type == "text/x-moz-place-separator")
                    {
                        item.Type = "Separator";
                    }
                }
            }
        }

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
                    return null;
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