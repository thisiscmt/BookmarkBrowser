using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using CloudFox.Weave.Util;

namespace CloudFox.Weave
{
    public class Bookmark
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("bmkUri")]
        public string Uri { get; set; }

        [JsonProperty("parentName")]
        public string ParentName { get; set; }

        [JsonProperty("parentid")]
        public string ParentId { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("tags")]
        public string[] Tags { get; set; }

        [JsonProperty("keyword")]
        public string Keyword { get; set; }

        [JsonProperty("type")]
        [JsonConverter(typeof(BookmarkTypeJsonConverter))]
        public BookmarkType BookmarkType { get; set; }

        [JsonProperty("children")]
        public string[] Children { get; set; }
    }
}
