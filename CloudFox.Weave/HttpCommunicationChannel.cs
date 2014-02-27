using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using System.Threading;
using CloudFox.Weave.Util;

namespace CloudFox.Weave
{
    public class HttpCommunicationChannel : ICommunicationChannel
    {
        private NetworkCredential credential;

        #region Methods
        /// <summary>
        /// Initialize the communication channel with the provided user name and password.
        /// </summary>
        /// <param name="userName">The user name required to initialize the connection.</param>
        /// <param name="password">The password required to initialize the connection.</param>
        public void Initialize(string userName, string password)
        {
            if(credential != null)
                throw new InvalidOperationException("The communication channel was already initialized.");

            if (userName == null)
                throw new ArgumentNullException("userName");

            if(password == null)
                throw new ArgumentNullException("password");

            credential = new NetworkCredential(userName, password);
        }

        public string Execute(string url, RestOperation operation)
        {
            return Execute(url, operation, null);
        }

        public string Execute(string url, RestOperation operation, string payload)
        {
            if (credential == null)
                throw new InvalidOperationException("The communication channel is not initialized.");

            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
            request.Credentials = credential;

            HttpWebResponse response;
            switch (operation)
            {
                case RestOperation.Get:
                    request.Method = "GET";
                    response = ExecuteOperation(request);
                    break;
                case RestOperation.Delete:
                    request.Method = "DELETE";
                    response = ExecuteOperation(request);
                    break;
                //case RestOperation.Put:
                //    request.Method = "PUT";
                //    response = ExecuteOperation(request);

                //    break;
                default:
                    throw new ArgumentException("Unsupported REST operation.", "operation");
            }

            using (StreamReader reader = new StreamReader(response.GetResponseStream()))
            {
                return reader.ReadToEnd();
            }
        }
        #endregion

        #region Private functions
        private HttpWebResponse ExecuteOperation(HttpWebRequest request)
        {
            try
            {
                return (HttpWebResponse)request.GetResponse();
            }
            catch (WebException ex)
            {
                if (ex.Response == null)
                {
                    throw;
                }
                else
                {
                    // Map http error status codes to the correct .Net exception
                    HttpWebResponse response = (HttpWebResponse)ex.Response;

                    switch (response.StatusCode)
                    {
                        case HttpStatusCode.Unauthorized:
                            throw new UnauthorizedAccessException("The provided username and/or password are incorrect.", ex);
                        case HttpStatusCode.NotFound:
                            throw new DataNotFoundException("No data available on address \"" + request.RequestUri + "\".", ex);
                        default:
                            throw;
                    }
                }
            }
        }
        #endregion
    }
}
