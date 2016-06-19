using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace BookmarkBrowser.Api.Attributes
{
    public class AddDataAuthorizeAttribute : AuthorizeAttribute
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
            FxSyncNet.SyncClient syncClient;
            var parms = actionContext.Request.RequestUri.ParseQueryString();

            try
            {
                if (parms["username"] == null || parms["password"] == null)
                {
                    return false;
                }

                syncClient = new FxSyncNet.SyncClient();
                syncClient.SignIn(parms["username"], parms["password"]);
            }
            catch
            {
                return false;
            }
            
            return true;
        }

        #endregion
    }
}