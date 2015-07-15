using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Services;
using System.Web.Services;
using System.Threading;

namespace BookmarkBrowser
{
    public partial class _SelectDir : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                if (!this.IsPostBack)
                {
                    Response.Redirect("~/Default.aspx", false);
                    return;

                    // Redirect to the home page if the required query string 
                    // values are missing
                    //if (Request.QueryString["u"] == null || Request.QueryString["t"] == null) 
                    //{
                    //      Response.Redirect("~/Default.aspx", false);
                    //}
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