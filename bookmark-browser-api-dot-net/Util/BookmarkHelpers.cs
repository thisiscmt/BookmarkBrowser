using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using BookmarkBrowserAPI.Models;

namespace BookmarkBrowserAPI.Util
{
    public class BookmarkHelpers
    {
        private static readonly string BOOKMARKS_LOG_FILE = "bookmarks.log";

        public static BookmarkData BuildBookmarksFromBackup(string bookmarkBackup, string userId)
        {
            Bookmark? rootItem;
            Bookmark itemForSwap;
            int bookmarkCount = 0;
            var bookmarkObject = JObject.Parse(bookmarkBackup);
            var bookmarkData = bookmarkObject.Property("bookmarkData");

            rootItem = JsonConvert.DeserializeObject<Bookmark>(bookmarkData!.Value.ToString());
            rootItem!.Path = "Root";

            // Remove any top-level directories that have no children (e.g. 'Other Bookmarks')
            for (int i = rootItem.Children.Count - 1; i >= 0; i--)
            {
                if (rootItem.Children.ElementAt(i).TypeCode == Enums.TypeCode.Directory && rootItem.Children.ElementAt(i).Children.Count == 0)
                {
                    rootItem.Children.RemoveAt(i);
                }
            }

            // Put the bookmark toolbar element first since that is what will logically be the first set of bookmarks
            itemForSwap = rootItem.Children[0];
            rootItem.Children[0] = rootItem.Children[1];
            rootItem.Children[1] = itemForSwap;

            var logDirPathVal = AppDomain.CurrentDomain.GetData("AppDataPath");
            StreamWriter? sr = null;

            if (logDirPathVal != null && Environment.GetEnvironmentVariable("ENABLE_BOOKMARK_LOGGING")?.ToLower() == "true")
            {
                var logFilePath = Path.Combine((string)logDirPathVal, userId);
                logFilePath = Path.Combine(logFilePath, BOOKMARKS_LOG_FILE);
                sr = new StreamWriter(logFilePath, false, System.Text.Encoding.UTF8);
            }

            try
            {
                // We set certain metadata on each directory to make navigation easier on the client, plus we get a count of actual bookmarks
                SetMetadata(ref rootItem, ref bookmarkCount, ref sr);
            }
            catch
            {
                throw;
            }
            finally
            {
                sr?.Close();
            }

            return new BookmarkData(rootItem, bookmarkCount, bookmarkObject.Property("timestamp")!.Value.ToString());
        }

        public static void SetMetadata(ref Bookmark dir, ref int bookmarkCount, ref StreamWriter? sr)
        {
            Bookmark newDir;

            if (dir.Children.Count > 0)
            {
                foreach (Bookmark item in dir.Children)
                {
                    if (item.TypeCode == Enums.TypeCode.Directory)
                    {
                        item.Path = dir.Path + "\\" + item.Title;
                        newDir = item;
                        SetMetadata(ref newDir, ref bookmarkCount, ref sr);
                    }
                    else if (item.TypeCode == Enums.TypeCode.Bookmark)
                    {
                        bookmarkCount += 1;
                        sr?.WriteLine(item.Title + ", " + item.Uri);
                    }
                }
            }

        }
    }
}
