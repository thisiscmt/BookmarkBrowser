using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BookmarkBrowser.API.Models
{
    public class Bookmark
    {
        public Bookmark() {}

        [JsonPropertyName("guid")]
        public string GUID { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("index")]
        public int Index { get; set; }

        [JsonPropertyName("dateAdded")]
        public long DateAdded { get; set; }

        [JsonPropertyName("lastModified")]
        public long LastModified { get; set; }

        [JsonPropertyName("id")]
        public int ID { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; }

        [JsonPropertyName("root")]
        public string Root { get; set; }

        [JsonPropertyName("children")]
        public List<Bookmark> Children { get; set; }

        [JsonPropertyName("uri")]
        public string URI { get; set; }

        [JsonPropertyName("iconuri")]
        public string IconURI { get; set; }

        [JsonPropertyName("path")]
        public string Path { get; set; }
    }
}
