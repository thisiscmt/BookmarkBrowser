using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CloudFox.Weave;
using System.Data.SqlClient;
using System.Configuration;
using System.Data.Common;
using System.IO;

namespace BookmarkBrowser
{
    public static class BookmarkBrowserCommon
    {
        public static WeaveProxy BuildClient(string userName, string password, string syncKey)
        {
            string tag = "";

            try
            {
                var comm = new HttpCommunicationChannel();
                return new WeaveProxy(comm, userName, password, syncKey);
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    tag = ex.InnerException.ToString();
                }

                WriteEvent(ex.Message, DateTime.Now, ex.ToString(), ex.Source, "BuildClient", tag);
                throw;
            }
        }

        public static CloudFox.Presentation.Directory LoadBookmarks(WeaveProxy client)
        {
            string tag = "";
            int count;

            try
            {
                var lstRoot = client.DecryptPayload<Bookmark>(client.GetCollection("bookmarks", null, null, null, -1, -1, CloudFox.Weave.SortOrder.Index));
                CloudFox.Presentation.Directory mainDir = CloudFox.Presentation.BookmarksStructureBuilder.Build(lstRoot);
                count = lstRoot.Where(x => x.BookmarkType == BookmarkType.Bookmark).Count();
                mainDir.Tag = count.ToString();

                return mainDir;
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    tag = ex.InnerException.ToString();
                }

                WriteEvent(ex.Message, DateTime.Now, ex.ToString(), ex.Source, "LoadBookmarks", tag);
                throw;
            }
        }

        public static void WriteEvent(string desc, DateTime timestamp, string longDesc = "", string source = "", 
                                      string process = "", string tag = "")
        {
            string msg = string.Empty;
            string filePath;

            try
            {
                filePath = HttpContext.Current.Request.MapPath("/") + "Log\\errors.log";

                using (StreamWriter sr = new StreamWriter(filePath, true, System.Text.Encoding.UTF8)) 
                {
                    if (!string.IsNullOrEmpty(desc))
                    {
                        msg = msg + "Event description: " + desc;
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
    }
}
