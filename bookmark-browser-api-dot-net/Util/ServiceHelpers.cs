namespace BookmarkBrowserAPI.Util
{
    public class ServiceHelpers
    {
        #region Public methods
        public static string EnsureBackslash(string value)
        {
            string retVal = value;

            if (value != null)
            {
                if (!value.EndsWith("\\"))
                {
                    retVal = value + "\\";
                }
            }

            return retVal;
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

        public static void WriteEvent(string desc, DateTime timestamp, string longDesc = "", string source = "", string process = "", string tag = "")
        {
            string msg = string.Empty;
            string filePath;
            string? dirPath;

            try
            {
                var logPath = AppDomain.CurrentDomain.GetData("LogPath");

                if (logPath is null)
                {
                    return;
                }

                filePath = Path.Combine((string)logPath, "errors.log");
                dirPath = Path.GetDirectoryName(filePath);

                if (dirPath != null && !System.IO.Directory.Exists(dirPath))
                {
                    System.IO.Directory.CreateDirectory(dirPath);
                }

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
    }
}