using BookmarkBrowser.Entities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace BookmarkBrowser.Api.Attributes
{
    public class BackupManagementAuthorizeAttribute : AuthorizeAttribute
    {
        #region Overrides

        protected override bool IsAuthorized(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            return AuthorizeRequest(actionContext);
        }

        #endregion

        #region Private methods

        private bool AuthorizeRequest(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            FxSyncNet.SyncClient syncClient = new FxSyncNet.SyncClient();
            var parms = actionContext.Request.RequestUri.ParseQueryString();
            bool retVal = false;

            try
            {
                if (ValidUser(parms["username"].ToString(), parms["password"].ToString()))
                {
                    retVal = true;
                }
            }
            catch
            {
            }
            
            return retVal;
        }

        private bool ValidUser(string userName, string password)
        {
            string filePath = Utility.EnsureBackslash(HttpContext.Current.Request.MapPath("~")) + "users.txt";
            string line;
            string storedPassword;
            int mark;
            bool valid = false;

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


            return valid;
        }

        #endregion
    }
}