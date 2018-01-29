using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BookmarkBrowser.API.Models
{
    public class ResultViewModel
    {
        public ResultViewModel()
        {
            this.ResponseData = null;
        }

        public ResultViewModel(string data)
        {
            this.ResponseData = data;
        }

        [JsonProperty("responseData")]
        public string ResponseData { get; set; }
    }
}