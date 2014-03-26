Bookmark Browser
===============
This web application is for accessing Firefox Sync bookmarks from a mobile device that currently isn't supported by Firefox. It mimics the functionality of the former Firefox Home iOS app. My inspiration for it was a bug in Firefox Home that caused it to randomly re-arrange bookmark directories when I would add a new bookmark from my laptop. It was also an exercise in learning various web tools and frameworks.

The app has the following features:
* Stores your Sync credentials and key in the browser's local storage to make refreshing the data easier
* Stores all data in local storage for faster navigation through your bookmark structure
* Can refresh bookmark data upon startup
* Can navigate to the last viewed directory upon startup

It uses the following open source libraries:
* [jQuery](http://jquery.com)
* [jQuery Mobile](http://jquerymobile.com)
* [KnockoutJS](http://knockoutjs.com)
* [CloudFox](http://cloudfox.codeplex.com), only the wrapper for accessing Mozilla's Sync API, which I modified slightly
* [DateJS](http://www.datejs.com)

I also want to thank [kentbye](http://github.com/kentbye) for resurrecting the color swatches from older versions of jQuery Mobile and [incorporating them](http://github.com/kentbye/jquery-mobile-five-swatches-theme) into the default theme for version 1.4.

A live version can be found at [cmtybur.com/bmb](http://cmtybur.com/bmb)
