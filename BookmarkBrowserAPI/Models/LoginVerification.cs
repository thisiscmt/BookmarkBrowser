using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BookmarkBrowser.API.Models
{
    public class LoginVerification
    {
        public string UID { get; set; }
        public string VerificationLink { get; set; }
    }
}