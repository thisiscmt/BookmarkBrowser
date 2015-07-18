Bookmark Browser
===============
This web application is for accessing Firefox Sync bookmarks from a mobile device that currently isn't supported by Firefox. It mimics the functionality of the former Firefox Home iOS app. My inspiration for it was a bug in Firefox Home that caused it to randomly re-arrange my bookmark ordering after I would add a new one from my laptop. It was also an exercise in learning some new web tools and frameworks.

The app has the following features:
* Uses the Sync 1.5 API
* Stores your Sync credentials in the browser's local storage to make refreshing the data easier
* Stores all data in local storage for faster navigation through your bookmark hierarchy
* Can refresh bookmark data upon startup
* Can navigate to the last viewed directory upon startup

It uses the following libraries:
* [jQuery](http://jquery.com)
* [jQuery Mobile](http://jquerymobile.com)
* [KnockoutJS](http://knockoutjs.com)
* [FxSyncNet](https://github.com/pieterderycke/fxsyncnet), a wrapper for accessing Mozilla's Sync API, which I modified slightly
* [Moment.js](http://momentjs.com)

I also want to thank [kentbye](http://github.com/kentbye) for resurrecting the color swatches from older versions of jQuery Mobile and [incorporating them](http://github.com/kentbye/jquery-mobile-five-swatches-theme) into the default theme for version 1.4.

A live version can be found at [https://cmtybur.com/bmb](https://cmtybur.com/bmb)
