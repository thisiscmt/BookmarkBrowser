using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CloudFox.Weave.Util;

namespace CloudFox.Weave
{
    public class WeaveKeys
    {
        public WeaveKeys(byte[] key, string userName)
        {
            string info = "Sync-AES_256_CBC-HMAC256" + userName;
            byte [] data = key.HDKFSHA256ExpandWithInfo(Encoding.UTF8.GetBytes(info), 32 * 2);

            CryptoKey = new byte[32];
            Array.Copy(data, 0, CryptoKey, 0, 32);

            HmacKey = new byte[32];
            Array.Copy(data, 32, HmacKey, 0, 32);
        }

        public byte[] CryptoKey { get; private set; }
        public byte[] HmacKey { get; private set; }
    }
}
