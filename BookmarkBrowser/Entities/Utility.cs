using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace BookmarkBrowser.Entities
{
    public class Utility
    {
        #region Public methods

        public static Directory BuildBookmarks(IEnumerable<FxSyncNet.Models.Bookmark> bookmarks)
        {
            Dictionary<string, Directory> directoryIdMapping = new Dictionary<string, Directory>();
            Dictionary<string, Bookmark> bookmarkIdMapping = new Dictionary<string, Bookmark>();
            Directory directory;

            IList<FxSyncNet.Models.Bookmark> directories = (from b in bookmarks
                                           where b.Type == FxSyncNet.Models.BookmarkType.Folder
                                           select b).ToList();

            IList<FxSyncNet.Models.Bookmark> items = (from b in bookmarks
                                          where b.Type == FxSyncNet.Models.BookmarkType.Bookmark
                                          select b).ToList();

            // Create directory objects
            foreach (FxSyncNet.Models.Bookmark dir in directories)
            {
                directoryIdMapping.Add(dir.Id, new Directory(dir.Title, dir.Id));
            }

            // Create bookmark objects
            foreach (FxSyncNet.Models.Bookmark item in items)
            {
                bookmarkIdMapping.Add(item.Id, new Bookmark(item.Title, item.Uri.AbsoluteUri));
            }

            // Assign parent values
            foreach (FxSyncNet.Models.Bookmark dir in directories)
            {
                if (directoryIdMapping.ContainsKey(dir.ParentId))
                {
                    directoryIdMapping[dir.Id].Parent = directoryIdMapping[dir.ParentId].Name;
                }
            }

            // Assign items
            foreach (FxSyncNet.Models.Bookmark dir in directories)
            {
                directory = directoryIdMapping[dir.Id];

                foreach (string child in dir.Children)
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
            SetPaths(ref rootDirectory);

            return rootDirectory;
        }

        public static string GetExceptionMessage(Exception ex)
        {
            string msg = string.Empty;

            if (ex != null)
            {
                if (ex.InnerException != null)
                {
                    msg = ex.InnerException.Message;
                }
                else
                {
                    msg = ex.Message;
                }
            }

            return msg;
        }

        public static void WriteEvent(string desc, DateTime timestamp, string longDesc = "", string source = "", 
                                      string process = "", string tag = "")
        {
            string msg = string.Empty;
            string filePath;

            try
            {
                filePath = HttpContext.Current.Request.MapPath("/") + "Logs\\errors.log";

                using (StreamWriter sr = new StreamWriter(filePath, true, System.Text.Encoding.UTF8)) 
                {
                    if (!string.IsNullOrEmpty(desc))
                    {
                        msg = msg + "Event description: " + desc;
                    }

                    msg = msg + Environment.NewLine + "Event timestamp: " + timestamp.ToString("M/dd/yyyy H:mm tt");

                    if (!string.IsNullOrEmpty(longDesc))
                    {
                        msg = msg + Environment.NewLine + "Event long description: " + longDesc;
                    }
                    if (!string.IsNullOrEmpty(source))
                    {
                        msg = msg + Environment.NewLine + "Source: " + source;
                    }
                    if (!string.IsNullOrEmpty(process))
                    {
                        msg = msg + Environment.NewLine + "Process: " + process;
                    }
                    if (!string.IsNullOrEmpty(tag))
                    {
                        msg = msg + Environment.NewLine + "Tag: " + tag;
                    }

                    sr.Write(msg + Environment.NewLine + Environment.NewLine);
                }
            }
            catch (Exception ex)
            {
                msg = ex.Message.Trim();

                if (!string.IsNullOrEmpty(desc))
                {
                    msg = msg + Environment.NewLine + "Event description: " + desc;
                }

                msg = msg + Environment.NewLine + "Event timestamp: " + timestamp.ToString("M/dd/yyyy H:mm yy");

                if (!string.IsNullOrEmpty(longDesc))
                {
                    msg = msg + Environment.NewLine + "Event long description: " + longDesc;
                }
                if (!string.IsNullOrEmpty(source))
                {
                    msg = msg + Environment.NewLine + "Source: " + source;
                }
                if (!string.IsNullOrEmpty(process))
                {
                    msg = msg + Environment.NewLine + "Process: " + process;
                }
                if (!string.IsNullOrEmpty(tag))
                {
                    msg = msg + Environment.NewLine + "Tag: " + tag;
                }

                //WriteOSEventLog("Application", msg, "", EventLogEntryType.Error);
            }
        }

        #endregion

        #region Private methods

        private static void SetPaths(ref Directory dir)
        {
            Directory newDir;
            IEnumerable<BookmarkItem> items = dir.BookmarkItems.Where(x => x.ItemType == BookmarkItem.ItemTypes.Directory);

            foreach (BookmarkItem item in items)
            {
                if (item.ItemType == BookmarkItem.ItemTypes.Directory)
                {
                    item.Path = dir.Path + "\\" + item.Name;
                    newDir = (Directory)item;
                    SetPaths(ref newDir);
                }
            }
        }

        #endregion
    }
}