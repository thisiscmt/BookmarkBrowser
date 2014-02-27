using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using CloudFox.Weave.Util;

namespace CloudFox.Weave
{
    public class WeaveBasicObject
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("parentid")]
        public string ParentId { get; set; }

        [JsonProperty("predecessorid")]
        public string PredecessorId { get; set; }

        [JsonProperty("modified")]
        [JsonConverter(typeof(WeaveJsonDateTimeConverter))]
        public DateTime Modified { get; set; }

        [JsonProperty("sortindex")]
        public int SortIndex { get; set; }

        [JsonProperty("payload")]
        public string Payload { get; set; }

        [JsonProperty("ttl")]
        public int TimeToLive { get; set; }
    }
}
