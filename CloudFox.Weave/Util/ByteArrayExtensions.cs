using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Cryptography;

namespace CloudFox.Weave.Util
{
    public static class ByteArrayExtensions
    {
        private const int SHA256_DIGEST_LENGTH = 32;

        /// <summary>
        /// C# version of the Objective-C algorithm found in Firefox Home.
        /// </summary>
        /// <param name="key"></param>
        /// <param name="info"></param>
        /// <param name="length"></param>
        /// <returns></returns>
        public static byte[] HDKFSHA256ExpandWithInfo(this byte[] key, byte[] info, int length)
        {
            int iterations = (length + SHA256_DIGEST_LENGTH - 1) / SHA256_DIGEST_LENGTH;

            byte[] tr = new byte[iterations * SHA256_DIGEST_LENGTH];

            byte[] tn = new byte[0];
            byte[] tnSha = new byte[0];
            int lengthCopied = 0;

            using (HMACSHA256 hmacSha256 = new HMACSHA256(key))
            {
                for (int i = 0; i < iterations; i++)
                {
                    tn = new byte[tnSha.Length + info.Length + 1];
                    Array.Copy(tnSha, 0, tn, 0, tnSha.Length);
                    Array.Copy(info, 0, tn, tnSha.Length, info.Length);
                    tn[tnSha.Length + info.Length] = (byte) (i + 1);
                    tnSha = hmacSha256.ComputeHash(tn);

                    Array.Copy(tnSha, 0, tr, lengthCopied, tnSha.Length);
                    lengthCopied += tnSha.Length;
                }
            }

            byte[] result = new byte[length];
            Array.Copy(tr, result, length);
            return result;
        }
    }
}
