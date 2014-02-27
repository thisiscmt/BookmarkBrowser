using System;
using System.Linq;
using System.Net;
using System.Collections.Generic;
using CloudFox.Weave;

using WeaveBookmark = CloudFox.Weave.Bookmark;

namespace CloudFox.Presentation
{
    public static class BookmarksStructureBuilder
    {
        /// <summary>
        /// Build a hierarchic directory structure.
        /// </summary>
        /// <param name="bookmarks"></param>
        /// <returns></returns>
        public static Directory Build(IEnumerable<WeaveBookmark> bookmarks)
        {
            Dictionary<string, Directory> directoryIdMapping = new Dictionary<string, Directory>();
            Dictionary<string, Bookmark> bookmarkIdMapping = new Dictionary<string, Bookmark>();

            IList<WeaveBookmark> directories = (from b in bookmarks
                                                where b.BookmarkType == BookmarkType.Folder
                                                select b).ToList();

            IList<WeaveBookmark> items = (from b in bookmarks
                                          where b.BookmarkType == BookmarkType.Bookmark
                                          select b).ToList();

            // Create directory objects
            foreach (WeaveBookmark weaveDirectory in directories)
            {
                directoryIdMapping.Add(weaveDirectory.Id, new Directory(weaveDirectory.Title, weaveDirectory.Id));
            }

            // Create bookmark objects
            foreach (WeaveBookmark weaveBookmark in items)
            {
                bookmarkIdMapping.Add(weaveBookmark.Id, new Bookmark(weaveBookmark.Title, weaveBookmark.Uri));
            }

            // Assign parent values
            foreach (WeaveBookmark weaveDirectory in directories)
            {
                if (directoryIdMapping.ContainsKey(weaveDirectory.ParentId))
                    directoryIdMapping[weaveDirectory.Id].Parent = directoryIdMapping[weaveDirectory.ParentId].Name;
            }

            // Assign items
            foreach (WeaveBookmark weaveDirectory in directories)
            {
                Directory directory = directoryIdMapping[weaveDirectory.Id];

                foreach (string child in weaveDirectory.Children)
                {
                    if (bookmarkIdMapping.ContainsKey(child))
                    {
                        Bookmark bookmark = bookmarkIdMapping[child];
                        directory.BookmarkItems.Add(bookmark);
                    }
                    else if (directoryIdMapping.ContainsKey(child))
                    {
                        Directory childDirectory = directoryIdMapping[child];
                        directory.BookmarkItems.Add(childDirectory);
                    }

                }
            }

            Directory rootDirectory = new Directory("Root", "Root");
            Directory toolbarDir = directoryIdMapping["toolbar"];
            Directory menuDir = directoryIdMapping["menu"];
            toolbarDir.Parent = "Root";
            menuDir.Parent = "Root";
            rootDirectory.Path = "Root";
            rootDirectory.BookmarkItems.Add(toolbarDir);
            rootDirectory.BookmarkItems.Add(menuDir);

            // Set the full paths on all directory nodes within the root directory, 
            // which will make it easier to navigate back and forth through the
            // bookmark data on the client
            setPaths(ref rootDirectory);

            return rootDirectory;
        }

        private static void setPaths(ref Directory dir)
        {
            Directory newDir;
            IEnumerable<BookmarkItem> items = dir.BookmarkItems.Where(x => x.ItemType == BookmarkItem.ItemTypes.Directory);

            foreach (BookmarkItem item in items)
            {
                if (item.ItemType == BookmarkItem.ItemTypes.Directory)
                {
                    item.Path = dir.Path + "\\" + item.Name;
                    newDir = (Directory)item;
                    setPaths(ref newDir);
                }
            }
        }
    }
}
