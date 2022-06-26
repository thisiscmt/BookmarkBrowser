namespace BookmarkBrowserAPI.Models
{
    public class Credential
    {
        public Credential()
        {
            Username = "";
            Password = "";
        }

        public string Username { get; set; }
        public string Password { get; set; }
    }
}