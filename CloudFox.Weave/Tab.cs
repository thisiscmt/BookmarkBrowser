using System;
using Newtonsoft.Json;

namespace CloudFox.Weave
{
    public class Tab
    {
        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("urlHistory")]
        public string[] UrlHistory { get; set; }

        [JsonProperty("icon")]
        public string Icon { get; set; }

        [JsonProperty("lastUsed")]
        public long LastUsed { get; set; }
    }
}
