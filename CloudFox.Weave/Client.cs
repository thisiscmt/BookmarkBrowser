using System;
using System.Net;
using Newtonsoft.Json;

namespace CloudFox.Weave
{
    public class Client
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }
    }
}
