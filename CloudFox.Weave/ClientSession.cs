using System;
using Newtonsoft.Json;

namespace CloudFox.Weave
{
    public class ClientSession
    {
        [JsonProperty("clientName")]
        public string ClientName { get; set; }

        [JsonProperty("tabs")]
        public Tab[] OpenTabs { get; set; }
    }
}
