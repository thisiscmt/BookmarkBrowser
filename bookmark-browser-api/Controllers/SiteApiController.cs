﻿using System;
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
using BookmarkBrowser.API.Utils;
using System.Collections.Generic;

namespace BookmarkBrowser.API.Controllers
{
    public class SiteApiController : ApiController
    {
        private readonly string _dataPath = "App_Data";
        private readonly string _bookmarkFile = "bookmarks.dat";
        private readonly string _userFile = "users.dat";

        #region Public methods
        [EnableCors(origins: "http://bmb.cmtybur.com,http://localhost:3006", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/bookmark")]
        public HttpResponseMessage SetBookmarkData([FromBody] JToken data)
        {
            string filePath = Path.Combine(HttpContext.Current.Request.MapPath("~"), _dataPath);
            Credential creds = GetAutenticationCredentials();
            User user;

            if (creds != null)
            {
                user = GetUser(creds.Username);

                if (!ValidUser(user, creds))
                {
                    return new HttpResponseMessage
                    {
                        StatusCode = HttpStatusCode.Unauthorized,
                        Content = new StringContent("Authentication failed", Encoding.UTF8, "application/json")
                    };
                }

                try
                {
                    filePath = Path.Combine(filePath, user.Id);

                    if (!Directory.Exists(filePath))
                    {
                        Directory.CreateDirectory(filePath);
                    }

                    filePath = Path.Combine(filePath, _bookmarkFile);
                    System.IO.File.WriteAllText(filePath, data.ToString(), Encoding.UTF8);
                }
                catch (Exception ex)
                {
                    Utility.WriteEvent(HttpContext.Current.Request.MapPath("~"),
                                       ex.Message,
                                       DateTime.Now,
                                       ex.ToString(),
                                       "SiteApiController",
                                       "GetBookmarkData");

                    return new HttpResponseMessage
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Content = new StringContent("An expected error occurred", Encoding.UTF8, "application/json")
                    };
                }

                return new HttpResponseMessage(HttpStatusCode.OK);
            }
            else
            {
                return new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Content = new StringContent("Missing authentication information", Encoding.UTF8, "application/json")
                };
            }
        }

        [EnableCors(origins: "http://bmb.cmtybur.com,http://localhost:3006", headers: "*", methods: "*")]
        [HttpGet]
        [Route("api/bookmark")]
        public HttpResponseMessage GetBookmarkData()
        {
            Bookmark rootBookmark;
            Bookmark bookmarkForSwap;
            Credential creds = GetAutenticationCredentials();
            User user;
            JObject storedBookmarkData;
            string filePath = Path.Combine(HttpContext.Current.Request.MapPath("~"), _dataPath);
            string bookmarkData;
            int bookmarkCount = 0;

            if (creds != null)
            {
                user = GetUser(creds.Username);

                if (!ValidUser(user, creds))
                {
                    return new HttpResponseMessage
                    {
                        StatusCode = HttpStatusCode.Unauthorized,
                        Content = new StringContent("Authentication failed", Encoding.UTF8, "application/json")
                    };
                }

                try
                {
                    filePath = Path.Combine(filePath, user.Id, _bookmarkFile);
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
                    bookmarkForSwap = rootBookmark.Children[0];
                    rootBookmark.Children[0] = rootBookmark.Children[1];
                    rootBookmark.Children[1] = bookmarkForSwap;

                    // We set certain metadata on each directory to make navigation easier on the client, plus we get a count of actual bookmarks
                    SetMetadata(ref rootBookmark, ref bookmarkCount);

                    var responseData = new
                    {
                        bookmarkData = rootBookmark,
                        count = bookmarkCount,
                        uploadTimestamp = storedBookmarkData.Property("uploadTimestamp").Value
                    };

                    return Request.CreateResponse(
                        HttpStatusCode.OK,
                        responseData
                    );
                }
                catch (Exception ex)
                {
                    Utility.WriteEvent(HttpContext.Current.Request.MapPath("~"),
                                       ex.Message,
                                       DateTime.Now,
                                       ex.ToString(),
                                       "SiteApiController",
                                       "GetBookmarkData");

                    return new HttpResponseMessage
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Content = new StringContent("An unexpected error occurred", Encoding.UTF8, "application/json")
                    };
                }
            }
            else
            {
                return new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Content = new StringContent("Missing authentication information", Encoding.UTF8, "application/json")
                };
            }
        }

        [EnableCors(origins: "http://bmb.cmtybur.com,http://localhost:3006", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/log")]
        public HttpResponseMessage CreateLogEntry([FromBody] JToken data)
        {
            Credential creds = GetAutenticationCredentials();
            User user;
            JObject logEntry;

            if (creds != null)
            {
                user = GetUser(creds.Username);

                if (!ValidUser(user, creds))
                {
                    return new HttpResponseMessage
                    {
                        StatusCode = HttpStatusCode.Unauthorized,
                        Content = new StringContent("Authentication failed", Encoding.UTF8, "application/json")
                    };
                }

                logEntry = JObject.Parse(data.ToString());

                Utility.WriteEvent(HttpContext.Current.Request.MapPath("~"),
                                   logEntry.Property("description") != null ? logEntry.Property("description").Value.ToString() : "",
                                   DateTime.UtcNow,
                                   logEntry.Property("longDescription") != null ? logEntry.Property("longDescription").Value.ToString() : "",
                                   logEntry.Property("source") != null ? logEntry.Property("source").Value.ToString() : "",
                                   logEntry.Property("process") != null ? logEntry.Property("process").Value.ToString() : "",
                                   logEntry.Property("tag") != null ? logEntry.Property("tag").Value.ToString() : "");

                return new HttpResponseMessage(HttpStatusCode.OK);
            }
            else
            {
                return new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Content = new StringContent("Missing authentication information", Encoding.UTF8, "application/json")
                };
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
                        bookmarkCount += 1;
                    }
                    else if (item.Type == "text/x-moz-place-separator")
                    {
                        item.Type = "Separator";
                    }
                }
            }
        }

        private Credential GetAutenticationCredentials()
        {
            Encoding encoding;
            Credential creds = null;
            string decodedCreds;
            int index;

            if (Request.Headers.Authorization != null && Request.Headers.Authorization.ToString().StartsWith("Basic"))
            {
                try
                {
                    encoding = Encoding.GetEncoding("iso-8859-1");
                    decodedCreds = encoding.GetString(Convert.FromBase64String(Request.Headers.Authorization.Parameter));
                    index = decodedCreds.IndexOf(':');

                    creds = new Credential
                    {
                        Username = decodedCreds.Substring(0, index),
                        Password = decodedCreds.Substring(index + 1)
                    };
                }
                catch (Exception ex)
                {
                    Utility.WriteEvent(HttpContext.Current.Request.MapPath("~"),
                                         ex.Message, 
                                         DateTime.Now, 
                                         ex.ToString(), 
                                         "SiteApiController", 
                                         "GetAutenticationCredentials");
                }
            }

            return creds;
        }

        private User GetUser(string userName)
        {
            List<User> users;
            string filePath = Path.Combine(HttpContext.Current.Request.MapPath("~"), _dataPath, _userFile);
            string userData;
            User user = null;

            try
            {
                userData = File.ReadAllText(filePath, Encoding.UTF8);
                users = JsonConvert.DeserializeObject<List<User>>(userData);

                foreach (User knownUser in users)
                {
                    if (knownUser.Username == userName)
                    {
                        user = knownUser;
                    }
                }
            }
            catch (Exception ex)
            {
                Utility.WriteEvent(HttpContext.Current.Request.MapPath("~"),
                                   ex.Message,
                                   DateTime.Now,
                                   ex.ToString(),
                                   "SiteApiController",
                                   "GetUser");
            }

            return user;
        }

        private bool ValidUser(User user, Credential creds)
        {
            bool valid = false;

            if (user != null && user.Password == creds.Password)
            {
                valid = true;
            }

            return valid;
        }
        #endregion
    }
}