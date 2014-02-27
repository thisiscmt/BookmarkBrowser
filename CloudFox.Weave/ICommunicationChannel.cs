using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace CloudFox.Weave
{
    public interface ICommunicationChannel
    {
        void Initialize(string userName, string password);
        string Execute(string url, RestOperation operation);
        string Execute(string url, RestOperation operation, string payload);
    }
}
