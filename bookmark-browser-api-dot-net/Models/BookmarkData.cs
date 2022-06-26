namespace BookmarkBrowserAPI.Models
{
    public class BookmarkData
    {
        public BookmarkData(Bookmark rootDirectory, int bookmarkCount, string timestamp = "")
        {
            RootBookmark = rootDirectory;
            BookmarkCount = bookmarkCount;
            Timestamp = timestamp;
        }

        public Bookmark RootBookmark { get; set; }

        public int BookmarkCount { get; set; }

        public string Timestamp { get; set; }
    }
}
