using System;
using System.Net;

namespace CloudFox.Weave
{
    /// <summary>
    /// Represents the transition type of the visit.
    /// </summary>
    public enum TransitionType
    {
        /// <summary>
        /// This transition type means the user followed a link and got a new toplevel window.
        /// </summary>
        Link = 1,

        /// <summary>
        /// This transition type is set when the user typed the URL to get to the page.
        /// </summary>
        Typed = 2,

        /// <summary>
        /// This transition type is set when the user followed a bookmark to get to the page.
        /// </summary>
        Bookmark = 3,

        /// <summary>
        /// This transition type is set when some inner content is loaded. This is true of all images on a page, 
        /// and the contents of the iframe. It is also true of any content in a frame, regardless if whether or 
        /// not the user clicked something to get there.
        /// </summary>
        Embed = 4,

        /// <summary>
        /// This transition type is set when the transition was a permanent redirect.
        /// </summary>
        RedirectPermanent = 5,

        /// <summary>
        /// This transition type is set when the transition was a temporary redirect.
        /// </summary>
        RedirectTemporary = 6,

        /// <summary>
        /// This transition type is set when the transition is a download.
        /// </summary>
        Download = 7,

        /// <summary>
        /// This transition type is set when the user followed a link that loaded a page in a frame.
        /// </summary>
        FramedLink = 8
    }
}
