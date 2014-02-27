using System;
using System.Web;

namespace BookmarkBrowser
{
    public partial class _Error : System.Web.UI.Page
    {
        protected void Page_Load(object sender, System.EventArgs e)
        {
            Exception ex;

            if (HttpContext.Current.Session["CurrentException"] == null)
            {
                litMsg.Text = "An unexpected error has occurred";
                return;
            }

            ex = (Exception)HttpContext.Current.Session["CurrentException"];

            if (Request.QueryString["Type"] == null)
            {
                litMsg.Text = ex.Message;
            }
            else
            {
                switch (int.Parse(Request.QueryString["Type"]))
                {
                    case 1:
                        litMsg.Text = "An error has occurred validating your input. Click the Back button on your browser and make sure all fields are correct, then retry the operation.";
                        break;
                }
            }

            HttpContext.Current.Session.Remove("CurrrentException");
        }
    }
}