namespace BookmarkBrowserAPI.Models
{
    public class User
    {
        public User()
        {
            Id = "";
            Username = "";
            Password = "";
        }

        public string Id { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }
    }
}