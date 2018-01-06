using BookmarkBrowser.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BookmarkBrowser.API.Models
{
    public class BookmarkData
    {
        [JsonProperty("bookmarkToolbar")]
        public Directory BookmarkToolbar { get; set; }

        [JsonProperty("bookmarkMenu")]
        public Directory Bookmarks { get; set; }
    }
}