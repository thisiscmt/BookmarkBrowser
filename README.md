Bookmark Browser
===============
This web application is for accessing Firefox Sync bookmarks from a mobile device. It mimics the functionality of the former Firefox Home iOS app. My inspiration for it was a bug in Firefox Home that caused it to randomly re-arrange my bookmark ordering after I would add a new one from my desktop machine or laptop. It was also an exercise in learning some new web tools and frameworks.

The app has the following features:
* Uses the Sync 1.5 API
* Stores your Sync credentials in the browser's local storage to make refreshing the data easier
* Stores all data in local storage for faster navigation through your bookmark hierarchy
* Can navigate to the last viewed directory upon startup

It uses the following libraries:
* [jQuery](http://jquery.com)
* [jQuery Mobile](http://jquerymobile.com)
* [KnockoutJS](http://knockoutjs.com)
* [FxSyncNet](https://github.com/pieterderycke/fxsyncnet), a wrapper for accessing Mozilla's Sync API, which I modified slightly
* [Moment.js](http://momentjs.com)

I also want to thank [kentbye](http://github.com/kentbye) for resurrecting the color swatches from older versions of jQuery Mobile and [incorporating them](http://github.com/kentbye/jquery-mobile-five-swatches-theme) into the default theme for version 1.4.

A live version can be found at [https://cmtybur.com/bmb](https://cmtybur.com/bmb)

Postscript: Mozilla has now developed a version of [Firefox for iOS](https://www.mozilla.org/en-US/firefox/ios). Unfortunately, I'm disappointed at how user-unfriendly it is: opening new tabs is cumbersome, as is scrolling through your bookmark hierarchy to find the one you want. It's just not nearly as easy to use as mobile Safari, so I'll be sticking to my app.
