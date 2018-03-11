Bookmark Browser
===============
This web application is for accessing Firefox Sync bookmarks from a mobile device. It mimics the functionality of the former Firefox Home iOS app. My inspiration for it was a bug in Firefox Home that caused it to randomly re-arrange my bookmark ordering after I would add a new one from my desktop machine or laptop. Version 1.0 was built on KnockoutJS and curently lives in the BookmarkBrowser subdirectory. The BookmarkBrowserAPI and BookmarkBrowser UI subdirectorires contain version 2.0, which is based on AngularJS and is currently a work in progress.

Version 2.0 has the following features:
* Allows uploading of a bookmark backup file from Firefox (.json) to a server, then downloading to the client
* Stores all bookmark data in local storage for faster navigation through your bookmark hierarchy
* Can navigate to the last viewed directory upon startup

It uses the following libraries:
* [AngularJS](http://angularjs.org)
* [ui-router](https://github.com/angular-ui/ui-router)
* [ng-file-upload](https://github.com/danialfarid/ng-file-upload)
* [ngStorage](https://github.com/gsklee/ngStorage)
* [Gulp](https://gulpjs.com)


For those interested: yes, Mozilla has developed a version of [Firefox for iOS](https://www.mozilla.org/en-US/firefox/ios). Unfortunately, I'm disappointed at how user-unfriendly it is: opening new tabs is cumbersome, as is scrolling through your bookmark hierarchy to find the one you want. It's just not nearly as easy to use as mobile Safari.