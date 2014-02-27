using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CloudFox.Weave
{
    public class UnsupportedServerStorageVersionException : Exception
    {
        public UnsupportedServerStorageVersionException(string message)
            : base(message)
        {
        }

        public UnsupportedServerStorageVersionException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
