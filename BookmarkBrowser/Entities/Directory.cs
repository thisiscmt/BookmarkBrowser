using System;
using System.Collections.Generic;

namespace BookmarkBrowser.Entities
{
    public class Directory: BookmarkItem
    {
        public Directory(string name, string id)
        {
            Name = name;
            Id = id;
            BookmarkItems = new List<BookmarkItem>();
            base.ItemType = BookmarkItem.ItemTypes.Directory;
            base.Location = "#";
        }

        public string Parent { get; set; }

        public IList<BookmarkItem> BookmarkItems { get; set; }

        public override BookmarkItem.ItemTypes ItemType
        {
            get { return base.ItemType; }

            // Do nothing, since the type of this item should not be changed 
            // once it is created
            set { }
        }
    }
}
