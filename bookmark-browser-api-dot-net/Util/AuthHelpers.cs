using System.Text;
using Newtonsoft.Json;

using BookmarkBrowserAPI.Models;

namespace BookmarkBrowserAPI.Util
{
    public class AuthHelpers
    {
        private static readonly string USER_FILE = "users.dat";

        public static Credential? GetAutenticationCredentials(string authHeader)
        {
            Encoding encoding;
            Credential? creds = null;
            string decodedCreds;
            int index;

            if (authHeader.StartsWith("Basic"))
            {
                try
                {
                    encoding = Encoding.GetEncoding("iso-8859-1");
                    index = authHeader.IndexOf(" ");
                    decodedCreds = encoding.GetString(Convert.FromBase64String(authHeader[(index + 1)..]));
                    index = decodedCreds.IndexOf(':');

                    creds = new Credential
                    {
                        Username = decodedCreds.Substring(0, index),
                        Password = decodedCreds.Substring(index + 1)
                    };
                }
                catch (Exception ex)
                {
                    ServiceHelpers.WriteEvent(ex.Message, DateTime.Now, ex.ToString(), "AuthHelpers", "GetAutenticationCredentials");
                }
            }

            return creds;
        }

        public static User? GetUser(string userName)
        {
            List<User>? users;
            User? user = null;

            var dataPath = AppDomain.CurrentDomain.GetData("AppDataPath");

            if (dataPath != null)
            {
                string filePath = Path.Combine((string)dataPath, USER_FILE);
                string userData;

                try
                {
                    userData = File.ReadAllText(filePath, Encoding.UTF8);
                    users = JsonConvert.DeserializeObject<List<User>>(userData);

                    if (users != null)
                    {
                        foreach (User knownUser in users)
                        {
                            if (knownUser.Username == userName)
                            {
                                user = knownUser;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    ServiceHelpers.WriteEvent(ex.Message, DateTime.Now, ex.ToString(), "AuthHelpers", "GetUser");
                }
            }

            return user;
        }

        public static bool ValidUser(User user, Credential creds)
        {
            bool valid = false;

            if (user != null && creds != null && user.Password == creds.Password)
            {
                valid = true;
            }

            return valid;
        }
    }
}
