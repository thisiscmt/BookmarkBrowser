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
            this.Data = null;
        }

        public ResultViewModel(string data)
        {
            this.Data = data;
        }

        public string Data { get; set; }
    }
}