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
                if (parms["username"] != null && parms["password"] != null && ValidUser(parms["username"].ToString()))
                {
                    syncClient.SignIn(parms["username"], parms["password"]);
                    retVal = true;
                }
            }
            catch
            {
            }
            
            return retVal;
        }

        private bool ValidUser(string userName)
        {
            string filePath = HttpContext.Current.Request.MapPath("/") + "users.txt";
            string users = File.ReadAllText(filePath);

            return users.IndexOf(userName, StringComparison.InvariantCultureIgnoreCase) > -1;
        }

        #endregion
    }
}