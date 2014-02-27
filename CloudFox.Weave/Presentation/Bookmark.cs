namespace CloudFox.Presentation
{
    public class Bookmark: BookmarkItem
    {
        public Bookmark(string name, string location)
        {
            Name = name;
            Location = location;
            base.ItemType = BookmarkItem.ItemTypes.Bookmark;
        }

        public override BookmarkItem.ItemTypes ItemType
        {
            get { return base.ItemType; }

            // Do nothing, since the type of this item should not be changed 
            // once it is created
            set { }
        }
    }
}
