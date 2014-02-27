using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using CloudFox.Weave.Util;

namespace CloudFox.Weave
{
    public class EncryptedDataObject
    {
        [JsonProperty("ciphertext")]
        public string CipherText { get; set; }

        [JsonProperty("IV")]
        [JsonConverter(typeof(Base64JsonConverter))]
        public byte[] InitialisationVector { get; set; }

        [JsonProperty("hmac")]
        [JsonConverter(typeof(HexStringJsonConverter))]
        public byte[] Hmac { get; set; }
    }
}
