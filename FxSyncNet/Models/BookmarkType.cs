using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FxSyncNet.Models
{
    public enum BookmarkType
    {
        Bookmark,
        Query,
        Separator,
        Folder,
        Livemark,
        // 'Item' is needed to handle records that for some reason show up in the bookmark collection.
        // Without it we would get JSON serialization exceptions.
        Item
    }
}
