Bookmark Browser
===============
This web application is for accessing Firefox Sync bookmarks from a mobile device. It mimics the functionality of the former Firefox Home iOS app. My 
inspiration for it was a bug in Firefox Home that caused it to randomly re-arrange my bookmark ordering after I would add a new one from my desktop 
machine or laptop. Version 1.0 was built on [KnockoutJS](http://knockoutjs.com/) and used the [FxSyncNet](https://github.com/pieterderycke/FxSyncNet) wrapper to access Sync storage directly. Version 2.0 is based on AngularJS 
and doesn't attempt to connect to any Sync APIs. The issue I kept running into was Mozilla would constantly change the login API such that I couldn't
authenticate unattended. They say that eventually there will be a nicer way for third-party apps to authenticate a Firefox account so they can access
Sync data (via OAuth), but I didn't want to wait around. If they eventually offer such a way, I might reconsider using it to access the bookmark collection directly again. It would also be nice to
be able to insert a new bookmark via the app.

Version 2 has the following features:
* Allows uploading of a bookmark backup file from Firefox (.json) to a server, then downloading to the client
* Stores all bookmark data in local storage for faster navigation through your bookmark hierarchy
* Can navigate to the last viewed directory upon startup

It uses the following libraries:
* [AngularJS](http://angularjs.org)
* [ui-router](https://github.com/angular-ui/ui-router)
* [ng-file-upload](https://github.com/danialfarid/ng-file-upload)
* [ngStorage](https://github.com/gsklee/ngStorage)
* [Gulp](https://gulpjs.com)


Postscript: Yes, Mozilla has developed a version of [Firefox for iOS](https://www.mozilla.org/en-US/firefox/mobile). Unfortunately, I'm disappointed at how user-unfriendly it is: opening new tabs is cumbersome, as is scrolling through your bookmark hierarchy to find the one you want. It's just not nearly as easy to use as mobile Safari.