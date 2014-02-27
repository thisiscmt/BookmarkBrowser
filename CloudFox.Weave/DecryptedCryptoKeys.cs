using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace CloudFox.Weave
{
    public class DecryptedCryptoKeys
    {
        [JsonProperty("default")]
        public string[] Default { get; set; }

        [JsonProperty("collection")]
        public string Collection { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }
    }
}
