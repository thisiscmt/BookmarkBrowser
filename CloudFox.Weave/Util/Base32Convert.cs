using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CloudFox.Weave.Util
{
    public static class Base32Convert
    {
        private const string Base32Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

        private const int Base32MaximumLookup = 43;
        private static Dictionary<char, byte> base32Lookup = new Dictionary<char, byte>() 
        { 
            { '0', 0xFF },
            { '1', 0xFF },
            { '2', 0x1A },
            { '3', 0x1B },
            { '4', 0x1C },
            { '5', 0x1D },
            { '6', 0x1E },
            { '7', 0x1F },
            { '8', 0xFF },
            { '9', 0xFF },
            { ':', 0xFF },
            { ';', 0xFF },
            { '<', 0xFF },
            { '=', 0xFF },
            { '>', 0xFF },
            { '?', 0xFF },
            { '@', 0xFF },
            { 'A', 0x00 },
            { 'B', 0x01 },
            { 'C', 0x02 },
            { 'D', 0x03 },
            { 'E', 0x04 },
            { 'F', 0x05 },
            { 'G', 0x06 },
            { 'H', 0x07 },
            { 'I', 0x08 },
            { 'J', 0x09 },
            { 'K', 0x0A },
            { 'L', 0x0B },
            { 'M', 0x0C },
            { 'N', 0x0D },
            { 'O', 0x0E },
            { 'P', 0x0F },
            { 'Q', 0x10 },
            { 'R', 0x11 },
            { 'S', 0x12 },
            { 'T', 0x13 },
            { 'U', 0x14 },
            { 'V', 0x15 },
            { 'W', 0x16 },
            { 'X', 0x17 },
            { 'Y', 0x18 },
            { 'Z', 0x19 }
        };

        public static byte[] FromBase32String(string input)
        {
            int index = 0;
            int offset = 0;
            byte[] buffer = new byte[DecodeBase32Length(input)];

            input = input.ToUpperInvariant();

            for (int i = 0; i < input.Length; i++)
            {
                char currentChar = input[i];
                int lookup = currentChar - '0';
                byte word;

                if (lookup < 0 && lookup >= Base32MaximumLookup)
                    word = 0xFF;
                else
                    word = base32Lookup[currentChar];

                // If this word is not in the table, ignore it
                if (word == 0xFF)
                    continue;

                if (index <= 3)
                {
                    index = (index + 5) % 8;
                    if (index == 0)
                    {
                        buffer[offset] |= word;
                        offset++;
                    }
                    else
                        buffer[offset] |= (byte)(word << (8 - index));
                }
                else
                {
                    index = (index + 5) % 8;
                    buffer[offset] |= (byte)((word >> index));
                    offset++;

                    buffer[offset] |= (byte)(word << (8 - index));
                }
            }

            return buffer;
        }

        public static byte[] UserfriendlyBase32Decoding(string input)
        {
            input = input.Replace('8', 'l').Replace('9', 'o');
            return FromBase32String(input);
        }

        public static string ToBase32String(byte[] data)
        {
            if (data.Length == 0)
                return "";

            StringBuilder result = new StringBuilder();
            int index = 0;
            byte word;

            for (int i = 0; i < data.Length; )
            {
                // Is the current word going to span a byte boundary?
                if (index > 3)
                {
                    word = (byte)(data[i] & (0xFF >> index));
                    index = (index + 5) % 8;
                    word <<= index;
                    if (i < data.Length - 1)
                        word |= (byte)(data[i + 1] >> (8 - index));

                    i++;
                }
                else
                {
                    word = (byte)((data[i] >> (8 - (index + 5))) & 0x1F);
                    index = (index + 5) % 8;
                    if (index == 0)
                        i++;
                }

                result.Append(Base32Characters[word]);
            }

            switch (data.Length % 5)
            {
                case 1:
                    result.Append("======");
                    break;
                case 2:
                    result.Append("====");
                    break;
                case 3:
                    result.Append("===");
                    break;
                case 4:
                    result.Append("=");
                    break;
            }

            return result.ToString();
        }

        private static int DecodeBase32Length(string input)
        {
            return (int)Math.Round(((input.Length * 5) / 8.0) + 0.5);
        }
    }
}
