using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using System.Diagnostics;
using System.Reflection;
using System.Threading;

namespace BookmarkBrowser
{
    public partial class _Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                //BookmarkBrowserCommon.WriteEvent("test", DateTime.Now, "some stack trace", "some source", "some process", "some tag");

                if (!this.IsPostBack)
                {
                    if (Session["CurrentException"] != null)
                    {
                        Response.Redirect("~/Errors/Error.aspx", false);
                    }
                }
            }
            catch (ThreadAbortException)
            {
            }
            catch (Exception ex)
            {
                Session["CurrentException"] = ex;
                Response.Redirect("~/Errors/Error.aspx", false);
            }
        }
    }
}
