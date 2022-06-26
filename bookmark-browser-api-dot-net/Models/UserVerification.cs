using Microsoft.AspNetCore.Mvc;

namespace BookmarkBrowserAPI.Models
{
    public class UserVerification
    {
        public User? User { get; set; }

        public ObjectResult? Reason { get; set; }
    }
}
