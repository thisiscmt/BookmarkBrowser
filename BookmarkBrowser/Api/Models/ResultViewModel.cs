using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BookmarkBrowser.Api.Models
{
    public class ResultViewModel
    {
        public ResultViewModel()
        {
            this.Content = string.Empty;
        }

        public ResultViewModel(string content)
        {
            this.Content = content;
        }

        public string Content { get; set; }
    }
}