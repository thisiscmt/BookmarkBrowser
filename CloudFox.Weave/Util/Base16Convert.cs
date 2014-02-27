using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CloudFox.Weave.Util
{
    public static class Base16Convert
    {
        public static byte[] FromBase16String(string input)
        {
            return Enumerable.Range(0, input.Length).
                   Where(x => 0 == x % 2).
                   Select(x => Convert.ToByte(input.Substring(x, 2), 16)).
                   ToArray();
        }
    }
}
