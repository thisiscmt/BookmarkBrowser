using System;
using System.Net;
using System.Threading;
using System.IO;

namespace CloudFox.Weave.Util
{
    /// <summary>
    /// Static extension methods to solve the problem that WP7 and Silverlight don't support
    /// synchronous methods to access resource on the netwerk.
    /// </summary>
    public static class WebRequestExtensions
    {
        public static WebResponse GetResponse(this WebRequest request)
        {
            AutoResetEvent autoResetEvent = new AutoResetEvent(false);

            IAsyncResult asyncResult = request.BeginGetResponse(r => autoResetEvent.Set(), null);

            // Wait until the call is finished
            autoResetEvent.WaitOne();

            return request.EndGetResponse(asyncResult);
        }

        public static Stream GetRequestStream(this WebRequest request)
        {
            AutoResetEvent autoResetEvent = new AutoResetEvent(false);

            IAsyncResult asyncResult = request.BeginGetRequestStream(r => autoResetEvent.Set(), null);

            // Wait until the call is finished
            autoResetEvent.WaitOne();

            return request.EndGetRequestStream(asyncResult);
        }
    }
}
