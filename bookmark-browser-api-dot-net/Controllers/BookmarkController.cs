using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using FxSyncNet;
using BookmarkBrowserAPI.Util;
using BookmarkBrowserAPI.Models;

namespace BookmarkBrowserAPI.Controllers
{
    [ApiController]
    [Route("bookmark")]
    public class BookmarkController : ControllerBase
    {
        private readonly string BOOKMARK_FILE = "bookmarks.dat";

        #region Controller methods
        [HttpGet]
        [EnableCors("DefaultPolicy")]
        public IActionResult GetBookmarks([FromHeader(Name = "authorization")] string authHeader, [FromQuery] string sessionToken, 
                                          [FromQuery] string keyFetchToken)
        {
            var userVerification = VerifyUser(authHeader);
            {
                if (userVerification.User is null)
                {
                    return userVerification.Reason!;
                }
            }
            var user = userVerification.User;
            SyncClient syncClient = new();

            try
            {
                syncClient.OpenSyncAccount(user.Username, user.Password, keyFetchToken, sessionToken);
                IEnumerable<FxSyncNet.Models.Bookmark> bookmarks = syncClient.GetBookmarks();

                var bookmarkData = BookmarkHelpers.BuildBookmarks(bookmarks);
                var response = new
                {
                    bookmarkData = bookmarkData.RootBookmark,
                    count = bookmarkData.BookmarkCount,
                    timestamp = DateTimeOffset.Now.ToUnixTimeMilliseconds()
                };

                return Ok(response);
            }
            catch (ServiceNotAvailableException ex)
            {
                return StatusCode(StatusCodes.Status504GatewayTimeout, ServiceHelpers.GetExceptionMessage(ex));
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, ServiceHelpers.GetExceptionMessage(ex));
            }
            catch (AuthenticationException ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, ServiceHelpers.GetExceptionMessage(ex));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ServiceHelpers.GetExceptionMessage(ex));
            }
            finally
            {
                syncClient.CloseSyncAccount();
            }
        }

        [HttpGet("backup")]
        [EnableCors("DefaultPolicy")]
        public IActionResult GetBookmarkBackup([FromHeader(Name = "authorization")] string authHeader)
        {
            string bookmarkBackup;

            var userVerification = VerifyUser(authHeader);
            {
                if (userVerification.User is null)
                {
                    return userVerification.Reason!;
                }
            }
            var user = userVerification.User;

            try
            {
                var dataPath = AppDomain.CurrentDomain.GetData("AppDataPath");

                if (dataPath is null)
                {
                    ServiceHelpers.WriteEvent("Could not find app data path value", DateTime.Now, "", "BookmarkController", "GetBookmarkBackup");
                    return StatusCode(StatusCodes.Status500InternalServerError, "Could not find required configration data");
                }

                var dirPath = Path.Combine((string)dataPath, user.Id);

                if (!System.IO.Directory.Exists(dirPath))
                {
                    ServiceHelpers.WriteEvent($"Could not find directory for user {user.Username} with ID {user.Id}", DateTime.Now, "", "BookmarkController", "GetBookmarkBackup");
                    return StatusCode(StatusCodes.Status500InternalServerError, "Could not find directory");
                }

                bookmarkBackup = System.IO.File.ReadAllText(Path.Combine(dirPath, BOOKMARK_FILE), Encoding.UTF8);
                var bookmarkData = BookmarkHelpers.BuildBookmarksFromBackup(bookmarkBackup);
                var response = new
                {
                    bookmarkData = bookmarkData.RootBookmark,
                    count = bookmarkData.BookmarkCount,
                    timestamp = bookmarkData.Timestamp
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("backup")]
        [EnableCors("DefaultPolicy")]
        public IActionResult SaveBookmarkBackup([FromHeader(Name = "authorization")] string authHeader, [FromBody] JObject data)
        {
            var userVerification = VerifyUser(authHeader);
            {
                if (userVerification.User is null)
                {
                    return userVerification.Reason!;
                }
            }
            var user = userVerification.User;

            try
            {
                var dataPath = AppDomain.CurrentDomain.GetData("AppDataPath");

                if (dataPath is null)
                {
                    ServiceHelpers.WriteEvent("Could not find app data path value", DateTime.Now, "", "BookmarkController", "SaveBookmarkBackup");
                    return StatusCode(StatusCodes.Status500InternalServerError, "'Could not find required configration data");
                }

                var dirPath = Path.Combine((string)dataPath, user.Id);

                if (!System.IO.Directory.Exists(dirPath))
                {
                    System.IO.Directory.CreateDirectory(dirPath);
                }

                System.IO.File.WriteAllText(Path.Combine(dirPath, BOOKMARK_FILE), data.ToString(), Encoding.UTF8);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

            return Ok();
        }
        #endregion

        #region Private methods
        private UserVerification VerifyUser(string authHeader)
        {
            var verification = new UserVerification();
            var creds = AuthHelpers.GetAutenticationCredentials(authHeader);

            if (creds is null)
            {
                verification.Reason = BadRequest("Missing authentication information");
                return verification;
            }

            var user = AuthHelpers.GetUser(creds.Username);

            if (user is null || (user is not null && !AuthHelpers.ValidUser(user, creds)))
            {
                verification.Reason = Unauthorized("Authentication failed");
                return verification;
            }

            user!.Username = creds.Username;
            user!.Password = creds.Password;
            verification.User = user;

            return verification;
        }
        #endregion
    }
}
