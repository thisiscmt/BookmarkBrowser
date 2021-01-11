using System.Collections.Generic;

using Newtonsoft.Json;

namespace BookmarkBrowser.API.Models
{
    public class Bookmark
    {
        public Bookmark() {}

        [JsonProperty("guid")]
        public string GUID { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("index")]
        public int Index { get; set; }

        [JsonProperty("dateAdded")]
        public long DateAdded { get; set; }

        [JsonProperty("lastModified")]
        public long LastModified { get; set; }

        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("root")]
        public string Root { get; set; }

        [JsonProperty("children")]
        public List<Bookmark> Children { get; set; }

        [JsonProperty("uri")]
        public string URI { get; set; }

        [JsonProperty("iconuri")]
        public string IconURI { get; set; }

        [JsonProperty("path")]
        public string Path { get; set; }
    }
}
