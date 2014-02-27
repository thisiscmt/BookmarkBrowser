using System;
using System.Net;
using Newtonsoft.Json;
using CloudFox.Weave.Util;

namespace CloudFox.Weave
{
    public class Visit
    {
        [JsonProperty("date")]
        [JsonConverter(typeof(DateTimeJsonConverter))]
        public DateTime Date { get; set; }

        [JsonProperty("type")]
        public TransitionType TransitionType { get; set; }
    }
}
