using System;
using System.Collections.Generic;

namespace CloudFox.Presentation
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

        // Parent was changed to a string to avoid circular reference issues 
        // when serializing a Directory to JSON. Plus the full Directory object
        // for a given item's parent isn't really needed
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
