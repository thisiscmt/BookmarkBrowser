using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using BookmarkBrowserAPI.Models;
using BookmarkBrowserAPI.Enums;

namespace BookmarkBrowserAPI.Util
{
    public class BookmarkHelpers
    {
        public static BookmarkData BuildBookmarks(IEnumerable<FxSyncNet.Models.Bookmark> bookmarks)
        {
            Dictionary<string, Bookmark> directoryIdMapping = new Dictionary<string, Bookmark>();
            Dictionary<string, Bookmark> bookmarkIdMapping = new Dictionary<string, Bookmark>();

            IList<FxSyncNet.Models.Bookmark> directories = (from b in bookmarks
                                                            where b.Type == FxSyncNet.Models.BookmarkType.Folder
                                                            select b).ToList();

            IList<FxSyncNet.Models.Bookmark> items = (from b in bookmarks
                                                      where b.Type == FxSyncNet.Models.BookmarkType.Bookmark
                                                      select b).ToList();

            foreach (FxSyncNet.Models.Bookmark dir in directories)
            {
                directoryIdMapping.Add(dir.Id, new Bookmark
                {
                    Id = dir.Id,
                    Title = dir.Title,
                    Type = FxSyncNet.Models.BookmarkType.Folder.ToString(),
                    TypeCode = TypeCodes.Directory
                });
            }

            foreach (FxSyncNet.Models.Bookmark item in items)
            {
                if (item.Uri != null)
                {
                    string tags = "";

                    if (item.Tags != null)
                    {
                        tags = string.Join(", ", item.Tags);
                    }

                    bookmarkIdMapping.Add(item.Id, new Bookmark
                    {
                        Id = item.Id,
                        Title = item.Title,
                        Uri = item.Uri.AbsoluteUri,
                        Type = item.Type.ToString(),
                        Tags = tags,
                        Keyword = item.Keyword ?? "",
                        TypeCode = TypeCodes.Bookmark
                    });
                }
            }

            foreach (FxSyncNet.Models.Bookmark dir in directories)
            {
                foreach (string child in dir.Children)
                {
                    if (bookmarkIdMapping.ContainsKey(child))
                    {
                        Bookmark bookmark = bookmarkIdMapping[child];
                        directoryIdMapping[dir.Id].Children.Add(bookmark);
                    }
                    else if (directoryIdMapping.ContainsKey(child))
                    {
                        Bookmark childDirectory = directoryIdMapping[child];
                        directoryIdMapping[dir.Id].Children.Add(childDirectory);
                    }
                }
            }

            Bookmark rootItem = new Bookmark
            {
                Id = "Root",
                Type = FxSyncNet.Models.BookmarkType.Folder.ToString(),
                TypeCode = TypeCodes.Directory,
                Root = "placesRoot",
                Path = "Root"
            };
            Bookmark toolbarDir = directoryIdMapping["toolbar"];
            Bookmark menuDir = directoryIdMapping["menu"];
            int bookmarkCount = 0;

            rootItem.Children.Add(toolbarDir);
            rootItem.Children.Add(menuDir);
            SetMetadata(ref rootItem, ref bookmarkCount);

            return new BookmarkData(rootItem, bookmarkCount);
        }

        public static BookmarkData BuildBookmarksFromBackup(string bookmarkBackup)
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
                if (rootItem.Children.ElementAt(i).TypeCode == TypeCodes.Directory && rootItem.Children.ElementAt(i).Children.Count == 0)
                {
                    rootItem.Children.RemoveAt(i);
                }
            }

            // Put the bookmark toolbar element first since that is what will logically be the first set of bookmarks
            itemForSwap = rootItem.Children[0];
            rootItem.Children[0] = rootItem.Children[1];
            rootItem.Children[1] = itemForSwap;

            // We set certain metadata on each directory to make navigation easier on the client, plus we get a count of actual bookmarks
            SetMetadata(ref rootItem, ref bookmarkCount);

            return new BookmarkData(rootItem, bookmarkCount, bookmarkObject.Property("timestamp")!.Value.ToString());

        }

        public static void SetMetadata(ref Bookmark dir, ref int bookmarkCount)
        {
            Bookmark newDir;

            if (dir.Children.Count > 0)
            {
                foreach (Bookmark item in dir.Children)
                {
                    if (item.TypeCode == TypeCodes.Directory)
                    {
                        item.Path = dir.Path + "\\" + item.Title;
                        newDir = item;
                        SetMetadata(ref newDir, ref bookmarkCount);
                    }
                    else if (item.TypeCode == TypeCodes.Bookmark)
                    {
                        bookmarkCount += 1;
                    }
                }
            }

        }
    }
}
