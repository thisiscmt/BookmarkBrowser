Bookmark Browser
===============
This web application is for accessing Firefox Sync bookmarks from a mobile device that currently isn't supported by Firefox. It mimics the functionality of the former Firefox Home iOS app. My inspiration for it was a bug in Firefox Home that caused it to randomly re-arrange bookmark directories when I would add a new bookmark from my laptop. It was also an exercise in learning various web tools and frameworks.

The app has the following features:
* Stores your Sync credentials and key in the browser's local storage to make refreshing the data easier
* Stores all data in local storage for faster navigation through your bookmark structure

It uses the following open source libraries:
* [jQuery Mobile](http://jquerymobile.com)
* [KnockoutJS](http://knockoutjs.com)
* [CloudFox](http://cloudfox.codeplex.com), only the wrapper for accessing Mozilla's Sync API, which I modified slightly
* [Json.NET](http://json.codeplex.com)
