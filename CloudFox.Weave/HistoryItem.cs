using System;
using System.Net;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace CloudFox.Weave
{
    public class HistoryItem
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("histUri")]
        public string Uri { get; set; }

        [JsonProperty("visits")]
        public IEnumerable<Visit> Visits { get; set; }
    }
}
