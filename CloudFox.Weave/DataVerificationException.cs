using System;

namespace CloudFox.Weave
{
    /// <summary>
    /// This exception indicates that the downloaded data from the Weave serves
    /// has an incorrect fingerprint.
    /// </summary>
    public class DataVerificationException : Exception
    {
        public DataVerificationException(string message)
            : base(message)
        {
        }

        public DataVerificationException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
