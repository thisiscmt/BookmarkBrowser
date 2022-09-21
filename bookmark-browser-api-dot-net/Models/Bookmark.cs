using Newtonsoft.Json;

using BookmarkBrowserAPI.Enums;

namespace BookmarkBrowserAPI.Models
{
    public class Bookmark
    {
        public Bookmark()
        {
            Title = "";
            Uri = "";
            IconUri = "";
            Tags = "";
            Id = "";
            Guid = "";
            Type = "";
            Keyword = "";
            Root = "";
            Path = "";
            Children = new List<Bookmark>();
        }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("index")]
        public int Index { get; set; }

        [JsonProperty("dateAdded")]
        public long DateAdded { get; set; }

        [JsonProperty("lastModified")]
        public long LastModified { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("guid")]
        public string Guid { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("typeCode")]
        public Enums.TypeCode TypeCode { get; set; }

        [JsonProperty("uri")]
        public string Uri { get; set; }

        [JsonProperty("iconuri")]
        public string IconUri { get; set; }

        [JsonProperty("tags")]
        public string Tags { get; set; }

        [JsonProperty("keyword")]
        public string Keyword { get; set; }

        [JsonProperty("root")]
        public string Root { get; set; }

        [JsonProperty("path")]
        public string Path { get; set; }

        [JsonProperty("children")]
        public IList<Bookmark> Children { get; set; }
    }
}
