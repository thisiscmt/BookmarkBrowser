using System;
using System.Text;
using System.IO;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;

using BookmarkBrowser.API.Models;
using BookmarkBrowser.API.Utils;

namespace BookmarkBrowser.API.Controllers
{
    [ApiController]
    [Route("api")]
    public class SiteApiController : ControllerBase
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly string _dataPath = "App_Data";

        public SiteApiController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        #region Public methods
        // POST api/bookmark
        [EnableCors("DefaultPolicy")]
        [HttpPost]
        [Route("bookmark")]
        public ActionResult SetBookmarkData([FromBody] JsonElement data)
        {
            string filePath = Path.Combine(_webHostEnvironment.ContentRootPath, _dataPath, "bookmarks.dat");
            Credentials creds = GetAutenticationCredentials();

            if (creds != null)
            {
                if (!ValidUser(creds.Username, creds.Password))
                {
                    return Unauthorized("Authentication failed");
                }

                try
                {
                    System.IO.File.WriteAllText(filePath, data.ToString(), Encoding.UTF8);
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
                }

                return Ok();
            }
            else
            {
                return BadRequest("Missing authentication information");
            }
        }

        // GET api/bookmark
        [EnableCors("DefaultPolicy")]
        [HttpGet]
        [Route("bookmark")]
        public ActionResult GetBookmarkData()
        {
            Bookmark rootBookmark;
            Bookmark bookmarkForSwap;
            Credentials creds = GetAutenticationCredentials();
            string filePath = Path.Combine(_webHostEnvironment.ContentRootPath, _dataPath, "bookmarks.dat");
            string bookmarkData;
            string uploadTimestamp;
            int bookmarkCount = 0;

            if (creds != null)
            {
                if (!ValidUser(creds.Username, creds.Password))
                {
                    return Unauthorized("Authentication failed");
                }

                try
                {
                    bookmarkData = System.IO.File.ReadAllText(filePath, Encoding.UTF8);

                    using (JsonDocument document = JsonDocument.Parse(bookmarkData))
                    {
                        rootBookmark = JsonSerializer.Deserialize<Bookmark>(document.RootElement.GetProperty("bookmarkData").ToString());
                        uploadTimestamp = document.RootElement.GetProperty("uploadTimestamp").ToString();
                    }

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

                    var response = new
                    {
                        bookmarkData = rootBookmark,
                        count = bookmarkCount,
                        uploadTimestamp
                    };

                    return Ok(response);
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
                }
            }
            else
            {
                return BadRequest("Missing authentication information");
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

        private Credentials GetAutenticationCredentials()
        {
            Encoding encoding;
            Credentials creds = null;
            string authHeader = Request.Headers["Authorization"];
            string decodedCreds;
            int index;

            if (authHeader != null && authHeader.StartsWith("Basic"))
            {
                try
                {
                    var authHeaderValue = authHeader["Basic ".Length..].Trim();
                    encoding = Encoding.GetEncoding("iso-8859-1");
                    decodedCreds = encoding.GetString(Convert.FromBase64String(authHeaderValue));
                    index = decodedCreds.IndexOf(':');

                    creds = new Credentials
                    {
                        Username = decodedCreds[0..index],
                        Password = decodedCreds[(index + 1)..]
                    };
                }
                catch (Exception ex)
                {
                    Utilities.WriteEvent(_webHostEnvironment.ContentRootPath,
                                         ex.Message, 
                                         DateTime.Now, 
                                         ex.ToString(), 
                                         "SiteApiController", 
                                         "GetAutenticationCredentials");
                }
            }

            return creds;
        }

        private bool ValidUser(string userName, string password)
        {
            string filePath = Path.Combine(_webHostEnvironment.ContentRootPath, _dataPath, "users.dat");
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
                            storedPassword = line[mark..].Trim();
                            valid = password.Equals(storedPassword, StringComparison.InvariantCulture);

                            break;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Utilities.WriteEvent(_webHostEnvironment.ContentRootPath, 
                                     ex.Message, 
                                     DateTime.Now, 
                                     ex.ToString(), 
                                     "SiteApiController", 
                                     "ValidUser");
            }

            return valid;
        }
        #endregion
    }
}